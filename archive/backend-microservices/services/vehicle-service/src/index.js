import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { randomUUID } from "node:crypto";

const app = express();
const port = Number(process.env.PORT || 8082);
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/wheelio";

const vehicleTypes = ["SUV", "SEDAN", "BIKE", "HATCHBACK", "MPV", "SCOOTER"];
const vehicleStatuses = ["AVAILABLE", "BOOKED", "MAINTENANCE"];

const vehicleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    type: { type: String, enum: vehicleTypes, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: vehicleStatuses, default: "AVAILABLE" },
    imageUrl: { type: String, default: null },
    features: { type: [String], default: [] },
    description: { type: String, default: "" }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

const normalizeType = (type) => {
  const candidate = String(type || "").toUpperCase().trim();
  return vehicleTypes.includes(candidate) ? candidate : null;
};

const normalizeStatus = (status) => {
  const candidate = String(status || "AVAILABLE").toUpperCase().trim();
  if (candidate === "UNAVAILABLE") {
    return "BOOKED";
  }
  return vehicleStatuses.includes(candidate) ? candidate : "AVAILABLE";
};

const toVehicleResponse = (doc) => ({
  id: doc._id,
  name: doc.name,
  brand: doc.brand,
  type: doc.type,
  pricePerDay: doc.pricePerDay,
  price: doc.pricePerDay,
  location: doc.location,
  status: doc.status,
  imageUrl: doc.imageUrl,
  image: doc.imageUrl,
  features: doc.features || [],
  description: doc.description,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
});

