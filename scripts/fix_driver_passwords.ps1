# fix_driver_passwords.ps1
# Step 1: Delete old (bad-hash) driver accounts
# Step 2: Signup via live API (gets proper BCrypt hash)
# Step 3: Patch _id to match drivers.js

$BASE = "http://localhost:8072/api/auth"
$PASS = "Driver@123"

$drivers = @(
    @{ id = "6997c2094452e44f57b180dd"; name = "Rajesh Kumar"; email = "rajesh.kumar@wheelio.com"; city = "Mumbai" },
    @{ id = "6997c2094452e44f57b180df"; name = "Suresh Patel"; email = "suresh.patel@wheelio.com"; city = "Delhi" },
    @{ id = "6997c2094452e44f57b180e1"; name = "Amit Singh"; email = "amit.singh@wheelio.com"; city = "Bangalore" },
    @{ id = "6997c2094452e44f57b180e3"; name = "Vikram Reddy"; email = "vikram.reddy@wheelio.com"; city = "Hyderabad" },
    @{ id = "6997c2094452e44f57b180e5"; name = "Karthik Subramanian"; email = "karthik.subramanian@wheelio.com"; city = "Chennai" },
    @{ id = "6997c20a4452e44f57b180e7"; name = "Arjun Das"; email = "arjun.das@wheelio.com"; city = "Kolkata" },
    @{ id = "6997c20a4452e44f57b180e9"; name = "Rahul Sharma"; email = "rahul.sharma@wheelio.com"; city = "Pune" },
    @{ id = "6997c20a4452e44f57b180eb"; name = "Manish Gupta"; email = "manish.gupta@wheelio.com"; city = "Ahmedabad" },
    @{ id = "6997c20a4452e44f57b180ed"; name = "Vijay Verma"; email = "vijay.verma@wheelio.com"; city = "Jaipur" },
    @{ id = "6997c20a4452e44f57b180ef"; name = "Deepak Mehta"; email = "deepak.mehta@wheelio.com"; city = "Surat" },
    @{ id = "6997c20a4452e44f57b180f1"; name = "Sanjay Menon"; email = "sanjay.menon@wheelio.com"; city = "Coimbatore" },
    @{ id = "6997c20a4452e44f57b180f3"; name = "Rohan Kapoor"; email = "rohan.kapoor@wheelio.com"; city = "Lucknow" },
    @{ id = "6997c20a4452e44f57b180f5"; name = "Anil Tiwari"; email = "anil.tiwari@wheelio.com"; city = "Kanpur" },
    @{ id = "6997c20a4452e44f57b180f7"; name = "Prakash Joshi"; email = "prakash.joshi@wheelio.com"; city = "Nagpur" },
    @{ id = "6997c20a4452e44f57b180f9"; name = "Mohit Agarwal"; email = "mohit.agarwal@wheelio.com"; city = "Indore" },
    @{ id = "6997c20a4452e44f57b180fb"; name = "Ganesh Patil"; email = "ganesh.patil@wheelio.com"; city = "Thane" },
    @{ id = "6997c20a4452e44f57b180fd"; name = "Vikas Yadav"; email = "vikas.yadav@wheelio.com"; city = "Bhopal" },
    @{ id = "6997c20b4452e44f57b180ff"; name = "Naveen Raju"; email = "naveen.raju@wheelio.com"; city = "Visakhapatnam" },
    @{ id = "6997c20b4452e44f57b18101"; name = "Sachin Deshmukh"; email = "sachin.deshmukh@wheelio.com"; city = "Pimpri-Chinchwad" },
    @{ id = "6997c20b4452e44f57b18103"; name = "Rakesh Jha"; email = "rakesh.jha@wheelio.com"; city = "Patna" }
)

Write-Host "=== Wheelio Driver Fix ===" -ForegroundColor Cyan

# Step 1: Delete old records
Write-Host "`nStep 1: Removing old driver records..." -ForegroundColor Yellow
foreach ($d in $drivers) {
    $email = $d.email
    mongosh "mongodb://localhost:27017/wheelio_db" --quiet --eval "db.users.deleteMany({email:'$email'})" | Out-Null
}
Write-Host "  Done." -ForegroundColor Green

# Step 2: Signup via API
Write-Host "`nStep 2: Signing up drivers via live API..." -ForegroundColor Yellow
$tempIds = @{}
foreach ($d in $drivers) {
    $body = ConvertTo-Json @{
        email    = $d.email
        password = $PASS
        fullName = $d.name
        role     = "DRIVER"
        city     = $d.city
        phone    = "+91-9800000000"
    }
    try {
        $resp = Invoke-RestMethod "$BASE/signup" -Method POST -Body $body -ContentType "application/json"
        $tempId = $resp.user.id
        $tempIds[$d.email] = $tempId
        Write-Host "  OK: $($d.name) | temp_id=$tempId" -ForegroundColor Green
    }
    catch {
        Write-Host "  ERR: $($d.name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 3: Patch _id in MongoDB
Write-Host "`nStep 3: Patching _id values to match drivers.js..." -ForegroundColor Yellow
foreach ($d in $drivers) {
    $email = $d.email
    $targetId = $d.id
    $tempId = $tempIds[$email]

    if (-not $tempId) {
        Write-Host "  SKIP (no tempId): $($d.name)" -ForegroundColor Gray
        continue
    }

    if ($tempId -eq $targetId) {
        Write-Host "  SAME (no patch needed): $($d.name)" -ForegroundColor Gray
        continue
    }

    # Build the mongosh patch inline (no here-string)
    $evalScript = "var doc=db.users.findOne({email:'$email'}); if(doc){var newDoc=Object.assign({},doc); newDoc._id=ObjectId('$targetId'); try{db.users.insertOne(newDoc); db.users.deleteOne({_id:ObjectId('$tempId')}); print('OK');}catch(e){print('ERR:'+e.message);}} else {print('NOT_FOUND');}"
    $result = mongosh "mongodb://localhost:27017/wheelio_db" --quiet --eval $evalScript
    Write-Host "  Patched: $($d.name) → $targetId ($result)" -ForegroundColor Green
}

# Verify
Write-Host "`n=== Verification ===" -ForegroundColor Cyan
$count = mongosh "mongodb://localhost:27017/wheelio_db" --quiet --eval "print(db.users.countDocuments({role:'DRIVER'}))"
Write-Host "Total DRIVER accounts: $count" -ForegroundColor White

$amitId = mongosh "mongodb://localhost:27017/wheelio_db" --quiet --eval "var u=db.users.findOne({email:'amit.singh@wheelio.com'}); if(u){print(u._id.toString()+' | '+u.fullName);}"
Write-Host "Amit Singh: $amitId" -ForegroundColor White
Write-Host "Expected  : 6997c2094452e44f57b180e1" -ForegroundColor Gray

Write-Host "`nLogin: amit.singh@wheelio.com / Driver@123" -ForegroundColor Cyan
