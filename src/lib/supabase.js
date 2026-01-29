// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://wikxhpvikelfgzdgndlf.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      guests: rsvpData.guests || null, // JSONB für Begleitpersonen
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
      artist: wishData.artist,
      song_title: wishData.songTitle,
      // Note: 'message' field removed - not in database schema
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

// Unreserve a gift by item_id (for admin use)
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
