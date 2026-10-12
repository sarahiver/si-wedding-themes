// api/db.js
// Vercel Serverless Function — Supabase Proxy
// All frontend DB operations go through this endpoint.
// Token-auth required. Action whitelist — no generic query access.

const { handleCors, requireProjectAdmin, applyRateLimit, getClientIP, createToken, verifyToken } = require('./lib/auth');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ============================================
// SUPABASE HELPERS
// ============================================

const supabaseHeaders = {
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

async function supabaseRest(method, table, query = '', body = null, headers = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query ? '?' + query : ''}`;
  const opts = {
    method,
    headers: { ...supabaseHeaders, ...headers },
  };
  if (body) opts.body = JSON.stringify(body);

  const response = await fetch(url, opts);

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[db] ${method} ${table} failed:`, errText);
    let code = null;
    let message = errText;
    try {
      const parsed = JSON.parse(errText);
      code = parsed.code || null;
      message = parsed.message || errText;
    } catch { /* kein JSON */ }
    return { data: null, error: { message, code, status: response.status } };
  }

  // DELETE with return=minimal returns empty body
  if (method === 'DELETE' && response.headers.get('content-length') === '0') {
    return { data: null, error: null };
  }

  const text = await response.text();
  if (!text) return { data: null, error: null };

  const data = JSON.parse(text);
  return { data, error: null };
}

async function supabaseRPC(functionName, params) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: supabaseHeaders,
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    const errText = await response.text();
    return { data: null, error: { message: errText } };
  }
  const data = await response.json();
  return { data, error: null };
}

// ============================================
// SENSITIVE FIELD STRIPPING
// ============================================

function stripSensitiveFields(data) {
  // Antworten an das eingeloggte Paar: nur Render- und Preisfelder,
  // keine Passwörter/Hashes, Vertrags- oder Rechnungsdaten
  if (!data) return data;
  if (Array.isArray(data)) return data.map(stripSensitiveFields);
  return pickFields(data, [...PUBLIC_PROJECT_FIELDS, ...ADMIN_PROJECT_FIELDS]);
}

// ============================================
// ÖFFENTLICHE PROJEKTFELDER
// Vorher lieferte getProjectBySlugOrDomain die komplette Zeile an jeden
// Besucher — inkl. Kundenadresse, Telefon, E-Mail, Vertrags- und
// Rechnungsdaten, Notizen und password_hash. Jetzt: Whitelist.
// ============================================

// Was jede Seite zum Rendern braucht
const PUBLIC_PROJECT_FIELDS = [
  'id', 'slug', 'theme', 'status', 'couple_names', 'partner1_name', 'partner2_name',
  'wedding_date', 'location', 'hashtag', 'component_order', 'active_components',
  'component_config', 'custom_styles', 'custom_domain', 'favicon_emoji',
  'has_std', 'has_archive', 'package', 'addons', 'password_protected',
];

// Gesperrte Seite (Passwort / Coming Soon): nur, was Gate und Coming Soon zeigen
const LOCKED_PROJECT_FIELDS = [
  'id', 'slug', 'theme', 'status', 'couple_names', 'partner1_name', 'partner2_name',
  'wedding_date', 'custom_styles', 'custom_domain', 'favicon_emoji', 'password_protected',
];

// Zusätzlich nur für das eingeloggte Paar (Preisberechnung im Dashboard)
const ADMIN_PROJECT_FIELDS = ['discount', 'custom_price', 'custom_extras'];

function pickFields(row, fields) {
  if (!row) return row;
  const out = {};
  for (const f of fields) if (f in row) out[f] = row[f];
  return out;
}

// ============================================
// ZUGANGSPRÜFUNG FÜR ÖFFENTLICHE ACTIONS
// Passwortschutz und Coming Soon wurden bisher nur im Browser durchgesetzt.
// Inhalte, Gästebuch, Fotos usw. waren über die API für jeden abrufbar,
// der den Slug kannte. Jetzt entscheidet der Server.
// ============================================

const PUBLIC_STATUSES = ['live', 'std', 'archive', 'archiv', 'save-the-date', 'demo'];

// Alle mitgeschickten Tokens (Authorization + X-Access-Tokens) prüfen
function collectTokens(req) {
  const raw = [];
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) raw.push(authHeader.slice(7));
  const extra = req.headers['x-access-tokens'] || '';
  extra.split(',').map(t => t.trim()).filter(Boolean).forEach(t => raw.push(t));
  return raw.slice(0, 4).map(verifyToken).filter(Boolean);
}

