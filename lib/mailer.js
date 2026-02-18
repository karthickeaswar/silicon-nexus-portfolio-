const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
    if (transporter) return transporter;

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass || pass.includes('your_')) {
        console.warn('⚠️  Email not configured — contact messages will be saved but not emailed.');
        return null;
    }

    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
    });

    return transporter;
}

async function sendContactEmail({ name, email, subject, message }) {
    const t = getTransporter();
    if (!t) return { sent: false, reason: 'Email not configured' };

    try {
        await t.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `🔬 Portfolio: ${subject || 'New Message'} — from ${name}`,
            html: `
        <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8faff;border-radius:16px;">
          <div style="background:linear-gradient(135deg,#0066ff,#6c5ce7);padding:24px 32px;border-radius:12px;margin-bottom:24px;">
            <h2 style="color:#fff;margin:0;font-size:20px;">⚡ New Contact Message</h2>
          </div>
          <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid rgba(0,102,255,0.1);">
            <p style="margin:0 0 8px"><strong>Name:</strong> ${name}</p>
            <p style="margin:0 0 8px"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin:0 0 8px"><strong>Subject:</strong> ${subject || '—'}</p>
            <hr style="border:none;border-top:1px solid #eef2ff;margin:16px 0;">
            <p style="margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="color:#8b8fa8;font-size:12px;text-align:center;margin-top:20px;">
            Sent from your Silicon Nexus Portfolio
          </p>
        </div>
      `,
        });
        return { sent: true };
    } catch (err) {
        console.error('Email error:', err.message);
        return { sent: false, reason: err.message };
    }
}

module.exports = { sendContactEmail };
