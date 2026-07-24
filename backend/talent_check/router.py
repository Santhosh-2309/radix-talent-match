from fastapi import APIRouter
from shared.schema import TalentCheckInput, TalentCheckResult
from shared.llm_client import llm_client

router = APIRouter()

@router.post("/check-talent", response_model=TalentCheckResult)
def check_talent(data: TalentCheckInput):
    # STUB implementation
    res = llm_client.run_talent_check({"id": data.profile_id}, data.company_name)
    return TalentCheckResult(**res)