function accessLevel(tokens, slug) {
  const kinds = tokens
    .filter(t => t.slug === slug)
    .map(t => String(t.email || '').split('@')[0]);
  if (kinds.includes('admin')) return 'admin';
  if (kinds.includes('preview')) return 'preview';
  if (kinds.includes('guest')) return 'guest';
  return null;
}

// Kurzer Cache pro warmer Instanz: Status und Passwortpflicht ändern sich selten
const gateCache = new Map();
const GATE_TTL = 30 * 1000;

async function loadGate({ projectId, slug }) {
  const key = projectId ? `id:${projectId}` : `slug:${slug}`;
  const hit = gateCache.get(key);
  if (hit && Date.now() - hit.ts < GATE_TTL) return hit.gate;

  const query = projectId
    ? `id=eq.${enc(projectId)}&select=id,slug,status`
    : `slug=eq.${enc(slug)}&select=id,slug,status`;
  const result = await supabaseRest('GET', 'projects', query);
  const row = result.data?.[0];
  if (!row) return null;

  // Dieselbe Funktion wie das Frontend — keine zweite Wahrheit
  const rpc = await supabaseRPC('check_password_required', { project_slug: row.slug });
  // Im Zweifel geschützt: Fehler beim Prüfen darf nicht zum Öffnen führen
  const passwordRequired = rpc.error ? true : !!rpc.data?.required;

  const gate = { id: row.id, slug: row.slug, status: row.status, passwordRequired };
  gateCache.set(key, { gate, ts: Date.now() });
  return gate;
}

function evaluateAccess(gate, tokens) {
  const level = accessLevel(tokens, gate.slug);
  if (level === 'admin' || level === 'preview') return { locked: false, level };
  if (!PUBLIC_STATUSES.includes(gate.status)) return { locked: true, reason: 'preview', level };
  if (gate.passwordRequired && level !== 'guest') return { locked: true, reason: 'password', level };
  return { locked: false, level };
}

// Öffentliche Actions, die Daten eines Projekts lesen oder schreiben.
// getProjectBySlugOrDomain und getProjectContent prüfen selbst.
const GATED_PUBLIC_ACTIONS = new Set([
  'checkDuplicateRSVP', 'submitRSVP', 'submitGuestbookEntry', 'submitMusicWish',
  'submitPhotoUpload', 'reserveGift',
  'getGuestbookEntries', 'getPhotoUploads', 'getMusicWishes', 'getGiftReservations',
]);

// ============================================
// INPUT HELPERS
// ============================================

const enc = (v) => encodeURIComponent(String(v ?? ''));

// Komponenten-Namen sind feste Schlüssel ('hero', 'rsvp', …)
const COMPONENT_RE = /^[a-z][a-z0-9_]{0,40}$/;

// Felder, die das Paar selbst an `projects` ändern darf.
// Alles andere (Passwörter, Status, Paket, Domain, Theme) nur über den SuperAdmin.
const COUPLE_EDITABLE_PROJECT_FIELDS = ['location', 'hashtag'];

// Status, die das Paar selbst setzen darf
const COUPLE_SETTABLE_STATUSES = ['ready_for_review'];

function isMissingConflictTarget(error) {
  if (!error) return false;
  return error.code === '42P10'
    || /no unique or exclusion constraint/i.test(error.message || '');
}

// ============================================
// ACTION HANDLERS
// Geschützte Actions bekommen ctx.projectId — das Projekt aus dem Token.
// Zeilen-IDs werden immer zusätzlich auf dieses Projekt gefiltert.
// ============================================

