// backend/server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* ========================
   🧩 DATABASE SEDERHANA
   (disimpan di memori sementara)
   ======================== */
let devices = [];

/* ========================
   ✅ GET /devices
   Ambil semua data device
   ======================== */
app.get("/devices", (req, res) => {
  res.status(200).json({
    success: true,
    total: devices.length,
    data: devices,
  });
});

/* ========================
   ✅ GET /devices/:id
   Ambil detail device berdasarkan deviceId
   ======================== */
app.get("/devices/:id", (req, res) => {
  const device = devices.find(d => d.deviceId === req.params.id);
  if (!device) {
    return res.status(404).json({ success: false, error: "Device tidak ditemukan" });
  }
  res.json({ success: true, data: device });
});

/* ========================
   ✅ POST /devices
   Tambah device baru
   ======================== */
app.post("/devices", (req, res) => {
  const { deviceId, deviceName } = req.body;

  // Validasi input
  if (!deviceId || !deviceName) {
    return res.status(400).json({ success: false, error: "Data tidak lengkap" });
  }

  const validNames = ["sound box pocket", "sound box premium"];
  if (!validNames.includes(deviceName)) {
    return res.status(400).json({ success: false, error: "Nama device tidak valid" });
  }

  const exists = devices.some(d => d.deviceId === deviceId);
  if (exists) {
    return res.status(409).json({ success: false, error: "Device ID sudah terdaftar" });
  }

  const newDevice = { deviceId, deviceName, createdAt: new Date().toISOString() };
  devices.push(newDevice);

  res.status(201).json({
    success: true,
    message: "Device berhasil ditambahkan",
    data: newDevice,
  });
});

/* ========================
   ✅ DELETE /devices/:id
   Hapus device berdasarkan deviceId
   ======================== */
app.delete("/devices/:id", (req, res) => {
  const index = devices.findIndex(d => d.deviceId === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Device tidak ditemukan" });
  }

  const deleted = devices.splice(index, 1)[0];
  res.json({
    success: true,
    message: "Device berhasil dihapus",
    data: deleted,
  });
});

/* ========================
   ✅ PUT /devices/:id
   Update nama device
   ======================== */
app.put("/devices/:id", (req, res) => {
  const { deviceName } = req.body;
  const validNames = ["sound box pocket", "sound box premium"];

  if (!validNames.includes(deviceName)) {
    return res.status(400).json({ success: false, error: "Nama device tidak valid" });
  }

  const device = devices.find(d => d.deviceId === req.params.id);
  if (!device) {
    return res.status(404).json({ success: false, error: "Device tidak ditemukan" });
  }

  device.deviceName = deviceName;
  device.updatedAt = new Date().toISOString();

  res.json({ success: true, message: "Device berhasil diperbarui", data: device });
});

/* ========================
   🚀 Jalankan server
   ======================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server API berjalan di http://localhost:${PORT}`));
