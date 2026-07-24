from fastapi import APIRouter, UploadFile, File
from shared.schema import ExtractedSkillList
from shared.extract_text import extract_text_from_bytes
from .extract_skills import extract_skills_from_resume

router = APIRouter()

@router.post("/parse-resume", response_model=ExtractedSkillList)
async def parse_resume(file: UploadFile = File(...)):
    content = await file.read()
    text = extract_text_from_bytes(content, file.filename)
    if not text:
        return ExtractedSkillList(source_type="resume", skills=[])
        
    return extract_skills_from_resume(text, file.filename)
