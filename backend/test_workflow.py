import requests
import json
import os

BASE_URL = "http://localhost:8000/api"
RESUME_PATH = r"D:\radix-talent-match-v2\data\sample_resumes\PDF\Karthik Subramaniam.pdf"

print("1. Extracting skills from Karthik's resume...")
with open(RESUME_PATH, "rb") as f:
    files = {"file": f}
    res = requests.post(f"{BASE_URL}/resume/parse-resume", files=files)
    
if not res.ok:
    print("Error extracting skills:", res.text)
    exit(1)
    
extracted_skills = res.json()
print(f"Extracted {len(extracted_skills.get('skills', []))} skills.")

print("2. Merging skills into karthik@example.com profile...")
merge_res = requests.post(
    f"{BASE_URL}/profile/karthik@example.com/merge-skills", 
    json=extracted_skills
)

if not merge_res.ok:
    print("Error merging skills:", merge_res.text)
    exit(1)
    
print("Skills successfully merged.")

print("3. Running Talent Check against Google...")
check_res = requests.post(
    f"{BASE_URL}/talent/check-talent",
    json={"profile_id": "karthik@example.com", "company_name": "Google"}
)

if not check_res.ok:
    print("Error running talent check:", check_res.text)
    exit(1)

print("\n--- RESULTS ---")
print(json.dumps(check_res.json(), indent=2))
