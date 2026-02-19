-- Seed data for Wheelio Backend
-- Run this after the schema.sql has been executed

-- Insert sample users (password is same as role name for testing)
INSERT INTO users (id, email, password_hash, full_name, role, phone) VALUES
(gen_random_uuid(), 'admin@wheelio.com', 'admin123', 'Admin User', 'ADMIN', '+91-9876543210'),
(gen_random_uuid(), 'staff@wheelio.com', 'staff123', 'Staff Member', 'STAFF', '+91-9876543211'),
(gen_random_uuid(), 'user@wheelio.com', 'user123', 'Test User', 'USER', '+91-9876543212'),
(gen_random_uuid(), 'driver1@wheelio.com', 'driver123', 'Rajesh Kumar', 'DRIVER', '+91-9876543213'),
(gen_random_uuid(), 'driver2@wheelio.com', 'driver123', 'Amit Sharma', 'DRIVER', '+91-9876543214'),
(gen_random_uuid(), 'driver3@wheelio.com', 'driver123', 'Priya Singh', 'DRIVER', '+91-9876543215');

-- Insert driver profiles for the drivers
INSERT INTO driver_profiles (user_id, license_number, rating, status) 
SELECT id, 'DL' || FLOOR(RANDOM() * 1000000), 4.50 + (RANDOM() * 0.49), 'ACTIVE'
FROM users WHERE role = 'DRIVER';

