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

# Device Info - Soundbox Management System

Aplikasi manajemen device Soundbox dengan fitur autentikasi dan CRUD device.

## Fitur
- ✅ Registrasi & Login
- ✅ Manajemen Device (Tambah, Lihat, Hapus)
- ✅ Autentikasi dengan Token

## Tech Stack
- **Backend**: Node.js + Express
- **Frontend**: HTML, CSS, JavaScript
- **Database**: JSON File
- **Deployment**: Vercel

## Setup Lokal

### Prerequisites
- Node.js v14+
- npm atau yarn

### Instalasi

```bash
# Clone repo
git clone <repo-url>
cd "Device Info"

# Install backend dependencies
cd backend
npm install
cd ..

# Jalankan server
cd backend
npm start
```

Server akan berjalan di `http://localhost:3000`

## Deploy ke Vercel

### Persiapan
1. Push project ke GitHub
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

### Deploy Steps

#### **Opsi 1: Via Vercel CLI (Recommended)**
```bash
# Login ke Vercel
vercel login

# Deploy ke production
vercel --prod
```

#### **Opsi 2: Via Vercel Dashboard**
1. Buka https://vercel.com/dashboard
2. Klik "Add New" → "Project"
3. Import repository GitHub
4. Klik "Deploy"

### Verifikasi setelah Deploy

✅ Cek endpoints berikut:
- **Homepage**: `https://your-project.vercel.app/`
- **Register**: `https://your-project.vercel.app/register`
- **Login**: `https://your-project.vercel.app/login`
- **API**: `https://your-project.vercel.app/api/devices` (perlu token)

### Test Login
1. Buka `https://your-project.vercel.app/`
2. Gunakan akun yang sudah ada:
   - Username: `bhanu` / Password: `123`
   - Username: `alif` / Password: `123`
3. Atau buat akun baru di halaman Register

### Catatan Penting ⚠️

**Data Persistence:**
- Data JSON tersimpan di file sistem, tetapi **TIDAK persisten** saat deployment baru
- Setiap kali Vercel melakukan re-deploy, data akan reset
- Untuk production, gunakan database eksternal seperti:
  - MongoDB Atlas (cloud database)
  - Firebase Realtime Database
  - PostgreSQL di render.com atau supabase.com

**Saat ini:** App cocok untuk testing/demo

## Struktur Folder

```
Device Info/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Dependencies
│   └── data.json          # Database JSON
├── frontend/
│   ├── login.html         # Halaman login
│   ├── register.html      # Halaman register
│   ├── index.html         # Halaman utama
│   └── README.md
├── vercel.json            # Konfigurasi Vercel
└── .gitignore
```

## API Endpoints

### Auth
- `POST /register` - Registrasi user baru
- `POST /login` - Login dan dapatkan token

### Device (Memerlukan Token)
- `GET /devices` - Lihat semua device
- `POST /devices` - Tambah device baru
- `DELETE /devices/:id` - Hapus device

## Troubleshooting

### Masalah: "Cannot find module"
```bash
cd backend && npm install
```

### Masalah: Port sudah digunakan
Ubah PORT di `backend/server.js` atau hentikan service yang menggunakan port.

### Masalah: Deploy gagal
- Pastikan `vercel.json` sudah benar
- Cek logs: `vercel logs <project-url>`

## Lisensi
MIT



