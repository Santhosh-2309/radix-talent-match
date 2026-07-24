import { useState } from 'react';

function SkillMatching() {
  const [profileId, setProfileId] = useState('');
  const [jdId, setJdId] = useState('');
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    const res = await fetch('http://localhost:8000/api/skill/match-skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profileId, jd_id: jdId })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>Skill Matching</h2>
      <div className="panel">
        <input 
          type="text" 
          placeholder="Profile ID" 
          value={profileId} 
          onChange={(e) => setProfileId(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="JD ID" 
          value={jdId} 
          onChange={(e) => setJdId(e.target.value)} 
        />
        <button onClick={handleMatch}>Run Match</button>
        {result && (
          <div style={{marginTop: '1rem'}}>
            <h3>Match Result:</h3>
            <pre style={{backgroundColor: '#111', padding: '1rem', borderRadius: '4px'}}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillMatching;
