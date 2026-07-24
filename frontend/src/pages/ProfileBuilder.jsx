import { useState } from 'react';
import { motion } from 'framer-motion';

function ProfileBuilder() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    education: '',
    skills: [],
    hackathons: '',
    internships: '',
    certifications: '',
    preferred_roles: '',
    cv_file: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Convert comma separated strings to arrays for backend
    const payload = {
      ...profile,
      hackathons: profile.hackathons ? profile.hackathons.split(',').map(s => s.trim()).filter(Boolean) : [],
      internships: profile.internships ? profile.internships.split(',').map(s => s.trim()).filter(Boolean) : [],
      certifications: profile.certifications ? profile.certifications.split(',').map(s => s.trim()).filter(Boolean) : [],
      preferred_roles: profile.preferred_roles ? profile.preferred_roles.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    const res = await fetch('http://localhost:8000/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      setMessage('Profile saved successfully!');
    } else {
      const err = await res.json();
      setMessage(`Error: ${err.detail || 'Failed to save'}`);
    }
  };

  const handleLoad = async () => {
    if (!profile.email) {
      setMessage('Please enter an email to load.');
      return;
    }
    const res = await fetch(`http://localhost:8000/api/profile/${encodeURIComponent(profile.email)}`);
    if (res.ok) {
      const data = await res.json();
      // Convert arrays back to comma separated strings
      setProfile({
        ...data,
        hackathons: data.hackathons ? data.hackathons.join(', ') : '',
        internships: data.internships ? data.internships.join(', ') : '',
        certifications: data.certifications ? data.certifications.join(', ') : '',
        preferred_roles: data.preferred_roles ? data.preferred_roles.join(', ') : '',
      });
      setMessage('Profile loaded successfully!');
    } else {
      setMessage('Profile not found.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2>Profile Builder</h2>
      <div className="panel">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input type="email" name="email" placeholder="Email (Required for Load/Save)" value={profile.email} onChange={handleChange} />
          <button onClick={handleLoad} style={{ height: '38px' }}>Load Profile</button>
        </div>
        
        <input type="text" name="name" placeholder="Name" value={profile.name} onChange={handleChange} />
        <input type="text" name="education" placeholder="Education" value={profile.education} onChange={handleChange} />
        
        <input type="text" name="hackathons" placeholder="Hackathons (comma separated)" value={profile.hackathons} onChange={handleChange} />
        <input type="text" name="internships" placeholder="Internships (comma separated)" value={profile.internships} onChange={handleChange} />
        <input type="text" name="certifications" placeholder="Certifications (comma separated)" value={profile.certifications} onChange={handleChange} />
        <input type="text" name="preferred_roles" placeholder="Preferred Roles (comma separated)" value={profile.preferred_roles} onChange={handleChange} />
        <input type="text" name="cv_file" placeholder="CV Filename" value={profile.cv_file} onChange={handleChange} />

        <button onClick={handleSave} style={{ marginTop: '1rem', width: '100%' }}>Save Profile</button>
        
        {message && <p style={{ color: '#d4a04c', marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}

        <div style={{ marginTop: '2rem' }}>
          <h3>Skills (Read-Only)</h3>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>Skills are populated by merging from Resume Parsing module.</p>
          <pre style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '4px', overflowX: 'auto' }}>
            {JSON.stringify(profile.skills, null, 2)}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileBuilder;
