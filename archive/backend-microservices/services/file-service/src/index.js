import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import { randomUUID } from "node:crypto";

const app = express();
const port = Number(process.env.PORT || 8086);
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/wheelio";

const fileSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    versionKey: false
  }
);

const FileEntity = mongoose.model("FileEntity", fileSchema);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_BYTES || 50 * 1024 * 1024)
  }
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  })
);
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    service: "file-service",
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/files/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "file is required" });
    }

    const created = await FileEntity.create({
      name: req.file.originalname,
      contentType: req.file.mimetype || "application/octet-stream",
      data: req.file.buffer
    });

    return res.json({
      fileId: created._id,
      message: "File uploaded successfully"
    });
  } catch (error) {
    return res.status(400).json({ error: "Could not upload file", details: error.message });
  }
});

app.get("/api/files/:id", async (req, res) => {
  const file = await FileEntity.findById(String(req.params.id));
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

  res.setHeader("Content-Type", file.contentType);
  res.setHeader("Content-Disposition", `attachment; filename=\"${file.name}\"`);
  return res.send(file.data);
});

const start = async () => {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`File service listening on port ${port}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("File service failed to start", error);
  process.exit(1);
});
