# Login as Driver to get ID
$loginUrl = "http://localhost:8072/api/auth/login"
$body = @{
    email    = "driver@wheelio.com"
    password = "driver123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $body -ContentType "application/json"
    $id = $response.user.id
    Write-Host "FOUND_DRIVER_ID: $id"
    $id | Out-File -FilePath "driver_id.txt" -Encoding utf8
}
catch {
    Write-Error "Login Failed: $($_.Exception.Message)"
}
