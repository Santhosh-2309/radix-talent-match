import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import JDAnalytics from './pages/JDAnalytics';
import ResumeParsing from './pages/ResumeParsing';
import ProfileBuilder from './pages/ProfileBuilder';
import TalentCheck from './pages/TalentCheck';
import SkillMatching from './pages/SkillMatching';
import './index.css';

function App() {
  const [health, setHealth] = useState('Checking backend health...');

  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(`Backend status: ${data.status}`))
      .catch((err) => setHealth(`Backend offline`));
  }, []);

  return (
    <Router>
      <div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/jd">JD Analytics</Link>
          <Link to="/resume">Resume Parsing</Link>
          <Link to="/profile">Profile Builder</Link>
          <Link to="/talent">Talent Check</Link>
          <Link to="/match">Skill Matching</Link>
          <span style={{marginLeft: 'auto', fontSize: '0.8rem', color: '#888'}}>{health}</span>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jd" element={<JDAnalytics />} />
            <Route path="/resume" element={<ResumeParsing />} />
            <Route path="/profile" element={<ProfileBuilder />} />
            <Route path="/talent" element={<TalentCheck />} />
            <Route path="/match" element={<SkillMatching />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
