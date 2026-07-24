from fastapi import APIRouter
from shared.schema import ResumeInput, ExtractedSkillList, Skill
from shared.llm_client import llm_client

router = APIRouter()

@router.post("/parse-resume", response_model=ExtractedSkillList)
def parse_resume(data: ResumeInput):
    # STUB implementation
    res = llm_client.extract_resume_skills(data.resume_text)
    skills = [Skill(**s) for s in res["skills"]]
    return ExtractedSkillList(skills=skills)
