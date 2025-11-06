// backend/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

/* ========================
   🧩 KONFIGURASI STATIC FILE
   ======================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend")));

/* ========================
   🏠 ROUTE UTAMA
   ======================== */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* ========================
   🧩 DATABASE SEDERHANA (sementara)
   ======================== */
let users = [];
let sessions = {};
let devices = [];

/* ========================
   👤 AUTH: REGISTER & LOGIN
   ======================== */

// REGISTER
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, error: "Data tidak lengkap" });

  const exist = users.find(u => u.username === username);
  if (exist)
    return res.status(409).json({ success: false, error: "Username sudah terdaftar" });

  users.push({ username, password });
  res.status(201).json({ success: true, message: "Registrasi berhasil!" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user)
    return res.status(401).json({ success: false, error: "Username atau password salah" });

  const token = Math.random().toString(36).substring(2);
  sessions[token] = username;

  res.json({ success: true, message: "Login berhasil!", token });
});

// MIDDLEWARE CEK LOGIN
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !sessions[token])
    return res.status(403).json({ success: false, error: "Akses ditolak, login dulu" });
  next();
}

/* ========================
   ✅ ROUTE DEVICES (dilindungi)
   ======================== */
app.use("/devices", authMiddleware);

// GET /devices
app.get("/devices", (req, res) => {
  res.status(200).json({
    success: true,
    total: devices.length,
    data: devices,
  });
});

// GET /devices/:id
app.get("/devices/:id", (req, res) => {
  const device = devices.find(d => d.deviceId === req.params.id);
  if (!device) return res.status(404).json({ success: false, error: "Device tidak ditemukan" });
  res.json({ success: true, data: device });
});

// POST /devices
app.post("/devices", (req, res) => {
  const { deviceId, deviceName } = req.body;
  if (!deviceId || !deviceName)
    return res.status(400).json({ success: false, error: "Data tidak lengkap" });

  const validNames = ["sound box pocket", "sound box premium"];
  if (!validNames.includes(deviceName))
    return res.status(400).json({ success: false, error: "Nama device tidak valid" });

  const exists = devices.some(d => d.deviceId === deviceId);
  if (exists)
    return res.status(409).json({ success: false, error: "Device ID sudah terdaftar" });

  const newDevice = { deviceId, deviceName, createdAt: new Date().toISOString() };
  devices.push(newDevice);

  res.status(201).json({
    success: true,
    message: "Device berhasil ditambahkan",
    data: newDevice,
  });
});

// DELETE /devices/:id
app.delete("/devices/:id", (req, res) => {
  const index = devices.findIndex(d => d.deviceId === req.params.id);
  if (index === -1)
    return res.status(404).json({ success: false, error: "Device tidak ditemukan" });

  const deleted = devices.splice(index, 1)[0];
  res.json({
    success: true,
    message: "Device berhasil dihapus",
    data: deleted,
  });
});

// PUT /devices/:id
app.put("/devices/:id", (req, res) => {
  const { deviceName } = req.body;
  const validNames = ["sound box pocket", "sound box premium"];

  if (!validNames.includes(deviceName))
    return res.status(400).json({ success: false, error: "Nama device tidak valid" });

  const device = devices.find(d => d.deviceId === req.params.id);
  if (!device)
    return res.status(404).json({ success: false, error: "Device tidak ditemukan" });

  device.deviceName = deviceName;
  device.updatedAt = new Date().toISOString();

  res.json({ success: true, message: "Device berhasil diperbarui", data: device });
});

/* ========================
   🚀 Jalankan server
   ======================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server API berjalan di http://localhost:${PORT}`));