-- Insert all 24 vehicles from frontend
INSERT INTO vehicles (id, name, brand, type, price_per_day, location, status, image_url, features, description) VALUES
-- Cars
(gen_random_uuid(), 'Maruti Swift', 'Maruti Suzuki', 'HATCHBACK', 1200, 'Mumbai', 'AVAILABLE', '/images/swift.jpeg', '["Dual Airbags", "ABS with EBD", "Touchscreen Infotainment", "Steering Mounted Controls", "Rear Parking Sensors"]'::jsonb, 'The Maruti Swift is India''s favourite hatchback, known for its sporty design and peppy performance.'),
(gen_random_uuid(), 'Hyundai Creta', 'Hyundai', 'SUV', 2500, 'Bangalore', 'AVAILABLE', '/images/creta.jpg', '["Panoramic Sunroof", "Ventilated Seats", "Bose Sound System", "6 Airbags", "Wireless Charging"]'::jsonb, 'The Ultimate SUV. The Hyundai Creta offers a premium driving experience with feature-loaded interiors.'),
(gen_random_uuid(), 'Mahindra Thar 4x4', 'Mahindra', 'SUV', 3500, 'Coimbatore', 'AVAILABLE', '/images/thar.jpeg', '["4x4 Drivetrain", "Convertible Top", "Touchscreen Display", "All-Terrain Tyres", "Roll Caption"]'::jsonb, 'The Mahindra Thar is a legendary off-roader built to tackle any terrain with ease and style.'),
(gen_random_uuid(), 'Tata Nexon EV', 'Tata Motors', 'SUV', 2800, 'Pune', 'AVAILABLE', '/images/tata nexon ev.jpg', '["Regenerative Braking", "Sunroof", "Connected Car Tech", "Fast Charging", "Air Purifier"]'::jsonb, 'Go Green with the Tata Nexon EV. Experience the thrill of instant torque and a silent drive.'),
(gen_random_uuid(), 'Toyota Innova Crysta', 'Toyota', 'SUV', 3800, 'Chennai', 'AVAILABLE', '/images/toyata crysta.jpg', '["Captain Seats", "Ambient Lighting", "7 Airbags", "Cruise Control", "Foldable Tables"]'::jsonb, 'Unmatched Comfort. The Innova Crysta is perfect for long family trips.'),
(gen_random_uuid(), 'Honda City 5th Gen', 'Honda', 'SEDAN', 2200, 'Delhi', 'AVAILABLE', '/images/honda city 5th gen.jpg', '["Lane Watch Camera", "Sunroof", "Alexa Support", "8-Speaker Audio", "Leather Upholstery"]'::jsonb, 'A class apart. The Honda City offers sophistication and advanced technology.'),
(gen_random_uuid(), 'Mahindra XUV700', 'Mahindra', 'SUV', 3200, 'Hyderabad', 'AVAILABLE', '/images/Mahindra XUV700.jpeg', '["ADAS Level 2", "Dual HD Screens", "Skyroof", "Sony 3D Audio", "Smart Door Handles"]'::jsonb, 'Experience the rush. The XUV700 is a tech-loaded beast.'),
(gen_random_uuid(), 'Kia Seltos', 'Kia', 'SUV', 2400, 'Kolkata', 'AVAILABLE', '/images/Kia Seltos.jpeg', '["Heads-Up Display", "360 Camera", "Air Purifier", "Mood Lighting", "Ventilated Seats"]'::jsonb, 'Badass by design. The Kia Seltos combines aggressive styling with premium features.'),
(gen_random_uuid(), 'Tata Safari', 'Tata Motors', 'SUV', 3300, 'Mumbai', 'MAINTENANCE', '/images/Tata Safari.webp', '["Panoramic Sunroof", "Captain Seats", "JBL Audio", "Terrain Response", "Connected Tech"]'::jsonb, 'Reclaim your life. The iconic Tata Safari returns with modern luxury.'),
(gen_random_uuid(), 'Hyundai Verna', 'Hyundai', 'SEDAN', 2100, 'Pune', 'AVAILABLE', '/images/Hyundai Verna.jpeg', '["ADAS", "Dual 10.25 Screens", "Heated Seats", "Bose Audio", "Parametric Design"]'::jsonb, 'Futuristic Ferocity. The all-new Verna brings thrilling turbo performance.'),
(gen_random_uuid(), 'Maruti Brezza', 'Maruti Suzuki', 'SUV', 1800, 'Jaipur', 'AVAILABLE', '/images/Maruti Brezza.avif', '["Sunroof", "360 Camera", "Clean Tech", "Heads Up Display", "Smart Hybrid"]'::jsonb, 'The City-Bred SUV. Compact, efficient, and packed with tech.'),
(gen_random_uuid(), 'Fortuner Legender', 'Toyota', 'SUV', 6500, 'Chandigarh', 'AVAILABLE', '/images/for2.jpeg', '["4x4 Sigma 4", "Kick Sensor Boot", "Dual Zone AC", "Wireless Charger", "11 Speakers"]'::jsonb, 'Power to Lead. The Fortuner Legender commands respect.'),

