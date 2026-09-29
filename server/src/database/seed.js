const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('./db');
const { initSchema } = require('./schema');
const { generateLicenseKey } = require('../services/licenseGenerator');

async function seedDatabase() {
  console.log('Seeding PintarLabs Database...');
  await initSchema();

  const adminEmail = 'admin@pintarlabs.id';
  const existingAdmin = await dbAsync.get('SELECT * FROM users WHERE email = ?', [adminEmail]);
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    await dbAsync.run(
      'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), 'Admin PintarLabs', adminEmail, hash, 'admin', '081234567890']
    );
    console.log('Default Admin created: admin@pintarlabs.id / admin123');
  }

  const categories = [
    { id: 'cat-pos', slug: 'kasir-pos', name: 'Aplikasi Kasir & POS', icon: 'Store', description: 'Software kasir siap pakai untuk toko retail, resto, kafe, minimarket' },
    { id: 'cat-stock', slug: 'manajemen-stok', name: 'Inventori & Multi-Gudang', icon: 'Boxes', description: 'Sistem pencatatan stok barang, barcode scanner, mutasi gudang' },
    { id: 'cat-finance', slug: 'akuntansi-keuangan', name: 'Akuntansi & Keuangan', icon: 'Calculator', description: 'Pencatatan kas masuk/keluar, buku besar, laba rugi, faktur' },
    { id: 'cat-school', slug: 'sistem-sekolah', name: 'Sistem Sekolah & SPP', icon: 'GraduationCap', description: 'Manajemen tagihan SPP, absensi siswa, portal wali murid' },
    { id: 'cat-tools', slug: 'utilitas-tools', name: 'Tools & Otomasi Bisnis', icon: 'Cpu', description: 'Software utilitas, broadcast WhatsApp, converter faktur' }
  ];

  for (const cat of categories) {
    const exists = await dbAsync.get('SELECT id FROM categories WHERE id = ?', [cat.id]);
    if (!exists) {
      await dbAsync.run(
        'INSERT INTO categories (id, slug, name, icon, description) VALUES (?, ?, ?, ?, ?)',
        [cat.id, cat.slug, cat.name, cat.icon, cat.description]
      );
    }
  }

  const products = [
    {
      id: 'prod-pintar-pos',
      product_code: 'POS',
      category_id: 'cat-pos',
      slug: 'pintarpos-resto-retail',
      name: 'PintarPOS Resto & Retail Ultimate',
      tagline: 'Software Kasir Cepat, 100% Offline Tanpa Internet & Sistem Rekonsiliasi Kas Anti-Bocor',
      description: 'PintarPOS adalah aplikasi kasir pintar (Point of Sale) modern berbasis Local-First yang dirancang khusus untuk toko retail, minimarket, restoran, kafe, apotek, dan UMKM.\n\n🚀 KEUNGGULAN UTAMA PINTARPOS:\n1. 100% Bebas Kuota & Internet (Offline-Ready)\nSemua proses transaksi kasir, scan barcode, cetak nota struk, hingga sinkronisasi multi-device berjalan mulus di jaringan lokal Wi-Fi toko Anda tanpa membutuhkan koneksi internet atau kuota data sama sekali.\n\n2. Sistem Rekonsiliasi Kas Laci (Anti-Bocor & Anti-Tekor)\nSetiap pergantian shift atau saat tutup toko, kasir cukup menginput jumlah uang fisik yang ada di laci. Sistem akan langsung memvalidasi dan mencocokkannya dengan perhitungan omset & pengeluaran kas (petty cash) sehingga selisih kas langsung terdeteksi seketika.\n\n3. Sinkronisasi Multi-Device Jaringan Lokal (LAN / Wi-Fi)\nHubungkan Komputer PC kasir utama dengan Tablet / HP Android pelayan (waiter) secara instan tanpa lag. Pesanan dari meja customer langsung tercatat dan dapat dicetak ke printer dapur.\n\n4. Beli 1x Pakai Seumur Hidup (Lifetime License)\nBebas biaya langganan bulanan atau tahunan. 100% keuntungan penjualan toko adalah milik Anda tanpa potongan komisi per transaksi.\n\n5. Cetak Struk Cepat & Fleksibel\nKompatibel dengan semua merk printer thermal 58mm & 80mm (USB, Bluetooth, LAN). Dilengkapi opsi cetak rangkap, custom header/footer nota, dan auto cash drawer kick (buka laci otomatis).\n\n6. Manajemen Inventori & Peringatan Stok Menipis\nPencatatan stok otomatis berkurang saat transaksi, histori mutasi barang, input barcode massal, dan notifikasi saat barang hampir habis.',
      platforms: ['windows', 'android'],
      min_requirements: {
        windows: 'Windows 10/11 64-bit, RAM 4GB, Storage 500MB',
        android: 'Android 8.0 (Oreo) ke atas, RAM 2GB'
      },
      hardware_compat: [
        'Printer Thermal 58mm & 80mm (Bluetooth / USB / LAN)',
        'Barcode Scanner 1D & 2D QR Code',
        'Laci Uang Otomatis (Cash Drawer RJ11)',
        'Komputer PC Windows / Laptop',
        'Smartphone & Tablet Android (Multi-Device)'
      ],
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
      plans: [
        {
          id: 'plan-pos-basic',
          code: 'BASIC',
          name: 'Paket Single Outlet (1 PC + 1 HP Kasir)',
          description: 'Cocok untuk toko atau kafe tunggal yang membutuhkan sistem kasir cepat dan mandiri.',
          price: 499000,
          original_price: 750000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 1 },
          deliverables: ['Installer Windows (.exe)', 'Aplikasi Android (.apk)', 'Serial Key Aktivasi', 'E-Book Panduan PDF', 'Video Tutorial', 'Garansi Teknis 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 0
        },
        {
          id: 'plan-pos-pro',
          code: 'PRO',
          name: 'Paket Multi-Device Pro (2 PC + 5 HP Waiter/Kasir)',
          description: 'Paling diminati! Cocok untuk resto sibuk dengan kasir utama di PC dan pelayan pesan via HP.',
          price: 899000,
          original_price: 1350000,
          billing_type: 'lifetime',
          device_limit: { windows: 2, android: 5 },
          deliverables: ['Installer Windows (.exe)', 'Aplikasi Android (.apk)', 'Serial Key Multi-Device', 'E-Book Panduan PDF', 'Video Tutorial Lengkap', 'Bantuan Remote Install (AnyDesk)', 'Support Prioritas 1 Tahun'],
          support_duration: 'Support Prioritas 1 Tahun',
          is_popular: 1
        },
        {
          id: 'plan-pos-enterprise',
          code: 'ENT',
          name: 'Paket Multi-Cabang Enterprise (Unlimited Devices)',
          description: 'Untuk bisnis dengan banyak cabang atau franchise yang butuh rekap data terpusat.',
          price: 1750000,
          original_price: 2500000,
          billing_type: 'lifetime',
          device_limit: { windows: 10, android: 25 },
          deliverables: ['Installer Windows & APK', 'Serial Key Enterprise', 'Modul Server Multi-Cabang', 'Panduan Administrator', 'VIP Support 2 Tahun'],
          support_duration: 'VIP Support 2 Tahun',
          is_popular: 0
        }
      ],
      features: [
        { code: 'pos_cashier', name: 'Modul Kasir Cepat & Scan Barcode', group_name: 'Transaksi Kasir', description: 'Pencarian produk kilat, scan barcode 1D/2D, diskon, opsi takeaway/dine-in, dan shortcut keyboard tanpa mouse.' },
        { code: 'cash_reconciliation', name: 'Rekonsiliasi Kas Laci Shift (Anti-Bocor)', group_name: 'Keamanan Kas', description: 'Validasi uang fisik di laci kasir vs perhitungan sistem saat tutup shift kasir untuk mencegah uang kasir tekor.' },
        { code: 'multidevice_lan', name: 'Multi-Device LAN (PC Windows + HP Android)', group_name: 'Konektivitas', description: 'Hubungkan PC kasir utama dan smartphone/tablet waiter secara instan di jaringan Wi-Fi lokal toko tanpa internet.' },
        { code: 'thermal_printer', name: 'Cetak Struk Thermal 58mm & 80mm', group_name: 'Pencetakan', description: 'Cetak nota struk via USB & Bluetooth, dukung cetak rangkap, custom logo toko, dan auto kick laci kasir.' },
        { code: 'inventory_control', name: 'Manajemen Inventori & Stok Otomatis', group_name: 'Inventori', description: 'Pengurangan stok otomatis saat transaksi, peringatan stok menipis, dan histori mutasi barang masuk/keluar.' },
        { code: 'multi_payment', name: 'Multi Metode Pembayaran & QRIS', group_name: 'Pembayaran', description: 'Menerima pembayaran Tunai dengan kalkulator kembalian otomatis, Transfer Bank, Debit, dan QRIS.' },
        { code: 'analytics_dashboard', name: 'Dashboard Analitik & Laporan Laba Bersih', group_name: 'Laporan', description: 'Laporan omset harian, produk terlaris, laba/rugi kotor dan bersih, serta grafik penjualan real-time.' },
        { code: 'backup_vault', name: 'Backup Otomatis 1-Klik & Data Aman', group_name: 'Keamanan Data', description: 'Cadangkan database toko secara lokal ke flashdisk atau folder aman untuk perlindungan maksimal data Anda.' }
      ],
      media: [
        { type: 'thumbnail', url: '/images/promos/pintarpos_promo_banner.jpg', caption: 'PintarPOS Resto & Retail - 100% Offline & Anti-Bocor Kas', sort_order: 1 },
        { type: 'screenshot', url: '/images/pintarpos/pos_utama.png', caption: 'Tampilan POS Utama - Kasir Kilat, Scan Barcode & Keranjang Belanja', sort_order: 2 },
        { type: 'screenshot', url: '/images/pintarpos/dashboard_analitik.png', caption: 'Dashboard Analitik - Total Pendapatan, Grafik Penjualan & Produk Terlaris', sort_order: 3 },
        { type: 'screenshot', url: '/images/pintarpos/inventori_stok.png', caption: 'Manajemen Inventori - Data Master Produk & Kontrol Stok POS', sort_order: 4 },
        { type: 'screenshot', url: '/images/pintarpos/rekonsiliasi_kas.png', caption: 'Rekonsiliasi Kas Laci - Validasi Shift Kasir & Pencegahan Selisih Kas', sort_order: 5 },
        { type: 'screenshot', url: '/images/pintarpos/riwayat_struk.png', caption: 'Riwayat Transaksi - Cetak Ulang Struk & Pembatalan Transaksi', sort_order: 6 },
        { type: 'screenshot', url: '/images/pintarpos/pengaturan_printer.png', caption: 'Pengaturan Printer - Dukungan Thermal 58mm & 80mm USB / Bluetooth', sort_order: 7 },
        { type: 'screenshot', url: '/images/pintarpos/pengaturan_sistem.png', caption: 'Pengaturan Sistem - Quick Item, Mode Terang & Integrasi Cash Drawer', sort_order: 8 },
        { type: 'screenshot', url: '/images/pintarpos/proses_bayar.png', caption: 'Proses Pembayaran - Hitung Kembalian Cepat, Tunai & Non-Tunai / QRIS', sort_order: 9 },
        { type: 'screenshot', url: '/images/pintarpos/shortcut_keyboard.png', caption: 'Panduan Shortcut Keyboard - Transaksi Kasir Kilat Tanpa Mouse', sort_order: 10 },
        { type: 'screenshot', url: '/images/pintarpos/multi_pc.png', caption: 'Dukungan Multi-Device - PC Windows Kasir, Tablet & HP Android Waiter Terhubung', sort_order: 11 }
      ],
      reviews: [
        { customer_name: 'Budi Santoso', business_name: 'Kopi Kenangan Senja (Bandung)', rating: 5, comment: 'Aplikasi kasir paling stabil yang pernah saya pakai. Sambung ke printer thermal bluetooth lancar jaya di HP Android.' },
        { customer_name: 'Hj. Siti Rohmah', business_name: 'Toko Sembako Berkah (Surabaya)', rating: 5, comment: 'Sangat hemat karena bayar sekali seumur hidup, tidak ada biaya bulanan yang membebani warung.' }
      ]
    },
    {
      id: 'prod-pintar-stock',
      product_code: 'STOCK',
      category_id: 'cat-stock',
      slug: 'pintarstock-inventory-warehouse',
      name: 'PintarStock - Manajemen Stok & Multi-Gudang',
      tagline: 'Sistem Inventori, Mutasi Antar Gudang & Opname Barcode Android',
      description: 'Solusi manajemen stok profesional untuk distributor, grosir, dan toko dengan banyak cabang gudang. Dilengkapi fitur stok opname instan menggunakan kamera HP Android sebagai barcode scanner.',
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11', android: 'Android 8.0+' },
      hardware_compat: ['Barcode Scanner Wireless 2.4G', 'Thermal Barcode Label Printer (Xprinter/Zebra)'],
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
      plans: [
        {
          id: 'plan-stock-std',
          code: 'STD',
          name: 'Paket Standard (1 PC Gudang + 2 HP Scanner)',
          description: 'Untuk 1 gudang utama dan pencatatan keluar/masuk barang.',
          price: 550000,
          original_price: 800000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 2 },
          deliverables: ['Installer Windows (.exe)', 'APK Scanner Barcode', 'Serial Key', 'PDF Panduan', 'Support 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 1
        },
        {
          id: 'plan-stock-multi',
          code: 'MULTI',
          name: 'Paket Multi-Gudang (3 PC + Unlimited HP)',
          description: 'Mendukung mutasi barang antar gudang berbeda lokasi dan approval bertingkat.',
          price: 1100000,
          original_price: 1600000,
          billing_type: 'lifetime',
          device_limit: { windows: 3, android: 10 },
          deliverables: ['Installer Windows & APK', 'Serial Key Multi-Gudang', 'Modul Transfer Stok', 'Support 1 Tahun'],
          support_duration: 'Support 1 Tahun',
          is_popular: 0
        }
      ],
      features: [
        { code: 'stock_opname', name: 'Stok Opname Cepat via Kamera HP', group_name: 'Opname', description: 'Scan barcode rak barang langsung mencocokkan stok fisik vs sistem dalam hitungan menit.' },
        { code: 'multi_warehouse', name: 'Pencatatan Multi Gudang & Cabang', group_name: 'Gudang', description: 'Ketahui posisi barang di Gudang Pusat, Gudang Toko, atau Gudang Retur secara transparan.' },
        { code: 'barcode_print', name: 'Generator & Cetak Label Barcode / QR', group_name: 'Labeling', description: 'Cetak label stiker barcode produk sendiri dengan ukuran custom.' }
      ],
      media: [
        { type: 'thumbnail', url: '/images/promos/pintarstock_promo_banner.jpg', caption: 'PintarStock - Manajemen Stok Gudang & Scan Barcode Kamera HP', sort_order: 1 }
      ],
      reviews: [
        { customer_name: 'Hendra Gunawan', business_name: 'CV. Maju Logistik', rating: 5, comment: 'Fitur scan barcode pakai kamera HP Android-nya sangat membantu saat opname bulanan.' }
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
1. ⏰ 100% Otomatis & Presisi Per Detik
Jadwal pergantian jam pelajaran, istirahat, upacara bendera hari Senin, hingga kepulangan berbunyi otomatis dan tepat waktu sesuai detak jam komputer. Guru piket tidak perlu lagi menatap jam dinding atau menekan tombol manual secara terburu-buru.

2. 📱 Kendali Jarak Jauh dari HP Guru Piket (Multi-Device PIN)
Guru piket atau satpam sekolah dapat membunyikan bel darurat, memanggil siswa/guru tertentu, atau memutar lagu upacara langsung dari smartphone Android via jaringan Wi-Fi sekolah tanpa harus berlari ke ruang Tata Usaha. Dilengkapi PIN Keamanan: Login Admin (741147) & Guru Piket (432234).

3. 🎙️ Bank Suara Lengkap: 119+ Nada Studio 3 Bahasa
Tersedia rekaman audio berkualitas studio dalam Bahasa Indonesia, Bahasa Inggris, dan Bahasa Arab dengan intonasi sopan dan merdu. Anda juga bebas menambahkan file MP3 lagu nasional, mars madrasah/sekolah, maupun audio doa belajar sendiri.

4. 📢 Studio Pengumuman Text-to-Speech (TTS)
Butuh siaran mendadak? Cukup ketik teks pengumuman di aplikasi, dan sistem akan mengubahnya menjadi suara vokal jernih yang langsung disiarkan ke speaker kelas secara otomatis.

5. 🛡️ 100% Offline LAN (Tanpa Kuota & Tanpa Internet)
Aplikasi berjalan mandiri di komputer desktop Ruang Tata Usaha. Tanpa perlu koneksi internet, tanpa risiko buffering saat offline, dan tanpa beban kuota bulanan sekolah.

6. 💎 Lisensi Beli 1x Pakai Selamanya (Lifetime)
Investasi cerdas sekali bayar tanpa biaya perpanjangan tahunan. Disertai garansi teknis dan panduan instalasi lengkap.`,
      platforms: ['windows', 'android'],
      min_requirements: {
        windows: 'Windows 10 / Windows 11 (32 & 64-bit), RAM 2GB, Storage 200MB',
        android: 'Android 7.0 (Nougat) ke atas, RAM 1GB (Koneksi Wi-Fi Lokal)'
      },
      hardware_compat: [
        'Amplifier / Sound System Sekolah (Jack Audio 3.5mm / RCA)',
        'Komputer PC Desktop / Laptop Ruang TU / Ruang Piket',
        'Smartphone / Tablet Android Guru Piket (Jaringan Wi-Fi Sekolah)',
        'Router Wi-Fi / Switch Hub LAN Lokal Sekolah'
      ],
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
      plans: [
        {
          id: 'plan-bell-basic',
          code: 'BASIC',
          name: 'Paket Basic Sekolah (1 PC TU)',
          description: 'Cocok untuk sekolah dengan 1 komputer sentral di ruang Tata Usaha / Piket.',
          price: 175000,
          original_price: 350000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 1 },
          deliverables: ['1 Lisensi Mesin PC Desktop (Permanen)', 'Jadwal Bel Alarm Otomatis Tanpa Batas', 'Paket Audio Nada Standar 3 Bahasa', 'E-Book Panduan PDF & Video Tutorial', 'Garansi Teknis 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 0
        },
        {
          id: 'plan-bell-pro',
          code: 'PRO',
          name: 'Paket PRO Enterprise (1 PC TU + 3 HP Guru)',
          description: 'Paling diminati! Solusi lengkap sekolah modern dengan kontrol jarak jauh HP Guru Piket.',
          price: 350000,
          original_price: 700000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 3 },
          deliverables: ['1 Lisensi Server PC Utama', 'Multi-Perangkat: Remote hingga 3 HP / Tablet Guru', 'PIN Guru Piket & Admin', 'Bundle 119+ Audio Studio HD', 'Studio Pengumuman TTS', 'Support Prioritas 1 Tahun'],
          support_duration: 'Support Prioritas 1 Tahun',
          is_popular: 1
        },
        {
          id: 'plan-bell-hardware',
          code: 'HARDWARE_BUNDLE',
          name: 'Paket Hardware Mini PC + Bell Pintar PRO Siap Pakai',
          description: 'Paket komplit unit hardware Mini PC + Software Bell Pintar Pro. Tinggal colok ke amplifier sekolah.',
          price: 1450000,
          original_price: 2200000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 5 },
          deliverables: ['1 Unit Mini PC Server Siap Pakai', 'Lisensi Bell Pintar PRO Lifetime', 'Kabel Audio Gold-Plated 3.5mm to RCA', 'Aplikasi Android Guru Piket', 'Garansi Hardware 1 Tahun'],
          support_duration: 'Garansi & Support 1 Tahun',
          is_popular: 0
        }
      ],
      features: [
        { code: 'auto_schedule', name: 'Jadwal Alarm Presisi & Preset Khusus Ujian', group_name: 'Otomasi', description: 'Atur jadwal otomatis hari Senin-Sabtu dengan pola berbeda (Senin upacara, Jumat pulang awal, atau jadwal khusus Ramadhan & PTS/PAS Ujian).' },
        { code: 'remote_pin', name: 'Remote Multi-Device HP Guru Piket (PIN Security)', group_name: 'Konektivitas', description: 'Kendalikan bel dari mana saja di area sekolah via Wi-Fi lokal. Didukung PIN ganda: Guru Piket (432234) & Admin (741147).' },
        { code: 'studio_sound_bank', name: 'Bank Suara 119+ Nada Studio 3 Bahasa (ID, EN, AR)', group_name: 'Audio Studio', description: 'Koleksi narasi studio profesional berkualitas tinggi, lagu kebangsaan Indonesia Raya, Mars Sekolah, serta audio doa awal/akhir belajar.' },
        { code: 'tts_broadcast', name: 'Studio Pengumuman Text-to-Speech (TTS) Cepat', group_name: 'Siaran', description: 'Cukup ketik pengumuman atau panggilan nama siswa, sistem akan merubah teks menjadi suara vokal jernih yang langsung disiarkan ke speaker.' },
        { code: 'offline_lan', name: '100% Offline LAN Tanpa Kuota Internet', group_name: 'Infrastruktur', description: 'Sistem beroperasi 100% mandiri di komputer sekolah dengan database SQLite lokal. Tidak akan berhenti berbunyi saat koneksi internet putus.' },
        { code: 'lifetime_license', name: 'Lisensi Sekali Bayar (Lifetime) Tanpa Iuran Bulanan', group_name: 'Lisensi', description: 'Bebas biaya langganan bulanan maupun tahunan. Sekali beli untuk sekolah, nikmati pemakaian selamanya tanpa tagihan tersembunyi.' }
      ],
      media: [
        { type: 'thumbnail', url: '/images/bellpintar/thumbnail_youtube_bell_pintar.jpg', caption: 'Bell Pintar - Bel Sekolah Otomatis & Cerdas', sort_order: 1 },
        { type: 'screenshot', url: '/images/bellpintar/school_bg.jpg', caption: 'Implementasi Modern di Seluruh Jenjang Satuan Pendidikan', sort_order: 2 },
        { type: 'screenshot', url: '/images/bellpintar/server_unit.png', caption: 'PC Komputer Server TU Berjalan Otomatis di Background', sort_order: 3 },
        { type: 'screenshot', url: '/images/bellpintar/multi_phone.png', caption: 'Kendali Jarak Jauh dari HP Guru Piket via Wi-Fi Lokal', sort_order: 4 },
        { type: 'screenshot', url: '/images/bellpintar/multi_pc.png', caption: 'Multi-PC Sync & Kontrol Presisi Ruang Tata Usaha', sort_order: 5 },
        { type: 'screenshot', url: '/images/bellpintar/multi_tablet.png', caption: 'Tampilan Dashboard & Monitoring Tablet Display', sort_order: 6 },
        { type: 'screenshot', url: '/images/bellpintar/server_speed.png', caption: 'Kinerja Cepat, Ringan & Hitung Mundur Real-time', sort_order: 7 },
        { type: 'screenshot', url: '/images/bellpintar/backup_vault.png', caption: 'Keamanan Data, Audit Log & Sistem Backup Terintegrasi', sort_order: 8 },
        { type: 'screenshot', url: '/images/bellpintar/package_box.png', caption: 'Paket Software Edisi Resmi Bell Pintar Lifetime', sort_order: 9 },
        { type: 'screenshot', url: '/images/bellpintar/package_hardware.png', caption: 'Paket Komplit Hardware Mini PC + Bell Pintar Siap Pakai', sort_order: 10 }
      ],
      reviews: [
        { customer_name: 'Budi Santoso, S.Pd.', business_name: 'Wakasek Kurikulum • SMA Negeri Malang', rating: 5, comment: 'Dulu guru piket sering terlambat membunyikan bel istirahat karena sedang menangani siswa. Sejak pakai Bell Pintar, semuanya otomatis dan suara narasinya sangat sopan dan terdengar resmi.' },
        { customer_name: 'Nur Rohman, S.Kom.', business_name: 'Koordinator Lab Komputer • SMK Surabaya', rating: 5, comment: 'Fitur remote dari HP sangat membantu kami saat upacara bendera dan apel pagi. Tinggal pencet dari pinggir lapangan via HP, lagu Indonesia Raya dan bel apel langsung berkumandang.' }
      ]
    },
    {
      id: 'prod-pintar-school',
      product_code: 'SCHOOL',
      category_id: 'cat-school',
      slug: 'pintarschool-spp-akademik',
      name: 'PintarSchool - Sistem Pembayaran SPP & Absensi Siswa',
      tagline: 'Kelola SPP, Notifikasi WhatsApp Tagihan & Kartu Pembayaran Digital',
      description: 'Aplikasi manajemen keuangan sekolah, pondok pesantren, dan bimbingan belajar. Memudahkan bendahara mencatat tagihan SPP, uang gedung, seragam, serta otomatis kirim notifikasi kwitansi ke WhatsApp wali murid.',
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11', android: 'Android 8.0+' },
      hardware_compat: ['Printer Thermal 58mm / Dot Matrix Epson', 'Barcode Scanner Kartu Pelajar'],
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
      plans: [
        {
          id: 'plan-school-std',
          code: 'STD',
          name: 'Paket Sekolah Mandiri (1 PC Tata Usaha)',
          description: 'Cocok untuk TK, SD, SMP, SMA, atau Yayasan dengan santri/siswa hingga 1000 anak.',
          price: 650000,
          original_price: 950000,
          billing_type: 'lifetime',
          device_limit: { windows: 1, android: 2 },
          deliverables: ['Installer Windows (.exe)', 'Template Kwitansi SPP', 'Serial Key', 'PDF Panduan', 'Support 1 Tahun'],
          support_duration: 'Support 1 Tahun',
          is_popular: 1
        }
      ],
      features: [
        { code: 'spp_billing', name: 'Manajemen Tagihan SPP & Uang Gedung', group_name: 'Keuangan', description: 'Cetak kwitansi SPP dalam hitungan detik, cek tunggakan per siswa/kelas dengan 1 klik.' },
        { code: 'wa_invoice', name: 'Broadcast Pengingat Tagihan via WhatsApp', group_name: 'Notifikasi', description: 'Kirim rincian tagihan dan bukti pembayaran langsung ke nomor WA orang tua.' }
      ],
      media: [
        { type: 'thumbnail', url: '/images/promos/pintarschool_promo_banner.jpg', caption: 'PintarSchool - Aplikasi SPP Sekolah & Notifikasi WhatsApp', sort_order: 1 }
      ],
      reviews: [
        { customer_name: 'Ustadz Ahmad Fauzi', business_name: 'Ponpes Darul Hikmah', rating: 5, comment: 'Laporan keuangan SPP jadi sangat tertib. Orang tua santri senang dapat notifikasi rincian pembayaran.' }
      ]
    },
    {
      id: 'prod-pintar-finance',
      product_code: 'FINANCE',
      category_id: 'cat-finance',
      slug: 'pintarinvoice-keuangan-usaha',
      name: 'PintarInvoice & Kas Keuangan UKM',
      tagline: 'Pembuat Faktur Profesional, Buku Kas & Laporan Laba Rugi Otomatis',
      description: 'Aplikasi pembukuan simpel dan elegan untuk pemilik usaha dagang dan jasa. Buat faktur/invoice PDF berlogo profesional, lacak piutang pelanggan, dan catat kas operasional harian.',
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
      plans: [
        {
          id: 'plan-finance-std',
          code: 'STD',
          name: 'Paket Lisensi Permanen (1 PC)',
          description: 'Cetak invoice unlimited tanpa batas transaksi selamanya.',
          price: 399000,
          original_price: 550000,
          billing_type: 'lifetime',
          device_limit: { windows: 1 },
          deliverables: ['Installer Windows (.exe)', 'Custom Logo Template', 'Serial Key', 'PDF Panduan', 'Support 6 Bulan'],
          support_duration: 'Support 6 Bulan',
          is_popular: 1
        }
      ],
      features: [
        { code: 'invoice_pdf', name: 'Desain Faktur / Invoice PDF Profesional', group_name: 'Faktur', description: 'Format rapi dengan logo usaha, nomor faktur otomatis, dan QRIS pembayaran.' },
        { code: 'cashflow', name: 'Buku Kas Masuk, Keluar & Piutang', group_name: 'Kas', description: 'Pantau siapa saja klien yang belum lunas serta tanggal jatuh tempo pembayaran.' }
      ],
      media: [
        { type: 'thumbnail', url: '/images/promos/pintarinvoice_promo_banner.jpg', caption: 'PintarInvoice - Faktur PDF & Buku Kas Keuangan Usaha', sort_order: 1 }
      ],
      reviews: [
        { customer_name: 'Dewi Lestari', business_name: 'Studio Desain Kreatif', rating: 5, comment: 'Bikin invoice klien jadi jauh lebih cepat dan terlihat sangat profesional.' }
      ]
    }
  ];

  for (const prod of products) {
    const exists = await dbAsync.get('SELECT id FROM products WHERE id = ?', [prod.id]);
    if (!exists) {
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

      for (const pl of prod.plans) {
        await dbAsync.run(
          `INSERT INTO plans (
            id, product_id, code, name, description, price, original_price,
            billing_type, device_limit, deliverables, support_duration, is_popular
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            pl.id, prod.id, pl.code, pl.name, pl.description, pl.price, pl.original_price,
            pl.billing_type, JSON.stringify(pl.device_limit), JSON.stringify(pl.deliverables),
            pl.support_duration, pl.is_popular
          ]
        );
      }

      for (let i = 0; i < prod.features.length; i++) {
        const feat = prod.features[i];
        const featId = uuidv4();
        await dbAsync.run(
          `INSERT INTO features (id, product_id, code, name, description, group_name, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [featId, prod.id, feat.code, feat.name, feat.description, feat.group_name, i + 1]
        );

        for (const pl of prod.plans) {
          await dbAsync.run(
            'INSERT INTO plan_features (id, plan_id, feature_id, value) VALUES (?, ?, ?, ?)',
            [uuidv4(), pl.id, featId, 'true']
          );
        }
      }

      for (const m of prod.media) {
        await dbAsync.run(
          'INSERT INTO product_media (id, product_id, type, url, caption, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
          [uuidv4(), prod.id, m.type, m.url, m.caption, m.sort_order]
        );
      }

      for (const r of prod.reviews) {
        await dbAsync.run(
          'INSERT INTO reviews (id, product_id, customer_name, business_name, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
          [uuidv4(), prod.id, r.customer_name, r.business_name, r.rating, r.comment]
        );
      }
    }
  }

  const sampleCust = await dbAsync.get('SELECT id FROM customers WHERE phone = "081234567899"');
  if (!sampleCust) {
    const custId = uuidv4();
    await dbAsync.run(
      'INSERT INTO customers (id, customer_code, name, company_name, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [custId, 'CUST-889911', 'Toko Berkah Sejahtera', 'Berkah Group', 'owner@berkah.com', '081234567899']
    );

    const sampleKey = await generateLicenseKey('POS', 'PRO');
    await dbAsync.run(
      `INSERT INTO licenses (id, license_key, customer_id, product_id, plan_id, status, max_devices)
       VALUES (?, ?, ?, 'prod-pintar-pos', 'plan-pos-pro', 'ACTIVE', 7.0)`,
      [uuidv4(), sampleKey, custId]
    );
    console.log('Sample Active License created for testing:', sampleKey);
  }

  console.log('Database seeding completed successfully!');
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

module.exports = { seedDatabase };
