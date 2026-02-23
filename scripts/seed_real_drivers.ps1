$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8072/api"

# Driver Data from frontend/src/app/data/drivers.js
$drivers = @(
    @{ name = "Rajesh Kumar"; location = "Mumbai"; image = "/images/staff1.webp"; rating = 4.8; experience = "5 Years"; languages = "English, Hindi, Marathi" },
    @{ name = "Suresh Patel"; location = "Delhi"; image = "/images/staff2.avif"; rating = 4.9; experience = "7 Years"; languages = "English, Hindi, Punjabi" },
    @{ name = "Amit Singh"; location = "Bangalore"; image = "/images/staff3.jpg"; rating = 4.7; experience = "10 Years"; languages = "English, Hindi, Kannada" },
    @{ name = "Vikram Reddy"; location = "Hyderabad"; image = "/images/staff4.jpg"; rating = 4.6; experience = "4 Years"; languages = "English, Telugu, Hindi" },
    @{ name = "Karthik Subramanian"; location = "Chennai"; image = "/images/staff5.jpg"; rating = 4.9; experience = "12 Years"; languages = "English, Tamil, Hindi" },
    @{ name = "Arjun Das"; location = "Kolkata"; image = "/images/satff6.jpg"; rating = 4.5; experience = "3 Years"; languages = "English, Bengali, Hindi" },
    @{ name = "Rahul Sharma"; location = "Pune"; image = "/images/staff7.jpg"; rating = 4.8; experience = "6 Years"; languages = "English, Hindi, Marathi" },
    @{ name = "Manish Gupta"; location = "Ahmedabad"; image = "/images/staff8.jpg"; rating = 4.7; experience = "8 Years"; languages = "English, Hindi, Gujarati" },
    @{ name = "Vijay Verma"; location = "Jaipur"; image = "/images/staff9.jpg"; rating = 4.9; experience = "9 Years"; languages = "English, Hindi, Rajasthani" },
    @{ name = "Deepak Mehta"; location = "Surat"; image = "/images/staff10.jpg"; rating = 4.6; experience = "5 Years"; languages = "English, Hindi, Gujarati" },
    @{ name = "Sanjay Menon"; location = "Coimbatore"; image = "/images/staff11.jpg"; rating = 4.7; experience = "11 Years"; languages = "English, Tamil, Malayalam" },
    @{ name = "Rohan Kapoor"; location = "Lucknow"; image = "/images/staff12.jpg"; rating = 4.8; experience = "6 Years"; languages = "English, Hindi" },
    @{ name = "Anil Tiwari"; location = "Kanpur"; image = "/images/staff13.jpg"; rating = 4.5; experience = "4 Years"; languages = "English, Hindi" },
    @{ name = "Prakash Joshi"; location = "Nagpur"; image = "/images/staff14.jpg"; rating = 4.9; experience = "15 Years"; languages = "English, Hindi, Marathi" },
    @{ name = "Mohit Agarwal"; location = "Indore"; image = "/images/staff15.jpg"; rating = 4.6; experience = "5 Years"; languages = "English, Hindi" },
    @{ name = "Ganesh Patil"; location = "Thane"; image = "/images/staff16.jpg"; rating = 4.8; experience = "7 Years"; languages = "English, Hindi, Marathi" },
    @{ name = "Vikas Yadav"; location = "Bhopal"; image = "/images/staff17.jpg"; rating = 4.7; experience = "6 Years"; languages = "English, Hindi" },
    @{ name = "Naveen Raju"; location = "Visakhapatnam"; image = "/images/staff18.jpg"; rating = 4.9; experience = "9 Years"; languages = "English, Telugu, Hindi" },
    @{ name = "Sachin Deshmukh"; location = "Pimpri-Chinchwad"; image = "/images/staff19.jpg"; rating = 4.6; experience = "4 Years"; languages = "English, Hindi, Marathi" },
    @{ name = "Rakesh Jha"; location = "Patna"; image = "/images/varun.jpeg"; rating = 4.7; experience = "7 Years"; languages = "English, Hindi, Bhojpuri" }
)

function Seed-Driver {
    param ($d, $index)

    # Use a random suffix to avoid unique constraint issues if cleanup failed
    $randomSuffix = Get-Random -Minimum 1000 -Maximum 9999
    $randomPhone = Get-Random -Minimum 10000000 -Maximum 99999999
    $safeName = $d.name -replace '\s', '.'
    $email = "$($safeName.ToLower()).$randomSuffix@example.com"
    $password = "password123"

    Write-Host "Processing $($d.name) ($($d.location)) as $email..."

    # 1. Register User (Since email is unique, we expect this to work)
    $token = $null
    $userId = $null

    try {
        $registerBody = @{
            email     = $email
            password  = $password
            fullName  = $d.name
            role      = "DRIVER"
            city      = $d.location
            phone     = "98$randomPhone" # Ensure phone is unique
            avatarUrl = $d.image
        } | ConvertTo-Json

        Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $registerBody -ContentType "application/json"
        
        # Login to get token
        $loginBody = @{ email = $email; password = $password } | ConvertTo-Json
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        $token = $loginResponse.token
        $userId = $loginResponse.user.id
        Write-Host "  -> Registered & Logged in. UserId: $userId"
    }
    catch {
        Write-Host "  -> CRITICAL: Failed to register user. $($_.Exception.Message)"
        return
    }

    # 2. Create Driver Profile
    $headers = @{ Authorization = "Bearer $token" }
    
    # Check if profile exists - CAREFULLY
    $existingProfile = $null
    try {
        $existingProfile = Invoke-RestMethod -Uri "$baseUrl/drivers/$userId" -Method Get -Headers $headers
        Write-Host "  -> Driver profile ALREADY EXISTS for new user? (Unexpected)"
    }
    catch {
        # Check if it was a 404
        if ($_.Exception.Response.StatusCode -eq [System.Net.HttpStatusCode]::NotFound) {
            # Expected
        }
        else {
            Write-Host "  -> Error checking profile: $($_.Exception.Message)"
            # If error is not 404 (e.g. 500), we probably shouldn't try to create, or maybe we should?
            # Let's try to create anyway, but log it.
        }
    }

    if (-not $existingProfile) {
        $profileBody = @{
            userId        = $userId
            licenseNumber = "DL-$($d.location.Substring(0,2).ToUpper())-$index-$randomSuffix" # Unique license
            status        = "ACTIVE"
            rating        = $d.rating
            documents     = @{
                licenseUrl = "/images/license.jpeg"
                experience = $d.experience
                languages  = $d.languages
            }
        } | ConvertTo-Json

        try {
            Invoke-RestMethod -Uri "$baseUrl/drivers" -Method Post -Body $profileBody -ContentType "application/json" -Headers $headers
            Write-Host "  -> Driver Profile Created."
        }
        catch {
            Write-Host "  -> Failed to create profile: $($_.Exception.Message)"
            Write-Host "     Body: $profileBody"
        }
    }
}

# Run execution
$idx = 100
foreach ($driver in $drivers) {
    Seed-Driver -d $driver -index $idx
    $idx++
}

Write-Host "`nSeeding Complete."
