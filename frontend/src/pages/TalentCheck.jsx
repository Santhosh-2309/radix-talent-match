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
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('Google');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/profile/list')
      .then(res => res.json())
      .then(data => {
        setProfiles(data);
        if (data.length > 0) setEmail(data[0]);
      })
      .catch(e => console.error(e));
  }, []);

  const handleRunCheck = async () => {
    if (!email) {
      setError('Please select a candidate email.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('http://localhost:8000/api/talent/check-talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: email, company_name: company })
      });
      
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const err = await res.json();
        setError(err.detail || 'Failed to run talent check');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  if (profiles.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="panel">
        <span className="label-muted">Diagnostic Readout</span>
        <h2>Talent Check</h2>
        <p style={{ color: 'var(--accent-coral)' }}>No profiles found — build one first in Profile Builder.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="panel">
      <span className="label-muted">Diagnostic Readout</span>
      <h2>Talent Check</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <select 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ flex: 1, minWidth: '250px' }}
        >
          {profiles.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select 
          value={company} 
          onChange={(e) => setCompany(e.target.value)} 
          style={{ flex: 1, minWidth: '250px' }}
        >
          <option value="Google">Google</option>
          <option value="Microsoft">Microsoft</option>
          <option value="Oracle Financial Services Software">Oracle Financial Services Software</option>
        </select>
      </div>
      
      <button onClick={handleRunCheck} disabled={loading}>
        {loading ? 'Analyzing...' : 'Run Talent Check'}
      </button>

      {error && <p style={{ color: 'var(--accent-coral)', marginTop: '1rem' }}>{error}</p>}

      {result && (
        <>
          <ScoreRing targetScore={result.score} />
          
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <h3 style={{ color: result.passed ? 'var(--accent-cyan)' : 'var(--accent-coral)' }}>
              {result.passed ? 'Passed Baseline' : 'Did Not Pass Baseline'}
            </h3>
            
            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>Skill Breakdown</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.breakdown.map((gap, idx) => (
                  <span 
                    key={`gap-${idx}`} 
                    className={`pill ${gap.gap ? 'pill-missing' : 'pill-matched'}`}
                    title={`Required: ${gap.required}, Candidate: ${gap.candidate}`}
                  >
                    {gap.category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default TalentCheck;
