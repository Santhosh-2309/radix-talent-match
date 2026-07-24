import json
import os
from fastapi import HTTPException

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "talent_check_company_skillsets.json")

def load_company_skillsets(company: str) -> dict:
    if not os.path.exists(DATA_FILE):
        raise HTTPException(status_code=500, detail="Company skillsets file not found.")
    
    with open(DATA_FILE, "r") as f:
        data = json.load(f)
        
    if company not in data:
        raise HTTPException(status_code=404, detail=f"Company {company} not found in skillsets.")
        
    return data[company]
