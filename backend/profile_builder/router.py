from fastapi import APIRouter
from shared.schema import ProfileBuilderInput, CandidateProfile
import uuid

router = APIRouter()

@router.post("/build-profile", response_model=CandidateProfile)
def build_profile(data: ProfileBuilderInput):
    # STUB implementation
    profile_id = str(uuid.uuid4())
    return CandidateProfile(
        id=profile_id,
        name=data.name,
        skills=data.skills,
        experience_years=data.experience_years
    )
