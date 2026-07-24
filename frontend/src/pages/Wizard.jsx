import { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';

function ScoreRing({ targetScore, label }) {
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
        <span className="score-label">{label}</span>
      </div>
    </div>
  );
}

function InsightBox({ insight }) {
  if (!insight.loading && !insight.text) return null;
  return (
    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '4px' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-cyan)' }}>✨ AI Insight</h4>
      {insight.loading ? (
        <p style={{ margin: 0, color: 'var(--text-muted)', fontStyle: 'italic' }}>Thinking...</p>
      ) : (
        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{insight.text}</p>
      )}
    </div>
  );
}

function Wizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: JD Analytics
  const [jdFile, setJdFile] = useState(null);
  const [jdCompany, setJdCompany] = useState('');
  const [jdRole, setJdRole] = useState('');
  const [jdResult, setJdResult] = useState(null);
  const [jdId, setJdId] = useState('');

  // Step 2: Resume Parsing
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);

  // Step 3: Profile Builder
  const [profile, setProfile] = useState({
    name: '', email: '', education: '', skills: [],
    hackathons: '', internships: '', certifications: '',
    preferred_roles: '', cv_file: ''
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Step 4: Talent Check
  const [companies, setCompanies] = useState([]);
  const [talentCompany, setTalentCompany] = useState('Google');
  const [talentResult, setTalentResult] = useState(null);

  // Step 5: Skill Matching
  const [matchResult, setMatchResult] = useState(null);

  // AI Insights
  const [jdInsight, setJdInsight] = useState({ loading: false, text: '' });
  const [resumeInsight, setResumeInsight] = useState({ loading: false, text: '' });
  const [profileInsight, setProfileInsight] = useState({ loading: false, text: '' });
  const [talentInsight, setTalentInsight] = useState({ loading: false, text: '' });
  const [matchInsight, setMatchInsight] = useState({ loading: false, text: '' });
  const [summaryInsight, setSummaryInsight] = useState({ loading: false, text: '' });
  const [recommendations, setRecommendations] = useState({ loading: false, data: [] });

  const fetchInsight = async (stepName, data, setter) => {
    setter({ loading: true, text: '' });
    try {
      const res = await fetch('http://localhost:8000/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step_name: stepName, data })
      });
      if (res.ok) {
        const out = await res.json();
        setter({ loading: false, text: out.explanation });
      } else {
        setter({ loading: false, text: '' });
      }
    } catch {
      setter({ loading: false, text: '' });
    }
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/talent/companies')
      .then(res => res.json())
      .then(data => {
        setCompanies(data);
        if (data.length > 0 && !data.includes('Google')) {
          setTalentCompany(data[0]);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const handleNext = async () => {
    setError('');
    if (currentStep === 5) {
      setCurrentStep(6);
      
      // Fetch Overall Assessment
      setSummaryInsight({ loading: true, text: '' });
      try {
        const res = await fetch('http://localhost:8000/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step_name: "Summary Report",
            data: {
              skills: profile.skills,
              talentCheckScore: talentResult?.score,
              talentCheckGaps: talentResult?.breakdown,
              matchScore: matchResult?.overall_score,
              matchMissing: matchResult?.missing_skills
            }
          })
        });
        const d = await res.json();
        setSummaryInsight({ loading: false, text: d.explanation });
      } catch (err) {
        setSummaryInsight({ loading: false, text: '' });
      }

      // Fetch Recommendations
      setRecommendations({ loading: true, data: [] });
      try {
        const res = await fetch('http://localhost:8000/api/talent/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_id: profile.email })
        });
        const d = await res.json();
        setRecommendations({ loading: false, data: d.recommendations });
      } catch (err) {
        setRecommendations({ loading: false, data: [] });
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleAnalyzeJD = async () => {
    if (!jdFile) return;
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', jdFile);
    formData.append('company', jdCompany || 'Unknown');
    formData.append('role', jdRole || 'Unknown');

    try {
      const res = await fetch('http://localhost:8000/api/jd/analyze-jd', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setJdResult(data);
        const safeName = jdFile.name.replace(/ /g, "_").replace(".pdf", "").replace(".docx", "");
        setJdId(safeName);
        fetchInsight('JD Analytics', data, setJdInsight);
      } else {
        const err = await res.json();
        setError(err.detail || 'Failed to analyze JD');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleParseResume = async () => {
    if (!resumeFile) return;
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', resumeFile);

    try {
      const res = await fetch('http://localhost:8000/api/resume/parse-resume', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setResumeResult(data);
        // Pre-fill profile skills and cv filename
        setProfile(prev => ({ 
          ...prev, 
          skills: data.skills || [],
          cv_file: resumeFile.name
        }));
        fetchInsight('Resume Parsing', data, setResumeInsight);
      } else {
        const err = await res.json();
        setError(err.detail || 'Failed to parse resume');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!profile.email) {
      setError('Email is required to save profile');
      return;
    }
    setLoading(true);
    setError('');
    const payload = {
      ...profile,
      hackathons: profile.hackathons ? profile.hackathons.split(',').map(s => s.trim()).filter(Boolean) : [],
      internships: profile.internships ? profile.internships.split(',').map(s => s.trim()).filter(Boolean) : [],
      certifications: profile.certifications ? profile.certifications.split(',').map(s => s.trim()).filter(Boolean) : [],
      preferred_roles: profile.preferred_roles ? profile.preferred_roles.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    try {
      const res = await fetch('http://localhost:8000/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setProfileSaved(true);
        fetchInsight('Profile Builder', payload, setProfileInsight);
      } else {
        const err = await res.json();
        setError(err.detail || 'Failed to save profile');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleRunTalentCheck = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/talent/check-talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profile.email, company_name: talentCompany })
      });
      if (res.ok) {
        const data = await res.json();
        setTalentResult(data);
        fetchInsight('Talent Check', data, setTalentInsight);
      } else {
        const err = await res.json();
        setError(err.detail || 'Failed to run talent check');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleRunSkillMatch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/skill/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profile.email, jd_id: jdId })
      });
      if (res.ok) {
        const data = await res.json();
        setMatchResult(data);
        fetchInsight('Skill Matching', data, setMatchInsight);
      } else {
        const err = await res.json();
        setError(err.detail || 'Failed to run skill match');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Candidate Pipeline Wizard</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1,2,3,4,5].map(step => (
            <div 
              key={step} 
              style={{
                width: '30px', height: '30px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: currentStep >= step ? 'var(--accent-cyan)' : '#333',
                color: currentStep >= step ? '#000' : '#888',
                fontWeight: 'bold', fontSize: '0.9rem'
              }}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {error && <p style={{ color: 'var(--accent-coral)', marginBottom: '1rem' }}>{error}</p>}

      {currentStep === 1 && (
        <div className="wizard-step">
          <span className="label-muted">Step 1 of 5</span>
          <h3>JD Analytics</h3>
          <p style={{ color: 'var(--text-muted)' }}>Upload a Job Description to extract required skills.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Company Name" value={jdCompany} onChange={(e) => setJdCompany(e.target.value)} />
            <input type="text" placeholder="Role Title" value={jdRole} onChange={(e) => setJdRole(e.target.value)} />
            <input type="file" accept=".pdf,.docx" onChange={(e) => { setJdFile(e.target.files[0]); setJdResult(null); }} />
            <button onClick={handleAnalyzeJD} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze JD'}</button>
          </div>
          {jdResult && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#111', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-cyan)' }}>Extraction Success</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Found {jdResult.skills?.length} skills in {jdId}.</p>
            </div>
          )}
          <InsightBox insight={jdInsight} />
        </div>
      )}

      {currentStep === 2 && (
        <div className="wizard-step">
          <span className="label-muted">Step 2 of 5</span>
          <h3>Resume Parsing</h3>
          <p style={{ color: 'var(--text-muted)' }}>Upload the candidate's resume to extract their skills.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="file" accept=".pdf,.docx" onChange={(e) => { setResumeFile(e.target.files[0]); setResumeResult(null); }} />
            <button onClick={handleParseResume} disabled={loading}>{loading ? 'Parsing...' : 'Parse Resume'}</button>
          </div>
          {resumeResult && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#111', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-cyan)' }}>Extraction Success</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Found {resumeResult.skills?.length} skills in {resumeFile?.name}.</p>
            </div>
          )}
          <InsightBox insight={resumeInsight} />
        </div>
      )}

      {currentStep === 3 && (
        <div className="wizard-step">
          <span className="label-muted">Step 3 of 5</span>
          <h3>Profile Builder</h3>
          <p style={{ color: 'var(--text-muted)' }}>Fill out candidate details. Skills are pre-filled from Step 2.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="email" name="email" placeholder="Email (Required)" value={profile.email} onChange={(e) => { setProfile({...profile, email: e.target.value}); setProfileSaved(false); }} />
            <input type="text" name="name" placeholder="Name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
            <input type="text" name="education" placeholder="Education" value={profile.education} onChange={(e) => setProfile({...profile, education: e.target.value})} />
            <input type="text" name="hackathons" placeholder="Hackathons (comma separated)" value={profile.hackathons} onChange={(e) => setProfile({...profile, hackathons: e.target.value})} />
            <input type="text" name="internships" placeholder="Internships (comma separated)" value={profile.internships} onChange={(e) => setProfile({...profile, internships: e.target.value})} />
            <input type="text" name="certifications" placeholder="Certifications (comma separated)" value={profile.certifications} onChange={(e) => setProfile({...profile, certifications: e.target.value})} />
            <input type="text" name="preferred_roles" placeholder="Preferred Roles (comma separated)" value={profile.preferred_roles} onChange={(e) => setProfile({...profile, preferred_roles: e.target.value})} />
            <input type="text" name="cv_file" placeholder="CV Filename" value={profile.cv_file} onChange={(e) => setProfile({...profile, cv_file: e.target.value})} />
            
            {profile.skills && profile.skills.length > 0 && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#111', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-cyan)' }}>Extracted Skills ({profile.skills.length})</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="pill pill-matched">
                      {skill.skill_name} <small style={{ opacity: 0.7, marginLeft: '4px', fontSize: '0.8em' }}>({skill.category_code})</small>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <button onClick={handleSaveProfile} disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</button>
          </div>
          {profileSaved && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#111', borderRadius: '4px' }}>
              <h4 style={{ margin: '0', color: 'var(--accent-cyan)' }}>Profile Saved Successfully</h4>
            </div>
          )}
          <InsightBox insight={profileInsight} />
        </div>
      )}

      {currentStep === 4 && (
        <div className="wizard-step">
          <span className="label-muted">Step 4 of 5</span>
          <h3>Talent Check</h3>
          <p style={{ color: 'var(--text-muted)' }}>Analyze {profile.email} against a specific company's baseline.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select value={talentCompany} onChange={(e) => { setTalentCompany(e.target.value); setTalentResult(null); }}>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={handleRunTalentCheck} disabled={loading}>{loading ? 'Analyzing...' : 'Run Talent Check'}</button>
          </div>
          {talentResult && (
            <div style={{ marginTop: '2rem' }}>
              <ScoreRing targetScore={talentResult.score} label="Signal Str" />
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <h3 style={{ color: talentResult.passed ? 'var(--accent-cyan)' : 'var(--accent-coral)' }}>
                  {talentResult.passed ? 'Passed Baseline' : 'Did Not Pass Baseline'}
                </h3>
                <div style={{ marginTop: '2rem', textAlign: 'left' }}>
                  <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>Skill Breakdown</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {talentResult.breakdown.map((gap, idx) => (
                      <span key={`gap-${idx}`} className={`pill ${gap.gap ? 'pill-missing' : 'pill-matched'}`} title={`Required: ${gap.required}, Candidate: ${gap.candidate}`}>
                        {gap.category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <InsightBox insight={talentInsight} />
        </div>
      )}

      {currentStep === 5 && (
        <div className="wizard-step">
          <span className="label-muted">Step 5 of 5</span>
          <h3>Skill Matching</h3>
          <p style={{ color: 'var(--text-muted)' }}>Match {profile.email} against the JD ({jdId}).</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={handleRunSkillMatch} disabled={loading}>{loading ? 'Matching...' : 'Run Skill Match'}</button>
          </div>
          {matchResult && (
            <div style={{ marginTop: '2rem' }}>
              <ScoreRing targetScore={matchResult.overall_score} label="Skill Match" />
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>{matchResult.gap_analysis}</p>
                <div style={{ marginTop: '2rem', textAlign: 'left' }}>
                  <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>Matched Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {matchResult.matching_skills.map((skillObj, idx) => (
                      <span key={`match-${idx}`} className="pill pill-matched">
                        {skillObj.skill_name}
                        <small style={{ opacity: 0.6, marginLeft: '4px', fontSize: '0.7em' }}>({skillObj.match_type})</small>
                      </span>
                    ))}
                    {matchResult.matching_skills.length === 0 && <span className="label-muted">None</span>}
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1rem', marginTop: '2rem', marginBottom: '1rem' }}>Missing Skills (Gaps)</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {matchResult.missing_skills.map((skill, idx) => (
                      <span key={`miss-${idx}`} className="pill pill-missing">{skill}</span>
                    ))}
                    {matchResult.missing_skills.length === 0 && <span className="label-muted">None</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
          <InsightBox insight={matchInsight} />
        </div>
      )}

      {currentStep === 6 && (
        <div className="wizard-step">
          <span className="label-muted">Summary Report</span>
          <h3 style={{ color: 'var(--accent-cyan)' }}>Candidate Pipeline Complete</h3>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="report-section" style={{ backgroundColor: '#151515', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--accent-cyan)' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent-cyan)' }}>Overall Assessment</h3>
              {summaryInsight.loading ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>Synthesizing pipeline data...</p>
              ) : (
                <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.6' }}>{summaryInsight.text || 'No overall assessment available.'}</p>
              )}
            </div>

            <div className="report-section" style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '4px' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#fff' }}>Companies That Might Be a Better Fit</h3>
              {recommendations.loading ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>Analyzing 164 companies...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recommendations.data.map((rec, i) => (
                    <div key={i} style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '4px', borderLeft: '4px solid var(--accent-cyan)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{rec.company_name}</h4>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>Score: {rec.score}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{rec.reason}</p>
                    </div>
                  ))}
                  {recommendations.data.length === 0 && <p style={{ margin: 0, color: 'var(--text-muted)' }}>No recommendations available.</p>}
                </div>
              )}
            </div>
            
            <div className="report-section" style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Profile</h4>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Name: {profile.name || 'Unknown'}</p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Email: {profile.email}</p>
              {profileInsight.text && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>✨ {profileInsight.text}</p>}
            </div>

            <div className="report-section" style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Job Description</h4>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{jdCompany} - {jdRole}</p>
              {jdResult && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {jdResult.skills.map((s, i) => <span key={i} className="pill pill-matched" style={{ opacity: 0.8 }}>{s.skill_name}</span>)}
                </div>
              )}
              {jdInsight.text && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>✨ {jdInsight.text}</p>}
            </div>

            <div className="report-section" style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Resume Extract</h4>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>File: {profile.cv_file}</p>
              {resumeResult && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {resumeResult.skills.map((s, i) => <span key={i} className="pill pill-matched" style={{ opacity: 0.8 }}>{s.skill_name}</span>)}
                </div>
              )}
              {resumeInsight.text && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>✨ {resumeInsight.text}</p>}
            </div>

            <div className="report-section" style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Talent Check (Company: {talentCompany})</h4>
              {talentResult && (
                <>
                  <p style={{ margin: 0, color: talentResult.passed ? 'var(--accent-cyan)' : 'var(--accent-coral)', fontWeight: 'bold' }}>
                    Score: {talentResult.score}/100 - {talentResult.passed ? 'Passed' : 'Failed'} Baseline
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {talentResult.breakdown.map((gap, i) => (
                      <span key={i} className={`pill ${gap.gap ? 'pill-missing' : 'pill-matched'}`}>{gap.category}</span>
                    ))}
                  </div>
                </>
              )}
              {talentInsight.text && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>✨ {talentInsight.text}</p>}
            </div>

            <div className="report-section" style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Skill Match</h4>
              {matchResult && (
                <>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>Score: {matchResult.overall_score}%</p>
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>Matched:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {matchResult.matching_skills.map((s, i) => <span key={i} className="pill pill-matched">{s.skill_name}</span>)}
                    </div>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>Missing:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {matchResult.missing_skills.map((s, i) => <span key={i} className="pill pill-missing">{s}</span>)}
                    </div>
                  </div>
                </>
              )}
              {matchInsight.text && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>✨ {matchInsight.text}</p>}
            </div>

          </div>
          
          <button 
            onClick={() => {
              setCurrentStep(1);
              setJdFile(null); setJdCompany(''); setJdRole(''); setJdResult(null); setJdId('');
              setResumeFile(null); setResumeResult(null);
              setProfile({ name: '', email: '', education: '', skills: [], hackathons: '', internships: '', certifications: '', preferred_roles: '', cv_file: '' });
              setProfileSaved(false);
              setTalentResult(null);
              setMatchResult(null);
              setJdInsight({ loading: false, text: '' });
              setResumeInsight({ loading: false, text: '' });
              setProfileInsight({ loading: false, text: '' });
              setTalentInsight({ loading: false, text: '' });
              setMatchInsight({ loading: false, text: '' });
              setSummaryInsight({ loading: false, text: '' });
              setRecommendations({ loading: false, data: [] });
            }} 
            style={{ marginTop: '2rem', width: '100%', padding: '1rem', backgroundColor: 'var(--accent-cyan)', color: '#000', fontWeight: 'bold' }}
          >
            Start New Candidate
          </button>
        </div>
      )}

      {currentStep < 6 && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
          <button 
            onClick={handleBack} 
            disabled={currentStep === 1 || loading}
            style={{ flex: 1, background: 'transparent', border: '1px solid #555' }}
          >
            Back
          </button>
          <button 
            onClick={handleNext} 
            disabled={
              loading || 
              (currentStep === 1 && !jdResult) ||
              (currentStep === 2 && !resumeResult) ||
              (currentStep === 3 && !profileSaved) ||
              (currentStep === 4 && !talentResult) ||
              (currentStep === 5 && !matchResult)
            }
            style={{ flex: 1 }}
          >
            {currentStep === 5 ? 'Finish' : 'Next'}
          </button>
        </div>
      )}

    </motion.div>
  );
}

export default Wizard;
