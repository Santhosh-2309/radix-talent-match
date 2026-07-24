import json
import os
from .models import CandidateProfile
from shared.schema import ExtractedSkillList

def save_profile(profile: CandidateProfile, filepath: str) -> None:
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(profile.model_dump_json(indent=2))

def load_profile(filepath: str) -> CandidateProfile:
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Profile not found: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return CandidateProfile(**data)

def merge_resume_skills(profile: CandidateProfile, extracted: ExtractedSkillList) -> CandidateProfile:
    existing_skill_names = {s.skill_name.lower() for s in profile.skills}
    
    for skill in extracted.skills:
        if skill.skill_name.lower() not in existing_skill_names:
            profile.skills.append(skill)
            existing_skill_names.add(skill.skill_name.lower())
            
    return profile
