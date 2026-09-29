require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initSchema } = require('./database/schema');
const { dbAsync } = require('./database/db');

const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const statsRoutes = require('./routes/stats');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use('/images', express.static(path.resolve(__dirname, '../../client/public/images')));

// Dynamic SEO Sitemap endpoint
app.get(['/sitemap.xml', '/api/sitemap.xml'], async (req, res) => {
  try {
    const siteUrl = process.env.SITE_URL || 'https://labspintar.com';
    const products = await dbAsync.all('SELECT slug, updated_at FROM products WHERE is_published = 1');
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const staticRoutes = [
      { url: `${siteUrl}/`, priority: '1.0', changefreq: 'daily' },
      { url: `${siteUrl}/explore`, priority: '0.9', changefreq: 'daily' },
      { url: `${siteUrl}/track`, priority: '0.7', changefreq: 'weekly' }
    ];

    staticRoutes.forEach(r => {
      xml += `  <url>\n    <loc>${r.url}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
    });

    products.forEach(p => {
      xml += `  <url>\n    <loc>${siteUrl}/product/${p.slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.95</priority>\n  </url>\n`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// Dynamic Robots.txt endpoint
app.get(['/robots.txt', '/api/robots.txt'], (req, res) => {
  const siteUrl = process.env.SITE_URL || 'https://labspintar.com';
  const robots = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

// Marketplace API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// Category listing endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const cats = await dbAsync.all('SELECT * FROM categories ORDER BY sort_order ASC, name ASC');
    res.json({ status: 'success', data: cats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PintarLabs Software Marketplace Server', time: new Date() });
});

// Initialize database schema and start server
initSchema().then(() => {
  app.listen(PORT, () => {
    console.log(`PintarLabs Marketplace Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database schema:', err);
});
