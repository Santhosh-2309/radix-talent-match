from fastapi import APIRouter
from shared.schema import SkillMatchingInput, SkillMatchResult
from shared.llm_client import llm_client

router = APIRouter()

@router.post("/match-skills", response_model=SkillMatchResult)
def match_skills(data: SkillMatchingInput):
    # STUB implementation
    res = llm_client.run_skill_match({"id": data.profile_id}, {"id": data.jd_id})
    return SkillMatchResult(**res)