const actions = {
  // --- PROJECT ---

  async getProjectBySlugOrDomain({ slugOrDomain }, ctx) {
    // select=* und Filterung hier: Eine Spalte in der Whitelist, die es in
    // der DB nicht gibt, würde bei select=a,b,c jede Seite lahmlegen.
    // Die volle Zeile verlässt den Server trotzdem nie.
    let result = await supabaseRest('GET', 'projects', `slug=eq.${enc(slugOrDomain)}&select=*`);
    let data = result.data?.[0] || null;

    // Try by custom_domain
    if (!data) {
      result = await supabaseRest('GET', 'projects', `custom_domain=eq.${enc(slugOrDomain)}&select=*`);
      data = result.data?.[0] || null;
    }

    if (!data) return { data: null, error: result.error || { message: 'Not found' } };

    const gate = await loadGate({ slug: data.slug });
    const access = gate ? evaluateAccess(gate, ctx.tokens || []) : { locked: true, reason: 'preview' };

    let visible;
    if (access.locked) visible = pickFields(data, LOCKED_PROJECT_FIELDS);
    else if (access.level === 'admin') visible = pickFields(data, [...PUBLIC_PROJECT_FIELDS, ...ADMIN_PROJECT_FIELDS]);
    else visible = pickFields(data, PUBLIC_PROJECT_FIELDS);

    return {
      data: visible,
      access: { locked: access.locked, reason: access.reason || null },
      error: null,
    };
  },

  async getProjectContent({ projectId }, ctx) {
    const gate = await loadGate({ projectId });
    if (!gate) return { data: {}, error: null };
    const access = evaluateAccess(gate, ctx.tokens || []);
    if (access.locked) {
      // Gesperrt: keine Inhalte. Das Frontend zeigt Passwortseite/Coming Soon.
      return { data: {}, locked: true, reason: access.reason, error: null };
    }

    const result = await supabaseRest('GET', 'project_content', `project_id=eq.${enc(projectId)}&select=*`);
    if (result.error) return { data: {}, error: result.error };

    const contentByComponent = {};
    (result.data || []).forEach(item => {
      contentByComponent[item.component] = item.content;
    });
    return { data: contentByComponent, error: null };
  },

  async updateProjectStatus({ status }, ctx) {
    if (!COUPLE_SETTABLE_STATUSES.includes(status)) {
      return { data: null, error: { message: 'Status nicht erlaubt', status: 400 } };
    }
    const result = await supabaseRest('PATCH', 'projects', `id=eq.${enc(ctx.projectId)}&select=*`, { status });
    return { data: stripSensitiveFields(result.data?.[0] || null), error: result.error };
  },

  async updateProject({ updates }, ctx) {
    const safe = {};
    for (const key of COUPLE_EDITABLE_PROJECT_FIELDS) {
      if (updates && key in updates) safe[key] = updates[key];
    }
    if (Object.keys(safe).length === 0) {
      return { data: null, error: { message: 'Keine erlaubten Felder', status: 400 } };
    }
    const result = await supabaseRest('PATCH', 'projects', `id=eq.${enc(ctx.projectId)}&select=*`, safe);
    return { data: stripSensitiveFields(result.data?.[0] || null), error: result.error };
  },

  async updateProjectContent({ component, contentData }, ctx) {
    if (!COMPONENT_RE.test(component || '')) {
      return { data: null, error: { message: `Ungültige Komponente: ${component}`, status: 400 } };
    }
    if (contentData === undefined || contentData === null) {
      return { data: null, error: { message: 'Kein Inhalt übergeben', status: 400 } };
    }

    const row = { project_id: ctx.projectId, component, content: contentData };

    // 1. Regulärer Upsert — braucht Unique-Index auf (project_id, component)
    const upsert = await supabaseRest('POST', 'project_content',
      'on_conflict=project_id,component&select=*', row, {
      'Prefer': 'resolution=merge-duplicates,return=representation',
    });
    if (!upsert.error) return { data: upsert.data?.[0] || null, error: null };

    // 2. Fallback ohne Index: lesen, dann PATCH oder INSERT.
    if (!isMissingConflictTarget(upsert.error)) {
      return { data: null, error: upsert.error };
    }
    console.warn('[db] project_content ohne Unique-Index (project_id, component) — Fallback aktiv');

    const filter = `project_id=eq.${enc(ctx.projectId)}&component=eq.${enc(component)}`;
    const existing = await supabaseRest('GET', 'project_content', `${filter}&select=id`);
    if (existing.error) return { data: null, error: existing.error };

    if (existing.data && existing.data.length > 0) {
      const patched = await supabaseRest('PATCH', 'project_content', `${filter}&select=*`, {
        content: contentData,
      });
      return { data: patched.data?.[0] || null, error: patched.error };
    }

    const inserted = await supabaseRest('POST', 'project_content', 'select=*', row);
    return { data: inserted.data?.[0] || null, error: inserted.error };
  },

  // --- RSVP ---

  async submitRSVP({ projectId, rsvpData }) {
    const result = await supabaseRest('POST', 'rsvp_responses', 'select=*', {
      project_id: projectId,
      name: rsvpData.name,
      email: rsvpData.email,
      persons: rsvpData.persons || 1,
      attending: rsvpData.attending,
      dietary: rsvpData.dietary || '',
      allergies: rsvpData.allergies || '',
      message: rsvpData.message || '',
      guests: rsvpData.guests || null,
      custom_answer: rsvpData.custom_answer || '',
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async checkDuplicateRSVP({ projectId, email }) {
    const result = await supabaseRest('GET', 'rsvp_responses',
      `project_id=eq.${enc(projectId)}&email=eq.${encodeURIComponent(email.trim().toLowerCase())}&select=id&limit=1`);
    return { exists: (result.data && result.data.length > 0) || false };
  },

  async getRSVPResponses(_params, ctx) {
    const result = await supabaseRest('GET', 'rsvp_responses',
      `project_id=eq.${enc(ctx.projectId)}&select=*&order=created_at.desc`);
    return { data: result.data || [], error: result.error };
  },

  async updateRSVPResponse({ id, updates }, ctx) {
    const result = await supabaseRest('PATCH', 'rsvp_responses',
      `id=eq.${enc(id)}&project_id=eq.${enc(ctx.projectId)}&select=*`, {
      name: updates.name,
      email: updates.email,
      persons: updates.persons,
      attending: updates.attending,
      dietary: updates.dietary,
      allergies: updates.allergies,
      message: updates.message,
      custom_answer: updates.custom_answer,
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async deleteRSVPResponse({ id }, ctx) {
    const result = await supabaseRest('DELETE', 'rsvp_responses',
      `id=eq.${enc(id)}&project_id=eq.${enc(ctx.projectId)}`, null, { 'Prefer': 'return=minimal' });
    return { data: null, error: result.error };
  },

  // --- GUESTBOOK ---

  async submitGuestbookEntry({ projectId, entryData }) {
    const result = await supabaseRest('POST', 'guestbook_entries', 'select=*', {
      project_id: projectId,
      name: entryData.name,
      message: entryData.message,
      image_url: entryData.imageUrl,
      approved: false,
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async getGuestbookEntries({ projectId, approvedOnly }) {
    let query = `project_id=eq.${enc(projectId)}&select=*&order=created_at.desc`;
    if (approvedOnly !== false) {
      query += '&approved=eq.true';
    }
    const result = await supabaseRest('GET', 'guestbook_entries', query);
    return { data: result.data || [], error: result.error };
  },

  async approveGuestbookEntry({ entryId, approved }, ctx) {
    const result = await supabaseRest('PATCH', 'guestbook_entries',
      `id=eq.${enc(entryId)}&project_id=eq.${enc(ctx.projectId)}&select=*`, {
      approved: approved !== false,
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async deleteGuestbookEntry({ entryId }, ctx) {
    const result = await supabaseRest('DELETE', 'guestbook_entries',
      `id=eq.${enc(entryId)}&project_id=eq.${enc(ctx.projectId)}`, null, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },

  // --- MUSIC WISHES ---

  async submitMusicWish({ projectId, wishData }) {
    const result = await supabaseRest('POST', 'music_wishes', 'select=*', {
      project_id: projectId,
      name: wishData.name,
      artist: wishData.artist || '',
      song_title: wishData.song_title || wishData.songTitle || '',
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async getMusicWishes({ projectId }) {
    const result = await supabaseRest('GET', 'music_wishes',
      `project_id=eq.${enc(projectId)}&select=*&order=created_at.desc`);
    return { data: result.data || [], error: result.error };
  },

  async deleteMusicWish({ wishId }, ctx) {
    const result = await supabaseRest('DELETE', 'music_wishes',
      `id=eq.${enc(wishId)}&project_id=eq.${enc(ctx.projectId)}`, null, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },

  // --- PHOTO UPLOADS ---

  async submitPhotoUpload({ projectId, photoData }) {
    const result = await supabaseRest('POST', 'photo_uploads', 'select=*', {
      project_id: projectId,
      uploaded_by: photoData.uploadedBy || 'Guest',
      cloudinary_url: photoData.cloudinaryUrl,
      cloudinary_public_id: photoData.cloudinaryPublicId,
      timeline_event_id: photoData.timelineEventId,
      approved: false,
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async getPhotoUploads({ projectId, approvedOnly }) {
    let query = `project_id=eq.${enc(projectId)}&select=*&order=created_at.desc`;
    if (approvedOnly !== false) {
      query += '&approved=eq.true';
    }
    const result = await supabaseRest('GET', 'photo_uploads', query);
    return { data: result.data || [], error: result.error };
  },

  async approvePhotoUpload({ photoId, approved }, ctx) {
    const result = await supabaseRest('PATCH', 'photo_uploads',
      `id=eq.${enc(photoId)}&project_id=eq.${enc(ctx.projectId)}&select=*`, {
      approved: approved !== false,
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async deletePhotoUpload({ photoId }, ctx) {
    const result = await supabaseRest('DELETE', 'photo_uploads',
      `id=eq.${enc(photoId)}&project_id=eq.${enc(ctx.projectId)}`, null, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },

  // --- GIFT RESERVATIONS ---

  async reserveGift({ projectId, itemId, reservedBy, reserverEmail }) {
    const result = await supabaseRest('POST', 'gift_reservations', 'select=*', {
      project_id: projectId,
      item_id: itemId,
      reserved_by: reservedBy,
      reserved_by_email: reserverEmail || null,
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async getGiftReservations({ projectId }) {
    const result = await supabaseRest('GET', 'gift_reservations',
      `project_id=eq.${enc(projectId)}&select=*&order=created_at.desc`);
    return { data: result.data || [], error: result.error };
  },

  async deleteGiftReservation({ reservationId }, ctx) {
    const result = await supabaseRest('DELETE', 'gift_reservations',
      `id=eq.${enc(reservationId)}&project_id=eq.${enc(ctx.projectId)}`, null, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },

  async unreserveGiftByItemId({ itemId }, ctx) {
    const result = await supabaseRest('DELETE', 'gift_reservations',
      `project_id=eq.${enc(ctx.projectId)}&item_id=eq.${encodeURIComponent(itemId)}`, null, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },

  // --- CONTACT REQUESTS ---

  async submitContactRequest({ requestData }) {
    const result = await supabaseRest('POST', 'contact_requests', 'select=*', {
      name: requestData.name,
      email: requestData.email,
      phone: requestData.phone,
      wedding_date: requestData.weddingDate,
      message: requestData.message,
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  // --- PASSWORD PROTECTION ---

  async checkPasswordRequired({ slug }) {
    const result = await supabaseRPC('check_password_required', { project_slug: slug });
    if (result.error) return { required: false, error: result.error };
    return { required: result.data?.required || false, error: null };
  },

  async verifyProjectPassword({ slug, password }) {
    const result = await supabaseRPC('verify_project_password', {
      project_slug: slug,
      input_password: password,
    });
    if (result.error) return { success: false, error: result.error.message };
    const success = result.data?.success || false;
    return {
      success,
      error: result.data?.error || null,
      ...(success ? { token: createToken(`guest@${slug}`, slug) } : {}),
    };
  },

  async verifyPreviewPassword({ slug, password }) {
    const result = await supabaseRPC('verify_preview_password', {
      project_slug: slug,
      input_password: password,
    });
    if (result.error) return { success: false, error: result.error.message };
    const success = result.data?.success || false;
    return {
      success,
      error: result.data?.error || null,
      ...(success ? { token: createToken(`preview@${slug}`, slug) } : {}),
    };
  },

  async verifyAdminPassword({ slug, password }) {
    const result = await supabaseRPC('verify_admin_password', {
      project_slug: slug,
      input_password: password,
    });
    if (result.error) return { success: false, error: result.error.message };
    const success = result.data?.success || false;
    return {
      success,
      error: result.data?.error || null,
      ...(success ? { token: createToken(`admin@${slug}`, slug) } : {}),
    };
  },

  // --- DATA READY ---

  async submitDataReady(_params, ctx) {
    const projectId = ctx.projectId;
    const result = await supabaseRest('PATCH', 'projects', `id=eq.${enc(projectId)}&select=*`, {
      status: 'ready_for_review',
      data_submitted_at: new Date().toISOString(),
    });

    if (result.error) return { success: false, error: result.error };

    // Create admin notification (best-effort)
    try {
      await supabaseRest('POST', 'admin_notifications', '', {
        project_id: projectId,
        type: 'data_ready',
        status: 'pending',
      }, { 'Prefer': 'return=minimal' });
    } catch (e) {
      console.warn('[db] Could not create notification entry:', e);
    }

    return { success: true, data: stripSensitiveFields(result.data?.[0] || null) };
  },

  // --- GUEST LIST ---

  async getGuestList(_params, ctx) {
    const result = await supabaseRest('GET', 'guest_list',
      `project_id=eq.${enc(ctx.projectId)}&select=*&order=name.asc`);
    return { data: result.data || [], error: result.error };
  },

  async uploadGuestList({ guests }, ctx) {
    if (!Array.isArray(guests)) return { data: null, error: { message: 'guests[] fehlt', status: 400 } };
    const rows = guests.map(g => ({
      project_id: ctx.projectId,
      name: g.name,
      email: g.email.toLowerCase(),
      group_name: g.group_name || '',
    }));

    const result = await supabaseRest('POST', 'guest_list',
      'on_conflict=project_id,email&select=*', rows, {
      'Prefer': 'resolution=merge-duplicates,return=representation',
    });
    return { data: result.data, error: result.error, count: result.data?.length || 0 };
  },

  async deleteGuestListEntry({ id }, ctx) {
    const result = await supabaseRest('DELETE', 'guest_list',
      `id=eq.${enc(id)}&project_id=eq.${enc(ctx.projectId)}`, null, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },

  async clearGuestList(_params, ctx) {
    const result = await supabaseRest('DELETE', 'guest_list', `project_id=eq.${enc(ctx.projectId)}`, null, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },

  async markReminderSent({ guestId }, ctx) {
    const result = await supabaseRest('PATCH', 'guest_list',
      `id=eq.${enc(guestId)}&project_id=eq.${enc(ctx.projectId)}`, {
      reminder_sent_at: new Date().toISOString(),
    }, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },
};

// ============================================
// PUBLIC ACTIONS (no auth required)
// These are needed before the user has a token (initial page load, password check, guest submissions)
// ============================================

const PUBLIC_ACTIONS = new Set([
  'getProjectBySlugOrDomain',
  'getProjectContent',
  'checkPasswordRequired',
  'verifyProjectPassword',
  'verifyPreviewPassword',
  'verifyAdminPassword',
  // Guest-facing submissions (called from public wedding pages)
  'checkDuplicateRSVP',
  'submitRSVP',
  'submitGuestbookEntry',
  'submitMusicWish',
  'submitPhotoUpload',
  'reserveGift',
  'submitContactRequest',
  // Guest-facing reads
  'getGuestbookEntries',
  'getPhotoUploads',
  'getMusicWishes',
  'getGiftReservations',
]);

// ============================================
// HANDLER
// ============================================

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { action, params } = req.body;

  if (!action || !actions[action]) {
    return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  const isPublic = PUBLIC_ACTIONS.has(action);
  const safeParams = params || {};
  let ctx = {};

  try {
    if (isPublic) {
      // Public actions: rate limit by IP, Tokens optional
      const ip = getClientIP(req);
      if (applyRateLimit(res, `db-public:${ip}`, 60, 60 * 1000)) return;
      ctx = { tokens: collectTokens(req) };

      if (GATED_PUBLIC_ACTIONS.has(action)) {
        const gate = await loadGate({ projectId: safeParams.projectId });
        const access = gate ? evaluateAccess(gate, ctx.tokens) : { locked: true, reason: 'preview' };
        if (access.locked) {
          // 423 statt 401/403: Das Frontend soll hier nicht ausloggen
          return res.status(423).json({ data: null, locked: true, reason: access.reason, error: 'locked' });
        }
      }
    } else {
      // Protected actions: Admin-Token DIESES Projekts erforderlich.
      // Gäste-/Vorschau-Tokens und Tokens anderer Projekte → 403.
      const project = await requireProjectAdmin(req, res, safeParams.projectId);
      if (!project) return;
      if (applyRateLimit(res, `db:${project.auth.email}`, 100, 60 * 1000)) return;
      ctx = { projectId: project.id, slug: project.slug };
    }

    const result = await actions[action](safeParams, ctx);

    // Datenbankfehler mit echtem HTTP-Status ausliefern, damit sie im
    // Netzwerk-Tab sichtbar sind. Vorher kam hier immer 200.
    // Supabase-401/403 (z. B. falscher Service-Key) wird bewusst als 502
    // gemeldet — ein 401 würde das Frontend ausloggen.
    const err = result && result.error;
    if (err && typeof err === 'object' && typeof err.status === 'number') {
      const httpStatus = (err.status >= 500 || err.status === 401 || err.status === 403)
        ? 502
        : (err.status === 400 ? 400 : 422);
      res.setHeader('X-DB-Status', String(err.status));
      if (err.code) res.setHeader('X-DB-Code', String(err.code));
      return res.status(httpStatus).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(`[db] Action ${action} error:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
