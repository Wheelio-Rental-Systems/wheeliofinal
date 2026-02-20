import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { randomUUID } from "node:crypto";

const app = express();
const port = Number(process.env.PORT || 8083);
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/wheelio";
const userServiceUrl = process.env.USER_SERVICE_URL || "http://user-service:8081";
const vehicleServiceUrl = process.env.VEHICLE_SERVICE_URL || "http://vehicle-service:8082";

const bookingStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const paymentStatuses = ["PENDING", "PAID", "REFUNDED"];

const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    userId: { type: String, required: true },
    vehicleId: { type: String, required: true },
    driverId: { type: String, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: bookingStatuses, default: "PENDING" },
    paymentStatus: { type: String, enum: paymentStatuses, default: "PENDING" }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "20mb" }));

const parseFlexibleDate = (dateValue) => {
  if (!dateValue) {
    return new Date();
  }

  const raw = String(dateValue).trim();
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const withoutZ = raw.replace(/Z$/i, "");
  const parsedWithoutZ = new Date(withoutZ);
  if (!Number.isNaN(parsedWithoutZ.getTime())) {
    return parsedWithoutZ;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return new Date(`${raw}T00:00:00`);
  }

  return new Date();
};

const fetchJson = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
};

const fetchUser = async (userId) => fetchJson(`${userServiceUrl}/internal/users/${userId}`);
const fetchVehicle = async (vehicleId) => fetchJson(`${vehicleServiceUrl}/internal/vehicles/${vehicleId}`);

const enrichBooking = async (bookingDoc) => {
  const booking = bookingDoc.toObject ? bookingDoc.toObject() : bookingDoc;

  const [user, vehicle, driver] = await Promise.all([
    fetchUser(booking.userId),
    fetchVehicle(booking.vehicleId),
    booking.driverId ? fetchUser(booking.driverId) : Promise.resolve(null)
  ]);

  return {
    id: booking._id,
    user,
    vehicle,
    driver,
    startDate: booking.startDate,
    endDate: booking.endDate,
    totalAmount: booking.totalAmount,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt
  };
};

app.get("/api/health", (_req, res) => {
  res.json({
    service: "booking-service",
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/bookings", async (_req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  const enriched = await Promise.all(bookings.map((booking) => enrichBooking(booking)));
  res.json(enriched);
});

app.get("/api/bookings/:id", async (req, res) => {
  const booking = await Booking.findById(String(req.params.id));
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  return res.json(await enrichBooking(booking));
});

app.get("/api/bookings/user/:userId", async (req, res) => {
  const bookings = await Booking.find({ userId: String(req.params.userId) }).sort({ createdAt: -1 });
  const enriched = await Promise.all(bookings.map((booking) => enrichBooking(booking)));
  res.json(enriched);
});

app.get("/api/bookings/vehicle/:vehicleId", async (req, res) => {
  const bookings = await Booking.find({ vehicleId: String(req.params.vehicleId) }).sort({ createdAt: -1 });
  const enriched = await Promise.all(bookings.map((booking) => enrichBooking(booking)));
  res.json(enriched);
});

app.get("/api/bookings/driver/:driverId", async (req, res) => {
  const bookings = await Booking.find({ driverId: String(req.params.driverId) }).sort({ createdAt: -1 });
  const enriched = await Promise.all(bookings.map((booking) => enrichBooking(booking)));
  res.json(enriched);
});

app.post("/api/bookings", async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.userId || !payload.vehicleId || !payload.startDate || !payload.endDate) {
      return res.status(400).json({ error: "userId, vehicleId, startDate, and endDate are required" });
    }

    const totalAmount = Number(payload.totalAmount);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ error: "totalAmount must be a positive number" });
    }

    const [user, vehicle] = await Promise.all([
      fetchUser(String(payload.userId)),
      fetchVehicle(String(payload.vehicleId))
    ]);

    if (!user) {
      return res.status(400).json({ error: `User not found with ID: ${payload.userId}` });
    }
    if (!vehicle) {
      return res.status(400).json({ error: `Vehicle not found with ID: ${payload.vehicleId}` });
    }

    const driverId = payload.driverId ? String(payload.driverId) : null;

    const booking = await Booking.create({
      userId: String(payload.userId),
      vehicleId: String(payload.vehicleId),
      driverId,
      startDate: parseFlexibleDate(payload.startDate),
      endDate: parseFlexibleDate(payload.endDate),
      totalAmount,
      status: "CONFIRMED",
      paymentStatus: "PAID"
    });

    return res.json(await enrichBooking(booking));
  } catch (error) {
    return res.status(400).json({ error: "Failed to create booking", details: error.message });
  }
});

app.put("/api/bookings/:id/status", async (req, res) => {
  const booking = await Booking.findById(String(req.params.id));
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const payload = req.body || {};

  if (payload.bookingStatus !== undefined) {
    const candidate = String(payload.bookingStatus).toUpperCase();
    if (!bookingStatuses.includes(candidate)) {
      return res.status(400).json({ error: `Invalid bookingStatus: ${payload.bookingStatus}` });
    }
    booking.status = candidate;
  }

  if (payload.paymentStatus !== undefined) {
    const candidate = String(payload.paymentStatus).toUpperCase();
    if (!paymentStatuses.includes(candidate)) {
      return res.status(400).json({ error: `Invalid paymentStatus: ${payload.paymentStatus}` });
    }
    booking.paymentStatus = candidate;
  }

  await booking.save();
  return res.json(await enrichBooking(booking));
});

app.delete("/api/bookings/:id", async (req, res) => {
  const booking = await Booking.findById(String(req.params.id));
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  booking.status = "CANCELLED";
  await booking.save();
  return res.json({ message: "Booking cancelled successfully" });
});

app.get("/internal/bookings/:id", async (req, res) => {
  const booking = await Booking.findById(String(req.params.id));
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  return res.json(await enrichBooking(booking));
});

app.get("/internal/bookings", async (req, res) => {
  const idsParam = String(req.query.ids || "").trim();
  if (!idsParam) {
    return res.json([]);
  }

  const ids = idsParam.split(",").map((value) => value.trim()).filter(Boolean);
  const bookings = await Booking.find({ _id: { $in: ids } });
  const enriched = await Promise.all(bookings.map((booking) => enrichBooking(booking)));
  return res.json(enriched);
});

const start = async () => {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Booking service listening on port ${port}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Booking service failed to start", error);
  process.exit(1);
});
