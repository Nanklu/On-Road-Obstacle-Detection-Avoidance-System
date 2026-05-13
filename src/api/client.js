import { API_BASE_URL } from '../config';
export async function getHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}
export async function getStats() {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) throw new Error(`Stats failed: ${res.status}`);
  return res.json();
}
export async function detectFromImageFile(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_BASE_URL}/detect?return_image=true`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`Detect request failed: ${res.status}`);
  return res.json();
}
export async function detectVideo(file, onProgress) {
  const formData = new FormData();
  formData.append('video', file);
  if (onProgress) onProgress('Uploading video to backend…');
  const res = await fetch(`${API_BASE_URL}/detect-video`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Video detection failed (${res.status}): ${text}`);
  }
  const summary = {
    framesProcessed: res.headers.get('X-Frames-Processed'),
    totalDetections: res.headers.get('X-Total-Detections'),
    avgDetectionsPerFrame: res.headers.get('X-Avg-Detections-Per-Frame'),
    avgInferenceMs: res.headers.get('X-Avg-Inference-Ms'),
    objectsDetected: res.headers.get('X-Objects-Detected'),
    resolution: res.headers.get('X-Resolution'),
    fps: res.headers.get('X-FPS'),
    collisionDetected: res.headers.get('X-Collision-Detected') === 'true',
    collisionRiskFrames: res.headers.get('X-Collision-Risk-Frames') || '0',
  };
  const blob = await res.blob();
  const videoUrl = URL.createObjectURL(blob);
  return { videoUrl, summary };
}