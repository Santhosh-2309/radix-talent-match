import { useState } from 'react';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  icon: {
    fontSize: '1.8rem',
  },
  subtitle: {
    color: '#999',
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  label: {
    fontSize: '0.85rem',
    color: '#aaa',
    marginBottom: '0.2rem',
    fontWeight: 500,
  },
  scoreCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    padding: '2rem',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    border: '1px solid #2a2a4a',
  },
  scoreNumber: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1,
  },
  skillsSection: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  skillChip: {
    display: 'inline-block',
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 500,
    margin: '0.25rem',
  },
  matchedChip: {
    background: 'rgba(46, 213, 115, 0.12)',
    color: '#2ed573',
    border: '1px solid rgba(46, 213, 115, 0.25)',
  },
  missingChip: {
    background: 'rgba(255, 71, 87, 0.12)',
    color: '#ff4757',
    border: '1px solid rgba(255, 71, 87, 0.25)',
  },
  gapBox: {
    background: '#111',
    padding: '1rem 1.25rem',
    borderRadius: '8px',
    border: '1px solid #222',
    whiteSpace: 'pre-wrap',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#ccc',
  },
  errorMsg: {
    color: '#ff4757',
    background: 'rgba(255, 71, 87, 0.1)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 71, 87, 0.2)',
    fontSize: '0.9rem',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#888',
  },
};

function SkillMatching() {
  const [profileName, setProfileName] = useState('');
  const [jdSource, setJdSource] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!profileName.trim() || !jdSource.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/skill/match-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileName, jd_id: jdSource })
      });
      const data = await res.json();

      if (data.error || data.detail) {
        setError(data.error || (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)));
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to connect to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#2ed573';
    if (score >= 50) return '#ffa502';
    return '#ff4757';
  };

  return (
    <div>
      <div style={styles.header}>
        <span style={styles.icon}>🔗</span>
        <h2 style={{ margin: 0 }}>Skill Matching</h2>
      </div>
      <p style={styles.subtitle}>
        Match your profile skills against a specific Job Description to find overlaps and gaps.
      </p>

      <div className="panel">
        <div style={styles.form}>
          <div>
            <div style={styles.label}>Profile Name</div>
            <input
              id="match-profile-name"
              type="text"
              placeholder="e.g. John Doe"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>
          <div>
            <div style={styles.label}>JD Source File</div>
            <input
              id="match-jd-source"
              type="text"
              placeholder="e.g. Google LLC - Software Engineer.pdf"
              value={jdSource}
              onChange={(e) => setJdSource(e.target.value)}
            />
          </div>
          <button id="match-skills-btn" onClick={handleMatch} disabled={loading}>
            {loading ? 'Matching...' : '🔍 Run Skill Match'}
          </button>
        </div>

        {error && <div style={{ ...styles.errorMsg, marginTop: '1rem' }}>{error}</div>}
        {loading && <div style={styles.loading}>⏳ Matching skills...</div>}

        {result && !loading && (
          <div style={{ marginTop: '1.5rem' }}>
            {/* Score Card */}
            <div style={styles.scoreCard}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...styles.scoreNumber, color: getScoreColor(result.overall_score) }}>
                  {result.overall_score}%
                </div>
                <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  Match Score
                </div>
              </div>
              <div style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem' }}>
                <div>{result.matching_skills?.length || 0} matched</div>
                <div>{result.missing_skills?.length || 0} missing</div>
              </div>
            </div>

            {/* Matched Skills */}
            {result.matching_skills && result.matching_skills.length > 0 && (
              <div style={styles.skillsSection}>
                <div style={styles.sectionTitle}>
                  <span>✅</span> Matched Skills ({result.matching_skills.length})
                </div>
                <div>
                  {result.matching_skills.map((s, i) => (
                    <span key={i} style={{ ...styles.skillChip, ...styles.matchedChip }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {result.missing_skills && result.missing_skills.length > 0 && (
              <div style={styles.skillsSection}>
                <div style={styles.sectionTitle}>
                  <span>❌</span> Missing Skills ({result.missing_skills.length})
                </div>
                <div>
                  {result.missing_skills.map((s, i) => (
                    <span key={i} style={{ ...styles.skillChip, ...styles.missingChip }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Gap Analysis */}
            {result.gap_analysis && (
              <div>
                <div style={styles.sectionTitle}>
                  <span>📋</span> Gap Analysis
                </div>
                <div style={styles.gapBox}>{result.gap_analysis}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillMatching;
