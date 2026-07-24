Write-Host "Waiting for server to be ready..."
Start-Sleep -Seconds 2

function Run-Combo {
    param(
        [int]$ComboNum,
        [string]$Email,
        [string]$Name,
        [string]$ResumeFile,
        [string]$JdFile,
        [string]$Company,
        [string]$JdId
    )
    
    Write-Host "`n--- Running Combo $ComboNum ---"
    
    # 1. Parse JD
    Write-Host "1. Parsing JD: $JdFile..."
    $JdPath = Resolve-Path "..\data\sample_jds\PDF\$JdFile"
    $JdOut = curl.exe -s -F "company=$Company" -F "role=Test Role" -F "file=@$JdPath" http://localhost:8000/api/jd/analyze-jd
    
    # 2. Parse Resume
    Write-Host "2. Parsing Resume: $ResumeFile..."
    $ResPath = Resolve-Path "..\data\sample_resumes\PDF\$ResumeFile"
    $ResumeOut = curl.exe -s -F "file=@$ResPath" http://localhost:8000/api/resume/parse-resume
    
    # 3. Create Profile and Merge Skills
    Write-Host "3. Building Profile for $Email..."
    $ProfJson = @{
        name = $Name
        email = $Email
        education = ""
        skills = @()
        hackathons = @()
        internships = @()
        certifications = @()
        preferred_roles = @()
        cv_file = $ResumeFile
    } | ConvertTo-Json
    
    $TempPayload1 = "temp_prof.json"
    $ProfJson | Out-File -FilePath $TempPayload1 -Encoding utf8
    curl.exe -s -X POST -H "Content-Type: application/json" -d "@$TempPayload1" http://localhost:8000/api/profile > $null
    
    $TempPayload2 = "temp_skills.json"
    $ResumeOut | Out-File -FilePath $TempPayload2 -Encoding utf8
    curl.exe -s -X POST -H "Content-Type: application/json" -d "@$TempPayload2" http://localhost:8000/api/profile/$([uri]::EscapeDataString($Email))/merge-skills > $null
    
    # 4. Talent Check
    Write-Host "4. Talent Check ($Company)..."
    $TcPayload = @{
        profile_id = $Email
        company_name = $Company
    } | ConvertTo-Json
    $TempPayload3 = "temp_tc.json"
    $TcPayload | Out-File -FilePath $TempPayload3 -Encoding utf8
    $TcOut = curl.exe -s -X POST -H "Content-Type: application/json" -d "@$TempPayload3" http://localhost:8000/api/talent/check-talent
    Write-Host "   -> Full Talent Check Result:"
    Write-Host $TcOut
    
    # 5. Skill Match
    Write-Host "5. Skill Match ($JdId)..."
    $SmPayload = @{
        profile_id = $Email
        jd_id = $JdId
    } | ConvertTo-Json
    $TempPayload4 = "temp_sm.json"
    $SmPayload | Out-File -FilePath $TempPayload4 -Encoding utf8
    $SmOut = curl.exe -s -X POST -H "Content-Type: application/json" -d "@$TempPayload4" http://localhost:8000/api/skill/match
    $SmObj = $SmOut | ConvertFrom-Json
    Write-Host "   -> Score: $($SmObj.overall_score)"
    Write-Host "   -> Gap Analysis: $($SmObj.gap_analysis)"
}

Run-Combo -ComboNum 1 -Email "karthik@example.com" -Name "Karthik Subramaniam" -ResumeFile "Karthik Subramaniam.pdf" -JdFile "Google LLC - Software Engineer.pdf" -Company "Google" -JdId "Google LLC - Software Engineer"
Run-Combo -ComboNum 2 -Email "priya@example.com" -Name "Priya Menon" -ResumeFile "Priya Menon.pdf" -JdFile "Microsoft - Data Analyst.pdf" -Company "Microsoft" -JdId "Microsoft - Data Analyst"
