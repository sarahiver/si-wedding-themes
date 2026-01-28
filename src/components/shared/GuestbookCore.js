// src/components/shared/GuestbookCore.js
// Core guestbook logic - used by all themes

import { useState, useCallback, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

/**
 * useGuestbook - Hook for guestbook functionality
 */
export function useGuestbook() {
  const { projectId } = useWedding();
  
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    imageUrl: null,
  });

  // Load approved entries
  const loadEntries = useCallback(async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const { data, error: fetchError } = await getGuestbookEntries(projectId, true);
      if (fetchError) throw fetchError;
      setEntries(data || []);
    } catch (err) {
      console.error('Error loading guestbook:', err);
      setError('Einträge konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Load on mount
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  // Submit new entry
  const submitEntry = async () => {
    if (!projectId) {
      setError('Projekt nicht gefunden');
      return { success: false };
    }
    
    if (!formData.name.trim()) {
      setError('Bitte gib deinen Namen ein');
      return { success: false };
    }
    
    if (!formData.message.trim()) {
      setError('Bitte schreibe eine Nachricht');
      return { success: false };
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const { data, error: submitError } = await submitGuestbookEntry(projectId, {
        name: formData.name.trim(),
        message: formData.message.trim(),
        imageUrl: formData.imageUrl,
      });
      
      if (submitError) throw submitError;
      
      setSuccess(true);
      setFormData({ name: '', message: '', imageUrl: null });
      
      // Note: Entry won't show immediately (needs approval)
      // Optionally reload to show it if auto-approved
      // await loadEntries();
      
      return { success: true, data };
      
    } catch (err) {
      console.error('Guestbook submit error:', err);
      setError('Eintrag konnte nicht gespeichert werden');
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', message: '', imageUrl: null });
    setError(null);
    setSuccess(false);
  };

  return {
    // State
    entries,
    loading,
    submitting,
    error,
    success,
    formData,
    
    // Actions
    updateField,
    submitEntry,
    loadEntries,
    resetForm,
  };
}

export default useGuestbook;
