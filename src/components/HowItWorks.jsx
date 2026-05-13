import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Camera Input',
    description:
      'A front-facing camera mounted on the vehicle continuously streams video frames to the system.',
    label: 'Step 1'
  },
  {
    title: 'AI Processing',
    description:
      'Frames are fed into the trained YOLO-based model running in Python with TensorFlow / PyTorch.',
    label: 'Step 2'
  },
  {
    title: 'Obstacle Detection',
    description:
      'The model detects objects, estimates distance, and assigns risk levels for each obstacle.',
    label: 'Step 3'
  },
  {
    title: 'Vehicle Response',
    description:
      'Based on the detected risks, control signals can be sent for braking, steering, or alerts.',
    label: 'Step 4'
  }
];

function HowItWorks() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.26em] text-primary-300">
        How It Works
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
        End-to-end obstacle detection pipeline
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-300">
        The following flow explains how a single frame travels from the camera to the AI model and
        finally to the vehicle&apos;s control system.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            className="relative flex flex-col rounded-3xl border border-slate-800 bg-slate-950/60 p-4"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 text-xs font-semibold text-slate-950 shadow-glow-primary">
                {index + 1}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                {step.label}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-100">{step.title}</p>
            <p className="mt-2 text-xs text-slate-300 sm:text-sm">{step.description}</p>
            {index < steps.length - 1 && (
              <div className="pointer-events-none absolute inset-y-1 right-[-14px] hidden items-center md:flex">
                <span className="h-px w-7 bg-gradient-to-r from-slate-700 via-primary-500 to-transparent" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;

