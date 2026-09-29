const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('../database/db');
const { requireAdmin, optionalAuth } = require('../middleware/auth');

function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}-${random}`;
}

// POST /api/orders/checkout (Guest & Customer Checkout)
router.post('/checkout', optionalAuth, async (req, res) => {
  try {
    const { 
      name, customer_name, 
      phone, customer_phone, 
      email, customer_email, 
      company_name, customer_company,
      product_id, 
      plan_id, tier_id, 
      payment_method, 
      notes 
    } = req.body;

    const custName = (customer_name || name || '').trim();
    const custPhone = (customer_phone || phone || '').trim();
    const custEmail = (customer_email || email || '').trim();
    const custCompany = (customer_company || company_name || '').trim();
    const targetPlanId = plan_id || tier_id;

    if (!custName || !custPhone || !product_id || !targetPlanId) {
      return res.status(400).json({
        status: 'error',
        error_code: 'MISSING_FIELDS',
        message: 'Nama Lengkap, No. WhatsApp, Produk, dan Paket wajib diisi.'
      });
    }

    const product = await dbAsync.get('SELECT * FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return res.status(404).json({ status: 'error', error_code: 'NOT_FOUND', message: 'Software tidak ditemukan' });
    }

    const plan = await dbAsync.get('SELECT * FROM plans WHERE id = ? AND product_id = ?', [targetPlanId, product_id]);
    if (!plan) {
      return res.status(404).json({ status: 'error', error_code: 'NOT_FOUND', message: 'Paket software tidak ditemukan' });
    }

    // Check or create customer record
    let customer = await dbAsync.get(
      'SELECT * FROM customers WHERE phone = ? OR (email != "" AND email = ?)',
      [custPhone, custEmail]
    );

    if (!customer) {
      const customerId = uuidv4();
      const customerCode = 'CUST-' + Math.floor(100000 + Math.random() * 900000);
      await dbAsync.run(
        `INSERT INTO customers (id, customer_code, name, company_name, email, phone, status)
         VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
        [customerId, customerCode, custName, custCompany, custEmail, custPhone]
      );
      customer = await dbAsync.get('SELECT * FROM customers WHERE id = ?', [customerId]);
    }

    const orderId = uuidv4();
    const orderNumber = generateOrderNumber();
    const totalAmount = plan.price;
    const now = new Date().toISOString();

    await dbAsync.run(
      `INSERT INTO orders (
        id, order_number, customer_id, customer_name, customer_phone, customer_email,
        total_amount, status, payment_method, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?)`,
      [
        orderId, orderNumber, customer.id, custName, custPhone, custEmail,
        totalAmount, payment_method || 'QRIS', notes || '', now
      ]
    );

    const orderItemId = uuidv4();
    await dbAsync.run(
      `INSERT INTO order_items (id, order_id, product_id, plan_id, product_name, plan_name, price, deliverables)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderItemId, orderId, product.id, plan.id, product.name, plan.name, totalAmount,
        plan.deliverables || '[]'
      ]
    );

    // Update product sales counter
    await dbAsync.run('UPDATE products SET sales_count = sales_count + 1 WHERE id = ?', [product.id]);

    const createdOrder = await dbAsync.get('SELECT * FROM orders WHERE id = ?', [orderId]);

    res.json({
      status: 'success',
      data: {
        id: createdOrder.id,
        invoice_number: createdOrder.order_number,
        order_number: createdOrder.order_number,
        product_name: product.name,
        plan_name: plan.name,
        total_amount: createdOrder.total_amount,
        payment_method: createdOrder.payment_method,
        payment_status: createdOrder.status,
        status: createdOrder.status,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email,
        windows_installer_url: product.windows_installer_url,
        android_apk_url: product.android_apk_url,
        user_manual_pdf_url: product.user_manual_pdf_url,
        created_at: createdOrder.created_at
      }
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/orders/track/:query (Lookup by Invoice / WhatsApp / Email)
router.get(['/track/:query', '/lookup/by-contact'], async (req, res) => {
  try {
    const q = (req.params.query || req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ status: 'error', error_code: 'MISSING_QUERY', message: 'No. Invoice atau WhatsApp wajib diisi' });
    }

    const order = await dbAsync.get(
      `SELECT o.id, o.order_number, o.order_number as invoice_number,
              o.customer_name, o.customer_phone, o.customer_email,
              o.total_amount, o.status, o.status as payment_status,
              o.payment_method, o.notes, o.created_at,
              oi.product_id, oi.plan_id, oi.product_name, oi.plan_name,
              p.slug as product_slug, p.version,
              p.windows_installer_url, p.android_apk_url, p.user_manual_pdf_url
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE o.order_number = ? OR o.customer_phone = ? OR o.customer_email = ?
       ORDER BY o.created_at DESC
       LIMIT 1`,
      [q, q, q]
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        error_code: 'NOT_FOUND',
        message: 'Pesanan tidak ditemukan. Periksa kembali No. Invoice atau WhatsApp Anda.'
      });
    }

    res.json({
      status: 'success',
      data: order
    });
  } catch (err) {
    console.error('Track order error:', err);
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/orders/admin/list (Admin List All Orders)
router.get('/admin/list', requireAdmin, async (req, res) => {
  try {
    const orders = await dbAsync.all(
      `SELECT o.id, o.order_number, o.order_number as invoice_number,
              o.customer_name, o.customer_phone, o.customer_email,
              o.total_amount, o.status, o.status as payment_status,
              o.payment_method, o.notes, o.created_at,
              oi.product_name, oi.plan_name,
              p.product_code
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN products p ON p.id = oi.product_id
       ORDER BY o.created_at DESC`
    );
    res.json({ status: 'success', data: orders });
  } catch (err) {
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

// PUT /api/orders/admin/:id/status (Admin Update Payment Status)
router.put('/admin/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const cleanStatus = status === 'PAID' ? 'COMPLETED' : status;

    if (!['PENDING', 'COMPLETED', 'PAID', 'CANCELLED', 'REFUNDED'].includes(cleanStatus)) {
      return res.status(400).json({ status: 'error', error_code: 'INVALID_STATUS', message: 'Status tidak valid' });
    }

    await dbAsync.run(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [cleanStatus === 'PAID' ? 'COMPLETED' : cleanStatus, req.params.id]
    );

    const updated = await dbAsync.get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
