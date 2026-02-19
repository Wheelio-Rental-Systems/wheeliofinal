$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8072/api"

# 1. Register User (Rahul - Pune)
$userEmail = "rahul.pune@example.com"
$userPassword = "password123"

$registerBody = @{
    email    = $userEmail
    password = $userPassword
    fullName = "Rahul Driver"
    role     = "DRIVER"
    city     = "Pune"
    phone    = "9876543200"
} | ConvertTo-Json

Write-Host "Registering user $userEmail..."
try {
    Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "User registered."
}
catch {
    Write-Host "User likely already exists: $($_.Exception.Message)"
}

# 2. Login to get Token
$loginBody = @{
    email    = $userEmail
    password = $userPassword
} | ConvertTo-Json

Write-Host "Logging in..."
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
$userId = $loginResponse.user.id
Write-Host "Logged in. UserID: $userId"

# 3. Create Driver Profile
$headers = @{ Authorization = "Bearer $token" }

$profileBody = @{
    userId        = $userId
    licenseNumber = "MH12-2024-9999999"
    status        = "ACTIVE"
    documents     = @{
        licenseUrl = "/images/license_placeholder.jpg" 
        experience = "5 Years"
    }
} | ConvertTo-Json

Write-Host "Creating Driver Profile..."
try {
    Invoke-RestMethod -Uri "$baseUrl/drivers" -Method Post -Body $profileBody -ContentType "application/json" -Headers $headers
    Write-Host "Driver Profile Created successfully for Pune."
}
catch {
    Write-Host "Failed to create profile (might exist): $($_.Exception.Message)"
}
