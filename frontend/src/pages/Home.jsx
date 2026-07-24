function Home() {
  return (
    <div>
      <h1>RADIX Talent Match</h1>
      <p>Welcome to the RADIX Talent Match tool.</p>
      <div className="panel">
        <p>Use the navigation bar above to explore the 5 modules:</p>
        <ul>
          <li><strong>JD Analytics:</strong> Parse and extract skills from Job Descriptions</li>
          <li><strong>Resume Parsing:</strong> Parse and extract skills from Resumes</li>
          <li><strong>Profile Builder:</strong> Build and save candidate profiles</li>
          <li><strong>Talent Check:</strong> Score a profile against a company's general requirements</li>
          <li><strong>Skill Matching:</strong> Match skills against a specific Job Description</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
