from fastapi import APIRouter
from shared.schema import JDInput, ExtractedSkillList, Skill
from shared.llm_client import llm_client

router = APIRouter()

@router.post("/analyze-jd", response_model=ExtractedSkillList)
def analyze_jd(data: JDInput):
    # STUB implementation
    res = llm_client.extract_jd_skills(data.jd_text)
    skills = [Skill(**s) for s in res["skills"]]
    return ExtractedSkillList(skills=skills)
