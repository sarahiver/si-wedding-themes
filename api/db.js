// api/db.js
// Vercel Serverless Function — Supabase Proxy
// All frontend DB operations go through this endpoint.
// Token-auth required. Action whitelist — no generic query access.

const { handleCors, requireAuth, applyRateLimit, getClientIP, createToken } = require('./lib/auth');

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
    return { data: null, error: { message: errText, status: response.status } };
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
  if (!data) return data;
  if (Array.isArray(data)) return data.map(stripSensitiveFields);
  const cleaned = { ...data };
  delete cleaned.admin_password;
  delete cleaned.preview_password;
  delete cleaned.guest_password;
  return cleaned;
}

// ============================================
// ACTION HANDLERS
// ============================================

const actions = {
  // --- PROJECT ---

  async getProjectBySlugOrDomain({ slugOrDomain }) {
    // Try by slug
    let result = await supabaseRest('GET', 'projects', `slug=eq.${encodeURIComponent(slugOrDomain)}&select=*`);
    let data = result.data?.[0] || null;

    // Try by custom_domain
    if (!data) {
      result = await supabaseRest('GET', 'projects', `custom_domain=eq.${encodeURIComponent(slugOrDomain)}&select=*`);
      data = result.data?.[0] || null;
    }

    return { data: stripSensitiveFields(data), error: data ? null : (result.error || { message: 'Not found' }) };
  },

  async getProjectContent({ projectId }) {
    const result = await supabaseRest('GET', 'project_content', `project_id=eq.${projectId}&select=*`);
    if (result.error) return { data: {}, error: result.error };

    const contentByComponent = {};
    (result.data || []).forEach(item => {
      contentByComponent[item.component] = item.content;
    });
    return { data: contentByComponent, error: null };
  },

  async updateProjectStatus({ projectId, status }) {
    const result = await supabaseRest('PATCH', 'projects', `id=eq.${projectId}&select=*`, { status });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async updateProject({ projectId, updates }) {
    const result = await supabaseRest('PATCH', 'projects', `id=eq.${projectId}&select=*`, updates);
    return { data: result.data?.[0] || null, error: result.error };
  },

  async updateProjectContent({ projectId, component, contentData }) {
    const result = await supabaseRest('POST', 'project_content',
      'on_conflict=project_id,component', {
      project_id: projectId,
      component,
      content: contentData,
    }, {
      'Prefer': 'resolution=merge-duplicates,return=representation',
    });
    return { data: result.data?.[0] || null, error: result.error };
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
      `project_id=eq.${projectId}&email=eq.${encodeURIComponent(email.trim().toLowerCase())}&select=id&limit=1`);
    return { exists: (result.data && result.data.length > 0) || false };
  },

  async getRSVPResponses({ projectId }) {
    const result = await supabaseRest('GET', 'rsvp_responses',
      `project_id=eq.${projectId}&select=*&order=created_at.desc`);
    return { data: result.data || [], error: result.error };
  },

  async updateRSVPResponse({ id, updates }) {
    const result = await supabaseRest('PATCH', 'rsvp_responses', `id=eq.${id}&select=*`, {
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

  async deleteRSVPResponse({ id }) {
    const result = await supabaseRest('DELETE', 'rsvp_responses', `id=eq.${id}`, null, { 'Prefer': 'return=minimal' });
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
    let query = `project_id=eq.${projectId}&select=*&order=created_at.desc`;
    if (approvedOnly !== false) {
      query += '&approved=eq.true';
    }
    const result = await supabaseRest('GET', 'guestbook_entries', query);
    return { data: result.data || [], error: result.error };
  },

  async approveGuestbookEntry({ entryId, approved }) {
    const result = await supabaseRest('PATCH', 'guestbook_entries', `id=eq.${entryId}&select=*`, {
      approved: approved !== false,
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async deleteGuestbookEntry({ entryId }) {
    const result = await supabaseRest('DELETE', 'guestbook_entries', `id=eq.${entryId}`, null, { 'Prefer': 'return=minimal' });
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
      `project_id=eq.${projectId}&select=*&order=created_at.desc`);
    return { data: result.data || [], error: result.error };
  },

  async deleteMusicWish({ wishId }) {
    const result = await supabaseRest('DELETE', 'music_wishes', `id=eq.${wishId}`, null, { 'Prefer': 'return=minimal' });
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
    let query = `project_id=eq.${projectId}&select=*&order=created_at.desc`;
    if (approvedOnly !== false) {
      query += '&approved=eq.true';
    }
    const result = await supabaseRest('GET', 'photo_uploads', query);
    return { data: result.data || [], error: result.error };
  },

  async approvePhotoUpload({ photoId, approved }) {
    const result = await supabaseRest('PATCH', 'photo_uploads', `id=eq.${photoId}&select=*`, {
      approved: approved !== false,
    });
    return { data: result.data?.[0] || null, error: result.error };
  },

  async deletePhotoUpload({ photoId }) {
    const result = await supabaseRest('DELETE', 'photo_uploads', `id=eq.${photoId}`, null, { 'Prefer': 'return=minimal' });
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
      `project_id=eq.${projectId}&select=*&order=created_at.desc`);
    return { data: result.data || [], error: result.error };
  },

  async deleteGiftReservation({ reservationId }) {
    const result = await supabaseRest('DELETE', 'gift_reservations', `id=eq.${reservationId}`, null, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },

  async unreserveGiftByItemId({ projectId, itemId }) {
    const result = await supabaseRest('DELETE', 'gift_reservations',
      `project_id=eq.${projectId}&item_id=eq.${encodeURIComponent(itemId)}`, null, { 'Prefer': 'return=minimal' });
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

  async submitDataReady({ projectId }) {
    const result = await supabaseRest('PATCH', 'projects', `id=eq.${projectId}&select=*`, {
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

    return { success: true, data: result.data?.[0] || null };
  },

  // --- GUEST LIST ---

  async getGuestList({ projectId }) {
    const result = await supabaseRest('GET', 'guest_list',
      `project_id=eq.${projectId}&select=*&order=name.asc`);
    return { data: result.data || [], error: result.error };
  },

  async uploadGuestList({ projectId, guests }) {
    const rows = guests.map(g => ({
      project_id: projectId,
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

  async deleteGuestListEntry({ id }) {
    const result = await supabaseRest('DELETE', 'guest_list', `id=eq.${id}`, null, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },

  async clearGuestList({ projectId }) {
    const result = await supabaseRest('DELETE', 'guest_list', `project_id=eq.${projectId}`, null, { 'Prefer': 'return=minimal' });
    return { error: result.error };
  },

  async markReminderSent({ guestId }) {
    const result = await supabaseRest('PATCH', 'guest_list', `id=eq.${guestId}`, {
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

  if (isPublic) {
    // Public actions: rate limit by IP, no auth
    const ip = getClientIP(req);
    if (applyRateLimit(res, `db-public:${ip}`, 60, 60 * 1000)) return;
  } else {
    // Protected actions: auth required + rate limit by token email
    const auth = requireAuth(req, res);
    if (!auth) return;
    if (applyRateLimit(res, `db:${auth.email}`, 100, 60 * 1000)) return;
  }

  try {
    const result = await actions[action](params || {});
    return res.status(200).json(result);
  } catch (error) {
    console.error(`[db] Action ${action} error:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
