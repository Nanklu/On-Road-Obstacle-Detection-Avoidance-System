function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90">
      <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-[11px] text-slate-400 sm:flex-row">
        <p>
          © {new Date().getFullYear()} On-Road Obstacle Detection &amp; Avoidance System. All rights
          reserved.
        </p>
        <p className="text-center sm:text-right">
          A college project demonstrating{' '}
          <span className="text-primary-300">AI-driven road safety and obstacle avoidance</span>.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

