import json
from pydantic import ValidationError
from shared.schema import ExtractedSkillList, Skill
from shared.llm_client import llm_client

CATEGORIES = "DSA, COD (Coding), OOD, APTI (Aptitude), COMM (Communication), AI, CLOUD, SQL, SWE, SYSD (System Design), NETW (Networking), OS, OTHER"

RESUME_SYSTEM_PROMPT = f"""You are an expert technical recruiter analyzing a candidate's Resume.
Your goal is to extract the candidate's skills, tools, and expertise and map them to these categories:
{CATEGORIES}

You MUST output strictly in JSON format. The JSON must have a single key "skills" containing a list of objects.
Each object must match this schema:
- skill_name: string (the skill name)
- category_code: string (one of the category codes above)
- evidence: string (a short quote or bullet point from the resume proving this skill)
- confidence: string (high, medium, or low)
"""

def extract_skills_from_resume(text: str, source_file: str) -> ExtractedSkillList:
    user_prompt = f"Resume Text:\n{text}"
    
    for attempt in range(2):
        try:
            response = llm_client.call_llm(RESUME_SYSTEM_PROMPT, user_prompt)
            data = json.loads(response)
            skills = [Skill(**s) for s in data.get("skills", [])]
            return ExtractedSkillList(source_type="resume", skills=skills)
        except (json.JSONDecodeError, ValidationError) as e:
            if attempt == 1:
                raise ValueError(f"Failed to parse LLM response: {e}")
            print(f"Retrying after error: {e}")
