const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, company, email, phone, need, message, website } = req.body || {};

    if (website) {
      return res.status(200).json({ success: true });
    }

    if (!name || !email || !need) {
      return res.status(400).json({ error: 'Name, email, and need are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.error('Missing SMTP environment variables');
      return res.status(500).json({ 
        error: 'Email service not configured. Please contact the site owner.' 
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587', 10),
      secure: (SMTP_PORT === '465'),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const toAddress = TO_EMAIL || 'jason@fiberfirstsolutions.com';

    const needLabels = {
      'fiber-internet': 'Business Fiber / Internet',
      'voip-ucaas': 'VoIP / Phone System / UCaaS',
      'sd-wan': 'SD-WAN / Multi-location Networking',
      'cloud': 'Cloud Connectivity',
      'security': 'Network Security',
      'audit': 'Full Telecom Cost Audit',
      'other': 'Other / Not sure yet'
    };

    const needLabel = needLabels[need] || need;

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f4c81; border-bottom: 2px solid #00a896; padding-bottom: 8px;">New Lead from Fiber First Solutions Website</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 0; font-weight: 600; width: 140px; color: #5a5a72;">Name</td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #5a5a72;">Company</td><td style="padding: 8px 0;">${escapeHtml(company || '—')}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #5a5a72;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #5a5a72;">Phone</td><td style="padding: 8px 0;">${escapeHtml(phone || '—')}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #5a5a72;">Need</td><td style="padding: 8px 0;"><strong>${escapeHtml(needLabel)}</strong></td></tr>
        </table>
        ${message ? `<div style="background: #f7f9fc; border-left: 4px solid #0f4c81; padding: 12px 16px; margin: 16px 0;"><div style="font-weight: 600; margin-bottom: 6px; color: #5a5a72;">Message</div><div style="white-space: pre-wrap;">${escapeHtml(message)}</div></div>` : ''}
        <p style="font-size: 13px; color: #888; margin-top: 24px;">Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT<br>Source: fiberfirstsolutions.com</p>
      </div>
    `;

    const textBody = `New Lead from Fiber First Solutions Website\n===========================================\n\nName:     ${name}\nCompany:  ${company || '—'}\nEmail:    ${email}\nPhone:    ${phone || '—'}\nNeed:     ${needLabel}\n\n${message ? `Message:\n${message}\n` : ''}\nSubmitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT\nSource: fiberfirstsolutions.com`.trim();

    await transporter.sendMail({
      from: `"Fiber First Website" <${SMTP_USER}>`,
      to: toAddress,
      replyTo: email,
      subject: `New Lead: ${needLabel} — ${name}${company ? ` (${company})` : ''}`,
      text: textBody,
      html: htmlBody,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Lead email error:', err);
    return res.status(500).json({ 
      error: 'Failed to send email. Please try again or contact jason@fiberfirstsolutions.com directly.' 
    });
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}
