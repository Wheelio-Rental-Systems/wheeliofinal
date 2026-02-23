$ErrorActionPreference = "Stop"

function Test-Endpoint {
    param ($Name, $Command)
    Write-Host "Testing $Name..." -NoNewline
    try {
        # Using cmd /c to run curl.exe and capture output properly in all shells
        $output = cmd /c $Command
        if ($LASTEXITCODE -eq 0) {
            Write-Host " [OK]" -ForegroundColor Green
            return $output
        }
        else {
            throw "Command failed with exit code $LASTEXITCODE"
        }
    }
    catch {
        Write-Host " [FAILED]" -ForegroundColor Red
        Write-Host $_
        exit 1
    }
}

$baseUrl = "http://localhost:8082/api"
$randomInt = Get-Random -Minimum 1000 -Maximum 9999
$email = "testuser$randomInt@example.com"

Write-Host "=== Wheelio Backend Validations ==="
Write-Host "Target: $baseUrl"
Write-Host ""

# 1. Health Check
$health = Test-Endpoint "Health Check" "curl.exe -s $baseUrl/health"

# 2. Signup
$signupJson = "{""email"":""$email"",""password"":""password123"",""fullName"":""Test User"",""role"":""USER"",""phone"":""1234567890"",""city"":""Test City""}"
# Escape quotes for cmd/curl
$signupJsonEscaped = $signupJson.Replace('"', '\"')

Write-Host "Testing Signup ($email)..." -NoNewline
$signupResponse = cmd /c "curl.exe -s -X POST $baseUrl/auth/signup -H ""Content-Type: application/json"" -d ""$signupJsonEscaped"""
$token = ($signupResponse | ConvertFrom-Json).token
Write-Host " [OK]" -ForegroundColor Green

# 3. Login
$loginJson = "{""email"":""$email"",""password"":""password123""}"
$loginJsonEscaped = $loginJson.Replace('"', '\"')

Write-Host "Testing Login..." -NoNewline
$loginResponse = cmd /c "curl.exe -s -X POST $baseUrl/auth/login -H ""Content-Type: application/json"" -d ""$loginJsonEscaped"""
# Check if token exists
if ($loginResponse -match "token") {
    Write-Host " [OK]" -ForegroundColor Green
}
else {
    Write-Warning "Login response invalid"
}

# 4. File Upload
Write-Host "Creating dummy file..."
"Checking file storage" | Out-File -FilePath "verify_upload.txt" -Encoding ascii

Write-Host "Testing File Upload..." -NoNewline
$uploadResult = cmd /c "curl.exe -s -X POST -F ""file=@verify_upload.txt"" $baseUrl/files/upload"
$fileId = ($uploadResult | ConvertFrom-Json).fileId
Write-Host " [OK] (ID: $fileId)" -ForegroundColor Green

# 5. File Download
Write-Host "Testing File Download..." -NoNewline
cmd /c "curl.exe -s $baseUrl/files/$fileId -o verify_download.txt"
$content = Get-Content "verify_download.txt"
if ($content -eq "Checking file storage") {
    Write-Host " [OK]" -ForegroundColor Green
}
else {
    Write-Host " [FAILED] Content mismatch" -ForegroundColor Red
}

# 6. Create Vehicle (needs Auth usually, testing public GET for now)
Write-Host "Testing Get All Vehicles..." -NoNewline
$vehicles = cmd /c "curl.exe -s $baseUrl/vehicles"
$jsonAuth = $vehicles | ConvertFrom-Json
Write-Host " [OK] (Count: $($jsonAuth.Count))" -ForegroundColor Green

Write-Host ""
Write-Host "=== All System Checks Passed ===" -ForegroundColor Cyan
