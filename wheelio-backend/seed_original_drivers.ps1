$baseUrl = "http://localhost:8072/api"

# Function to create a driver
function Create-Driver ($email, $name, $city, $license, $rating, $experience) {
    # 1. Signup as User with Role DRIVER
    $signupBody = @{
        email     = $email
        password  = "password123"
        fullName  = $name
        role      = "DRIVER"
        phone     = "9876543210"
        city      = $city
        avatarUrl = "/images/driver-placeholder.jpg" # Placeholder for now, or map from JS if possible
    } | ConvertTo-Json

    try {
        Write-Host "Creating User: $name ($city)..."
        $signupResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
        $token = $signupResponse.token
        $userId = $signupResponse.user.id
        
        # 2. Create Driver Profile
        $profileBody = @{
            driver        = @{ id = $userId }
            user          = @{ id = $userId }
            licenseNumber = $license
            status        = "ACTIVE"
            rating        = $rating
            documents     = @{ experience = $experience } # Storing experience in documents JSON for now as there is no column
        } | ConvertTo-Json

        $headers = @{ Authorization = "Bearer $token" }
        Write-Host "Creating Driver Profile..."
        Invoke-RestMethod -Uri "$baseUrl/drivers" -Method Post -Body $profileBody -ContentType "application/json" -Headers $headers
        Write-Host "Driver Profile Created for $name.`n"
    }
    catch {
        Write-Host "Failed to create driver $name : $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Response: $($reader.ReadToEnd())"
        }
    }
}

# Clear existing drivers (Optional/Manual for now, assuming unique emails)

# Seed Drivers from frontend/src/app/data/drivers.js
Create-Driver "rajesh.kumar@example.com" "Rajesh Kumar" "Mumbai" "MH012024001" 4.8 "5 Years"
Create-Driver "suresh.patel@example.com" "Suresh Patel" "Delhi" "DL012024002" 4.9 "7 Years"
Create-Driver "amit.singh@example.com" "Amit Singh" "Bangalore" "KA012024003" 4.7 "10 Years"
Create-Driver "vikram.reddy@example.com" "Vikram Reddy" "Hyderabad" "TS012024004" 4.6 "4 Years"
Create-Driver "karthik.s@example.com" "Karthik Subramanian" "Chennai" "TN012024005" 4.9 "12 Years"
Create-Driver "arjun.das@example.com" "Arjun Das" "Kolkata" "WB012024006" 4.5 "3 Years"
Create-Driver "rahul.sharma@example.com" "Rahul Sharma" "Pune" "MH122024007" 4.8 "6 Years"
Create-Driver "manish.gupta@example.com" "Manish Gupta" "Ahmedabad" "GJ012024008" 4.7 "8 Years"
Create-Driver "vijay.verma@example.com" "Vijay Verma" "Jaipur" "RJ012024009" 4.9 "9 Years"
Create-Driver "deepak.mehta@example.com" "Deepak Mehta" "Surat" "GJ052024010" 4.6 "5 Years"
Create-Driver "sanjay.menon@example.com" "Sanjay Menon" "Coimbatore" "TN032024011" 4.7 "11 Years"
Create-Driver "rohan.kapoor@example.com" "Rohan Kapoor" "Lucknow" "UP322024012" 4.8 "6 Years"
Create-Driver "anil.tiwari@example.com" "Anil Tiwari" "Kanpur" "UP782024013" 4.5 "4 Years"
Create-Driver "prakash.joshi@example.com" "Prakash Joshi" "Nagpur" "MH312024014" 4.9 "15 Years"
Create-Driver "mohit.agarwal@example.com" "Mohit Agarwal" "Indore" "MP092024015" 4.6 "5 Years"
Create-Driver "ganesh.patil@example.com" "Ganesh Patil" "Thane" "MH042024016" 4.8 "7 Years"
Create-Driver "vikas.yadav@example.com" "Vikas Yadav" "Bhopal" "MP042024017" 4.7 "6 Years"
Create-Driver "naveen.raju@example.com" "Naveen Raju" "Visakhapatnam" "AP312024018" 4.9 "9 Years"
Create-Driver "sachin.d@example.com" "Sachin Deshmukh" "Pimpri-Chinchwad" "MH142024019" 4.6 "4 Years"
Create-Driver "rakesh.jha@example.com" "Rakesh Jha" "Patna" "BR012024020" 4.7 "7 Years"

Write-Host "Seeding Complete."
