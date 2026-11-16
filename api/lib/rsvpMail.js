// api/lib/rsvpMail.js
// Bestätigungsmail an den Gast nach einer gespeicherten RSVP-Antwort.
// Wird nur vom Server nach erfolgreichem Speichern ausgelöst – nie direkt
// über eine öffentliche Schnittstelle. So kann niemand Mails an fremde
// Adressen auslösen, und je gespeicherter Antwort geht höchstens eine Mail raus.

const { childAgesOf } = require('./rsvpRules');

const SENDER_EMAIL = process.env.NOTIFICATION_SENDER_EMAIL || 'wedding@sarahiver.de';

const TEXTS = {
  en: {
    subjectYes: 'Your RSVP for the wedding of {couple}', subjectNo: 'Your reply for the wedding of {couple}',
    hello: 'Hello {name},', yes: 'thank you for your RSVP. We are delighted that you will celebrate with us.',
    no: 'thank you for letting us know. We are sorry you cannot join us.',
    summary: 'Your registration', persons: 'Guests', children: 'Children (age)', date: 'Date', place: 'Place',
    change: 'If anything changes, simply reply to this email.', bye: 'Warm regards', noAge: 'age not given',
  },
  de: {
    subjectYes: 'Eure Zusage zur Hochzeit von {couple}', subjectNo: 'Eure Rückmeldung zur Hochzeit von {couple}',
    hello: 'Hallo {name},', yes: 'vielen Dank für eure Zusage. Wir freuen uns sehr, dass ihr mit uns feiert.',
    no: 'vielen Dank für eure Rückmeldung. Schade, dass ihr nicht dabei sein könnt.',
    summary: 'Eure Anmeldung', persons: 'Personen', children: 'Kinder (Alter)', date: 'Datum', place: 'Ort',
    change: 'Falls sich etwas ändert, antwortet einfach auf diese E-Mail.', bye: 'Herzliche Grüße', noAge: 'ohne Altersangabe',
  },
  fr: {
    subjectYes: 'Votre réponse pour le mariage de {couple}', subjectNo: 'Votre réponse pour le mariage de {couple}',
    hello: 'Bonjour {name},', yes: 'merci pour votre réponse. Nous sommes ravis de vous compter parmi nous.',
    no: 'merci de nous avoir prévenus. Nous regrettons que vous ne puissiez pas venir.',
    summary: 'Votre inscription', persons: 'Personnes', children: 'Enfants (âge)', date: 'Date', place: 'Lieu',
    change: 'En cas de changement, répondez simplement à cet e-mail.', bye: 'Bien à vous', noAge: 'âge non indiqué',
  },
  tr: {
    subjectYes: '{couple} düğünü için katılım yanıtınız', subjectNo: '{couple} düğünü için yanıtınız',
    hello: 'Merhaba {name},', yes: 'katılım yanıtınız için teşekkür ederiz. Bizimle kutlayacağınız için çok mutluyuz.',
    no: 'bize haber verdiğiniz için teşekkür ederiz. Aramızda olamayacağınız için üzgünüz.',
    summary: 'Kaydınız', persons: 'Kişi sayısı', children: 'Çocuklar (yaş)', date: 'Tarih', place: 'Yer',
    change: 'Bir değişiklik olursa bu e-postayı yanıtlamanız yeterli.', bye: 'Sevgiyle', noAge: 'yaş belirtilmedi',
  },
};
const LOCALES = { en: 'en-GB', de: 'de-DE', fr: 'fr-FR', tr: 'tr-TR' };

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));

function formatDate(iso, lang) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return '';
  // Mittag UTC: der Kalendertag bleibt in jeder Zeitzone derselbe
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12));
  return new Intl.DateTimeFormat(LOCALES[lang] || LOCALES.en, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

/** Baut Betreff und HTML. Unbekannte Sprache → Englisch. */
function buildConfirmation({ rsvp, project, language }) {
  const lang = TEXTS[language] ? language : 'en';
  const t = TEXTS[lang];
  const couple = project.couple_names || [project.partner1_name, project.partner2_name].filter(Boolean).join(' & ') || '';
  const vars = { couple, name: rsvp.name };
  const rows = [];
  if (rsvp.attending) {
    rows.push([t.persons, String(rsvp.persons)]);
    const ages = childAgesOf(rsvp.guests);
    if (ages.length) rows.push([t.children, ages.map((a) => (a === null ? t.noAge : String(a))).join(', ')]);
  }
  const date = formatDate(project.wedding_date, lang);
  if (date) rows.push([t.date, date]);
  if (project.location) rows.push([t.place, project.location]);
  const table = rows.map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#6b7080">${esc(k)}</td><td style="padding:6px 0;color:#2c3040">${esc(v)}</td></tr>`).join('');
  const html = `<!doctype html><html lang="${lang}"><body style="margin:0;background:#f0eded;font-family:Helvetica,Arial,sans-serif;color:#2c3040">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="font-size:16px;line-height:1.6;margin:0 0 12px">${esc(fill(t.hello, vars))}</p>
<p style="font-size:16px;line-height:1.6;margin:0 0 24px">${esc(rsvp.attending ? t.yes : t.no)}</p>
<p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6b7080;margin:0 0 6px">${esc(t.summary)}</p>
<table style="border-collapse:collapse;font-size:15px;margin:0 0 24px">${table}</table>
<p style="font-size:15px;line-height:1.6;margin:0 0 24px">${esc(t.change)}</p>
<p style="font-size:15px;line-height:1.6;margin:0">${esc(t.bye)}<br>${esc(couple)}</p>
</div></body></html>`;
  return { lang, subject: fill(rsvp.attending ? t.subjectYes : t.subjectNo, vars), html };
}

/**
 * Versendet die Bestätigung. Wirft nie: Ein Mailfehler darf die gespeicherte
 * Antwort nicht gefährden. Rückgabe: 'sent' | 'failed' | 'skipped'.
 */
async function sendConfirmation({ rsvp, project, language }) {
  const key = process.env.BREVO_API_KEY;
  if (!key || !rsvp || !rsvp.email) return 'skipped';
  try {
    const mail = buildConfirmation({ rsvp, project, language });
    const replyTo = project.admin_email || project.client_email || null;
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': key },
      body: JSON.stringify({
        sender: { email: SENDER_EMAIL, name: project.couple_names || 'S&I.' },
        to: [{ email: rsvp.email, name: rsvp.name }],
        ...(replyTo ? { replyTo: { email: replyTo } } : {}),
        subject: mail.subject,
        htmlContent: mail.html,
        tags: ['rsvp-confirmation', `lang-${mail.lang}`],
      }),
    });
    if (!res.ok) { console.error('[rsvp-mail] Brevo', res.status); return 'failed'; }
    return 'sent';
  } catch (err) {
    console.error('[rsvp-mail] Fehler:', err && err.message);
    return 'failed';
  }
}

module.exports = { buildConfirmation, sendConfirmation, formatDate, TEXTS };
