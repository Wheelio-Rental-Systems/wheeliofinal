$baseUrl = "http://localhost:8072/api"

# Function to create a driver
function Create-Driver ($email, $name, $city, $license) {
    # 1. Signup as User with Role DRIVER
    $signupBody = @{
        email    = $email
        password = "password123"
        fullName = $name
        role     = "DRIVER"
        phone    = "9876543210"
        city     = $city
    } | ConvertTo-Json

    try {
        Write-Host "Creating User: $name ($city)..."
        $signupResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
        $token = $signupResponse.token
        $userId = $signupResponse.user.id
        Write-Host "User Created. ID: $userId"

        # 2. Create Driver Profile
        $profileBody = @{
            driver        = @{ id = $userId } # Try this first, or just send the object with user
            user          = @{ id = $userId }
            licenseNumber = $license
            status        = "ACTIVE"
            rating        = 4.8
        } | ConvertTo-Json

        $headers = @{ Authorization = "Bearer $token" }
        Write-Host "Creating Driver Profile..."
        try {
            $response = Invoke-RestMethod -Uri "$baseUrl/drivers" -Method Post -Body $profileBody -ContentType "application/json" -Headers $headers
            Write-Host "Driver Profile Created for $name.`n"
        }
        catch {
            Write-Host "Failed to create profile: $($_.Exception.Message)"
            if ($_.Exception.Response) {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                Write-Host "Response: $($reader.ReadToEnd())"
            }
        }
    }
    catch {
        Write-Host "Failed to create driver $name : $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Response: $($reader.ReadToEnd())"
        }
    }
}

# Create Drivers in Bangalore
Create-Driver "driver.blr1@example.com" "Ramesh Bangalore" "Bangalore" "KA012024001"
Create-Driver "driver.blr2@example.com" "Suresh Bangalore" "Bangalore" "KA052024002"

# Create Drivers in Chennai
Create-Driver "driver.chn1@example.com" "Ganesh Chennai" "Chennai" "TN012024001"
Create-Driver "driver.chn2@example.com" "Dinesh Chennai" "Chennai" "TN072024002"

Write-Host "Seeding Complete."