const seedVehicles = [
  {
    name: "Maruti Swift",
    brand: "Maruti Suzuki",
    type: "HATCHBACK",
    pricePerDay: 1200,
    location: "Mumbai",
    imageUrl: "/images/swift.jpeg",
    description: "Perfect for city driving.",
    features: ["AC", "Music System", "Airbags"]
  },
  {
    name: "Hyundai Creta",
    brand: "Hyundai",
    type: "SUV",
    pricePerDay: 2500,
    location: "Bangalore",
    imageUrl: "/images/creta.jpg",
    description: "Premium SUV.",
    features: ["Sunroof", "Ventilated Seats", "Bose Audio"]
  },
  {
    name: "Mahindra Thar 4x4",
    brand: "Mahindra",
    type: "SUV",
    pricePerDay: 3500,
    location: "Coimbatore",
    imageUrl: "/images/thar.jpeg",
    description: "Explore the impossible.",
    features: ["4x4 Drivetrain", "Convertible Top"]
  },
  {
    name: "Tata Nexon EV",
    brand: "Tata Motors",
    type: "SUV",
    pricePerDay: 2800,
    location: "Pune",
    imageUrl: "/images/tata nexon ev.jpg",
    description: "Go Green with Tata Nexon EV.",
    features: ["Regenerative Braking", "Sunroof"]
  },
  {
    name: "Toyota Innova Crysta",
    brand: "Toyota",
    type: "MPV",
    pricePerDay: 3800,
    location: "Chennai",
    imageUrl: "/images/toyata crysta.jpg",
    description: "Unmatched Comfort.",
    features: ["Captain Seats", "Ambient Lighting"]
  },
  {
    name: "Honda City 5th Gen",
    brand: "Honda",
    type: "SEDAN",
    pricePerDay: 2200,
    location: "Delhi",
    imageUrl: "/images/honda city 5th gen.jpg",
    description: "Sophistication and comfort.",
    features: ["Lane Watch", "Sunroof", "Alexa"]
  },
  {
    name: "Mahindra XUV700",
    brand: "Mahindra",
    type: "SUV",
    pricePerDay: 3200,
    location: "Hyderabad",
    imageUrl: "/images/Mahindra XUV700.jpeg",
    description: "Experience the rush.",
    features: ["ADAS Level 2", "Dual HD Screens"]
  },
  {
    name: "Kia Seltos",
    brand: "Kia",
    type: "SUV",
    pricePerDay: 2400,
    location: "Kolkata",
    imageUrl: "/images/Kia Seltos.jpeg",
    description: "Badass by design.",
    features: ["Heads-Up Display", "360 Camera"]
  },
  {
    name: "Tata Safari",
    brand: "Tata Motors",
    type: "SUV",
    pricePerDay: 3300,
    location: "Mumbai",
    imageUrl: "/images/Tata Safari.webp",
    description: "Reclaim your life.",
    features: ["Panoramic Sunroof", "Captain Seats"]
  },
  {
    name: "Hyundai Verna",
    brand: "Hyundai",
    type: "SEDAN",
    pricePerDay: 2100,
    location: "Pune",
    imageUrl: "/images/Hyundai Verna.jpeg",
    description: "Futuristic Ferocity.",
    features: ["ADAS", "Dual 10.25 Screens"]
  },
  {
    name: "Maruti Brezza",
    brand: "Maruti Suzuki",
    type: "SUV",
    pricePerDay: 1800,
    location: "Jaipur",
    imageUrl: "/images/Maruti Brezza.avif",
    description: "The City-Bred SUV.",
    features: ["Sunroof", "360 Camera"]
  },
  {
    name: "Fortuner Legender",
    brand: "Toyota",
    type: "SUV",
    pricePerDay: 6500,
    location: "Chandigarh",
    imageUrl: "/images/Fortuner Legender.jpeg",
    description: "Power to Lead.",
    features: ["4x4 Sigma 4", "Kick Sensor Boot"]
  },
  {
    name: "Royal Enfield Himalayan 450",
    brand: "Royal Enfield",
    type: "BIKE",
    pricePerDay: 1500,
    location: "Manali",
    imageUrl: "/images/himalayan 450.jpg",
    description: "Built for all roads.",
    features: ["Tripper Navigation", "Switchable ABS"]
  },
  {
    name: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    type: "BIKE",
    pricePerDay: 1100,
    location: "Chennai",
    imageUrl: "/images/Royal Enfield Classic 350.jpeg",
    description: "The Reborn Classic.",
    features: ["Dual Channel ABS", "Digital-Analog Cluster"]
  },
  {
    name: "KTM Duke 390",
    brand: "KTM",
    type: "BIKE",
    pricePerDay: 1800,
    location: "Bangalore",
    imageUrl: "/images/ktm duke 390.jpeg",
    description: "The Corner Rocket.",
    features: ["Quickshifter+", "TFT Display"]
  },
  {
    name: "Bajaj Dominar 400",
    brand: "Bajaj",
    type: "BIKE",
    pricePerDay: 1400,
    location: "Pune",
    imageUrl: "/images/Bajaj Dominar 400.avif",
    description: "The Sports Tourer.",
    features: ["Touring Accessories", "USD Forks"]
  },
  {
    name: "Yamaha R15 V4",
    brand: "Yamaha",
    type: "BIKE",
    pricePerDay: 1200,
    location: "Kochi",
    imageUrl: "/images/Yamaha R15 V4.jpeg",
    description: "Racing DNA.",
    features: ["Quickshifter", "Traction Control"]
  },
  {
    name: "TVS Apache RR 310",
    brand: "TVS",
    type: "BIKE",
    pricePerDay: 1600,
    location: "Hosur",
    imageUrl: "/images/TVS Apache RR 310.jpeg",
    description: "Crafted to outperform.",
    features: ["Ride Modes", "TFT Display"]
  },
  {
    name: "Honda Hness CB350",
    brand: "Honda",
    type: "BIKE",
    pricePerDay: 1300,
    location: "Goa",
    imageUrl: "/images/Honda Hness CB350.jpeg",
    description: "Your Highness has arrived.",
    features: ["Voice Control", "Traction Control"]
  },
  {
    name: "Jawa 42 Bobber",
    brand: "Jawa",
    type: "BIKE",
    pricePerDay: 1450,
    location: "Mumbai",
    imageUrl: "/images/Jawa 42 Bobber.jpg",
    description: "Factory Custom.",
    features: ["Floating Seat", "LED Tail Lamp"]
  },
  {
    name: "Hero Xpulse 200 4V",
    brand: "Hero",
    type: "BIKE",
    pricePerDay: 1000,
    location: "Rishikesh",
    imageUrl: "/images/Hero Xpulse 200 4V.jpg",
    description: "Make New Tracks.",
    features: ["Rally Kit Compatible", "Turn-by-Turn Nav"]
  },
  {
    name: "Ather 450X",
    brand: "Ather Energy",
    type: "SCOOTER",
    pricePerDay: 900,
    location: "Bangalore",
    imageUrl: "/images/ather2.avif",
    description: "The Super Scooter.",
    features: ["Google Maps", "Touchscreen"]
  },
  {
    name: "Ola S1 Pro",
    brand: "Ola Electric",
    type: "SCOOTER",
    pricePerDay: 850,
    location: "Chennai",
    imageUrl: "/images/Ola S1 Pro.jpg",
    description: "#EndICEAge.",
    features: ["Hyper Mode", "Cruise Control"]
  },
  {
    name: "Continental GT 650",
    brand: "Royal Enfield",
    type: "BIKE",
    pricePerDay: 1900,
    location: "Goa",
    imageUrl: "/images/Continental GT 650.webp",
    description: "Ton of Fun.",
    features: ["Twin Cylinder", "Clip-on Bars"]
  }
];

