import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import morgan from "morgan";
import { randomUUID } from "node:crypto";

const app = express();
const port = Number(process.env.PORT || 8081);
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/wheelio";
const jwtSecret = process.env.JWT_SECRET || "wheelio_super_secret_key_for_jwt_token_generation_2024_very_long_key";
const jwtExpiration = process.env.JWT_EXPIRATION || "86400000";

const roles = ["ADMIN", "DRIVER", "USER", "STAFF"];
const driverStatuses = ["ACTIVE", "ON_TRIP", "INACTIVE"];

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    fullName: { type: String, required: true },
    role: { type: String, enum: roles, default: "USER" },
    phone: { type: String, default: null },
    city: { type: String, default: null },
    avatarUrl: { type: String, default: null }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false
  }
);

const driverProfileSchema = new mongoose.Schema(
  {
    _id: { type: String, ref: "User", required: true },
    licenseNumber: { type: String, unique: true, required: true },
    rating: { type: Number, default: 5.0 },
    status: { type: String, enum: driverStatuses, default: "ACTIVE" },
    documents: {
      type: Map,
      of: String,
      default: {}
    }
  },
  {
    versionKey: false
  }
);

const User = mongoose.model("User", userSchema);
const DriverProfile = mongoose.model("DriverProfile", driverProfileSchema);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "20mb" }));

const normalizeRole = (role) => {
  const candidate = String(role || "USER").toUpperCase();
  return roles.includes(candidate) ? candidate : "USER";
};

const toUserResponse = (userDoc) => {
  if (!userDoc) {
    return null;
  }
  return {
    id: userDoc._id,
    email: userDoc.email,
    fullName: userDoc.fullName,
    role: userDoc.role,
    phone: userDoc.phone,
    city: userDoc.city,
    avatarUrl: userDoc.avatarUrl,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt
  };
};

const toDriverResponse = (profileDoc, userDoc) => {
  if (!profileDoc) {
    return null;
  }
  const documents = profileDoc.documents instanceof Map
    ? Object.fromEntries(profileDoc.documents)
    : profileDoc.documents || {};

  return {
    id: profileDoc._id,
    userId: profileDoc._id,
    user: toUserResponse(userDoc),
    licenseNumber: profileDoc.licenseNumber,
    rating: profileDoc.rating,
    status: profileDoc.status,
    documents
  };
};

const createToken = (user) => {
  const expiresInSeconds = Math.floor(Number(jwtExpiration) / 1000);
  return jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    jwtSecret,
    {
      expiresIn: expiresInSeconds > 0 ? expiresInSeconds : 86400,
      subject: user.email
    }
  );
};

const readBearerToken = (headerValue) => {
  if (!headerValue || !headerValue.startsWith("Bearer ")) {
    return null;
  }
  return headerValue.slice(7);
};

const upsertSeedUser = async (seed) => {
  const existing = await User.findOne({ email: seed.email.toLowerCase() }).select("+passwordHash");
  const passwordHash = await bcrypt.hash(seed.password, 10);

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.fullName = seed.fullName;
    existing.role = seed.role;
    existing.phone = seed.phone;
    existing.city = seed.city;
    await existing.save();
    return existing;
  }

  const created = await User.create({
    email: seed.email.toLowerCase(),
    passwordHash,
    fullName: seed.fullName,
    role: seed.role,
    phone: seed.phone,
    city: seed.city
  });
  return created;
};

