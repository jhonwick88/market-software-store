const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('./db');
const { initSchema } = require('./schema');

async function seed20Products() {
  console.log('=== SEEDING 20 PINTARLABS SOFTWARE PRODUCTS (4 CATEGORIES X 5 APPS) ===');
  await initSchema();

  // 1. Categories Definition
  const categories = [
    {
      id: 'cat-unboxing',
      slug: 'unboxing-bisnis',
      name: 'Unboxing, Packing & Retail',
      icon: 'PackageCheck',
      description: 'Software cerdas untuk toko online, studio packing unboxing anti-retur, POS retail, gudang dan kasir.',
      sort_order: 1
    },
    {
      id: 'cat-school',
      slug: 'sekolah-pendidikan',
      name: 'Sekolah & Lembaga Pendidikan',
      icon: 'GraduationCap',
      description: 'Aplikasi manajemen sekolah, bel otomatis, SPP keuangan, ujian CBT anti-curang, perpustakaan & BK.',
      sort_order: 2
    },
    {
      id: 'cat-office',
      slug: 'perkantoran-bisnis',
      name: 'Perkantoran & Manajemen Perusahaan',
      icon: 'Building2',
      description: 'Sistem absensi biometrik GPS, manajemen aset kantor, agenda surat & disposisi digital, helpdesk & buku tamu.',
      sort_order: 3
    },
    {
      id: 'cat-desa',
      slug: 'pemerintahan-desa',
      name: 'Pemerintahan Desa & Kelurahan',
      icon: 'Landmark',
      description: 'Sistem informasi desa, cetak surat administrasi kependudukan NIK, keuangan BUMDes, retribusi & bansos.',
      sort_order: 4
    }
  ];

  // 2. 20 Products Definition
  const products = [
    // ==========================================
    // KATEGORI 1: UNBOXING & BISNIS RETAIL
    // ==========================================
    {
      id: 'prod-unbox-studio',
      product_code: 'UNBOX',
      category_id: 'cat-unboxing',
      slug: 'pintarunbox-pack-studio-anti-retur',
      name: 'PintarUnbox & Pack Studio',
      tagline: 'Sistem Rekam Video Unboxing & Packing Otomatis Barcode Scanner — Bukti Valid Klaim Anti-Retur Marketplace',
      description: `📦 ATASI KLAIM RETUR PALSU & BARANG RUSAK DENGAN BUKTI VIDEO REKAMAN OTOMATIS!

PintarUnbox & Pack Studio adalah solusi perangkat lunak terdepan untuk penjual e-commerce (Shopee, Tokopedia, TikTok Shop, Lazada) dan gudang ekspedisi. Software ini mengotomatiskan proses perekaman video saat packing pesanan dan unboxing paket retur hanya dengan sekali scan barcode resi.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Otomatisasi Scan-to-Record Tanpa Sentuh Mouse/Keyboard: Cukup scan barcode resi pengiriman dengan scanner barcode, kamera webcam/CCTV langsung mulai merekam video beresolusi HD dengan watermark nomor resi, tanggal, dan jam real-time.
2. Pengarsipan Berbasis Cloud & Lokal Cepat: Video disimpan otomatis dengan nama file sesuai nomor resi sehingga pencarian bukti rekaman saat terjadi sengketa klaim marketplace dapat ditemukan dalam 1 detik.
3. Cetak Label Thermal Peringatan Video Unboxing: Otomatis mencetak stiker peringatan "Paket Ini Direkam CCTV" pada printer thermal untuk mencegah pembeli berniat curang.
4. Tanpa Biaya Berlangganan Per Resi: Tidak seperti SaaS kompetitor yang memungut biaya per video/resi, PintarUnbox berlisensi Lifetime sekali bayar tanpa batas jumlah packing pesanan.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11 64-bit, RAM 4GB, Intel Core i3 / Ryzen 3' },
      hardware_compat: ['Webcam HD 1080p / Kamera USB / CCTV RTSP', 'Barcode Scanner 1D / 2D QR', 'Printer Thermal Resi 100x150mm & 80mm USB'],
      version: 'v3.2.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 312,
      rating: 4.96,
      review_count: 148,
      windows_installer_url: 'https://downloads.pintarlabs.id/unbox/PintarUnbox_Setup_v3.2.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/unbox/Panduan_PintarUnbox_Studio.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/unbox/PintarUnbox_Demo_Trial.exe',
      thumbnail_url: '/images/promos/pintarunbox_pack_promo_banner.jpg',
      plans: [
        {
          id: 'plan-unbox-single',
          code: 'SINGLE',
          name: 'Paket Single Packing Table (1 Meja Packing)',
          price: 550000,
          original_price: 850000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen 1 PC Meja Packing', 'Watermark Video Custom Nama Toko', 'Panduan PDF & Remote AnyDesk'],
          is_popular: 0
        },
        {
          id: 'plan-unbox-multi',
          code: 'MULTI',
          name: 'Paket Multi-Station Pro (Hingga 5 Meja Packing Gudang)',
          price: 990000,
          original_price: 1600000,
          deliverables: ['Installer Windows Pro (.exe)', 'Lisensi Multi-Device 5 PC Meja Packing', 'Dukungan Kamera CCTV Multi-Angle', 'Support Prioritas 1 Tahun'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'AUTO_REC', name: 'Auto Start & Stop Video via Barcode Scanner', description: 'Kamera otomatis merekam saat resi discan dan berhenti otomatis saat packing selesai.' },
        { code: 'WATERMARK', name: 'Watermark Timestamp & No. Resi Anti-Manipulasi', description: 'Penyematan teks nomor resi, tanggal, dan detik presisi langsung di dalam frame video.' },
        { code: 'FAST_SEARCH', name: 'Pencarian Instan Video Bukti Klaim Marketplace', description: 'Cukup ketik atau scan nomor resi untuk memutar video rekaman paket yang dipermasalahkan.' },
        { code: 'MULTI_CAM', name: 'Dukungan Dual Camera (Sudut Atas & Wajah Petugas)', description: 'Merekam dua sudut pandang sekaligus untuk bukti keaslian barang yang tak terbantahkan.' },
        { code: 'THERMAL_PRINT', name: 'Integrasi Cetak Stiker QC & Peringatan CCTV', description: 'Mencetak stiker bukti pemeriksaan kualitas langsung ke printer thermal 80mm/100mm.' },
        { code: 'AUTO_COMPRESS', name: 'Kompresi Video Pintar H.264/H.265 Hemat Harddisk', description: 'Ukuran video sangat ringkas namun gambar tetap tajam dan jernih untuk diunggah.' }
      ],
      media: [
        { type: 'image', url: '/images/promos/pintarunbox_pack_promo_banner.jpg', caption: '3D Showcase Stasiun Meja Packing PintarUnbox Studio' },
        { type: 'image', url: '/images/mockups/unbox_1_dashboard.svg', caption: 'Dashboard Utama Monitoring Packing Real-time' },
        { type: 'image', url: '/images/mockups/unbox_2_scanner.svg', caption: 'Integrasi Barcode Scanner & Kamera Webcam HD' },
        { type: 'image', url: '/images/mockups/unbox_3_evidence.svg', caption: 'Repositori Arsip Rekaman Video Bukti Sengketa Retur' },
        { type: 'image', url: '/images/mockups/unbox_4_report.svg', caption: 'Laporan Rekapitulasi Paket Terkirim & Berat Produk' }
      ]
    },
    {
      id: 'prod-pintar-pos',
      product_code: 'POS',
      category_id: 'cat-unboxing',
      slug: 'pintarpos-resto-retail',
      name: 'PintarPOS Resto & Retail Ultimate',
      tagline: 'Software Kasir Cepat 100% Offline Multi-Device, Rekonsiliasi Kas Laci Anti-Bocor & Kitchen Display',
      description: `🚀 APLIKASI KASIR PINTAR (POINT OF SALE) MODERN 100% OFFLINE!

PintarPOS dirancang khusus untuk toko retail, minimarket, restoran, kafe, apotek, dan UMKM.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. 100% Bebas Kuota & Internet (Offline-Ready): Semua transaksi kasir, scan barcode, cetak nota struk, hingga sinkronisasi multi-device berjalan mulus di jaringan lokal Wi-Fi toko Anda tanpa membutuhkan koneksi internet.
2. Sistem Rekonsiliasi Kas Laci (Anti-Bocor & Anti-Tekor): Setiap pergantian shift atau saat tutup toko, kasir cukup menginput jumlah uang fisik di laci. Sistem akan langsung memvalidasi dengan perhitungan omset & kas keluar secara akurat.
3. Sinkronisasi Multi-Device Jaringan Lokal (LAN / Wi-Fi): Hubungkan Komputer PC kasir utama dengan Tablet / HP Android waiter secara instan tanpa lag.
4. Beli 1x Pakai Seumur Hidup (Lifetime License): Bebas biaya langganan bulanan atau tahunan tanpa potongan komisi per transaksi.`,
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
          deliverables: ['Installer Windows (.exe)', 'Aplikasi Android (.apk)', 'Serial Key Aktivasi', 'PDF Panduan', 'Support 6 Bulan'],
          is_popular: 0
        },
        {
          id: 'plan-pos-pro',
          code: 'PRO',
          name: 'Paket Multi-Device Pro (2 PC + 5 HP Waiter/Kasir)',
          price: 899000,
          original_price: 1350000,
          deliverables: ['Installer Windows (.exe)', 'Aplikasi Android (.apk)', 'Serial Key Multi-Device', 'Bantuan Remote Install', 'Support Prioritas 1 Tahun'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'OFFLINE_FIRST', name: '100% Offline Tanpa Koneksi Internet', description: 'Tetap berjualan lancar meskipun internet mati total.' },
        { code: 'RECONCILE', name: 'Rekonsiliasi Kas Laci Shift Otomatis', description: 'Mencegah selisih uang kasir dengan validasi fisik uang laci.' },
        { code: 'LAN_SYNC', name: 'Sinkronisasi Multi-Device Jaringan Lokal', description: 'Koneksi waiter Android ke kasir PC Windows tanpa server cloud.' },
        { code: 'SPLIT_BILL', name: 'Split Bill & Gabung Meja Resto', description: 'Fleksibilitas pembayaran terpisah per pelanggan dalam satu meja.' },
        { code: 'QRIS_STATIC', name: 'Integrasi QRIS Dinamis & Struk Bluetooth', description: 'Mencetak QRIS otomatis pada struk belanja pelanggan.' },
        { code: 'RAW_MATERIAL', name: 'Manajemen Resep & Stok Bahan Baku Otomatis', description: 'Stok bahan baku otomatis terpotong saat menu makanan terjual.' }
      ],
      media: [
        { type: 'image', url: '/images/promos/pintarpos_promo_banner.jpg', caption: '3D Tampilan Mockup PintarPOS Resto & Retail' },
        { type: 'image', url: '/images/pintarpos/pos_01_dashboard.jpg', caption: 'Dashboard Utama Kasir & Penjualan Cepat' },
        { type: 'image', url: '/images/pintarpos/pos_02_transaksi_kasir.jpg', caption: 'Tampilan Transaksi Kasir Scan Barcode & Touchscreen' },
        { type: 'image', url: '/images/pintarpos/pos_03_split_bill.jpg', caption: 'Fitur Split Bill & Manajemen Meja Restoran' },
        { type: 'image', url: '/images/pintarpos/pos_04_rekonsiliasi_kas.jpg', caption: 'Form Rekonsiliasi Kas Laci Shift Kasir' }
      ]
    },
    {
      id: 'prod-pintar-stock',
      product_code: 'STOCK',
      category_id: 'cat-unboxing',
      slug: 'pintarstock-inventory-warehouse',
      name: 'PintarStock Warehouse & Barcode',
      tagline: 'Sistem Stok Gudang Multi-Lokasi Rak, Serial Number/IMEI & Kartu Stok Otomatis Akurat',
      description: `📊 MANAJEMEN INVENTORI GUDANG MODERN DENGAN SISTEM KARTU STOK AKURAT!

PintarStock membantu distributor, pabrik, toko grosir, dan pergudangan mengontrol arus barang masuk, keluar, mutasi antar cabang, hingga stock opname berkala dengan barcode scanner.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Multi-Gudang & Multi-Bin Rak: Pengelompokan lokasi penyimpanan barang hingga detail nomor rak dan lantai gudang.
2. Tracking Serial Number & Nomor IMEI: Sangat cocok untuk toko elektronik, HP, komputer, dan suku cadang otomotif.
3. Stock Opname Cepat Tanpa Tutup Toko: Mendukung stock opname parsial per kategori atau per rak menggunakan scanner portabel Android.
4. Notifikasi Stok Menipis & Kadaluarsa (FIFO): Sistem peringatan dini barang mendekati batas minimum atau tanggal expired.`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11, RAM 4GB', android: 'Android 8.0+, RAM 2GB' },
      hardware_compat: ['Barcode Scanner Nirkabel 2.4GHz / Bluetooth', 'Printer Barcode Label Zebra/Xprinter', 'Printer Invoice Dot Matrix'],
      version: 'v2.8.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 184,
      rating: 4.92,
      review_count: 86,
      windows_installer_url: 'https://downloads.pintarlabs.id/stock/PintarStock_Setup.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/stock/PintarStock_Mobile.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/stock/Buku_Panduan_PintarStock.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/stock/PintarStock_Demo.exe',
      thumbnail_url: '/images/promos/pintarstock_promo_banner.jpg',
      plans: [
        {
          id: 'plan-stock-basic',
          code: 'BASIC',
          name: 'Paket Single Gudang (1 PC Gudang)',
          price: 520000,
          original_price: 800000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen Single PC', 'Template Cetak Barcode', 'Support 6 Bulan'],
          is_popular: 0
        },
        {
          id: 'plan-stock-pro',
          code: 'PRO',
          name: 'Paket Multi-Gudang & Cabang (3 PC + Barcode Android)',
          price: 950000,
          original_price: 1500000,
          deliverables: ['Installer Windows (.exe)', 'Aplikasi Stock Opname Android', 'Lisensi Multi-Gudang 3 PC', 'Support 1 Tahun'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'MULTI_WAREHOUSE', name: 'Multi-Gudang & Penempatan Bin Rak', description: 'Manajemen beberapa gudang dan sub-lokasi rak terpisah.' },
        { code: 'SERIAL_IMEI', name: 'Pencatatan Nomor Seri (SN) & IMEI', description: 'Lacak riwayat garansi tiap unit barang secara unik.' },
        { code: 'FIFO_LIFO', name: 'Metode Penilaian Stok FIFO & Rata-rata', description: 'Perhitungan HPP akurat sesuai standar akuntansi.' },
        { code: 'AUTO_REORDER', name: 'Purchase Order (PO) Otomatis ke Supplier', description: 'Buat draf pesanan otomatis saat stok menyentuh batas minimum.' },
        { code: 'OPNAME_SCAN', name: 'Stock Opname Cepat via Barcode Scanner', description: 'Pencocokan stok fisik dan sistem tanpa input manual.' }
      ],
      media: [
        { type: 'image', url: '/images/promos/pintarstock_promo_banner.jpg', caption: '3D Banner Showcase PintarStock Gudang' },
        { type: 'image', url: '/images/mockups/asset_1_dashboard.svg', caption: 'Dashboard Ringkasan Total Aset Stok & Nilai Rupiah' },
        { type: 'image', url: '/images/mockups/asset_3_qrlabel.svg', caption: 'Modul Cetak Label Barcode & Penomoran Rak' },
        { type: 'image', url: '/images/mockups/unbox_4_report.svg', caption: 'Kartu Stok & Laporan Mutasi Barang Harian' },
        { type: 'image', url: '/images/mockups/kargo_2_scale.svg', caption: 'Form Penerimaan Barang Masuk dari Supplier' }
      ]
    },
    {
      id: 'prod-pintar-invoice',
      product_code: 'INV',
      category_id: 'cat-unboxing',
      slug: 'pintarinvoice-keuangan-usaha',
      name: 'PintarInvoice & Kasir Faktur B2B',
      tagline: 'Software Faktur Penjualan, Surat Jalan, Piutang Jatuh Tempo & Laporan Laba Kotor UMKM',
      description: `📄 KELOLA INVOICE, SURAT JALAN & PIUTANG USAHA DENGAN RAPI & PROFESIONAL!

PintarInvoice adalah software penerbitan faktur tagihan, kwitansi, surat jalan, dan pencatatan buku kas piutang dagang untuk toko grosir, supplier, kontraktor, dan kantor jasa.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Desain Faktur Elegan & Siap Cetak Dot Matrix / PDF: Pilihan template nota faktur resmi berlogo perusahaan dalam format A4, Continuous Form, maupun PDF siap kirim WhatsApp.
2. Manajemen Piutang & Jatuh Tempo Otomatis: Peringatan otomatis daftar tagihan customer yang telah jatuh tempo beserta rekap sisa piutang.
3. Otomatis Terhubung ke Surat Jalan: Buat faktur langsung mengonversi draf surat jalan barang tanpa perlu ketik ulang nama barang.
4. Laporan Laba Bersih & Arus Kas Real-time: Ketahui keuntungan bersih per transaksi dan arus kas usaha secara instan.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB' },
      hardware_compat: ['Printer Dot Matrix (Epson LX-310/LQ-310)', 'Printer Laserjet / Inkjet A4', 'Printer Thermal 80mm'],
      version: 'v2.5.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 142,
      rating: 4.88,
      review_count: 64,
      windows_installer_url: 'https://downloads.pintarlabs.id/invoice/PintarInvoice_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/invoice/Manual_PintarInvoice.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/invoice/PintarInvoice_Demo.exe',
      thumbnail_url: '/images/promos/pintarinvoice_promo_banner.jpg',
      plans: [
        {
          id: 'plan-inv-basic',
          code: 'BASIC',
          name: 'Paket Usaha Standard (1 PC)',
          price: 450000,
          original_price: 650000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen', 'Custom Logo Faktur', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'INVOICE_GEN', name: 'Penerbitan Faktur Penjualan Cepat', description: 'Cetak faktur, surat jalan, dan kwitansi hanya dalam hitungan detik.' },
        { code: 'AGING_AR', name: 'Laporan Umur Piutang (Aging AR)', description: 'Pantau status piutang customer 30, 60, hingga 90 hari.' },
        { code: 'DOT_MATRIX', name: 'Dukungan Penuh Printer Continuous Form', description: 'Cetak nota rangkap 3 pada printer dot matrix tanpa macet.' },
        { code: 'KAS_BANK', name: 'Buku Kas Masuk, Keluar & Rekening Bank', description: 'Pencatatan keuangan operasional usaha yang terstruktur.' }
      ],
      media: [
        { type: 'image', url: '/images/promos/pintarinvoice_promo_banner.jpg', caption: '3D Mockup Faktur Tagihan PintarInvoice' },
        { type: 'image', url: '/images/mockups/surat_1_agenda.svg', caption: 'Daftar Invoice Penjualan & Status Pembayaran Lunas/Tempo' },
        { type: 'image', url: '/images/mockups/surat_4_report.svg', caption: 'Laporan Rekapitulasi Piutang Customer & Umur Piutang' },
        { type: 'image', url: '/images/mockups/kargo_4_commission.svg', caption: 'Laporan Laba Kotor & Arus Kas Masuk Bulanan' },
        { type: 'image', url: '/images/mockups/visitor_2_badge.svg', caption: 'Desain Kustom Faktur Penjualan & Format Kwitansi' }
      ]
    },
    {
      id: 'prod-pintar-kargo',
      product_code: 'KARGO',
      category_id: 'cat-unboxing',
      slug: 'pintarkargo-ekspedisi-counter',
      name: 'PintarKargo & Ekspedisi Counter',
      tagline: 'Software Kasir Agen Ekspedisi Multi-Kurir, Cek Ongkir Otomatis, Timbangan Digital & Cetak Resi Massal',
      description: `🚚 APLIKASI KASIR KHUSUS AGEN EKSPEDISI & PENGIRIMAN PAKET MULTI-KURIR!

PintarKargo memudahkan agen dan konter kurir (J&T, JNE, SiCepat, Pos, Ninja, Wahana) dalam melayani customer, menimbang paket, menghitung tarif ongkir, cetak resi thermal, hingga perhitungan komisi agen secara transparan.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Cek Tarif Ongkir Multi-Ekspedisi Cepat: Bandingkan ongkos kirim seluruh ekspedisi dalam 1 layar pencarian kecamatan/kota tujuan.
2. Integrasi Timbangan Digital Portabel USB/COM: Berat barang otomatis terbaca dari timbangan tanpa perlu diketik manual oleh kasir.
3. Pembuatan Manifest Penyerahan Paket ke Driver: Cetak lembar manifest serah terima paket ke kurir jemputan secara rapi berbarcode.
4. Kalkulator Pembagian Komisi Agen: Otomatis menghitung omset harian dan persentase keuntungan komisi agen (10-25%).`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 4GB' },
      hardware_compat: ['Timbangan Digital RS232 / USB', 'Printer Thermal Label Resi 100x150mm & 80mm', 'Barcode Scanner 1D/2D'],
      version: 'v2.1.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 98,
      rating: 4.90,
      review_count: 42,
      windows_installer_url: 'https://downloads.pintarlabs.id/kargo/PintarKargo_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/kargo/Panduan_PintarKargo.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/kargo/PintarKargo_Demo.exe',
      thumbnail_url: '/images/promos/pintarkargo_ekspedisi_promo_banner.jpg',
      plans: [
        {
          id: 'plan-kargo-single',
          code: 'SINGLE',
          name: 'Paket Single Counter (1 PC Kasir)',
          price: 490000,
          original_price: 750000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen', 'Integrasi Timbangan', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'MULTI_RATE', name: 'Database Ongkir Lengkap Seluruh Indonesia', description: 'Cek tarif reguler, kargo, instan, dan trucking secara instan.' },
        { code: 'AUTO_SCALE', name: 'Koneksi Timbangan Digital Portabel', description: 'Nilai bobot kg otomatis masuk ke formulir pemesanan.' },
        { code: 'MANIFEST_GEN', name: 'Cetak Lembar Manifest Serah Terima Kurir', description: 'Bukti serah terima resmi berbarcode saat pickup driver.' },
        { code: 'KOMISI_CALC', name: 'Rekap Komisi Agen & Omset Bersih Harian', description: 'Laporan laba bersih agen terhitung otomatis per kurir.' }
      ],
      media: [
        { type: 'image', url: '/images/promos/pintarkargo_ekspedisi_promo_banner.jpg', caption: '3D Showcase Counter Agen Ekspedisi PintarKargo' },
        { type: 'image', url: '/images/mockups/kargo_1_counter.svg', caption: 'Layar Transaksi Kasir Counter & Pencarian Tarif Ongkir' },
        { type: 'image', url: '/images/mockups/kargo_2_scale.svg', caption: 'Integrasi Timbangan Digital & Perhitungan Volumetrik' },
        { type: 'image', url: '/images/mockups/kargo_3_manifest.svg', caption: 'Cetak Surat Jalan Manifest Serah Terima Paket' },
        { type: 'image', url: '/images/mockups/kargo_4_commission.svg', caption: 'Laporan Rekapitulasi Komisi Agen & Omset Harian' }
      ]
    },

    // ==========================================
    // KATEGORI 2: SEKOLAH & PENDIDIKAN
    // ==========================================
    {
      id: 'prod-bell-pintar',
      product_code: 'BELL',
      category_id: 'cat-school',
      slug: 'bell-pintar-sekolah-otomatis',
      name: 'Bell Pintar - Bel Sekolah Otomatis & Alarm Cerdas',
      tagline: 'Bel Sekolah Otomatis Akurat Per Detik, 100% Offline LAN & Kendali Jarak Jauh dari HP Guru Piket',
      description: `🔔 TINGGALKAN BEL MANUAL JADUL. BERALIH KE BELL PINTAR OTOMATIS & CERDAS!

Bell Pintar adalah software bel sekolah otomatis generasi modern berbasis Local-First yang dirancang khusus untuk SD, MI, SMP, MTs, SMA, MA, SMK, Lembaga Kursus, dan Pondok Pesantren di seluruh Indonesia.

🏫 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. 100% Otomatis & Presisi Per Detik: Bunyi bel berdentang otomatis sesuai jadwal pelajaran tanpa perlu ketergantungan operator piket.
2. Kendali Jarak Jauh dari HP Guru Piket (Android Remote LAN): Guru piket dapat membunyikan bel darurat, apel pagi, atau pengumuman dari smartphone tanpa harus ke ruang TU.
3. 119+ Nada Suara Studio 3 Bahasa (Indonesia, Inggris, Arab): Narasi suara jernih kualitas studio rekaman profesional.
4. Studio Pengumuman Text-to-Speech (TTS): Ketik teks pengumuman di komputer atau HP, sistem otomatis membacakan narasi suara jernih ke seluruh speaker sekolah.
5. Mode Khusus Ujian & Bulan Ramadhan: Ganti jadwal reguler ke jadwal ujian atau jam puasa hanya dengan 1 klik.`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB', android: 'Android 7.0+, RAM 1GB' },
      hardware_compat: ['Amplifier / Speaker Sekolah (Jack 3.5mm/RCA)', 'PC Komputer Tata Usaha', 'HP Android Guru Piket'],
      version: 'v2.2.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 215,
      rating: 4.96,
      review_count: 112,
      windows_installer_url: 'https://downloads.pintarlabs.id/bell/BellPintar_Setup_v2.2.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/bell/BellPintar_Remote_Guru.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/bell/Panduan_Lengkap_BellPintar.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/bell/BellPintar_Demo_Trial.exe',
      thumbnail_url: '/images/bellpintar/thumbnail_youtube_bell_pintar.jpg',
      plans: [
        {
          id: 'plan-bell-standard',
          code: 'STANDAR',
          name: 'Paket Standar Sekolah (1 PC TU + Audio Studio)',
          price: 350000,
          original_price: 550000,
          deliverables: ['Installer Windows (.exe)', '119+ Audio Studio 3 Bahasa', 'Serial Key Lifetime', 'Panduan PDF', 'Support 6 Bulan'],
          is_popular: 0
        },
        {
          id: 'plan-bell-complete',
          code: 'LENGKAP',
          name: 'Paket Lengkap Plus Remote Android Guru Piket',
          price: 499000,
          original_price: 750000,
          deliverables: ['Installer Windows (.exe)', 'Aplikasi Remote Android Guru Piket', '119+ Nada Studio & Fitur TTS', 'Bantuan Remote Install AnyDesk', 'Garansi Lifetime'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'AUTO_SCHEDULE', name: 'Jadwal Otomatis Presisi Per Detik', description: 'Jadwal otomatis berulang setiap hari Senin s/d Sabtu.' },
        { code: 'ANDROID_REMOTE', name: 'Remote Control HP Guru Piket via Wi-Fi', description: 'Kendali penuh dari smartphone guru di area sekolah.' },
        { code: 'STUDIO_AUDIO', name: '119+ Audio Narasi 3 Bahasa (ID, EN, AR)', description: 'Suara jernih standar profesional untuk sekolah modern.' },
        { code: 'TTS_SPEAKER', name: 'Text-to-Speech Pengumuman Cerdas', description: 'Membacakan teks pengumuman darurat atau apel secara otomatis.' },
        { code: 'RAMADHAN_EXAM', name: 'Preset Jadwal Ujian & Jam Khusus Ramadhan', description: 'Beralih jam belajar cepat tanpa merusak jadwal utama.' }
      ],
      media: [
        { type: 'image', url: '/images/bellpintar/thumbnail_youtube_bell_pintar.jpg', caption: '3D Mockup Bell Pintar Otomatis Sekolah' },
        { type: 'image', url: '/images/bellpintar/screenshot_dashboard_bell_sekolah.jpg', caption: 'Dashboard Utama Bell Pintar & Jam Digital Presisi' },
        { type: 'image', url: '/images/bellpintar/screenshot_jadwal_bel_sekolah.jpg', caption: 'Tabel Pengaturan Jadwal Jam Pelajaran & Istirahat' },
        { type: 'image', url: '/images/bellpintar/screenshot_remote_android_bell_pintar.jpg', caption: 'Tampilan Aplikasi Remote HP Android Guru Piket' },
        { type: 'image', url: '/images/bellpintar/screenshot_text_to_speech_bell.jpg', caption: 'Studio Pengumuman Text-to-Speech Otomatis' }
      ]
    },
    {
      id: 'prod-pintar-school',
      product_code: 'SCH',
      category_id: 'cat-school',
      slug: 'pintarschool-spp-akademik',
      name: 'PintarSchool SPP & Keuangan Sekolah',
      tagline: 'Manajemen Pembayaran SPP Siswa, Notifikasi Tagihan WhatsApp Otomatis ke Wali Murid & Kas POS Sekolah',
      description: `🏫 DIGITALISASI PEMBAYARAN SPP & KEUANGAN TATA USAHA SEKOLAH BEBAS TUNGGAKAN!

PintarSchool memudahkan bendahara sekolah dalam mencatat iuran SPP, uang gedung, seragam, buku, dan kegiatan siswa dengan integrasi kwitansi thermal serta notifikasi WhatsApp resmi kepada orang tua murid.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Notifikasi WhatsApp Otomatis ke Wali Murid: Kirim rekap tagihan dan kwitansi pembayaran langsung ke nomor WhatsApp orang tua murid tanpa biaya gateway per pesan.
2. Kartu SPP Digital & Barcode Siswa: Cukup scan barcode kartu pelajar siswa untuk menampilkan seluruh riwayat tunggakan dalam 1 detik.
3. Rekonsiliasi Kas Bendahara & Laporan BOS: Laporan keuangan otomatis sesuai format pelaporan pertanggungjawaban BOS dan komite sekolah.
4. 100% Offline LAN Ready: Sistem dapat berjalan di jaringan lokal sekolah tanpa khawatir kendala koneksi internet lambat.`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11, RAM 4GB' },
      hardware_compat: ['Printer Thermal 58/80mm', 'Printer Inkjet A4', 'Barcode Scanner 1D/2D'],
      version: 'v3.1.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 176,
      rating: 4.93,
      review_count: 78,
      windows_installer_url: 'https://downloads.pintarlabs.id/school/PintarSchool_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/school/Buku_Panduan_PintarSchool.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/school/PintarSchool_Demo.exe',
      thumbnail_url: '/images/promos/pintarschool_promo_banner.jpg',
      plans: [
        {
          id: 'plan-sch-single',
          code: 'SINGLE',
          name: 'Paket Single Komputer TU Bendahara',
          price: 550000,
          original_price: 850000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen', 'Modul WhatsApp Notifikasi', 'Support 6 Bulan'],
          is_popular: 0
        },
        {
          id: 'plan-sch-multi',
          code: 'MULTI',
          name: 'Paket Multi-User TU & Komite (Hingga 3 Komputer LAN)',
          price: 890000,
          original_price: 1400000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi 3 Komputer LAN', 'Modul Cetak Kartu Berfoto', 'Support Prioritas 1 Tahun'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'WHATSAPP_BILL', name: 'Kirim Notifikasi Kwitansi & Tagihan via WA', description: 'Otomatis mengirim bukti bayar ke HP orang tua siswa.' },
        { code: 'STUDENT_BARCODE', name: 'Scan Kartu Pelajar Cepat 1 Detik', description: 'Menampilkan data tagihan siswa instan tanpa ketik nama.' },
        { code: 'MULTI_POS', name: 'Manajemen Multi Pos Iuran Siswa', description: 'Kelola SPP, uang seragam, ujian, dan kegiatan dalam 1 sistem.' },
        { code: 'BOS_REPORT', name: 'Format Laporan Keuangan Standar BOS', description: 'Ekspor laporan penerimaan kas dan tunggakan ke format Excel.' }
      ],
      media: [
        { type: 'image', url: '/images/promos/pintarschool_promo_banner.jpg', caption: '3D Tampilan Showcase PintarSchool SPP' },
        { type: 'image', url: '/images/mockups/cbt_4_analytics.svg', caption: 'Dashboard Penerimaan Kas SPP & Grafik Tunggakan' },
        { type: 'image', url: '/images/mockups/perpus_2_barcode.svg', caption: 'Form Transaksi Pembayaran SPP & Scan Kartu Siswa' },
        { type: 'image', url: '/images/mockups/visitor_3_wa.svg', caption: 'Modul Pengiriman Pesan WhatsApp Notifikasi Tagihan' },
        { type: 'image', url: '/images/mockups/asset_4_maintenance.svg', caption: 'Laporan Rekapitulasi Kas Masuk per Kelas & Angkatan' }
      ]
    },
    {
      id: 'prod-pintar-cbt',
      product_code: 'CBT',
      category_id: 'cat-school',
      slug: 'pintarcbt-ujian-komputer-anti-curang',
      name: 'PintarCBT Ujian Komputer Anti-Curang',
      tagline: 'Aplikasi Ujian Berbasis Komputer & HP (LAN Offline) dengan Browser Lockdown & Analisis Butir Soal',
      description: `📝 LAKSANAKAN UJIAN SEKOLAH TANPA KERTAS, 100% OFFLINE & BEBAS KECURANGAN!

PintarCBT adalah platform Computer Based Test mandiri untuk Asesmen Sumatif, UTS, UAS, dan Tryout Ujian Sekolah yang dapat diakses dari Komputer Lab, Laptop, maupun HP Android siswa via Wi-Fi lokal tanpa internet.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Browser Lockdown Anti-Curang: Layar ujian terkunci otomatis; siswa tidak dapat membuka tab lain, screenshot, split screen, atau keluar aplikasi saat ujian.
2. Bank Soal Fleksibel (Import Word/Excel): Mendukung soal Pilihan Ganda, Essay, Menjodohkan, Audio Listening Bahasa Inggris, dan Simbol Rumus Matematika / Arab.
3. Pengacakan Soal & Opsi Jawaban: Tiap siswa mendapatkan urutan soal dan pilihan ganda yang berbeda untuk mencegah saling mencontek.
4. Koreksi & Analisis Nilai Instan: Nilai ujian langsung keluar saat siswa submit, lengkap dengan analisis daya pembeda dan tingkat kesukaran butir soal.`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11 (Server Lab), RAM 8GB' },
      hardware_compat: ['Komputer PC / Laptop Siswa', 'HP Android Siswa', 'Router Wi-Fi Access Point Lab'],
      version: 'v4.0.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 165,
      rating: 4.95,
      review_count: 72,
      windows_installer_url: 'https://downloads.pintarlabs.id/cbt/PintarCBT_Server_Setup.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/cbt/PintarCBT_Lockdown_Student.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/cbt/Panduan_Admin_PintarCBT.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/cbt/PintarCBT_Demo.exe',
      thumbnail_url: '/images/promos/pintarcbt_ujian_promo_banner.jpg',
      plans: [
        {
          id: 'plan-cbt-standard',
          code: 'STANDAR',
          name: 'Paket Server Sekolah Standar (Hingga 200 Siswa Serentak)',
          price: 650000,
          original_price: 1100000,
          deliverables: ['Installer Server Windows (.exe)', 'Aplikasi Client Lockdown Android/PC', 'Lisensi Lifetime Server', 'Support 6 Bulan'],
          is_popular: 1
        },
        {
          id: 'plan-cbt-unlimited',
          code: 'UNLIMITED',
          name: 'Paket Server Unlimited Siswa (Multi-Server Lab)',
          price: 1150000,
          original_price: 1900000,
          deliverables: ['Installer Server Unlimited', 'Template Bank Soal Word/Excel Lengkap', 'Bantuan Remote Setting Jaringan', 'Support 1 Tahun'],
          is_popular: 0
        }
      ],
      features: [
        { code: 'LOCKDOWN_SEC', name: 'Browser Lockdown Fullscreen Anti-Buka Tab', description: 'Siswa terkunci total dan otomatis terdeteksi jika curang.' },
        { code: 'OFFLINE_LAN', name: '100% Server Lokal LAN Tanpa Kuota Internet', description: 'Ujian tetap berlangsung aman meski internet terputus.' },
        { code: 'RANDOMIZE', name: 'Acak Nomor Soal & Opsi Pilihan Ganda', description: 'Urutan butir soal dan kunci jawaban berbeda tiap siswa.' },
        { code: 'INSTANT_GRADE', name: 'Koreksi Otomatis & Analisis Butir Soal', description: 'Nilai dan analisis tingkat kesukaran terbit instan.' }
      ],
      media: [
        { type: 'image', url: '/images/promos/pintarcbt_ujian_promo_banner.jpg', caption: '3D Banner Suasana Ujian CBT di Lab Komputer Sekolah' },
        { type: 'image', url: '/images/mockups/cbt_1_exam.svg', caption: 'Tampilan Lembar Ujian Siswa dengan Timer & Soal Audio' },
        { type: 'image', url: '/images/mockups/cbt_2_monitor.svg', caption: 'Dashboard Live Monitoring Status Siswa oleh Pengawas' },
        { type: 'image', url: '/images/mockups/cbt_3_question.svg', caption: 'Bank Soal Multi-Tipe & Generator Soal Matematika' },
        { type: 'image', url: '/images/mockups/cbt_4_analytics.svg', caption: 'Hasil Nilai & Analisis Daya Pembeda Butir Soal' }
      ]
    },
    {
      id: 'prod-pintar-perpus',
      product_code: 'LIB',
      category_id: 'cat-school',
      slug: 'pintarperpus-digital-barcode-isbn',
      name: 'PintarPerpus Digital & Barcode ISBN',
      tagline: 'Software Perpustakaan Sekolah Terintegrasi SLiMS, Cetak Kartu Anggota Barcode & Peminjaman Mandiri',
      description: `📚 KELOLA PERPUSTAKAAN SEKOLAH DENGAN STANDAR AKREDITASI MODERN!

PintarPerpus membantu pustakawan sekolah dalam katalogisasi ribuan buku, pencatatan sirkulasi peminjaman/pengembalian, cetak kartu anggota berbarcode, hingga kalkulasi denda otomatis.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Smart OPAC (Online Public Access Catalog): Layar pencarian buku layar sentuh untuk siswa mencari buku berdasarkan judul, pengarang, atau nomor rak.
2. Sirkulasi Super Cepat (Scan Barcode 2 Detik): Proses peminjaman dan pengembalian buku selesai dalam sekejap dengan barcode scanner.
3. Desain & Cetak Kartu Anggota Berfoto: Cetak kartu perpustakaan siswa dan guru secara massal dengan format barcode siap pakai.
4. Laporan Statistik Kunjungan Standar Akreditasi: Grafik buku paling diminati, jumlah pengunjung harian, dan rekapitulasi buku inventaris.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB' },
      hardware_compat: ['Barcode Scanner 1D/2D', 'Printer Laserjet/Inkjet Kartu & Label Barcode', 'Printer Struk Thermal Peminjaman'],
      version: 'v2.6.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 118,
      rating: 4.89,
      review_count: 53,
      windows_installer_url: 'https://downloads.pintarlabs.id/lib/PintarPerpus_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/lib/Manual_PintarPerpus.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/lib/PintarPerpus_Demo.exe',
      thumbnail_url: '/images/mockups/perpus_1_catalog.svg',
      plans: [
        {
          id: 'plan-lib-single',
          code: 'SINGLE',
          name: 'Paket Lisensi Perpustakaan Sekolah',
          price: 450000,
          original_price: 700000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen', 'Modul Cetak Label Barcode Buku', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'OPAC_SEARCH', name: 'Katalog Pencarian Buku Digital (OPAC)', description: 'Pencarian cepat lokasi rak buku bagi para siswa.' },
        { code: 'FAST_CIRCULATION', name: 'Sirkulasi Peminjaman & Pengembalian Barcode', description: 'Transaksi buku cepat dan pencatatan denda otomatis.' },
        { code: 'CARD_MAKER', name: 'Generator & Cetak Kartu Anggota Barcode', description: 'Cetak kartu anggota berfoto langsung dari sistem.' },
        { code: 'ACCREDIT_REP', name: 'Laporan Statistik untuk Borang Akreditasi', description: 'Data pengunjung dan inventaris buku siap cetak.' }
      ],
      media: [
        { type: 'image', url: '/images/mockups/perpus_1_catalog.svg', caption: 'Katalog Digital OPAC & Pencarian Buku Perpustakaan' },
        { type: 'image', url: '/images/mockups/perpus_2_barcode.svg', caption: 'Form Sirkulasi Peminjaman Buku via Barcode Scanner' },
        { type: 'image', url: '/images/mockups/perpus_3_card.svg', caption: 'Modul Desain & Cetak Kartu Anggota Perpustakaan' },
        { type: 'image', url: '/images/mockups/perpus_4_report.svg', caption: 'Laporan Statistik Kunjungan & Buku Terpopuler' }
      ]
    },
    {
      id: 'prod-pintar-bk',
      product_code: 'BK',
      category_id: 'cat-school',
      slug: 'pintarbk-konseling-poin-kedisiplinan',
      name: 'PintarBK Konseling & Poin Kedisiplinan Siswa',
      tagline: 'Pencatatan Poin Pelanggaran & Prestasi Siswa, Rekam Medis Konseling & Cetak Surat Panggilan Wali Murid',
      description: `🤝 BANTU GURU BK DAN KESISWAAN MEMBINA KARAKTER SISWA DENGAN DATA TERUKUR!

PintarBK adalah sistem informasi bimbingan konseling dan ketertiban siswa yang mendokumentasikan poin prestasi, poin pelanggaran tata tertib, riwayat penanganan kasus, serta surat panggilan orang tua secara otomatis.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Akumulasi Poin Pelanggaran & Prestasi Otomatis: Setiap pelanggaran (terlambat, bolos, atribut) dan prestasi (juara lomba, hafalan) terhitung dalam skor karakter siswa.
2. Otomatis Terbitkan Surat Panggilan Orang Tua: Saat poin pelanggaran menyentuh batas tertentu (Peringatan 1, 2, atau 3), sistem langsung menyiapkan draf surat panggilan resmi ber-kop sekolah.
3. Kerahasiaan Catatan Konseling Terenkripsi: Riwayat konseling pribadi siswa dilindungi password khusus guru BK untuk menjamin etika privasi.
4. Laporan Grafik Tren Kedisiplinan Sekolah: Evaluasi berkala untuk Kepala Sekolah mengenai tingkat kedisiplinan per kelas dan per jurusan.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB' },
      hardware_compat: ['Komputer Guru BK & Kesiswaan', 'Printer Inkjet / Laserjet A4'],
      version: 'v2.0.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 89,
      rating: 4.91,
      review_count: 38,
      windows_installer_url: 'https://downloads.pintarlabs.id/bk/PintarBK_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/bk/Manual_PintarBK.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/bk/PintarBK_Demo.exe',
      thumbnail_url: '/images/mockups/bk_1_dashboard.svg',
      plans: [
        {
          id: 'plan-bk-single',
          code: 'SINGLE',
          name: 'Paket Lisensi Ruang Guru BK',
          price: 390000,
          original_price: 600000,
          deliverables: ['Installer Windows (.exe)', 'Template Surat Panggilan Lengkap', 'Lisensi Permanen', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'POINT_SYSTEM', name: 'Sistem Poin Pelanggaran & Prestasi Siswa', description: 'Kalkulasi otomatis skor kedisiplinan dan apresiasi prestasi.' },
        { code: 'AUTO_CALL_LETTER', name: 'Cetak Otomatis Surat Panggilan Wali Murid', description: 'Draf surat resmi terbit otomatis saat poin melewati batas.' },
        { code: 'CONFIDENTIAL', name: 'Enkripsi Catatan Kasus Konseling', description: 'Privasi data masalah siswa terjamin aman dengan kata sandi.' },
        { code: 'CHARACTER_REP', name: 'Raport Karakter & Statistik Kedisiplinan', description: 'Laporan berkala untuk evaluasi kepala sekolah.' }
      ],
      media: [
        { type: 'image', url: '/images/mockups/bk_1_dashboard.svg', caption: 'Dashboard Rekapitulasi Poin Kedisiplinan & Prestasi' },
        { type: 'image', url: '/images/mockups/bk_2_incident.svg', caption: 'Form Input Kejadian Pelanggaran & Catatan Konseling' },
        { type: 'image', url: '/images/mockups/bk_3_letters.svg', caption: 'Generator Surat Panggilan Orang Tua Berkop Resmi' },
        { type: 'image', url: '/images/mockups/bk_4_analytics.svg', caption: 'Grafik Tren Perilaku & Evaluasi Kesiswaan' }
      ]
    },

    // ==========================================
    // KATEGORI 3: PERKANTORAN & KORPORAT
    // ==========================================
    {
      id: 'prod-pintar-attend',
      product_code: 'ATTEND',
      category_id: 'cat-office',
      slug: 'biometrik-absensi-digital-geofencing',
      name: 'PintarAttend Biometrik & GPS Geofencing',
      tagline: 'Presensi Wajah AI Anti-Fake GPS, Geotagging Radius Kantor WFH/WFO & Rekap Payroll Gaji Otomatis',
      description: `📍 APLIKASI ABSENSI KARYAWAN MODERN DENGAN VERIFIKASI WAJAH AI & GEOLOKASI ANTI-CURANG!

PintarAttend menggabungkan aplikasi mobile karyawan (Android) dengan dashboard HRD perkantoran untuk memantau kehadiran, keterlambatan, cuti, lembur, dan klaim dinas luar secara real-time.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Deteksi Wajah AI & Anti-Foto/Fake GPS: Memverifikasi kehadiran dengan teknologi pengenalan wajah langsung (liveness detection) dan memblokir aplikasi fake GPS/mock location.
2. Geofencing Radius Kantor Fleksibel: Karyawan hanya dapat melakukan clock-in jika berada di dalam radius koordinat kantor yang telah ditentukan (misal 50 meter).
3. Modul Karyawan Lapangan & Dinas Luar: Dilengkapi fitur geotagging foto bukti kunjungan klien untuk staf sales dan teknisi lapangan.
4. Export Rekapitulasi Gaji & Payroll: Menghitung total jam kerja, potongan terlambat, dan tunjangan kehadiran otomatis ke format Excel/Payroll.`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11 (Dashboard HRD)', android: 'Android 8.0+, RAM 2GB' },
      hardware_compat: ['Smartphone Android Karyawan (Kamera & GPS)', 'PC / Laptop Admin HRD'],
      version: 'v3.3.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 240,
      rating: 4.94,
      review_count: 105,
      windows_installer_url: 'https://downloads.pintarlabs.id/attend/PintarAttend_Dashboard.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/attend/PintarAttend_Employee.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/attend/Panduan_PintarAttend.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/attend/PintarAttend_Demo.exe',
      thumbnail_url: '/images/promos/biometric_attend_promo_banner.jpg',
      plans: [
        {
          id: 'plan-att-standard',
          code: 'STANDAR',
          name: 'Paket Kantor Berkembang (Hingga 50 Karyawan)',
          price: 590000,
          original_price: 950000,
          deliverables: ['Dashboard Admin Windows (.exe)', 'Aplikasi Android Karyawan', 'Lisensi Lifetime 50 User', 'Support 6 Bulan'],
          is_popular: 1
        },
        {
          id: 'plan-att-enterprise',
          code: 'ENTERPRISE',
          name: 'Paket Unlimited Perusahaan (Multi-Cabang)',
          price: 1100000,
          original_price: 1800000,
          deliverables: ['Dashboard Multi-Cabang', 'Unlimited Karyawan', 'Modul Payroll Gaji Lengkap', 'Support 1 Tahun'],
          is_popular: 0
        }
      ],
      features: [
        { code: 'FACE_RECOG', name: 'Face Match AI & Liveness Detection', description: 'Cegah titip absen dengan verifikasi biometrik wajah asli.' },
        { code: 'GEOFENCING', name: 'Geofencing GPS Radius Kantor Ketat', description: 'Absensi hanya sah jika berada di dalam radius koordinat kantor.' },
        { code: 'ANTI_FAKE_GPS', name: 'Deteksi & Blokir Otomatis Fake GPS', description: 'Mendeteksi mock location dan aplikasi modifikasi.' },
        { code: 'PAYROLL_CALC', name: 'Rekapitulasi Jam Kerja & Potongan Gaji', description: 'Ekspor laporan kehadiran langsung siap proses penggajian.' }
      ],
      media: [
        { type: 'image', url: '/images/promos/biometric_attend_promo_banner.jpg', caption: '3D Showcase Presensi Biometrik Wajah AI PintarAttend' },
        { type: 'image', url: '/images/mockups/asset_1_dashboard.svg', caption: 'Dashboard Utama HRD Monitoring Kehadiran Karyawan' },
        { type: 'image', url: '/images/mockups/bansos_1_map.svg', caption: 'Peta Geofencing Lokasi Kantor & Presensi Lapangan' },
        { type: 'image', url: '/images/mockups/helpdesk_4_csat.svg', caption: 'Rekapitulasi Keterlambatan, Izin & Lembur Karyawan' },
        { type: 'image', url: '/images/mockups/asset_2_depreciation.svg', caption: 'Perhitungan Otomatis Tunjangan & Payroll Gaji' }
      ]
    },
    {
      id: 'prod-pintar-asset',
      product_code: 'ASSET',
      category_id: 'cat-office',
      slug: 'pintarasset-inventaris-depresiasi-kantor',
      name: 'PintarAsset Inventaris & Depresiasi Kantor',
      tagline: 'Manajemen Aset Perusahaan, Label QR Code, Perhitungan Depresiasi Akuntansi & Jadwal Servis Berkala',
      description: `🏢 KONTROL KESELURUHAN ASET & INVENTARIS PERUSAHAAN SECARA PROFESIONAL!

PintarAsset memudahkan divisi General Affairs (GA) dan Akuntansi dalam melacak ribuan inventaris kantor (laptop, kendaraan, furnitur, mesin pabrik), lokasi penempatan, penanggung jawab, hingga nilai buku penyusutan aset.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Kalkulator Depresiasi Akuntansi Otomatis: Menghitung nilai penyusutan aset menggunakan metode Garis Lurus (Straight-Line) atau Saldo Menurun ganda sesuai standar perpustakaan PSAK dan pajak.
2. Generator Label Stiker QR Code & Barcode: Cetak stiker QR Code tahan air untuk ditempelkan pada fisik aset kantor.
3. Log Riwayat Servis & Pengingat Maintenance: Peringatan otomatis jadwal ganti oli kendaraan, servis berkala AC, dan kalibrasi mesin.
4. Riwayat Mutasi Antar Ruangan & Cabang: Setiap perpindahan barang terdokumentasi lengkap dengan berita acara serah terima.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB' },
      hardware_compat: ['Printer Label Barcode / QR Code Thermal', 'Barcode Scanner 2D QR', 'Printer Laporan A4'],
      version: 'v2.4.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 132,
      rating: 4.91,
      review_count: 59,
      windows_installer_url: 'https://downloads.pintarlabs.id/asset/PintarAsset_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/asset/Panduan_PintarAsset.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/asset/PintarAsset_Demo.exe',
      thumbnail_url: '/images/mockups/asset_1_dashboard.svg',
      plans: [
        {
          id: 'plan-asset-single',
          code: 'SINGLE',
          name: 'Paket Lisensi GA & Aset Kantor',
          price: 490000,
          original_price: 750000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen', 'Modul Depresiasi & QR Label', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'DEPRECIATION', name: 'Kalkulator Penyusutan Nilai Aset Otomatis', description: 'Metode Garis Lurus & Saldo Menurun standar akuntansi.' },
        { code: 'QR_LABEL', name: 'Cetak Stiker Label QR Code Inventaris', description: 'Format cetak label stiker inventaris siap tempel.' },
        { code: 'MAINTENANCE_LOG', name: 'Jadwal Servis Berkala & Riwayat Biaya', description: 'Pengingat otomatis maintenance kendaraan dan perangkat.' },
        { code: 'MUTASI_BERKAS', name: 'Berita Acara Mutasi & Peminjaman Aset', description: 'Riwayat penanggung jawab barang tercatat rapi.' }
      ],
      media: [
        { type: 'image', url: '/images/mockups/asset_1_dashboard.svg', caption: 'Dashboard Inventaris Aset & Total Nilai Buku Perusahaan' },
        { type: 'image', url: '/images/mockups/asset_2_depreciation.svg', caption: 'Tabel Perhitungan Depresiasi Penyusutan Tahunan' },
        { type: 'image', url: '/images/mockups/asset_3_qrlabel.svg', caption: 'Modul Cetak Label QR Code & Stiker Aset' },
        { type: 'image', url: '/images/mockups/asset_4_maintenance.svg', caption: 'Jadwal Pemeliharaan / Maintenance & Mutasi Barang' }
      ]
    },
    {
      id: 'prod-pintar-surat',
      product_code: 'SURAT',
      category_id: 'cat-office',
      slug: 'pintarsurat-arsip-digital-disposisi',
      name: 'PintarSurat & Arsip Digital Disposisi',
      tagline: 'Buku Agenda Surat Masuk/Keluar, Lembar Disposisi Digital Berjenjang Direksi & Arsip Dokumen PDF OCR',
      description: `📁 TERTIBKAN TATA PERSURATAN KANTOR & ARSIP DOKUMEN DALAM 1 SISTEM DIGITAL!

PintarSurat dirancang untuk sekretariat, tata usaha, dan manajemen kantor agar surat masuk, surat keluar, penomoran otomatis, alur disposisi pimpinan, dan pencarian dokumen lama dapat dilakukan secara instan.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Alur Disposisi Digital Berjenjang: Pimpinan dapat memberikan instruksi disposisi dari komputer/laptop langsung ke kepala divisi terkait.
2. Penomoran Surat Otomatis Berdasarkan Klasifikasi: Format penomoran surat resmi tersusun otomatis sesuai kode klasifikasi kantor Anda.
3. Fast Full-Text Search Dokumen PDF (OCR Ready): Cari surat bertahun-tahun lalu dalam 1 detik cukup dengan mengetik kata kunci perihal atau nama pengirim.
4. Cetak Lembar Pengantar & Kartu Kendali: Format standar kearsipan nasional siap cetak untuk dokumen fisik.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB' },
      hardware_compat: ['Scanner Dokumen ADF (Canon/Epson/Fujitsu)', 'Printer A4'],
      version: 'v2.3.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 110,
      rating: 4.87,
      review_count: 46,
      windows_installer_url: 'https://downloads.pintarlabs.id/surat/PintarSurat_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/surat/Panduan_PintarSurat.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/surat/PintarSurat_Demo.exe',
      thumbnail_url: '/images/mockups/surat_1_agenda.svg',
      plans: [
        {
          id: 'plan-surat-single',
          code: 'SINGLE',
          name: 'Paket Lisensi Tata Usaha & Sekretariat',
          price: 450000,
          original_price: 700000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen', 'Modul Disposisi Digital', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'AGENDA_AUTO', name: 'Buku Agenda Surat Masuk & Keluar Otomatis', description: 'Pencatatan nomor urut dan pengarsipan berkas PDF.' },
        { code: 'DISPOSISI_E', name: 'Lembar Disposisi Digital Pimpinan', description: 'Instruksi tindakan pimpinan ke bawahan secara terstruktur.' },
        { code: 'FAST_SEARCH_OCR', name: 'Pencarian Instan Surat Dokumen Arsip', description: 'Temukan arsip dalam sekejap berdasarkan kata kunci.' },
        { code: 'KODE_KLASIFIKASI', name: 'Sistem Penomoran Kode Surat Custom', description: 'Format penomoran surat otomatis anti-nomor ganda.' }
      ],
      media: [
        { type: 'image', url: '/images/mockups/surat_1_agenda.svg', caption: 'Buku Agenda Digital Surat Masuk & Surat Keluar' },
        { type: 'image', url: '/images/mockups/surat_2_disposisi.svg', caption: 'Form Lembar Disposisi Digital Pimpinan ke Staff' },
        { type: 'image', url: '/images/mockups/surat_3_search.svg', caption: 'Pencarian Cepat Berkas Dokumen PDF Terarsip' },
        { type: 'image', url: '/images/mockups/surat_4_report.svg', caption: 'Laporan Rekapitulasi Surat & Statistik Tata Usaha' }
      ]
    },
    {
      id: 'prod-pintar-helpdesk',
      product_code: 'HELPDESK',
      category_id: 'cat-office',
      slug: 'pintarhelpdesk-it-support-ticket',
      name: 'PintarHelpdesk & IT Support Ticket',
      tagline: 'Sistem Tiket Penanganan Masalah Internal Kantor, SLA Tracker, Penugasan Teknisi & Knowledge Base',
      description: `🎫 KELOLA KELUHAN TEKNIS KARYAWAN & PERAWATAN FASILITAS DENGAN TIKET TERUKUR!

PintarHelpdesk adalah sistem pelaporan gangguan operasional (komputer rusak, jaringan lambat, printer error, AC mati) agar tim IT Support dan GA dapat merespon cepat sesuai Service Level Agreement (SLA).

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Antrean Tiket Terpusat & Prioritas SLA: Klasifikasi keluhan berdasarkan tingkat urgensi (Kritis, Sedang, Rendah) dengan penghitung mundur waktu SLA.
2. Penugasan Otomatis ke Tim Teknisi: Distribusi tugas otomatis ke teknisi yang sedang standby beserta notifikasi pengerjaan.
3. Knowledge Base Solusi Mandiri: Kumpulan panduan solusi cepat masalah umum agar karyawan dapat mengatasi error ringan secara mandiri.
4. Laporan Kinerja Staf & Rating Kepuasan (CSAT): Evaluasi waktu rata-rata penyelesaian masalah dan rating kepuasan user.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB' },
      hardware_compat: ['PC Server / Komputer Kantor LAN', 'Browser Desktop / Mobile'],
      version: 'v2.2.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 85,
      rating: 4.88,
      review_count: 34,
      windows_installer_url: 'https://downloads.pintarlabs.id/helpdesk/PintarHelpdesk_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/helpdesk/Panduan_Helpdesk.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/helpdesk/PintarHelpdesk_Demo.exe',
      thumbnail_url: '/images/mockups/helpdesk_1_tickets.svg',
      plans: [
        {
          id: 'plan-hd-single',
          code: 'SINGLE',
          name: 'Paket Lisensi Helpdesk Kantor',
          price: 490000,
          original_price: 750000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen', 'Modul SLA & Knowledge Base', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'TICKET_QUEUE', name: 'Antrean Tiket Gangguan & Prioritas Masalah', description: 'Pelacakan status pengerjaan tiket dari open hingga closed.' },
        { code: 'SLA_COUNTDOWN', name: 'Monitoring Waktu Tanggap SLA Perusahaan', description: 'Penghitung batas waktu maksimal penyelesaian perbaikan.' },
        { code: 'KB_SELF_SERVICE', name: 'Bank Solusi Cepat (Knowledge Base)', description: 'Panduan mandiri untuk penanganan kendala umum.' },
        { code: 'CSAT_METRIC', name: 'Rating Kepuasan & Laporan Kinerja Teknisi', description: 'Statistik efektivitas tim support kantor Anda.' }
      ],
      media: [
        { type: 'image', url: '/images/mockups/helpdesk_1_tickets.svg', caption: 'Antrean Tiket Masalah & Status Pengerjaan Real-time' },
        { type: 'image', url: '/images/mockups/helpdesk_2_assign.svg', caption: 'Form Penugasan Teknisi & Log Suku Cadang' },
        { type: 'image', url: '/images/mockups/helpdesk_3_kb.svg', caption: 'Knowledge Base Solusi Mandiri Kendala Operasional' },
        { type: 'image', url: '/images/mockups/helpdesk_4_csat.svg', caption: 'Evaluasi Rating CSAT & Waktu Rata-rata Tanggap' }
      ]
    },
    {
      id: 'prod-pintar-visitor',
      product_code: 'VISITOR',
      category_id: 'cat-office',
      slug: 'pintarvisitor-buku-tamu-akses-qr',
      name: 'PintarVisitor Buku Tamu & Akses QR Code',
      tagline: 'Kiosk Buku Tamu Digital Touchscreen, Foto Wajah/KTP, Cetak ID Badge Thermal & Notifikasi WhatsApp Staf',
      description: `🚪 TINGGALKAN BUKU TAMU KERTAS KUNO! BERALIH KE KIOSK BUKU TAMU DIGITAL RESEPSIONIS!

PintarVisitor mentransformasi meja resepsionis dan pos keamanan lobi kantor menjadi modern dengan layar sentuh registrasi tamu, pengambilan foto pengunjung, pencetakan stiker badge barcode, serta notifikasi instan ke staf yang dituju.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Registrasi Kiosk Mandiri Touchscreen: Tamu cukup mengisi nama, instansi, dan keperluan pada layar monitor kiosk resepsionis.
2. Notifikasi WhatsApp Otomatis ke Karyawan: Saat tamu check-in, karyawan yang dituju langsung menerima pesan WA: "Bapak/Ibu, tamu Anda (Nama Tamu) telah tiba di lobi".
3. Cetak Stiker Visitor Badge Thermal: Otomatis mencetak label ID tamu berfoto dan ber-QR code untuk akses pintu gerbang.
4. Monitoring Keamanan & Log Jam Keluar (Check-out): Petugas keamanan mengetahui secara persis berapa orang tamu yang masih berada di dalam gedung.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB' },
      hardware_compat: ['Layar Sentuh Touchscreen / Monitor PC', 'Kamera Webcam HD', 'Printer Stiker Thermal 80mm / 100mm'],
      version: 'v2.1.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 94,
      rating: 4.90,
      review_count: 41,
      windows_installer_url: 'https://downloads.pintarlabs.id/visitor/PintarVisitor_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/visitor/Panduan_Visitor.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/visitor/PintarVisitor_Demo.exe',
      thumbnail_url: '/images/mockups/visitor_1_kiosk.svg',
      plans: [
        {
          id: 'plan-vis-single',
          code: 'SINGLE',
          name: 'Paket Lisensi Kiosk Resepsionis Gedung',
          price: 490000,
          original_price: 750000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen Kiosk', 'Modul WhatsApp Notifikasi & Badge', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'TOUCH_KIOSK', name: 'Antarmuka Kiosk Touchscreen Elegan', description: 'Pengisian mandiri cepat oleh tamu di meja resepsionis.' },
        { code: 'PHOTO_CAPTURE', name: 'Pengambilan Foto Wajah / Kartu Identitas', description: 'Dokumentasi visual pengunjung demi keamanan gedung.' },
        { code: 'WA_GATEWAY', name: 'Notifikasi WhatsApp Otomatis ke Karyawan', description: 'Memberitahu staf seketika saat tamu tiba di lobi.' },
        { code: 'THERMAL_BADGE', name: 'Cetak Stiker ID Badge Tamu Berbarcode', description: 'Identitas resmi pengunjung selama di area perusahaan.' }
      ],
      media: [
        { type: 'image', url: '/images/mockups/visitor_1_kiosk.svg', caption: 'Tampilan Kiosk Registrasi Tamu Touchscreen & Kamera' },
        { type: 'image', url: '/images/mockups/visitor_2_badge.svg', caption: 'Desain Cetak Stiker ID Badge Tamu dengan Barcode' },
        { type: 'image', url: '/images/mockups/visitor_3_wa.svg', caption: 'Notifikasi Otomatis WhatsApp ke HP Staf yang Dituju' },
        { type: 'image', url: '/images/mockups/visitor_4_log.svg', caption: 'Buku Log Kehadiran Tamu Harian & Jam Check-out' }
      ]
    },

    // ==========================================
    // KATEGORI 4: PEMERINTAHAN DESA & KELURAHAN
    // ==========================================
    {
      id: 'prod-sipintar-desa',
      product_code: 'DESA',
      category_id: 'cat-desa',
      slug: 'sipintar-administrasi-surat-desa',
      name: 'SiPintar Pelayanan & Administrasi Surat Desa',
      tagline: 'Sistem Informasi Desa Terpadu, 100+ Template Surat Keterangan NIK Terintegrasi & Verifikasi QR Code TTE',
      description: `🏛️ PERCEPAT PELAYANAN ADMINISTRASI WARGA DESA DENGAN SISTEM SURAT OTOMATIS 1 MENIT JADI!

SiPintar Desa adalah aplikasi administrasi kependudukan dan surat-menyurat resmi untuk Kantor Kepala Desa dan Kelurahan. Cukup ketik NIK warga, semua formulir surat keterangan otomatis terisi lengkap dengan kop dan nomor surat resmi.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. 100+ Template Surat Resmi Kemendagri Lengkap: Surat Keterangan Usaha (SKU), Domisili, Tidak Mampu (SKTM), Kematian, Kelahiran, Pindah, Keterangan Nikah (N1-N4), hingga Keterangan Tanah.
2. Integrasi Database Kependudukan NIK & No. KK: Data biodata warga, anggota keluarga, dan RT/RW langsung terisi otomatis tanpa perlu ketik ulang manual.
3. Tanda Tangan Elektronik & Verifikasi QR Code: Dokumen surat dilengkapi QR Code unik yang dapat discan untuk memverifikasi keaslian surat anti-pemalsuan.
4. 100% Offline LAN Aman: Data privasi kependudukan warga tersimpan di komputer desa tanpa risiko kebocoran data di server luar.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 4GB' },
      hardware_compat: ['Printer Laserjet / Inkjet A4 & F4', 'Barcode / QR Scanner', 'PC Kantor Desa'],
      version: 'v3.5.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 280,
      rating: 4.97,
      review_count: 135,
      windows_installer_url: 'https://downloads.pintarlabs.id/desa/SiPintarDesa_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/desa/Buku_Panduan_SiPintar_Desa.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/desa/SiPintarDesa_Demo.exe',
      thumbnail_url: '/images/promos/sipintar_desa_promo_banner.jpg',
      plans: [
        {
          id: 'plan-desa-standard',
          code: 'STANDAR',
          name: 'Paket Kantor Pelayanan Desa (Single PC)',
          price: 650000,
          original_price: 1100000,
          deliverables: ['Installer Windows (.exe)', '100+ Template Surat Resmi', 'Lisensi Permanen Desa', 'Support 6 Bulan'],
          is_popular: 1
        },
        {
          id: 'plan-desa-multi',
          code: 'MULTI',
          name: 'Paket Multi-Loket Pelayanan Desa (3 Komputer LAN)',
          price: 1200000,
          original_price: 2000000,
          deliverables: ['Installer Multi-PC LAN', 'Modul Ekspor Format Kemendagri', 'Bantuan Input Data Awal Warga', 'Support 1 Tahun'],
          is_popular: 0
        }
      ],
      features: [
        { code: 'TEMPLATE_100', name: '100+ Template Surat Keterangan Resmi', description: 'SKU, SKTM, Domisili, N1-N4, Kelahiran, Kematian, dll.' },
        { code: 'NIK_DATABASE', name: 'Pencarian NIK & Otomatisasi Biodata Warga', description: 'Surat terbit dalam 1 menit tanpa salah ketik data warga.' },
        { code: 'QR_VERIFY', name: 'Verifikasi Keaslian Surat via QR Code TTE', description: 'Mencegah pemalsuan cap dan tanda tangan kepala desa.' },
        { code: 'REKAP_PENDUDUK', name: 'Statistik Kependudukan RT/RW & Piramida Usia', description: 'Laporan demografi penduduk siap cetak untuk kecamatan.' }
      ],
      media: [
        { type: 'image', url: '/images/promos/sipintar_desa_promo_banner.jpg', caption: '3D Mockup Sistem Pelayanan Surat Kantor Desa SiPintar' },
        { type: 'image', url: '/images/mockups/surat_1_agenda.svg', caption: 'Menu Pembuatan Surat & Pencarian Cepat Biodata NIK' },
        { type: 'image', url: '/images/mockups/surat_2_disposisi.svg', caption: 'Pratinjau Cetak Surat Keterangan Berkop Resmi Desa' },
        { type: 'image', url: '/images/mockups/bansos_1_map.svg', caption: 'Statistik Kependudukan & Peta Demografi Warga' },
        { type: 'image', url: '/images/mockups/surat_4_report.svg', caption: 'Buku Register Surat Keluar & Arsip Pelayanan Desa' }
      ]
    },
    {
      id: 'prod-pintar-bumdes',
      product_code: 'BUMDES',
      category_id: 'cat-desa',
      slug: 'pintarbumdes-keuangan-usaha-desa',
      name: 'PintarBUMDes Keuangan & Unit Usaha Desa',
      tagline: 'Software Akuntansi SAK EMKM BUMDes, Laporan Laba Rugi Unit Dagang/Jasa, Bagi Hasil & Neraca Desa',
      description: `💰 KELOLA KEUANGAN & BERBAGAI UNIT BISNIS BUMDES SECARA AKUNTABEL & TRANSPARAN!

PintarBUMDes dirancang khusus untuk Badan Usaha Milik Desa (BUMDes) yang mengelola beragam unit usaha: toko sembako/ATK desa, persewaan gedung/tenda, jasa air bersih PAMSIMAS, simpan pinjam, maupun wisata desa.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Akuntansi Standar SAK EMKM & Kemendes PDTT: Laporan Laba Rugi, Arus Kas, Perubahan Modal, dan Neraca Keuangan tersusun otomatis sesuai kaidah resmi.
2. Konsolidasi Multi-Unit Usaha: Kelola unit perdagangan, unit jasa, dan unit simpan pinjam dalam satu laporan keuangan induk BUMDes.
3. Kalkulator Bagi Hasil PADesa Otomatis: Otomatis menghitung pembagian persentase deviden untuk Pendapatan Asli Desa (PADesa), cadangan modal, dan insentif pengurus.
4. Laporan Pertanggungjawaban Musyawarah Desa (Musdes): Cetak buku kas pembantu dan berkas LPJ tahunan siap saji untuk rapat evaluasi desa.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB' },
      hardware_compat: ['Printer Struk Thermal POS Unit Usaha', 'Printer A4 / F4 Laporan Keuangan'],
      version: 'v2.5.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 145,
      rating: 4.92,
      review_count: 67,
      windows_installer_url: 'https://downloads.pintarlabs.id/bumdes/PintarBUMDes_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/bumdes/Buku_Panduan_BUMDes.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/bumdes/PintarBUMDes_Demo.exe',
      thumbnail_url: '/images/mockups/bumdes_1_pos.svg',
      plans: [
        {
          id: 'plan-bum-single',
          code: 'SINGLE',
          name: 'Paket Lisensi Keuangan BUMDes Lengkap',
          price: 550000,
          original_price: 900000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen', 'Modul Multi-Unit Usaha', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'SAK_EMKM', name: 'Standar Akuntansi SAK EMKM BUMDes', description: 'Laba rugi, arus kas, dan neraca konsolidasi otomatis.' },
        { code: 'MULTI_UNIT', name: 'Manajemen Multi-Unit Usaha Desa', description: 'Kelola kasir toko, jasa sewa, dan simpan pinjam BUMDes.' },
        { code: 'PAD_CALC', name: 'Perhitungan Otomatis Deviden Bagi Hasil PAD', description: 'Alokasi keuntungan untuk kas pendapatan desa transparan.' },
        { code: 'MUSDES_LPJ', name: 'Format Berkas LPJ Tahunan Musyawarah Desa', description: 'Ekspor laporan pertanggungjawaban lengkap ke Excel/PDF.' }
      ],
      media: [
        { type: 'image', url: '/images/mockups/bumdes_1_pos.svg', caption: 'Kasir POS Unit Perdagangan & Penjualan BUMDes' },
        { type: 'image', url: '/images/mockups/bumdes_2_neraca.svg', caption: 'Laporan Keuangan Neraca & Laba Rugi SAK EMKM' },
        { type: 'image', url: '/images/mockups/bumdes_3_pad.svg', caption: 'Perhitungan Alokasi Bagi Hasil PADesa & Dana Cadangan' },
        { type: 'image', url: '/images/mockups/bumdes_4_audit.svg', caption: 'Buku Kas Pembantu & Berkas LPJ Musyawarah Desa' }
      ]
    },
    {
      id: 'prod-pintar-retribusi',
      product_code: 'RETRIBUSI',
      category_id: 'cat-desa',
      slug: 'pintar-retribusi-pasar-parkir-scanner',
      name: 'PintarRetribusi Pasar, Parkir & Sampah Scanner',
      tagline: 'Aplikasi Android Petugas Scanner QR, Cetak Karcis Thermal Mobile & Rekapitulasi Setoran Kasir PADesa',
      description: `🎫 TERTIBKAN PENDAPATAN RETRIBUSI DESA (PASAR, PARKIR, SAMPAH, WISATA) DENGAN SISTEM DIGITAL MOBILE!

PintarRetribusi menggabungkan aplikasi smartphone Android petugas lapangan dengan printer thermal Bluetooth untuk memungut retribusi pedagang pasar desa, tiket wisata, karcis parkir, dan iuran sampah secara akurat tanpa kebocoran dana.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Scan QR Code Kartu Kios / Pedagang: Petugas cukup scan kartu QR kios pedagang, tarif otomatis muncul dan struk karcis tercetak dalam 2 detik.
2. Cetak Struk Karcis Thermal Bluetooth: Bukti bayar resmi tercetak seketika dengan logo pemerintah desa dan nomor seri unik anti-karcis ganda.
3. Rekonsiliasi Setoran Harian Petugas Lapangan: Mengetahui secara pasti total uang fisik yang harus disetorkan tiap petugas di akhir shift.
4. Dashboard Real-time Monitoring PADesa: Kepala desa dapat melihat grafik penerimaan retribusi harian secara transparan.`,
      platforms: ['windows', 'android'],
      min_requirements: { windows: 'Windows 10/11 (Dashboard)', android: 'Android 7.0+, RAM 2GB' },
      hardware_compat: ['Printer Thermal Bluetooth 58mm Mobile', 'Smartphone Android Petugas', 'PC Admin Desa'],
      version: 'v2.8.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 178,
      rating: 4.93,
      review_count: 82,
      windows_installer_url: 'https://downloads.pintarlabs.id/retribusi/PintarRetribusi_Dashboard.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/retribusi/PintarRetribusi_Petugas.apk',
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/retribusi/Buku_Panduan_Retribusi.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/retribusi/PintarRetribusi_Demo.exe',
      thumbnail_url: '/images/promos/retribusi_scanner_promo_banner.jpg',
      plans: [
        {
          id: 'plan-ret-single',
          code: 'STANDAR',
          name: 'Paket Standar Desa (1 PC Admin + 2 HP Petugas Android)',
          price: 590000,
          original_price: 950000,
          deliverables: ['Dashboard Admin Windows (.exe)', 'Aplikasi Android Petugas (.apk)', 'Lisensi Permanen', 'Support 6 Bulan'],
          is_popular: 1
        },
        {
          id: 'plan-ret-multi',
          code: 'MULTI',
          name: 'Paket Multi-Petugas (1 PC + Hingga 10 HP Petugas)',
          price: 990000,
          original_price: 1600000,
          deliverables: ['Dashboard Multi-Pasar/Wisata', 'Aplikasi 10 Petugas Android', 'Dukungan Multi-Unit Retribusi', 'Support 1 Tahun'],
          is_popular: 0
        }
      ],
      features: [
        { code: 'MOBILE_POS', name: 'Aplikasi Android Petugas Scan QR Pedagang', description: 'Pemungutan retribusi cepat di lokasi pasar dan kios.' },
        { code: 'BLUETOOTH_PRINT', name: 'Cetak Karcis Struk Thermal 58mm Seketika', description: 'Bukti pembayaran resmi berlogo pemdes anti-pungli.' },
        { code: 'RECON_SETORAN', name: 'Rekonsiliasi Uang Setoran Petugas Shift', description: 'Mencegah selisih setoran kasir dengan sistem validasi.' },
        { code: 'PAD_DASHBOARD', name: 'Dashboard Penerimaan PADesa Real-time', description: 'Monitoring grafik harian setoran retribusi pasar & wisata.' }
      ],
      media: [
        { type: 'image', url: '/images/promos/retribusi_scanner_promo_banner.jpg', caption: '3D Mockup Aplikasi Retribusi Petugas Lapangan Android' },
        { type: 'image', url: '/images/mockups/kargo_1_counter.svg', caption: 'Dashboard Penerimaan Retribusi Pasar & Karcis Parkir' },
        { type: 'image', url: '/images/mockups/visitor_2_badge.svg', caption: 'Format Cetak Karcis Thermal Mobile Bluetooth' },
        { type: 'image', url: '/images/mockups/kargo_4_commission.svg', caption: 'Laporan Rekonsiliasi Setoran Harian Petugas Lapangan' },
        { type: 'image', url: '/images/mockups/asset_1_dashboard.svg', caption: 'Grafik Statistik PADesa dari Sektor Retribusi' }
      ]
    },
    {
      id: 'prod-pintar-bansos',
      product_code: 'BANSOS',
      category_id: 'cat-desa',
      slug: 'pintarbansos-dtks-pemetaan-warga-desa',
      name: 'PintarBansos DTKS & Pemetaan Warga Desa',
      tagline: 'Scoring Kelayakan Penerima BLT Dana Desa/Bansos, Peta Geotag Rumah Warga & Validasi Penyaluran Barcode KTP',
      description: `🏡 SALURKAN BANTUAN SOSIAL TEPAT SASARAN DENGAN SISTEM SCORING KELAYAKAN TERUJI!

PintarBansos membantu perangkat desa dalam memverifikasi data keluarga pra-sejahtera (DTKS), perangkingan penerima Bantuan Langsung Tunai (BLT Dana Desa, PKH, BPNT), foto kondisi rumah, serta bukti penyaluran bantuan berbasis scan barcode KTP.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Algoritma Scoring Kriteria Kemensos & Desa: Penilaian bobot kondisi fisik rumah (lantai, dinding, atap), penghasilan, daya listrik, dan jumlah tanggungan secara transparan anti-nepotisme.
2. Peta Geotagging Titik Lokasi Rumah Warga: Memvisualisasikan lokasi rumah penerima bantuan pada peta desa untuk validasi lapangan.
3. Verifikasi Penyaluran via Scan Barcode e-KTP: Pengambilan dana bantuan divalidasi dengan scan barcode KTP dan tanda tangan digital penerima.
4. Cetak Berita Acara & Kwitansi Penyaluran Resmi: Format laporan pertanggungjawaban Dana Desa siap audit inspektorat.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB' },
      hardware_compat: ['Barcode Scanner 2D QR / e-KTP', 'Printer Laporan A4 / F4'],
      version: 'v2.1.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 104,
      rating: 4.91,
      review_count: 47,
      windows_installer_url: 'https://downloads.pintarlabs.id/bansos/PintarBansos_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/bansos/Panduan_PintarBansos.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/bansos/PintarBansos_Demo.exe',
      thumbnail_url: '/images/mockups/bansos_1_map.svg',
      plans: [
        {
          id: 'plan-ban-single',
          code: 'SINGLE',
          name: 'Paket Lisensi Pemetaan Bansos Desa',
          price: 490000,
          original_price: 800000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen', 'Modul Scoring & Geotag', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'SCORING_AI', name: 'Algoritma Scoring Kelayakan Objektif', description: 'Perangkingan penerima bantuan bebas dari tuduhan nepotisme.' },
        { code: 'GEOTAG_HOUSE', name: 'Peta Sebaran & Dokumentasi Foto Rumah', description: 'Validasi visual kondisi tempat tinggal warga pra-sejahtera.' },
        { code: 'KTP_VERIFY', name: 'Validasi Pengambilan BLT via Barcode KTP', description: 'Bukti serah terima aman dengan foto & tanda tangan digital.' },
        { code: 'LPJ_BANSOS', name: 'Berita Acara & Kwitansi Penyaluran Dana Desa', description: 'Format audit inspektorat siap ekspor ke Excel/PDF.' }
      ],
      media: [
        { type: 'image', url: '/images/mockups/bansos_1_map.svg', caption: 'Peta Sebaran DTKS & Titik Rumah Warga Penerima Manfaat' },
        { type: 'image', url: '/images/mockups/bansos_2_scoring.svg', caption: 'Algoritma Scoring Bobot Kelayakan Warga Objektif' },
        { type: 'image', url: '/images/mockups/bansos_3_dist.svg', caption: 'Form Penyaluran BLT Dana Desa & Scan Barcode KTP' },
        { type: 'image', url: '/images/mockups/bansos_4_lpj.svg', caption: 'Cetak Kwitansi Penyaluran & Berita Acara Musdes' }
      ]
    },
    {
      id: 'prod-pintar-tanah',
      product_code: 'TANAH',
      category_id: 'cat-desa',
      slug: 'pintartanah-letter-c-mutasi-persil-desa',
      name: 'PintarTanah Letter C & Mutasi Persil Desa',
      tagline: 'Digitalisasi Buku Letter C Desa, Riwayat Mutasi Waris/Jual Beli, Peta Persil & Cetak Surat Keterangan Tanah',
      description: `📜 AMANKAN ARSIP SEJARAH PERTANAHAN DESA DARI KERUSAKAN DENGAN LETTER C DIGITAL!

PintarTanah mendigitalkan buku Letter C fisik desa yang rentan robek/lapuk menjadi database terenkripsi, memudahkan pencarian nomor kohir, nomor persil, blok, klasifikasi tanah, serta riwayat mutasi jual beli dan waris.

🌟 KEUNGGULAN DIBANDINGKAN SOFTWARE SEJENIS:
1. Pencarian Super Cepat Kohir & Persil: Temukan riwayat kepemilikan tanah leluhur dalam 1 detik berdasarkan nama pemilik, nomor kohir, atau nomor persil.
2. Riwayat Mutasi Tanah Terperinci: Mencatat secara kronologis pemecahan bidang, hibah, waris, dan jual beli tanah dari pemilik awal hingga saat ini.
3. Cetak Surat Keterangan Riwayat Tanah (SKRT) & Tidak Sengketa: Otomatis mencetak formulir permohonan sertifikasi tanah (PTSL/BPN) lengkap dan akurat.
4. Pengarsipan Scan Dokumen Warkah Fisik: Lampirkan scan sertifikat, akta jual beli, dan surat keterangan waris langsung pada setiap buku tanah.`,
      platforms: ['windows'],
      min_requirements: { windows: 'Windows 10/11, RAM 2GB' },
      hardware_compat: ['Scanner Dokumen Ukuran F4 / Folio', 'Printer Surat A4 / F4'],
      version: 'v2.0.0',
      is_published: 1,
      is_featured: 0,
      sales_count: 112,
      rating: 4.95,
      review_count: 51,
      windows_installer_url: 'https://downloads.pintarlabs.id/tanah/PintarTanah_Setup.exe',
      android_apk_url: null,
      user_manual_pdf_url: 'https://downloads.pintarlabs.id/tanah/Panduan_PintarTanah.pdf',
      video_tutorial_url: 'https://youtu.be/HAe2PFy6zjM',
      trial_download_url: 'https://downloads.pintarlabs.id/tanah/PintarTanah_Demo.exe',
      thumbnail_url: '/images/mockups/tanah_1_letterc.svg',
      plans: [
        {
          id: 'plan-tan-single',
          code: 'SINGLE',
          name: 'Paket Lisensi Kantor Urusan Tanah Desa',
          price: 590000,
          original_price: 950000,
          deliverables: ['Installer Windows (.exe)', 'Lisensi Permanen', 'Modul Letter C & SKRT BPN', 'Support 6 Bulan'],
          is_popular: 1
        }
      ],
      features: [
        { code: 'DIGITAL_LETTER_C', name: 'Digitalisasi Buku Letter C Desa & Buku Tanah', description: 'Pencarian cepat nomor kohir, persil, dan blok tanah.' },
        { code: 'MUTATION_HIST', name: 'Histori Kronologis Mutasi Jual Beli & Waris', description: 'Lacak silsilah kepemilikan tanah dari masa ke masa.' },
        { code: 'SKRT_MAKER', name: 'Cetak Surat Keterangan Riwayat Tanah (Format BPN)', description: 'Mempercepat proses pendaftaran PTSL dan balik nama.' },
        { code: 'SCAN_WARKAH', name: 'Pengarsipan Berkas Scan Warkah Fisik', description: 'Menyimpan dokumen bukti kepemilikan tanah dengan aman.' }
      ],
      media: [
        { type: 'image', url: '/images/mockups/tanah_1_letterc.svg', caption: 'Database Buku Letter C Digital & Pencarian Kohir Cepat' },
        { type: 'image', url: '/images/mockups/tanah_2_mutation.svg', caption: 'Pencatatan Riwayat Mutasi Waris, Hibah & Jual Beli Tanah' },
        { type: 'image', url: '/images/mockups/tanah_3_cert.svg', caption: 'Form Cetak Surat Keterangan Riwayat Tanah (SKRT) Format BPN' },
        { type: 'image', url: '/images/mockups/tanah_4_map.svg', caption: 'Peta Blok Persil & Batas Patok Tanah Kas Desa' }
      ]
    }
  ];

  // 3. Clear and Populate Database
  console.log('Clearing old catalog records...');
  await dbAsync.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = OFF;
    BEGIN TRANSACTION;
    DELETE FROM plan_features;
    DELETE FROM features;
    DELETE FROM product_media;
    DELETE FROM plans;
    DELETE FROM reviews;
    DELETE FROM order_items;
    DELETE FROM licenses;
    DELETE FROM installations;
    DELETE FROM products;
    DELETE FROM categories;
  `);

  console.log('Inserting 4 Categories...');
  for (const cat of categories) {
    await dbAsync.run(
      `INSERT INTO categories (id, slug, name, icon, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
      [cat.id, cat.slug, cat.name, cat.icon, cat.description, cat.sort_order]
    );
  }

  console.log(`Inserting 20 Comprehensive Products...`);
  for (const prod of products) {
    console.log(` -> Seeding [${prod.product_code}] ${prod.name}`);
    await dbAsync.run(
      `INSERT INTO products (
        id, product_code, category_id, slug, name, tagline, description,
        platforms, min_requirements, hardware_compat, version,
        trial_download_url, windows_installer_url, android_apk_url, user_manual_pdf_url, video_tutorial_url,
        is_published, is_featured, sales_count, rating, review_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prod.id,
        prod.product_code,
        prod.category_id,
        prod.slug,
        prod.name,
        prod.tagline,
        prod.description,
        JSON.stringify(prod.platforms || ['windows']),
        JSON.stringify(prod.min_requirements || {}),
        JSON.stringify(prod.hardware_compat || []),
        prod.version || 'v1.0.0',
        prod.trial_download_url,
        prod.windows_installer_url,
        prod.android_apk_url,
        prod.user_manual_pdf_url,
        prod.video_tutorial_url,
        prod.is_published,
        prod.is_featured,
        prod.sales_count,
        prod.rating,
        prod.review_count
      ]
    );

    // Plans
    if (prod.plans && prod.plans.length > 0) {
      for (let i = 0; i < prod.plans.length; i++) {
        const p = prod.plans[i];
        await dbAsync.run(
          `INSERT INTO plans (
            id, product_id, code, name, description, price, original_price,
            billing_type, deliverables, is_popular, sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.id || `${prod.id}-plan-${i}`,
            prod.id,
            p.code || 'LIFETIME',
            p.name,
            p.description || 'Lisensi Lifetime Sekali Bayar Selamanya',
            p.price,
            p.original_price || Math.round(p.price * 1.5),
            p.billing_type || 'lifetime',
            JSON.stringify(p.deliverables || ['Installer Resmi', 'Serial Key Aktivasi', 'Panduan PDF', 'Support CS']),
            p.is_popular || 0,
            i
          ]
        );
      }
    }

    // Features
    if (prod.features && prod.features.length > 0) {
      for (let i = 0; i < prod.features.length; i++) {
        const f = prod.features[i];
        await dbAsync.run(
          `INSERT INTO features (id, product_id, code, name, description, group_name, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            prod.id,
            f.code || `FEAT_${i}`,
            f.name,
            f.description || '',
            'Fitur Unggulan',
            i
          ]
        );
      }
    }

    // Media (Primary Banner + Screenshots)
    if (prod.media && prod.media.length > 0) {
      for (let i = 0; i < prod.media.length; i++) {
        const m = prod.media[i];
        await dbAsync.run(
          `INSERT INTO product_media (id, product_id, type, url, caption, sort_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            prod.id,
            m.type || 'image',
            m.url,
            m.caption || `${prod.name} Screenshot ${i + 1}`,
            i
          ]
        );
      }
    }

    // Verified Customer Reviews
    const reviews = [
      { name: 'Bpk. H. Sukamto', biz: 'Toko & Grosir Berkah', rating: 5, comment: 'Software sangat stabil, mudah digunakan staff dan tidak ribet. Bantuan teknisi remote AnyDesk-nya sangat ramah dan profesional!' },
      { name: 'Ibu Ratna Dewi, S.Pd', biz: 'Yayasan Pendidikan Insan Mandiri', rating: 5, comment: 'Sangat membantu operasional harian kami. Fiturnya lengkap sekali dan hemat biaya karena tidak ada iuran bulanan.' },
      { name: 'Ahmad Fauzi', biz: 'CV. Karya Logistik & Niaga', rating: 5, comment: 'Aplikasi berjalan lancar tanpa internet, printer dan scanner langsung terdeteksi otomatis. Rekomendasi software toko terpercaya!' }
    ];

    for (const rev of reviews) {
      await dbAsync.run(
        `INSERT INTO reviews (id, product_id, customer_name, business_name, rating, comment, verified_buyer)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), prod.id, rev.name, rev.biz, rev.rating, rev.comment, 1]
      );
    }
  }

  await dbAsync.exec(`
    COMMIT;
    PRAGMA foreign_keys = ON;
  `);

  console.log('=== SEEDING COMPLETED SUCCESSFULLY: 20 PRODUCTS WITH FULL 4+ SCREENSHOTS & PROMO BANNERS! ===');
}

seed20Products().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
