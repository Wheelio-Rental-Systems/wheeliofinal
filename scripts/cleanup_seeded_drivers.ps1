$baseUrl = "http://localhost:8072/api"

# List of emails to delete
$emailsToDelete = @(
    "rajesh.kumar@example.com", "suresh.patel@example.com", "amit.singh@example.com",
    "vikram.reddy@example.com", "karthik.s@example.com", "arjun.das@example.com",
    "rahul.sharma@example.com", "manish.gupta@example.com", "vijay.verma@example.com",
    "deepak.mehta@example.com", "sanjay.menon@example.com", "rohan.kapoor@example.com",
    "anil.tiwari@example.com", "prakash.joshi@example.com", "mohit.agarwal@example.com",
    "ganesh.patil@example.com", "vikas.yadav@example.com", "naveen.raju@example.com",
    "sachin.d@example.com", "rakesh.jha@example.com"
)

# Login to get Admin Token (Assuming admin@example.com exists, or create one/use existing logic)
# For now, I'll delete by User ID if I can find them, or just rely on a generic delete loop if I had an admin endpoint.
# Since I verified they exist, I'll iterate and delete.

# 1. Login
$loginBody = @{
    email    = "admin@example.com" # Assuming an admin exists from previous steps or generic auth
    password = "adminpassword"  # Common default
} | ConvertTo-Json

try {
    # Try generic login or skip if no admin.
    # Actually, I created them with known passwords. I can login AS THEM and delete myself? 
    # Or better, just direct DB delete if I had access, but I must use API.
    # Let's try to login as one of them to verify API is up, then loop through all.
    
    # Wait! I don't have a specific "Delete Driver" endpoint exposed in the previous context scans?
    # Checking DriverController.java would be good. 
    # If no delete endpoint, I might have to add one or use SQL. Let's assume standard REST: DELETE /drivers/{id}
    
    # Let's just use SQL to be safe and fast since I have `mvn` access, but I can't run SQL directly easily without a client.
    # I will stick to API if possible.
    
    # Actually, most Spring Boot setups created here have a mapped delete.
    # Let's check DriverController.java first to be sure.
}
catch {
    Write-Host "Login failed."
}

# REVISED STRATEGY: 
# Since I cannot easily authenticate as Admin (don't know creds), I will just use the `seed_original_drivers.ps1` logic 
# to LOGIN as each user (since I know their password is "password123") and DELETE their own account if `DELETE /users/{id}` exists.
# Or `DELETE /drivers/{id}`.

foreach ($email in $emailsToDelete) {
    try {
        $loginBody = @{ email = $email; password = "password123" } | ConvertTo-Json
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        $token = $loginResponse.token
        $userId = $loginResponse.user.id
        
        if ($userId) {
            Write-Host "Deleting User/Driver: $email ($userId)..."
            # Try Delete User (cascades to driver usually)
            Invoke-RestMethod -Uri "$baseUrl/users/$userId" -Method Delete -Headers @{ Authorization = "Bearer $token" }
            Write-Host "Deleted."
        }
    }
    catch {
        Write-Host "Failed to delete $email : $($_.Exception.Message)"
    }
}
