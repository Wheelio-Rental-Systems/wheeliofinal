$baseUrl = "http://localhost:8072/api/auth"

# 1. Signup
$signupBody = @{
    email    = "testauth@example.com"
    password = "password123"
    fullName = "Test Auth User"
    role     = "USER"
    phone    = "9876543210"
    city     = "Chennai"
} | ConvertTo-Json

Write-Host "Testing Signup..."
try {
    $signupResponse = Invoke-RestMethod -Uri "$baseUrl/signup" -Method Post -Body $signupBody -ContentType "application/json"
    Write-Host "Signup Successful. Token received."
    $token = $signupResponse.token
}
catch {
    Write-Host "Signup Failed: $($_.Exception.Message)"
    # Try login if signup failed (maybe user exists)
}

# 2. Login
$loginBody = @{
    email    = "testauth@example.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "`nTesting Login..."
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Login Successful. Token received."
    $token = $loginResponse.token
}
catch {
    Write-Host "Login Failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}

# 3. Access Protected Endpoint
if ($token) {
    Write-Host "`nTesting Protected Endpoint (Me)..."
    try {
        $headers = @{ Authorization = "Bearer $token" }
        $meResponse = Invoke-RestMethod -Uri "$baseUrl/me" -Method Get -Headers $headers
        Write-Host "Access Granted. User: $($meResponse.email)"
    }
    catch {
        Write-Host "Access Denied: $($_.Exception.Message)"
    }
}