const seedData = async () => {
  const admin = await upsertSeedUser({
    email: "admin@wheelio.com",
    password: "admin123",
    fullName: "Admin User",
    role: "ADMIN",
    phone: "9999999999",
    city: "Headquarters"
  });

  const driver = await upsertSeedUser({
    email: "driver@wheelio.com",
    password: "driver123",
    fullName: "Test Driver",
    role: "DRIVER",
    phone: "8888888888",
    city: "Chennai"
  });

  await upsertSeedUser({
    email: "staff@wheelio.com",
    password: "staff123",
    fullName: "Staff Member",
    role: "STAFF",
    phone: "7777777777",
    city: "Bangalore"
  });

  await upsertSeedUser({
    email: "user@wheelio.com",
    password: "user123",
    fullName: "Test User",
    role: "USER",
    phone: "6666666666",
    city: "Coimbatore"
  });

  await DriverProfile.findByIdAndUpdate(
    driver._id,
    {
      _id: driver._id,
      licenseNumber: "DRV-TEST-001",
      rating: 4.9,
      status: "ACTIVE",
      documents: {
        licenseFront: "uploaded",
        identityProof: "uploaded"
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Keep references used by admins
  void admin;
};

app.get("/api/health", (_req, res) => {
  res.json({
    service: "user-service",
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, fullName, role, phone, city } = req.body || {};
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "email, password, and fullName are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      fullName: String(fullName),
      role: normalizeRole(role),
      phone: phone || null,
      city: city || null
    });

    return res.json({ token: createToken(user), user: toUserResponse(user) });
  } catch (error) {
    return res.status(500).json({ error: "Signup failed", details: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

    if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json({ token: createToken(user), user: toUserResponse(user) });
  } catch (error) {
    return res.status(500).json({ error: "Login failed", details: error.message });
  }
});

app.get("/api/auth/me", async (req, res) => {
  try {
    const token = readBearerToken(req.header("Authorization"));
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findOne({ email: decoded.sub || decoded.email || "" });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(toUserResponse(user));
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

app.delete("/api/auth/delete/:email", async (req, res) => {
  try {
    const email = String(req.params.email || "").toLowerCase().trim();
    const deleted = await User.findOneAndDelete({ email });
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    await DriverProfile.findByIdAndDelete(deleted._id);
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Delete failed", details: error.message });
  }
});

app.put("/api/auth/update-role/:email", async (req, res) => {
  try {
    const email = String(req.params.email || "").toLowerCase().trim();
    const role = normalizeRole(req.query.role);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = role;
    await user.save();
    return res.json({ message: `User role updated to ${role}` });
  } catch (error) {
    return res.status(500).json({ error: "Role update failed", details: error.message });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(String(req.params.id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(toUserResponse(user));
  } catch (error) {
    return res.status(400).json({ error: "Invalid user id", details: error.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(String(req.params.id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { fullName, phone, city, avatarUrl } = req.body || {};
    if (fullName !== undefined) {
      user.fullName = fullName;
    }
    if (phone !== undefined) {
      user.phone = phone;
    }
    if (city !== undefined) {
      user.city = city;
    }
    if (avatarUrl !== undefined) {
      user.avatarUrl = avatarUrl;
    }

    await user.save();
    return res.json(toUserResponse(user));
  } catch (error) {
    return res.status(400).json({ error: "Invalid user payload", details: error.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(String(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    await DriverProfile.findByIdAndDelete(String(req.params.id));
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: "Delete failed", details: error.message });
  }
});

app.get("/api/drivers", async (_req, res) => {
  try {
    const profiles = await DriverProfile.find().lean();
    const userIds = profiles.map((profile) => profile._id);
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const userById = new Map(users.map((user) => [user._id, user]));

    const response = profiles.map((profile) => toDriverResponse(profile, userById.get(profile._id)));
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch drivers", details: error.message });
  }
});

app.get("/api/drivers/available", async (req, res) => {
  try {
    const city = req.query.city ? String(req.query.city).trim().toLowerCase() : null;
    const profiles = await DriverProfile.find({ status: "ACTIVE" }).lean();
    const userIds = profiles.map((profile) => profile._id);
    const users = await User.find({ _id: { $in: userIds }, ...(city ? { city: new RegExp(`^${city}$`, "i") } : {}) }).lean();
    const allowedIds = new Set(users.map((user) => user._id));
    const userById = new Map(users.map((user) => [user._id, user]));

    const response = profiles
      .filter((profile) => allowedIds.has(profile._id))
      .map((profile) => toDriverResponse(profile, userById.get(profile._id)));

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch available drivers", details: error.message });
  }
});

app.get("/api/drivers/:userId", async (req, res) => {
  try {
    const userId = String(req.params.userId);
    const profile = await DriverProfile.findById(userId).lean();
    if (!profile) {
      return res.status(404).json({ error: "Driver profile not found" });
    }

    const user = await User.findById(userId).lean();
    return res.json(toDriverResponse(profile, user));
  } catch (error) {
    return res.status(400).json({ error: "Invalid driver id", details: error.message });
  }
});

app.put("/api/drivers/:userId", async (req, res) => {
  try {
    const userId = String(req.params.userId);
    const profile = await DriverProfile.findById(userId);
    if (!profile) {
      return res.status(404).json({ error: "Driver profile not found" });
    }

    const { licenseNumber, rating, status, documents } = req.body || {};

    if (licenseNumber !== undefined) {
      profile.licenseNumber = licenseNumber;
    }
    if (rating !== undefined) {
      profile.rating = Number(rating);
    }
    if (status !== undefined) {
      const candidate = String(status).toUpperCase();
      if (!driverStatuses.includes(candidate)) {
        return res.status(400).json({ error: `Invalid status: ${status}` });
      }
      profile.status = candidate;
    }
    if (documents && typeof documents === "object") {
      profile.documents = documents;
    }

    await profile.save();

    const user = await User.findById(userId).lean();
    return res.json(toDriverResponse(profile.toObject(), user));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "License number already exists" });
    }
    return res.status(400).json({ error: "Failed to update driver profile", details: error.message });
  }
});

app.post("/api/drivers", async (req, res) => {
  try {
    const userId = String(req.body?.userId || req.body?.user?.id || req.body?.user?._id || "").trim();
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.role !== "DRIVER") {
      user.role = "DRIVER";
      await user.save();
    }

    const statusValue = req.body?.status ? String(req.body.status).toUpperCase() : "ACTIVE";
    if (!driverStatuses.includes(statusValue)) {
      return res.status(400).json({ error: `Invalid status: ${req.body.status}` });
    }

    const profile = await DriverProfile.findByIdAndUpdate(
      userId,
      {
        _id: userId,
        licenseNumber: req.body?.licenseNumber || `DRV-${userId.slice(0, 8).toUpperCase()}`,
        rating: req.body?.rating !== undefined ? Number(req.body.rating) : 5,
        status: statusValue,
        documents: req.body?.documents || {}
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json(toDriverResponse(profile.toObject(), user.toObject()));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "License number already exists" });
    }
    return res.status(400).json({ error: "Failed to create driver profile", details: error.message });
  }
});

app.get("/internal/users/:id", async (req, res) => {
  try {
    const user = await User.findById(String(req.params.id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(toUserResponse(user));
  } catch (error) {
    return res.status(400).json({ error: "Invalid user id", details: error.message });
  }
});

app.get("/internal/users", async (req, res) => {
  try {
    const idsParam = String(req.query.ids || "").trim();
    if (!idsParam) {
      return res.json([]);
    }

    const ids = idsParam.split(",").map((value) => value.trim()).filter(Boolean);
    const users = await User.find({ _id: { $in: ids } });
    return res.json(users.map((user) => toUserResponse(user)));
  } catch (error) {
    return res.status(400).json({ error: "Invalid ids", details: error.message });
  }
});

const start = async () => {
  await mongoose.connect(mongoUri);
  await seedData();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`User service listening on port ${port}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("User service failed to start", error);
  process.exit(1);
});
