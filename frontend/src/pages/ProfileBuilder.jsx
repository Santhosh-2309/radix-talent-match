import { useState } from 'react';

function ProfileBuilder() {
  const [name, setName] = useState('');
  const [exp, setExp] = useState(0);
  const [result, setResult] = useState(null);

  const handleBuild = async () => {
    const res = await fetch('http://localhost:8000/api/profile/build-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: name, 
        skills: [{name: 'Python', category: 'Programming'}, {name: 'React', category: 'Frontend'}],
        experience_years: parseInt(exp)
      })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>Profile Builder</h2>
      <div className="panel">
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Years of Experience" 
          value={exp} 
          onChange={(e) => setExp(e.target.value)} 
        />
        <button onClick={handleBuild}>Save Profile</button>
        {result && (
          <div style={{marginTop: '1rem'}}>
            <h3>Saved Profile:</h3>
            <pre style={{backgroundColor: '#111', padding: '1rem', borderRadius: '4px'}}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileBuilder;
