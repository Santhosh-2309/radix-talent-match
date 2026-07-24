# User Journey & App Flow

## Module 1: JD Analytics
- **Given** I am a user with a job description
- **When** I upload the JD text
- **Then** I see a list of extracted skills for the job

## Module 2: Resume Parsing
- **Given** I am a user with a resume
- **When** I upload my resume text
- **Then** I see a list of my extracted skills

## Module 3: Profile Builder
- **Given** I have extracted my skills
- **When** I build and save my profile
- **Then** my CandidateProfile is saved and I can load it later

## Module 4: Talent Check
- **Given** I have a saved Profile
- **When** I run a Talent Check against a target company
- **Then** I see if I pass their baseline talent check with feedback

## Module 5: Skill Matching
- **Given** I have a saved Profile and an analyzed JD
- **When** I run a Skill Match
- **Then** I see my match score and a list of skill gaps
