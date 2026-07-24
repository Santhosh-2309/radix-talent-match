import json
import os
<<<<<<< HEAD
from pathlib import Path
from shared.schema import CandidateProfile

# Profiles are stored as JSON files under data/profiles/
DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "profiles"


def _ensure_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def _key(name: str) -> str:
    """Sanitize profile name into a safe filename."""
    return name.strip().lower().replace(" ", "_")


def save_profile(profile: CandidateProfile) -> str:
    """Save a CandidateProfile to disk. Returns the file path."""
    _ensure_dir()
    filepath = DATA_DIR / f"{_key(profile.name)}.json"
    filepath.write_text(profile.model_dump_json(indent=2), encoding="utf-8")
    return str(filepath)


def load_profile(name: str) -> CandidateProfile:
    """Load a CandidateProfile by name. Raises FileNotFoundError if not found."""
    filepath = DATA_DIR / f"{_key(name)}.json"
    if not filepath.exists():
        raise FileNotFoundError(f"No saved profile for '{name}'. Available: {list_profiles()}")
    data = json.loads(filepath.read_text(encoding="utf-8"))
    return CandidateProfile(**data)


def list_profiles() -> list:
    """List all saved profile names."""
    _ensure_dir()
    return [f.stem.replace("_", " ").title() for f in DATA_DIR.glob("*.json")]
=======
from .models import CandidateProfile
from shared.schema import ExtractedSkillList

def save_profile(profile: CandidateProfile, filepath: str) -> None:
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(profile.model_dump_json(indent=2))

def load_profile(filepath: str) -> CandidateProfile:
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Profile not found: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return CandidateProfile(**data)

def merge_resume_skills(profile: CandidateProfile, extracted: ExtractedSkillList) -> CandidateProfile:
    existing_skill_names = {s.skill_name.lower() for s in profile.skills}
    
    for skill in extracted.skills:
        if skill.skill_name.lower() not in existing_skill_names:
            profile.skills.append(skill)
            existing_skill_names.add(skill.skill_name.lower())
            
    return profile
>>>>>>> origin/main
