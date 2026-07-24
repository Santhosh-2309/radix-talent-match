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
