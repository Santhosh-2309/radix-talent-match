from fastapi import APIRouter, UploadFile, File, Form
from shared.schema import ExtractedSkillList
from shared.extract_text import extract_text_from_bytes
from .extract_skills import extract_skills_from_jd

router = APIRouter()

import os
import json

EXTRACTED_JDS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "extracted_jds")
os.makedirs(EXTRACTED_JDS_DIR, exist_ok=True)

@router.post("/analyze-jd", response_model=ExtractedSkillList)
async def analyze_jd(file: UploadFile = File(...), company: str = Form("Unknown"), role: str = Form("Unknown")):
    content = await file.read()
    text = extract_text_from_bytes(content, file.filename)
    if not text:
        return ExtractedSkillList(source_type="jd", skills=[])
        
    result = extract_skills_from_jd(text, file.filename, company, role)
    
    # Save extraction to disk
    safe_filename = file.filename.replace(" ", "_").replace(".pdf", "").replace(".docx", "")
    filepath = os.path.join(EXTRACTED_JDS_DIR, f"{safe_filename}.json")
    with open(filepath, "w") as f:
        f.write(result.model_dump_json())
        
    return result
