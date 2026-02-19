
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    "userId"      = "3f8e5b4c-1122-3344-5566-778899aabbcc" 
    "vehicleId"   = "11223344-5566-7788-99aa-bbccddeeff00"
    "driverId"    = $null
    "startDate"   = "2026-10-01T10:00:00.000Z"
    "endDate"     = "2026-10-02T10:00:00.000Z"
    "totalAmount" = 1500.00
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8072/api/bookings" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "Success: $($response | ConvertTo-Json -Depth 5)"
}
catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}
