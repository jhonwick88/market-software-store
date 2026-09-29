const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('../database/db');
const { requireAdmin } = require('../middleware/auth');

async function hydrateProduct(product) {
  if (!product) return null;

  try { product.platforms = JSON.parse(product.platforms || '[]'); } catch (e) { product.platforms = []; }
  try { product.min_requirements = JSON.parse(product.min_requirements || '{}'); } catch (e) { product.min_requirements = {}; }
  try { product.hardware_compat = JSON.parse(product.hardware_compat || '[]'); } catch (e) { product.hardware_compat = []; }

  const category = await dbAsync.get('SELECT * FROM categories WHERE id = ?', [product.category_id]);
  product.category = category;

  const plans = await dbAsync.all('SELECT * FROM plans WHERE product_id = ? ORDER BY sort_order ASC, price ASC', [product.id]);
  for (const plan of plans) {
    try { plan.device_limit = JSON.parse(plan.device_limit || '{}'); } catch (e) { plan.device_limit = {}; }
    try { plan.deliverables = JSON.parse(plan.deliverables || '[]'); } catch (e) { plan.deliverables = []; }

    const planFeatures = await dbAsync.all(
      `SELECT pf.*, f.code as feature_code, f.name as feature_name, f.group_name, f.data_type
       FROM plan_features pf
       JOIN features f ON f.id = pf.feature_id
       WHERE pf.plan_id = ?`,
      [plan.id]
    );
    plan.features = planFeatures;
  }
  product.plans = plans;

  const features = await dbAsync.all('SELECT * FROM features WHERE product_id = ? ORDER BY sort_order ASC', [product.id]);
  product.features = features;

  const media = await dbAsync.all('SELECT * FROM product_media WHERE product_id = ? ORDER BY sort_order ASC', [product.id]);
  product.media = media;

  const reviews = await dbAsync.all('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [product.id]);
  product.reviews = reviews;

  return product;
}

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await dbAsync.all('SELECT * FROM categories ORDER BY sort_order ASC');
    res.json({ status: 'success', data: categories });
  } catch (err) {
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/products (Public Catalog)
router.get('/', async (req, res) => {
  try {
    const { category, platform, search, featured } = req.query;
    let sql = 'SELECT * FROM products WHERE is_published = 1';
    const params = [];

    if (category && category !== 'all') {
      const cat = await dbAsync.get('SELECT id FROM categories WHERE slug = ?', [category]);
      if (cat) {
        sql += ' AND category_id = ?';
        params.push(cat.id);
      }
    }

    if (featured === 'true' || featured === '1') {
      sql += ' AND is_featured = 1';
    }

    if (search && search.trim() !== '') {
      sql += ' AND (name LIKE ? OR tagline LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY is_featured DESC, sales_count DESC, created_at DESC';

    const products = await dbAsync.all(sql, params);
    const hydratedList = [];

    for (const p of products) {
      const hydrated = await hydrateProduct(p);
      if (platform && platform !== 'all') {
        if (!hydrated.platforms.includes(platform)) {
          continue;
        }
      }
      hydratedList.push(hydrated);
    }

    res.json({ status: 'success', data: hydratedList });
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/products/:slug (Public Detail Page)
router.get('/:slug', async (req, res) => {
  try {
    const product = await dbAsync.get(
      'SELECT * FROM products WHERE slug = ? OR id = ?',
      [req.params.slug, req.params.slug]
    );

    if (!product) {
      return res.status(404).json({ status: 'error', error_code: 'NOT_FOUND', message: 'Software tidak ditemukan' });
    }

    const hydrated = await hydrateProduct(product);
    res.json({ status: 'success', data: hydrated });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

// POST /api/products (Admin Create)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      product_code, category_id, slug, name, tagline, description,
      platforms, min_requirements, hardware_compat, version,
      trial_download_url, windows_installer_url, android_apk_url,
      user_manual_pdf_url, video_tutorial_url, is_published, is_featured
    } = req.body;

    const id = uuidv4();
    await dbAsync.run(
      `INSERT INTO products (
        id, product_code, category_id, slug, name, tagline, description,
        platforms, min_requirements, hardware_compat, version,
        trial_download_url, windows_installer_url, android_apk_url,
        user_manual_pdf_url, video_tutorial_url, is_published, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, product_code.toUpperCase(), category_id, slug, name, tagline, description,
        JSON.stringify(platforms || ['windows', 'android']),
        JSON.stringify(min_requirements || {}),
        JSON.stringify(hardware_compat || []),
        version || 'v1.0.0',
        trial_download_url || '',
        windows_installer_url || '',
        android_apk_url || '',
        user_manual_pdf_url || '',
        video_tutorial_url || '',
        is_published ? 1 : 0,
        is_featured ? 1 : 0
      ]
    );

    const created = await dbAsync.get('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ status: 'success', data: await hydrateProduct(created) });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

// PUT /api/products/:id (Admin Update)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_code, category_id, slug, name, tagline, description,
      platforms, min_requirements, hardware_compat, version,
      trial_download_url, windows_installer_url, android_apk_url,
      user_manual_pdf_url, video_tutorial_url, is_published, is_featured
    } = req.body;

    await dbAsync.run(
      `UPDATE products SET
        product_code = ?, category_id = ?, slug = ?, name = ?, tagline = ?, description = ?,
        platforms = ?, min_requirements = ?, hardware_compat = ?, version = ?,
        trial_download_url = ?, windows_installer_url = ?, android_apk_url = ?,
        user_manual_pdf_url = ?, video_tutorial_url = ?, is_published = ?, is_featured = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        product_code.toUpperCase(), category_id, slug, name, tagline, description,
        JSON.stringify(platforms || []),
        JSON.stringify(min_requirements || {}),
        JSON.stringify(hardware_compat || []),
        version,
        trial_download_url, windows_installer_url, android_apk_url,
        user_manual_pdf_url, video_tutorial_url,
        is_published ? 1 : 0, is_featured ? 1 : 0,
        id
      ]
    );

    if (Array.isArray(req.body.media)) {
      await dbAsync.run('DELETE FROM product_media WHERE product_id = ?', [id]);
      for (let i = 0; i < req.body.media.length; i++) {
        const m = req.body.media[i];
        if (m && m.url && m.url.trim() !== '') {
          await dbAsync.run(
            'INSERT INTO product_media (id, product_id, type, url, caption, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [m.id || uuidv4(), id, m.type || 'screenshot', m.url, m.caption || '', i + 1]
          );
        }
      }
    }

    const updated = await dbAsync.get('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ status: 'success', data: await hydrateProduct(updated) });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

// DELETE /api/products/:id (Admin Delete)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await dbAsync.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ status: 'success', message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
