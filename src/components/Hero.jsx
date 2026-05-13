import { motion } from 'framer-motion';

function Hero() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-300 shadow-sm shadow-primary-500/20">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Real-time AI for safer roads
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
            AI Based On-Road
            <span className="block bg-gradient-to-r from-primary-400 via-emerald-400 to-primary-500 bg-clip-text text-transparent">
              Obstacle Detection System
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
            A computer vision powered dashboard that monitors the road in real time, detects
            pedestrians, vehicles, and obstacles, and helps vehicles react before it&apos;s too late.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <a
            href="#demo"
            className="inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow-primary transition hover:bg-primary-400"
          >
            Start Detection
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-slate-200 hover:border-primary-500/60 hover:text-primary-200"
          >
            View Features
          </a>
        </motion.div>

        <motion.dl
          className="mt-4 grid grid-cols-3 gap-4 text-xs text-slate-300 sm:text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-card rounded-2xl p-4">
            <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Detection Accuracy
            </dt>
            <dd className="mt-2 text-lg font-semibold text-emerald-400">96.3%</dd>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Avg Response Time
            </dt>
            <dd className="mt-2 text-lg font-semibold text-primary-400">38 ms</dd>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Supported Platforms
            </dt>
            <dd className="mt-2 text-lg font-semibold text-slate-100">Car · Bus · Robot</dd>
          </div>
        </motion.dl>
      </div>

      <motion.div
        className="glass-card relative overflow-hidden rounded-3xl border-slate-700/70 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
              Live Detection Feed
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-100">Urban Highway - Night Mode</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-glow-accent" />
            <span className="text-[11px] text-emerald-300">Streaming</span>
          </div>
        </div>

        <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(34,197,94,0.22),transparent_55%)]" />

            <div className="absolute left-[12%] top-[16%] h-[32%] w-[22%] rounded border border-emerald-400/90 bg-emerald-500/10 backdrop-blur-sm">
              <div className="absolute -top-5 left-0 rounded px-1.5 py-[2px] text-[10px] font-semibold text-emerald-100">
                Pedestrian · 0.94
              </div>
            </div>

            <div className="absolute right-[10%] bottom-[18%] h-[28%] w-[30%] rounded border border-primary-400/90 bg-primary-500/10 backdrop-blur-sm">
              <div className="absolute -top-5 right-0 rounded px-1.5 py-[2px] text-[10px] font-semibold text-sky-100">
                Vehicle · 0.88
              </div>
            </div>

            <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-[11px] text-slate-200">
              <span>FPS: 28</span>
              <span>Latency: 41 ms</span>
              <span>Mode: Highway · Night</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Objects</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">Pedestrian · Car · Bike</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Risk Level</p>
            <p className="mt-1 text-sm font-semibold text-amber-300">Medium</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Suggested Action</p>
            <p className="mt-1 text-sm font-semibold text-emerald-300">Slow down · Steer right</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Hero;

