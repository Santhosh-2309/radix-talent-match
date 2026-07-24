import urllib.request
import json

print("Merging skills...")
data = json.load(open("karthik_mock.json"))
req = urllib.request.Request("http://localhost:8000/api/profile/karthik@example.com/merge-skills", 
    data=json.dumps(data).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)
res = urllib.request.urlopen(req)

print("Checking talent...")
req2 = urllib.request.Request("http://localhost:8000/api/talent/check-talent", 
    data=json.dumps({"profile_id": "karthik@example.com", "company_name": "Google"}).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)
res2 = urllib.request.urlopen(req2)
print(json.dumps(json.loads(res2.read().decode()), indent=2))
