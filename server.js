// backend/server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let devices = []; // Simpan di memori sementara

// ===== GET /devices =====
app.get("/devices", (req, res) => {
  res.json(devices);
});

// ===== POST /devices =====
app.post("/devices", (req, res) => {
  const { deviceId, deviceName } = req.body;

  if (!deviceId || !deviceName) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  const validNames = ["sound box pocket", "sound box premium"];
  if (!validNames.includes(deviceName)) {
    return res.status(400).json({ error: "Nama device tidak valid" });
  }

  const exists = devices.some((d) => d.deviceId === deviceId);
  if (exists) {
    return res.status(409).json({ error: "Device ID sudah ada" });
  }

  devices.push({ deviceId, deviceName });
  res.status(201).json({ message: "Device ditambahkan" });
});

// ===== Jalankan server =====
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server API jalan di http://localhost:${PORT}`));
