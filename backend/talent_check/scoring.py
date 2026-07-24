import json
from shared.schema import CandidateProfile, TalentCheckResult
from .company_data import load_company_skillsets, CATEGORY_CODES

# Map confidence strings to numeric levels
CONFIDENCE_TO_LEVEL = {
    "high": 9,    # range 8-10, use 9 as representative
    "medium": 6,  # range 5-7, use 6 as representative
    "low": 3,     # range 2-4, use 3 as representative
}


def _get_candidate_levels(profile: CandidateProfile) -> dict:
    """
    Derive a candidate_level (0-10) for each of the 12 category codes
    from the candidate's skill list.
    If multiple skills map to the same category, take the max level.
    """
    levels = {code: 0 for code in CATEGORY_CODES}

    for skill in profile.skills:
        cat = (skill.category_code or "").upper().strip()
        if cat in levels:
            conf = (skill.confidence or "low").lower().strip()
            level = CONFIDENCE_TO_LEVEL.get(conf, 3)
            levels[cat] = max(levels[cat], level)

    return levels


def calculate_readiness(profile: CandidateProfile, company_name: str) -> TalentCheckResult:
    """
    Calculate how ready a candidate is for a target company.
    
    Returns a TalentCheckResult with:
      - score: readiness_score (0-100)
      - feedback: JSON string with per-category breakdown
      - passed: True if readiness_score >= 50
    """
    required = load_company_skillsets(company_name)
    candidate = _get_candidate_levels(profile)

    gap_details = []
    ratios = []

    for code in CATEGORY_CODES:
        req = required.get(code, 5)  # default required_level if missing
        cand = candidate.get(code, 0)
        gap = cand < req
        ratio = min(cand / req, 1.0) if req > 0 else 1.0

        gap_details.append({
            "category_code": code,
            "required_level": req,
            "candidate_level": cand,
            "gap": gap,
        })
        ratios.append(ratio)

    readiness_score = round((sum(ratios) / len(ratios)) * 100, 1) if ratios else 0
    passed = readiness_score >= 50

    # Build readable feedback with the structured gap data
    feedback_obj = {
        "company": company_name,
        "readiness_score": readiness_score,
        "skillset_gap": gap_details,
    }

    return TalentCheckResult(
        score=readiness_score,
        feedback=json.dumps(feedback_obj),
        passed=passed,
    )
