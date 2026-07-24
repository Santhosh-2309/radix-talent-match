# Technical Specification

## Stack
- Backend: Python 3.12 + FastAPI
- Frontend: React + Vite, react-router-dom for routing
- LLM: Groq API for LLM calls
- Storage: JSON file storage (no DB)

## Data Contracts (Schemas)

### Skill
- `name` (string)
- `category` (string, optional)
- `confidence` (float, optional)

### ExtractedSkillList
- `skills` (list of Skill)

### CandidateProfile
- `id` (string)
- `name` (string)
- `skills` (list of Skill)
- `experience_years` (int)

### TalentCheckResult
- `score` (float)
- `feedback` (string)
- `passed` (boolean)

### SkillMatchResult
- `overall_score` (float)
- `matching_skills` (list of string)
- `missing_skills` (list of string)
- `gap_analysis` (string)
