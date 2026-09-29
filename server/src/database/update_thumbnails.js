const { dbAsync } = require('./db');
const { v4: uuidv4 } = require('uuid');

async function updateThumbnails() {
  console.log('--- Updating High-Converting Commercial Promo Banners for All Products ---');

  const promoThumbnails = [
    {
      product_id: 'prod-pintar-pos',
      url: '/images/promos/pintarpos_promo_banner.jpg',
      caption: 'PintarPOS Resto & Retail - 100% Offline & Anti-Bocor Kas'
    },
    {
      product_id: 'prod-bell-pintar',
      url: '/images/bellpintar/thumbnail_youtube_bell_pintar.jpg',
      caption: 'Bell Pintar - Bel Sekolah Otomatis & Kendali HP Guru'
    },
    {
      product_id: 'prod-pintar-stock',
      url: '/images/promos/pintarstock_promo_banner.jpg',
      caption: 'PintarStock - Manajemen Stok Gudang & Scan Barcode Kamera HP'
    },
    {
      product_id: 'prod-pintar-school',
      url: '/images/promos/pintarschool_promo_banner.jpg',
      caption: 'PintarSchool - Aplikasi SPP Sekolah & Notifikasi WhatsApp'
    },
    {
      product_id: 'prod-pintar-finance',
      url: '/images/promos/pintarinvoice_promo_banner.jpg',
      caption: 'PintarInvoice - Faktur PDF & Buku Kas Keuangan Usaha'
    }
  ];

  for (const item of promoThumbnails) {
    // Check if thumbnail exists
    const existing = await dbAsync.get(
      'SELECT id FROM product_media WHERE product_id = ? AND sort_order = 1',
      [item.product_id]
    );

    if (existing) {
      await dbAsync.run(
        'UPDATE product_media SET url = ?, caption = ?, type = ? WHERE id = ?',
        [item.url, item.caption, 'thumbnail', existing.id]
      );
    } else {
      await dbAsync.run(
        'INSERT INTO product_media (id, product_id, type, url, caption, sort_order) VALUES (?, ?, ?, ?, ?, 1)',
        [uuidv4(), item.product_id, 'thumbnail', item.url, item.caption]
      );
    }
    console.log(`Updated thumbnail for ${item.product_id} -> ${item.url}`);
  }

  console.log('✅ All product promo banners successfully updated in SQLite database!');
}

updateThumbnails().then(() => process.exit(0)).catch(err => {
  console.error('Error updating thumbnails:', err);
  process.exit(1);
});
