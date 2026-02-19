$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8072/api"

# Single Driver for Debug
$drivers = @(
    @{ name = "Rajesh Kumar"; location = "Mumbai"; image = "/images/staff1.webp"; rating = 4.8; experience = "5 Years"; languages = "English, Hindi, Marathi" }
)

function Seed-Driver {
    param ($d, $index)

    $randomSuffix = Get-Random -Minimum 1000 -Maximum 9999
    $randomPhone = Get-Random -Minimum 10000000 -Maximum 99999999
    $safeName = $d.name -replace '\s', '.'
    $email = "$($safeName.ToLower()).$randomSuffix@example.com"
    $password = "password123"

    Write-Host "Processing $($d.name) ($($d.location)) as $email..."

    # 1. Register User
    $token = $null
    $userId = $null

    try {
        $registerBody = @{
            email     = $email
            password  = $password
            fullName  = $d.name
            role      = "DRIVER"
            city      = $d.location
            phone     = "98$randomPhone"
            avatarUrl = $d.image
        } | ConvertTo-Json

        Write-Host "Registering..."
        Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $registerBody -ContentType "application/json"
        
        Write-Host "Logging in..."
        $loginBody = @{ email = $email; password = $password } | ConvertTo-Json
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        $token = $loginResponse.token
        $userId = $loginResponse.user.id
        Write-Host "  -> Registered & Logged in. UserId: $userId"
    }
    catch {
        Write-Host "  -> CRITICAL: Failed to register user."
        Write-Host $_.Exception.Message
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host $reader.ReadToEnd()
        }
        return
    }

    # 2. Create Driver Profile
    $headers = @{ Authorization = "Bearer $token" }
    
    $profileBody = @{
        userId        = $userId
        licenseNumber = "DL-$($d.location.Substring(0,2).ToUpper())-$index-$randomSuffix"
        status        = "ACTIVE"
        rating        = $d.rating
        documents     = @{
            licenseUrl = "/images/license.jpeg"
            experience = $d.experience
            languages  = $d.languages
        }
    } | ConvertTo-Json

    try {
        Write-Host "Creating Profile..."
        Invoke-RestMethod -Uri "$baseUrl/drivers" -Method Post -Body $profileBody -ContentType "application/json" -Headers $headers
        Write-Host "  -> Driver Profile Created."
    }
    catch {
        Write-Host "  -> Failed to create profile."
        Write-Host $_.Exception.Message
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host $reader.ReadToEnd()
        }
    }
}

Seed-Driver -d $drivers[0] -index 999
