import urllib.request
import json

print("Checking match...")
req = urllib.request.Request("http://localhost:8000/api/skill/match", 
    data=json.dumps({"profile_id": "karthik@example.com", "jd_id": "Google LLC - Software Engineer"}).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)
res = urllib.request.urlopen(req)
print(json.dumps(json.loads(res.read().decode()), indent=2))
