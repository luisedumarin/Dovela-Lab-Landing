const sendgrid = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const TO_EMAIL = process.env.TO_EMAIL || 'contacto@dovelalab.com.mx';
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@dovelalab.com.mx';

if (SENDGRID_API_KEY) {
  sendgrid.setApiKey(SENDGRID_API_KEY);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!SENDGRID_API_KEY) {
      return res.status(500).json({ error: 'No API key configured' });
    }

    const { nombre, email, telefono, interes, apellido, curso, mensaje } = req.body || {};

    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            body{font-family:Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#111}
            .container{max-width:700px;margin:0 auto;padding:18px}
            .header{background:#8e4b31;color:#fff;padding:14px;border-radius:8px;text-align:center}
            .card{background:#fff;padding:16px;border-radius:8px;margin-top:12px}
            dt{font-weight:700;margin-top:8px}
            dd{margin:0 0 8px 0}
            .meta{font-size:12px;color:#666;margin-top:12px}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h2>Nueva solicitud — Dovela Lab</h2></div>
            <div class="card">
              <p>Se ha recibido una nueva solicitud desde el sitio:</p>
              <dl>
                <dt>Nombre</dt><dd>${escapeHtml(nombre || '')} ${escapeHtml(apellido || '')}</dd>
                <dt>Correo</dt><dd>${escapeHtml(email || '')}</dd>
                <dt>Tel / WhatsApp</dt><dd>${escapeHtml(telefono || '')}</dd>
                <dt>Interés / Curso</dt><dd>${escapeHtml(interes || curso || '')}</dd>
                <dt>Mensaje</dt><dd>${escapeHtml(mensaje || '')}</dd>
              </dl>
              <p class="meta">Enviado desde: ${escapeHtml(req.headers.referer || 'sitio')}</p>
              <p class="meta">Fecha: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>`;

    await sendgrid.send({
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: 'Nueva solicitud desde el sitio Dovela',
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('send error', error);
    return res.status(500).json({ error: error.message || 'Error sending' });
  }
};