/**
 * Wheelio Driver Seeding Script
 * ================================
 * Run with:  mongosh "mongodb://localhost:27017/wheelio" seed_drivers_mongo.js
 *
 * This script inserts 20 driver user accounts into the "users" collection using
 * the EXACT _id values hardcoded in frontend/src/app/data/drivers.js.
 *
 * This ensures that when a booking stores driverId from drivers.js, and the
 * driver logs in, their user.id matches — so /bookings/driver/{user.id} works.
 *
 * Login credentials for all drivers:
 *   Email : firstname.lastname@wheelio.com  (e.g. amit.singh@wheelio.com)
 *   Password : Driver@123
 *
 * The passwordHash below is a BCrypt hash of "Driver@123" at cost 10.
 */

const DRIVER_PASSWORD_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuu";

const drivers = [
    {
        _id: ObjectId("6997c2094452e44f57b180dd"),
        email: "rajesh.kumar@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Rajesh Kumar",
        role: "DRIVER",
        city: "Mumbai",
        phone: "+91-9800000001",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c2094452e44f57b180df"),
        email: "suresh.patel@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Suresh Patel",
        role: "DRIVER",
        city: "Delhi",
        phone: "+91-9800000002",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c2094452e44f57b180e1"),
        email: "amit.singh@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Amit Singh",
        role: "DRIVER",
        city: "Bangalore",
        phone: "+91-9800000003",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c2094452e44f57b180e3"),
        email: "vikram.reddy@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Vikram Reddy",
        role: "DRIVER",
        city: "Hyderabad",
        phone: "+91-9800000004",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c2094452e44f57b180e5"),
        email: "karthik.subramanian@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Karthik Subramanian",
        role: "DRIVER",
        city: "Chennai",
        phone: "+91-9800000005",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180e7"),
        email: "arjun.das@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Arjun Das",
        role: "DRIVER",
        city: "Kolkata",
        phone: "+91-9800000006",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180e9"),
        email: "rahul.sharma@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Rahul Sharma",
        role: "DRIVER",
        city: "Pune",
        phone: "+91-9800000007",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180eb"),
        email: "manish.gupta@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Manish Gupta",
        role: "DRIVER",
        city: "Ahmedabad",
        phone: "+91-9800000008",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180ed"),
        email: "vijay.verma@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Vijay Verma",
        role: "DRIVER",
        city: "Jaipur",
        phone: "+91-9800000009",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180ef"),
        email: "deepak.mehta@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Deepak Mehta",
        role: "DRIVER",
        city: "Surat",
        phone: "+91-9800000010",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180f1"),
        email: "sanjay.menon@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Sanjay Menon",
        role: "DRIVER",
        city: "Coimbatore",
        phone: "+91-9800000011",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180f3"),
        email: "rohan.kapoor@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Rohan Kapoor",
        role: "DRIVER",
        city: "Lucknow",
        phone: "+91-9800000012",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180f5"),
        email: "anil.tiwari@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Anil Tiwari",
        role: "DRIVER",
        city: "Kanpur",
        phone: "+91-9800000013",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180f7"),
        email: "prakash.joshi@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Prakash Joshi",
        role: "DRIVER",
        city: "Nagpur",
        phone: "+91-9800000014",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180f9"),
        email: "mohit.agarwal@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Mohit Agarwal",
        role: "DRIVER",
        city: "Indore",
        phone: "+91-9800000015",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180fb"),
        email: "ganesh.patil@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Ganesh Patil",
        role: "DRIVER",
        city: "Thane",
        phone: "+91-9800000016",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20a4452e44f57b180fd"),
        email: "vikas.yadav@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Vikas Yadav",
        role: "DRIVER",
        city: "Bhopal",
        phone: "+91-9800000017",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20b4452e44f57b180ff"),
        email: "naveen.raju@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Naveen Raju",
        role: "DRIVER",
        city: "Visakhapatnam",
        phone: "+91-9800000018",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20b4452e44f57b18101"),
        email: "sachin.deshmukh@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Sachin Deshmukh",
        role: "DRIVER",
        city: "Pimpri-Chinchwad",
        phone: "+91-9800000019",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("6997c20b4452e44f57b18103"),
        email: "rakesh.jha@wheelio.com",
        passwordHash: DRIVER_PASSWORD_HASH,
        fullName: "Rakesh Jha",
        role: "DRIVER",
        city: "Patna",
        phone: "+91-9800000020",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

print("🚗 Wheelio Driver Seeding Script");
print("=================================");

let inserted = 0;
let skipped = 0;

for (const driver of drivers) {
    const existing = db.users.findOne({ _id: driver._id });
    if (existing) {
        // Update existing record to ensure role and password are correct
        db.users.updateOne(
            { _id: driver._id },
            {
                $set: {
                    email: driver.email,
                    passwordHash: driver.passwordHash,
                    fullName: driver.fullName,
                    role: driver.role,
                    city: driver.city,
                    phone: driver.phone,
                    updatedAt: driver.updatedAt
                }
            }
        );
        print(`  ↻ Updated : ${driver.fullName} (${driver.email})`);
        skipped++;
    } else {
        db.users.insertOne(driver);
        print(`  ✓ Inserted: ${driver.fullName} (${driver.email})`);
        inserted++;
    }
}

print("\n=================================");
print(`✅ Done! Inserted: ${inserted}, Updated: ${skipped}`);
print("\nDriver login credentials:");
print("  Email   : firstname.lastname@wheelio.com");
print("  Password: Driver@123");
print("\nExample — Amit Singh:");
print("  Email   : amit.singh@wheelio.com");
print("  Password: Driver@123");
