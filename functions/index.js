/* ============================================================
   SILICON NEXUS — Firebase Cloud Functions
   Analytics tracker (Firestore write)
   ============================================================ */

const { onRequest } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

// Deploy Cloud Functions to the region closest to your users
// Mumbai (asia-south1) is the closest free-tier region for India
setGlobalOptions({ region: 'asia-south1' });

admin.initializeApp();
const db = admin.firestore();

// ── POST /api/analytics — track a page visit ──────────────────
exports.trackVisit = onRequest(
  { cors: true, maxInstances: 10 },
  async (req, res) => {
    // Only allow POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { page, referrer } = req.body || {};

    // Basic validation
    if (!page || typeof page !== 'string') {
      return res.status(400).json({ error: 'Invalid page' });
    }

    try {
      const crypto = require('crypto');
      const ip = req.headers['x-forwarded-for'] || req.ip || 'unknown';
      const ipHash = crypto
        .createHash('sha256')
        .update(ip + (process.env.ADMIN_SECRET || 'salt'))
        .digest('hex')
        .substring(0, 16);

      await db.collection('visitors').add({
        page: page.substring(0, 200),
        referrer: (referrer || '').substring(0, 500),
        ipHash,
        userAgent: (req.headers['user-agent'] || '').substring(0, 300),
        country: req.headers['x-appengine-country'] || req.headers['x-country-code'] || null,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.json({ tracked: true });
    } catch (err) {
      console.error('Analytics error:', err);
      return res.status(500).json({ tracked: false });
    }
  }
);
