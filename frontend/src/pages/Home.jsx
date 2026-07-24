import { motion } from 'framer-motion';

function AuroraBackground() {
  return (
    <div className="aurora-container">
      <div className="aurora-blob aurora-1"></div>
      <div className="aurora-blob aurora-2"></div>
      <div className="aurora-blob aurora-3"></div>
    </div>
  );
}

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <AuroraBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="label-muted" style={{ marginBottom: '1rem', display: 'block' }}>
          Analyzing candidate signal...
        </span>
        <h1 style={{ letterSpacing: '3px', fontWeight: 500 }}>
          RADIX TALENT MATCH
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '1rem', maxWidth: '500px', margin: '1rem auto' }}
      >
        Extract clear readiness signals from noisy candidate data. Select a diagnostic module above to begin.
      </motion.p>
    </div>
  );
}

export default Home;
