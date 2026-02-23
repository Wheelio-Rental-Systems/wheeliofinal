import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { randomUUID } from "node:crypto";

const app = express();
const port = Number(process.env.PORT || 8084);
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/wheelio";
const bookingServiceUrl = process.env.BOOKING_SERVICE_URL || "http://booking-service:8083";

const paymentSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    bookingId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true, unique: true },
    razorpayOrderId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    amount: { type: Number, required: true },
    method: { type: String, default: null },
    status: { type: String, default: "SUCCESS" }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

const fetchBooking = async (bookingId) => {
  try {
    const response = await fetch(`${bookingServiceUrl}/internal/bookings/${bookingId}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
};

const enrichPayment = async (paymentDoc) => {
  const payment = paymentDoc.toObject ? paymentDoc.toObject() : paymentDoc;
  const booking = await fetchBooking(payment.bookingId);

  return {
    id: payment._id,
    booking,
    bookingId: payment.bookingId,
    razorpayPaymentId: payment.razorpayPaymentId,
    razorpayOrderId: payment.razorpayOrderId,
    razorpaySignature: payment.razorpaySignature,
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt
  };
};

app.get("/api/health", (_req, res) => {
  res.json({
    service: "payment-service",
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/payments", async (_req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 });
  const enriched = await Promise.all(payments.map((payment) => enrichPayment(payment)));
  res.json(enriched);
});

app.get("/api/payments/booking/:bookingId", async (req, res) => {
  const payments = await Payment.find({ bookingId: String(req.params.bookingId) }).sort({ createdAt: -1 });
  const enriched = await Promise.all(payments.map((payment) => enrichPayment(payment)));
  res.json(enriched);
});

app.post("/api/payments", async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.bookingId || !payload.razorpayPaymentId || payload.amount === undefined) {
      return res.status(400).json({ error: "bookingId, razorpayPaymentId, and amount are required" });
    }

    const booking = await fetchBooking(String(payload.bookingId));
    if (!booking) {
      return res.status(400).json({ error: `Booking not found: ${payload.bookingId}` });
    }

    const amount = Number(payload.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }

    const payment = await Payment.create({
      bookingId: String(payload.bookingId),
      razorpayPaymentId: String(payload.razorpayPaymentId),
      razorpayOrderId: payload.razorpayOrderId || null,
      razorpaySignature: payload.razorpaySignature || null,
      amount,
      method: payload.method || null,
      status: payload.status || "SUCCESS"
    });

    return res.json(await enrichPayment(payment));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "razorpayPaymentId already exists" });
    }
    return res.status(400).json({ error: "Failed to record payment", details: error.message });
  }
});

app.post("/api/payments/verify", async (req, res) => {
  const paymentId = String(req.body?.razorpayPaymentId || "").trim();
  if (!paymentId) {
    return res.status(400).json({ error: "razorpayPaymentId is required" });
  }

  const payment = await Payment.findOne({ razorpayPaymentId: paymentId });
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  return res.json({
    verified: true,
    payment: await enrichPayment(payment)
  });
});

const start = async () => {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Payment service listening on port ${port}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Payment service failed to start", error);
  process.exit(1);
});
