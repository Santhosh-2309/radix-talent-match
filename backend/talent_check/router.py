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

from pydantic import BaseModel

class RecommendationsInput(BaseModel):
    profile_id: str

class Recommendation(BaseModel):
    company_name: str
    score: float
    reason: str

class RecommendationsResult(BaseModel):
    recommendations: list[Recommendation]

@router.post("/recommendations", response_model=RecommendationsResult)
def get_recommendations(data: RecommendationsInput):
    email = data.profile_id
    filepath = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "profiles", f"{email.replace('@', '_at_').replace('.', '_')}.json")
    
    try:
        profile = load_profile(filepath)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Profile not found.")
        
    all_companies = load_all_companies()
    
    results = []
    for company_name, required_skillsets in all_companies.items():
        res = calculate_readiness(profile, company_name, required_skillsets)
        
        strengths = [b['category'] for b in res['breakdown'] if not b['gap'] and b['candidate'] > 0]
        strengths.sort(key=lambda cat: next(b['candidate'] for b in res['breakdown'] if b['category'] == cat), reverse=True)
        
        if len(strengths) >= 2:
            reason = f"Strong match — your {strengths[0]} and {strengths[1]} strengths align well with this company's requirements."
        elif len(strengths) == 1:
            reason = f"Good match — your {strengths[0]} strength aligns well with this company's requirements."
        else:
            reason = "A potential fit based on your overall profile, though specific category strengths are developing."
            
        results.append({
            "company_name": company_name,
            "score": res["score"],
            "reason": reason
        })
        
    results.sort(key=lambda x: x["score"], reverse=True)
    top_5 = results[:5]
    
    return RecommendationsResult(recommendations=[Recommendation(**r) for r in top_5])
