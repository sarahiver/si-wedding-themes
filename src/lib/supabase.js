// src/lib/supabase.js
// All database operations go through the server-side API proxy (/api/db).
// No Supabase client or anon key in the frontend.

import { notifyRSVP, notifyGuestbook, notifyMusicWish, notifyGiftReserved } from './notifications';

// ============================================
// API HELPER
// ============================================

function getToken() {
  return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
}

export function setToken(token) {
  sessionStorage.setItem('auth_token', token);
  localStorage.setItem('auth_token', token);
}

export function clearToken() {
  sessionStorage.removeItem('auth_token');
  localStorage.removeItem('auth_token');
}

function handleUnauthorized() {
  clearToken();
  sessionStorage.clear();
  window.location.reload();
}

/**
 * Authenticated fetch — adds Bearer token to any API call.
 * Use for direct API route calls (e.g. /api/delete-photos, /api/reminder).
 */
export async function authFetch(url, options = {}) {
  const token = getToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
  }

  return response;
}

async function dbCall(action, params = {}) {
  const token = getToken();
  const response = await fetch('/api/db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ action, params }),
  });

  if (response.status === 401) {
    handleUnauthorized();
    return { data: null, error: 'Unauthorized' };
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: response.statusText }));
    return { data: null, error: errData.error || 'Request failed' };
  }

  return await response.json();
}

// ============================================
// AUTH (Password verification + token)
// ============================================

export async function verifyAndGetToken(slug, password, type = 'guest') {
  const response = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, password, type }),
  });

  const result = await response.json();
  if (result.success && result.token) {
    setToken(result.token);
  }
  return result;
}

// ============================================
// PROJECT
// ============================================

export async function getProjectBySlugOrDomain(slugOrDomain) {
  return dbCall('getProjectBySlugOrDomain', { slugOrDomain });
}

export async function getProjectContent(projectId) {
  return dbCall('getProjectContent', { projectId });
}

export async function updateProjectStatus(projectId, status) {
  return dbCall('updateProjectStatus', { projectId, status });
}

export async function updateProject(projectId, updates) {
  return dbCall('updateProject', { projectId, updates });
}

export async function updateProjectContent(projectId, component, contentData) {
  return dbCall('updateProjectContent', { projectId, component, contentData });
}

// ============================================
// RSVP
// ============================================

export async function submitRSVP(projectId, rsvpData) {
  const result = await dbCall('submitRSVP', { projectId, rsvpData });

  // Fire-and-forget notification
  if (result.data && !result.error) {
    notifyRSVP(projectId, {
      name: rsvpData.name,
      attending: rsvpData.attending,
      persons: rsvpData.persons || 1,
      dietary: rsvpData.dietary,
      message: rsvpData.message,
    });
  }

  return result;
}

export async function getRSVPResponses(projectId) {
  return dbCall('getRSVPResponses', { projectId });
}

export async function checkDuplicateRSVP(projectId, email) {
  return dbCall('checkDuplicateRSVP', { projectId, email });
}

export async function updateRSVPResponse(id, updates) {
  return dbCall('updateRSVPResponse', { id, updates });
}

export async function deleteRSVPResponse(id) {
  return dbCall('deleteRSVPResponse', { id });
}

// ============================================
// GUESTBOOK
// ============================================

export async function submitGuestbookEntry(projectId, entryData) {
  const result = await dbCall('submitGuestbookEntry', { projectId, entryData });

  // Fire-and-forget notification
  if (result.data && !result.error) {
    notifyGuestbook(projectId, {
      name: entryData.name,
      message: entryData.message,
    });
  }

  return result;
}

export async function getGuestbookEntries(projectId, approvedOnly = true) {
  return dbCall('getGuestbookEntries', { projectId, approvedOnly });
}

export async function approveGuestbookEntry(entryId, approved = true) {
  return dbCall('approveGuestbookEntry', { entryId, approved });
}

