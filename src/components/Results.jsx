import { motion } from 'framer-motion';

function Results() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.26em] text-primary-300">
        Results &amp; Performance
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
        Reliable detection in diverse environments
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-300">
        The metrics below are representative values that can be tuned based on your trained model and
        hardware. They are ideal for showcasing performance in a college project presentation.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <motion.div
          className="glass-card rounded-3xl p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Detection Accuracy
          </p>
          <p className="mt-3 text-3xl font-semibold text-emerald-400">96.3%</p>
          <p className="mt-2 text-xs text-slate-300">
            Mean Average Precision (mAP) on a mixed dataset of pedestrians, vehicles, and road
            obstacles.
          </p>
        </motion.div>

        <motion.div
          className="glass-card rounded-3xl p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Response Time
          </p>
          <p className="mt-3 text-3xl font-semibold text-primary-400">38 ms</p>
          <p className="mt-2 text-xs text-slate-300">
            Average time from frame capture to obstacle decision on laptop GPU / Jetson class device.
          </p>
        </motion.div>

        <motion.div
          className="glass-card rounded-3xl p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Supported Environments
          </p>
          <p className="mt-3 text-sm font-semibold text-slate-100">
            Day · Night · Rain · Indoor Lab
          </p>
          <p className="mt-2 text-xs text-slate-300">
            Robust under different lighting and weather conditions with appropriate training data.
          </p>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Scenario Coverage
          </p>
          <div className="mt-4 space-y-3 text-xs text-slate-300">
            <div>
              <div className="mb-1 flex justify-between">
                <span>Highway (Day)</span>
                <span className="text-emerald-300">98%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-emerald-400 to-primary-500" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>City (Night)</span>
                <span className="text-emerald-300">94%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-primary-500 to-emerald-400" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>Rain / Fog</span>
                <span className="text-amber-300">89%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-amber-400 to-primary-500" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 text-xs text-slate-300"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Deployment Targets
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Laptop / PC with GPU (ideal for demo and training).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>NVIDIA Jetson Nano / Xavier for on-vehicle edge deployment.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Raspberry Pi with accelerator (e.g., Coral TPU) for low-power setups.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default Results;

