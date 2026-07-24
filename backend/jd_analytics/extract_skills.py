import json
from pydantic import ValidationError
from shared.schema import ExtractedSkillList, Skill
from shared.llm_client import llm_client

CATEGORIES = "DSA, COD (Coding), OOD, APTI (Aptitude), COMM (Communication), AI, CLOUD, SQL, SWE, SYSD (System Design), NETW (Networking), OS, OTHER"

JD_SYSTEM_PROMPT = f"""You are an expert technical recruiter analyzing Job Descriptions.
Your goal is to extract key skills and requirements and map them to these categories:
{CATEGORIES}

You MUST output strictly in JSON format. The JSON must have a single key "skills" containing a list of objects.
Each object must match this schema:
- skill_name: string (the skill name)
- category_code: string (one of the category codes above)
- evidence: string (a short quote from the text showing this requirement)
- confidence: string (high, medium, or low)
"""

def extract_skills_from_jd(text: str, source_file: str, company: str, role: str) -> ExtractedSkillList:
    user_prompt = f"Company: {company}\nRole: {role}\n\nJob Description Text:\n{text}"
    
    for attempt in range(2):
        try:
            response = llm_client.call_llm(JD_SYSTEM_PROMPT, user_prompt)
            data = json.loads(response)
            skills = [Skill(**s) for s in data.get("skills", [])]
            return ExtractedSkillList(source_type="jd", skills=skills)
        except (json.JSONDecodeError, ValidationError) as e:
            if attempt == 1:
                raise ValueError(f"Failed to parse LLM response: {e}")
            print(f"Retrying after error: {e}")
