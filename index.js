// api/index.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// === DATA FILE ===
const DATA_FILE = path.join(__dirname, "..", "backend", "data.json");

// ====== Fungsi bantu ======
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], devices: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    console.error("Error loading data:", err);
    return { users: [], devices: [] };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving data:", err);
  }
}

// ====== AUTH Middleware ======
const sessions = {};

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !sessions[token])
    return res.status(403).json({ error: "Harus login dulu!" });
  req.user = sessions[token];
  next();
}

// ====== API REGISTER ======
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Lengkapi data!" });

  const data = loadData();
  if (data.users.find(u => u.username === username))
    return res.status(409).json({ error: "Username sudah digunakan!" });

  data.users.push({ username, password });
  saveData(data);
  res.json({ message: "Registrasi berhasil!" });
});

// ====== API LOGIN ======
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const data = loadData();
  const user = data.users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ error: "Username atau password salah!" });

  const token = Math.random().toString(36).substring(2);
  sessions[token] = username;
  res.json({ message: "Login berhasil!", token });
});

// ====== API DEVICES ======
app.get("/api/devices", auth, (req, res) => {
  const data = loadData();
  res.json({ data: data.devices });
});

app.post("/api/devices", auth, (req, res) => {
  const { deviceId, deviceName } = req.body;
  if (!deviceId || !deviceName)
    return res.status(400).json({ error: "Lengkapi data!" });

  const data = loadData();
  if (data.devices.find(d => d.deviceId === deviceId))
    return res.status(409).json({ error: "Device sudah ada!" });

  data.devices.push({ deviceId, deviceName });
  saveData(data);
  res.json({ message: "Device berhasil ditambah!" });
});

app.delete("/api/devices/:id", auth, (req, res) => {
  const data = loadData();
  const index = data.devices.findIndex(d => d.deviceId === req.params.id);
  if (index === -1)
    return res.status(404).json({ error: "Device tidak ditemukan!" });

  data.devices.splice(index, 1);
  saveData(data);
  res.json({ message: "Device berhasil dihapus!" });
});

// Default route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

module.exports = app;
