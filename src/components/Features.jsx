import { motion } from 'framer-motion';

const features = [
  {
    title: 'Real-Time Detection',
    description:
      'Processes each camera frame within milliseconds to detect obstacles while the vehicle is moving.',
    tag: '≤ 40 ms',
    accent: 'primary'
  },
  {
    title: 'AI Object Recognition',
    description:
      'Identifies pedestrians, vehicles, traffic cones, potholes, and other road objects using deep learning.',
    tag: 'YOLO · CNN',
    accent: 'accent'
  },
  {
    title: 'Safe Path Prediction',
    description:
      'Predicts a collision-free trajectory and can suggest braking or steering decisions to the controller.',
    tag: 'Path Planner',
    accent: 'primary'
  },
  {
    title: 'Fast Edge Processing',
    description:
      'Optimized to run on edge devices like NVIDIA Jetson, Raspberry Pi, or laptop GPUs with minimal lag.',
    tag: 'Edge Ready',
    accent: 'accent'
  }
];

function Features() {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-primary-300">
            System Features
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
            Designed for real-world road conditions
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Each module of the system is tuned for reliability, from low-light detection to high-speed
            decision making, making it suitable for academic demos and future autonomous platforms.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="glass-card group flex flex-col justify-between rounded-3xl p-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-50">{feature.title}</h3>
                <p className="mt-2 text-xs text-slate-300 sm:text-sm">{feature.description}</p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ${
                  feature.accent === 'primary'
                    ? 'bg-primary-500/10 text-primary-200 ring-1 ring-primary-500/30'
                    : 'bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/30'
                }`}
              >
                {feature.tag}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Optimized for highway &amp; city roads
              </span>
              <span className="hidden sm:inline text-slate-500">
                Visualized on this dashboard in real-time
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Features;

