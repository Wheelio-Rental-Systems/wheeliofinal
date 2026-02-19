$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8072/api"

# 1. Register a fresh user to act as admin/verifier
$email = "verifier@example.com"
$password = "password123"

try {
    $registerBody = @{
        email    = $email
        password = $password
        fullName = "Verifier"
        role     = "ADMIN"
        city     = "Mumbai"
        phone    = "1122334455"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction SilentlyContinue
}
catch {}

# 2. Login
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{ email = $email; password = $password } | ConvertTo-Json) -ContentType "application/json"
$token = $loginResponse.token
$headers = @{ Authorization = "Bearer $token" }

Write-Host "Logged in as Verifier."

# 3. Get Drivers
$drivers = Invoke-RestMethod -Uri "$baseUrl/drivers" -Method Get -Headers $headers

Write-Host "Found $($drivers.Count) drivers."

if ($drivers.Count -gt 0) {
    $first = $drivers[0]
    Write-Host "First Driver: $($first.userId)"
    Write-Host "License: $($first.licenseNumber)"
    Write-Host "Documents: " 
    Write-Host ($first.documents | ConvertTo-Json -Depth 5)
}
else {
    Write-Host "No drivers found!"
}
