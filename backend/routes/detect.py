import os
from typing import Any, Dict

from fastapi import APIRouter, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse

from utils.processing import (
    annotate_and_serialize,
    bytes_to_bgr_image,
    process_video,
)

router = APIRouter()


def get_metrics_store() -> Dict[str, Any]:
    if not hasattr(get_metrics_store, "_store"):
        get_metrics_store._store = {
            "frames_processed": 0,
            "last_processing_ms": None,
            "average_processing_ms": None,
            "total_processing_ms": 0.0,
        }
    return get_metrics_store._store


@router.post("/detect")
async def detect_obstacles(
    request: Request,
    image: UploadFile = File(...),
    return_image: bool = True,
) -> Dict[str, Any]:
    """
    Receive an uploaded image, run YOLO detection, and return the detected
    objects with bounding boxes drawn, confidence scores, and distance tags.
    """
    if not image.content_type or "image" not in image.content_type:
        raise HTTPException(status_code=400, detail="Please upload a valid image file.")

    raw_bytes = await image.read()
    try:
        frame_bgr = bytes_to_bgr_image(raw_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    model = request.app.state.yolo_model
    detections, annotated_b64, elapsed_ms = annotate_and_serialize(
        model=model, frame_bgr=frame_bgr, return_image=return_image
    )

    metrics = get_metrics_store()
    metrics["frames_processed"] += 1
    metrics["last_processing_ms"] = round(elapsed_ms, 2)
    metrics["total_processing_ms"] += elapsed_ms
    metrics["average_processing_ms"] = round(
        metrics["total_processing_ms"] / metrics["frames_processed"], 2
    )

    response: Dict[str, Any] = {
        "detections": detections,
        "processing_time_ms": round(elapsed_ms, 2),
        "frames_processed": metrics["frames_processed"],
    }
    if return_image and annotated_b64:
        response["annotated_image_base64"] = annotated_b64

    return response


@router.post("/detect-video")
async def detect_video(
    request: Request,
    video: UploadFile = File(...),
):
    """
    Receive an uploaded video, run YOLO on every frame, draw red bounding
    boxes with label + confidence + distance, and return the annotated
    video file (mp4) plus a JSON summary header.
    """
    if not video.content_type or "video" not in video.content_type:
        raise HTTPException(status_code=400, detail="Please upload a valid video file.")

    raw_bytes = await video.read()
    model = request.app.state.yolo_model

    try:
        out_path, summary = process_video(model, raw_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    metrics = get_metrics_store()
    metrics["frames_processed"] += summary["frames_processed"]
    metrics["last_processing_ms"] = summary["avg_inference_ms"]
    metrics["total_processing_ms"] += (
        summary["avg_inference_ms"] * summary["frames_processed"]
    )
    total = metrics["frames_processed"]
    metrics["average_processing_ms"] = round(
        metrics["total_processing_ms"] / max(total, 1), 2
    )

    return FileResponse(
        out_path,
        media_type="video/mp4",
        filename="detected_output.mp4",
        headers={
            "X-Frames-Processed": str(summary["frames_processed"]),
            "X-Total-Detections": str(summary["total_detections"]),
            "X-Avg-Detections-Per-Frame": str(summary["avg_detections_per_frame"]),
            "X-Avg-Inference-Ms": str(summary["avg_inference_ms"]),
            "X-Objects-Detected": str(summary["objects_detected"]),
            "X-Resolution": summary["resolution"],
            "X-FPS": str(summary["fps"]),
            "X-Collision-Detected": str(summary.get("collision_detected", False)).lower(),
            "X-Collision-Risk-Frames": str(summary.get("collision_risk_frames", 0)),
            "Access-Control-Expose-Headers": "X-Frames-Processed, X-Total-Detections, X-Avg-Detections-Per-Frame, X-Avg-Inference-Ms, X-Objects-Detected, X-Resolution, X-FPS, X-Collision-Detected, X-Collision-Risk-Frames",
        },
        background=lambda: os.unlink(out_path) if os.path.exists(out_path) else None,
    )


@router.get("/health")
async def health(request: Request) -> Dict[str, Any]:
    model_loaded = bool(getattr(request.app.state, "yolo_model", None))
    return {"status": "ok", "model_loaded": model_loaded}


@router.get("/stats")
async def stats() -> Dict[str, Any]:
    metrics = get_metrics_store()
    return {
        "frames_processed": metrics["frames_processed"],
        "last_processing_ms": metrics["last_processing_ms"],
        "average_processing_ms": metrics["average_processing_ms"],
    }
