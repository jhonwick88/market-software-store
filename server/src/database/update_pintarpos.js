const { dbAsync } = require('./db');
const { v4: uuidv4 } = require('uuid');

async function updatePintarPOS() {
  console.log('🔄 Memperbarui detail produk PintarPOS dengan data PROMO lengkap...');

  const productId = 'prod-pintar-pos';

  const description = `PintarPOS adalah aplikasi kasir pintar (Point of Sale) modern berbasis Local-First yang dirancang khusus untuk toko retail, minimarket, restoran, kafe, apotek, dan UMKM.

🚀 KEUNGGULAN UTAMA PINTARPOS:
1. 100% Bebas Kuota & Internet (Offline-Ready)
Semua proses transaksi kasir, scan barcode, cetak nota struk, hingga sinkronisasi multi-device berjalan mulus di jaringan lokal Wi-Fi toko Anda tanpa membutuhkan koneksi internet atau kuota data sama sekali.

2. Sistem Rekonsiliasi Kas Laci (Anti-Bocor & Anti-Tekor)
Setiap pergantian shift atau saat tutup toko, kasir cukup menginput jumlah uang fisik yang ada di laci. Sistem akan langsung memvalidasi dan mencocokkannya dengan perhitungan omset & pengeluaran kas (petty cash) sehingga selisih kas langsung terdeteksi seketika.

3. Sinkronisasi Multi-Device Jaringan Lokal (LAN / Wi-Fi)
Hubungkan Komputer PC kasir utama dengan Tablet / HP Android pelayan (waiter) secara instan tanpa lag. Pesanan dari meja customer langsung tercatat dan dapat dicetak ke printer dapur.

4. Beli 1x Pakai Seumur Hidup (Lifetime License)
Bebas biaya langganan bulanan atau tahunan. 100% keuntungan penjualan toko adalah milik Anda tanpa potongan komisi per transaksi.

5. Cetak Struk Cepat & Fleksibel
Kompatibel dengan semua merk printer thermal 58mm & 80mm (USB, Bluetooth, LAN). Dilengkapi opsi cetak rangkap, custom header/footer nota, dan auto cash drawer kick (buka laci otomatis).

6. Manajemen Inventori & Peringatan Stok Menipis
Pencatatan stok otomatis berkurang saat transaksi, histori mutasi barang, input barcode massal, dan notifikasi saat barang hampir habis.`;

  const tagline = 'Software Kasir Cepat, 100% Offline Tanpa Internet & Sistem Rekonsiliasi Kas Anti-Bocor';

  const hardwareCompat = JSON.stringify([
    'Printer Thermal 58mm & 80mm (Bluetooth / USB / LAN)',
    'Barcode Scanner 1D & 2D QR Code',
    'Laci Uang Otomatis (Cash Drawer RJ11)',
    'Komputer PC Windows / Laptop',
    'Smartphone & Tablet Android (Multi-Device)'
  ]);

  // 1. Update Product info
  await dbAsync.run(
    `UPDATE products SET 
      tagline = ?, 
      description = ?, 
      hardware_compat = ?,
      version = 'v3.5.0',
      video_tutorial_url = 'https://youtu.be/HAe2PFy6zjM',
      rating = 4.95,
      review_count = 194,
      sales_count = 348,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [tagline, description, hardwareCompat, productId]
  );

  // 2. Refresh Product Features
  await dbAsync.run('DELETE FROM features WHERE product_id = ?', [productId]);

  const features = [
    { code: 'pos_cashier', name: 'Modul Kasir Cepat & Scan Barcode', group_name: 'Transaksi Kasir', description: 'Pencarian produk kilat, scan barcode 1D/2D, diskon, opsi takeaway/dine-in, dan shortcut keyboard tanpa mouse.' },
    { code: 'cash_reconciliation', name: 'Rekonsiliasi Kas Laci Shift (Anti-Bocor)', group_name: 'Keamanan Kas', description: 'Validasi uang fisik di laci kasir vs perhitungan sistem saat tutup shift kasir untuk mencegah uang kasir tekor.' },
    { code: 'multidevice_lan', name: 'Multi-Device LAN (PC Windows + HP Android)', group_name: 'Konektivitas', description: 'Hubungkan PC kasir utama dan smartphone/tablet waiter secara instan di jaringan Wi-Fi lokal toko tanpa internet.' },
    { code: 'thermal_printer', name: 'Cetak Struk Thermal 58mm & 80mm', group_name: 'Pencetakan', description: 'Cetak nota struk via USB & Bluetooth, dukung cetak rangkap, custom logo toko, dan auto kick laci kasir.' },
    { code: 'inventory_control', name: 'Manajemen Inventori & Stok Otomatis', group_name: 'Inventori', description: 'Pengurangan stok otomatis saat transaksi, peringatan stok menipis, dan histori mutasi barang masuk/keluar.' },
    { code: 'multi_payment', name: 'Multi Metode Pembayaran & QRIS', group_name: 'Pembayaran', description: 'Menerima pembayaran Tunai dengan kalkulator kembalian otomatis, Transfer Bank, Debit, dan QRIS.' },
    { code: 'analytics_dashboard', name: 'Dashboard Analitik & Laporan Laba Bersih', group_name: 'Laporan', description: 'Laporan omset harian, produk terlaris, laba/rugi kotor dan bersih, serta grafik penjualan real-time.' },
    { code: 'backup_vault', name: 'Backup Otomatis 1-Klik & Data Aman', group_name: 'Keamanan Data', description: 'Cadangkan database toko secara lokal ke flashdisk atau folder aman untuk perlindungan maksimal data Anda.' }
  ];

  for (let i = 0; i < features.length; i++) {
    const f = features[i];
    await dbAsync.run(
      'INSERT INTO features (id, product_id, code, name, description, group_name, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['feat-pos-' + (i + 1), productId, f.code, f.name, f.description, f.group_name, i + 1]
    );
  }

  // 3. Refresh Product Media Screenshots
  await dbAsync.run('DELETE FROM product_media WHERE product_id = ?', [productId]);

  const mediaList = [
    { type: 'screenshot', url: '/images/pintarpos/pos_utama.png', caption: 'Tampilan POS Utama - Kasir Kilat, Scan Barcode & Keranjang Belanja', sort_order: 1 },
    { type: 'screenshot', url: '/images/pintarpos/dashboard_analitik.png', caption: 'Dashboard Analitik - Total Pendapatan, Grafik Penjualan & Produk Terlaris', sort_order: 2 },
    { type: 'screenshot', url: '/images/pintarpos/inventori_stok.png', caption: 'Manajemen Inventori - Data Master Produk & Kontrol Stok POS', sort_order: 3 },
    { type: 'screenshot', url: '/images/pintarpos/rekonsiliasi_kas.png', caption: 'Rekonsiliasi Kas Laci - Validasi Shift Kasir & Pencegahan Selisih Kas', sort_order: 4 },
    { type: 'screenshot', url: '/images/pintarpos/riwayat_struk.png', caption: 'Riwayat Transaksi - Cetak Ulang Struk & Pembatalan Transaksi', sort_order: 5 },
    { type: 'screenshot', url: '/images/pintarpos/pengaturan_printer.png', caption: 'Pengaturan Printer - Dukungan Thermal 58mm & 80mm USB / Bluetooth', sort_order: 6 },
    { type: 'screenshot', url: '/images/pintarpos/pengaturan_sistem.png', caption: 'Pengaturan Sistem - Quick Item, Mode Terang & Integrasi Cash Drawer', sort_order: 7 },
    { type: 'screenshot', url: '/images/pintarpos/proses_bayar.png', caption: 'Proses Pembayaran - Hitung Kembalian Cepat, Tunai & Non-Tunai / QRIS', sort_order: 8 },
    { type: 'screenshot', url: '/images/pintarpos/shortcut_keyboard.png', caption: 'Panduan Shortcut Keyboard - Transaksi Kasir Kilat Tanpa Mouse', sort_order: 9 },
    { type: 'screenshot', url: '/images/pintarpos/multi_pc.png', caption: 'Dukungan Multi-Device - PC Windows Kasir, Tablet & HP Android Waiter Terhubung', sort_order: 10 }
  ];

  for (const m of mediaList) {
    await dbAsync.run(
      'INSERT INTO product_media (id, product_id, type, url, caption, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), productId, m.type, m.url, m.caption, m.sort_order]
    );
  }

  console.log('✅ PintarPOS berhasil diperbarui dengan 10 screenshot HD & fitur lengkap!');
}

updatePintarPOS().then(() => process.exit(0)).catch(err => {
  console.error('❌ Error updating PintarPOS:', err);
  process.exit(1);
});
