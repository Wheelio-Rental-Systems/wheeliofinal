import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const port = Number(process.env.PORT || 8073);

const serviceMap = {
  authUsers: process.env.USER_SERVICE_URL || "http://user-service:8081",
  vehicles: process.env.VEHICLE_SERVICE_URL || "http://vehicle-service:8082",
  bookings: process.env.BOOKING_SERVICE_URL || "http://booking-service:8083",
  payments: process.env.PAYMENT_SERVICE_URL || "http://payment-service:8084",
  damages: process.env.DAMAGE_SERVICE_URL || "http://damage-service:8085",
  files: process.env.FILE_SERVICE_URL || "http://file-service:8086"
};

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  })
);
app.use(morgan("dev"));

const buildProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    xfwd: true,
    timeout: 60000,
    proxyTimeout: 60000,
    onError: (err, req, res) => {
      res.status(502).json({
        error: `Gateway could not reach upstream service for ${req.originalUrl}`,
        details: err.message
      });
    }
  });

app.use("/api/auth", buildProxy(serviceMap.authUsers));
app.use("/api/users", buildProxy(serviceMap.authUsers));
app.use("/api/drivers", buildProxy(serviceMap.authUsers));

app.use("/api/vehicles", buildProxy(serviceMap.vehicles));
app.use("/api/bookings", buildProxy(serviceMap.bookings));
app.use("/api/payments", buildProxy(serviceMap.payments));
app.use("/api/damage-reports", buildProxy(serviceMap.damages));
app.use("/api/files", buildProxy(serviceMap.files));

app.get("/api/health", (_req, res) => {
  res.json({
    service: "api-gateway",
    status: "UP",
    services: serviceMap,
    timestamp: new Date().toISOString()
  });
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API gateway listening on port ${port}`);
});
