package com.wheelio.backend.config;

import com.wheelio.backend.model.User;
import com.wheelio.backend.model.Vehicle;
import com.wheelio.backend.repository.UserRepository;
import com.wheelio.backend.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@Profile("dev")
public class DataSeeder {

        @Bean
        CommandLineRunner initDatabase(UserRepository userRepository, VehicleRepository vehicleRepository,
                        PasswordEncoder passwordEncoder) {
                return args -> {
                        // Seed Admin
                        User admin = userRepository.findByEmail("admin@wheelio.com").orElse(new User());
                        admin.setEmail("admin@wheelio.com");
                        if (admin.getPasswordHash() == null)
                                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                        admin.setFullName("Admin User");
                        admin.setRole(User.Role.ADMIN);
                        admin.setPhone("9999999999");
                        admin.setCity("Headquarters");
                        userRepository.save(admin);

                        // Seed Driver
                        User driver = userRepository.findByEmail("driver@wheelio.com").orElse(new User());
                        driver.setEmail("driver@wheelio.com");
                        if (driver.getPasswordHash() == null)
                                driver.setPasswordHash(passwordEncoder.encode("driver123"));
                        driver.setFullName("Test Driver");
                        driver.setRole(User.Role.DRIVER);
                        driver.setPhone("8888888888");
                        driver.setCity("Chennai");
                        userRepository.save(driver);

                        // Seed Staff
                        User staff = userRepository.findByEmail("staff@wheelio.com").orElse(new User());
                        staff.setEmail("staff@wheelio.com");
                        if (staff.getPasswordHash() == null)
                                staff.setPasswordHash(passwordEncoder.encode("staff123"));
                        staff.setFullName("Staff Member");
                        staff.setRole(User.Role.STAFF);
                        staff.setPhone("7777777777");
                        staff.setCity("Bangalore");
                        userRepository.save(staff);

                        try {
                                // Seed all 24 Vehicles from frontend/src/app/data/vehicles.js
                                seedVehicle(vehicleRepository, "Maruti Swift", "Maruti Suzuki",
                                                Vehicle.VehicleType.HATCHBACK, "1200.00", "Mumbai",
                                                "/images/swift.jpeg", "Perfect for city driving.",
                                                List.of("AC", "Music System", "Airbags"));
                                seedVehicle(vehicleRepository, "Hyundai Creta", "Hyundai", Vehicle.VehicleType.SUV,
                                                "2500.00", "Bangalore", "/images/creta.jpg", "Premium SUV.",
                                                List.of("Sunroof", "Ventilated Seats", "Bose Audio"));
                                seedVehicle(vehicleRepository, "Mahindra Thar 4x4", "Mahindra", Vehicle.VehicleType.SUV,
                                                "3500.00", "Coimbatore", "/images/thar.jpeg", "Explore the impossible.",
                                                List.of("4x4 Drivetrain", "Convertible Top"));
                                seedVehicle(vehicleRepository, "Tata Nexon EV", "Tata Motors", Vehicle.VehicleType.SUV,
                                                "2800.00", "Pune", "/images/tata nexon ev.jpg",
                                                "Go Green with Tata Nexon EV.",
                                                List.of("Regenerative Braking", "Sunroof"));
                                seedVehicle(vehicleRepository, "Toyota Innova Crysta", "Toyota",
                                                Vehicle.VehicleType.MPV, "3800.00", "Chennai", "/images/pos.jpg",
                                                "Unmatched Comfort.", List.of("Captain Seats", "Ambient Lighting"));
                                seedVehicle(vehicleRepository, "Honda City 5th Gen", "Honda", Vehicle.VehicleType.SEDAN,
                                                "2200.00", "Delhi", "/images/honda city 5th gen.jpg",
                                                "Sophistication and comfort.",
                                                List.of("Lane Watch", "Sunroof", "Alexa"));
                                seedVehicle(vehicleRepository, "Mahindra XUV700", "Mahindra", Vehicle.VehicleType.SUV,
                                                "3200.00", "Hyderabad", "/images/Mahindra XUV700.jpeg",
                                                "Experience the rush.", List.of("ADAS Level 2", "Dual HD Screens"));
                                seedVehicle(vehicleRepository, "Kia Seltos", "Kia", Vehicle.VehicleType.SUV, "2400.00",
                                                "Kolkata", "/images/Kia Seltos.jpeg", "Badass by design.",
                                                List.of("Heads-Up Display", "360 Camera"));
                                seedVehicle(vehicleRepository, "Tata Safari", "Tata Motors", Vehicle.VehicleType.SUV,
                                                "3300.00", "Mumbai", "/images/Tata Safari.webp", "Reclaim your life.",
                                                List.of("Panoramic Sunroof", "Captain Seats"));
                                seedVehicle(vehicleRepository, "Hyundai Verna", "Hyundai", Vehicle.VehicleType.SEDAN,
                                                "2100.00", "Pune", "/images/Hyundai Verna.jpeg", "Futuristic Ferocity.",
                                                List.of("ADAS", "Dual 10.25\" Screens"));
                                seedVehicle(vehicleRepository, "Maruti Brezza", "Maruti Suzuki",
                                                Vehicle.VehicleType.SUV, "1800.00", "Jaipur",
                                                "/images/Maruti Brezza.avif", "The City-Bred SUV.",
                                                List.of("Sunroof", "360 Camera"));
                                seedVehicle(vehicleRepository, "Fortuner Legender", "Toyota", Vehicle.VehicleType.SUV,
                                                "6500.00", "Chandigarh", "/images/for2.jpeg", "Power to Lead.",
                                                List.of("4x4 Sigma 4", "Kick Sensor Boot"));
                                seedVehicle(vehicleRepository, "Royal Enfield Himalayan 450", "Royal Enfield",
                                                Vehicle.VehicleType.BIKE, "1500.00", "Manali",
                                                "/images/himalayan 450.jpg", "Built for all roads.",
                                                List.of("Tripper Navigation", "Switchable ABS"));
                                seedVehicle(vehicleRepository, "Royal Enfield Classic 350", "Royal Enfield",
                                                Vehicle.VehicleType.BIKE, "1100.00", "Chennai", "/images/cl1.avif",
                                                "The Reborn Classic.",
                                                List.of("Dual Channel ABS", "Digital-Analog Cluster"));
                                seedVehicle(vehicleRepository, "KTM Duke 390", "KTM", Vehicle.VehicleType.BIKE,
                                                "1800.00", "Bangalore", "/images/duke1.avif", "The Corner Rocket.",
                                                List.of("Quickshifter+", "TFT Display"));
                                seedVehicle(vehicleRepository, "Bajaj Dominar 400", "Bajaj", Vehicle.VehicleType.BIKE,
                                                "1400.00", "Pune", "/images/dom.jpg", "The Sports Tourer.",
                                                List.of("Touring Accessories", "USD Forks"));
                                seedVehicle(vehicleRepository, "Yamaha R15 V4", "Yamaha", Vehicle.VehicleType.BIKE,
                                                "1200.00", "Kochi", "/images/r15.jpg", "Racing DNA.",
                                                List.of("Quickshifter", "Traction Control"));
                                seedVehicle(vehicleRepository, "TVS Apache RR 310", "TVS", Vehicle.VehicleType.BIKE,
                                                "1600.00", "Hosur", "/images/TVS Apache RR 310.jpeg",
                                                "Crafted to outperform.", List.of("Ride Modes", "TFT Display"));
                                seedVehicle(vehicleRepository, "Honda Hness CB350", "Honda", Vehicle.VehicleType.BIKE,
                                                "1300.00", "Goa", "/images/Honda Hness CB350.jpeg",
                                                "Your Highness has arrived.",
                                                List.of("Honda Smartphone Voice Control", "Traction Control"));
                                seedVehicle(vehicleRepository, "Jawa 42 Bobber", "Jawa", Vehicle.VehicleType.BIKE,
                                                "1450.00", "Mumbai", "/images/bob2.avif", "Factory Custom.",
                                                List.of("Floating Seat", "LED Tail Lamp"));
                                seedVehicle(vehicleRepository, "Hero Xpulse 200 4V", "Hero", Vehicle.VehicleType.BIKE,
                                                "1000.00", "Rishikesh", "/images/Hero Xpulse 200 4V.jpg",
                                                "Make New Tracks.",
                                                List.of("Rally Kit Compatible", "Turn-by-Turn Nav"));
                                seedVehicle(vehicleRepository, "Ather 450X", "Ather Energy",
                                                Vehicle.VehicleType.SCOOTER, "900.00", "Bangalore",
                                                "/images/ather2.avif", "The Super Scooter.",
                                                List.of("Google Maps", "Touchscreen"));
                                seedVehicle(vehicleRepository, "Ola S1 Pro", "Ola Electric",
                                                Vehicle.VehicleType.SCOOTER, "850.00", "Chennai",
                                                "/images/Ola S1 Pro.jpg", "#EndICEAge.",
                                                List.of("Hyper Mode", "Cruise Control"));
                                seedVehicle(vehicleRepository, "Continental GT 650", "Royal Enfield",
                                                Vehicle.VehicleType.BIKE, "1900.00", "Goa",
                                                "/images/Continental GT 650.webp", "Ton of Fun.",
                                                List.of("Twin Cylinder", "Clip-on Bars"));

                        } catch (Exception e) {
                                System.err.println("ERROR: Vehicle seeding failed.");
                                e.printStackTrace();
                        }
                };
        }

        private void seedVehicle(VehicleRepository repository, String name, String brand, Vehicle.VehicleType type,
                        String price, String location, String imageUrl, String description, List<String> features) {
                if (repository.findByName(name).isEmpty()) {
                        Vehicle v = new Vehicle();
                        v.setName(name);
                        v.setBrand(brand);
                        v.setType(type);
                        v.setPricePerDay(new BigDecimal(price));
                        v.setLocation(location);
                        v.setImageUrl(imageUrl);
                        v.setDescription(description);
                        v.setFeatures(features);
                        v.setStatus(Vehicle.Status.AVAILABLE);
                        repository.save(v);
                }
        }
}
