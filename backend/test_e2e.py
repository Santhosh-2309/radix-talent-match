import os
import subprocess
import json
import urllib.request
import urllib.parse
from time import sleep

def run_curl_multipart(url, file_path, form_data):
    # Using curl for multipart is easiest on Windows without external libs
    cmd = ["curl.exe", "-s"]
    for k, v in form_data.items():
        cmd.extend(["-F", f"{k}={v}"])
    cmd.extend(["-F", f"file=@{file_path}"])
    cmd.append(url)
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    return json.loads(result.stdout)

def post_json(url, payload):
    with open("temp_payload.json", "w") as f:
        json.dump(payload, f)
    cmd = ["curl.exe", "-s", "-X", "POST", "-H", "Content-Type: application/json", "-d", "@temp_payload.json", url]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return json.loads(result.stdout)

def run_combo(combo_num, candidate_email, candidate_name, resume_file, jd_file, company_name, jd_id):
    print(f"\n--- Running Combo {combo_num} ---")
    
    # 1. Parse JD
    print(f"1. Parsing JD: {jd_file}...")
    jd_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_jds", "PDF", jd_file)
    jd_res = run_curl_multipart("http://localhost:8000/api/jd/analyze-jd", jd_path, {"company": company_name, "role": "Test Role"})
    
    # 2. Parse Resume
    print(f"2. Parsing Resume: {resume_file}...")
    res_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_resumes", "PDF", resume_file)
    resume_res = run_curl_multipart("http://localhost:8000/api/resume/parse-resume", res_path, {})
    
    # 3. Create Profile and Merge Skills
    print(f"3. Building Profile for {candidate_email}...")
    post_json("http://localhost:8000/api/profile", {
        "name": candidate_name,
        "email": candidate_email,
        "education": "", "skills": [], "hackathons": [], "internships": [], "certifications": [], "preferred_roles": [], "cv_file": resume_file
    })
    post_json(f"http://localhost:8000/api/profile/{urllib.parse.quote(candidate_email)}/merge-skills", resume_res)
    
    # 4. Talent Check
    print(f"4. Talent Check ({company_name})...")
    tc_res = post_json("http://localhost:8000/api/talent/check-talent", {"profile_id": candidate_email, "company_name": company_name})
    print(f"   -> Score: {tc_res['readiness_score']} (Passed: {tc_res['passed']})")
    
    # 5. Skill Match
    print(f"5. Skill Match ({jd_id})...")
    sm_res = post_json("http://localhost:8000/api/skill/match", {"profile_id": candidate_email, "jd_id": jd_id})
    print(f"   -> Score: {sm_res['overall_score']}")
    print(f"   -> Gap Analysis: {sm_res['gap_analysis']}")
    
print("Waiting for server to be ready...")
sleep(2)

run_combo(
    1,
    "karthik@example.com", "Karthik Subramaniam", "Karthik Subramaniam.pdf",
    "Google LLC - Software Engineer.pdf", "Google", "Google LLC - Software Engineer"
)

run_combo(
    2,
    "priya@example.com", "Priya Menon", "Priya Menon.pdf",
    "Microsoft - Data Analyst.pdf", "Microsoft", "Microsoft - Data Analyst"
)
