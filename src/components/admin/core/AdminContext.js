// core/AdminContext.js - Central State Management for Admin Dashboard
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useWedding } from '../../../context/WeddingContext';
import {
  getRSVPResponses, getGuestbookEntries, getMusicWishes, getPhotoUploads,
  updateProjectStatus, approveGuestbookEntry, deleteGuestbookEntry,
  deleteMusicWish, updateProjectContent, approvePhotoUpload, deletePhotoUpload,
  submitDataReady,
} from '../../../lib/supabase';

const AdminContext = createContext(null);

// Paket-Definitionen (müssen mit SuperAdmin übereinstimmen)
const PACKAGE_FEATURES = {
  klassik: { save_the_date: false, archive: false },
  signature: { save_the_date: true, archive: false },
  couture: { save_the_date: true, archive: true },
  individual: { save_the_date: true, archive: true }, // Custom - hat alles
};

// Prüft ob ein Feature im Paket oder in den Addons enthalten ist
const isFeatureAvailable = (packageName, addons, feature) => {
  const pkg = PACKAGE_FEATURES[packageName] || PACKAGE_FEATURES.klassik;
  if (pkg[feature]) return true;
  if (addons && addons.includes(feature)) return true;
  return false;
};

export function AdminProvider({ children }) {
  const wedding = useWedding();
  const { project, projectId, coupleNames, content, slug, isComponentActive, refetch } = wedding || {};
  
  // Auth - persist in sessionStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(`admin_logged_in_${slug}`) === 'true';
    }
    return false;
  });
  const [loginError, setLoginError] = useState('');
  
  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data
  const [rsvpData, setRsvpData] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [musicWishes, setMusicWishes] = useState([]);
  const [photoUploads, setPhotoUploads] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Status
  const [currentStatus, setCurrentStatus] = useState(project?.status || 'live');
  
  // Feedback
  const [feedback, setFeedback] = useState({ show: false, type: 'success', message: '' });
  
  // Content States - Schema-compliant
  const [contentStates, setContentStates] = useState({});
  
  // Config
  const adminPassword = project?.admin_password || 'admin123';
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
  const baseFolder = `siwedding/${slug || 'default'}`;
  
  // Feature-Verfügbarkeit basierend auf Paket
  const hasSaveTheDate = useMemo(() => 
    isFeatureAvailable(project?.package, project?.addons, 'save_the_date'),
    [project?.package, project?.addons]
  );
  const hasArchive = useMemo(() => 
    isFeatureAvailable(project?.package, project?.addons, 'archive'),
    [project?.package, project?.addons]
  );

  // Initialize content from wedding context - Schema-compliant defaults
  useEffect(() => {
    if (content) {
      setContentStates({
        hero: content.hero || { background_image: '', background_video: '', tagline: '', location_short: '' },
        countdown: content.countdown || { target_date: '', title: '', show_seconds: true },
        lovestory: content.lovestory || { title: '', events: [] },
        timeline: content.timeline || { title: '', events: [] },
        locations: content.locations || { title: '', locations: [] },
        directions: content.directions || { title: '', address: '', maps_embed: '', parking_info: '', public_transport: '', taxi_info: '' },
        rsvp: content.rsvp || { title: '', description: '', deadline: '', ask_dietary: true, ask_allergies: true, ask_song_wish: false },
        dresscode: content.dresscode || { title: '', code: '', description: '', colors: [], dos: [], donts: [] },
        gifts: content.gifts || { title: '', description: '', items: [], bank_details: '', paypal_link: '', registry_url: '' },
        accommodations: content.accommodations || { title: '', description: '', hotels: [] },
        witnesses: content.witnesses || { title: '', persons: [] },
        gallery: content.gallery || { title: '', images: [], layout: 'grid' },
        guestbook: content.guestbook || { title: '', description: '', allow_images: true },
        musicwishes: content.musicwishes || { title: '', description: '', spotify_playlist: '' },
        photoupload: content.photoupload || { title: '', description: '', max_files: 10, moderation: true },
        faq: content.faq || { title: '', questions: [] },
        weddingabc: content.weddingabc || { title: '', entries: [] },
        contact: content.contact || { title: '', couple_email: '', couple_phone: '', show_form: true },
        footer: content.footer || { hashtag: '', impressum_url: '', datenschutz_url: '' },
        savethedate: content.savethedate || { hero_image: '', tagline: '', message: '', countdown_active: true },
        archive: content.archive || { hero_image: '', thank_you_title: '', thank_you_text: '', gallery_images: [] },
        status: content.status || { std_until: '', archive_from: '' },
      });
    }
  }, [content]);

  useEffect(() => {
    if (project) setCurrentStatus(project.status);
  }, [project]);

  // Load data when logged in
  useEffect(() => {
    if (isLoggedIn && projectId) loadData();
  }, [isLoggedIn, projectId]);

  // DATA LOADING
  const loadData = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const [r, g, m, p] = await Promise.all([
        getRSVPResponses(projectId),
        getGuestbookEntries(projectId, false),
        getMusicWishes(projectId),
        getPhotoUploads(projectId, false),
      ]);
      setRsvpData(r.data || []);
      setGuestbookEntries(g.data || []);
      setMusicWishes(m.data || []);
      setPhotoUploads(p.data || []);
    } catch (e) {
      console.error('Error loading data:', e);
      showFeedback('error', 'Fehler beim Laden der Daten');
    }
    setIsLoading(false);
  }, [projectId]);

  // FEEDBACK
  const showFeedback = useCallback((type, message) => {
    setFeedback({ show: true, type, message });
    if (type === 'success') {
      setTimeout(() => setFeedback(f => ({ ...f, show: false })), 2500);
    }
  }, []);

  const closeFeedback = useCallback(() => {
    setFeedback(f => ({ ...f, show: false }));
  }, []);

  // AUTH
  const login = useCallback((password) => {
    if (password === adminPassword) {
      setIsLoggedIn(true);
      setLoginError('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`admin_logged_in_${slug}`, 'true');
      }
      return true;
    }
    setLoginError('Falsches Passwort');
    return false;
  }, [adminPassword, slug]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`admin_logged_in_${slug}`);
    }
  }, [slug]);

  // ACTIONS
  const changeStatus = useCallback(async (newStatus) => {
    try {
      await updateProjectStatus(projectId, newStatus);
      setCurrentStatus(newStatus);
      showFeedback('success', `Status auf "${newStatus}" geändert`);
    } catch (e) {
      showFeedback('error', 'Status konnte nicht geändert werden');
    }
  }, [projectId, showFeedback]);

  // "Alle Daten eingetragen" - Status auf ready_for_review setzen
  const markAsDataReady = useCallback(async () => {
    try {
      const result = await submitDataReady(projectId);
      if (result.success) {
        setCurrentStatus('ready_for_review');
        showFeedback('success', 'Vielen Dank! Wir wurden benachrichtigt und werden eure Seite finalisieren.');
        return true;
      } else {
        showFeedback('error', 'Fehler beim Absenden. Bitte versuche es erneut.');
        return false;
      }
    } catch (e) {
      console.error('markAsDataReady error:', e);
      showFeedback('error', 'Fehler beim Absenden');
      return false;
    }
  }, [projectId, showFeedback]);

  const approveGuestbook = useCallback(async (id, approved) => {
    try {
      await approveGuestbookEntry(id, approved);
      await loadData();
      showFeedback('success', approved ? 'Freigegeben' : 'Ausgeblendet');
    } catch (e) {
      showFeedback('error', 'Fehler');
    }
  }, [loadData, showFeedback]);

  const deleteGuestbook = useCallback(async (id) => {
    if (!window.confirm('Eintrag wirklich löschen?')) return;
    try {
      await deleteGuestbookEntry(id);
      await loadData();
      showFeedback('success', 'Gelöscht');
    } catch (e) {
      showFeedback('error', 'Fehler');
    }
  }, [loadData, showFeedback]);

  const deleteMusic = useCallback(async (id) => {
    if (!window.confirm('Wunsch wirklich löschen?')) return;
    try {
      await deleteMusicWish(id);
      await loadData();
      showFeedback('success', 'Gelöscht');
    } catch (e) {
      showFeedback('error', 'Fehler');
    }
  }, [loadData, showFeedback]);

  const approvePhoto = useCallback(async (id, approved) => {
    try {
      await approvePhotoUpload(id, approved);
      await loadData();
      showFeedback('success', approved ? 'Freigegeben' : 'Ausgeblendet');
    } catch (e) {
      showFeedback('error', 'Fehler');
    }
  }, [loadData, showFeedback]);

  const deletePhoto = useCallback(async (id, skipConfirm = false) => {
    if (!skipConfirm && !window.confirm('Foto wirklich löschen?')) return;
    try {
      await deletePhotoUpload(id);
      await loadData();
      if (!skipConfirm) showFeedback('success', 'Gelöscht');
    } catch (e) {
      showFeedback('error', 'Fehler');
    }
  }, [loadData, showFeedback]);

  const togglePhotoSelection = useCallback((id) => {
    setSelectedPhotos(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAllPhotos = useCallback(() => {
    setSelectedPhotos(new Set(photoUploads.map(p => p.id)));
  }, [photoUploads]);

  const deselectAllPhotos = useCallback(() => {
    setSelectedPhotos(new Set());
  }, []);

  // CONTENT EDITING
  const updateContent = useCallback((section, data) => {
    setContentStates(prev => ({ ...prev, [section]: data }));
  }, []);

  const saveContent = useCallback(async (section) => {
    if (!projectId) {
      showFeedback('error', 'Projekt nicht gefunden');
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await updateProjectContent(projectId, section, contentStates[section]);
      
      if (error) {
        console.error('Save error:', error);
        showFeedback('error', 'Fehler beim Speichern: ' + error.message);
      } else {
        showFeedback('success', 'Gespeichert!');
        // Note: refetch removed - it caused a full re-mount which reset activeTab
        // The wedding frontend will load fresh data on next page load
      }
    } catch (e) {
      console.error('Save error:', e);
      showFeedback('error', 'Fehler beim Speichern');
    }
    setIsSaving(false);
  }, [projectId, contentStates, showFeedback]);

  // EXPORT CSV
  const exportCSV = useCallback((data, filename) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // STATS
  const stats = {
    confirmed: rsvpData.filter(r => r.attending).length,
    declined: rsvpData.filter(r => !r.attending).length,
    totalGuests: rsvpData.filter(r => r.attending).reduce((sum, r) => sum + (r.persons || 1), 0),
    pendingGuestbook: guestbookEntries.filter(e => !e.approved).length,
    pendingPhotos: photoUploads.filter(p => !p.approved).length,
    totalRsvp: rsvpData.length,
    totalGuestbook: guestbookEntries.length,
    totalMusic: musicWishes.length,
    totalPhotos: photoUploads.length,
  };

  // NAV ITEMS
  const checkActive = useCallback((name) => {
    if (!isComponentActive) return true;
    return isComponentActive(name);
  }, [isComponentActive]);

  const navItems = [
    { section: 'Übersicht', items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' }
    ]},
    { section: 'Gäste', items: [
      checkActive('rsvp') && { id: 'rsvp', label: 'RSVP', icon: '✉️', badge: stats.totalRsvp },
      checkActive('guestbook') && { id: 'guestbook', label: 'Gästebuch', icon: '📝', badge: stats.pendingGuestbook, warning: true },
      checkActive('musicwishes') && { id: 'music', label: 'Musik', icon: '🎵', badge: stats.totalMusic },
      checkActive('photoupload') && { id: 'photos', label: 'Fotos', icon: '📷', badge: stats.totalPhotos },
    ].filter(Boolean)},
    { section: 'Inhalte', items: [
      { id: 'edit-hero', label: 'Hero', icon: '🖼️' },
      checkActive('countdown') && { id: 'edit-countdown', label: 'Countdown', icon: '⏰' },
      checkActive('lovestory') && { id: 'edit-lovestory', label: 'Love Story', icon: '💕' },
      checkActive('timeline') && { id: 'edit-timeline', label: 'Ablauf', icon: '📅' },
      checkActive('locations') && { id: 'edit-locations', label: 'Locations', icon: '📍' },
      checkActive('directions') && { id: 'edit-directions', label: 'Anfahrt', icon: '🚗' },
      checkActive('accommodations') && { id: 'edit-hotels', label: 'Hotels', icon: '🏨' },
      checkActive('dresscode') && { id: 'edit-dresscode', label: 'Dresscode', icon: '👔' },
      checkActive('rsvp') && { id: 'edit-rsvp', label: 'RSVP Text', icon: '✏️' },
      checkActive('gifts') && { id: 'edit-gifts', label: 'Geschenke', icon: '🎁' },
      checkActive('gallery') && { id: 'edit-gallery', label: 'Galerie', icon: '🎨' },
      checkActive('faq') && { id: 'edit-faq', label: 'FAQ', icon: '❓' },
      checkActive('weddingabc') && { id: 'edit-abc', label: 'ABC', icon: '🔤' },
      checkActive('witnesses') && { id: 'edit-witnesses', label: 'Trauzeugen', icon: '👫' },
      checkActive('contact') && { id: 'edit-contact', label: 'Kontakt', icon: '📧' },
      { id: 'edit-footer', label: 'Footer', icon: '📝' },
    ].filter(Boolean)},
    { section: 'Seiten-Varianten', items: [
      hasSaveTheDate && { id: 'edit-savethedate', label: 'Save the Date', icon: '💌' },
      hasArchive && { id: 'edit-archive', label: 'Archiv', icon: '📦' },
    ].filter(Boolean)},
    { section: 'Einstellungen', items: [
      { id: 'settings', label: 'Einstellungen', icon: '⚙️' },
      { id: 'status', label: 'Status', icon: '🔄' }
    ]},
  ].filter(s => s.items.length > 0);

  const value = {
    // Wedding Context
    project, projectId, coupleNames, slug,
    
    // Auth
    isLoggedIn, loginError, login, logout,
    
    // Navigation
    activeTab, setActiveTab, sidebarOpen, setSidebarOpen, navItems,
    
    // Loading
    isLoading, isSaving,
    
    // Data
    rsvpData, guestbookEntries, musicWishes, photoUploads,
    selectedPhotos, searchTerm, setSearchTerm,
    loadData,
    
    // Stats
    stats,
    
    // Status
    currentStatus, changeStatus, markAsDataReady,
    
    // Actions
    approveGuestbook, deleteGuestbook,
    deleteMusic,
    approvePhoto, deletePhoto,
    togglePhotoSelection, selectAllPhotos, deselectAllPhotos,
    exportCSV,
    
    // Content
    contentStates, updateContent, saveContent,
    
    // Feedback
    feedback, showFeedback, closeFeedback,
    
    // Config
    cloudName, uploadPreset, baseFolder,
    cloudinaryConfigured: !!(cloudName && uploadPreset),
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}

export default AdminContext;
