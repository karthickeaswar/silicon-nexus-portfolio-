const express = require('express');
const { body, validationResult } = require('express-validator');
const { contactLimiter } = require('../middleware/rateLimiter');
const { sanitize } = require('../middleware/security');
const supabase = require('../lib/supabase');
const { sendContactEmail } = require('../lib/mailer');

const router = express.Router();

// POST /api/contact — submit contact form
router.post('/',
    contactLimiter,
    [
        body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
        body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('subject').optional().trim().isLength({ max: 200 }),
        body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
    ],
    async (req, res) => {
        // Validate
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const name = sanitize(req.body.name);
        const email = sanitize(req.body.email);
        const subject = sanitize(req.body.subject || '');
        const message = sanitize(req.body.message);

        try {
            // Store in Supabase
            if (supabase) {
                const { error } = await supabase.from('contacts').insert({
                    name, email, subject, message,
                    ip_hash: hashIP(req.ip),
                    user_agent: (req.headers['user-agent'] || '').substring(0, 300),
                    created_at: new Date().toISOString(),
                });
                if (error) console.error('DB insert error:', error.message);
            }

            // Send email notification
            const emailResult = await sendContactEmail({ name, email, subject, message });

            console.log(`📬 Contact from ${name} <${email}> — DB: ${supabase ? 'saved' : 'skipped'}, Email: ${emailResult.sent ? 'sent' : emailResult.reason}`);

            res.json({
                success: true,
                message: 'Message received! I\'ll get back to you soon.',
            });
        } catch (err) {
            console.error('Contact error:', err);
            res.status(500).json({ error: 'Something went wrong. Please try again.' });
        }
    }
);

// GET /api/contact — admin: list messages
router.get('/', (req, res) => {
    if (req.query.secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!supabase) return res.json({ contacts: [], note: 'Supabase not configured' });

    supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(100)
        .then(({ data, error }) => {
            if (error) return res.status(500).json({ error: error.message });
            res.json({ contacts: data });
        });
});

// Hash IP for privacy
function hashIP(ip) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(ip + (process.env.ADMIN_SECRET || 'salt')).digest('hex').substring(0, 16);
}

module.exports = router;
