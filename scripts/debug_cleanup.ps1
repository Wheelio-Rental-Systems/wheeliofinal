$baseUrl = "http://localhost:8072/api"
$email = "rajesh.kumar@example.com"
$password = "password123"

Write-Host "Attempting to delete $email..."

try {
    # 1. Login
    $loginUrl = "$baseUrl/auth/login"
    $loginBody = @{ email = $email; password = $password } | ConvertTo-Json
    Write-Host "Logging in via $loginUrl..."
    
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    
    $token = $loginResponse.token
    $userId = $loginResponse.user.id
    Write-Host "Login Successful. Token: $token (First 10 chars)"
    Write-Host "UserId: $userId"

    if ($userId) {
        # 2. Delete
        $deleteUrl = "$baseUrl/users/$userId"
        Write-Host "Sending DELETE request to $deleteUrl..."
        
        Invoke-RestMethod -Uri $deleteUrl -Method Delete -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
        Write-Host "DELETE request completed successfully."
    }
    else {
        Write-Host "UserId not found in login response."
        Write-Host "Response Keys: $($loginResponse.PSObject.Properties.Name -join ', ')"
    }

}
catch {
    Write-Host "ERROR OCCURRED:"
    Write-Host "Message: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
    else {
        Write-Host "No response body."
    }
}
