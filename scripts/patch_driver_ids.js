/**
 * patch_driver_ids.js
 * 
 * Run AFTER signing up all drivers via the API.
 * This script reads each driver doc, deletes it, and reinserts
 * with the correct _id that matches drivers.js.
 *
 * Usage: mongosh "mongodb://localhost:27017/wheelio_db" patch_driver_ids.js
 */

const driverMap = [
    { email: "rajesh.kumar@wheelio.com", targetId: "6997c2094452e44f57b180dd" },
    { email: "suresh.patel@wheelio.com", targetId: "6997c2094452e44f57b180df" },
    { email: "amit.singh@wheelio.com", targetId: "6997c2094452e44f57b180e1" },
    { email: "vikram.reddy@wheelio.com", targetId: "6997c2094452e44f57b180e3" },
    { email: "karthik.subramanian@wheelio.com", targetId: "6997c2094452e44f57b180e5" },
    { email: "arjun.das@wheelio.com", targetId: "6997c20a4452e44f57b180e7" },
    { email: "rahul.sharma@wheelio.com", targetId: "6997c20a4452e44f57b180e9" },
    { email: "manish.gupta@wheelio.com", targetId: "6997c20a4452e44f57b180eb" },
    { email: "vijay.verma@wheelio.com", targetId: "6997c20a4452e44f57b180ed" },
    { email: "deepak.mehta@wheelio.com", targetId: "6997c20a4452e44f57b180ef" },
    { email: "sanjay.menon@wheelio.com", targetId: "6997c20a4452e44f57b180f1" },
    { email: "rohan.kapoor@wheelio.com", targetId: "6997c20a4452e44f57b180f3" },
    { email: "anil.tiwari@wheelio.com", targetId: "6997c20a4452e44f57b180f5" },
    { email: "prakash.joshi@wheelio.com", targetId: "6997c20a4452e44f57b180f7" },
    { email: "mohit.agarwal@wheelio.com", targetId: "6997c20a4452e44f57b180f9" },
    { email: "ganesh.patil@wheelio.com", targetId: "6997c20a4452e44f57b180fb" },
    { email: "vikas.yadav@wheelio.com", targetId: "6997c20a4452e44f57b180fd" },
    { email: "naveen.raju@wheelio.com", targetId: "6997c20b4452e44f57b180ff" },
    { email: "sachin.deshmukh@wheelio.com", targetId: "6997c20b4452e44f57b18101" },
    { email: "rakesh.jha@wheelio.com", targetId: "6997c20b4452e44f57b18103" }
];

print("Patching driver _id values...");
let ok = 0, skip = 0, err = 0;

for (const entry of driverMap) {
    const doc = db.users.findOne({ email: entry.email });
    if (!doc) {
        print("  NOT FOUND: " + entry.email);
        err++;
        continue;
    }

    const newId = ObjectId(entry.targetId);

    if (doc._id.toString() === entry.targetId) {
        print("  SAME: " + entry.email);
        skip++;
        continue;
    }

    // Delete existing, reinsert with correct _id
    db.users.deleteOne({ _id: doc._id });
    doc._id = newId;
    db.users.insertOne(doc);
    print("  OK: " + entry.email + " -> " + entry.targetId);
    ok++;
}

print("\nDone: " + ok + " patched, " + skip + " already correct, " + err + " not found");
print("Total drivers: " + db.users.countDocuments({ role: "DRIVER" }));

// Verify Amit Singh
const amit = db.users.findOne({ email: "amit.singh@wheelio.com" });
if (amit) {
    print("Amit Singh ID: " + amit._id + " | Match: " + (amit._id.toString() === "6997c2094452e44f57b180e1"));
}
