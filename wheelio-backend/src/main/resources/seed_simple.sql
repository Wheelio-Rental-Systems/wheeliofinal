-- Simplified seed data for Wheelio Backend
-- This version uses column names that match the JPA entities exactly

-- Insert sample users
INSERT INTO users (id, email, password_hash, full_name, role, phone, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@wheelio.com', 'admin123', 'Admin User', 'ADMIN', '+91-9876543210', NOW()),
('22222222-2222-2222-2222-222222222222', 'staff@wheelio.com', 'staff123', 'Staff Member', 'STAFF', '+91-9876543211', NOW()),
('33333333-3333-3333-3333-333333333333', 'user@wheelio.com', 'user123', 'Test User', 'USER', '+91-9876543212', NOW()),
('44444444-4444-4444-4444-444444444444', 'driver1@wheelio.com', 'driver123', 'Rajesh Kumar', 'DRIVER', '+91-9876543213', NOW()),
('55555555-5555-5555-5555-555555555555', 'driver2@wheelio.com', 'driver123', 'Amit Sharma', 'DRIVER', '+91-9876543214', NOW()),
('66666666-6666-6666-6666-666666666666', 'driver3@wheelio.com', 'driver123', 'Priya Singh', 'DRIVER', '+91-9876543215', NOW());

-- Insert driver profiles for the drivers
INSERT INTO driver_profiles (id, user_id, license_number, rating, status, created_at) VALUES
('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'DL123456', 4.8, 'ACTIVE', NOW()),
('88888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555', 'DL234567', 4.9, 'ACTIVE', NOW()),
('99999999-9999-9999-9999-999999999999', '66666666-6666-6666-6666-666666666666', 'DL345678', 4.7, 'ACTIVE', NOW());

-- Insert vehicles
INSERT INTO vehicles (id, name, brand, type, price_per_day, location, status, image_url, features, description) VALUES
-- Cars
(gen_random_uuid(), 'Maruti Swift', 'Maruti Suzuki', 'HATCHBACK', 1200, 'Mumbai', 'AVAILABLE', '/images/swift.jpeg', '["Dual Airbags", "ABS with EBD", "Touchscreen Infotainment"]', 'The Maruti Swift is India''s favourite hatchback'),
(gen_random_uuid(), 'Hyundai Creta', 'Hyundai', 'SUV', 2500, 'Bangalore', 'AVAILABLE', '/images/creta.jpg', '["Panoramic Sunroof", "Ventilated Seats", "Bose Sound System"]', 'The Ultimate SUV. Premium driving experience.'),
(gen_random_uuid(), 'Mahindra Thar 4x4', 'Mahindra', 'SUV', 3500, 'Coimbatore', 'AVAILABLE', '/images/thar.jpeg', '["4x4 Drivetrain", "Convertible Top", "All-Terrain Tyres"]', 'Legendary off-roader built to tackle any terrain'),
(gen_random_uuid(), 'Tata Nexon EV', 'Tata Motors', 'SUV', 2800, 'Pune', 'AVAILABLE', '/images/tata nexon ev.jpg', '["Regenerative Braking", "Sunroof", "Fast Charging"]', 'Experience the thrill of instant torque'),
(gen_random_uuid(), 'Toyota Innova Crysta', 'Toyota', 'SUV', 3800, 'Chennai', 'AVAILABLE', '/images/toyata crysta.jpg', '["Captain Seats", "Ambient Lighting", "7 Airbags"]', 'Unmatched comfort for family trips'),
(gen_random_uuid(), 'Honda City 5th Gen', 'Honda', 'SEDAN', 2200, 'Delhi', 'AVAILABLE', '/images/honda city 5th gen.jpg', '["Lane Watch Camera", "Sunroof", "Alexa Support"]', 'Sophistication and advanced technology'),
(gen_random_uuid(), 'Mahindra XUV700', 'Mahindra', 'SUV', 3200, 'Hyderabad', 'AVAILABLE', '/images/Mahindra XUV700.jpeg', '["ADAS Level 2", "Dual HD Screens", "Skyroof"]', 'Tech-loaded beast'),
(gen_random_uuid(), 'Kia Seltos', 'Kia', 'SUV', 2400, 'Kolkata', 'AVAILABLE', '/images/Kia Seltos.jpeg', '["Heads-Up Display", "360 Camera", "Air Purifier"]', 'Badass by design'),
(gen_random_uuid(), 'Tata Safari', 'Tata Motors', 'SUV', 3300, 'Mumbai', 'MAINTENANCE', '/images/Tata Safari.webp', '["Panoramic Sunroof", "Captain Seats", "JBL Audio"]', 'Iconic Safari returns'),
(gen_random_uuid(), 'Hyundai Verna', 'Hyundai', 'SEDAN', 2100, 'Pune', 'AVAILABLE', '/images/Hyundai Verna.jpeg', '["ADAS", "Dual 10.25 Screens", "Heated Seats"]', 'Futuristic Ferocity'),
(gen_random_uuid(), 'Maruti Brezza', 'Maruti Suzuki', 'SUV', 1800, 'Jaipur', 'AVAILABLE', '/images/Maruti Brezza.avif', '["Sunroof", "360 Camera", "Smart Hybrid"]', 'City-Bred SUV'),
(gen_random_uuid(), 'Fortuner Legender', 'Toyota', 'SUV', 6500, 'Chandigarh', 'AVAILABLE', '/images/for2.jpeg', '["4x4 Sigma 4", "Dual Zone AC", "11 Speakers"]', 'Power to Lead'),
-- Bikes
(gen_random_uuid(), 'Royal Enfield Himalayan 450', 'Royal Enfield', 'BIKE', 1500, 'Manali', 'AVAILABLE', '/images/himalayan 450.jpg', '["Tripper Navigation", "Switchable ABS", "Liquid Cooled"]', 'Ultimate adventure tourer'),
(gen_random_uuid(), 'Royal Enfield Classic 350', 'Royal Enfield', 'BIKE', 1100, 'Chennai', 'AVAILABLE', '/images/cl1.avif', '["Dual Channel ABS", "Digital-Analog Cluster", "USB Port"]', 'Reborn Classic'),
(gen_random_uuid(), 'KTM Duke 390', 'KTM', 'BIKE', 1800, 'Bangalore', 'AVAILABLE', '/images/duke1.avif', '["Quickshifter+", "TFT Display", "Cornering ABS"]', 'Corner Rocket'),
(gen_random_uuid(), 'Bajaj Dominar 400', 'Bajaj', 'BIKE', 1400, 'Pune', 'AVAILABLE', '/images/dom.jpg', '["Touring Accessories", "USD Forks", "LED Headlamp"]', 'Sports Tourer'),
(gen_random_uuid(), 'Yamaha R15 V4', 'Yamaha', 'BIKE', 1200, 'Kochi', 'AVAILABLE', '/images/r15.jpg', '["Quickshifter", "Traction Control", "VVA Technology"]', 'Racing DNA'),
(gen_random_uuid(), 'TVS Apache RR 310', 'TVS', 'BIKE', 1600, 'Hosur', 'AVAILABLE', '/images/TVS Apache RR 310.jpeg', '["Ride Modes", "TFT Display", "Michelin Tyres"]', 'Flagship racer with BMW engineering'),
(gen_random_uuid(), 'Honda Hness CB350', 'Honda', 'BIKE', 1300, 'Goa', 'AVAILABLE', '/images/Honda Hness CB350.jpeg', '["Smartphone Voice Control", "Traction Control", "Full LED"]', 'Classic style and Japanese reliability'),
(gen_random_uuid(), 'Jawa 42 Bobber', 'Jawa', 'BIKE', 1450, 'Mumbai', 'AVAILABLE', '/images/bob2.avif', '["Floating Seat", "LED Tail Lamp", "USB Charging"]', 'Factory Custom bobber'),
(gen_random_uuid(), 'Hero Xpulse 200 4V', 'Hero', 'BIKE', 1000, 'Rishikesh', 'AVAILABLE', '/images/Hero Xpulse 200 4V.jpg', '["Rally Kit Compatible", "Turn-by-Turn Nav", "ABS"]', 'Best entry-level adventure'),
(gen_random_uuid(), 'Continental GT 650', 'Royal Enfield', 'BIKE', 1900, 'Goa', 'AVAILABLE', '/images/Continental GT 650.webp', '["Twin Cylinder", "Clip-on Bars", "Cafe Racer Styling"]', 'Cafe racer culture'),
-- Scooters
(gen_random_uuid(), 'Ather 450X', 'Ather Energy', 'BIKE', 900, 'Bangalore', 'AVAILABLE', '/images/ather2.avif', '["Google Maps", "Touchscreen", "Warp Mode"]', 'Super Scooter'),
(gen_random_uuid(), 'Ola S1 Pro', 'Ola Electric', 'BIKE', 850, 'Chennai', 'AVAILABLE', '/images/Ola S1 Pro.jpg', '["Hyper Mode", "Cruise Control", "Music Playback"]', 'Most powerful electric scooter');
