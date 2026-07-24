from shared.schema import TalentCheckResult
from profile_builder.models import CandidateProfile

def calculate_readiness(profile: CandidateProfile, company: str, required_skillsets: dict) -> dict:
    # 1. Map candidate skills to their max confidence-weighted level per category
    # 'high'=8, 'medium'=5, 'low'=3
    confidence_map = {"high": 8, "medium": 5, "low": 3}
    
    candidate_levels = {}
    for skill in profile.skills:
        cat = skill.category_code
        if not cat:
            continue
        conf_str = (skill.confidence or "").lower()
        level = confidence_map.get(conf_str, 3) # default to low if missing/unknown
        if cat not in candidate_levels or level > candidate_levels[cat]:
            candidate_levels[cat] = level
            
    breakdown = []
    gaps_found = 0
    total_categories = 12
    
    # Evaluate against all 12 categories required by the company
    for cat, req_level in required_skillsets.items():
        cand_level = candidate_levels.get(cat, 0)
        has_gap = cand_level < req_level
        if has_gap:
            gaps_found += 1
            
        breakdown.append({
            "category": cat,
            "required": req_level,
            "candidate": cand_level,
            "gap": has_gap
        })
        
    no_gap_count = total_categories - gaps_found
    readiness_score = round((no_gap_count / total_categories) * 100)
    passed = readiness_score >= 70
    
    feedback = f"Candidate met {no_gap_count} out of 12 required skill categories for {company}."
    
    return {
        "score": readiness_score,
        "feedback": feedback,
        "passed": passed,
        "breakdown": breakdown
    }
