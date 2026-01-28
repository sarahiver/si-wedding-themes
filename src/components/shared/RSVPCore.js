// src/components/shared/RSVPCore.js
// Core RSVP logic - used by all themes

import { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { submitRSVP } from '../../lib/supabase';

/**
 * useRSVP - Hook for RSVP functionality
 */
export function useRSVP() {
  const { projectId } = useWedding();
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    persons: 1,
    attending: true,
    dietary: '',
    allergies: '',
    songWish: '',
    message: '',
    // Additional fields for companion info
    companionNames: '',
    childrenCount: 0,
    needsTransport: false,
    needsAccommodation: false,
  });

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Bitte gib deinen Namen ein');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Bitte gib deine E-Mail-Adresse ein');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein');
      return false;
    }
    
    if (formData.persons < 1) {
      setError('Mindestens 1 Person erforderlich');
      return false;
    }
    
    return true;
  };

  // Submit RSVP
  const submit = async () => {
    if (!projectId) {
      setError('Projekt nicht gefunden');
      return { success: false };
    }
    
    if (!validateForm()) {
      return { success: false };
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const { data, error: submitError } = await submitRSVP(projectId, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        persons: formData.persons,
        attending: formData.attending,
        dietary: formData.dietary.trim(),
        allergies: formData.allergies.trim(),
        songWish: formData.songWish.trim(),
        message: formData.message.trim(),
      });
      
      if (submitError) throw submitError;
      
      setSubmitted(true);
      return { success: true, data };
      
    } catch (err) {
      console.error('RSVP submit error:', err);
      
      // Handle duplicate email
      if (err.message?.includes('duplicate') || err.code === '23505') {
        setError('Diese E-Mail-Adresse hat bereits geantwortet');
      } else {
        setError('Fehler beim Senden. Bitte versuche es erneut.');
      }
      
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      persons: 1,
      attending: true,
      dietary: '',
      allergies: '',
      songWish: '',
      message: '',
      companionNames: '',
      childrenCount: 0,
      needsTransport: false,
      needsAccommodation: false,
    });
    setError(null);
    setSubmitted(false);
  };

  // Toggle attending status
  const toggleAttending = (attending) => {
    setFormData(prev => ({ ...prev, attending }));
    setError(null);
  };

  // Increment/decrement persons
  const adjustPersons = (delta) => {
    setFormData(prev => ({
      ...prev,
      persons: Math.max(1, Math.min(10, prev.persons + delta)),
    }));
  };

  return {
    // State
    submitting,
    submitted,
    error,
    formData,
    
    // Computed
    isAttending: formData.attending,
    
    // Actions
    updateField,
    toggleAttending,
    adjustPersons,
    submit,
    resetForm,
  };
}

export default useRSVP;
