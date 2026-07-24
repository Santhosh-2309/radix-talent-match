$resumePath = "D:\radix-talent-match-v2\data\sample_resumes\PDF\Karthik Subramaniam.pdf"
$baseUrl = "http://localhost:8000/api"

Write-Output "1. Extracting skills..."
$extractResponse = Invoke-RestMethod -Uri "$baseUrl/resume/parse-resume" -Method Post -Form @{file=(Get-Item $resumePath)}
Write-Output "Extracted $($extractResponse.skills.Count) skills."

Write-Output "2. Merging skills..."
$mergeBody = $extractResponse | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$baseUrl/profile/karthik@example.com/merge-skills" -Method Post -Body $mergeBody -ContentType "application/json" | Out-Null
Write-Output "Skills merged."

Write-Output "3. Talent Check against Google..."
$checkBody = @{ profile_id = "karthik@example.com"; company_name = "Google" } | ConvertTo-Json -Depth 10
$checkResponse = Invoke-RestMethod -Uri "$baseUrl/talent/check-talent" -Method Post -Body $checkBody -ContentType "application/json"
$checkResponse | ConvertTo-Json -Depth 5
