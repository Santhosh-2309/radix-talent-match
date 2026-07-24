import json
import os
from pathlib import Path
from shared.schema import ExtractedSkillList

# JD results are stored as JSON files under data/jd_results/
DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "jd_results"


def _ensure_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def _key(source_file: str) -> str:
    """Sanitize source filename into a safe key (strip extension, lowercase)."""
    # Remove path components, keep just the basename without extension
    name = Path(source_file).stem
    return name.strip().lower().replace(" ", "_")


def save_jd_result(source_file: str, result: ExtractedSkillList) -> str:
    """Save an ExtractedSkillList to disk. Returns the file path."""
    _ensure_dir()
    filepath = DATA_DIR / f"{_key(source_file)}.json"
    # Store source_file alongside the result for later lookup
    data = result.model_dump()
    data["source_file"] = source_file
    filepath.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return str(filepath)


def load_jd_result(source_file: str) -> ExtractedSkillList:
    """Load an ExtractedSkillList by the original source filename."""
    filepath = DATA_DIR / f"{_key(source_file)}.json"
    if not filepath.exists():
        raise FileNotFoundError(
            f"No saved JD result for '{source_file}'. Available: {list_jd_results()}"
        )
    data = json.loads(filepath.read_text(encoding="utf-8"))
    return ExtractedSkillList(**data)


def list_jd_results() -> list:
    """List all saved JD result source files."""
    _ensure_dir()
    results = []
    for f in DATA_DIR.glob("*.json"):
        data = json.loads(f.read_text(encoding="utf-8"))
        results.append(data.get("source_file", f.stem))
    return results
