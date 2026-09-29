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

// PUT /api/auth/change-password (Ubah Password & Email Admin)
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, email, phone, current_password, new_password } = req.body;
    const userId = req.user.id;

    const user = await dbAsync.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ status: 'error', error_code: 'USER_NOT_FOUND', message: 'User tidak ditemukan' });
    }

    // Jika ingin mengganti password, validasi password lama
    let passwordHash = user.password_hash;
    if (new_password && new_password.trim() !== '') {
      if (!current_password) {
        return res.status(400).json({ status: 'error', error_code: 'PASSWORD_REQUIRED', message: 'Password saat ini wajib diisi untuk verifikasi' });
      }
      const isMatch = await bcrypt.compare(current_password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ status: 'error', error_code: 'INVALID_CURRENT_PASSWORD', message: 'Password saat ini tidak sesuai' });
      }
      if (new_password.length < 6) {
        return res.status(400).json({ status: 'error', error_code: 'WEAK_PASSWORD', message: 'Password baru minimal 6 karakter' });
      }
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(new_password, salt);
    }

    // Periksa jika email diubah dan sudah terdaftar di user lain
    const targetEmail = (email || user.email).toLowerCase().trim();
    if (targetEmail !== user.email) {
      const existing = await dbAsync.get('SELECT id FROM users WHERE email = ? AND id != ?', [targetEmail, userId]);
      if (existing) {
        return res.status(400).json({ status: 'error', error_code: 'EMAIL_IN_USE', message: 'Email tersebut sudah digunakan oleh akun lain' });
      }
    }

    const targetName = (name || user.name).trim();
    const targetPhone = phone !== undefined ? phone : user.phone;

    await dbAsync.run(
      'UPDATE users SET name = ?, email = ?, phone = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [targetName, targetEmail, targetPhone, passwordHash, userId]
    );

    // Buat token baru dengan data terbaru
    const newToken = jwt.sign(
      { id: user.id, email: targetEmail, name: targetName, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      status: 'success',
      message: 'Profil dan password berhasil diperbarui!',
      data: {
        token: newToken,
        user: { id: user.id, name: targetName, email: targetEmail, role: user.role, phone: targetPhone }
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ status: 'error', error_code: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
