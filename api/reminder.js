// api/reminder.js
// Vercel Serverless Function — RSVP-Erinnerungs-E-Mails im Theme-Design
// Sendet an alle Gäste die noch nicht geantwortet haben

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SENDER_EMAIL = process.env.NOTIFICATION_SENDER_EMAIL || 'wedding@sarahiver.de';

// CORS
const ALLOWED_ORIGINS = [
  'https://siwedding.de', 'https://www.siwedding.de',
  'http://localhost:3000', 'http://localhost:3001',
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.vercel.app')) return true;
  if (origin.endsWith('.siwedding.de')) return true;
  return false;
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
// THEME EMAIL TEMPLATES
// ============================================

const THEME_STYLES = {
  editorial: {
    bg: '#FAFAFA', cardBg: '#FFFFFF', text: '#0A0A0A', textSecondary: '#666666',
    accent: '#C41E3A', headlineFont: "'Oswald', 'Arial Narrow', sans-serif",
    bodyFont: "'Inter', -apple-system, sans-serif", headingTransform: 'uppercase',
    btnBg: '#C41E3A', btnColor: '#FFFFFF', border: '#E5E5E5',
  },
  botanical: {
    bg: '#040604', cardBg: '#0d1a0d', text: '#FFFFFF', textSecondary: 'rgba(255,255,255,0.6)',
    accent: '#4a7a52', headlineFont: "'Cormorant Garamond', Georgia, serif",
    bodyFont: "'Montserrat', sans-serif", headingTransform: 'none',
    btnBg: '#4a7a52', btnColor: '#FFFFFF', border: 'rgba(255,255,255,0.15)',
  },
  contemporary: {
    bg: '#FAFAFA', cardBg: '#FFFFFF', text: '#0D0D0D', textSecondary: '#737373',
    accent: '#FF6B6B', headlineFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Space Grotesk', sans-serif", headingTransform: 'uppercase',
    btnBg: '#FF6B6B', btnColor: '#0D0D0D', border: '#0D0D0D',
    shadow: '6px 6px 0 #0D0D0D', borderWidth: '3px',
  },
  luxe: {
    bg: '#0A0A0A', cardBg: '#1A1A1D', text: '#F8F6F3', textSecondary: 'rgba(248,246,243,0.5)',
    accent: '#C9A962', headlineFont: "'Cormorant', 'Didot', Georgia, serif",
    bodyFont: "'Outfit', 'Montserrat', sans-serif", headingTransform: 'none', headingStyle: 'italic',
    btnBg: 'transparent', btnColor: '#C9A962', border: 'rgba(201,169,98,0.25)', btnBorder: '#C9A962',
  },
  neon: {
    bg: '#0a0a0f', cardBg: '#12121a', text: '#FFFFFF', textSecondary: 'rgba(255,255,255,0.6)',
    accent: '#00ffff', headlineFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Space Grotesk', sans-serif", headingTransform: 'uppercase',
    btnBg: 'transparent', btnColor: '#00ffff', border: 'rgba(0,255,255,0.3)',
    btnBorder: '#00ffff', glowShadow: '0 0 10px rgba(0,255,255,0.3)',
  },
  video: {
    bg: '#0A0A0A', cardBg: '#252525', text: '#FFFFFF', textSecondary: '#B0B0B0',
    accent: '#6B8CAE', headlineFont: "'Manrope', sans-serif",
    bodyFont: "'Inter', sans-serif", headingTransform: 'uppercase',
    btnBg: 'transparent', btnColor: '#6B8CAE', border: 'rgba(107,140,174,0.3)', btnBorder: '#6B8CAE',
  },
};

function buildReminderEmail({ guestName, coupleNames, weddingDate, websiteUrl, theme }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.editorial;

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const btnStyle = s.btnBorder
    ? `background:${s.btnBg};color:${s.btnColor};border:${s.borderWidth || '1px'} solid ${s.btnBorder};${s.glowShadow ? `box-shadow:${s.glowShadow};` : ''}`
    : `background:${s.btnBg};color:${s.btnColor};border:none;${s.shadow ? `box-shadow:${s.shadow};` : ''}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!--[if mso]><style>body{font-family:Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${s.bg};font-family:${s.bodyFont};">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Logo -->
    <div style="margin-bottom:32px;">
      <div style="background:#000;color:#fff;display:inline-block;padding:8px 16px;font-weight:700;font-size:18px;letter-spacing:-0.06em;font-family:'Roboto',Arial,sans-serif;">S&amp;I.</div>
    </div>

    <!-- Headline -->
    <h1 style="font-family:${s.headlineFont};font-size:28px;font-weight:${s.headingStyle ? '300' : '700'};${s.headingStyle ? `font-style:${s.headingStyle};` : ''}color:${s.text};text-transform:${s.headingTransform};margin:0 0 16px 0;line-height:1.2;">
      ${theme === 'neon' ? '// ' : ''}Erinnerung: Bitte gebt Rückmeldung
    </h1>

    <!-- Body -->
    <p style="font-size:15px;color:${s.textSecondary};line-height:1.7;margin:0 0 8px 0;">
      Liebe/r ${esc(guestName)},
    </p>
    <p style="font-size:15px;color:${s.textSecondary};line-height:1.7;margin:0 0 24px 0;">
      wir freuen uns riesig auf unsere Hochzeit${formattedDate ? ` am <strong style="color:${s.text}">${formattedDate}</strong>` : ''} und würden euch so gerne dabei haben! Wir haben gesehen, dass ihr noch nicht zugesagt habt – könntet ihr uns eine kurze Rückmeldung geben?
    </p>

    <!-- Card -->
    <div style="background:${s.cardBg};border:${s.borderWidth || '1px'} solid ${s.border};padding:24px;margin-bottom:28px;${s.shadow ? `box-shadow:${s.shadow};` : ''}">
      <p style="font-size:13px;color:${s.textSecondary};margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.1em;">Eure Hochzeit</p>
      <p style="font-size:18px;color:${s.text};font-weight:600;margin:0 0 8px 0;font-family:${s.headlineFont};${s.headingStyle ? `font-style:${s.headingStyle};` : ''}">${esc(coupleNames)}</p>
      ${formattedDate ? `<p style="font-size:14px;color:${s.accent};margin:0;">${formattedDate}</p>` : ''}
    </div>

    <!-- CTA Button -->
    <a href="${esc(websiteUrl)}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.05em;${btnStyle}">
      JETZT ZUSAGEN →
    </a>

    <!-- Footer -->
    <p style="font-size:11px;color:${s.textSecondary};margin-top:48px;opacity:0.5;">
      Diese E-Mail wurde von der Hochzeitswebsite von ${esc(coupleNames)} verschickt.
      Falls ihr diese Mail irrtümlich erhalten habt, könnt ihr sie ignorieren.
    </p>
  </div>
</body>
</html>`;
}

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ============================================
// THANK YOU EMAIL TEMPLATE
// ============================================

function buildThankYouEmail({ guestName, coupleNames, weddingDate, websiteUrl, theme }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.editorial;

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const btnStyle = s.btnBorder
    ? `background:${s.btnBg};color:${s.btnColor};border:${s.borderWidth || '1px'} solid ${s.btnBorder};${s.glowShadow ? `box-shadow:${s.glowShadow};` : ''}`
    : `background:${s.btnBg};color:${s.btnColor};border:none;${s.shadow ? `box-shadow:${s.shadow};` : ''}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!--[if mso]><style>body{font-family:Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${s.bg};font-family:${s.bodyFont};">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Logo -->
    <div style="margin-bottom:32px;">
      <div style="background:#000;color:#fff;display:inline-block;padding:8px 16px;font-weight:700;font-size:18px;letter-spacing:-0.06em;font-family:'Roboto',Arial,sans-serif;">S&amp;I.</div>
    </div>

    <!-- Headline -->
    <h1 style="font-family:${s.headlineFont};font-size:28px;font-weight:${s.headingStyle ? '300' : '700'};${s.headingStyle ? `font-style:${s.headingStyle};` : ''}color:${s.text};text-transform:${s.headingTransform};margin:0 0 16px 0;line-height:1.2;">
      ${theme === 'neon' ? '// ' : ''}Danke, von ganzem Herzen
    </h1>

    <!-- Body -->
    <p style="font-size:15px;color:${s.textSecondary};line-height:1.7;margin:0 0 8px 0;">
      Liebe/r ${esc(guestName)},
    </p>
    <p style="font-size:15px;color:${s.textSecondary};line-height:1.7;margin:0 0 16px 0;">
      wir sitzen hier, blättern durch die Erinnerungen – und müssen einfach lächeln. Unser Hochzeitstag${formattedDate ? ` am <strong style="color:${s.text}">${formattedDate}</strong>` : ''} war der schönste Tag unseres Lebens. Und das wäre er ohne euch nicht gewesen.
    </p>
    <p style="font-size:15px;color:${s.textSecondary};line-height:1.7;margin:0 0 16px 0;">
      Danke, dass ihr dabei wart. Danke für eure Umarmungen, euer Lachen, eure Tränen, eure Tanzeinlagen und die Momente, die wir nie vergessen werden. Ihr habt diesen Tag zu dem gemacht, was er war: <strong style="color:${s.text}">pures Glück.</strong>
    </p>
    <p style="font-size:15px;color:${s.textSecondary};line-height:1.7;margin:0 0 28px 0;">
      Wir tragen diesen Tag für immer in unserem Herzen – und euch gleich mit. 💛
    </p>

    <!-- Card -->
    <div style="background:${s.cardBg};border:${s.borderWidth || '1px'} solid ${s.border};padding:24px;margin-bottom:28px;${s.shadow ? `box-shadow:${s.shadow};` : ''}">
      <p style="font-size:14px;color:${s.textSecondary};margin:0 0 8px 0;line-height:1.6;">
        Schaut gerne nochmal auf unserer Website vorbei – dort findet ihr Fotos, Gästebucheinträge und alle Erinnerungen an unseren Tag.
      </p>
    </div>

    <!-- CTA Button -->
    <a href="${esc(websiteUrl)}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.05em;${btnStyle}">
      ZUR WEBSITE →
    </a>

    <!-- Signature -->
    <p style="font-size:15px;color:${s.text};margin-top:32px;line-height:1.7;">
      In Liebe,<br /><strong>${esc(coupleNames)}</strong>
    </p>

    <!-- Footer -->
    <p style="font-size:11px;color:${s.textSecondary};margin-top:48px;opacity:0.5;">
      Diese E-Mail wurde von der Hochzeitswebsite von ${esc(coupleNames)} verschickt.
    </p>
  </div>
</body>
</html>`;
}

// ============================================
// PHOTO REMINDER EMAIL TEMPLATE
// ============================================

function buildPhotoReminderEmail({ guestName, coupleNames, weddingDate, websiteUrl, theme }) {
  const s = THEME_STYLES[theme] || THEME_STYLES.editorial;

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const btnStyle = s.btnBorder
    ? `background:${s.btnBg};color:${s.btnColor};border:${s.borderWidth || '1px'} solid ${s.btnBorder};${s.glowShadow ? `box-shadow:${s.glowShadow};` : ''}`
    : `background:${s.btnBg};color:${s.btnColor};border:none;${s.shadow ? `box-shadow:${s.shadow};` : ''}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!--[if mso]><style>body{font-family:Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${s.bg};font-family:${s.bodyFont};">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Logo -->
    <div style="margin-bottom:32px;">
      <div style="background:#000;color:#fff;display:inline-block;padding:8px 16px;font-weight:700;font-size:18px;letter-spacing:-0.06em;font-family:'Roboto',Arial,sans-serif;">S&amp;I.</div>
    </div>

    <!-- Headline -->
    <h1 style="font-family:${s.headlineFont};font-size:28px;font-weight:${s.headingStyle ? '300' : '700'};${s.headingStyle ? `font-style:${s.headingStyle};` : ''}color:${s.text};text-transform:${s.headingTransform};margin:0 0 16px 0;line-height:1.2;">
      ${theme === 'neon' ? '// ' : ''}Habt ihr noch Fotos? 📸
    </h1>

    <!-- Body -->
    <p style="font-size:15px;color:${s.textSecondary};line-height:1.7;margin:0 0 8px 0;">
      Liebe/r ${esc(guestName)},
    </p>
    <p style="font-size:15px;color:${s.textSecondary};line-height:1.7;margin:0 0 16px 0;">
      wisst ihr, was das Schönste an unserer Hochzeit ist? Dass jeder von euch den Tag aus seiner ganz eigenen Perspektive erlebt hat. Und bestimmt habt ihr dabei Momente eingefangen, die wir selbst gar nicht mitbekommen haben – weil wir gerade getanzt, gelacht oder vor Glück geweint haben.
    </p>
    <p style="font-size:15px;color:${s.textSecondary};line-height:1.7;margin:0 0 16px 0;">
      <strong style="color:${s.text}">Wir würden diese Bilder so gerne sehen!</strong> Ob verwackeltes Selfie, heimlicher Schnappschuss oder das perfekte Foto vom Sonnenuntergang – für uns ist jedes einzelne Bild ein kleiner Schatz.
    </p>
    <p style="font-size:15px;color:${s.textSecondary};line-height:1.7;margin:0 0 28px 0;">
      Ladet eure Fotos einfach direkt auf unserer Website hoch – das dauert nur einen Moment und die Bilder landen alle an einem Ort. In voller Qualität, ohne Ablaufdatum, für immer. 💛
    </p>

    <!-- Card -->
    <div style="background:${s.cardBg};border:${s.borderWidth || '1px'} solid ${s.border};padding:24px;margin-bottom:28px;${s.shadow ? `box-shadow:${s.shadow};` : ''}">
      <p style="font-size:13px;color:${s.textSecondary};margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.1em;">So einfach geht's</p>
      <p style="font-size:14px;color:${s.text};margin:0;line-height:1.8;">
        1. Website öffnen<br />
        2. Zum Bereich „Fotos hochladen" scrollen<br />
        3. Bilder auswählen – fertig! 📷
      </p>
    </div>

    <!-- CTA Button -->
    <a href="${esc(websiteUrl)}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.05em;${btnStyle}">
      FOTOS HOCHLADEN →
    </a>

    <!-- Signature -->
    <p style="font-size:15px;color:${s.text};margin-top:32px;line-height:1.7;">
      Danke, ihr Lieben!<br /><strong>${esc(coupleNames)}</strong>
    </p>

    <!-- Footer -->
    <p style="font-size:11px;color:${s.textSecondary};margin-top:48px;opacity:0.5;">
      Diese E-Mail wurde von der Hochzeitswebsite von ${esc(coupleNames)} verschickt.
    </p>
  </div>
</body>
</html>`;
}

// ============================================
// FETCH PROJECT DATA
// ============================================
async function getProject(projectId) {
  const url = `${SUPABASE_URL}/rest/v1/projects?id=eq.${projectId}&select=couple_names,wedding_date,theme,slug,custom_domain`;
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data[0] || null;
}

// ============================================
// SEND VIA BREVO
// ============================================
async function sendEmail(toEmail, toName, subject, htmlContent, senderName) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      to: [{ email: toEmail, name: toName }],
      sender: { email: SENDER_EMAIL, name: senderName || 'S&I. Hochzeitswebsite' },
      subject,
      htmlContent,
    }),
  });
  return response.ok;
}

