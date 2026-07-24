import { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';

function ScoreRing({ targetScore }) {
  const [score, setScore] = useState(0);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const controls = animate(0, targetScore, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (value) => {
        setScore(Math.round(value));
        const progress = value / 100;
        setOffset(circumference - (progress * circumference));
      }
    });
    return () => controls.stop();
  }, [targetScore, circumference]);

  return (
    <div className="score-container">
      <svg className="score-circle-svg">
        <circle className="score-circle-bg" cx="100" cy="100" r={radius} />
        <circle 
          className="score-circle-path" 
          cx="100" cy="100" r={radius} 
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-text">
        {score}
        <span className="score-label">Signal Str</span>
      </div>
    </div>
  );
}

function TalentCheck() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="panel">
      <span className="label-muted">Diagnostic Readout</span>
      <h2>Talent Check</h2>
      
      <ScoreRing targetScore={85} />
      
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Mock Signal Strength calculated based on JD and Profile match.</p>
        <div style={{ marginTop: '2rem' }}>
          <span className="pill pill-matched">Python</span>
          <span className="pill pill-matched">React</span>
          <span className="pill pill-matched">APIs</span>
          <span className="pill pill-missing">Docker</span>
          <span className="pill pill-missing">GraphQL</span>
        </div>
      </div>
    </motion.div>
  );
}

export default TalentCheck;
