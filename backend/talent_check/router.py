from fastapi import APIRouter, HTTPException
from shared.schema import TalentCheckInput, TalentCheckResult
from profile_builder.storage import load_profile
from .company_data import load_company_skillsets, load_all_companies
from .scoring import calculate_readiness
import os

router = APIRouter()

@router.get("/companies")
def list_companies():
    data = load_all_companies()
    return sorted(list(data.keys()))

@router.post("/check-talent", response_model=TalentCheckResult)
def check_talent(data: TalentCheckInput):
    # data.profile_id is actually the email in our implementation
    email = data.profile_id
    filepath = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "profiles", f"{email.replace('@', '_at_').replace('.', '_')}.json")
    
    try:
        profile = load_profile(filepath)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Profile not found.")
        
    required_skillsets = load_company_skillsets(data.company_name)
    
    res = calculate_readiness(profile, data.company_name, required_skillsets)
    return TalentCheckResult(**res)
