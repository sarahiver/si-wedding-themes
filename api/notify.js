// api/notify.js
// Vercel Serverless Function — Gäste-Aktivitäts-Benachrichtigungen
// Sendet E-Mails an das Brautpaar wenn Gäste RSVP, Gästebuch, Musikwünsche,
// Geschenk-Reservierungen oder Fotos einreichen.
// Alle Secrets serverseitig: Brevo API-Key, Supabase Service Key

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SENDER_EMAIL = process.env.NOTIFICATION_SENDER_EMAIL || 'wedding@sarahiver.de';

// Allowed origins — wedding theme sites
const ALLOWED_ORIGINS = [
  'https://siwedding.de',
  'https://www.siwedding.de',
  'http://localhost:3000',
  'http://localhost:3001',
];

// Also allow any *.vercel.app and custom domains
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.vercel.app')) return true;
  // Allow any origin for now since wedding sites have custom domains
  return true;
}

function getCorsHeaders(origin) {
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// ============================================
// SUPABASE: Fetch project data to get customer_email
// ============================================
async function getProjectEmail(projectId) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/projects?id=eq.${projectId}&select=customer_email,couple_names,slug,internal_name`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!response.ok) return null;
  const data = await response.json();
  return data[0] || null;
}

// ============================================
// RATE LIMITING (simple in-memory)
// ============================================
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
const RATE_LIMIT_MAX = 10; // 10 per minute per project

function isRateLimited(key) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(key, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ============================================
// EMAIL TEMPLATES
// ============================================
const esc = (s) => String(s || '–').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildEmailHtml({ type, guestName, details, projectName, adminUrl }) {
  const icons = {
    rsvp: '💌',
    guestbook: '📖',
    music_wish: '🎵',
    gift_reserved: '🎁',
    photo_upload: '📸',
  };

  const titles = {
    rsvp: 'Neue RSVP-Antwort',
    guestbook: 'Neuer Gästebuch-Eintrag',
    music_wish: 'Neuer Musikwunsch',
    gift_reserved: 'Geschenk reserviert',
    photo_upload: 'Neues Foto hochgeladen',
  };

  const icon = icons[type] || '🔔';
  const title = titles[type] || 'Neue Aktivität';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
      <div style="background: #000; color: #fff; display: inline-block; padding: 8px 16px; font-weight: 700; font-size: 18px; letter-spacing: -0.06em; margin-bottom: 30px;">S&amp;I.</div>
      
      <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 8px; color: #1a1a1a;">
        ${icon} ${esc(title)}
      </h1>
      <p style="color: #888; font-size: 13px; margin: 0 0 24px 0;">${esc(projectName)}</p>
      
      <div style="background: #f8f8f8; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; width: 100px; font-size: 13px;">Gast</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-weight: 500; font-size: 14px;">${esc(guestName)}</td>
          </tr>
          ${details.map(d => `
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">${esc(d.label)}</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${esc(d.value)}</td>
          </tr>
          `).join('')}
        </table>
      </div>
      
      ${adminUrl ? `<a href="${esc(adminUrl)}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: 600; font-size: 13px; letter-spacing: 0.5px; border-radius: 6px;">IM ADMIN ANSEHEN →</a>` : ''}
      
      <p style="color: #ccc; font-size: 11px; margin-top: 40px;">Automatische Benachrichtigung von eurer Hochzeitswebsite</p>
    </div>
  `;
}

function buildSubjectAndDetails(type, body) {
  switch (type) {
    case 'rsvp': {
      const attending = body.attending ? '✅ Zusage' : '❌ Absage';
      const persons = body.persons || 1;
      return {
        subject: `RSVP: ${body.guestName} — ${attending}`,
        guestName: body.guestName,
        details: [
          { label: 'Status', value: attending },
          { label: 'Personen', value: String(persons) },
          ...(body.dietary ? [{ label: 'Ernährung', value: body.dietary }] : []),
          ...(body.message ? [{ label: 'Nachricht', value: body.message }] : []),
        ],
      };
    }

    case 'guestbook': {
      return {
        subject: `Gästebuch: Neuer Eintrag von ${body.guestName}`,
        guestName: body.guestName,
        details: [
          { label: 'Nachricht', value: body.message || '(Bild)' },
        ],
      };
    }

    case 'music_wish': {
      return {
        subject: `Musikwunsch: ${body.artist} – ${body.songTitle}`,
        guestName: body.guestName,
        details: [
          { label: 'Künstler', value: body.artist },
          { label: 'Song', value: body.songTitle },
        ],
      };
    }

    case 'gift_reserved': {
      return {
        subject: `Geschenk reserviert: ${body.giftName}`,
        guestName: body.guestName,
        details: [
          { label: 'Geschenk', value: body.giftName },
        ],
      };
    }

    case 'photo_upload': {
      return {
        subject: `Neues Foto von ${body.guestName}`,
        guestName: body.guestName,
        details: [
          { label: 'Foto', value: 'Im Admin-Bereich ansehen' },
        ],
      };
    }

    default:
      return {
        subject: `Neue Aktivität auf eurer Hochzeitswebsite`,
        guestName: body.guestName || 'Gast',
        details: [],
      };
  }
}

// ============================================
// SEND VIA BREVO
// ============================================
async function sendEmail(toEmail, toName, subject, htmlContent) {
  if (!BREVO_API_KEY) {
    console.warn('Brevo API key not configured');
    return false;
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      to: [{ email: toEmail, name: toName || 'Brautpaar' }],
      sender: { email: SENDER_EMAIL, name: 'S&I. Hochzeitswebsite' },
      subject: subject,
      htmlContent: htmlContent,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Brevo error:', err);
    return false;
  }

  return true;
}

// ============================================
// HANDLER
// ============================================
export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId, type, ...body } = req.body;

    if (!projectId || !type) {
      return res.status(400).json({ error: 'projectId and type required' });
    }

    // Rate limit per project
    if (isRateLimited(projectId)) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    // Valid types
    const validTypes = ['rsvp', 'guestbook', 'music_wish', 'gift_reserved', 'photo_upload'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid notification type' });
    }

    // 1. Get project data (customer_email)
    const project = await getProjectEmail(projectId);
    if (!project || !project.customer_email) {
      // No email configured — silently succeed (don't break guest actions)
      return res.status(200).json({ success: true, sent: false, reason: 'no_email' });
    }

    // 2. Build email
    const { subject, guestName, details } = buildSubjectAndDetails(type, body);
    const projectName = project.couple_names || project.internal_name || project.slug;
    
    // Build admin URL — try slug-based admin URL
    const adminUrl = `https://${project.slug}.siwedding.de/admin`;

    const html = buildEmailHtml({
      type,
      guestName,
      details,
      projectName,
      adminUrl,
    });

    // 3. Send
    const sent = await sendEmail(
      project.customer_email,
      projectName,
      `[${projectName}] ${subject}`,
      html
    );

    return res.status(200).json({ success: true, sent });

  } catch (error) {
    console.error('Notify API error:', error);
    // Don't return 500 — guest actions shouldn't fail because of notification errors
    return res.status(200).json({ success: false, error: 'notification_failed' });
  }
}
