import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let sessions = {};
let devices = [];

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Lengkapi data" });

  if (users.find(u => u.username === username))
    return res.status(409).json({ error: "Username sudah terdaftar" });

  users.push({ username, password });
  res.json({ message: "Registrasi Berhasil!" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user)
    return res.status(401).json({ error: "Username / password salah" });

  const token = Math.random().toString(36).substring(2);
  sessions[token] = username;
  res.json({ message: "Login berhasil!", token });
});

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !sessions[token])
    return res.status(403).json({ error: "Akses ditolak, login dulu" });
  next();
}

app.get("/devices", auth, (req, res) => {
  res.json({ data: devices });
});

app.post("/devices", auth, (req, res) => {
  const { deviceId, deviceName } = req.body;
  if (!deviceId || !deviceName)
    return res.status(400).json({ error: "Lengkapi data" });

  if (devices.find(d => d.deviceId === deviceId))
    return res.status(409).json({ error: "Device ID sudah ada" });

  devices.push({ deviceId, deviceName });
  res.json({ message: "Device ditambah!" });
});

app.delete("/devices/:id", auth, (req, res) => {
  const index = devices.findIndex(d => d.deviceId === req.params.id);
  if (index === -1)
    return res.status(404).json({ error: "Device tidak ditemukan" });

  devices.splice(index, 1);
  res.json({ message: "Device dihapus!" });
});

export default app;
