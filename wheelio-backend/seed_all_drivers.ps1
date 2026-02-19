$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8072/api"

# List of locations extracted from frontend data
$locations = @(
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", 
    "Ahmedabad", "Jaipur", "Surat", "Coimbatore", "Lucknow", "Kanpur", "Nagpur", 
    "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna",
    "Chandigarh", "Manali", "Kochi", "Hosur", "Goa", "Rishikesh"
)

# Function to create a driver
function Create-Driver {
    param (
        [string]$city,
        [int]$index
    )

    $email = "driver${index}.${city}@example.com"
    $password = "password123"
    $fullName = "Driver $city"

    # 1. Register User
    $registerBody = @{
        email    = $email
        password = $password
        fullName = $fullName
        role     = "DRIVER"
        city     = $city
        phone    = "98765432$($index.ToString('00'))"
    } | ConvertTo-Json

    Write-Host "Processing $city ($email)..."

    try {
        Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $registerBody -ContentType "application/json"
    }
    catch {
        # Ignore if user exists
        # Write-Host "  User likely exists."
    }

    # 2. Login to get Token
    $loginBody = @{
        email    = $email
        password = $password
    } | ConvertTo-Json

    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        $token = $loginResponse.token
        $userId = $loginResponse.user.id
        
        # 3. Create Driver Profile
        $headers = @{ Authorization = "Bearer $token" }

        $profileBody = @{
            userId        = $userId
            licenseNumber = "MH-$index-2024-$($city.Substring(0,3).ToUpper())"
            status        = "ACTIVE"
            documents     = @{
                licenseUrl = "/images/license.jpeg" 
                experience = "5 Years"
            }
        } | ConvertTo-Json

        Invoke-RestMethod -Uri "$baseUrl/drivers" -Method Post -Body $profileBody -ContentType "application/json" -Headers $headers
        Write-Host "  -> Profile Created."
    }
    catch {
        Write-Host "  -> Failed: $($_.Exception.Message)"
    }
}

# Main Loop
$i = 1
foreach ($loc in $locations) {
    Create-Driver -city $loc -index $i
    $i++
}

Write-Host "`nAll drivers seeded."
