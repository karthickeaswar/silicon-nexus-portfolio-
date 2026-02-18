const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');

function securityMiddleware(app) {
    // Helmet — sets comprehensive security headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "blob:"],
                connectSrc: ["'self'", "https://*.supabase.co"],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));

    // CORS — restrict to same origin in production
    app.use(cors({
        origin: process.env.NODE_ENV === 'production'
            ? process.env.ALLOWED_ORIGIN || true
            : true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        maxAge: 86400,
    }));

    // HPP — prevent HTTP parameter pollution
    app.use(hpp());

    // Body size limit
    app.use(require('express').json({ limit: '10kb' }));
    app.use(require('express').urlencoded({ extended: false, limit: '10kb' }));
}

// Input sanitizer — strips HTML tags and trims
function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/<[^>]*>/g, '')     // Strip HTML tags
        .replace(/[<>]/g, '')        // Remove leftover brackets
        .trim()
        .substring(0, 2000);         // Cap length
}

module.exports = { securityMiddleware, sanitize };
