import json
import os
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
