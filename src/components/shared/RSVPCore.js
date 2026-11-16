// src/components/shared/RSVPCore.js
// Core RSVP logic - used by all themes

import { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { submitRSVP, checkDuplicateRSVP } from '../../lib/supabase';

// Standardmeldungen (unverändert). Themes mit Sprachen übergeben eigene Texte.
const DEFAULT_MESSAGES = {
  name: 'Bitte gib deinen Namen ein',
  email: 'Bitte gib deine E-Mail-Adresse ein',
  emailInvalid: 'Bitte gib eine gültige E-Mail-Adresse ein',
  persons: 'Mindestens 1 Person erforderlich',
  personsMax: 'Zu viele Personen für eine Anmeldung',
  childAge: 'Bitte gib das Alter jedes Kindes an (0–17)',
  duplicate: 'Du hast bereits eine Rückmeldung gegeben.',
  generic: 'Fehler beim Senden. Bitte versuche es erneut.',
};

/**
 * useRSVP - Hook for RSVP functionality
 *
 * Ohne Optionen verhält sich der Hook exakt wie bisher. Optionen (alle optional,
 * nur für Projekte mit hinterlegten RSVP-Regeln):
 *   maxPersons  – Obergrenze je Anmeldung (Standard: 10 über die Knöpfe)
 *   childAges   – Kinder brauchen eine Altersangabe 0–17
 *   language    – Sprache der Antwort, wird mitgesendet
 *   messages    – übersetzte Fehlermeldungen
 *   trimEmail   – Leerzeichen um die E-Mail vor der Prüfung entfernen
 */
export function useRSVP(options = {}) {
  const messages = { ...DEFAULT_MESSAGES, ...(options.messages || {}) };
  const maxPersons = Number.isInteger(options.maxPersons) && options.maxPersons > 0 ? options.maxPersons : null;
  // Get projectId from WeddingContext - handle both real and demo mode
  const weddingContext = useWedding();
  const projectId = weddingContext?.projectId || weddingContext?.project?.id;
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  // Maschinenlesbarer Fehler zusätzlich zum Text (z. B. 'duplicate')
  const [errorCode, setErrorCode] = useState(null);
  
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
    setErrorCode(null);
  };

  const failWith = (code, message) => { setError(message); setErrorCode(code); return false; };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) return failWith('name', messages.name);

    const email = options.trimEmail ? formData.email.trim() : formData.email;
    if (!email.trim()) return failWith('email', messages.email);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return failWith('emailInvalid', messages.emailInvalid);

    if (formData.persons < 1) return failWith('persons', messages.persons);

    // Nur mit Regeln: Obergrenze und Kinderalter
    if (maxPersons && formData.persons > maxPersons) return failWith('personsMax', messages.personsMax);
    if (options.childAges) {
      const bad = (formData.guests || []).some(g => g && g.is_child && !(Number.isInteger(g.age) && g.age >= 0 && g.age <= 17));
      if (bad) return failWith('childAge', messages.childAge);
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
        setError(messages.duplicate);
        setErrorCode('duplicate');
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
        // Sprache der Antwort nur mitsenden, wenn das Theme eine vorgibt
        ...(options.language ? { language: options.language } : {}),
      });
      
      if (submitError) throw submitError;
      
      setSubmitted(true);
      return { success: true, data };
      
    } catch (err) {
      console.error('RSVP submit error:', err);
      
      // Handle duplicate email (fallback if DB constraint catches it)
      if (err.message?.includes('duplicate') || err.code === '23505' || err.code === 'duplicate') {
        setError(messages.duplicate);
        setErrorCode('duplicate');
      } else {
        setError(messages.generic);
        setErrorCode(err.code || 'generic');
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
    setErrorCode(null);
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
      persons: Math.max(1, Math.min(maxPersons || 10, prev.persons + delta)),
    }));
  };

  return {
    // State
    submitting,
    submitted,
    error,
    errorCode,
    formData,
    projectId,
    
    // Computed
    isAttending: formData.attending,
    isDemo: !projectId || projectId === 'demo',
    maxPersons: maxPersons || 10,
    
    // Actions
    updateField,
    toggleAttending,
    adjustPersons,
    submit,
    resetForm,
  };
}

export default useRSVP;
