import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function AuroraBackground() {
  return (
    <div className="aurora-container">
      <div className="aurora-blob aurora-1"></div>
      <div className="aurora-blob aurora-2"></div>
      <div className="aurora-blob aurora-3"></div>
    </div>
  );
}

const features = [
  {
    title: "Upload a Job Description",
    desc: "See exactly what skills a role actually requires, extracted by AI from real prose, not just keyword scanning."
  },
  {
    title: "Upload Your Resume",
    desc: "We extract your real technical signal, with evidence for every skill we find."
  },
  {
    title: "Talent Check",
    desc: "See your readiness score against a specific company's hiring bar, across 12 core skillsets, out of 164+ companies."
  },
  {
    title: "Skill Match",
    desc: "See exactly how well you match one specific job posting, with a clear list of what's missing."
  }
];

const steps = [
  "JD Analytics",
  "Resume Parsing",
  "Profile Builder",
  "Talent Check",
  "Skill Matching"
];

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '4rem' }}>
      <AuroraBackground />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="label-muted" style={{ marginBottom: '1rem', display: 'block' }}>
          Analyzing candidate signal...
        </span>
        <h1 style={{ letterSpacing: '3px', fontWeight: 500 }}>
          RADIX TALENT MATCH
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}
      >
        Extract clear readiness signals from noisy candidate data. Evaluate resumes against real hiring bars instantly.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{ marginTop: '2.5rem', marginBottom: '4rem' }}
      >
        <Link to="/pipeline" style={{ 
          display: 'inline-block', 
          padding: '1rem 2rem', 
          backgroundColor: 'var(--accent-cyan)', 
          color: '#000', 
          fontWeight: 'bold', 
          textDecoration: 'none', 
          borderRadius: '4px',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)'
        }}>
          Start Candidate Pipeline
        </Link>
      </motion.div>

      {/* What This Does Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}
      >
        <h2 style={{ color: 'var(--accent-cyan)', textAlign: 'center', marginBottom: '2rem' }}>What This Does</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {features.map((f, i) => (
            <div key={i} className="panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(25, 25, 25, 0.8)', margin: 0, backdropFilter: 'blur(10px)' }}>
              <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem' }}>{f.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        style={{ maxWidth: '900px', margin: '4rem auto 0 auto' }}
      >
        <h2 style={{ color: 'var(--accent-cyan)', marginBottom: '2rem' }}>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', 
                    backgroundColor: 'var(--bg-darker)', border: '2px solid var(--accent-cyan)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', color: 'var(--accent-cyan)'
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '100px' }}>{step}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ height: '2px', width: '40px', backgroundColor: '#333', marginTop: '-30px' }}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
}

export default Home;
