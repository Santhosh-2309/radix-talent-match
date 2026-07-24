"""
End-to-end test for Talent Check and Skill Matching modules.
Directly calls the Python functions (no server required).

Run from the project root:
  python test_e2e.py
"""
import sys
import os
import json

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Ensure backend modules are importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from shared.schema import Skill, CandidateProfile, ExtractedSkillList
from profile_builder.storage import save_profile, load_profile
from jd_analytics.storage import save_jd_result, load_jd_result
from talent_check.scoring import calculate_readiness
from skill_matching.matcher import match_skills


def create_sample_profile():
    """Create and save a sample candidate profile."""
    profile = CandidateProfile(
        id="test-001",
        name="Test Candidate",
        experience_years=3,
        skills=[
            Skill(skill_name="Binary Search", category_code="DSA", evidence="Solved 200+ LC", confidence="high"),
            Skill(skill_name="Python", category_code="COD", evidence="3 years experience", confidence="high"),
            Skill(skill_name="Design Patterns", category_code="OOD", evidence="Used MVC, Singleton", confidence="medium"),
            Skill(skill_name="Verbal Reasoning", category_code="APTI", evidence="GRE score", confidence="medium"),
            Skill(skill_name="Technical Writing", category_code="COMM", evidence="Blog posts", confidence="low"),
            Skill(skill_name="PyTorch", category_code="AI", evidence="Built CNN models", confidence="high"),
            Skill(skill_name="AWS EC2", category_code="CLOUD", evidence="Deployed apps", confidence="medium"),
            Skill(skill_name="PostgreSQL", category_code="SQL", evidence="Designed schemas", confidence="high"),
            Skill(skill_name="Git Workflows", category_code="SWE", evidence="CI/CD pipelines", confidence="medium"),
            Skill(skill_name="Load Balancing", category_code="SYSD", evidence="Nginx configs", confidence="low"),
            Skill(skill_name="TCP/IP", category_code="NETW", evidence="Socket programming", confidence="medium"),
            Skill(skill_name="Linux Admin", category_code="OS", evidence="Ubuntu server mgmt", confidence="high"),
        ],
    )
    save_profile(profile)
    print(f"[OK] Saved profile: {profile.name} ({len(profile.skills)} skills)\n")
    return profile


def create_sample_jd_result():
    """Create and save a sample JD extraction result."""
    jd_skills = ExtractedSkillList(
        source_type="jd",
        skills=[
            Skill(skill_name="Python", category_code="COD", evidence="Required: Python 3+", confidence="high"),
            Skill(skill_name="PyTorch", category_code="AI", evidence="Deep learning frameworks", confidence="high"),
            Skill(skill_name="AWS EC2", category_code="CLOUD", evidence="Cloud deployment", confidence="medium"),
            Skill(skill_name="PostgreSQL", category_code="SQL", evidence="Database design", confidence="high"),
            Skill(skill_name="Kubernetes", category_code="CLOUD", evidence="Container orchestration", confidence="medium"),
            Skill(skill_name="GraphQL", category_code="SWE", evidence="API design", confidence="medium"),
            Skill(skill_name="System Design", category_code="SYSD", evidence="Large-scale systems", confidence="high"),
            Skill(skill_name="Docker", category_code="SWE", evidence="Containerization", confidence="high"),
            Skill(skill_name="React", category_code="COD", evidence="Frontend development", confidence="medium"),
            Skill(skill_name="Communication Skills", category_code="COMM", evidence="Team collaboration", confidence="medium"),
        ],
    )
    source_file = "Google LLC - Software Engineer.pdf"
    save_jd_result(source_file, jd_skills)
    print(f"[OK] Saved JD result: {source_file} ({len(jd_skills.skills)} skills)\n")
    return source_file, jd_skills


def test_talent_check(profile):
    """Test the Talent Check module."""
    print("=" * 60)
    print("TALENT CHECK -- Test Candidate vs Google")
    print("=" * 60)

    result = calculate_readiness(profile, "Google")

    print(f"\nReadiness Score: {result.score}/100")
    print(f"Passed: {'YES' if result.passed else 'NO'}")

    feedback = json.loads(result.feedback)
    print(f"\n{'Category':<10} {'Required':<10} {'Yours':<10} {'Gap?':<8}")
    print("-" * 38)
    for row in feedback["skillset_gap"]:
        gap_str = "!! YES" if row["gap"] else "   No"
        print(f"{row['category_code']:<10} {row['required_level']:<10} {row['candidate_level']:<10} {gap_str}")

    print()
    return result


def test_skill_matching(profile, source_file, jd_skills):
    """Test the Skill Matching module."""
    print("=" * 60)
    print("SKILL MATCHING -- Test Candidate vs Google SWE JD")
    print("=" * 60)

    result = match_skills(profile, jd_skills)

    print(f"\nMatch Score: {result.overall_score}%")
    print(f"\nMatched Skills ({len(result.matching_skills)}):")
    for s in result.matching_skills:
        print(f"   [+] {s}")

    print(f"\nMissing Skills ({len(result.missing_skills)}):")
    for s in result.missing_skills:
        print(f"   [-] {s}")

    print(f"\nGap Analysis:\n{result.gap_analysis}")
    print()
    return result


if __name__ == "__main__":
    print("\nRADIX Talent Match -- E2E Test\n")

    # Step 1: Create test data
    profile = create_sample_profile()
    source_file, jd_skills = create_sample_jd_result()

    # Step 2: Run Talent Check
    tc_result = test_talent_check(profile)

    # Step 3: Run Skill Matching
    sm_result = test_skill_matching(profile, source_file, jd_skills)

    print("=" * 60)
    print("[DONE] E2E test complete!")
    print("=" * 60)
