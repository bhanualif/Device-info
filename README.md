# 🧩 Tugas — Input Device Info

## 📖 Deskripsi
Program ini memungkinkan pengguna untuk **menambahkan data perangkat (Device)** dengan informasi berupa:
- **Device ID** (unik)
- **Device Name** (hanya boleh: `sound box pocket` atau `sound box premium`)

Setiap device yang berhasil ditambahkan akan ditampilkan dalam tabel di bawah form.  
Jika `Device ID` sudah pernah dimasukkan atau `Device Name` tidak valid, maka data tidak akan disimpan.

---

## 🧠 Tujuan Pembelajaran
- Melatih penggunaan **array** untuk menyimpan data.
- Menggunakan **validasi data** sebelum disimpan.
- Memahami penggunaan **event listener** (`submit`) pada form HTML.
- Menerapkan **DOM Manipulation** untuk menampilkan data ke tabel secara dinamis.

---

## ⚙️ Fungsionalitas Utama

### 1️⃣ Fungsi `addDevice(deviceId, deviceName)`
Fungsi ini bertanggung jawab untuk menambah data baru ke array `devices`.

#### Aturan:
- Jika `deviceName` bukan `"sound box pocket"` atau `"sound box premium"`, maka **data tidak disimpan**.
- Jika `deviceId` sudah ada di daftar, maka **tidak boleh ditambahkan lagi**.
- Jika semua valid, maka device baru **disimpan ke array `devices`** dan fungsi mengembalikan `true`.

#### Contoh:
```js
addDevice("SBX-0001", "sound box premium"); // ✅ true
addDevice("SBX-0001", "sound box pocket");  // ❌ false (ID duplikat)
addDevice("SBX-0002", "speaker mini");      // ❌ false (nama tidak valid)

🧩 Struktur Program
<form id="deviceForm">
  <label for="deviceId">Device ID</label>
  <input id="deviceId" required>

  <label for="deviceName">Device Name</label>
  <select id="deviceName" required>
    <option value="">-- Pilih Device --</option>
    <option value="sound box pocket">sound box pocket</option>
    <option value="sound box premium">sound box premium</option>
  </select>

  <button type="submit">Add Device</button>
</form>

<table id="deviceTable">
  <thead>
    <tr>
      <th>No</th>
      <th>Device ID</th>
      <th>Device Name</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

💻 Potongan Kode Utama
const devices = [];

function addDevice(deviceId, deviceName) {
  const validNames = ["sound box pocket", "sound box premium"];
  if (!validNames.includes(deviceName)) return false;

  const exists = devices.some(d => d.deviceId === deviceId);
  if (exists) return false;

  devices.push({ deviceId, deviceName });
  return true;
}


🚀 Cara Menjalankan
# Device App (Frontend + API)

Aplikasi sederhana untuk input & menampilkan daftar device menggunakan HTML, CSS, JS, dan Express.js API.

## 🚀 Fitur
- Tambah device dengan validasi (unik & nama valid)
- Data disimpan di backend API
- Tabel otomatis update dari server

## 📁 Struktur
device-app/
├─ backend/
│ └─ server.js
├─ frontend/
│ └─ index.html
└─ package.json

markdown
Copy code

## 🧰 Instalasi & Jalankan

1. Install dependencies
   ```bash
   npm install
Jalankan server backend

bash
Copy code
node backend/server.js
Akses di: http://localhost:3000/devices

Jalankan frontend

bash
Copy code
npx serve frontend
Akses di: http://localhost:5500

