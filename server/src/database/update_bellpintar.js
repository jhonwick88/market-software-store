const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('./db');

async function updateBellPintar() {
  console.log('--- Updating Bell Pintar Product in Database ---');

  const bellProd = {
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
    trial_download_url: 'https://downloads.pintarlabs.id/bell/BellPintar_Demo_Trial.exe'
  };

  // Upsert category if not exists
  const catExists = await dbAsync.get('SELECT id FROM categories WHERE id = ?', ['cat-school']);
  if (!catExists) {
    await dbAsync.run(
      'INSERT INTO categories (id, slug, name, icon, description) VALUES (?, ?, ?, ?, ?)',
      ['cat-school', 'sistem-sekolah', 'Sistem Sekolah & Pendidikan', 'GraduationCap', 'Software otomasi bel sekolah cerdas, SPP, dan absensi']
    );
  }

  // Delete existing records for clean sync
  await dbAsync.run('DELETE FROM plan_features WHERE plan_id IN (SELECT id FROM plans WHERE product_id = ?)', [bellProd.id]);
  await dbAsync.run('DELETE FROM reviews WHERE product_id = ?', [bellProd.id]);
  await dbAsync.run('DELETE FROM product_media WHERE product_id = ?', [bellProd.id]);
  await dbAsync.run('DELETE FROM features WHERE product_id = ?', [bellProd.id]);
  await dbAsync.run('DELETE FROM plans WHERE product_id = ?', [bellProd.id]);
  await dbAsync.run('DELETE FROM products WHERE id = ? OR slug = ?', [bellProd.id, bellProd.slug]);

  // Insert product
  await dbAsync.run(
    `INSERT INTO products (
      id, product_code, category_id, slug, name, tagline, description,
      platforms, min_requirements, hardware_compat, version,
      trial_download_url, windows_installer_url, android_apk_url,
      user_manual_pdf_url, video_tutorial_url, is_published, is_featured,
      sales_count, rating, review_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      bellProd.id, bellProd.product_code, bellProd.category_id, bellProd.slug, bellProd.name, bellProd.tagline, bellProd.description,
      JSON.stringify(bellProd.platforms), JSON.stringify(bellProd.min_requirements), JSON.stringify(bellProd.hardware_compat),
      bellProd.version, bellProd.trial_download_url, bellProd.windows_installer_url, bellProd.android_apk_url,
      bellProd.user_manual_pdf_url, bellProd.video_tutorial_url, bellProd.is_published, bellProd.is_featured,
      bellProd.sales_count, bellProd.rating, bellProd.review_count
    ]
  );

  // Insert Plans
  const plans = [
    {
      id: 'plan-bell-basic',
      code: 'BASIC',
      name: 'Paket Basic Sekolah (1 PC TU)',
      description: 'Cocok untuk sekolah dengan 1 komputer sentral di ruang Tata Usaha / Piket.',
      price: 175000,
      original_price: 350000,
      billing_type: 'lifetime',
      device_limit: { windows: 1, android: 1 },
      deliverables: [
        '1 Lisensi Mesin PC Desktop (Permanen)',
        'Jadwal Bel Alarm Otomatis Tanpa Batas',
        'Paket Audio Nada Standar 3 Bahasa (ID, EN, AR)',
        'Bebas Tambah File MP3 / Mars Sekolah',
        '100% Offline Tanpa Butuh Internet',
        'E-Book Panduan PDF & Video Tutorial',
        'Garansi Teknis 6 Bulan'
      ],
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
      deliverables: [
        '1 Lisensi Server PC Utama (Lifetime Resmi)',
        'Multi-Perangkat: Remote hingga 3 HP / Tablet Guru',
        'PIN Khusus Guru Piket (432234) & Admin (741147)',
        'Bundle 119+ Audio Studio HD (Nada & Narasi Lengkap)',
        'Studio Pengumuman Text-to-Speech (TTS)',
        'Fitur Bunyikan Bel & Pengumuman Spontan via HP',
        'Prioritas Panduan Instalasi & Remote Support Team',
        'Support Prioritas 1 Tahun'
      ],
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
      deliverables: [
        '1 Unit Mini PC Server Siap Pakai (Windows Pre-Installed)',
        'Lisensi Bell Pintar PRO Lifetime Terpasang',
        'Kabel Audio Gold-Plated 3.5mm to RCA Amplifier',
        'Adaptor Daya & Bracket Dinding Mini PC',
        'Aplikasi Android Guru Piket (Multi-Device)',
        'Siap Pakai: Colok Speaker Langsung Berbunyi',
        'Garansi Hardware 1 Tahun & Support Penuh'
      ],
      support_duration: 'Garansi & Support 1 Tahun',
      is_popular: 0
    }
  ];

  for (const pl of plans) {
    await dbAsync.run(
      `INSERT INTO plans (
        id, product_id, code, name, description, price, original_price,
        billing_type, device_limit, deliverables, support_duration, is_popular
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pl.id, bellProd.id, pl.code, pl.name, pl.description, pl.price, pl.original_price,
        pl.billing_type, JSON.stringify(pl.device_limit), JSON.stringify(pl.deliverables),
        pl.support_duration, pl.is_popular
      ]
    );
  }

  // Insert Features
  const features = [
    {
      code: 'auto_schedule',
      name: 'Jadwal Alarm Presisi & Preset Khusus Ujian',
      group_name: 'Otomasi',
      description: 'Atur jadwal otomatis hari Senin-Sabtu dengan pola berbeda (Senin upacara, Jumat pulang awal, atau jadwal khusus Ramadhan & PTS/PAS Ujian).'
    },
    {
      code: 'remote_pin',
      name: 'Remote Multi-Device HP Guru Piket (PIN Security)',
      group_name: 'Konektivitas',
      description: 'Kendalikan bel dari mana saja di area sekolah via Wi-Fi lokal. Didukung PIN ganda: Guru Piket (432234) & Admin (741147).'
    },
    {
      code: 'studio_sound_bank',
      name: 'Bank Suara 119+ Nada Studio 3 Bahasa (ID, EN, AR)',
      group_name: 'Audio Studio',
      description: 'Koleksi narasi studio profesional berkualitas tinggi, lagu kebangsaan Indonesia Raya, Mars Sekolah, serta audio doa awal/akhir belajar.'
    },
    {
      code: 'tts_broadcast',
      name: 'Studio Pengumuman Text-to-Speech (TTS) Cepat',
      group_name: 'Siaran',
      description: 'Cukup ketik pengumuman atau panggilan nama siswa, sistem akan merubah teks menjadi suara vokal jernih yang langsung disiarkan ke speaker.'
    },
    {
      code: 'offline_lan',
      name: '100% Offline LAN Tanpa Kuota Internet',
      group_name: 'Infrastruktur',
      description: 'Sistem beroperasi 100% mandiri di komputer sekolah dengan database SQLite lokal. Tidak akan berhenti berbunyi saat koneksi internet putus.'
    },
    {
      code: 'lifetime_license',
      name: 'Lisensi Sekali Bayar (Lifetime) Tanpa Iuran Bulanan',
      group_name: 'Lisensi',
      description: 'Bebas biaya langganan bulanan maupun tahunan. Sekali beli untuk sekolah, nikmati pemakaian selamanya tanpa tagihan tersembunyi.'
    }
  ];

  for (let i = 0; i < features.length; i++) {
    const feat = features[i];
    const featId = uuidv4();
    await dbAsync.run(
      `INSERT INTO features (id, product_id, code, name, description, group_name, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [featId, bellProd.id, feat.code, feat.name, feat.description, feat.group_name, i + 1]
    );

    for (const pl of plans) {
      await dbAsync.run(
        'INSERT INTO plan_features (id, plan_id, feature_id, value) VALUES (?, ?, ?, ?)',
        [uuidv4(), pl.id, featId, 'true']
      );
    }
  }

  // Insert Media
  const mediaList = [
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
  ];

  for (const m of mediaList) {
    await dbAsync.run(
      'INSERT INTO product_media (id, product_id, type, url, caption, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), bellProd.id, m.type, m.url, m.caption, m.sort_order]
    );
  }

  // Insert Real Reviews
  const reviews = [
    {
      customer_name: 'Budi Santoso, S.Pd.',
      business_name: 'Wakasek Kurikulum • SMA Negeri Malang',
      rating: 5,
      comment: 'Dulu guru piket sering terlambat membunyikan bel istirahat karena sedang menangani siswa. Sejak pakai Bell Pintar, semuanya otomatis dan suara narasinya sangat sopan dan terdengar resmi.'
    },
    {
      customer_name: 'Nur Rohman, S.Kom.',
      business_name: 'Koordinator Lab Komputer • SMK Surabaya',
      rating: 5,
      comment: 'Fitur remote dari HP sangat membantu kami saat upacara bendera dan apel pagi. Tinggal pencet dari pinggir lapangan via HP, lagu Indonesia Raya dan bel apel langsung berkumandang.'
    },
    {
      customer_name: 'Ustadzah Fatimah Azzahra',
      business_name: 'Pengasuh Ponpes Modern Darul Hikmah',
      rating: 5,
      comment: 'Nada bel berbahasa Arab dan doa belajarnya sangat cocok untuk kultur pesantren kami. 100% offline tanpa internet jadi sangat hemat dan stabil.'
    },
    {
      customer_name: 'Agus Setiawan, S.Pd.',
      business_name: 'Kepala TU • SMP Negeri 2 Bandung',
      rating: 5,
      comment: 'Instalasinya sangat mudah dan cepat. Customer service PintarLabs di WhatsApp juga sangat ramah dan responsif membantu penyesuaian jadwal sekolah kami.'
    }
  ];

  for (const r of reviews) {
    await dbAsync.run(
      'INSERT INTO reviews (id, product_id, customer_name, business_name, rating, comment, verified_buyer) VALUES (?, ?, ?, ?, ?, ?, 1)',
      [uuidv4(), bellProd.id, r.customer_name, r.business_name, r.rating, r.comment]
    );
  }

  console.log('✅ Bell Pintar successfully updated with 3 plans, 6 features, 10 media screenshots, and 4 reviews!');
}

updateBellPintar().then(() => process.exit(0)).catch(err => {
  console.error('Error updating Bell Pintar:', err);
  process.exit(1);
});
