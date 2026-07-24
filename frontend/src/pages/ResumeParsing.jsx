import { useState } from 'react';

function ResumeParsing() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const handleParse = async () => {
    const res = await fetch('http://localhost:8000/api/resume/parse-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text: text })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>Resume Parsing</h2>
      <div className="panel">
        <textarea 
          placeholder="Paste Resume here..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
        />
        <button onClick={handleParse}>Parse Resume</button>
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

export default ResumeParsing;
