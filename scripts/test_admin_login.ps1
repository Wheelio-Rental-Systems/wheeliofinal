$baseUrl = "http://localhost:8072/api/auth"

# Login as Admin
$loginBody = @{
    email    = "admin@wheelio.com"
    password = "admin123"
} | ConvertTo-Json

Write-Host "Testing Admin Login..."
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Admin Login Successful. Token received."
    Write-Host "User Role: $($loginResponse.user.role)"
}
catch {
    Write-Host "Admin Login Failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}
