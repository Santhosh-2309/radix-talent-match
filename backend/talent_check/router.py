from fastapi import APIRouter
from shared.schema import TalentCheckInput, TalentCheckResult
from profile_builder.storage import load_profile
from .scoring import calculate_readiness
from .company_data import list_companies

router = APIRouter()

@router.post("/check-talent", response_model=TalentCheckResult)
def check_talent(data: TalentCheckInput):
    # profile_id is used as the profile name for lookup
    profile = load_profile(data.profile_id)
    result = calculate_readiness(profile, data.company_name)
    return result

@router.get("/companies")
def get_companies():
    """List available companies for talent check."""
    return {"companies": list_companies()}
