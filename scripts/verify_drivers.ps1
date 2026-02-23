$baseUrl = "http://localhost:8072/api"

# 1. Login as Admin/Staff (to be safe, though GET /drivers/available might be public or require auth)
# Let's try to get a token first
$loginBody = @{
    email    = "testauth@example.com" # Assuming this user exists from previous steps
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login Successful. Token received."
}
catch {
    Write-Host "Login Failed. Proceeding without token (might fail if endpoint is protected)."
}

$headers = @{}
if ($token) {
    $headers.Add("Authorization", "Bearer $token")
}

# 2. Get All Drivers
Write-Host "`n--- All Drivers ---"
try {
    $drivers = Invoke-RestMethod -Uri "$baseUrl/drivers" -Method Get -Headers $headers
    if ($drivers.Count -eq 0) {
        Write-Host "No drivers found."
    }
    else {
        $drivers | Format-Table userId, licenseNumber, status, rating
        
        # Check User details for each driver to see City
        foreach ($driver in $drivers) {
            # fetch user details if possible, or reliance on what's returned
            # DriverProfile might typically allow fetching the user object if configured, 
            # but usually we might need to fetch user separately if not embedded.
            # Let's inspect the driver object structure first.
            Write-Host "Driver: $($driver | ConvertTo-Json -Depth 2)"
        }
    }
}
catch {
    Write-Host "Failed to fetch drivers: $($_.Exception.Message)"
}
