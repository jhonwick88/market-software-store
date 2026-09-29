const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('../database/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { generateLicenseKey } = require('../services/licenseGenerator');
const licenseBridge = require('../services/licensePlatformBridge');

// GET /api/licenses/platform-status (Check connection to Go Backend)
router.get('/platform-status', async (req, res) => {
  const status = await licenseBridge.checkHealth();
  res.json({
    connected_to: licenseBridge.PLATFORM_URL,
    status: status.online ? 'CONNECTED' : 'DISCONNECTED',
    details: status
  });
});

// POST /api/licenses/activate & POST /api/license/activate
const handleActivate = async (req, res) => {
  try {
    const { license_key, machine_fingerprint, hardware_id, app_version, hostname, platform, device_name } = req.body;
    const hwid = (machine_fingerprint || hardware_id || '').trim();

    if (!license_key || !hwid) {
      return res.status(400).json({
        status: 'error',
        error_code: 'INVALID_REQUEST',
        message: 'license_key dan machine_fingerprint / hardware_id wajib diisi'
      });
    }

    // 1. First, attempt to activate via connected Go License Platform (H:\FlutterProject\pintarlabs_license_platform\backend)
    const platformRes = await licenseBridge.activateOnPlatform({
      license_key,
      machine_fingerprint: hwid,
      app_version,
      hostname: hostname || device_name,
      platform
    });

    if (platformRes.success) {
      // Sync local status if license exists in local DB
      await dbAsync.run(
        `UPDATE licenses SET status = 'ACTIVE', last_validation_at = CURRENT_TIMESTAMP WHERE license_key = ?`,
        [license_key.trim()]
      );

      return res.json({
        status: 'success',
        source: 'go_license_platform',
        data: platformRes.data.data || platformRes.data
      });
    }

    // 2. If Go server returned a specific business rejection (e.g. CUSTOMER_INACTIVE, LICENSE_SUSPENDED), forward it
    if (platformRes.statusCode && platformRes.statusCode < 500 && platformRes.errorCode !== 'PLATFORM_ERROR') {
      return res.status(platformRes.statusCode).json({
        status: 'error',
        error_code: platformRes.errorCode,
        message: platformRes.message
      });
    }

    // 3. Fallback: Check Store Local DB
    const license = await dbAsync.get('SELECT * FROM licenses WHERE license_key = ?', [license_key.trim()]);
    if (!license) {
      return res.status(404).json({
        status: 'error',
        error_code: 'INVALID_LICENSE',
        message: 'Kode lisensi tidak ditemukan di sistem PintarLabs'
      });
    }

    if (license.status === 'REVOKED' || license.status === 'SUSPENDED') {
      return res.status(403).json({
        status: 'error',
        error_code: 'LICENSE_SUSPENDED',
        message: 'Lisensi ini sedang dinonaktifkan atau ditangguhkan.'
      });
    }

    const installation = await dbAsync.get(
      'SELECT * FROM installations WHERE license_id = ? AND machine_fingerprint = ?',
      [license.id, hwid]
    );

    const now = new Date().toISOString();

    if (!installation) {
      const activeInstalls = await dbAsync.get(
        'SELECT COUNT(*) as count FROM installations WHERE license_id = ? AND status = "ACTIVE"',
        [license.id]
      );

      const maxLimit = license.max_devices || 1.0;
      if (activeInstalls.count >= maxLimit) {
        return res.status(403).json({
          status: 'error',
          error_code: 'MAX_DEVICES_REACHED',
          message: `Batas maksimal perangkat (${maxLimit} device) untuk lisensi ini telah tercapai.`
        });
      }

      const installationId = uuidv4();
      await dbAsync.run(
        `INSERT INTO installations (id, license_id, installation_id, machine_fingerprint, platform, hostname, app_version, status, last_seen_at, last_server_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)`,
        [installationId, license.id, uuidv4(), hwid, platform || 'windows', hostname || device_name || '', app_version || '', now, now]
      );

      await dbAsync.run(
        `UPDATE licenses SET status = 'ACTIVE', activated_at = COALESCE(activated_at, ?), last_validation_at = ?, updated_at = ? WHERE id = ?`,
        [now, now, now, license.id]
      );
    } else {
      await dbAsync.run(
        `UPDATE installations SET last_seen_at = ?, last_server_time = ?, hostname = ?, app_version = ?, status = 'ACTIVE' WHERE id = ?`,
        [now, now, hostname || device_name || installation.hostname, app_version || installation.app_version, installation.id]
      );

      await dbAsync.run(
        `UPDATE licenses SET status = 'ACTIVE', last_validation_at = ?, updated_at = ? WHERE id = ?`,
        [now, now, license.id]
      );
    }

    const product = await dbAsync.get('SELECT id, product_code, name, version FROM products WHERE id = ?', [license.product_id]);
    const plan = await dbAsync.get('SELECT id, code, name FROM plans WHERE id = ?', [license.plan_id]);
    const customer = await dbAsync.get('SELECT id, customer_code, name, email, phone FROM customers WHERE id = ?', [license.customer_id]);

    res.json({
      status: 'success',
      source: 'store_local_database',
      data: {
        license_key: license.license_key,
        status: 'ACTIVE',
        product: product,
        plan: plan,
        customer: customer,
        machine_fingerprint: hwid,
        device_name: device_name || hostname,
        server_time: now,
        expires_at: license.expires_at || null
      }
    });
  } catch (err) {
    console.error('Activate error:', err);
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
};

router.post('/activate', handleActivate);

// POST /api/licenses/validate
router.post('/validate', async (req, res) => {
  try {
    const { license_key, machine_fingerprint, token } = req.body;
    if (!license_key) {
      return res.status(400).json({ status: 'error', error_code: 'INVALID_REQUEST', message: 'license_key wajib diisi' });
    }

    // 1. Try validation with Go License Platform
    const platformRes = await licenseBridge.validateOnPlatform({ license_key, machine_fingerprint, token });
    if (platformRes.success) {
      return res.json({ status: 'success', source: 'go_license_platform', data: platformRes.data });
    }

    // 2. Fallback to store DB
    const license = await dbAsync.get('SELECT * FROM licenses WHERE license_key = ?', [license_key.trim()]);
    if (!license || license.status !== 'ACTIVE') {
      return res.status(401).json({ status: 'error', error_code: 'INVALID_LICENSE', message: 'Lisensi tidak aktif atau tidak valid' });
    }

    const now = new Date().toISOString();
    await dbAsync.run('UPDATE licenses SET last_validation_at = ? WHERE id = ?', [now, license.id]);

    res.json({
      status: 'success',
      source: 'store_local_database',
      data: {
        license_key: license.license_key,
        status: 'ACTIVE',
        valid: true,
        server_time: now
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

// Admin endpoints
router.get('/admin/list', requireAdmin, async (req, res) => {
  try {
    const licenses = await dbAsync.all(
      `SELECT l.*, p.name as product_name, p.product_code, pl.name as plan_name, pl.code as plan_code,
              c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
              (SELECT COUNT(*) FROM installations i WHERE i.license_id = l.id) as installation_count
       FROM licenses l
       LEFT JOIN products p ON p.id = l.product_id
       LEFT JOIN plans pl ON pl.id = l.plan_id
       LEFT JOIN customers c ON c.id = l.customer_id
       ORDER BY l.created_at DESC`
    );
    res.json({ status: 'success', data: licenses });
  } catch (err) {
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

router.post('/admin/generate', requireAdmin, async (req, res) => {
  try {
    const { product_id, plan_id, customer_id, max_devices } = req.body;
    const product = await dbAsync.get('SELECT * FROM products WHERE id = ?', [product_id]);
    const plan = await dbAsync.get('SELECT * FROM plans WHERE id = ?', [plan_id]);
    if (!product || !plan) {
      return res.status(400).json({ status: 'error', error_code: 'INVALID_INPUT', message: 'Product & Plan valid diperlukan' });
    }

    const key = await generateLicenseKey(product.product_code, plan.code);
    const id = uuidv4();
    await dbAsync.run(
      `INSERT INTO licenses (id, license_key, customer_id, product_id, plan_id, status, max_devices)
       VALUES (?, ?, ?, ?, ?, 'PENDING', ?)`,
      [id, key, customer_id || 'manual', product.id, plan.id, max_devices || 1.0]
    );

    res.json({ status: 'success', data: { id, license_key: key, status: 'PENDING' } });
  } catch (err) {
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

router.post('/admin/:id/suspend', requireAdmin, async (req, res) => {
  try {
    await dbAsync.run("UPDATE licenses SET status = 'SUSPENDED', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [req.params.id]);
    await licenseBridge.suspendOnPlatform(req.params.id);
    res.json({ status: 'success', message: 'Lisensi berhasil ditangguhkan' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/admin/:id/resume', requireAdmin, async (req, res) => {
  try {
    await dbAsync.run("UPDATE licenses SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [req.params.id]);
    await licenseBridge.resumeOnPlatform(req.params.id);
    res.json({ status: 'success', message: 'Lisensi berhasil diaktifkan kembali' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/admin/:id/unbind', requireAdmin, async (req, res) => {
  try {
    await dbAsync.run('DELETE FROM installations WHERE license_id = ?', [req.params.id]);
    await dbAsync.run("UPDATE licenses SET status = 'PENDING', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [req.params.id]);
    await licenseBridge.unbindOnPlatform(req.params.id);
    res.json({ status: 'success', message: 'Perangkat terikat berhasil di-reset (Unbind HWID)' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
