<<<<<<< HEAD
from fastapi import APIRouter
from shared.schema import ProfileBuilderInput, CandidateProfile
from .storage import save_profile, load_profile, list_profiles
import uuid

router = APIRouter()

@router.post("/build-profile", response_model=CandidateProfile)
def build_profile(data: ProfileBuilderInput):
    profile_id = str(uuid.uuid4())
    profile = CandidateProfile(
        id=profile_id,
        name=data.name,
        skills=data.skills,
        experience_years=data.experience_years
    )
    # Persist to disk
    save_profile(profile)
    return profile

@router.get("/load-profile/{name}")
def get_profile(name: str):
    try:
        profile = load_profile(name)
        return profile
    except FileNotFoundError as e:
        return {"error": str(e)}

@router.get("/list-profiles")
def get_all_profiles():
    return {"profiles": list_profiles()}
=======
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
>>>>>>> origin/main
