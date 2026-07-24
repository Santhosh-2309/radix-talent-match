import requests
import json
import os
import sys

JD_URL = "http://127.0.0.1:8000/api/jd/analyze-jd"
RESUME_URL = "http://127.0.0.1:8000/api/resume/parse-resume"

jd_path = r"D:\radix-talent-match-v2\data\sample_jds\PDF\Google LLC - Software Engineer.pdf"
resume_path = r"D:\radix-talent-match-v2\data\sample_resumes\PDF\Karthik Subramaniam.pdf"

if not os.path.exists(jd_path) or not os.path.exists(resume_path):
    print("Test files not found! Creating dummy files for testing...")
    jd_path = "test_jd.txt"
    resume_path = "test_resume.txt"
    with open(jd_path, "w") as f:
        f.write("Looking for a Software Engineer with Python and AWS experience. Must have good communication skills and understand System Design.")
    with open(resume_path, "w") as f:
        f.write("Karthik - Software Engineer\nExperience in Python, React, and AWS. Built several scalable systems.")

print(f"Testing JD extraction with {jd_path}...")
with open(jd_path, "rb") as f:
    files = {"file": (os.path.basename(jd_path), f, "application/pdf")}
    data = {"company": "Google", "role": "Software Engineer"}
    res = requests.post(JD_URL, files=files, data=data)
    try:
        print("JD Skills:")
        print(json.dumps(res.json(), indent=2))
    except Exception as e:
        print("JD API Error:", res.text)

print("\n" + "="*50 + "\n")

print(f"Testing Resume extraction with {resume_path}...")
with open(resume_path, "rb") as f:
    files = {"file": (os.path.basename(resume_path), f, "application/pdf")}
    res = requests.post(RESUME_URL, files=files)
    try:
        print("Resume Skills:")
        print(json.dumps(res.json(), indent=2))
    except Exception as e:
        print("Resume API Error:", res.text)
