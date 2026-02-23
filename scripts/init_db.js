// init_db.js
// Run this with "mongosh wheelio_db init_db.js"
// This clears the DB and seeds it with data matching drivers.js and vehicles.js

db.users.drop();
db.vehicles.drop();
db.driver_profiles.drop();
db.damage_reports.drop();
db.bookings.drop();

const bcHash = "$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07OfSTiA3SFn.ot.7G"; // Bcrypt hash for Driver@123, User@123, Admin@123

// 1. Seed Users (Admin, Test User, and 20 Drivers)
const users = [
    {
        _id: ObjectId("6997c2094452e44f57b18000"),
        email: "admin@wheelio.com",
        passwordHash: bcHash,
        fullName: "System Admin",
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.wheelio.backend.model.User"
    },
    {
        _id: ObjectId("6997c2094452e44f57b18001"),
        email: "user@wheelio.com",
        passwordHash: bcHash,
        fullName: "Test User",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.wheelio.backend.model.User"
    }
];

// Drivers from drivers.js
const driverData = [
    { id: "6997c2094452e44f57b180dd", name: "Rajesh Kumar", email: "rajesh.kumar@wheelio.com", location: "Mumbai" },
    { id: "6997c2094452e44f57b180df", name: "Suresh Patel", email: "suresh.patel@wheelio.com", location: "Delhi" },
    { id: "6997c2094452e44f57b180e1", name: "Amit Singh", email: "amit.singh@wheelio.com", location: "Bangalore" },
    { id: "6997c2094452e44f57b180e3", name: "Vikram Reddy", email: "vikram.reddy@wheelio.com", location: "Hyderabad" },
    { id: "6997c2094452e44f57b180e5", name: "Karthik Subramanian", email: "karthik.subramanian@wheelio.com", location: "Chennai" },
    { id: "6997c20a4452e44f57b180e7", name: "Arjun Das", email: "arjun.das@wheelio.com", location: "Kolkata" },
    { id: "6997c20a4452e44f57b180e9", name: "Rahul Sharma", email: "rahul.sharma@wheelio.com", location: "Pune" },
    { id: "6997c20a4452e44f57b180eb", name: "Manish Gupta", email: "manish.gupta@wheelio.com", location: "Ahmedabad" },
    { id: "6997c20a4452e44f57b180ed", name: "Vijay Verma", email: "vijay.verma@wheelio.com", location: "Jaipur" },
    { id: "6997c20a4452e44f57b180ef", name: "Deepak Mehta", email: "deepak.mehta@wheelio.com", location: "Surat" },
    { id: "6997c20a4452e44f57b180f1", name: "Sanjay Menon", email: "sanjay.menon@wheelio.com", location: "Coimbatore" },
    { id: "6997c20a4452e44f57b180f3", name: "Rohan Kapoor", email: "rohan.kapoor@wheelio.com", location: "Lucknow" },
    { id: "6997c20a4452e44f57b180f5", name: "Anil Tiwari", email: "anil.tiwari@wheelio.com", location: "Kanpur" },
    { id: "6997c20a4452e44f57b180f7", name: "Prakash Joshi", email: "prakash.joshi@wheelio.com", location: "Nagpur" },
    { id: "6997c20a4452e44f57b180f9", name: "Mohit Agarwal", email: "mohit.agarwal@wheelio.com", location: "Indore" },
    { id: "6997c20a4452e44f57b180fb", name: "Ganesh Patil", email: "ganesh.patil@wheelio.com", location: "Thane" },
    { id: "6997c20a4452e44f57b180fd", name: "Vikas Yadav", email: "vikas.yadav@wheelio.com", location: "Bhopal" },
    { id: "6997c20b4452e44f57b180ff", name: "Naveen Raju", email: "naveen.raju@wheelio.com", location: "Visakhapatnam" },
    { id: "6997c20b4452e44f57b18101", name: "Sachin Deshmukh", email: "sachin.deshmukh@wheelio.com", location: "Pimpri-Chinchwad" },
    { id: "6997c20b4452e44f57b18103", name: "Rakesh Jha", email: "rakesh.jha@wheelio.com", location: "Patna" }
];

driverData.forEach(d => {
    users.push({
        _id: ObjectId(d.id),
        email: d.email,
        passwordHash: bcHash,
        fullName: d.name,
        role: "DRIVER",
        city: d.location,
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.wheelio.backend.model.User"
    });
});

db.users.insertMany(users);

// 2. Seed Driver Profiles (linked to the users)
const driverProfiles = driverData.map(d => ({
    userId: d.id,
    licenseNumber: "DL-" + d.id.substring(d.id.length - 8).toUpperCase(),
    status: "ACTIVE",
    experience: Math.floor(Math.random() * 10) + 3 + " Years",
    rating: 4.5 + (Math.random() * 0.5),
    _class: "com.wheelio.backend.model.DriverProfile"
}));

db.driver_profiles.insertMany(driverProfiles);

