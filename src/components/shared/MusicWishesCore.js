// src/components/shared/MusicWishesCore.js
// Core music wishes logic - used by all themes

import { useState, useCallback, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { submitMusicWish, getMusicWishes } from '../../lib/supabase';

/**
 * useMusicWishes - Hook for music wishes functionality
 */
export function useMusicWishes() {
  const { projectId } = useWedding();
  
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    songTitle: '',
    message: '',
  });

  // Load existing wishes
  const loadWishes = useCallback(async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const { data, error: fetchError } = await getMusicWishes(projectId);
      if (fetchError) throw fetchError;
      setWishes(data || []);
    } catch (err) {
      console.error('Error loading music wishes:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Load on mount
  useEffect(() => {
    loadWishes();
  }, [loadWishes]);

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  // Submit new wish
  const submitWish = async () => {
    if (!projectId) {
      setError('Projekt nicht gefunden');
      return { success: false };
    }
    
    if (!formData.name.trim()) {
      setError('Bitte gib deinen Namen ein');
      return { success: false };
    }
    
    if (!formData.artist.trim() || !formData.songTitle.trim()) {
      setError('Bitte gib Künstler und Songtitel ein');
      return { success: false };
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const { data, error: submitError } = await submitMusicWish(projectId, {
        name: formData.name.trim(),
        artist: formData.artist.trim(),
        songTitle: formData.songTitle.trim(),
        message: formData.message.trim(),
      });
      
      if (submitError) throw submitError;
      
      setSuccess(true);
      setFormData({ name: '', artist: '', songTitle: '', message: '' });
      
      // Reload wishes to show the new one
      await loadWishes();
      
      return { success: true, data };
      
    } catch (err) {
      console.error('Music wish submit error:', err);
      setError('Musikwunsch konnte nicht gespeichert werden');
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', artist: '', songTitle: '', message: '' });
    setError(null);
    setSuccess(false);
  };

  return {
    // State
    wishes,
    loading,
    submitting,
    error,
    success,
    formData,
    
    // Actions
    updateField,
    submitWish,
    loadWishes,
    resetForm,
  };
}

export default useMusicWishes;