export async function deleteGuestbookEntry(entryId) {
  return dbCall('deleteGuestbookEntry', { entryId });
}

// ============================================
// MUSIC WISHES
// ============================================

export async function submitMusicWish(projectId, wishData) {
  const result = await dbCall('submitMusicWish', { projectId, wishData });

  // Fire-and-forget notification
  if (result.data && !result.error) {
    notifyMusicWish(projectId, {
      name: wishData.name,
      artist: wishData.artist,
      songTitle: wishData.song_title || wishData.songTitle,
    });
  }

  return result;
}

export async function getMusicWishes(projectId) {
  return dbCall('getMusicWishes', { projectId });
}

export async function deleteMusicWish(wishId) {
  return dbCall('deleteMusicWish', { wishId });
}

// ============================================
// PHOTO UPLOADS
// ============================================

export async function submitPhotoUpload(projectId, photoData) {
  return dbCall('submitPhotoUpload', { projectId, photoData });
}

export async function getPhotoUploads(projectId, approvedOnly = true) {
  return dbCall('getPhotoUploads', { projectId, approvedOnly });
}

export async function approvePhotoUpload(photoId, approved = true) {
  return dbCall('approvePhotoUpload', { photoId, approved });
}

export async function deletePhotoUpload(photoId) {
  return dbCall('deletePhotoUpload', { photoId });
}

// ============================================
// GIFT RESERVATIONS
// ============================================

export async function reserveGift(projectId, itemId, reservedBy, reserverEmail = null, giftName = null) {
  const result = await dbCall('reserveGift', { projectId, itemId, reservedBy, reserverEmail });

  // Fire-and-forget notification
  if (result.data && !result.error) {
    notifyGiftReserved(projectId, {
      name: reservedBy,
      giftName: giftName || itemId,
    });
  }

  return result;
}

export async function getGiftReservations(projectId) {
  return dbCall('getGiftReservations', { projectId });
}

export async function deleteGiftReservation(reservationId) {
  return dbCall('deleteGiftReservation', { reservationId });
}

export async function unreserveGiftByItemId(projectId, itemId) {
  return dbCall('unreserveGiftByItemId', { projectId, itemId });
}

// ============================================
// CONTACT REQUESTS (Marketing)
// ============================================

export async function submitContactRequest(requestData) {
  return dbCall('submitContactRequest', { requestData });
}

// ============================================
// PASSWORD PROTECTION
// ============================================

export async function checkPasswordRequired(slug) {
  return dbCall('checkPasswordRequired', { slug });
}

export async function verifyProjectPassword(slug, password) {
  const result = await dbCall('verifyProjectPassword', { slug, password });
  if (result.success && result.token) setToken(result.token);
  return result;
}

export async function verifyPreviewPassword(slug, password) {
  const result = await dbCall('verifyPreviewPassword', { slug, password });
  if (result.success && result.token) setToken(result.token);
  return result;
}

export async function verifyAdminPassword(slug, password) {
  const result = await dbCall('verifyAdminPassword', { slug, password });
  if (result.success && result.token) setToken(result.token);
  return result;
}

// ============================================
// DATA READY NOTIFICATION (Kunde -> Admin)
// ============================================

export async function submitDataReady(projectId) {
  return dbCall('submitDataReady', { projectId });
}

// ============================================
// GUEST LIST (für RSVP-Erinnerungen)
// ============================================

export async function getGuestList(projectId) {
  return dbCall('getGuestList', { projectId });
}

export async function uploadGuestList(projectId, guests) {
  return dbCall('uploadGuestList', { projectId, guests });
}

export async function deleteGuestListEntry(id) {
  return dbCall('deleteGuestListEntry', { id });
}

export async function clearGuestList(projectId) {
  return dbCall('clearGuestList', { projectId });
}

export async function markReminderSent(guestId) {
  return dbCall('markReminderSent', { guestId });
}