// 3. Seed Vehicles (from vehicles.js)
const vehicleData = [
    { id: "1", name: 'Maruti Swift', brand: 'Maruti Suzuki', type: 'HATCHBACK', price: 1200, location: 'Mumbai', status: 'AVAILABLE', image: '/images/swift.jpeg' },
    { id: "2", name: 'Hyundai Creta', brand: 'Hyundai', type: 'SUV', price: 2500, location: 'Bangalore', status: 'AVAILABLE', image: '/images/creta.jpg' },
    { id: "3", name: 'Mahindra Thar 4x4', brand: 'Mahindra', type: 'SUV', price: 3500, location: 'Coimbatore', status: 'AVAILABLE', image: '/images/thar.jpeg' },
    { id: "4", name: 'Tata Nexon EV', brand: 'Tata Motors', type: 'SUV', price: 2800, location: 'Pune', status: 'AVAILABLE', image: '/images/tata nexon ev.jpg' },
    { id: "5", name: 'Toyota Innova Crysta', brand: 'Toyota', type: 'MPV', price: 3800, location: 'Chennai', status: 'AVAILABLE', image: '/images/toyata crysta.jpg' },
    { id: "6", name: 'Honda City 5th Gen', brand: 'Honda', type: 'SEDAN', price: 2200, location: 'Delhi', status: 'AVAILABLE', image: '/images/honda city 5th gen.jpg' },
    { id: "7", name: 'Mahindra XUV700', brand: 'Mahindra', type: 'SUV', price: 3200, location: 'Hyderabad', status: 'AVAILABLE', image: '/images/Mahindra XUV700.jpeg' },
    { id: "8", name: 'Kia Seltos', brand: 'Kia', type: 'SUV', price: 2400, location: 'Kolkata', status: 'AVAILABLE', image: '/images/Kia Seltos.jpeg' },
    { id: "9", name: 'Tata Safari', brand: 'Tata Motors', type: 'SUV', price: 3300, location: 'Mumbai', status: 'MAINTENANCE', image: '/images/Tata Safari.webp' },
    { id: "10", name: 'Hyundai Verna', brand: 'Hyundai', type: 'SEDAN', price: 2100, location: 'Pune', status: 'AVAILABLE', image: '/images/Hyundai Verna.jpeg' },
    { id: "11", name: 'Maruti Brezza', brand: 'Maruti Suzuki', type: 'SUV', price: 1800, location: 'Jaipur', status: 'AVAILABLE', image: '/images/Maruti Brezza.avif' },
    { id: "12", name: 'Fortuner Legender', brand: 'Toyota', type: 'SUV', price: 6500, location: 'Chandigarh', status: 'AVAILABLE', image: '/images/for2.jpeg' },
    { id: "13", name: 'Royal Enfield Himalayan 450', brand: 'Royal Enfield', type: 'BIKE', price: 1500, location: 'Manali', status: 'AVAILABLE', image: '/images/himalayan 450.jpg' },
    { id: "14", name: 'Royal Enfield Classic 350', brand: 'Royal Enfield', type: 'BIKE', price: 1100, location: 'Chennai', status: 'AVAILABLE', image: '/images/cl1.avif' },
    { id: "15", name: 'KTM Duke 390', brand: 'KTM', type: 'BIKE', price: 1800, location: 'Bangalore', status: 'AVAILABLE', image: '/images/duke1.avif' },
    { id: "16", name: 'Bajaj Dominar 400', brand: 'Bajaj', type: 'BIKE', price: 1400, location: 'Pune', status: 'AVAILABLE', image: '/images/dom.jpg' },
    { id: "17", name: 'Yamaha R15 V4', brand: 'Yamaha', type: 'BIKE', price: 1200, location: 'Kochi', status: 'AVAILABLE', image: '/images/r15.jpg' },
    { id: "18", name: 'TVS Apache RR 310', brand: 'TVS', type: 'BIKE', price: 1600, location: 'Hosur', status: 'AVAILABLE', image: '/images/TVS Apache RR 310.jpeg' },
    { id: "19", name: 'Honda Hness CB350', brand: 'Honda', type: 'BIKE', price: 1300, location: 'Goa', status: 'AVAILABLE', image: '/images/Honda Hness CB350.jpeg' },
    { id: "20", name: 'Jawa 42 Bobber', brand: 'Jawa', type: 'BIKE', price: 1450, location: 'Mumbai', status: 'AVAILABLE', image: '/images/bob2.avif' },
    { id: "21", name: 'Hero Xpulse 200 4V', brand: 'Hero', type: 'BIKE', price: 1000, location: 'Rishikesh', status: 'AVAILABLE', image: '/images/Hero Xpulse 200 4V.jpg' },
    { id: "22", name: 'Ather 450X', brand: 'Ather Energy', type: 'SCOOTER', price: 900, location: 'Bangalore', status: 'AVAILABLE', image: '/images/ather2.avif' },
    { id: "23", name: 'Ola S1 Pro', brand: 'Ola Electric', type: 'SCOOTER', price: 850, location: 'Chennai', status: 'AVAILABLE', image: '/images/Ola S1 Pro.jpg' },
    { id: "24", name: 'Continental GT 650', brand: 'Royal Enfield', type: 'BIKE', price: 1900, location: 'Goa', status: 'AVAILABLE', image: '/images/Continental GT 650.webp' }
];

const vehicles = vehicleData.map(v => ({
    _id: v.id, // Using the numeric ID as the string _id for MongoDB
    name: v.name,
    brand: v.brand,
    type: v.type,
    pricePerDay: Number(v.price),
    location: v.location,
    status: v.status,
    imageUrl: v.image,
    createdAt: new Date(),
    _class: "com.wheelio.backend.model.Vehicle"
}));

db.vehicles.insertMany(vehicles);

print("Database initialized successfully!");
