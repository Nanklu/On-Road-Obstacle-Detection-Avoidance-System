import base64
import os
import subprocess
import tempfile
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import cv2
import imageio_ffmpeg
import numpy as np
from ultralytics import YOLO

DEFAULT_MODEL_WEIGHTS = "yolov8n.pt"
LOCAL_MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / DEFAULT_MODEL_WEIGHTS

INTERESTING_LABELS = {
    "person", "bicycle", "car", "motorbike", "bus", "truck",
    "dog", "cat", "motorcycle",
}

BOX_COLOR = (0, 0, 255)       # Red in BGR
TEXT_BG_COLOR = (0, 0, 180)
TEXT_COLOR = (255, 255, 255)


def load_model(weights_path: Optional[str] = None) -> YOLO:
    if weights_path:
        model_path = Path(weights_path)
    elif LOCAL_MODEL_PATH.exists():
        model_path = LOCAL_MODEL_PATH
    else:
        model_path = Path(DEFAULT_MODEL_WEIGHTS)
    return YOLO(str(model_path))


def bytes_to_bgr_image(image_bytes: bytes) -> np.ndarray:
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image bytes.")
    return img


def _estimate_distance(box_height: float, frame_height: float) -> str:
    """NEAR = too close (danger), MID = getting close, FAR = safe."""
    ratio = box_height / frame_height
    if ratio > 0.32:
        return "NEAR"   # vehicle/pedestrian too close - triggers danger
    elif ratio > 0.14:
        return "MID"
    return "FAR"


def _draw_detections(frame: np.ndarray, results, frame_h: int) -> List[Dict[str, Any]]:
    """
    Draw red bounding boxes with label, confidence, and distance on the frame.
    Returns the list of detection dicts.
    """
    detections: List[Dict[str, Any]] = []
    h, w = frame.shape[:2]

    for box in results.boxes:
        cls_id = int(box.cls[0])
        label = results.names.get(cls_id, str(cls_id))
        conf = float(box.conf[0])

        if label not in INTERESTING_LABELS:
            continue

        x1, y1, x2, y2 = [int(v) for v in box.xyxy[0].tolist()]
        box_h = y2 - y1
        distance = _estimate_distance(box_h, frame_h)

        cv2.rectangle(frame, (x1, y1), (x2, y2), BOX_COLOR, 2)

        text = f"{label} {conf:.2f} {distance}"
        font = cv2.FONT_HERSHEY_SIMPLEX
        scale = max(0.4, min(0.6, w / 1200))
        thickness = 1
        (tw, th), _ = cv2.getTextSize(text, font, scale, thickness)

        ty = max(y1 - 6, th + 4)
        cv2.rectangle(frame, (x1, ty - th - 4), (x1 + tw + 4, ty + 2), TEXT_BG_COLOR, -1)
        cv2.putText(frame, text, (x1 + 2, ty - 2), font, scale, TEXT_COLOR, thickness, cv2.LINE_AA)

        detections.append({
            "label": label,
            "confidence": round(conf, 4),
            "distance": distance,
            "bbox": {"x1": float(x1), "y1": float(y1), "x2": float(x2), "y2": float(y2)},
            "bbox_normalized": {
                "x1": float(x1 / w), "y1": float(y1 / h),
                "x2": float(x2 / w), "y2": float(y2 / h),
            },
        })

    return detections


def annotate_and_serialize(
    model: YOLO, frame_bgr: np.ndarray, return_image: bool = True
) -> Tuple[List[Dict[str, Any]], Optional[str], float]:
    start_time = time.perf_counter()
    results = model(frame_bgr, verbose=False)[0]
    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    h, w = frame_bgr.shape[:2]
    annotated = frame_bgr.copy()
    detections = _draw_detections(annotated, results, h)

    annotated_b64: Optional[str] = None
    if return_image:
        success, buffer = cv2.imencode(".jpg", annotated)
        if success:
            annotated_b64 = base64.b64encode(buffer).decode("utf-8")

    return detections, annotated_b64, elapsed_ms


# No frame cap: process full video. Use every Nth frame for YOLO to keep time reasonable.
DETECT_EVERY_N = 3

# Danger zone: center 60% width, lower 70% height (road ahead).
DANGER_ZONE_X_LEFT = 0.20
DANGER_ZONE_X_RIGHT = 0.80
DANGER_ZONE_Y_TOP = 0.30
DANGER_ZONE_Y_BOTTOM = 1.0

# Only vehicles and pedestrians can trigger "too close" danger.
DANGER_LABELS = {"person", "bicycle", "car", "motorbike", "motorcycle", "bus", "truck"}


def _in_danger_zone(bbox: Dict[str, float], w: int, h: int) -> bool:
    """True if bbox center lies in the danger zone (path of vehicle)."""
    x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
    cx = (x1 + x2) / 2
    cy = (y1 + y2) / 2
    left = w * DANGER_ZONE_X_LEFT
    right = w * DANGER_ZONE_X_RIGHT
    top = h * DANGER_ZONE_Y_TOP
    bottom = h * DANGER_ZONE_Y_BOTTOM
    return left <= cx <= right and top <= cy <= bottom


def _frame_has_collision_risk(detections: List[Dict[str, Any]], w: int, h: int) -> bool:
    """True if any vehicle or pedestrian is NEAR (too close) and in the danger zone."""
    for d in detections:
        if d.get("label") not in DANGER_LABELS:
            continue
        if d.get("distance") == "NEAR" and _in_danger_zone(d["bbox"], w, h):
            return True
    return False


