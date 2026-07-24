from fastapi import APIRouter, HTTPException
from shared.schema import SkillMatchingInput, SkillMatchResult, ExtractedSkillList
from profile_builder.storage import load_profile
from .matcher import match_skills
import os
import json

router = APIRouter()

PROFILES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "profiles")
EXTRACTED_JDS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "extracted_jds")

@router.post("/match", response_model=SkillMatchResult)
def match_talent(data: SkillMatchingInput):
    # Load profile
    safe_email = data.profile_id.replace("@", "_at_").replace(".", "_")
    profile_path = os.path.join(PROFILES_DIR, f"{safe_email}.json")
    try:
        profile = load_profile(profile_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Profile not found for {data.profile_id}")
        
    # Load JD extraction
    safe_jd = data.jd_id.replace(" ", "_").replace(".pdf", "").replace(".docx", "")
    jd_path = os.path.join(EXTRACTED_JDS_DIR, f"{safe_jd}.json")
    try:
        with open(jd_path, "r") as f:
            jd_data = json.load(f)
            jd_skills = ExtractedSkillList(**jd_data)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"JD extraction not found for {data.jd_id}")
        
    res = match_skills(profile.skills, jd_skills)
    return res
