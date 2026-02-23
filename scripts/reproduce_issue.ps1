
# 1. Login
$loginUrl = "http://localhost:8073/api/auth/login"
$loginBody = @{
    email    = "admin@wheelio.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    $userId = $loginResponse.user.id
    Write-Host "Login Successful. UserID: $userId"
}
catch {
    Write-Error "Login Failed: $($_.Exception.Message)"
    exit
}

# 2. Get Vehicles
$vehicleUrl = "http://localhost:8073/api/vehicles"
try {
    $vehicles = Invoke-RestMethod -Uri $vehicleUrl -Method Get -Headers @{ Authorization = "Bearer $token" }
    if ($vehicles.Count -eq 0) {
        Write-Warning "No vehicles found. Creating one..."
        # Create a dummy vehicle for testing
        $createVehicleUrl = "http://localhost:8073/api/vehicles"
        $vehicleBody = @{
            name     = "Test Car"
            type     = "Sedan"
            location = "Mumbai"
            price    = 500
            imageUrl = "http://example.com/car.jpg"
            status   = "AVAILABLE"
            features = @("AC")
            images   = @("http://example.com/car.jpg")
        } | ConvertTo-Json
        $vehicle = Invoke-RestMethod -Uri $createVehicleUrl -Method Post -Body $vehicleBody -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json"
        $vehicleId = $vehicle.id
    }
    else {
        $vehicleId = $vehicles[0].id
    }
    Write-Host "Using VehicleID: $vehicleId"
}
catch {
    Write-Error "Failed to get/create vehicle: $($_.Exception.Message)"
    exit
}

# 3. Create Booking (The Failure Point)
$bookingUrl = "http://localhost:8073/api/bookings"
$bookingBody = @{
    userId      = $userId
    vehicleId   = $vehicleId
    driverId    = $null
    startDate   = "2026-10-01T10:00:00.000Z"
    endDate     = "2026-10-02T10:00:00.000Z"
    totalAmount = 1500.00
} | ConvertTo-Json

Write-Host "Attempting to create booking with JSON payload:"
Write-Host $bookingBody

try {
    $response = Invoke-RestMethod -Uri $bookingUrl -Method Post -Headers @{ Authorization = "Bearer $token" } -Body $bookingBody -ContentType "application/json"
    Write-Host "Booking Created Successfully!"
    Write-Host $($response | ConvertTo-Json -Depth 5)
}
catch {
    Write-Error "Booking Creation Failed!"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Server Response: $responseBody"
    }
}
