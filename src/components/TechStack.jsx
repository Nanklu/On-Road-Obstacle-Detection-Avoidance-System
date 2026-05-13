import { motion } from 'framer-motion';

const stack = [
  {
    name: 'Python',
    description: 'Core language for model training and inference pipeline.',
    badge: 'Backend Logic'
  },
  {
    name: 'OpenCV',
    description: 'Frame capture, image preprocessing, and drawing of bounding boxes.',
    badge: 'Computer Vision'
  },
  {
    name: 'YOLO',
    description: 'Real-time object detection model for road obstacles.',
    badge: 'Detection Model'
  },
  {
    name: 'TensorFlow / PyTorch',
    description: 'Deep learning frameworks used to train and fine-tune the model.',
    badge: 'Deep Learning'
  },
  {
    name: 'React',
    description: 'Interactive dashboard for monitoring system status and results.',
    badge: 'Frontend UI'
  }
];

function TechStack() {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-primary-300">
            Technology Stack
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
            Built with industry-standard AI tools
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            The system combines powerful deep learning frameworks, optimized computer vision
            libraries, and a modern React-based dashboard to create an end‑to‑end obstacle detection
            platform.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stack.map((item, index) => (
          <motion.div
            key={item.name}
            className="glass-card flex flex-col rounded-3xl p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/80 to-emerald-500/80 text-xs font-semibold text-slate-950 shadow-glow-primary">
                {item.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 3)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-50">{item.name}</p>
                <p className="text-[11px] text-primary-200">{item.badge}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-300 sm:text-sm">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TechStack;

