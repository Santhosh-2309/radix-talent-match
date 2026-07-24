import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import JDAnalytics from './pages/JDAnalytics';
import ResumeParsing from './pages/ResumeParsing';
import ProfileBuilder from './pages/ProfileBuilder';
import TalentCheck from './pages/TalentCheck';
import SkillMatching from './pages/SkillMatching';
import './index.css';

const navVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

function App() {
  const [health, setHealth] = useState('Checking signal...');

  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(`SIGNAL STATUS: ${data.status.toUpperCase()}`))
      .catch((err) => setHealth(`SIGNAL OFFLINE`));
  }, []);

  return (
    <Router>
      <div>
        <nav className="nav-container">
          <div className="nav-logo-wrapper">
            <div className="nav-logo-dot"></div>
            <motion.div custom={0} initial="hidden" animate="visible" variants={navVariants}>
              <Link to="/" className="nav-logo">RADIX</Link>
            </motion.div>
          </div>
          <div className="nav-links">
            {['JD Analytics', 'Resume Parsing', 'Profile Builder', 'Talent Check', 'Skill Matching'].map((item, i) => {
              const route = item === 'JD Analytics' ? '/jd' 
                : item === 'Resume Parsing' ? '/resume'
                : item === 'Profile Builder' ? '/profile'
                : item === 'Talent Check' ? '/talent'
                : '/match';
              
              return (
                <motion.div
                  key={item}
                  custom={i + 1}
                  initial="hidden"
                  animate="visible"
                  variants={navVariants}
                >
                  <Link to={route} className="nav-link">{item}</Link>
                </motion.div>
              );
            })}
          </div>
          <div className="nav-gradient-bar"></div>
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
