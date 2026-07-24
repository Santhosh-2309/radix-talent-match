# Schema Data Contracts

jd_analytics:
  input:
    jd_text: string
  output:
    skills:
      - name: string
        category: string
        confidence: float

resume_parsing:
  input:
    resume_text: string
  output:
    skills:
      - name: string
        category: string
        confidence: float

profile_builder:
  input:
    name: string
    skills:
      - name: string
        category: string
    experience_years: int
  output:
    id: string
    name: string
    skills:
      - name: string
        category: string
    experience_years: int

talent_check:
  input:
    profile_id: string
    company_name: string
  output:
    score: float
    feedback: string
    passed: boolean

skill_matching:
  input:
    profile_id: string
    jd_id: string
  output:
    overall_score: float
    matching_skills:
      - string
    missing_skills:
      - string
    gap_analysis: string
