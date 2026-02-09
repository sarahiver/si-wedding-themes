// src/lib/notifications.js
// Sends notification emails to the couple via Vercel Serverless Function
// All calls are fire-and-forget — guest actions should never fail because of notifications

const NOTIFY_URL = process.env.REACT_APP_NOTIFY_URL || '/api/notify';

async function sendNotification(projectId, type, data) {
  try {
    const response = await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, type, ...data }),
    });

    if (!response.ok) {
      console.warn(`Notification (${type}) failed:`, response.status);
    }
  } catch (err) {
    // Silent fail — never break guest UX for a notification
    console.warn(`Notification (${type}) error:`, err.message);
  }
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Notify couple about a new RSVP response
 */
export function notifyRSVP(projectId, { name, attending, persons, dietary, message }) {
  return sendNotification(projectId, 'rsvp', {
    guestName: name,
    attending,
    persons: persons || 1,
    dietary: dietary || '',
    message: message || '',
  });
}

/**
 * Notify couple about a new guestbook entry
 */
export function notifyGuestbook(projectId, { name, message }) {
  return sendNotification(projectId, 'guestbook', {
    guestName: name,
    message: message || '',
  });
}

/**
 * Notify couple about a new music wish
 */
export function notifyMusicWish(projectId, { name, artist, songTitle }) {
  return sendNotification(projectId, 'music_wish', {
    guestName: name,
    artist: artist || '',
    songTitle: songTitle || '',
  });
}

/**
 * Notify couple about a gift reservation
 */
export function notifyGiftReserved(projectId, { name, giftName }) {
  return sendNotification(projectId, 'gift_reserved', {
    guestName: name,
    giftName: giftName || '',
  });
}

/**
 * Notify couple about a new photo upload
 */
export function notifyPhotoUpload(projectId, { name }) {
  return sendNotification(projectId, 'photo_upload', {
    guestName: name || 'Gast',
  });
}
