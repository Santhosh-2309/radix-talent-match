import { useState } from 'react';
import { motion } from 'framer-motion';

function JDAnalytics() {
  const [file, setFile] = useState(null);
  const [company, setCompany] = useState('Unknown');
  const [role, setRole] = useState('Unknown');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('company', company);
    formData.append('role', role);

    const res = await fetch('http://localhost:8000/api/jd/analyze-jd', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2>JD Analytics</h2>
      <div className="panel">
        <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
        <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <input 
          type="file" 
          accept=".pdf,.docx" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <button onClick={handleAnalyze} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze JD'}</button>
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

export default JDAnalytics;
