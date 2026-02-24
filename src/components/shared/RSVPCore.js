// src/components/shared/RSVPCore.js
// Core RSVP logic - used by all themes

import { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { submitRSVP, checkDuplicateRSVP } from '../../lib/supabase';

/**
 * useRSVP - Hook for RSVP functionality
 */
export function useRSVP() {
  // Get projectId from WeddingContext - handle both real and demo mode
  const weddingContext = useWedding();
  const projectId = weddingContext?.projectId || weddingContext?.project?.id;
  
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
    message: '',
    guests: [],
    companionNames: '',
    childrenCount: 0,
    needsTransport: false,
    needsAccommodation: false,
    customAnswer: '',
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

  // Check if email already submitted for this project
  const checkDuplicateEmail = async (email) => {
    if (!projectId || projectId === 'demo') return false;

    try {
      const result = await checkDuplicateRSVP(projectId, email);
      return result.exists || false;
    } catch {
      return false;
    }
  };

  // Submit RSVP
  const submit = async () => {
    // In demo mode, just simulate success
    if (!projectId || projectId === 'demo') {
      if (!validateForm()) return { success: false };
      
      // Simulate API delay
      setSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitting(false);
      setSubmitted(true);
      return { success: true, data: { demo: true } };
    }
    
    if (!validateForm()) {
      return { success: false };
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Check duplicate BEFORE submitting
      const isDuplicate = await checkDuplicateEmail(formData.email);
      if (isDuplicate) {
        setError('Du hast bereits eine Rückmeldung gegeben.');
        setSubmitting(false);
        return { success: false, error: 'duplicate' };
      }
      
      const { data, error: submitError } = await submitRSVP(projectId, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        persons: formData.persons,
        attending: formData.attending,
        dietary: (formData.dietary || '').trim(),
        allergies: (formData.allergies || '').trim(),
        message: formData.message.trim(),
        guests: formData.guests,
        custom_answer: formData.customAnswer?.trim() || '',
      });
      
      if (submitError) throw submitError;
      
      setSubmitted(true);
      return { success: true, data };
      
    } catch (err) {
      console.error('RSVP submit error:', err);
      
      // Handle duplicate email (fallback if DB constraint catches it)
      if (err.message?.includes('duplicate') || err.code === '23505') {
        setError('Du hast bereits eine Rückmeldung gegeben.');
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
      message: '',
      guests: [],
      companionNames: '',
      childrenCount: 0,
      needsTransport: false,
      needsAccommodation: false,
      customAnswer: '',
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
    projectId,
    
    // Computed
    isAttending: formData.attending,
    isDemo: !projectId || projectId === 'demo',
    
    // Actions
    updateField,
    toggleAttending,
    adjustPersons,
    submit,
    resetForm,
  };
}

export default useRSVP;
