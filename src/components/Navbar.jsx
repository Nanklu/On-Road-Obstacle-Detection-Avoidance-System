import { useState } from 'react';
import { motion } from 'framer-motion';

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#features', label: 'Features' },
  { href: '#demo', label: 'Demo' },
  { href: '#results', label: 'Results' },
  { href: '#contact', label: 'Contact' }
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <nav className="container-page flex items-center justify-between py-3">
        <motion.a
          href="#home"
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow-primary">
            <span className="text-xs font-semibold tracking-tight text-white">AI</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
              On-Road Obstacle Detection
            </p>
            <p className="text-sm font-semibold text-slate-50">
              Detection &amp; Avoidance System
            </p>
          </div>
        </motion.a>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative transition-colors hover:text-primary-400"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-center scale-x-0 bg-gradient-to-r from-primary-400 via-accent-500 to-primary-400 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
          <a
            href="#demo"
            className="rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white shadow-glow-primary transition hover:bg-primary-400"
          >
            Start Detection
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-4 rounded-full bg-slate-200" />
            <span className="block h-0.5 w-4 rounded-full bg-slate-200" />
          </div>
        </button>
      </nav>

      {open && (
        <motion.div
          className="border-t border-slate-800/80 bg-slate-950/95 md:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container-page flex flex-col gap-3 py-4 text-sm font-medium text-slate-200">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-2 hover:bg-slate-800/70"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#demo"
              className="mt-1 rounded-full bg-primary-500 px-4 py-2 text-center text-xs font-semibold text-white shadow-glow-primary"
              onClick={() => setOpen(false)}
            >
              Start Detection
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}

export default Navbar;

