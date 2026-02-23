package com.wheelio.backend.config;

import com.wheelio.backend.model.DriverProfile;
import com.wheelio.backend.model.User;
import com.wheelio.backend.model.Vehicle;
import com.wheelio.backend.repository.DriverProfileRepository;
import com.wheelio.backend.repository.UserRepository;
import com.wheelio.backend.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

        private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

        @Autowired
        private UserRepository userRepository;
        @Autowired
        private VehicleRepository vehicleRepository;
        @Autowired
        private DriverProfileRepository driverProfileRepository;
        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                seedAdmin();
                seedTestUser();
                seedVehicles();
                seedDrivers();
        }

        private void seedTestUser() {
                if (userRepository.existsByEmail("user@wheelio.com")) {
                        logger.info("Test user already exists, skipping.");
                        return;
                }
                User user = new User();
                user.setId("6997c2094452e44f57b18001");
                user.setEmail("user@wheelio.com");
                user.setPasswordHash(passwordEncoder.encode("User@123"));
                user.setFullName("Test User");
                user.setRole(User.Role.USER);
                user.setPhone("9876543210");
                user.setCity("Mumbai");
                userRepository.save(user);
                logger.info("Test user seeded: user@wheelio.com / User@123");
        }

        private void seedAdmin() {
                if (userRepository.existsByEmail("admin@wheelio.com")) {
                        logger.info("Admin already exists, skipping.");
                        return;
                }
                User admin = new User();
                admin.setId("6997c2094452e44f57b18000"); // Fixed ID for synchronization
                admin.setEmail("admin@wheelio.com");
                admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
                admin.setFullName("Wheelio Admin");
                admin.setRole(User.Role.ADMIN);
                admin.setPhone("9000000000");
                admin.setCity("Chennai");
                userRepository.save(admin);
                logger.info("Admin seeded: admin@wheelio.com / Admin@123");
        }

        private void seedVehicles() {
                if (vehicleRepository.count() > 0) {
                        logger.info("Vehicles already seeded, skipping.");
                        return;
                }

                List<Vehicle> vehicles = Arrays.asList(
                                makeVehicle("507f1f77bcf86cd799439001", "Maruti Swift", "Maruti Suzuki",
                                                Vehicle.VehicleType.HATCHBACK,
                                                new BigDecimal("1200"), "Mumbai", Vehicle.Status.AVAILABLE,
                                                "/images/swift.jpeg",
                                                Arrays.asList("Dual Airbags", "ABS with EBD",
                                                                "Touchscreen Infotainment",
                                                                "Steering Mounted Controls", "Rear Parking Sensors"),
                                                "The Maruti Swift is India's favourite hatchback, known for its sporty design and peppy performance.",
                                                5, "Petrol", "Manual", 4.5, 328),
                                makeVehicle("507f1f77bcf86cd799439002", "Hyundai Creta", "Hyundai",
                                                Vehicle.VehicleType.SUV,
                                                new BigDecimal("2500"), "Bangalore", Vehicle.Status.AVAILABLE,
                                                "/images/creta.jpg",
                                                Arrays.asList("Panoramic Sunroof", "Ventilated Seats",
                                                                "Bose Sound System", "6 Airbags", "Wireless Charging"),
                                                "The Ultimate SUV. The Hyundai Creta offers a premium driving experience.",
                                                5, "Diesel", "Automatic", 4.7, 412),
                                makeVehicle("507f1f77bcf86cd799439003", "Mahindra Thar 4x4", "Mahindra",
                                                Vehicle.VehicleType.SUV,
                                                new BigDecimal("3500"), "Coimbatore", Vehicle.Status.AVAILABLE,
                                                "/images/thar.jpeg",
                                                Arrays.asList("4x4 Drivetrain", "Convertible Top",
                                                                "Touchscreen Display", "All-Terrain Tyres",
                                                                "Roll Caption"),
                                                "Explore the impossible. The Mahindra Thar is a legendary off-roader.",
                                                4, "Diesel", "Manual", 4.8, 560),
                                makeVehicle("507f1f77bcf86cd799439004", "Tata Nexon EV", "Tata Motors",
                                                Vehicle.VehicleType.SUV,
                                                new BigDecimal("2800"), "Pune", Vehicle.Status.AVAILABLE,
                                                "/images/tata nexon ev.jpg",
                                                Arrays.asList("Regenerative Braking", "Sunroof", "Connected Car Tech",
                                                                "Fast Charging", "Air Purifier"),
                                                "Go Green with the Tata Nexon EV. Experience the thrill of instant torque.",
                                                5, "Electric", "Automatic", 4.6, 215),
                                makeVehicle("507f1f77bcf86cd799439005", "Toyota Innova Crysta", "Toyota",
                                                Vehicle.VehicleType.MPV,
                                                new BigDecimal("3800"), "Chennai", Vehicle.Status.AVAILABLE,
                                                "/images/toyata crysta.jpg",
                                                Arrays.asList("Captain Seats", "Ambient Lighting", "7 Airbags",
                                                                "Cruise Control", "Foldable Tables"),
                                                "Unmatched Comfort. The Innova Crysta is perfect for long family trips.",
                                                7, "Diesel", "Automatic", 4.9, 890),
                                makeVehicle("507f1f77bcf86cd799439006", "Honda City 5th Gen", "Honda",
                                                Vehicle.VehicleType.SEDAN,
                                                new BigDecimal("2200"), "Delhi", Vehicle.Status.AVAILABLE,
                                                "/images/honda city 5th gen.jpg",
                                                Arrays.asList("Lane Watch Camera", "Sunroof", "Alexa Support",
                                                                "8-Speaker Audio", "Leather Upholstery"),
                                                "A class apart. The Honda City offers sophistication and comfort.",
                                                5, "Petrol", "CVT", 4.6, 180),
                                makeVehicle("507f1f77bcf86cd799439007", "Mahindra XUV700", "Mahindra",
                                                Vehicle.VehicleType.SUV,
                                                new BigDecimal("3200"), "Hyderabad", Vehicle.Status.AVAILABLE,
                                                "/images/Mahindra XUV700.jpeg",
                                                Arrays.asList("ADAS Level 2", "Dual HD Screens", "Skyroof",
                                                                "Sony 3D Audio", "Smart Door Handles"),
                                                "Experience the rush. The XUV700 is a tech-loaded beast.",
                                                7, "Diesel", "Automatic", 4.8, 350),
                                makeVehicle("507f1f77bcf86cd799439008", "Kia Seltos", "Kia", Vehicle.VehicleType.SUV,
                                                new BigDecimal("2400"),
                                                "Kolkata", Vehicle.Status.AVAILABLE, "/images/Kia Seltos.jpeg",
                                                Arrays.asList("Heads-Up Display", "360 Camera", "Air Purifier",
                                                                "Mood Lighting", "Ventilated Seats"),
                                                "Badass by design. The Kia Seltos combines aggressive styling.",
                                                5, "Petrol", "DCT", 4.5, 290),
                                makeVehicle("507f1f77bcf86cd799439009", "Tata Safari", "Tata Motors",
                                                Vehicle.VehicleType.SUV,
                                                new BigDecimal("3300"), "Mumbai", Vehicle.Status.MAINTENANCE,
                                                "/images/Tata Safari.webp",
                                                Arrays.asList("Panoramic Sunroof", "Captain Seats", "JBL Audio",
                                                                "Terrain Response", "Connected Tech"),
                                                "Reclaim your life. The iconic Tata Safari returns with modern luxury.",
                                                7, "Diesel", "Automatic", 4.7, 200),
                                makeVehicle("507f1f77bcf86cd799439010", "Hyundai Verna", "Hyundai",
                                                Vehicle.VehicleType.SEDAN,
                                                new BigDecimal("2100"), "Pune", Vehicle.Status.AVAILABLE,
                                                "/images/Hyundai Verna.jpeg",
                                                Arrays.asList("ADAS", "Dual 10.25\" Screens", "Heated Seats",
                                                                "Bose Audio", "Parametric Design"),
                                                "Futuristic Ferocity. The all-new Verna brings thrilling performance.",
                                                5, "Petrol", "Turbo DCT", 4.4, 150),
                                makeVehicle("507f1f77bcf86cd799439011", "Maruti Brezza", "Maruti Suzuki",
                                                Vehicle.VehicleType.SUV,
                                                new BigDecimal("1800"), "Jaipur", Vehicle.Status.AVAILABLE,
                                                "/images/Maruti Brezza.avif",
                                                Arrays.asList("Sunroof", "360 Camera", "Clean Tech",
                                                                "Heads Up Display", "Smart Hybrid"),
                                                "The City-Bred SUV. Compact, efficient, and packed with tech.",
                                                5, "Petrol", "Automatic", 4.3, 400),
                                makeVehicle("507f1f77bcf86cd799439012", "Fortuner Legender", "Toyota",
                                                Vehicle.VehicleType.SUV,
                                                new BigDecimal("6500"), "Chandigarh", Vehicle.Status.AVAILABLE,
                                                "/images/for2.jpeg",
                                                Arrays.asList("4x4 Sigma 4", "Kick Sensor Boot", "Dual Zone AC",
                                                                "Wireless Charger", "11 Speakers"),
                                                "Power to Lead. The Fortuner Legender commands respect.",
                                                7, "Diesel", "Automatic", 4.9, 600),
                                makeVehicle("507f1f77bcf86cd799439013", "Royal Enfield Himalayan 450", "Royal Enfield",
                                                Vehicle.VehicleType.BIKE, new BigDecimal("1500"), "Manali",
                                                Vehicle.Status.AVAILABLE, "/images/himalayan 450.jpg",
                                                Arrays.asList("Tripper Navigation", "Switchable ABS", "Liquid Cooled",
                                                                "Ride-by-Wire", "USD Forks"),
                                                "Built for all roads, built for no roads. Adventure tourer.",
                                                2, "Petrol", "Manual", 4.8, 420),
                                makeVehicle("507f1f77bcf86cd799439014", "Royal Enfield Classic 350", "Royal Enfield",
                                                Vehicle.VehicleType.BIKE, new BigDecimal("1100"), "Chennai",
                                                Vehicle.Status.AVAILABLE, "/images/cl1.avif",
                                                Arrays.asList("Dual Channel ABS", "Digital-Analog Cluster", "USB Port",
                                                                "Timeless Design", "Thump Exhaust"),
                                                "The Reborn Classic. Experience the pure motorcycling spirit.",
                                                2, "Petrol", "Manual", 4.7, 950),
                                makeVehicle("507f1f77bcf86cd799439015", "KTM Duke 390", "KTM", Vehicle.VehicleType.BIKE,
                                                new BigDecimal("1800"), "Bangalore", Vehicle.Status.AVAILABLE,
                                                "/images/duke1.avif",
                                                Arrays.asList("Quickshifter+", "TFT Display", "Cornering ABS",
                                                                "Launch Control", "Supermoto Mode"),
                                                "The Corner Rocket. Pure adrenaline on two wheels.",
                                                2, "Petrol", "Manual", 4.6, 310),
                                makeVehicle("507f1f77bcf86cd799439016", "Bajaj Dominar 400", "Bajaj",
                                                Vehicle.VehicleType.BIKE,
                                                new BigDecimal("1400"), "Pune", Vehicle.Status.AVAILABLE,
                                                "/images/dom.jpg",
                                                Arrays.asList("Touring Accessories", "USD Forks",
                                                                "Diamond Cut Wheels", "LED Headlamp",
                                                                "Slipper Clutch"),
                                                "The Sports Tourer. Built for long-distance dominance.",
                                                2, "Petrol", "Manual", 4.4, 250),
                                makeVehicle("507f1f77bcf86cd799439017", "Yamaha R15 V4", "Yamaha",
                                                Vehicle.VehicleType.BIKE,
                                                new BigDecimal("1200"), "Kochi", Vehicle.Status.AVAILABLE,
                                                "/images/r15.jpg",
                                                Arrays.asList("Quickshifter", "Traction Control", "VVA Technology",
                                                                "Upside Down Forks", "Track Mode"),
                                                "Racing DNA. The most advanced 155cc motorcycle in India.",
                                                2, "Petrol", "Manual", 4.8, 500),
                                makeVehicle("507f1f77bcf86cd799439018", "TVS Apache RR 310", "TVS",
                                                Vehicle.VehicleType.BIKE,
                                                new BigDecimal("1600"), "Hosur", Vehicle.Status.AVAILABLE,
                                                "/images/TVS Apache RR 310.jpeg",
                                                Arrays.asList("Ride Modes", "TFT Display", "Michelin Tyres", "BTO Kit",
                                                                "SmartXonnect"),
                                                "Crafted to outperform. A flagship racer from TVS.",
                                                2, "Petrol", "Manual", 4.7, 180),
                                makeVehicle("507f1f77bcf86cd799439019", "Honda Hness CB350", "Honda",
                                                Vehicle.VehicleType.BIKE,
                                                new BigDecimal("1300"), "Goa", Vehicle.Status.AVAILABLE,
                                                "/images/Honda Hness CB350.jpeg",
                                                Arrays.asList("Honda Smartphone Voice Control", "Traction Control",
                                                                "Assist Slipper Clutch", "Full LED", "Chrome Finish"),
                                                "Your Highness has arrived. Classic style and reliability.",
                                                2, "Petrol", "Manual", 4.6, 210),
                                makeVehicle("507f1f77bcf86cd799439020", "Jawa 42 Bobber", "Jawa",
                                                Vehicle.VehicleType.BIKE,
                                                new BigDecimal("1450"), "Mumbai", Vehicle.Status.AVAILABLE,
                                                "/images/bob2.avif",
                                                Arrays.asList("Floating Seat", "LED Tail Lamp", "USB Charging",
                                                                "Moonstone White", "Bar End Mirrors"),
                                                "Factory Custom. Make a statement with the most stylish bobber.",
                                                1, "Petrol", "Manual", 4.5, 150),
                                makeVehicle("507f1f77bcf86cd799439021", "Hero Xpulse 200 4V", "Hero",
                                                Vehicle.VehicleType.BIKE,
                                                new BigDecimal("1000"), "Rishikesh", Vehicle.Status.AVAILABLE,
                                                "/images/Hero Xpulse 200 4V.jpg",
                                                Arrays.asList("Rally Kit Compatible", "Turn-by-Turn Nav",
                                                                "Long Travel Suspension", "ABS", "LED Headlight"),
                                                "Make New Tracks. India's best entry-level adventure motorcycle.",
                                                2, "Petrol", "Manual", 4.4, 300),
                                makeVehicle("507f1f77bcf86cd799439022", "Ather 450X", "Ather Energy",
                                                Vehicle.VehicleType.SCOOTER,
                                                new BigDecimal("900"), "Bangalore", Vehicle.Status.AVAILABLE,
                                                "/images/ather2.avif",
                                                Arrays.asList("Google Maps", "Touchscreen", "Reverse Mode", "AutoHold",
                                                                "Warp Mode"),
                                                "The Super Scooter. Intelligence and rapid acceleration.",
                                                2, "Electric", "Automatic", 4.8, 350),
                                makeVehicle("507f1f77bcf86cd799439023", "Ola S1 Pro", "Ola Electric",
                                                Vehicle.VehicleType.SCOOTER,
                                                new BigDecimal("850"), "Chennai", Vehicle.Status.AVAILABLE,
                                                "/images/Ola S1 Pro.jpg",
                                                Arrays.asList("Hyper Mode", "Cruise Control", "Music Playback",
                                                                "Digital Key", "Voice Control"),
                                                "#EndICEAge. The most powerful electric scooter.",
                                                2, "Electric", "Automatic", 4.3, 500),
                                makeVehicle("507f1f77bcf86cd799439024", "Continental GT 650", "Royal Enfield",
                                                Vehicle.VehicleType.BIKE,
                                                new BigDecimal("1900"), "Goa", Vehicle.Status.AVAILABLE,
                                                "/images/Continental GT 650.webp",
                                                Arrays.asList("Twin Cylinder", "Clip-on Bars", "Cafe Racer Styling",
                                                                "Dual ABS", "Slipper Clutch"),
                                                "Ton of Fun. Relive the cafe racer culture.",
                                                2, "Petrol", "Manual", 4.9, 280));

                vehicleRepository.saveAll(vehicles);
                logger.info("Seeded {} vehicles.", vehicles.size());
        }

        private void seedDrivers() {
                if (driverProfileRepository.count() > 0) {
                        logger.info("Drivers already seeded, skipping.");
                        return;
                }
                // All 20 drivers matching drivers.js — email: firstname.lastname@wheelio.com,
                // password: Driver@123
                seedDriver("6997c2094452e44f57b180dd", "rajesh.kumar@wheelio.com", "Rajesh Kumar", "9876540001",
                                "Mumbai", "MH01D10001");
                seedDriver("6997c2094452e44f57b180df", "suresh.patel@wheelio.com", "Suresh Patel", "9876540002",
                                "Delhi", "DL01D10002");
                seedDriver("6997c2094452e44f57b180e1", "amit.singh@wheelio.com", "Amit Singh", "9876540003",
                                "Bangalore", "KA01D10003");
                seedDriver("6997c2094452e44f57b180e3", "vikram.reddy@wheelio.com", "Vikram Reddy", "9876540004",
                                "Hyderabad", "TS09D10004");
                seedDriver("6997c2094452e44f57b180e5", "karthik.subramanian@wheelio.com", "Karthik Subramanian",
                                "9876540005", "Chennai", "TN09D10005");
                seedDriver("6997c20a4452e44f57b180e7", "arjun.das@wheelio.com", "Arjun Das", "9876540006", "Kolkata",
                                "WB01D10006");
                seedDriver("6997c20a4452e44f57b180e9", "rahul.sharma@wheelio.com", "Rahul Sharma", "9876540007", "Pune",
                                "MH12D10007");
                seedDriver("6997c20a4452e44f57b180eb", "manish.gupta@wheelio.com", "Manish Gupta", "9876540008",
                                "Ahmedabad", "GJ01D10008");
                seedDriver("6997c20a4452e44f57b180ed", "vijay.verma@wheelio.com", "Vijay Verma", "9876540009", "Jaipur",
                                "RJ14D10009");
                seedDriver("6997c20a4452e44f57b180ef", "deepak.mehta@wheelio.com", "Deepak Mehta", "9876540010",
                                "Surat", "GJ05D10010");
                seedDriver("6997c20a4452e44f57b180f1", "sanjay.menon@wheelio.com", "Sanjay Menon", "9876540011",
                                "Coimbatore", "TN37D10011");
                seedDriver("6997c20a4452e44f57b180f3", "rohan.kapoor@wheelio.com", "Rohan Kapoor", "9876540012",
                                "Lucknow", "UP32D10012");
                seedDriver("6997c20a4452e44f57b180f5", "anil.tiwari@wheelio.com", "Anil Tiwari", "9876540013", "Kanpur",
                                "UP78D10013");
                seedDriver("6997c20a4452e44f57b180f7", "prakash.joshi@wheelio.com", "Prakash Joshi", "9876540014",
                                "Nagpur", "MH31D10014");
                seedDriver("6997c20a4452e44f57b180f9", "mohit.agarwal@wheelio.com", "Mohit Agarwal", "9876540015",
                                "Indore", "MP09D10015");
                seedDriver("6997c20a4452e44f57b180fb", "ganesh.patil@wheelio.com", "Ganesh Patil", "9876540016",
                                "Thane", "MH04D10016");
                seedDriver("6997c20a4452e44f57b180fd", "vikas.yadav@wheelio.com", "Vikas Yadav", "9876540017", "Bhopal",
                                "MP04D10017");
                seedDriver("6997c20b4452e44f57b180ff", "naveen.raju@wheelio.com", "Naveen Raju", "9876540018",
                                "Visakhapatnam", "AP11D10018");
                seedDriver("6997c20b4452e44f57b18101", "sachin.deshmukh@wheelio.com", "Sachin Deshmukh", "9876540019",
                                "Pimpri-Chinchwad", "MH14D10019");
                seedDriver("6997c20b4452e44f57b18103", "rakesh.jha@wheelio.com", "Rakesh Jha", "9876540020", "Patna",
                                "BR01D10020");
                logger.info("Seeded 20 drivers matching drivers.js.");
        }

        private void seedDriver(String id, String email, String fullName, String phone, String city,
                        String licenseNumber) {
                User user;
                if (userRepository.existsByEmail(email)) {
                        user = userRepository.findByEmail(email).orElseThrow();
                } else {
                        user = new User();
                        user.setId(id);
                        user.setEmail(email);
                        user.setPasswordHash(passwordEncoder.encode("Driver@123"));
                        user.setFullName(fullName);
                        user.setRole(User.Role.DRIVER);
                        user.setPhone(phone);
                        user.setCity(city);
                        user = userRepository.save(user);
                }
                if (!driverProfileRepository.existsByUserId(user.getId())) {
                        DriverProfile profile = new DriverProfile();
                        profile.setUserId(user.getId());
                        profile.setFullName(fullName);
                        profile.setEmail(email);
                        profile.setPhone(phone);
                        profile.setCity(city);
                        profile.setLicenseNumber(licenseNumber);
                        profile.setStatus("ACTIVE");
                        driverProfileRepository.save(profile);
                }
        }

        private Vehicle makeVehicle(String id, String name, String brand, Vehicle.VehicleType type,
                        BigDecimal price, String location, Vehicle.Status status,
                        String imageUrl, List<String> features, String description,
                        Integer seats, String fuelType, String transmission, Double rating, Integer reviews) {
                Vehicle v = new Vehicle();
                v.setId(id);
                v.setName(name);
                v.setBrand(brand);
                v.setType(type);
                v.setPricePerDay(price);
                v.setLocation(location);
                v.setStatus(status);
                v.setImageUrl(imageUrl);
                v.setFeatures(features);
                v.setDescription(description);
                v.setSeats(seats);
                v.setFuelType(fuelType);
                v.setTransmission(transmission);
                v.setRating(rating);
                v.setReviews(reviews);
                return v;
        }
}
