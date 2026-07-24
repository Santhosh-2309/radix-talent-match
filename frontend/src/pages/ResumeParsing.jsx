import { useState } from 'react';
import { motion } from 'framer-motion';

function ResumeParsing() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:8000/api/resume/parse-resume', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2>Resume Parsing</h2>
      <div className="panel">
        <input 
          type="file" 
          accept=".pdf,.docx" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <button onClick={handleParse} disabled={loading}>{loading ? 'Parsing...' : 'Parse Resume'}</button>
        {result && (
          <div style={{marginTop: '1rem'}}>
            <h3>Extracted Skills:</h3>
            <pre style={{backgroundColor: '#111', padding: '1rem', borderRadius: '4px'}}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ResumeParsing;
