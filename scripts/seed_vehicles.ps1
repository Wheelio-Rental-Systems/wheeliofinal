$baseUrl = "http://localhost:8072/api"

# Function to signup as admin and get token
function Get-AdminToken {
    $adminBody = @{
        email    = "admin@wheelio.com"
        password = "admin123"
        fullName = "System Admin"
        role     = "ADMIN"
        phone    = "9999999999"
    } | ConvertTo-Json

    try {
        # Try login first
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
        return $loginResponse.token
    }
    catch {
        # If login fails, try signup
        try {
            $signupResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $adminBody -ContentType "application/json"
            return $signupResponse.token
        }
        catch {
            Write-Host "Failed to get admin token: $($_.Exception.Message)"
            return $null
        }
    }
}

# Function to create a vehicle
function Create-Vehicle ($token, $vehicleData) {
    $headers = @{ Authorization = "Bearer $token" }
    $body = $vehicleData | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/vehicles" -Method Post -Body $body -ContentType "application/json" -Headers $headers
        Write-Host "Created vehicle: $($response.name) with ID: $($response.id)"
    }
    catch {
        Write-Host "Failed to create vehicle $($vehicleData.name): $($_.Exception.Message)"
    }
}

$token = Get-AdminToken
if ($token) {
    Write-Host "Seeding Vehicles..."
    
    $vehicles = @(
        @{
            name        = "Maruti Swift"
            brand       = "Maruti Suzuki"
            type        = "HATCHBACK"
            pricePerDay = 1200
            location    = "Mumbai"
            status      = "AVAILABLE"
            imageUrl    = "/images/swift.jpeg"
            description = "The Maruti Swift is India's favourite hatchback."
            features    = @("Dual Airbags", "ABS with EBD", "Touchscreen")
        },
        @{
            name        = "Hyundai Creta"
            brand       = "Hyundai"
            type        = "SUV"
            pricePerDay = 2500
            location    = "Bangalore"
            status      = "AVAILABLE"
            imageUrl    = "/images/creta.jpg"
            description = "The Ultimate SUV."
            features    = @("Panoramic Sunroof", "Ventilated Seats", "Bose Sound")
        },
        @{
            name        = "Mahindra Thar 4x4"
            brand       = "Mahindra"
            type        = "SUV"
            pricePerDay = 3500
            location    = "Coimbatore"
            status      = "AVAILABLE"
            imageUrl    = "/images/thar.jpeg"
            description = "Explore the impossible."
            features    = @("4x4 Drivetrain", "Convertible Top", "All-Terrain Tyres")
        },
        @{
            name        = "Toyota Innova Crysta"
            brand       = "Toyota"
            type        = "MPV"
            pricePerDay = 3800
            location    = "Chennai"
            status      = "AVAILABLE"
            imageUrl    = "/images/toyata crysta.jpg"
            description = "Unmatched Comfort."
            features    = @("Captain Seats", "Ambient Lighting", "7 Airbags")
        }
    )

    foreach ($v in $vehicles) {
        Create-Vehicle -token $token -vehicleData $v
    }
    Write-Host "Seeding Complete."
}
else {
    Write-Error "Could not authenticate as admin."
}
