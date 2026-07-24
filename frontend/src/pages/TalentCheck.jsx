import { useState, useEffect } from 'react';

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
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    border: '1px solid #2a2a4a',
  },
  scoreNumber: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1,
  },
  badge: {
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontWeight: 700,
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
  },
  badgePass: {
    background: 'rgba(46, 213, 115, 0.15)',
    color: '#2ed573',
    border: '1px solid rgba(46, 213, 115, 0.3)',
  },
  badgeFail: {
    background: 'rgba(255, 71, 87, 0.15)',
    color: '#ff4757',
    border: '1px solid rgba(255, 71, 87, 0.3)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 0.5rem',
    borderBottom: '2px solid #333',
    color: '#d4a04c',
    fontWeight: 600,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  td: {
    padding: '0.6rem 0.5rem',
    borderBottom: '1px solid #222',
  },
  gapYes: {
    color: '#ff4757',
    fontWeight: 600,
  },
  gapNo: {
    color: '#2ed573',
    fontWeight: 600,
  },
  levelBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  barTrack: {
    flex: 1,
    height: '6px',
    background: '#222',
    borderRadius: '3px',
    overflow: 'hidden',
    minWidth: '60px',
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

function TalentCheck() {
  const [profileName, setProfileName] = useState('');
  const [company, setCompany] = useState('');
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/talent/companies')
      .then(r => r.json())
      .then(d => setCompanies(d.companies || []))
      .catch(() => {});
  }, []);

  const handleCheck = async () => {
    if (!profileName.trim() || !company.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setResult(null);
    setFeedback(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/talent/check-talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileName, company_name: company })
      });
      const data = await res.json();

      if (data.error || data.detail) {
        setError(data.error || (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)));
      } else {
        setResult(data);
        try {
          setFeedback(JSON.parse(data.feedback));
        } catch {
          setFeedback(null);
        }
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
        <span style={styles.icon}>🎯</span>
        <h2 style={{ margin: 0 }}>Talent Check</h2>
      </div>
      <p style={styles.subtitle}>
        Score your profile against a company's baseline skill requirements across 12 technical categories.
      </p>

      <div className="panel">
        <div style={styles.form}>
          <div>
            <div style={styles.label}>Profile Name</div>
            <input
              id="talent-profile-name"
              type="text"
              placeholder="e.g. John Doe"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>
          <div>
            <div style={styles.label}>Target Company</div>
            <select
              id="talent-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#222',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px',
                marginBottom: '1rem',
              }}
            >
              <option value="">Select a company...</option>
              {companies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button id="talent-check-btn" onClick={handleCheck} disabled={loading}>
            {loading ? 'Analyzing...' : '🚀 Run Talent Check'}
          </button>
        </div>

        {error && <div style={{ ...styles.errorMsg, marginTop: '1rem' }}>{error}</div>}
        {loading && <div style={styles.loading}>⏳ Calculating readiness score...</div>}

        {result && !loading && (
          <div style={{ marginTop: '1.5rem' }}>
            {/* Score Card */}
            <div style={styles.scoreCard}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...styles.scoreNumber, color: getScoreColor(result.score) }}>
                  {result.score}
                </div>
                <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  Readiness Score
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...styles.badge,
                  ...(result.passed ? styles.badgePass : styles.badgeFail),
                }}>
                  {result.passed ? '✅ PASSED' : '❌ NOT READY'}
                </div>
                <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  Threshold: 50
                </div>
              </div>
            </div>

            {/* Gap Table */}
            {feedback && feedback.skillset_gap && (
              <div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                  📊 Category Breakdown — {feedback.company}
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Category</th>
                        <th style={styles.th}>Required</th>
                        <th style={styles.th}>Your Level</th>
                        <th style={styles.th}>Coverage</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedback.skillset_gap.map((row) => {
                        const pct = row.required_level > 0
                          ? Math.min(Math.round((row.candidate_level / row.required_level) * 100), 100)
                          : 100;
                        const barColor = row.gap ? '#ff4757' : '#2ed573';
                        return (
                          <tr key={row.category_code}>
                            <td style={{ ...styles.td, fontWeight: 600 }}>{row.category_code}</td>
                            <td style={styles.td}>{row.required_level}</td>
                            <td style={styles.td}>{row.candidate_level}</td>
                            <td style={styles.td}>
                              <div style={styles.levelBar}>
                                <div style={styles.barTrack}>
                                  <div style={{
                                    width: `${pct}%`,
                                    height: '100%',
                                    background: barColor,
                                    borderRadius: '3px',
                                    transition: 'width 0.6s ease',
                                  }} />
                                </div>
                                <span style={{ fontSize: '0.8rem', color: '#888', minWidth: '35px' }}>
                                  {pct}%
                                </span>
                              </div>
                            </td>
                            <td style={row.gap ? styles.gapYes : styles.gapNo}>
                              {row.gap ? '⚠ Gap' : '✓ OK'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TalentCheck;
