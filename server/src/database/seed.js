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
      tagline: 'Software Kasir Lengkap Windows & Android Tanpa Langganan Bulanan',
      description: 'PintarPOS adalah aplikasi kasir (Point of Sale) modern siap pakai yang dirancang khusus untuk toko retail, restoran, kafe, apotek, dan minimarket. Mendukung operasional kasir di PC Windows sekaligus waiter/kasir keliling menggunakan HP/Tablet Android. Data tersinkronisasi otomatis, cetak struk thermal via Bluetooth & USB, serta laporan penjualan real-time tanpa ribet.',
      platforms: ['windows', 'android'],
      min_requirements: {
        windows: 'Windows 10/11 64-bit, RAM 4GB, Storage 500MB',
        android: 'Android 8.0 (Oreo) ke atas, RAM 2GB'
      },
      hardware_compat: [
        'Printer Thermal 58mm & 80mm (Bluetooth / USB / LAN)',
        'Barcode Scanner 1D & 2D QR Code',
        'Laci Uang (Cash Drawer RJ11)',
        'Customer Display Pole'
      ],
      version: 'v3.2.0',
      is_published: 1,
      is_featured: 1,
      sales_count: 184,
      rating: 4.95,
      review_count: 36,
      windows_installer_url: 'https://downloads.pintarlabs.id/pos/PintarPOS_Setup_v3.2.exe',
      android_apk_url: 'https://downloads.pintarlabs.id/pos/PintarPOS_v3.2.apk',
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
        { code: 'pos_cashier', name: 'Modul Kasir & Transaksi Cepat', group_name: 'Modul Kasir', description: 'Proses kasir kilat dengan barcode scanner, diskon, pajak, opsi takeaway/dine-in, dan split bill.' },
        { code: 'thermal_print', name: 'Cetak Struk & Kitchen Order', group_name: 'Pencetakan', description: 'Cetak struk belanja kasir dan tiket pesanan langsung ke printer dapur secara bersamaan.' },
        { code: 'inventory_sync', name: 'Pengurangan Stok Otomatis (FIFO)', group_name: 'Inventori', description: 'Stok barang berkurang otomatis saat terjadi penjualan kasir. Dilengkapi peringatan stok menipis.' },
        { code: 'payment_qris', name: 'Multi Metode Pembayaran & QRIS Dinamis', group_name: 'Pembayaran', description: 'Menerima pembayaran Tunai, Kartu Debit, Transfer Bank, dan QRIS otomatis.' },
        { code: 'reports_realtime', name: 'Laporan Laba/Rugi & Rekap Kasir', group_name: 'Laporan', description: 'Laporan omset harian, barang terlaris (top product), profit bersih, dan rekap shift kasir.' },
        { code: 'cloud_sync', name: 'Sinkronisasi Otomatis Windows + Android', group_name: 'Konektivitas', description: 'Hubungkan PC kasir utama dan HP pelayan secara lokal (Wi-Fi) tanpa internet sekalipun.' }
      ],
      media: [
        { type: 'thumbnail', url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80', caption: 'PintarPOS Dashboard & Cashier View', sort_order: 1 },
        { type: 'banner', url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1400&q=80', caption: 'PintarPOS Banner Showcase', sort_order: 2 }
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
        { type: 'thumbnail', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', caption: 'PintarStock Warehouse Management', sort_order: 1 }
      ],
      reviews: [
        { customer_name: 'Hendra Gunawan', business_name: 'CV. Maju Logistik', rating: 5, comment: 'Fitur scan barcode pakai kamera HP Android-nya sangat membantu saat opname bulanan.' }
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
        { type: 'thumbnail', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80', caption: 'PintarSchool Admin & Student Portal', sort_order: 1 }
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
        { type: 'thumbnail', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80', caption: 'PintarInvoice Dashboard', sort_order: 1 }
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
