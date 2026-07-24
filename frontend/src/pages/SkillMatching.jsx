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
        <span className="score-label">Skill Match</span>
      </div>
    </div>
  );
}

function SkillMatching() {
  const [email, setEmail] = useState('');
  const [jdId, setJdId] = useState('Google LLC - Software Engineer');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRunMatch = async () => {
    if (!email) {
      setError('Please enter candidate email.');
      return;
    }
    if (!jdId) {
      setError('Please enter JD identifier.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    const res = await fetch('http://localhost:8000/api/skill/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: email, jd_id: jdId })
    });
    
    if (res.ok) {
      const data = await res.json();
      setResult(data);
    } else {
      const err = await res.json();
      setError(err.detail || 'Failed to run skill match');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="panel">
      <span className="label-muted">Diagnostic Readout</span>
      <h2>Skill Matching</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input 
          type="email" 
          placeholder="Candidate Email (e.g. karthik@example.com)" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ flex: 1, minWidth: '250px' }}
        />
        <input 
          type="text" 
          placeholder="JD Name (e.g. Google LLC - Software Engineer)" 
          value={jdId} 
          onChange={(e) => setJdId(e.target.value)} 
          style={{ flex: 1, minWidth: '250px' }}
        />
      </div>
      
      <button onClick={handleRunMatch} disabled={loading}>
        {loading ? 'Running Analysis...' : 'Run Skill Match'}
      </button>

      {error && <p style={{ color: 'var(--accent-coral)', marginTop: '1rem' }}>{error}</p>}

      {result && (
        <>
          <ScoreRing targetScore={result.overall_score} />
          
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>{result.gap_analysis}</p>
            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>Matched Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.matching_skills.map((skillObj, idx) => (
                  <span key={`match-${idx}`} className="pill pill-matched">
                    {skillObj.skill_name}
                  </span>
                ))}
                {result.matching_skills.length === 0 && <span className="label-muted">None</span>}
              </div>

              <h3 style={{ color: '#fff', fontSize: '1rem', marginTop: '2rem', marginBottom: '1rem' }}>Missing Skills (Gaps)</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.missing_skills.map((skill, idx) => (
                  <span key={`miss-${idx}`} className="pill pill-missing">{skill}</span>
                ))}
                {result.missing_skills.length === 0 && <span className="label-muted">None</span>}
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default SkillMatching;
