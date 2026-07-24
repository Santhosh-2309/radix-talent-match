import os
from typing import Any

class GroqStubClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY", "dummy_key")

    def extract_jd_skills(self, jd_text: str) -> Any:
        return {
            "skills": [
                {"name": "Python", "category": "Programming", "confidence": 0.9},
                {"name": "React", "category": "Frontend", "confidence": 0.85}
            ]
        }

    def extract_resume_skills(self, resume_text: str) -> Any:
        return {
            "skills": [
                {"name": "Python", "category": "Programming", "confidence": 0.95},
                {"name": "Java", "category": "Programming", "confidence": 0.8}
            ]
        }

    def run_talent_check(self, profile: dict, company: str) -> Any:
        return {
            "score": 85.0,
            "feedback": f"Strong fit for {company}",
            "passed": True
        }

    def run_skill_match(self, profile: dict, jd: dict) -> Any:
        return {
            "overall_score": 90.0,
            "matching_skills": ["Python"],
            "missing_skills": ["React"],
            "gap_analysis": "Missing frontend experience."
        }

llm_client = GroqStubClient()
