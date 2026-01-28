// src/components/shared/GuestbookCore.js
import { useState, useCallback, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

export function useGuestbook() {
  const weddingContext = useWedding();
  const projectId = weddingContext?.projectId || weddingContext?.project?.id;
  
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

  const isDemo = !projectId || projectId === 'demo';

  const loadEntries = useCallback(async () => {
    if (isDemo) {
      // Demo entries
      setEntries([
        { id: 1, name: 'Maria & Thomas', message: 'Wir freuen uns so sehr für euch! Alles Liebe!', created_at: new Date().toISOString() },
        { id: 2, name: 'Familie Schmidt', message: 'Herzlichen Glückwunsch zur Verlobung!', created_at: new Date().toISOString() },
      ]);
      return;
    }
    
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
  }, [projectId, isDemo]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const submitEntry = async () => {
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
      if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(true);
        setFormData({ name: '', message: '', imageUrl: null });
        return { success: true, data: { demo: true } };
      }
      
      const { data, error: submitError } = await submitGuestbookEntry(projectId, {
        name: formData.name.trim(),
        message: formData.message.trim(),
        imageUrl: formData.imageUrl,
      });
      
      if (submitError) throw submitError;
      
      setSuccess(true);
      setFormData({ name: '', message: '', imageUrl: null });
      return { success: true, data };
      
    } catch (err) {
      console.error('Guestbook submit error:', err);
      setError('Eintrag konnte nicht gespeichert werden');
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', message: '', imageUrl: null });
    setError(null);
    setSuccess(false);
  };

  return {
    entries, loading, submitting, error, success, formData, isDemo,
    updateField, submitEntry, loadEntries, resetForm,
  };
}

export default useGuestbook;