-- Bikes
(gen_random_uuid(), 'Royal Enfield Himalayan 450', 'Royal Enfield', 'BIKE', 1500, 'Manali', 'AVAILABLE', '/images/himalayan 450.jpg', '["Tripper Navigation", "Switchable ABS", "Liquid Cooled", "Ride-by-Wire", "USD Forks"]'::jsonb, 'Built for all roads, built for no roads. The ultimate adventure tourer.'),
(gen_random_uuid(), 'Royal Enfield Classic 350', 'Royal Enfield', 'BIKE', 1100, 'Chennai', 'AVAILABLE', '/images/cl1.avif', '["Dual Channel ABS", "Digital-Analog Cluster", "USB Port", "Timeless Design", "Thump Exhaust"]'::jsonb, 'The Reborn Classic. Experience the pure motorcycling spirit.'),
(gen_random_uuid(), 'KTM Duke 390', 'KTM', 'BIKE', 1800, 'Bangalore', 'AVAILABLE', '/images/duke1.avif', '["Quickshifter+", "TFT Display", "Cornering ABS", "Launch Control", "Supermoto Mode"]'::jsonb, 'The Corner Rocket. Pure adrenaline on two wheels.'),
(gen_random_uuid(), 'Bajaj Dominar 400', 'Bajaj', 'BIKE', 1400, 'Pune', 'AVAILABLE', '/images/dom.jpg', '["Touring Accessories", "USD Forks", "Diamond Cut Wheels", "LED Headlamp", "Slipper Clutch"]'::jsonb, 'The Sports Tourer. Built for long-distance dominance.'),
(gen_random_uuid(), 'Yamaha R15 V4', 'Yamaha', 'BIKE', 1200, 'Kochi', 'AVAILABLE', '/images/r15.jpg', '["Quickshifter", "Traction Control", "VVA Technology", "Upside Down Forks", "Track Mode"]'::jsonb, 'Racing DNA. The most advanced 155cc motorcycle in India.'),
(gen_random_uuid(), 'TVS Apache RR 310', 'TVS', 'BIKE', 1600, 'Hosur', 'AVAILABLE', '/images/TVS Apache RR 310.jpeg', '["Ride Modes", "TFT Display", "Michelin Tyres", "BTO Kit", "SmartXonnect"]'::jsonb, 'Crafted to outperform. A flagship racer with BMW engineering.'),
(gen_random_uuid(), 'Honda Hness CB350', 'Honda', 'BIKE', 1300, 'Goa', 'AVAILABLE', '/images/Honda Hness CB350.jpeg', '["Smartphone Voice Control", "Traction Control", "Assist Slipper Clutch", "Full LED", "Chrome Finish"]'::jsonb, 'Your Highness has arrived. A blend of classic style and Japanese reliability.'),
(gen_random_uuid(), 'Jawa 42 Bobber', 'Jawa', 'BIKE', 1450, 'Mumbai', 'AVAILABLE', '/images/bob2.avif', '["Floating Seat", "LED Tail Lamp", "USB Charging", "Moonstone White", "Bar End Mirrors"]'::jsonb, 'Factory Custom. The most stylish and accessible bobber in the country.'),
(gen_random_uuid(), 'Hero Xpulse 200 4V', 'Hero', 'BIKE', 1000, 'Rishikesh', 'AVAILABLE', '/images/Hero Xpulse 200 4V.jpg', '["Rally Kit Compatible", "Turn-by-Turn Nav", "Long Travel Suspension", "ABS", "LED Headlight"]'::jsonb, 'Make New Tracks. India''s best entry-level adventure motorcycle.'),
(gen_random_uuid(), 'Continental GT 650', 'Royal Enfield', 'BIKE', 1900, 'Goa', 'AVAILABLE', '/images/Continental GT 650.webp', '["Twin Cylinder", "Clip-on Bars", "Cafe Racer Styling", "Dual ABS", "Slipper Clutch"]'::jsonb, 'Ton of Fun. Relive the cafe racer culture with the powerful 650cc.'),

-- Scooters
(gen_random_uuid(), 'Ather 450X', 'Ather Energy', 'BIKE', 900, 'Bangalore', 'AVAILABLE', '/images/ather2.avif', '["Google Maps", "Touchscreen", "Reverse Mode", "AutoHold", "Warp Mode"]'::jsonb, 'The Super Scooter. Experience the future of urban commuting.'),
(gen_random_uuid(), 'Ola S1 Pro', 'Ola Electric', 'BIKE', 850, 'Chennai', 'AVAILABLE', '/images/Ola S1 Pro.jpg', '["Hyper Mode", "Cruise Control", "Music Playback", "Digital Key", "Voice Control"]'::jsonb, '#EndICEAge. The most powerful electric scooter with best-in-class range.');

-- Optional: Insert some sample bookings for testing
-- Uncomment if you want sample booking data
/*
INSERT INTO bookings (id, user_id, vehicle_id, start_date, end_date, total_amount, status, payment_status)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM users WHERE role = 'USER' LIMIT 1),
    (SELECT id FROM vehicles WHERE name = 'Maruti Swift' LIMIT 1),
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '5 days',
    3600.00,
    'CONFIRMED',
    'PAID';
*/
