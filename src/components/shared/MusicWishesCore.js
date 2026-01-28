// src/components/shared/MusicWishesCore.js
import { useState, useCallback, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { submitMusicWish, getMusicWishes } from '../../lib/supabase';

export function useMusicWishes() {
  const weddingContext = useWedding();
  const projectId = weddingContext?.projectId || weddingContext?.project?.id;
  
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    songTitle: '',
  });

  const isDemo = !projectId || projectId === 'demo';

  const loadWishes = useCallback(async () => {
    if (isDemo) {
      setWishes([
        { id: 1, name: 'Lisa', artist: 'ABBA', song_title: 'Dancing Queen', created_at: new Date().toISOString() },
        { id: 2, name: 'Max', artist: 'Ed Sheeran', song_title: 'Perfect', created_at: new Date().toISOString() },
      ]);
      return;
    }
    
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
  }, [projectId, isDemo]);

  useEffect(() => {
    loadWishes();
  }, [loadWishes]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const submitWish = async () => {
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
      if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(true);
        const newWish = { id: Date.now(), name: formData.name, artist: formData.artist, song_title: formData.songTitle, created_at: new Date().toISOString() };
        setWishes(prev => [newWish, ...prev]);
        setFormData({ name: '', artist: '', songTitle: '' });
        return { success: true, data: { demo: true } };
      }
      
      const { data, error: submitError } = await submitMusicWish(projectId, {
        name: formData.name.trim(),
        artist: formData.artist.trim(),
        songTitle: formData.songTitle.trim(),
      });
      
      if (submitError) throw submitError;
      
      setSuccess(true);
      setFormData({ name: '', artist: '', songTitle: '' });
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

  const resetForm = () => {
    setFormData({ name: '', artist: '', songTitle: '' });
    setError(null);
    setSuccess(false);
  };

  return {
    wishes, loading, submitting, error, success, formData, isDemo,
    updateField, submitWish, loadWishes, resetForm,
  };
}

export default useMusicWishes;
