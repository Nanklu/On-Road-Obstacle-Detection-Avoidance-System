import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getHealth, getStats, detectVideo, detectFromImageFile } from '../api/client';

function LiveDemo() {
  const [backendStatus, setBackendStatus] = useState('Checking backend…');
  const [stats, setStats] = useState({
    frames_processed: 0,
    last_processing_ms: null,
    average_processing_ms: null,
  });
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState('');

  const [videoSrc, setVideoSrc] = useState(null);
  const [summary, setSummary] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const health = await getHealth();
        if (!cancelled) {
          setBackendStatus(
            health?.status === 'ok'
              ? health.model_loaded
                ? 'Backend online · Model loaded'
                : 'Backend online · Loading model'
              : 'Backend unreachable'
          );
        }
      } catch {
        if (!cancelled) setBackendStatus('Backend unreachable');
      }

      try {
        const s = await getStats();
        if (!cancelled) setStats((prev) => ({ ...prev, ...s }));
      } catch {}
    }

    init();

    const interval = setInterval(async () => {
      try {
        const [health, s] = await Promise.all([getHealth(), getStats()]);
        if (!cancelled) {
          setBackendStatus(
            health?.status === 'ok'
              ? health.model_loaded
                ? 'Backend online · Model loaded'
                : 'Backend online · Loading model'
              : 'Backend unreachable'
          );
          setStats((prev) => ({ ...prev, ...s }));
        }
      } catch {
        if (!cancelled) setBackendStatus('Backend unreachable');
      }
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) {
      alert('Please select an image or video file.');
      return;
    }

    setIsSending(true);
    setProgress(isVideo ? 'Uploading video…' : 'Processing image…');
    setSummary(null);
    setAnnotatedImage(null);
    setVideoSrc(null);

    const progressTimer =
      isVideo
        ? setTimeout(() => {
            setProgress(
              'Processing video — full video is being analyzed. This can take several minutes. Please wait.'
            );
          }, 3000)
        : null;
    const progressTimer2 =
      isVideo
        ? setTimeout(() => {
            setProgress('Still processing… Long videos take longer. Do not close the page.');
          }, 45000)
        : null;

    try {
      if (isVideo) {
        const result = await detectVideo(file, setProgress);
        setVideoSrc(result.videoUrl);
        setSummary(result.summary);
        setProgress('');

        const s = await getStats();
        setStats((prev) => ({ ...prev, ...s }));
      } else {
        const result = await detectFromImageFile(file);
        if (result.annotated_image_base64) {
          setAnnotatedImage(`data:image/jpeg;base64,${result.annotated_image_base64}`);
        }
        setSummary({
          framesProcessed: '1',
          totalDetections: String(result.detections?.length ?? 0),
          avgInferenceMs: String(result.processing_time_ms),
          objectsDetected: JSON.stringify(
            result.detections?.reduce((acc, d) => {
              acc[d.label] = (acc[d.label] || 0) + 1;
              return acc;
            }, {}) ?? {}
          ),
        });
        setProgress('');

        const s = await getStats();
        setStats((prev) => ({ ...prev, ...s }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process file. Is the backend running on port 8001? Try a shorter video if it timed out.');
      setProgress('');
    } finally {
      if (progressTimer) clearTimeout(progressTimer);
      if (progressTimer2) clearTimeout(progressTimer2);
      setIsSending(false);
      event.target.value = '';
    }
  };

  const parsedObjects = (() => {
    if (!summary?.objectsDetected) return null;
    try {
      const raw = summary.objectsDetected.replace(/'/g, '"');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-primary-300">
            Live Detection Demo
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
            Upload a video or image for AI detection
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            The backend runs YOLOv8 on every frame, drawing red bounding boxes with object label,
            confidence score, and estimated distance (NEAR / MID / FAR).
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Tip: A short clip (10–30 sec) returns in under a minute; full videos work but take longer.
          </p>
        </div>
        <span className="inline-flex items-center self-start rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/40 sm:self-auto">
          ● {backendStatus}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <motion.div
          className="glass-card relative overflow-hidden rounded-3xl p-4 sm:p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="aspect-video overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80">
            {videoSrc ? (
              <video
                ref={videoRef}
                className="h-full w-full object-contain"
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            ) : annotatedImage ? (
              <img
                src={annotatedImage}
                alt="Annotated detection result"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(56,189,248,0.20),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(34,197,94,0.18),transparent_55%)]" />
                {progress ? (
                  <div className="z-10 text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
                    <p className="text-sm text-slate-300">{progress}</p>
                  </div>
                ) : (
                  <p className="z-10 text-sm text-slate-500">
                    Upload an image or video to see detections here
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Frames Processed
                </p>
                <p className="mt-1 font-medium text-slate-100">{stats.frames_processed}</p>
              </div>
              {stats.average_processing_ms != null && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Avg Latency
                  </p>
                  <p className="mt-1 font-medium text-emerald-300">
                    {stats.average_processing_ms} ms
                  </p>
                </div>
              )}
            </div>
            <label
              htmlFor="demo-upload"
              className={`inline-flex cursor-pointer items-center justify-center rounded-full px-5 py-2 text-[11px] font-semibold transition ${
                isSending
                  ? 'border border-slate-600 bg-slate-800 text-slate-400 cursor-wait'
                  : 'bg-primary-500 text-white shadow-glow-primary hover:bg-primary-400'
              }`}
            >
              {isSending ? 'Processing…' : 'Upload Image / Video'}
              <input
                id="demo-upload"
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleUpload}
                disabled={isSending}
              />
            </label>
          </div>
        </motion.div>

        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold tracking-tight text-slate-50">Detection Summary</h3>

          {summary ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {summary.framesProcessed && (
                  <div className="glass-card rounded-2xl p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Frames Analyzed
                    </p>
                    <p className="mt-1 text-lg font-semibold text-primary-300">
                      {summary.framesProcessed}
                    </p>
                  </div>
                )}
                {summary.totalDetections && (
                  <div className="glass-card rounded-2xl p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Total Detections
                    </p>
                    <p className="mt-1 text-lg font-semibold text-emerald-300">
                      {summary.totalDetections}
                    </p>
                  </div>
                )}
                {summary.avgDetectionsPerFrame && (
                  <div className="glass-card rounded-2xl p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Avg Detections / Frame
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-100">
                      {summary.avgDetectionsPerFrame}
                    </p>
                  </div>
                )}
                {summary.avgInferenceMs && (
                  <div className="glass-card rounded-2xl p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Avg Inference
                    </p>
                    <p className="mt-1 text-lg font-semibold text-primary-300">
                      {summary.avgInferenceMs} ms
                    </p>
                  </div>
                )}
              </div>

              {summary.collisionDetected !== undefined && (
                <div className={`rounded-2xl border-2 p-4 ${summary.collisionDetected ? 'border-red-500/80 bg-red-500/10' : 'border-emerald-500/50 bg-emerald-500/5'}`}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Danger (vehicle/pedestrian too close)
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {summary.collisionDetected ? (
                      <span className="text-red-400">DANGER – Too close</span>
                    ) : (
                      <span className="text-emerald-400">No danger</span>
                    )}
                  </p>
                  {summary.collisionRiskFrames != null && summary.collisionRiskFrames !== '0' && (
                    <p className="mt-1 text-xs text-slate-400">
                      Frames with danger: {summary.collisionRiskFrames}
                    </p>
                  )}
                </div>
              )}

              {parsedObjects && Object.keys(parsedObjects).length > 0 && (
                <div className="glass-card rounded-2xl p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Objects Detected
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(parsedObjects).map(([label, count]) => (
                      <span
                        key={label}
                        className="inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-[11px] font-semibold text-primary-200 ring-1 ring-primary-500/30"
                      >
                        {label}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {summary.resolution && (
                <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                  <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
                    {summary.resolution}
                  </span>
                  {summary.fps && (
                    <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
                      {summary.fps} FPS
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Upload a video or image to see detection results. The backend will process each frame
                with YOLO and return the annotated output.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="glass-card rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Detection Pipeline
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    Every video frame is processed by YOLO to detect objects, estimate distance, and
                    draw bounding boxes with labels.
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Distance Estimation
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    Objects are tagged as NEAR, MID, or FAR based on their bounding box size relative
                    to the frame.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default LiveDemo;
