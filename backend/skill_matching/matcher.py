from shared.schema import CandidateProfile, ExtractedSkillList, SkillMatchResult


def match_skills(profile: CandidateProfile, jd_skills: ExtractedSkillList) -> SkillMatchResult:
    """
    Match a candidate's skills against JD-extracted skills.
    
    Matching strategy:
      1. Case-insensitive exact match on skill_name
      2. Fallback: match by same category_code if exact name match fails
    
    Returns SkillMatchResult with overall_score, matching_skills,
    missing_skills, and gap_analysis.
    """
    if not jd_skills.skills:
        return SkillMatchResult(
            overall_score=100.0,
            matching_skills=[],
            missing_skills=[],
            gap_analysis="No skills required by the JD — trivial match."
        )

    # Build lookup sets from the candidate's profile
    profile_names = {s.skill_name.lower().strip() for s in profile.skills if s.skill_name}
    profile_categories = {
        (s.category_code or "").upper().strip()
        for s in profile.skills
        if s.category_code
    }

    matched = []
    missing = []

    for jd_skill in jd_skills.skills:
        jd_name = (jd_skill.skill_name or "").strip()
        jd_name_lower = jd_name.lower()
        jd_cat = (jd_skill.category_code or "").upper().strip()

        # Strategy 1: exact name match (case-insensitive)
        if jd_name_lower in profile_names:
            matched.append(jd_name)
        # Strategy 2: fallback to category match
        elif jd_cat and jd_cat in profile_categories:
            matched.append(jd_name)
        else:
            missing.append(jd_name)

    total = len(jd_skills.skills)
    overall_score = round((len(matched) / total) * 100, 1)

    # Build readable gap analysis
    lines = [f"Matched {len(matched)} of {total} required skills ({overall_score}%)."]
    if missing:
        lines.append(f"\nMissing skills to work on:")
        for s in missing:
            lines.append(f"  • {s}")
    if matched:
        lines.append(f"\nSkills you already have:")
        for s in matched:
            lines.append(f"  ✓ {s}")

    gap_analysis = "\n".join(lines)

    return SkillMatchResult(
        overall_score=overall_score,
        matching_skills=matched,
        missing_skills=missing,
        gap_analysis=gap_analysis,
    )
