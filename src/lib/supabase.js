// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase nicht konfiguriert');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// ============================================
// PROJECT
// ============================================

export async function getProjectBySlugOrDomain(slugOrDomain) {
  // First try by slug
  let { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slugOrDomain)
    .single();
  
  // If not found, try by custom_domain
  if (error || !data) {
    const domainResult = await supabase
      .from('projects')
      .select('*')
      .eq('custom_domain', slugOrDomain)
      .single();
    
    data = domainResult.data;
    error = domainResult.error;
  }
  
  return { data, error };
}

export async function getProjectContent(projectId) {
  const { data, error } = await supabase
    .from('project_content')
    .select('*')
    .eq('project_id', projectId);
  
  if (error) return { data: {}, error };
  
  // Transform array to object keyed by component
  const contentByComponent = {};
  data.forEach(item => {
    contentByComponent[item.component] = item.content;
  });
  
  return { data: contentByComponent, error: null };
}

export async function updateProjectStatus(projectId, status) {
  const { data, error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', projectId)
    .select()
    .single();
  
  return { data, error };
}

// NEU: Allgemeines Project Update (für Settings: location, hashtag, etc.)
export async function updateProject(projectId, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();
  
  return { data, error };
}

export async function updateProjectContent(projectId, component, contentData) {
  const { data, error } = await supabase
    .from('project_content')
    .upsert({
      project_id: projectId,
      component: component,
      content: contentData,
    }, {
      onConflict: 'project_id,component',
    })
    .select()
    .single();
  
  return { data, error };
}

// ============================================
// RSVP
// ============================================

export async function submitRSVP(projectId, rsvpData) {
  const { data, error } = await supabase
    .from('rsvp_responses')
    .insert({
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
    })
    .select()
    .single();

  return { data, error };
}

export async function getRSVPResponses(projectId) {
  const { data, error } = await supabase
    .from('rsvp_responses')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  return { data: data || [], error };
}

export async function updateRSVPResponse(id, updates) {
  const { data, error } = await supabase
    .from('rsvp_responses')
    .update({
      name: updates.name,
      email: updates.email,
      persons: updates.persons,
      attending: updates.attending,
      dietary: updates.dietary,
      allergies: updates.allergies,
      message: updates.message,
      custom_answer: updates.custom_answer,
    })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteRSVPResponse(id) {
  const { data, error } = await supabase
    .from('rsvp_responses')
    .delete()
    .eq('id', id);
  
  return { data, error };
}

// ============================================
// GUESTBOOK
// ============================================

export async function submitGuestbookEntry(projectId, entryData) {
  const { data, error } = await supabase
    .from('guestbook_entries')
    .insert({
      project_id: projectId,
      name: entryData.name,
      message: entryData.message,
      image_url: entryData.imageUrl,
      approved: false,
    })
    .select()
    .single();
  
  return { data, error };
}

export async function getGuestbookEntries(projectId, approvedOnly = true) {
  let query = supabase
    .from('guestbook_entries')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (approvedOnly) {
    query = query.eq('approved', true);
  }
  
  const { data, error } = await query;
  return { data: data || [], error };
}

export async function approveGuestbookEntry(entryId, approved = true) {
  const { data, error } = await supabase
    .from('guestbook_entries')
    .update({ approved })
    .eq('id', entryId)
    .select()
    .single();
  
  return { data, error };
}

export async function deleteGuestbookEntry(entryId) {
  const { error } = await supabase
    .from('guestbook_entries')
    .delete()
    .eq('id', entryId);
  
  return { error };
}

// ============================================
// MUSIC WISHES
// ============================================

export async function submitMusicWish(projectId, wishData) {
  const { data, error } = await supabase
    .from('music_wishes')
    .insert({
      project_id: projectId,
      name: wishData.name,
      artist: wishData.artist || '',
      song_title: wishData.song_title || wishData.songTitle || '',
    })
    .select()
    .single();
  
  return { data, error };
}

export async function getMusicWishes(projectId) {
  const { data, error } = await supabase
    .from('music_wishes')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  return { data: data || [], error };
}

export async function deleteMusicWish(wishId) {
  const { error } = await supabase
    .from('music_wishes')
    .delete()
    .eq('id', wishId);
  
  return { error };
}

// ============================================
// PHOTO UPLOADS
// ============================================

export async function submitPhotoUpload(projectId, photoData) {
  const { data, error } = await supabase
    .from('photo_uploads')
    .insert({
      project_id: projectId,
      uploaded_by: photoData.uploadedBy || 'Guest',
      cloudinary_url: photoData.cloudinaryUrl,
      cloudinary_public_id: photoData.cloudinaryPublicId,
      timeline_event_id: photoData.timelineEventId,
      approved: false,
    })
    .select()
    .single();
  
  return { data, error };
}

export async function getPhotoUploads(projectId, approvedOnly = true) {
  let query = supabase
    .from('photo_uploads')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (approvedOnly) {
    query = query.eq('approved', true);
  }
  
  const { data, error } = await query;
  return { data: data || [], error };
}

export async function approvePhotoUpload(photoId, approved = true) {
  const { data, error } = await supabase
    .from('photo_uploads')
    .update({ approved })
    .eq('id', photoId)
    .select()
    .single();
  
  return { data, error };
}

export async function deletePhotoUpload(photoId) {
  const { error } = await supabase
    .from('photo_uploads')
    .delete()
    .eq('id', photoId);
  
  return { error };
}

// ============================================
// GIFT RESERVATIONS
// ============================================

export async function reserveGift(projectId, itemId, reservedBy, reserverEmail = null) {
  const { data, error } = await supabase
    .from('gift_reservations')
    .insert({
      project_id: projectId,
      item_id: itemId,
      reserved_by: reservedBy,
      reserved_by_email: reserverEmail,
    })
    .select()
    .single();
  
  return { data, error };
}

export async function getGiftReservations(projectId) {
  const { data, error } = await supabase
    .from('gift_reservations')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  return { data: data || [], error };
}

export async function deleteGiftReservation(reservationId) {
  const { error } = await supabase
    .from('gift_reservations')
    .delete()
    .eq('id', reservationId);
  
  return { error };
}

export async function unreserveGiftByItemId(projectId, itemId) {
  const { error } = await supabase
    .from('gift_reservations')
    .delete()
    .eq('project_id', projectId)
    .eq('item_id', itemId);
  
  return { error };
}

// ============================================
// CONTACT REQUESTS (Marketing)
// ============================================

export async function submitContactRequest(requestData) {
  const { data, error } = await supabase
    .from('contact_requests')
    .insert({
      name: requestData.name,
      email: requestData.email,
      phone: requestData.phone,
      wedding_date: requestData.weddingDate,
      message: requestData.message,
    })
    .select()
    .single();
  
  return { data, error };
}

// ============================================
// PASSWORD PROTECTION
// ============================================

/**
 * Prüft ob ein Projekt Passwortschutz hat (ohne Passwort zu verraten)
 */
export async function checkPasswordRequired(slug) {
  const { data, error } = await supabase
    .rpc('check_password_required', { project_slug: slug });
  
  if (error) {
    console.error('Error checking password requirement:', error);
    return { required: false, error };
  }
  
  return { required: data?.required || false, error: null };
}

/**
 * Verifiziert das eingegebene Passwort serverseitig
 * Das echte Passwort wird NIEMALS ans Frontend geschickt
 */
export async function verifyProjectPassword(slug, password) {
  const { data, error } = await supabase
    .rpc('verify_project_password', { 
      project_slug: slug, 
      input_password: password 
    });
  
  if (error) {
    console.error('Error verifying password:', error);
    return { success: false, error: error.message };
  }
  
  return { 
    success: data?.success || false, 
    error: data?.error || null 
  };
}

// ============================================
// DATA READY NOTIFICATION (Kunde -> Admin)
// ============================================

export async function submitDataReady(projectId) {
  // Status auf ready_for_review setzen + Timestamp speichern
  const { data: project, error: statusError } = await supabase
    .from('projects')
    .update({ 
      status: 'ready_for_review',
      data_submitted_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()
    .single();
  
  if (statusError) {
    console.error('Error updating status:', statusError);
    return { success: false, error: statusError };
  }
  
  // Admin-Benachrichtigung in DB speichern (für spätere E-Mail-Verarbeitung)
  try {
    await supabase
      .from('admin_notifications')
      .insert({
        project_id: projectId,
        type: 'data_ready',
        status: 'pending',
      });
  } catch (e) {
    console.warn('Could not create notification entry:', e);
  }
  
  return { success: true, data: project };
}
