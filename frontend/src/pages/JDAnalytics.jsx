import { useState } from 'react';

function JDAnalytics() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    const res = await fetch('http://localhost:8000/api/jd/analyze-jd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jd_text: text })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>JD Analytics</h2>
      <div className="panel">
        <textarea 
          placeholder="Paste Job Description here..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
        />
        <button onClick={handleAnalyze}>Analyze JD</button>
        {result && (
          <div style={{marginTop: '1rem'}}>
            <h3>Extracted Skills:</h3>
            <pre style={{backgroundColor: '#111', padding: '1rem', borderRadius: '4px'}}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default JDAnalytics;
