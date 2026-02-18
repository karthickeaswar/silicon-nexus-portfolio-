const rateLimit = require('express-rate-limit');

// General API limiter — 100 requests per 15 minutes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Contact form limiter — 5 submissions per hour (anti-spam)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Too many messages sent. Please try again in an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Analytics limiter — 30 per minute
const analyticsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: 'Rate limited.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter, contactLimiter, analyticsLimiter };
