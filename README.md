# 🛍️ PintarLabs Software Marketplace & Licensing Platform

Marketplace penjualan software dan aplikasi siap pakai (**Ready-to-Use Software**) buatan PintarLabs untuk platform **Windows PC** (`.exe`) dan **Android Mobile** (`.apk`), terintegrasi dengan generator kode lisensi otomatis, manajemen aktivasi HWID (Machine Fingerprint), customer download portal, dan dashboard admin.

---

## 🚀 Fitur Utama

1. **Katalog Software Modern (Storefront)**
   - Filter Kategori (Kasir & POS, Inventori & Stok, Sistem Sekolah SPP, Keuangan UKM).
   - Filter Platform (Windows PC, Android Mobile, Web/Cloud).
   - Live Search & Badges (Best Seller, Rating, Version).

2. **Halaman Detail Produk Interaktif (Product Showcase)**
   - Rincian Modul & Fitur Lengkap dengan Ikon & Penjelasan.
   - Pilihan Paket Lisensi (Single Outlet, Multi-Device Pro, Enterprise).
   - Galeri Screenshot Tampilan Layar (Windows Desktop vs Android).
   - Kompatibilitas Hardware (Printer Thermal 58/80mm, Barcode Scanner, Cash Drawer).
   - Panduan 3 Langkah Cepat Aktivasi & Ulasan Pembeli Terverifikasi.

3. **Pemesanan Instan & Direct Delivery**
   - **Guest Checkout**: Pembeli tidak wajib mendaftar/login di awal, cukup Nama & No. WhatsApp.
   - **Instant License Generator**: Menghasilkan kode lisensi resmi format PintarLabs:  
     `PL-{PROD_CODE}-{PLAN_CODE}-{RAND4}-{RAND4}-{RAND4}`
   - Tombol Download Instan (Installer `.exe`, APK Android, E-Book PDF Panduan).
   - Direct WhatsApp Order confirmation generator.

4. **Portal Download & Lisensi Customer** (`/portal`)
   - Customer cukup memasukkan No. WhatsApp atau Email saat pembelian untuk melihat riwayat lisensi, download ulang software, dan cek batas perangkat.

5. **Dashboard Admin PintarLabs** (`/admin`)
   - Ringkasan Omset, Total Pesanan, dan Lisensi Aktif.
   - Manajemen Lisensi: Suspend, Resume, dan **Unbind / Reset HWID** jika customer berganti perangkat.
   - Generator Serial Key Manual.
   - Simulator Pengujian Aktivasi Klien (`POST /api/licenses/activate`).

---

## 🛠️ Arsitektur & Teknologi

* **Backend**: Node.js + Express.js + REST API + JWT Authentication
* **Database**: SQLite (`server/data/pintarlabs_store.db`)
* **Frontend**: React + Vite + Tailwind CSS + Lucide Icons (100% Responsive Desktop & Android)
* **License Compatibility**: Format & payload selaras dengan `pintarlabs_license_platform` Go Backend.

---

## 💻 Cara Menjalankan di Lokal (Development)

### 1. Jalankan Backend Server (Port 5000)
```bash
cd server
npm start
```
Server akan berjalan di `http://localhost:5000` (API di `http://localhost:5000/api`).

### 2. Jalankan Frontend Client (Port 3000)
```bash
cd client
npm run dev
```
Buka browser di `http://localhost:3000`.

### Akun Admin Default:
* **Email**: `admin@pintarlabs.id`
* **Password**: `admin123`

---

## 🌐 Panduan Deploy ke VPS Nginx + PM2

1. **Build Frontend**:
   ```bash
   cd client
   npm run build
   ```
   File hasil build akan berada di `client/dist`.

2. **Jalankan Backend dengan PM2**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

3. **Konfigurasi Nginx**:
   Salin konfigurasi dari `nginx.conf.example` ke `/etc/nginx/sites-available/store.pintarlabs.id`, lalu buat symlink ke `sites-enabled` dan reload Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/store.pintarlabs.id /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```
4. **Pasang SSL Gratis (Certbot)**:
   ```bash
   sudo certbot --nginx -d store.pintarlabs.id
   ```
