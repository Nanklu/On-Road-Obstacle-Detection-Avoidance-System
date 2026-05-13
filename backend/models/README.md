## YOLO Models

Place your YOLOv8 weights in this directory if you do **not** want to download them at runtime.

By default, the backend will use:

- `yolov8n.pt` (nano) from the `ultralytics` hub if no local file is found.

To use a custom model instead:

1. Copy your trained model file here, e.g. `onroad-yolov8n.pt`.
2. Update the `MODEL_WEIGHTS` constant in `utils/processing.py` to point to your file.

