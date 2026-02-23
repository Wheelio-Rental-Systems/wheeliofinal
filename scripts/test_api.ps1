$baseUrl = "http://localhost:8072/api"

function Test-Endpoint($url, $token = $null) {
    $headers = @{}
    if ($token) { $headers.Authorization = "Bearer $token" }
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/$url" -Method Get -Headers $headers -UseBasicParsing
        Write-Host "GET $url : SUCCESS ($($response.StatusCode))"
        return $response
    }
    catch {
        Write-Host "GET $url : FAILED ($($_.Exception.Message))"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Response Body: $($reader.ReadToEnd())"
        }
        return $null
    }
}

Write-Host "--- Testing Health ---"
Test-Endpoint "health"

Write-Host "`n--- Testing Vehicles (Unauthenticated) ---"
Test-Endpoint "vehicles"

Write-Host "`n--- Attempting Admin Login ---"
$loginBody = @{ email = "admin@wheelio.com"; password = "admin123" } | ConvertTo-Json
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login SUCCESS. Token received."
    
    Write-Host "`n--- Testing Vehicles (Authenticated) ---"
    Test-Endpoint "vehicles" $token
}
catch {
    Write-Host "Login FAILED: $($_.Exception.Message)"
}
