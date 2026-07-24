from pydantic import BaseModel
from typing import List
from shared.schema import Skill

class CandidateProfile(BaseModel):
    name: str
    email: str
    education: str
    skills: List[Skill] = []
    hackathons: List[str] = []
    internships: List[str] = []
    certifications: List[str] = []
    preferred_roles: List[str] = []
    cv_file: str = ""

def get_empty_profile() -> CandidateProfile:
    return CandidateProfile(
        name="",
        email="",
        education="",
        skills=[],
        hackathons=[],
        internships=[],
        certifications=[],
        preferred_roles=[],
        cv_file=""
    )
