/* ============================================================
   SILICON NEXUS — Express Server
   ============================================================ */
require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { securityMiddleware } = require('./middleware/security');
const { apiLimiter } = require('./middleware/rateLimiter');
const contactRoutes = require('./routes/contact');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security ──
securityMiddleware(app);

// ── Logging ──
app.use(morgan('short'));

// ── Rate Limiter on all API routes ──
app.use('/api', apiLimiter);

// ── API Routes ──
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── Health check ──
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        supabase: !!require('./lib/supabase'),
    });
});

// ── Static Files ──
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    },
}));

// ── Fallback to index.html ──
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Error Handler ──
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
});

// ── Start ──
app.listen(PORT, () => {
    console.log(`
  ⚡ Silicon Nexus Portfolio Server
  ─────────────────────────────────
  🌐 http://localhost:${PORT}
  📊 Health: http://localhost:${PORT}/api/health
  🔒 Security: Helmet + CORS + Rate Limiting
  💾 Database: ${require('./lib/supabase') ? 'Supabase ✓' : 'Not configured (fallback mode)'}
  📧 Email: ${process.env.EMAIL_PASS && !process.env.EMAIL_PASS.includes('your_') ? 'Configured ✓' : 'Not configured'}
  `);
});

module.exports = app;
