const express = require('express');
const { analyticsLimiter } = require('../middleware/rateLimiter');
const supabase = require('../lib/supabase');

const router = express.Router();

// POST /api/track — record a page visit
router.post('/', analyticsLimiter, async (req, res) => {
    if (!supabase) return res.json({ tracked: false, reason: 'DB not configured' });

    const { page, referrer } = req.body;

    try {
        const crypto = require('crypto');
        const ipHash = crypto.createHash('sha256')
            .update((req.ip || '') + (process.env.ADMIN_SECRET || 'salt'))
            .digest('hex').substring(0, 16);

        const { error } = await supabase.from('visitors').insert({
            page: (page || '/').substring(0, 200),
            referrer: (referrer || '').substring(0, 500),
            ip_hash: ipHash,
            user_agent: (req.headers['user-agent'] || '').substring(0, 300),
            country: req.headers['x-vercel-ip-country'] || null,
            created_at: new Date().toISOString(),
        });

        if (error) console.error('Analytics insert error:', error.message);
        res.json({ tracked: !error });
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ tracked: false });
    }
});

// GET /api/analytics — admin: view stats
router.get('/', async (req, res) => {
    if (req.query.secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!supabase) return res.json({ stats: null, note: 'Supabase not configured' });

    try {
        // Total page views
        const { count: totalViews } = await supabase
            .from('visitors').select('*', { count: 'exact', head: true });

        // Unique visitors (by IP hash)
        const { data: uniques } = await supabase
            .from('visitors').select('ip_hash');
        const uniqueVisitors = new Set(uniques?.map(v => v.ip_hash)).size;

        // Recent visitors (last 50)
        const { data: recent } = await supabase
            .from('visitors').select('*')
            .order('created_at', { ascending: false }).limit(50);

        // Top pages
        const pageCounts = {};
        recent?.forEach(v => { pageCounts[v.page] = (pageCounts[v.page] || 0) + 1; });

        res.json({
            stats: {
                totalViews,
                uniqueVisitors,
                topPages: Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 10),
                recentVisitors: recent?.slice(0, 20),
            }
        });
    } catch (err) {
        console.error('Analytics fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
