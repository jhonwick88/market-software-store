const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { requireAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', error_code: 'NO_FILE', message: 'Tidak ada file yang diunggah' });
  }
  const fileUrl = '/uploads/' + req.file.filename;
  res.json({
    status: 'success',
    data: {
      url: fileUrl,
      filename: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size
    }
  });
});

module.exports = router;
