const express = require('express');
const router = express.Router();
const { dbAsync } = require('../database/db');
const { requireAdmin } = require('../middleware/auth');

router.get('/overview', requireAdmin, async (req, res) => {
  try {
    const totalRevenueRow = await dbAsync.get(
      "SELECT SUM(total_amount) as total FROM orders WHERE status = 'PAID' OR status = 'COMPLETED'"
    );
    const totalOrdersRow = await dbAsync.get("SELECT COUNT(*) as count FROM orders");
    const paidOrdersRow = await dbAsync.get("SELECT COUNT(*) as count FROM orders WHERE status = 'PAID' OR status = 'COMPLETED'");
    const pendingOrdersRow = await dbAsync.get("SELECT COUNT(*) as count FROM orders WHERE status = 'PENDING'");
    const totalProductsRow = await dbAsync.get("SELECT COUNT(*) as count FROM products WHERE is_published = 1");
    const totalCustomersRow = await dbAsync.get("SELECT COUNT(*) as count FROM customers");

    const recentOrders = await dbAsync.all(
      `SELECT o.id, o.order_number, o.order_number as invoice_number,
              o.customer_name, o.customer_phone, o.customer_email,
              o.total_amount, o.status, o.status as payment_status,
              o.payment_method, o.created_at,
              oi.product_name, oi.plan_name
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );

    res.json({
      status: 'success',
      data: {
        total_revenue: totalRevenueRow?.total || 0,
        total_orders: totalOrdersRow?.count || 0,
        paid_orders: paidOrdersRow?.count || 0,
        pending_orders: pendingOrdersRow?.count || 0,
        total_products: totalProductsRow?.count || 0,
        total_customers: totalCustomersRow?.count || 0,
        recent_orders: recentOrders || []
      }
    });
  } catch (err) {
    console.error('Stats overview error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
