import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// === setup path untuk akses file html ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files dari direktori yang sama dengan server.js
app.use(express.static(__dirname));

// === data sementara ===
let users = [];
let sessions = {};
let devices = [];

// === serve HTML files ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

// === register ===
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Lengkapi data!" });

  if (users.find(u => u.username === username))
    return res.status(409).json({ error: "Username sudah digunakan!" });

  users.push({ username, password });
  res.json({ message: "Registrasi berhasil!" });
});

// === login ===
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Username / password salah!" });

  const token = Math.random().toString(36).substring(2);
  sessions[token] = username;
  res.json({ message: "Login berhasil!", token });
});

// === middleware auth ===
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !sessions[token])
    return res.status(403).json({ error: "Harus login dulu!" });
  next();
}

// === route devices ===
app.get("/devices", auth, (req, res) => {
  res.json({
    success: true,
    data: devices
  });
});

app.post("/devices", auth, (req, res) => {
  const { deviceId, deviceName } = req.body;
  if (!deviceId || !deviceName)
    return res.status(400).json({ success: false, error: "Lengkapi data!" });

  if (devices.find(d => d.deviceId === deviceId))
    return res.status(409).json({ success: false, error: "Device sudah ada!" });

  devices.push({ deviceId, deviceName });
  res.json({ success: true, message: "Device berhasil ditambah!" });
});

app.delete("/devices/:id", auth, (req, res) => {
  const index = devices.findIndex(d => d.deviceId === req.params.id);
  if (index === -1)
    return res.status(404).json({ success: false, error: "Device tidak ditemukan!" });

  devices.splice(index, 1);
  res.json({ success: true, message: "Device berhasil dihapus!" });
});

// INI PENTING: export default untuk Vercel/deployment
export default app;

// Jalankan server secara lokal (hanya jika tidak di Vercel)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server API berjalan di http://localhost:${PORT}`);
    console.log(`Buka browser: http://localhost:${PORT}`);
    console.log(`Tekan Ctrl+C untuk menghentikan server`);
  });

  // Handle error
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} sudah digunakan. Coba gunakan port lain.`);
      console.log(`Contoh: PORT=3001 node server.js`);
    } else {
      console.error('Error:', err);
    }
    process.exit(1);
  });
}
