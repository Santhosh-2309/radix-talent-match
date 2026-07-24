from fastapi import APIRouter, UploadFile, File, Form
from shared.schema import ExtractedSkillList
from shared.extract_text import extract_text_from_bytes
from .extract_skills import extract_skills_from_jd

router = APIRouter()

@router.post("/analyze-jd", response_model=ExtractedSkillList)
async def analyze_jd(file: UploadFile = File(...), company: str = Form("Unknown"), role: str = Form("Unknown")):
    content = await file.read()
    text = extract_text_from_bytes(content, file.filename)
    if not text:
        return ExtractedSkillList(source_type="jd", skills=[])
        
    return extract_skills_from_jd(text, file.filename, company, role)
