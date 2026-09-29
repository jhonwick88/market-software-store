const { dbAsync } = require('./db');

async function initSchema() {
  const schemaSQL = `
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      description TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      product_code TEXT UNIQUE NOT NULL,
      category_id TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      platforms TEXT,
      min_requirements TEXT,
      hardware_compat TEXT,
      version TEXT DEFAULT 'v1.0.0',
      trial_download_url TEXT,
      windows_installer_url TEXT,
      android_apk_url TEXT,
      user_manual_pdf_url TEXT,
      video_tutorial_url TEXT,
      is_published INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      sales_count INTEGER DEFAULT 0,
      rating REAL DEFAULT 4.9,
      review_count INTEGER DEFAULT 12,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      original_price INTEGER,
      billing_type TEXT DEFAULT 'lifetime',
      device_limit TEXT,
      deliverables TEXT,
      support_duration TEXT DEFAULT 'Support 6 Bulan',
      is_popular INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS features (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      group_name TEXT DEFAULT 'Fitur Utama',
      data_type TEXT DEFAULT 'BOOLEAN',
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS plan_features (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      feature_id TEXT NOT NULL,
      value TEXT NOT NULL,
      FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
      FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_media (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      type TEXT NOT NULL,
      url TEXT NOT NULL,
      caption TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      customer_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      company_name TEXT,
      email TEXT,
      phone TEXT NOT NULL,
      address TEXT,
      notes TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_id TEXT NOT NULL,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      total_amount INTEGER NOT NULL,
      status TEXT DEFAULT 'COMPLETED',
      payment_method TEXT DEFAULT 'whatsapp',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      plan_name TEXT NOT NULL,
      price INTEGER NOT NULL,
      deliverables TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
      FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS licenses (
      id TEXT PRIMARY KEY,
      license_key TEXT UNIQUE NOT NULL,
      customer_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      order_item_id TEXT,
      installation_id TEXT,
      status TEXT DEFAULT 'PENDING',
      max_devices REAL DEFAULT 1.0,
      activated_at DATETIME,
      last_validation_at DATETIME,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
      FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS installations (
      id TEXT PRIMARY KEY,
      license_id TEXT NOT NULL,
      installation_id TEXT UNIQUE NOT NULL,
      machine_fingerprint TEXT NOT NULL,
      platform TEXT,
      hostname TEXT,
      app_version TEXT,
      status TEXT DEFAULT 'ACTIVE',
      last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_server_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      business_name TEXT,
      rating INTEGER NOT NULL DEFAULT 5,
      comment TEXT NOT NULL,
      verified_buyer INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `;

  await dbAsync.exec(schemaSQL);
  console.log('Database schema initialized');
}

module.exports = { initSchema };