def process_video(
    model: YOLO, video_bytes: bytes
) -> Tuple[str, Dict[str, Any]]:
    """
    Process the entire uploaded video (no time or frame limit). Run YOLO every
    DETECT_EVERY_N frames to keep processing time reasonable. Danger is flagged
    when any vehicle or pedestrian is NEAR (too close) and in the central danger zone.
    """
    in_tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
    in_tmp.write(video_bytes)
    in_tmp.flush()
    in_tmp.close()

    cap = cv2.VideoCapture(in_tmp.name)
    if not cap.isOpened():
        cap.release()
        os.unlink(in_tmp.name)
        raise ValueError("Could not open uploaded video.")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    out_path = in_tmp.name.replace(".mp4", "_out.mp4")
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(out_path, fourcc, fps, (width, height))

    frame_count = 0
    inference_count = 0
    total_detections = 0
    all_labels: Dict[str, int] = {}
    total_inference_ms = 0.0
    collision_risk_frames = 0
    last_collision_risk = False

    last_boxes: list = []
    last_detections: List[Dict[str, Any]] = []

    # Process every frame until end of file (full video, no cap).
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        run_detection = (frame_count % DETECT_EVERY_N == 0)

        if run_detection:
            start = time.perf_counter()
            results = model(frame, verbose=False)[0]
            elapsed = (time.perf_counter() - start) * 1000.0
            total_inference_ms += elapsed
            inference_count += 1

            dets = _draw_detections(frame, results, height)
            total_detections += len(dets)
            last_detections = dets

            for d in dets:
                lbl = d["label"]
                all_labels[lbl] = all_labels.get(lbl, 0) + 1

            last_boxes = [
                (d["bbox"], d["label"], d["confidence"], d["distance"])
                for d in dets
            ]

            last_collision_risk = _frame_has_collision_risk(dets, width, height)
            if last_collision_risk:
                collision_risk_frames += 1
        else:
            _redraw_cached_boxes(frame, last_boxes, height)
            if _frame_has_collision_risk(last_detections, width, height):
                collision_risk_frames += 1

        # Overlay collision warning on frame when risk detected
        if last_collision_risk:
            _draw_collision_overlay(frame, width, height)

        writer.write(frame)
        frame_count += 1

    cap.release()
    writer.release()
    os.unlink(in_tmp.name)

    # Re-encode to H.264 for browser playback
    h264_path = out_path.replace("_out.mp4", "_h264.mp4")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    subprocess.run(
        [
            ffmpeg_exe, "-y",
            "-i", out_path,
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "23",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            "-an",
            h264_path,
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True,
    )
    os.unlink(out_path)

    collision_detected = collision_risk_frames > 0

    summary = {
        "frames_processed": frame_count,
        "frames_with_inference": inference_count,
        "total_frames_in_video": total_frames,
        "fps": round(fps, 2),
        "resolution": f"{width}x{height}",
        "total_detections": total_detections,
        "avg_detections_per_frame": round(total_detections / max(inference_count, 1), 1),
        "avg_inference_ms": round(total_inference_ms / max(inference_count, 1), 2),
        "objects_detected": all_labels,
        "collision_detected": collision_detected,
        "collision_risk_frames": collision_risk_frames,
    }

    return h264_path, summary


def _draw_collision_overlay(frame: np.ndarray, w: int, h: int) -> None:
    """Draw DANGER banner when a vehicle or pedestrian is too close."""
    font = cv2.FONT_HERSHEY_SIMPLEX
    text = "DANGER - Vehicle/Pedestrian too close"
    scale = max(0.55, min(1.0, w / 900))
    thickness = 2
    (tw, th), _ = cv2.getTextSize(text, font, scale, thickness)
    x = (w - tw) // 2
    y = 56
    cv2.rectangle(frame, (x - 12, y - th - 12), (x + tw + 12, y + 12), (0, 0, 0), -1)
    cv2.rectangle(frame, (x - 12, y - th - 12), (x + tw + 12, y + 12), (0, 0, 255), 2)
    cv2.putText(frame, text, (x, y), font, scale, (0, 0, 255), thickness, cv2.LINE_AA)


def _redraw_cached_boxes(
    frame: np.ndarray, boxes: list, frame_h: int
) -> None:
    """Re-draw previously detected bounding boxes on a new frame."""
    w = frame.shape[1]
    font = cv2.FONT_HERSHEY_SIMPLEX
    scale = max(0.4, min(0.6, w / 1200))
    thickness = 1

    for bbox, label, conf, distance in boxes:
        x1, y1, x2, y2 = int(bbox["x1"]), int(bbox["y1"]), int(bbox["x2"]), int(bbox["y2"])
        cv2.rectangle(frame, (x1, y1), (x2, y2), BOX_COLOR, 2)

        text = f"{label} {conf:.2f} {distance}"
        (tw, th), _ = cv2.getTextSize(text, font, scale, thickness)
        ty = max(y1 - 6, th + 4)
        cv2.rectangle(frame, (x1, ty - th - 4), (x1 + tw + 4, ty + 2), TEXT_BG_COLOR, -1)
        cv2.putText(frame, text, (x1 + 2, ty - 2), font, scale, TEXT_COLOR, thickness, cv2.LINE_AA)
