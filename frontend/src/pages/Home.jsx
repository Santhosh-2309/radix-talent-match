import { motion } from 'framer-motion';

function Waveform() {
  // A complex repeating wave pattern
  const complexWave = "M0,50 Q25,20 50,50 T100,50 T150,50 Q175,10 200,50 T250,50 Q275,80 300,50 T350,50 T400,50 Q425,15 450,50 T500,50";
  
  return (
    <div className="waveform-container">
      <div className="wave-layer" style={{ animationDuration: '8s', opacity: 0.8, color: 'var(--accent-cyan)' }}>
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" style={{width: '50%', height: '100%', float: 'left'}}>
          <path d={complexWave} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" style={{width: '50%', height: '100%', float: 'left'}}>
          <path d={complexWave} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="wave-layer" style={{ animationDuration: '12s', opacity: 0.4, color: 'var(--accent-cyan)', animationDirection: 'reverse', transform: 'scaleY(1.4)' }}>
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" style={{width: '50%', height: '100%', float: 'left'}}>
          <path d={complexWave} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" style={{width: '50%', height: '100%', float: 'left'}}>
          <path d={complexWave} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="wave-layer" style={{ animationDuration: '5s', opacity: 0.2, color: '#fff', transform: 'scaleY(0.6) translateY(20px)' }}>
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" style={{width: '50%', height: '100%', float: 'left'}}>
          <path d={complexWave} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" style={{width: '50%', height: '100%', float: 'left'}}>
          <path d={complexWave} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Waveform />
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
