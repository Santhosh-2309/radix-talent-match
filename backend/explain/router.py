from fastapi import APIRouter
from pydantic import BaseModel
from shared.llm_client import llm_client
import json

router = APIRouter()

class ExplainRequest(BaseModel):
    step_name: str
    data: dict

class ExplainResponse(BaseModel):
    explanation: str

@router.post("", response_model=ExplainResponse)
def explain_step(req: ExplainRequest):
    if req.step_name == "Summary Report":
        system_prompt = (
            "You are a supportive career advisor. Read the candidate's complete profile, talent check score, "
            "and skill match result. Write a 4-6 sentence holistic summary identifying their overall strengths, "
            "overall weaknesses, and a realistic verdict on their current readiness. Do not repeat the step-by-step numbers, "
            "but synthesize them into a clear narrative. You MUST return your response as a JSON object with a single key 'explanation'."
        )
    elif req.step_name == "JD Analytics":
        system_prompt = (
            "You are an analytical assistant explaining what THIS JOB REQUIRES in third person. "
            "Describe the role and its technical requirements based on the data. E.g. 'This role demands strong X and Y skills'. "
            "NEVER address the reader as if they are the candidate (no 'you' or 'your'). "
            "Keep it to 2-3 sentences. You MUST return your response as a JSON object with a single key 'explanation'."
        )
    else:
        system_prompt = (
            "You are a supportive career advisor explaining results to a candidate in plain, "
            "encouraging language. Be specific and reference the actual data given. "
            "Keep it to 2-3 sentences. You MUST return your response as a JSON object with a single key 'explanation'."
        )
    user_prompt = f"Step: {req.step_name}\nData: {json.dumps(req.data)}"
    
    try:
        response_text = llm_client.call_llm(system_prompt, user_prompt)
        parsed = json.loads(response_text)
        return ExplainResponse(explanation=parsed.get("explanation", ""))
    except Exception as e:
        print(f"Explain error: {e}")
        return ExplainResponse(explanation="Could not generate explanation.")