const seedData = async () => {
  for (const seed of seedVehicles) {
    await Vehicle.findOneAndUpdate(
      { name: seed.name },
      { ...seed, status: "AVAILABLE" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
};

app.get("/api/health", (_req, res) => {
  res.json({
    service: "vehicle-service",
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/vehicles", async (_req, res) => {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 });
  res.json(vehicles.map((vehicle) => toVehicleResponse(vehicle)));
});

app.get("/api/vehicles/available", async (_req, res) => {
  const vehicles = await Vehicle.find({ status: "AVAILABLE" }).sort({ createdAt: -1 });
  res.json(vehicles.map((vehicle) => toVehicleResponse(vehicle)));
});

app.get("/api/vehicles/:id", async (req, res) => {
  const vehicle = await Vehicle.findById(String(req.params.id));
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  return res.json(toVehicleResponse(vehicle));
});

app.post("/api/vehicles", async (req, res) => {
  try {
    const payload = req.body || {};

    const type = normalizeType(payload.type);
    if (!type) {
      return res.status(400).json({ error: "Invalid vehicle type" });
    }

    if (!payload.name || !payload.brand || !payload.location) {
      return res.status(400).json({ error: "name, brand, and location are required" });
    }

    const priceValue = Number(payload.pricePerDay ?? payload.price);
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      return res.status(400).json({ error: "pricePerDay must be a positive number" });
    }

    const vehicle = await Vehicle.create({
      name: payload.name,
      brand: payload.brand,
      type,
      pricePerDay: priceValue,
      location: payload.location,
      status: normalizeStatus(payload.status),
      imageUrl: payload.imageUrl || payload.image || null,
      features: Array.isArray(payload.features) ? payload.features : [],
      description: payload.description || ""
    });

    return res.json(toVehicleResponse(vehicle));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Vehicle name already exists" });
    }
    return res.status(400).json({ error: "Failed to create vehicle", details: error.message });
  }
});

app.put("/api/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(String(req.params.id));
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const payload = req.body || {};

    if (payload.name !== undefined) {
      vehicle.name = payload.name;
    }
    if (payload.brand !== undefined) {
      vehicle.brand = payload.brand;
    }
    if (payload.type !== undefined) {
      const type = normalizeType(payload.type);
      if (!type) {
        return res.status(400).json({ error: "Invalid vehicle type" });
      }
      vehicle.type = type;
    }
    if (payload.pricePerDay !== undefined || payload.price !== undefined) {
      const priceValue = Number(payload.pricePerDay ?? payload.price);
      if (!Number.isFinite(priceValue) || priceValue <= 0) {
        return res.status(400).json({ error: "pricePerDay must be a positive number" });
      }
      vehicle.pricePerDay = priceValue;
    }
    if (payload.location !== undefined) {
      vehicle.location = payload.location;
    }
    if (payload.status !== undefined) {
      vehicle.status = normalizeStatus(payload.status);
    }
    if (payload.imageUrl !== undefined || payload.image !== undefined) {
      vehicle.imageUrl = payload.imageUrl || payload.image || null;
    }
    if (payload.features !== undefined) {
      vehicle.features = Array.isArray(payload.features) ? payload.features : [];
    }
    if (payload.description !== undefined) {
      vehicle.description = payload.description;
    }

    await vehicle.save();
    return res.json(toVehicleResponse(vehicle));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Vehicle name already exists" });
    }
    return res.status(400).json({ error: "Failed to update vehicle", details: error.message });
  }
});

app.delete("/api/vehicles/:id", async (req, res) => {
  const deleted = await Vehicle.findByIdAndDelete(String(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  return res.status(204).send();
});

app.get("/internal/vehicles/:id", async (req, res) => {
  const vehicle = await Vehicle.findById(String(req.params.id));
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  return res.json(toVehicleResponse(vehicle));
});

app.get("/internal/vehicles", async (req, res) => {
  const idsParam = String(req.query.ids || "").trim();
  if (!idsParam) {
    return res.json([]);
  }

  const ids = idsParam.split(",").map((value) => value.trim()).filter(Boolean);
  const vehicles = await Vehicle.find({ _id: { $in: ids } });
  return res.json(vehicles.map((vehicle) => toVehicleResponse(vehicle)));
});

const start = async () => {
  await mongoose.connect(mongoUri);
  await seedData();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Vehicle service listening on port ${port}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Vehicle service failed to start", error);
  process.exit(1);
});
