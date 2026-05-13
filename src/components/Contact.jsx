import { motion } from 'framer-motion';

const team = [
  {
    name: 'Ashutosh Kumar Sinha',
    id: '2300032868',
    email: '2300032868@kluniversity.in'
  },
  {
    name: 'Himanshu',
    id: '2300032648',
    email: '2300032648@kluniversity.in'
  }
];

function Contact() {
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" id="about">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-[11px] uppercase tracking-[0.26em] text-primary-300">
          About The Project
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
          On-Road Obstacle Detection &amp; Avoidance System
        </h2>
        <p className="mt-3 text-sm text-slate-300">
          This project demonstrates how modern computer vision and deep learning techniques can be
          integrated into vehicles to improve road safety. The dashboard you see here can be connected
          to a live Python backend streaming frames and detection results in real time.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          It is designed as a clean, professional interface suitable for academic presentations,
          project demos, and future extensions towards semi-autonomous driving or driver-assistance
          systems.
        </p>

        <div className="mt-4 grid gap-4 text-xs text-slate-300 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Key Outcomes</p>
            <ul className="mt-2 space-y-1.5">
              <li>✔ Real-time multi-class obstacle detection.</li>
              <li>✔ Clear visualization of risks and actions.</li>
              <li>✔ Modular design for future research.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
              Possible Extensions
            </p>
            <ul className="mt-2 space-y-1.5">
              <li>• Lane detection and drift warning.</li>
              <li>• Traffic sign recognition module.</li>
              <li>• Cloud logging and analytics.</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, delay: 0.05 }}
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-primary-300">
            Contact &amp; Team
          </p>
          <p className="mt-2 text-sm text-slate-300">Project contributors and contact information.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {team.map((member, index) => (
            <motion.div
              key={member.email}
              className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-200"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
            >
              <p className="text-sm font-semibold text-slate-50">{member.name}</p>
              <p className="mt-2 text-[11px] text-slate-400">ID: {member.id}</p>
              <p className="mt-2 break-all text-[11px] text-slate-400">{member.email}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Contact;

