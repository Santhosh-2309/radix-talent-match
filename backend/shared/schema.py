from typing import List, Optional
from pydantic import BaseModel

class Skill(BaseModel):
    skill_name: str
    category_code: Optional[str] = None
    evidence: Optional[str] = None
    confidence: Optional[str] = None

class ExtractedSkillList(BaseModel):
    source_type: Optional[str] = None
    skills: List[Skill]

class CandidateProfile(BaseModel):
    id: str
    name: str
    skills: List[Skill]
    experience_years: int

class TalentCheckResult(BaseModel):
    score: float
    feedback: str
    passed: bool

class SkillMatchResult(BaseModel):
    overall_score: float
    matching_skills: List[str]
    missing_skills: List[str]
    gap_analysis: str

class JDInput(BaseModel):
    jd_text: str

class ResumeInput(BaseModel):
    resume_text: str

class ProfileBuilderInput(BaseModel):
    name: str
    skills: List[Skill]
    experience_years: int

class TalentCheckInput(BaseModel):
    profile_id: str
    company_name: str

class SkillMatchingInput(BaseModel):
    profile_id: str
    jd_id: str
