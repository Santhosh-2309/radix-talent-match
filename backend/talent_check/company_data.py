import json
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "talent_check_company_skillsets.json"

CATEGORY_CODES = ["DSA", "COD", "OOD", "APTI", "COMM", "AI", "CLOUD", "SQL", "SWE", "SYSD", "NETW", "OS"]


def load_company_skillsets(company_name: str) -> dict:
    """
    Load the required skillset levels for a company from the JSON data file.
    Returns a dict mapping category_code -> required_level.
    Raises ValueError if the company is not found.
    """
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Company data file not found at {DATA_FILE}")

    companies = json.loads(DATA_FILE.read_text(encoding="utf-8"))

    for company in companies:
        if company["company_name"].lower() == company_name.strip().lower():
            # Flatten: {"DSA": {"required_level": 9}} -> {"DSA": 9}
            return {
                code: info["required_level"]
                for code, info in company["skillsets"].items()
            }

    available = [c["company_name"] for c in companies]
    raise ValueError(f"Company '{company_name}' not found. Available: {available}")


def list_companies() -> list:
    """Return a list of all available company names."""
    if not DATA_FILE.exists():
        return []
    companies = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    return [c["company_name"] for c in companies]
