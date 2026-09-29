const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('./db');

async function syncAllCatalog() {
  console.log('--- Synchronizing Catalog & 3D Promo Banners for All Products ---');

  // List of definitive products and their 3D banners
  const products = [
    {
      id: 'prod-pintar-pos',
      product_code: 'POS',
      slug: 'pintarpos-resto-retail',
      name: 'PintarPOS Resto & Retail Ultimate',
      tagline: 'Software Kasir Cepat, 100% Offline Tanpa Internet & Rekonsiliasi Kas Laci',
      category_id: 'cat-pos',
      platforms: ['windows', 'android'],
      version: 'v3.5.0',
      sales_count: 348,
      rating: 4.95,
      review_count: 194,
      banner_url: '/images/promos/pintarpos_promo_banner.jpg',
      price: 499000,
      original_price: 750000
    },
    {
      id: 'prod-bell-pintar',
      product_code: 'BELL',
      slug: 'bell-pintar-sekolah-otomatis',
      name: 'Bell Pintar - Aplikasi Bel Sekolah Otomatis & Jadwal Alarm Cerdas',
      tagline: 'Bel Sekolah Otomatis Akurat Per Detik, 100% Offline LAN & Kendali Jarak Jauh HP Guru',
      category_id: 'cat-school',
      platforms: ['windows', 'android'],
      version: 'v2.2.0',
      sales_count: 215,
      rating: 4.96,
      review_count: 87,
      banner_url: '/images/bellpintar/thumbnail_youtube_bell_pintar.jpg',
      price: 175000,
      original_price: 350000
    },
    {
      id: 'prod-biometrik-absensi',
      product_code: 'BIOMETRIK',
      slug: 'biometrik-absensi-digital-geofencing',
      name: 'PintarAttend - Absensi Wajah Biometrik & GPS Geofencing',
      tagline: 'Presensi Karyawan Anti-Titip Absen, Deteksi Wajah AI & Radius Lokasi Kantor Akurat',
      category_id: 'cat-tools',
      platforms: ['windows', 'android', 'web-cloud'],
      version: 'v2.0.0',
      sales_count: 142,
      rating: 4.93,
      review_count: 46,
      banner_url: '/images/promos/biometric_attend_promo_banner.jpg',
      price: 450000,
      original_price: 700000
    },
    {
      id: 'prod-bus-seating',
      product_code: 'BUS_SEAT',
      slug: 'pintarbus-manajemen-kursi-travel',
      name: 'PintarBus - Sistem Tiket & Denah Kursi Bus Travel',
      tagline: 'Manajemen Reservasi Tiket Bus, Layout Kursi Interaktif 2+2/2+1 & Cetak Tiket QR Barcode',
      category_id: 'cat-pos',
      platforms: ['windows', 'android'],
      version: 'v1.9.0',
      sales_count: 118,
      rating: 4.91,
      review_count: 38,
      banner_url: '/images/promos/bus_seating_promo_banner.jpg',
      price: 550000,
      original_price: 850000
    },
    {
      id: 'prod-sipintar-surat',
      product_code: 'SIPINTAR',
      slug: 'sipintar-administrasi-surat-desa',
      name: 'SiPintar - Sistem Pelayanan Surat Desa & Kependudukan',
      tagline: 'Cetak Surat Pengantar KTP, SKU, Domisili Kilat 1-Klik dengan Verifikasi QR TTE',
      category_id: 'cat-tools',
      platforms: ['windows', 'web-cloud'],
      version: 'v2.5.0',
      sales_count: 86,
      rating: 4.94,
      review_count: 29,
      banner_url: '/images/promos/sipintar_desa_promo_banner.jpg',
      price: 750000,
      original_price: 1200000
    },
    {
      id: 'prod-retribusi-scanner',
      product_code: 'RETRIBUSI',
      slug: 'pintar-retribusi-pasar-parkir-scanner',
      name: 'PintarRetribusi - Scan Retribusi Pasar & Parkir Digital POS',
      tagline: 'Penarikan Retribusi Lapak Pedagang & Karcis Parkir via Handheld POS Android & Cetak Struk',
      category_id: 'cat-pos',
      platforms: ['windows', 'android'],
      version: 'v1.6.0',
      sales_count: 64,
      rating: 4.89,
      review_count: 19,
      banner_url: '/images/promos/retribusi_scanner_promo_banner.jpg',
      price: 480000,
      original_price: 750000
    },
    {
      id: 'prod-wifipay-mikrotik',
      product_code: 'WIFIPAY',
      slug: 'wifipay-billing-mikrotik-qris',
      name: 'WifiPay - Billing Hotspot MikroTik & Voucher QRIS Otomatis',
      tagline: 'Jual Voucher Wi-Fi Otomatis Beli Sendiri via QRIS & Cetak Struk Hotspot MikroTik',
      category_id: 'cat-tools',
      platforms: ['windows', 'web-cloud'],
      version: 'v2.3.0',
      sales_count: 165,
      rating: 4.95,
      review_count: 53,
      banner_url: '/images/promos/wifipay_mikrotik_promo_banner.jpg',
      price: 350000,
      original_price: 550000
    },
    {
      id: 'prod-pintar-stock',
      product_code: 'STOCK',
      slug: 'pintarstock-inventory-warehouse',
      name: 'PintarStock - Manajemen Stok & Multi-Gudang',
      tagline: 'Sistem Inventori, Mutasi Antar Gudang & Opname Barcode Android',
      category_id: 'cat-stock',
      platforms: ['windows', 'android'],
      version: 'v2.4.0',
      sales_count: 92,
      rating: 4.88,
      review_count: 18,
      banner_url: '/images/promos/pintarstock_promo_banner.jpg',
      price: 550000,
      original_price: 800000
    },
    {
      id: 'prod-pintar-school',
      product_code: 'SCHOOL',
      slug: 'pintarschool-spp-akademik',
      name: 'PintarSchool - Sistem Pembayaran SPP & Absensi Siswa',
      tagline: 'Kelola SPP, Notifikasi WhatsApp Tagihan & Kartu Pembayaran Digital',
      category_id: 'cat-school',
      platforms: ['windows', 'android'],
      version: 'v2.1.0',
      sales_count: 58,
      rating: 4.92,
      review_count: 14,
      banner_url: '/images/promos/pintarschool_promo_banner.jpg',
      price: 650000,
      original_price: 950000
    },
    {
      id: 'prod-pintar-finance',
      product_code: 'FINANCE',
      slug: 'pintarinvoice-keuangan-usaha',
      name: 'PintarInvoice & Kas Keuangan UKM',
      tagline: 'Pembuat Faktur Profesional, Buku Kas & Laporan Laba Rugi Otomatis',
      category_id: 'cat-finance',
      platforms: ['windows', 'web-cloud'],
      version: 'v1.8.0',
      sales_count: 73,
      rating: 4.85,
      review_count: 11,
      banner_url: '/images/promos/pintarinvoice_promo_banner.jpg',
      price: 399000,
      original_price: 550000
    }
  ];

  // Clean up any duplicate temporary rows
  await dbAsync.run("DELETE FROM products WHERE id IN ('prod-pintar-attend', 'prod-pintar-bus', 'prod-sipintar-desa', 'prod-hompimpa-pos')");

  for (const prod of products) {
    const existing = await dbAsync.get('SELECT id FROM products WHERE id = ?', [prod.id]);
    if (existing) {
      await dbAsync.run(
        `UPDATE products SET 
          product_code = ?, slug = ?, name = ?, tagline = ?, category_id = ?,
          platforms = ?, version = ?, sales_count = ?, rating = ?, review_count = ?, is_published = 1, is_featured = 1
         WHERE id = ?`,
        [
          prod.product_code, prod.slug, prod.name, prod.tagline, prod.category_id,
          JSON.stringify(prod.platforms), prod.version, prod.sales_count, prod.rating, prod.review_count, prod.id
        ]
      );
    } else {
      await dbAsync.run(
        `INSERT INTO products (
          id, product_code, category_id, slug, name, tagline, description,
          platforms, version, is_published, is_featured, sales_count, rating, review_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?)`,
        [
          prod.id, prod.product_code, prod.category_id, prod.slug, prod.name, prod.tagline, prod.tagline,
          JSON.stringify(prod.platforms), prod.version, prod.sales_count, prod.rating, prod.review_count
        ]
      );
    }

    // Ensure plan exists
    const planExists = await dbAsync.get('SELECT id FROM plans WHERE product_id = ?', [prod.id]);
    if (!planExists) {
      await dbAsync.run(
        `INSERT INTO plans (
          id, product_id, code, name, description, price, original_price,
          billing_type, device_limit, deliverables, support_duration, is_popular
        ) VALUES (?, ?, 'STD', 'Paket Lisensi Resmi', 'Lisensi Resmi Lifetime Siap Pakai', ?, ?, 'lifetime', '{"windows":1,"android":1}', '["Installer Windows","Aplikasi Android","Serial Key","PDF Panduan"]', 'Support 6 Bulan', 1)`,
        [uuidv4(), prod.id, prod.price, prod.original_price]
      );
    }

    // Set 3D Banner as primary thumbnail (sort_order = 1)
    const existingThumb = await dbAsync.get(
      'SELECT id FROM product_media WHERE product_id = ? AND sort_order = 1',
      [prod.id]
    );

    if (existingThumb) {
      await dbAsync.run(
        'UPDATE product_media SET url = ?, caption = ?, type = ? WHERE id = ?',
        [prod.banner_url, prod.name, 'thumbnail', existingThumb.id]
      );
    } else {
      await dbAsync.run(
        'INSERT INTO product_media (id, product_id, type, url, caption, sort_order) VALUES (?, ?, ?, ?, ?, 1)',
        [uuidv4(), prod.id, 'thumbnail', prod.banner_url, prod.name]
      );
    }

    console.log(`✅ [Synced 3D Banner] ${prod.name} -> ${prod.banner_url}`);
  }

  console.log('🎉 All 10 products successfully updated with 3D commercial banners in SQLite database!');
}

syncAllCatalog().then(() => process.exit(0)).catch(err => {
  console.error('Error syncing catalog:', err);
  process.exit(1);
});
