from fastapi import APIRouter, HTTPException, Body
import os
from .models import CandidateProfile, get_empty_profile
from .storage import save_profile, load_profile, merge_resume_skills
from shared.schema import ExtractedSkillList

router = APIRouter()

PROFILES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "profiles")

def get_profile_path(email: str) -> str:
    # simple sanitization
    safe_email = email.replace("@", "_at_").replace(".", "_")
    return os.path.join(PROFILES_DIR, f"{safe_email}.json")

@router.post("", response_model=CandidateProfile)
def create_or_update_profile(profile: CandidateProfile = Body(...)):
    if not profile.email:
        raise HTTPException(status_code=400, detail="Email is required")
    filepath = get_profile_path(profile.email)
    save_profile(profile, filepath)
    return profile

@router.get("/list")
def list_profiles():
    if not os.path.exists(PROFILES_DIR):
        return []
    emails = []
    for f in os.listdir(PROFILES_DIR):
        if f.endswith(".json"):
            try:
                prof = load_profile(os.path.join(PROFILES_DIR, f))
                if prof.email:
                    emails.append(prof.email)
            except Exception:
                pass
    return sorted(list(set(emails)))

@router.get("/{email}", response_model=CandidateProfile)
def get_profile(email: str):
    filepath = get_profile_path(email)
    try:
        return load_profile(filepath)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Profile not found")

@router.post("/{email}/merge-skills", response_model=CandidateProfile)
def merge_skills(email: str, extracted: ExtractedSkillList = Body(...)):
    filepath = get_profile_path(email)
    try:
        profile = load_profile(filepath)
    except FileNotFoundError:
        # If profile doesn't exist, create an empty one with the email
        profile = get_empty_profile()
        profile.email = email
        
    updated_profile = merge_resume_skills(profile, extracted)
    save_profile(updated_profile, filepath)
    return updated_profile
