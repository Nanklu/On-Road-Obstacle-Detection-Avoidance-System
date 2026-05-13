## On-Road Obstacle Detection & Avoidance System – Full Stack

This project contains a modern **React + Tailwind** dashboard frontend and a **Python FastAPI + YOLO** backend for the **“On-Road Obstacle Detection & Avoidance System”**.

### Frontend (React + Vite + Tailwind)

- **Dark AI theme** with glassmorphism cards and glowing accents.
- **Hero section** describing the obstacle detection system and safety benefits.
- **Live Detection Demo** section connected to the backend for health & stats, with an image upload detector.
- **Features, Technology Stack, How It Works, Results, and Contact/Team** sections.
- **Responsive layout** that works on mobile, tablet, and desktop.
- Optional **Framer Motion** animations for smooth transitions.

#### Frontend prerequisites

- **Node.js 18+** and **npm** installed on your machine.

#### Install frontend dependencies

```bash
cd "c:\Users\tashu\OneDrive\Desktop\Learnathon"
npm install
```

#### Run the frontend dev server

```bash
npm run dev
```
      3
Then open the printed URL in your browser (usually `http://localhost:5173`).

### Backend (FastAPI + YOLO + OpenCV)

The backend lives in the `backend/` folder and exposes:

- `GET /health` – simple status + model loaded flag.
- `GET /stats` – frames processed and latency metrics.
- `POST /detect` – accepts an uploaded image and returns detections and timing; optionally returns an annotated image as base64.

#### Backend prerequisites

- **Python 3.10+**
- A machine with internet access on first run (to download `yolov8n.pt` if you do not place a local copy in `backend/models/`).

#### Install backend dependencies

```bash
cd "c:\Users\tashu\OneDrive\Desktop\Learnathon\backend"
python -m venv .venv
.venv\Scripts\activate  # On PowerShell
pip install -r requirements.txt
```

#### Run the backend server (FastAPI with Uvicorn)

```bash
cd "c:\Users\tashu\OneDrive\Desktop\Learnathon\backend"
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://127.0.0.1:8000` and automatically documented at `http://127.0.0.1:8000/docs`.

### How the frontend talks to the backend

- The base URL is configured in `src/config.js` (`API_BASE_URL = 'http://127.0.0.1:8000'`).
- `src/api/client.js` defines helpers for:
  - `getHealth()` → calls `/health`.
  - `getStats()` → calls `/stats`.
  - `detectFromImageFile(file)` → uploads an image to `/detect`.
- `LiveDemo.jsx`:
  - Polls `/health` and `/stats` to show backend status and latency.
  - Lets you **upload an image frame**; when uploaded, the frame is sent to `/detect`, and the response is shown in an alert and used to update stats.

### Real-time and video usage

- For **real-time webcam or video**, you can:
  - Capture frames in Python (OpenCV) and send them to `/detect` in a loop, or
  - Capture frames in the browser, convert them to `Blob`/`File`, and POST to `/detect` similar to the upload button in `LiveDemo.jsx`.
- The `/detect` response includes:
  - `detections`: list of `{ label, confidence, bbox, bbox_normalized }`.
  - `processing_time_ms`: time taken to run the model.
  - `frames_processed`: total frames handled since startup.
  - Optionally `annotated_image_base64` (if `return_image=true`).