// ============================================
// UPDATE REMINDER TIMESTAMPS
// ============================================
async function markGuestsReminded(guestIds) {
  const now = new Date().toISOString();
  // Batch update via Supabase REST
  for (const id of guestIds) {
    await fetch(`${SUPABASE_URL}/rest/v1/guest_list?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ reminder_sent_at: now }),
    });
  }
}

// ============================================
// HANDLER
// ============================================
export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const corsHeaders = getCorsHeaders(origin);
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { projectId, guests, type } = req.body;
    const emailType = type || 'rsvp_reminder'; // default: original behavior

    if (!projectId || !guests || !Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ error: 'projectId and guests[] required' });
    }

    if (!BREVO_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('[reminder] Missing env vars');
      return res.status(500).json({ error: 'Server not configured' });
    }

    // Rate limit: max 100 emails per request
    if (guests.length > 100) {
      return res.status(400).json({ error: 'Max 100 reminders per request' });
    }

    // Get project data
    const project = await getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const coupleNames = project.couple_names || 'Brautpaar';
    const theme = project.theme || 'editorial';
    const websiteUrl = project.custom_domain
      ? `https://${project.custom_domain}`
      : `https://siwedding.de/${project.slug}`;

    console.log(`[reminder] Sending ${guests.length} ${emailType} emails for ${coupleNames} (${theme})`);

    // Subject + template based on type
    const getEmailConfig = (guest) => {
      const baseData = {
        guestName: guest.name,
        coupleNames,
        weddingDate: project.wedding_date,
        websiteUrl,
        theme,
      };

      switch (emailType) {
        case 'thank_you':
          return {
            subject: `💛 ${coupleNames} – Danke, von ganzem Herzen`,
            html: buildThankYouEmail(baseData),
          };
        case 'photo_reminder':
          return {
            subject: `📸 ${coupleNames} – Habt ihr noch Fotos von unserem Tag?`,
            html: buildPhotoReminderEmail(baseData),
          };
        default: // rsvp_reminder
          return {
            subject: `💌 ${coupleNames} – Bitte gebt eure Rückmeldung`,
            html: buildReminderEmail(baseData),
          };
      }
    };

    // Send emails
    let sent = 0;
    const sentIds = [];

    for (const guest of guests) {
      try {
        const { subject, html } = getEmailConfig(guest);

        const success = await sendEmail(
          guest.email,
          guest.name,
          subject,
          html,
          coupleNames,
        );

        if (success) {
          sent++;
          sentIds.push(guest.id);
        }
      } catch (e) {
        console.error(`[reminder] Failed for ${guest.email}:`, e.message);
      }
    }

    // Mark as reminded in DB
    if (sentIds.length > 0) {
      await markGuestsReminded(sentIds);
    }

    console.log(`[reminder] Done: ${sent}/${guests.length} sent`);
    return res.status(200).json({ success: true, sent, total: guests.length });

  } catch (error) {
    console.error('[reminder] Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
