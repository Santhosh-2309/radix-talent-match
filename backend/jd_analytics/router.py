from fastapi import APIRouter, UploadFile, File, Form
from shared.schema import ExtractedSkillList
from shared.extract_text import extract_text_from_bytes
from .extract_skills import extract_skills_from_jd
from .storage import save_jd_result, load_jd_result, list_jd_results

router = APIRouter()

@router.post("/analyze-jd", response_model=ExtractedSkillList)
async def analyze_jd(file: UploadFile = File(...), company: str = Form("Unknown"), role: str = Form("Unknown")):
    content = await file.read()
    text = extract_text_from_bytes(content, file.filename)
    if not text:
        return ExtractedSkillList(source_type="jd", skills=[])
        
    result = extract_skills_from_jd(text, file.filename, company, role)
    # Persist to disk for later skill matching
    save_jd_result(file.filename, result)
    return result

@router.get("/list-results")
def get_all_results():
    return {"results": list_jd_results()}

@router.get("/load-result/{source_file}")
def get_result(source_file: str):
    try:
        result = load_jd_result(source_file)
        return result
    except FileNotFoundError as e:
        return {"error": str(e)}
