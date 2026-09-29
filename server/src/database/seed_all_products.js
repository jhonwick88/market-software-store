const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('./db');
const { initSchema } = require('./schema');

async function seedAllProducts() {
  console.log('--- Seeding & Updating All 10 PintarLabs Products with 3D Promo Banners ---');
  await initSchema();

  const allProducts = [
    {
      id: 'prod-pintar-pos',
      product_code: 'POS',
      category_id: 'cat-pos',
      slug: 'pintarpos-resto-retail',
      name: 'PintarPOS Resto & Retail Ultimate',
      tagline: 'Software Kasir Cepat, 100% Offline Tanpa Internet & Sistem Rekonsiliasi Kas Anti-Bocor',
      description: `🚀 APLIKASI KASIR PINTAR (POINT OF SALE) MODERN 100% OFFLINE!

PintarPOS dirancang khusus untuk toko retail, minimarket, restoran, kafe, apotek, dan UMKM.

🌟 KEUNGGULAN UTAMA:
1. 100% Bebas Kuota & Internet (Offline-Ready)
Semua transaksi kasir, scan barcode, cetak nota struk, hingga sinkronisasi multi-device berjalan mulus di jaringan lokal Wi-Fi toko Anda tanpa membutuhkan koneksi internet.

2. Sistem Rekonsiliasi Kas Laci (Anti-Bocor & Anti-Tekor)
Setiap pergantian shift atau saat tutup toko, kasir cukup menginput jumlah uang fisik di laci. Sistem akan langsung memvalidasi dengan perhitungan omset & kas keluar secara akurat.

3. Sinkronisasi Multi-Device Jaringan Lokal (LAN / Wi-Fi)
Hubungkan Komputer PC kasir utama dengan Tablet / HP Android waiter secara instan tanpa lag.

4. Beli 1x Pakai Seumur Hidup (Lifetime License)
Bebas biaya langganan bulanan atau tahunan tanpa potongan komisi per transaksi.`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11, RAM 4GB', android: 'Android 8.0+, RAM 2GB' },
      hardware_compat: ['Printer Thermal 58mm & 80mm USB/Bluetooth/LAN', 'Barcode Scanner 1D/2D', 'Cash Drawer RJ11'],
      version: 'v3.5.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 348,
      rating: 4.95,
      review_count: 194,
      windows_installer_url: 'https://downloads.pintarlabs.id/pos/PintarPOS_Setup_v3.5.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/pos/PintarPOS_v3.5.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/pos/Panduan_Lengkap_PintarPOS.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/pos/PintarPOS_Demo_Trial.exe',
      thumbnail_url: '/images/promos/pintarpos_promo_banner.jpg',
      plans: [
        {
          id: 'plan-pos-basic',
          code: 'BASIC',
          name: 'Paket Single Outlet (1 PC + 1 HP Kasir)',
          price: 499000,
          original_price: 750000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 1 },
          deliverables: ['Installer Windows (.exe)', 'Aplikasi Android (.apk)', 'Serial Key Aktivasi', 'PDF Panduan', 'Support 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 0
        },
        {
          id: 'plan-pos-pro',
          code: 'PRO',
          name: 'Paket Multi-Device Pro (2 PC + 5 HP Waiter/Kasir)',
          price: 899000,
          original_price: 1350000,
          billing_type: 'lifetime',
          device_limit: { windows: 2, android: 5 },
          deliverables: ['Installer Windows (.exe)', 'Aplikasi Android (.apk)', 'Serial Key Multi-Device', 'Bantuan Remote Install', 'Support Prioritas 1 Tahun'],
          support_duration: 'Support Prioritas 1 Tahun',
          is_popular: 1
        }
      ]
    },
    {
      id: 'prod-bell-pintar',
      product_code: 'BELL',
      category_id: 'cat-school',
      slug: 'bell-pintar-sekolah-otomatis',
      name: 'Bell Pintar - Aplikasi Bel Sekolah Otomatis & Jadwal Alarm Cerdas',
      tagline: 'Bel Sekolah Otomatis Akurat Per Detik, 100% Offline LAN & Kendali Jarak Jauh dari HP Guru Piket',
      description: `🔔 TINGGALKAN BEL MANUAL JADUL. BERALIH KE BELL PINTAR OTOMATIS & CERDAS!

Bell Pintar adalah software bel sekolah otomatis generasi modern berbasis Local-First yang dirancang khusus untuk SD, MI, SMP, MTs, SMA, MA, SMK, Lembaga Kursus, dan Pondok Pesantren di seluruh Indonesia.

🏫 MENGAPA SEKOLAH ANDA MEMBUTUHKAN BELL PINTAR?
1. 100% Otomatis & Presisi Per Detik
2. Kendali Jarak Jauh dari HP Guru Piket (PIN Guru Piket 432234 & Admin 741147)
3. 119+ Nada Suara Studio 3 Bahasa (ID, EN, AR)
4. Studio Pengumuman Text-to-Speech (TTS)
5. 100% Offline LAN Tanpa Kuota
6. Lisensi Lifetime Beli Sekali Pakai Selamanya`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB', android: 'Android 7.0+, RAM 1GB' },
      hardware_compat: ['Amplifier / Speaker Sekolah (Jack 3.5mm/RCA)', 'PC Komputer Tata Usaha', 'HP Android Guru Piket'],
      version: 'v2.2.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 215,
      rating: 4.96,
      review_count: 87,
      windows_installer_url: 'https://downloads.pintarlabs.id/bell/BellPintar_Setup_v2.2.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/bell/BellPintar_GuruPiket.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/bell/Buku_Panduan_Bell_Pintar.pdf',
      video_tutorial_url: 'https://www.youtube.com/watch?v=Vxq-tjmUjZg',
      trial_download_url: 'https://downloads.pintarlabs.id/bell/BellPintar_Demo_Trial.exe',
      thumbnail_url: '/images/bellpintar/thumbnail_youtube_bell_pintar.jpg',
      plans: [
        {
          id: 'plan-bell-basic',
          code: 'BASIC',
          name: 'Paket Basic Sekolah (1 PC TU)',
          price: 175000,
          original_price: 350000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 1 },
          deliverables: ['1 Lisensi PC Desktop Permanen', 'Jadwal Bel Alarm Tanpa Batas', 'Paket Audio Nada Standar 3 Bahasa', 'PDF Panduan', 'Support 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 0
        },
        {
          id: 'plan-bell-pro',
          code: 'PRO',
          name: 'Paket PRO Enterprise (1 PC TU + 3 HP Guru)',
          price: 350000,
          original_price: 700000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 3 },
          deliverables: ['1 Lisensi Server PC Utama', 'Remote hingga 3 HP Guru Piket', '119+ Audio Studio HD', 'Studio Pengumuman TTS', 'Support Prioritas 1 Tahun'],
          support_duration: 'Support Prioritas 1 Tahun',
          is_popular: 1
        }
      ]
    },
    {
      id: 'prod-pintar-attend',
      product_code: 'ATTEND',
      category_id: 'cat-tools',
      slug: 'pintarattend-absensi-biometrik-gps',
      name: 'PintarAttend - Absensi Wajah Biometrik & GPS Geofencing',
      tagline: 'Presensi Karyawan Anti-Titip Absen, Deteksi Wajah AI & Radius Lokasi Kantor Akurat',
      description: `👤 SISTEM ABSENSI BIOMETRIK WAJAH & GPS RADAR MODERN

PintarAttend adalah solusi absensi digital cerdas untuk kantor, pabrik, sekolah, dan pekerja lapangan dengan akurasi biometrik tinggi.

✨ FITUR UNGGULAN:
1. AI Face Recognition: Deteksi wajah asli dalam hitungan 0.5 detik, anti-spoofing foto/video.
2. GPS Geofencing: Hanya bisa absen di dalam radius koordinat kantor yang telah ditentukan.
3. Rekap Otomatis Laporan & Gaji: Hitung jam kerja, lembur, keterlambatan, dan ekspor ke Excel/PDF 1-klik.
4. Mode Kiosk Tablet & HP Pegawai: Bisa dijadikan mesin absensi bersama di pintu masuk atau di HP masing-masing pegawai.`,
      platforms: ['windows', 'android', 'web-cloud'],
      min_requirements: { windows: 'Windows 10/11', android: 'Android 8.0+' },
      hardware_compat: ['Webcam USB HD / Kamera HP Android', 'Tablet Wall Mount', 'Fingerprint Reader USB (Optional)'],
      version: 'v2.0.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 142,
      rating: 4.93,
      review_count: 46,
      windows_installer_url: 'https://downloads.pintarlabs.id/attend/PintarAttend_Setup.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/attend/PintarAttend_Mobile.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/attend/Panduan_PintarAttend.pdf',
      video_tutorial_url: 'https://youtube.com/playlist?list=pintarattend_tutorial',
      trial_download_url: 'https://downloads.pintarlabs.id/attend/PintarAttend_Trial.exe',
      thumbnail_url: '/images/promos/biometric_attend_promo_banner.jpg',
      plans: [
        {
          id: 'plan-attend-std',
          code: 'STD',
          name: 'Paket Kantor Tunggal (Hingga 50 Karyawan)',
          price: 450000,
          original_price: 700000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 50 },
          deliverables: ['Dashboard Admin Windows', 'Aplikasi Mobile Absensi', 'Face ID AI Engine', 'PDF Panduan', 'Support 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 1
        },
        {
          id: 'plan-attend-pro',
          code: 'PRO',
          name: 'Paket Enterprise Multi-Cabang (Unlimited Karyawan)',
          price: 850000,
          original_price: 1300000,
          billing_type: 'lifetime',
          device_limit: { windows: 3, android: 999 },
          deliverables: ['Multi-Cabang Geofencing', 'Payroll Integration', 'Export Excel/PDF', 'Support 1 Tahun'],
          support_duration: 'Support Prioritas 1 Tahun',
          is_popular: 0
        }
      ]
    },
    {
      id: 'prod-pintar-bus',
      product_code: 'BUS',
      category_id: 'cat-pos',
      slug: 'pintarbus-tiket-denah-kursi',
      name: 'PintarBus - Sistem Tiket & Denah Kursi Bus Travel',
      tagline: 'Manajemen Reservasi Tiket Bus, Layout Kursi Interaktif 2+2/2+1 & Cetak Tiket QR Barcode',
      description: `🚌 SOFTWARE TICKETING & FLEET MANAGEMENT BUS PARIWISATA & TRAVEL

PintarBus membantu operator bus dan agen travel mengelola pemesanan tiket, denah kursi penumpang, manifest keberangkatan, dan komisi agen secara transparan.

✨ FITUR UNGGULAN:
1. Denah Kursi Interaktif (Interactive Seat Map): Kustomisasi layout kursi bus (2+2, 2+1, Sleeper Bus) dengan status real-time (Kosong, Terisi, Terkunci).
2. Cetak Tiket Thermal & E-Tiket WhatsApp: Cetak tiket fisik di loket kasir atau kirim tiket digital via WhatsApp.
3. Manifest Penumpang & Drop Point: Daftar resmi penumpang per titik jemput dan turun.
4. Laporan Pendapatan Armada: Rekap omset per rute, per bus, dan per supir/kondektur.`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11', android: 'Android 8.0+' },
      hardware_compat: ['Printer Thermal 58mm/80mm', 'Barcode/QR Scanner Tiket'],
      version: 'v1.9.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 118,
      rating: 4.91,
      review_count: 38,
      windows_installer_url: 'https://downloads.pintarlabs.id/bus/PintarBus_Setup.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/bus/PintarBus_Agen.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/bus/Panduan_PintarBus.pdf',
      video_tutorial_url: 'https://youtube.com/playlist?list=pintarbus_tutorial',
      trial_download_url: 'https://downloads.pintarlabs.id/bus/PintarBus_Trial.exe',
      thumbnail_url: '/images/promos/bus_seating_promo_banner.jpg',
      plans: [
        {
          id: 'plan-bus-std',
          code: 'STD',
          name: 'Paket Agen Tunggal (1 Loket / Pool Bus)',
          price: 550000,
          original_price: 850000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 2 },
          deliverables: ['Software Loket Windows', 'Modul Denah Kursi', 'Format Tiket Thermal', 'PDF Panduan', 'Support 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 1
        },
        {
          id: 'plan-bus-pro',
          code: 'PRO',
          name: 'Paket Multi-Agen & Armada Lengkap',
          price: 950000,
          original_price: 1500000,
          billing_type: 'lifetime',
          device_limit: { windows: 3, android: 10 },
          deliverables: ['Multi-Agen Booking', 'Aplikasi Android Kondektur', 'Manifest Penumpang', 'Support 1 Tahun'],
          support_duration: 'Support Prioritas 1 Tahun',
          is_popular: 0
        }
      ]
    },
    {
      id: 'prod-sipintar-desa',
      product_code: 'DESA',
      category_id: 'cat-tools',
      slug: 'sipintar-surat-desa-kependudukan',
      name: 'SiPintar - Sistem Pelayanan Surat Desa & Kependudukan',
      tagline: 'Cetak Surat Pengantar KTP, SKU, Domisili Kilat 1-Klik dengan Verifikasi QR TTE',
      description: `🏛️ APLIKASI ADMINISTRASI & PELAYANAN SURAT DESA / KELURAHAN DIGITAL

SiPintar mempercepat pelayanan kantor kepala desa dan kelurahan dalam mencetak dokumen kependudukan warga secara rapi, cepat, dan standar nasional.

✨ FITUR UNGGULAN:
1. 30+ Template Surat Resmi: Surat Keterangan Usaha (SKU), Domisili, Tidak Mampu (SKTM), Pengantar Nikah (N1-N4), Kematian, dan Kelahiran.
2. QR Code Verifikasi TTE: Surat dilengkapi QR Code anti-pemalsuan yang dapat discan untuk memvalidasi keaslian tanda tangan Kepala Desa.
3. Database Kependudukan (KK & NIK): Pencarian data warga instan via NIK atau Nama tanpa perlu ketik ulang data manual.
4. Laporan Statistik Penduduk: Grafik demografi jenis kelamin, pekerjaan, dan piramida usia otomatis.`,
      platforms: ['windows', 'web-cloud'],
      min_requirements: { windows: 'Windows 10/11, RAM 4GB' },
      hardware_compat: ['Printer Inkjet/Laserjet A4 & F4', 'Barcode Scanner e-KTP'],
      version: 'v2.5.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 86,
      rating: 4.94,
      review_count: 29,
      windows_installer_url: 'https://downloads.pintarlabs.id/desa/SiPintarDesa_Setup.exe',
      android_apk_url: '',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/desa/Panduan_SiPintarDesa.pdf',
      video_tutorial_url: 'https://youtube.com/playlist?list=sipintardesa_tutorial',
      trial_download_url: 'https://downloads.pintarlabs.id/desa/SiPintarDesa_Trial.exe',
      thumbnail_url: '/images/promos/sipintar_desa_promo_banner.jpg',
      plans: [
        {
          id: 'plan-desa-std',
          code: 'STD',
          name: 'Paket Desa Mandiri (1 Komputer Pelayanan Balai Desa)',
          price: 750000,
          original_price: 1200000,
          billing_type: 'lifetime',
          device_limit: { windows: 1 },
          deliverables: ['Installer Windows SiPintar', '30+ Template Surat', 'Kop Surat & Logo Desa Custom', 'PDF Panduan', 'Support 1 Tahun'],
          support_duration: 'Support 1 Tahun',
          is_popular: 1
        }
      ]
    },
    {
      id: 'prod-pintar-retribusi',
      product_code: 'RETRIBUSI',
      category_id: 'cat-pos',
      slug: 'pintarretribusi-pasar-parkir-digital',
      name: 'PintarRetribusi - Scan Retribusi Pasar & Parkir Digital POS',
      tagline: 'Penarikan Retribusi Lapak Pedagang & Karcis Parkir via Handheld POS Android & Cetak Struk',
      description: `🏪 SISTEM PENARIKAN RETRIBUSI PASAR, KIOS & PARKIR DIGITAL

PintarRetribusi adalah aplikasi kasir mobile untuk petugas pasar dan pengelola parkir dalam memungut retribusi harian secara transparan dan anti-bocor.

✨ FITUR UNGGULAN:
1. Scan QR Code Lapak Pedagang: Petugas cukup scan kartu QR di kios pedagang untuk input tagihan harian.
2. Cetak Struk Karcis Instan: Terhubung langsung ke mini printer thermal bluetooth di pinggang petugas.
3. Multi-Metode Bayar: Tunai atau scan QRIS langsung di layar HP petugas.
4. Laporan Rekapitulasi Real-Time: Koordinator pasar memantau total setoran per petugas dan riwayat pedagang yang menunggak.`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11', android: 'Android 8.0+' },
      hardware_compat: ['Printer Thermal Bluetooth 58mm Portable', 'Smartphone / Android POS Handheld Terminal'],
      version: 'v1.6.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 64,
      rating: 4.89,
      review_count: 19,
      windows_installer_url: 'https://downloads.pintarlabs.id/retribusi/PintarRetribusi_Setup.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/retribusi/PintarRetribusi_Petugas.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/retribusi/Panduan_PintarRetribusi.pdf',
      video_tutorial_url: 'https://youtube.com/playlist?list=retribusi_tutorial',
      trial_download_url: 'https://downloads.pintarlabs.id/retribusi/PintarRetribusi_Trial.exe',
      thumbnail_url: '/images/promos/retribusi_scanner_promo_banner.jpg',
      plans: [
        {
          id: 'plan-retribusi-std',
          code: 'STD',
          name: 'Paket 1 Pengelola Pasar (1 PC Admin + 3 HP Petugas)',
          price: 480000,
          original_price: 750000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 3 },
          deliverables: ['Dashboard Admin Windows', 'Aplikasi Android Petugas', 'Format Struk Retribusi', 'PDF Panduan', 'Support 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 1
        }
      ]
    },
    {
      id: 'prod-wifipay-mikrotik',
      product_code: 'WIFIPAY',
      category_id: 'cat-tools',
      slug: 'wifipay-billing-mikrotik-qris',
      name: 'WifiPay - Billing Hotspot MikroTik & Voucher QRIS Otomatis',
      tagline: 'Jual Voucher Wi-Fi Otomatis Beli Sendiri via QRIS & Cetak Struk Hotspot MikroTik',
      description: `📡 SISTEM BILLING VOUCHER INTERNET MIKROTIK OTOMATIS & RT-RW NET

WifiPay memudahkan pemilik kafe, warkop, kos-kosan, dan pengusaha RT-RW Net menjual paket internet hotspot MikroTik secara mandiri 24 jam tanpa perlu dijaga kasir.

✨ FITUR UNGGULAN:
1. Beli Voucher Mandiri via QRIS: Pelanggan scan QRIS di captive portal login, voucher langsung aktif otomatis setelah pembayaran berhasil.
2. Generator Voucher Massal: Cetak ribuan voucher dengan kode unik, batas waktu (1 Jam, 1 Hari, 1 Bulan), dan kecepatan bandwidth.
3. Integrasi MikroTik RouterOS API: Kompatibel dengan RB750Gr3, RB450Gx4, CCR, dan semua seri RouterBOARD MikroTik.
4. Laporan Penjualan Real-time: Pantau omset penjualan voucher per hari dan jumlah pengguna aktif.`,
      platforms: ['windows', 'web-cloud'],
      min_requirements: { windows: 'Windows 10/11 / Linux', mikrotik: 'RouterOS v6 / v7' },
      hardware_compat: ['MikroTik RouterBOARD (Semua Seri)', 'Printer Thermal 58mm'],
      version: 'v2.3.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 165,
      rating: 4.95,
      review_count: 53,
      windows_installer_url: 'https://downloads.pintarlabs.id/wifipay/WifiPay_Setup.exe',
      android_apk_url: '',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/wifipay/Panduan_WifiPay.pdf',
      video_tutorial_url: 'https://youtube.com/playlist?list=wifipay_tutorial',
      trial_download_url: 'https://downloads.pintarlabs.id/wifipay/WifiPay_Trial.exe',
      thumbnail_url: '/images/promos/wifipay_mikrotik_promo_banner.jpg',
      plans: [
        {
          id: 'plan-wifipay-std',
          code: 'STD',
          name: 'Paket Hotspot Kafe / Kosan (1 Router MikroTik)',
          price: 350000,
          original_price: 550000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, mikrotik: 1 },
          deliverables: ['Software Billing WifiPay', 'Template Captive Portal Responsif', 'Voucher Generator Tool', 'PDF Panduan', 'Support 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 1
        },
        {
          id: 'plan-wifipay-pro',
          code: 'PRO',
          name: 'Paket RT-RW Net ISP (Multi-Router & Auto QRIS Gateway)',
          price: 650000,
          original_price: 990000,
          billing_type: 'lifetime',
          device_limit: { windows: 2, mikrotik: 5 },
          deliverables: ['Multi-RouterOS Sync', 'Payment Gateway QRIS Terintegrasi', 'SMS/WhatsApp Notifikasi', 'Support 1 Tahun'],
          support_duration: 'Support Prioritas 1 Tahun',
          is_popular: 0
        }
      ]
    },
    {
      id: 'prod-pintar-stock',
      product_code: 'STOCK',
      category_id: 'cat-stock',
      slug: 'pintarstock-inventory-warehouse',
      name: 'PintarStock - Manajemen Stok & Multi-Gudang',
      tagline: 'Sistem Inventori, Mutasi Antar Gudang & Opname Barcode Android',
      description: `📦 MANAJEMEN STOK GUDANG & INVENTORI BARCODE CEPAT

Solusi inventori profesional untuk distributor, grosir, dan toko dengan banyak gudang.

✨ FITUR UNGGULAN:
1. Stok Opname Kamera HP Android: Cukup scan barcode rak barang langsung mencocokkan stok fisik vs sistem.
2. Pencatatan Multi Gudang: Pantau stok di Gudang Utama, Gudang Toko, atau Gudang Retur.
3. Generator Label Barcode: Buat dan cetak stiker barcode produk sendiri dengan printer thermal label.`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11', android: 'Android 8.0+' },
      hardware_compat: ['Barcode Scanner Wireless', 'Thermal Barcode Label Printer'],
      version: 'v2.4.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 92,
      rating: 4.88,
      review_count: 18,
      windows_installer_url: 'https://downloads.pintarlabs.id/stock/PintarStock_Setup.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/stock/PintarStock_Scanner.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/stock/Panduan_PintarStock.pdf',
      video_tutorial_url: 'https://youtube.com/playlist?list=pintarstock_tutorial',
      trial_download_url: 'https://downloads.pintarlabs.id/stock/PintarStock_Trial.exe',
      thumbnail_url: '/images/promos/pintarstock_promo_banner.jpg',
      plans: [
        {
          id: 'plan-stock-std',
          code: 'STD',
          name: 'Paket Standard (1 PC Gudang + 2 HP Scanner)',
          price: 550000,
          original_price: 800000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 2 },
          deliverables: ['Installer Windows (.exe)', 'APK Scanner Barcode', 'Serial Key', 'PDF Panduan', 'Support 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 1
        }
      ]
    },
    {
      id: 'prod-pintar-school',
      product_code: 'SCHOOL',
      category_id: 'cat-school',
      slug: 'pintarschool-spp-akademik',
      name: 'PintarSchool - Sistem Pembayaran SPP & Absensi Siswa',
      tagline: 'Kelola SPP, Notifikasi WhatsApp Tagihan & Kartu Pembayaran Digital',
      description: `🎓 APLIKASI SPP & KEUANGAN SEKOLAH TERPADU

Memudahkan bendahara mencatat tagihan SPP, uang gedung, seragam, dan kirim bukti kwitansi otomatis ke WhatsApp orang tua.

✨ FITUR UNGGULAN:
1. Cetak Kwitansi SPP 1-Detik
2. Broadcast WhatsApp Tagihan Orang Tua
3. Laporan Kas Masuk & Tunggakan Siswa`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11', android: 'Android 8.0+' },
      hardware_compat: ['Printer Thermal 58mm / Dot Matrix Epson', 'Barcode Scanner Kartu Siswa'],
      version: 'v2.1.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 58,
      rating: 4.92,
      review_count: 14,
      windows_installer_url: 'https://downloads.pintarlabs.id/school/PintarSchool_Setup.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/school/PintarSchool_Parent.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/school/Panduan_PintarSchool.pdf',
      video_tutorial_url: 'https://youtube.com/playlist?list=pintarschool_tutorial',
      trial_download_url: 'https://downloads.pintarlabs.id/school/PintarSchool_Trial.exe',
      thumbnail_url: '/images/promos/pintarschool_promo_banner.jpg',
      plans: [
        {
          id: 'plan-school-std',
          code: 'STD',
          name: 'Paket Sekolah Mandiri (1 PC Tata Usaha)',
          price: 650000,
          original_price: 950000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 2 },
          deliverables: ['Installer Windows (.exe)', 'Template Kwitansi SPP', 'Serial Key', 'PDF Panduan', 'Support 1 Tahun'],
          support_duration: 'Support 1 Tahun',
          is_popular: 1
        }
      ]
    },
    {
      id: 'prod-pintar-finance',
      product_code: 'FINANCE',
      category_id: 'cat-finance',
      slug: 'pintarinvoice-keuangan-usaha',
      name: 'PintarInvoice & Kas Keuangan UKM',
      tagline: 'Pembuat Faktur Profesional, Buku Kas & Laporan Laba Rugi Otomatis',
      description: `📑 PEMBUAT FAKTUR / INVOICE PROFESIONAL & BUKU KAS UKM

Aplikasi pembukuan simpel dan elegan untuk pemilik usaha dagang dan jasa. Buat faktur/invoice PDF berlogo profesional, lacak piutang pelanggan, dan catat kas operasional harian.

✨ FITUR UNGGULAN:
1. Desain Faktur PDF dengan Logo & QRIS
2. Buku Kas Masuk, Keluar & Piutang Jatuh Tempo
3. Laporan Laba/Rugi Bulanan Otomatis`,
      platforms: ['windows', 'web-cloud'],
      min_requirements: { windows: 'Windows 10/11' },
      hardware_compat: ['Printer Inkjet / Laserjet A4 & F4'],
      version: 'v1.8.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 73,
      rating: 4.85,
      review_count: 11,
      windows_installer_url: 'https://downloads.pintarlabs.id/finance/PintarInvoice_Setup.exe',
      android_apk_url: '',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/finance/Panduan_PintarInvoice.pdf',
      video_tutorial_url: 'https://youtube.com/playlist?list=pintarinvoice_tutorial',
      trial_download_url: 'https://downloads.pintarlabs.id/finance/PintarInvoice_Trial.exe',
      thumbnail_url: '/images/promos/pintarinvoice_promo_banner.jpg',
      plans: [
        {
          id: 'plan-finance-std',
          code: 'STD',
          name: 'Paket Lisensi Permanen (1 PC)',
          price: 399000,
          original_price: 550000,
          billing_type: 'lifetime',
          device_limit: { windows: 1 },
          deliverables: ['Installer Windows (.exe)', 'Custom Logo Template', 'Serial Key', 'PDF Panduan', 'Support 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 1
        }
      ]
    }
  ];

  for (const prod of allProducts) {
    const existing = await dbAsync.get('SELECT id FROM products WHERE id = ?', [prod.id]);
    if (existing) {
      await dbAsync.run(
        `UPDATE products SET 
          product_code = ?, category_id = ?, slug = ?, name = ?, tagline = ?, description = ?,
          platforms = ?, min_requirements = ?, hardware_compat = ?, version = ?,
          trial_download_url = ?, windows_installer_url = ?, android_apk_url = ?,
          user_manual_pdf_url = ?, video_tutorial_url = ?, is_published = ?, is_featured = ?,
          sales_count = ?, rating = ?, review_count = ?
         WHERE id = ?`,
        [
          prod.product_code, prod.category_id, prod.slug, prod.name, prod.tagline, prod.description,
          JSON.stringify(prod.platforms), JSON.stringify(prod.min_requirements), JSON.stringify(prod.hardware_compat),
          prod.version, prod.trial_download_url, prod.windows_installer_url, prod.android_apk_url,
          prod.user_manual_pdf_url, prod.video_tutorial_url, prod.is_published, prod.is_featured,
          prod.sales_count, prod.rating, prod.review_count, prod.id
        ]
      );
    } else {
      await dbAsync.run(
        `INSERT INTO products (
          id, product_code, category_id, slug, name, tagline, description,
          platforms, min_requirements, hardware_compat, version,
          trial_download_url, windows_installer_url, android_apk_url,
          user_manual_pdf_url, video_tutorial_url, is_published, is_featured,
          sales_count, rating, review_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.id, prod.product_code, prod.category_id, prod.slug, prod.name, prod.tagline, prod.description,
          JSON.stringify(prod.platforms), JSON.stringify(prod.min_requirements), JSON.stringify(prod.hardware_compat),
          prod.version, prod.trial_download_url, prod.windows_installer_url, prod.android_apk_url,
          prod.user_manual_pdf_url, prod.video_tutorial_url, prod.is_published, prod.is_featured,
          prod.sales_count, prod.rating, prod.review_count
        ]
      );
    }

    // Upsert Plans
    for (const pl of prod.plans) {
      const plExists = await dbAsync.get('SELECT id FROM plans WHERE id = ?', [pl.id]);
      if (plExists) {
        await dbAsync.run(
          `UPDATE plans SET 
            code = ?, name = ?, price = ?, original_price = ?, billing_type = ?,
            device_limit = ?, deliverables = ?, support_duration = ?, is_popular = ?
           WHERE id = ?`,
          [
            pl.code, pl.name, pl.price, pl.original_price, pl.billing_type,
            JSON.stringify(pl.device_limit), JSON.stringify(pl.deliverables),
            pl.support_duration, pl.is_popular, pl.id
          ]
        );
      } else {
        await dbAsync.run(
          `INSERT INTO plans (
            id, product_id, code, name, description, price, original_price,
            billing_type, device_limit, deliverables, support_duration, is_popular
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            pl.id, prod.id, pl.code, pl.name, pl.description || '', pl.price, pl.original_price,
            pl.billing_type, JSON.stringify(pl.device_limit), JSON.stringify(pl.deliverables),
            pl.support_duration, pl.is_popular
          ]
        );
      }
    }

    // Upsert Thumbnail
    const existingThumb = await dbAsync.get(
      'SELECT id FROM product_media WHERE product_id = ? AND sort_order = 1',
      [prod.id]
    );
    if (existingThumb) {
      await dbAsync.run(
        'UPDATE product_media SET url = ?, caption = ?, type = ? WHERE id = ?',
        [prod.thumbnail_url, prod.name, 'thumbnail', existingThumb.id]
      );
    } else {
      await dbAsync.run(
        'INSERT INTO product_media (id, product_id, type, url, caption, sort_order) VALUES (?, ?, ?, ?, ?, 1)',
        [uuidv4(), prod.id, 'thumbnail', prod.thumbnail_url, prod.name]
      );
    }

    console.log(`✅ Synced product: ${prod.name} -> ${prod.thumbnail_url}`);
  }

  console.log('🎉 All 10 PintarLabs software products successfully seeded and updated with 3D commercial banners!');
}

seedAllProducts().then(() => process.exit(0)).catch(err => {
  console.error('Error seeding products:', err);
  process.exit(1);
});
