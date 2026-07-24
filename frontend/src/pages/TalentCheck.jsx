import { useState } from 'react';

function TalentCheck() {
  const [profileId, setProfileId] = useState('');
  const [company, setCompany] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    const res = await fetch('http://localhost:8000/api/talent/check-talent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profileId, company_name: company })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>Talent Check</h2>
      <div className="panel">
        <input 
          type="text" 
          placeholder="Profile ID" 
          value={profileId} 
          onChange={(e) => setProfileId(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Target Company" 
          value={company} 
          onChange={(e) => setCompany(e.target.value)} 
        />
        <button onClick={handleCheck}>Run Check</button>
        {result && (
          <div style={{marginTop: '1rem'}}>
            <h3>Result:</h3>
            <pre style={{backgroundColor: '#111', padding: '1rem', borderRadius: '4px'}}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default TalentCheck;
