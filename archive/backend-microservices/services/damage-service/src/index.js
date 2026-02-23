import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { randomUUID } from "node:crypto";

const app = express();
const port = Number(process.env.PORT || 8085);
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/wheelio";
const userServiceUrl = process.env.USER_SERVICE_URL || "http://user-service:8081";
const vehicleServiceUrl = process.env.VEHICLE_SERVICE_URL || "http://vehicle-service:8082";

const severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const damageStatuses = ["OPEN", "INVESTIGATING", "ESTIMATED", "RESOLVED", "PAID"];

const damageReportSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    vehicleId: { type: String, required: true },
    reportedById: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    severity: { type: String, enum: severities, default: null },
    status: { type: String, enum: damageStatuses, default: "OPEN" },
    estimatedCost: { type: Number, default: null },
    razorpayPaymentId: { type: String, default: null }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false
  }
);

const DamageReport = mongoose.model("DamageReport", damageReportSchema);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));

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

const normalizeSeverity = (severity) => {
  if (severity === null || severity === undefined || severity === "") {
    return null;
  }
  const candidate = String(severity).toUpperCase();
  return severities.includes(candidate) ? candidate : null;
};

const normalizeStatus = (status) => {
  const candidate = String(status || "OPEN").toUpperCase();
  return damageStatuses.includes(candidate) ? candidate : null;
};

const enrichReport = async (reportDoc) => {
  const report = reportDoc.toObject ? reportDoc.toObject() : reportDoc;
  const [vehicle, reportedBy] = await Promise.all([
    fetchVehicle(report.vehicleId),
    fetchUser(report.reportedById)
  ]);

  return {
    id: report._id,
    vehicle,
    reportedBy,
    description: report.description,
    images: report.images || [],
    severity: report.severity,
    status: report.status,
    estimatedCost: report.estimatedCost,
    razorpayPaymentId: report.razorpayPaymentId,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt
  };
};

app.get("/api/health", (_req, res) => {
  res.json({
    service: "damage-service",
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/damage-reports", async (_req, res) => {
  const reports = await DamageReport.find().sort({ createdAt: -1 });
  const enriched = await Promise.all(reports.map((report) => enrichReport(report)));
  res.json(enriched);
});

app.get("/api/damage-reports/:id", async (req, res) => {
  const report = await DamageReport.findById(String(req.params.id));
  if (!report) {
    return res.status(404).json({ error: "Damage report not found" });
  }
  return res.json(await enrichReport(report));
});

app.get("/api/damage-reports/vehicle/:vehicleId", async (req, res) => {
  const reports = await DamageReport.find({ vehicleId: String(req.params.vehicleId) }).sort({ createdAt: -1 });
  const enriched = await Promise.all(reports.map((report) => enrichReport(report)));
  return res.json(enriched);
});

app.get("/api/damage-reports/status/:status", async (req, res) => {
  const status = normalizeStatus(req.params.status);
  if (!status) {
    return res.status(400).json({ error: `Invalid status: ${req.params.status}` });
  }

  const reports = await DamageReport.find({ status }).sort({ createdAt: -1 });
  const enriched = await Promise.all(reports.map((report) => enrichReport(report)));
  return res.json(enriched);
});

app.get("/api/damage-reports/user/:userId", async (req, res) => {
  const reports = await DamageReport.find({ reportedById: String(req.params.userId) }).sort({ createdAt: -1 });
  const enriched = await Promise.all(reports.map((report) => enrichReport(report)));
  return res.json(enriched);
});

app.post("/api/damage-reports", async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.vehicleId || !payload.reportedById || !payload.description) {
      return res.status(400).json({ error: "vehicleId, reportedById, and description are required" });
    }

    const [vehicle, user] = await Promise.all([
      fetchVehicle(String(payload.vehicleId)),
      fetchUser(String(payload.reportedById))
    ]);

    if (!vehicle) {
      return res.status(400).json({ error: `Vehicle not found: ${payload.vehicleId}` });
    }
    if (!user) {
      return res.status(400).json({ error: `User not found: ${payload.reportedById}` });
    }

    const severity = normalizeSeverity(payload.severity);
    if (payload.severity && !severity) {
      return res.status(400).json({ error: `Invalid severity: ${payload.severity}` });
    }

    const estimatedCost = payload.estimatedCost !== undefined && payload.estimatedCost !== null
      ? Number(payload.estimatedCost)
      : null;

    if (estimatedCost !== null && (!Number.isFinite(estimatedCost) || estimatedCost < 0)) {
      return res.status(400).json({ error: "estimatedCost must be a non-negative number" });
    }

    const status = estimatedCost !== null && estimatedCost > 0 ? "ESTIMATED" : "OPEN";

    const report = await DamageReport.create({
      vehicleId: String(payload.vehicleId),
      reportedById: String(payload.reportedById),
      description: String(payload.description),
      images: Array.isArray(payload.images) ? payload.images : [],
      severity,
      status,
      estimatedCost
    });

    return res.json(await enrichReport(report));
  } catch (error) {
    return res.status(400).json({ error: "Failed to create damage report", details: error.message });
  }
});

app.put("/api/damage-reports/:id/status", async (req, res) => {
  const report = await DamageReport.findById(String(req.params.id));
  if (!report) {
    return res.status(404).json({ error: "Damage report not found" });
  }

  const payload = req.body || {};

  if (payload.status !== undefined) {
    const status = normalizeStatus(payload.status);
    if (!status) {
      return res.status(400).json({ error: `Invalid status: ${payload.status}` });
    }
    report.status = status;
  }

  if (payload.severity !== undefined) {
    const severity = normalizeSeverity(payload.severity);
    if (payload.severity && !severity) {
      return res.status(400).json({ error: `Invalid severity: ${payload.severity}` });
    }
    report.severity = severity;
  }

  if (payload.estimatedCost !== undefined) {
    const estimatedCost = Number(payload.estimatedCost);
    if (!Number.isFinite(estimatedCost) || estimatedCost < 0) {
      return res.status(400).json({ error: "estimatedCost must be a non-negative number" });
    }
    report.estimatedCost = estimatedCost;
  }

  await report.save();
  return res.json(await enrichReport(report));
});

app.put("/api/damage-reports/:id/pay", async (req, res) => {
  const report = await DamageReport.findById(String(req.params.id));
  if (!report) {
    return res.status(404).json({ error: "Damage report not found" });
  }

  report.status = "PAID";
  if (req.body?.razorpayPaymentId) {
    report.razorpayPaymentId = String(req.body.razorpayPaymentId);
  }

  await report.save();
  return res.json({
    message: "Payment recorded successfully",
    report: await enrichReport(report)
  });
});

const start = async () => {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Damage service listening on port ${port}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Damage service failed to start", error);
  process.exit(1);
});
