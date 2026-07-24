from fastapi import APIRouter
from shared.schema import SkillMatchingInput, SkillMatchResult
from profile_builder.storage import load_profile
from jd_analytics.storage import load_jd_result
from .matcher import match_skills

router = APIRouter()

@router.post("/match-skills", response_model=SkillMatchResult)
def do_match_skills(data: SkillMatchingInput):
    # profile_id is used as the profile name, jd_id as the JD source file
    profile = load_profile(data.profile_id)
    jd_skills = load_jd_result(data.jd_id)
    result = match_skills(profile, jd_skills)
    return result
