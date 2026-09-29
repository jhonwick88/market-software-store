const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('../database/db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', error_code: 'INVALID_INPUT', message: 'Nama, email, dan password wajib diisi' });
    }

    const existingUser = await dbAsync.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(400).json({ status: 'error', error_code: 'EMAIL_EXISTS', message: 'Email sudah terdaftar. Silakan login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const userId = uuidv4();

    await dbAsync.run(
      'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), email.toLowerCase().trim(), password_hash, 'customer', phone || '']
    );

    const existingCustomer = await dbAsync.get('SELECT id FROM customers WHERE email = ? OR phone = ?', [email.toLowerCase().trim(), phone || '']);
    if (!existingCustomer) {
      const customerCode = 'CUST-' + Math.floor(100000 + Math.random() * 900000);
      await dbAsync.run(
        'INSERT INTO customers (id, customer_code, name, email, phone) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), customerCode, name.trim(), email.toLowerCase().trim(), phone || '']
      );
    }

    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), name: name.trim(), role: 'customer' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      status: 'success',
      data: {
        token,
        user: { id: userId, name: name.trim(), email: email.toLowerCase().trim(), role: 'customer', phone: phone || '' }
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'error', error_code: 'INVALID_INPUT', message: 'Email dan password wajib diisi' });
    }

    const user = await dbAsync.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ status: 'error', error_code: 'INVALID_CREDENTIALS', message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', error_code: 'INVALID_CREDENTIALS', message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      status: 'success',
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await dbAsync.get('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ status: 'error', error_code: 'USER_NOT_FOUND', message: 'User tidak ditemukan' });
    }
    res.json({ status: 'success', data: user });
  } catch (err) {
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
