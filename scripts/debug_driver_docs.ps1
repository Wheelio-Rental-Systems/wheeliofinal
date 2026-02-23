$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8072/api"

# 1. Login to get a token (admin or any driver)
$loginBody = @{ email = "rajesh.kumar@example.com"; password = "password123" } | ConvertTo-Json
# We need to find a VALID user email from the seeded ones. 
# Since we used random suffixes, we don't know the exact email.
# Let's seed a FIXED user for debugging.

$debugEmail = "debug.driver@example.com"
$password = "password123"

# Register/Login Debug User
try {
    $registerBody = @{
        email    = $debugEmail
        password = $password
        fullName = "Debug Driver"
        role     = "DRIVER"
        city     = "Mumbai"
        phone    = "9999988888"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction SilentlyContinue
}
catch {}

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{ email = $debugEmail; password = $password } | ConvertTo-Json) -ContentType "application/json"
$token = $loginResponse.token
$userId = $loginResponse.user.id
$headers = @{ Authorization = "Bearer $token" }

Write-Host "Debug User ID: $userId"

# 2. Update Documents
$docBody = @{
    documents = @{
        licenseUrl = "/images/test.jpg"
        note       = "This is a test"
    }
} | ConvertTo-Json

Write-Host "Sending Update Body:"
Write-Host $docBody

try {
    # Check if profile exists
    try {
        Invoke-RestMethod -Uri "$baseUrl/drivers/$userId" -Method Get -Headers $headers -ErrorAction Stop
    }
    catch {
        # Create if not exists
        $createBody = @{
            userId        = $userId
            licenseNumber = "DL-DEBUG-01"
            status        = "ACTIVE"
            documents     = @{
                licenseUrl = "/images/test.jpg"
                experience = "10 Years"
            }
        } | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/drivers" -Method Post -Body $createBody -ContentType "application/json" -Headers $headers
        Write-Host "Created Profile."
    }

    # Now Update
    $response = Invoke-RestMethod -Uri "$baseUrl/drivers/$userId" -Method Put -Body $docBody -ContentType "application/json" -Headers $headers
    
    Write-Host "Response from Update:"
    Write-Host ($response | ConvertTo-Json -Depth 5)

    # 3. Fetch Again to Verify
    $finalDetails = Invoke-RestMethod -Uri "$baseUrl/drivers/$userId" -Method Get -Headers $headers
    Write-Host "Final Fetched Profile:"
    Write-Host ($finalDetails | ConvertTo-Json -Depth 5)

}
catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host $_.Exception.Response.GetResponseStream()
}
