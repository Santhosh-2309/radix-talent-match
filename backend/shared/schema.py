from typing import List, Optional
from pydantic import BaseModel

class Skill(BaseModel):
    name: str
    category: Optional[str] = None
    confidence: Optional[float] = None

class ExtractedSkillList(BaseModel):
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
