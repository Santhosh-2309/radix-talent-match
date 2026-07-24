import difflib
from shared.schema import Skill, ExtractedSkillList, SkillMatchResult, MatchedSkill

CATEGORY_KEYWORDS = {
    "COD": ["python", "java", "c++", "javascript", "sql", "programming", "coding"],
    "DSA": ["data structures", "algorithms", "dsa"],
    "OOD": ["oop", "object-oriented", "design patterns", "uml"],
    "SYSD": ["system design", "distributed systems", "scalability", "architecture"],
    "OS": ["operating systems", "os", "linux", "unix", "threading", "processes"],
    "NETW": ["networking", "tcp/ip", "http", "dns", "network protocols"],
    "SWE": ["software engineering", "sdlc", "agile", "version control", "git"],
    "AI": ["machine learning", "ai", "deep learning", "ml", "neural networks"],
    "CLOUD": ["aws", "azure", "gcp", "cloud computing", "cloud infrastructure"],
    "COMM": ["communication", "presentation", "collaboration"],
    "APTI": ["problem solving", "analytical", "logic", "reasoning"]
}

def match_skills(candidate_skills: list[Skill], jd_skills: ExtractedSkillList) -> SkillMatchResult:
    matched_skills = []
    missing_skills = []
    
    cand_skill_names_lower = {s.skill_name.lower(): s for s in candidate_skills}
    
    for jd_skill in jd_skills.skills:
        jd_name = jd_skill.skill_name.lower()
        jd_cat = jd_skill.category_code
        
        # 1. Exact match (case insensitive)
        if jd_name in cand_skill_names_lower:
            matched_skills.append(MatchedSkill(skill_name=jd_skill.skill_name, match_type="exact"))
            continue
            
        # 2. Category-keyword match
        found_match = False
        if jd_cat in CATEGORY_KEYWORDS:
            for kw in CATEGORY_KEYWORDS[jd_cat]:
                # If candidate has ANY skill whose name contains the keyword
                for cand_s in candidate_skills:
                    if kw in cand_s.skill_name.lower():
                        matched_skills.append(MatchedSkill(skill_name=jd_skill.skill_name, match_type="keyword"))
                        found_match = True
                        break
                if found_match:
                    break
        if found_match:
            continue
            
        # 3. Fuzzy match within same category, or across all if category missing
        for cand_s in candidate_skills:
            if jd_cat and cand_s.category_code and jd_cat != cand_s.category_code:
                continue
                
            sim = difflib.SequenceMatcher(None, jd_name, cand_s.skill_name.lower()).ratio()
            if sim >= 0.6:
                matched_skills.append(MatchedSkill(skill_name=jd_skill.skill_name, match_type="fuzzy"))
                found_match = True
                break
                
        if not found_match:
            missing_skills.append(jd_skill.skill_name)
            
    total_jd = len(jd_skills.skills)
    if total_jd == 0:
        match_score = 100
    else:
        match_score = round((len(matched_skills) / total_jd) * 100)
        
    return SkillMatchResult(
        overall_score=match_score,
        matching_skills=matched_skills,
        missing_skills=missing_skills,
        gap_analysis=f"Matched {len(matched_skills)} out of {total_jd} skills required by JD."
    )
