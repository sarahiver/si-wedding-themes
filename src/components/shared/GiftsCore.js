// src/components/shared/GiftsCore.js
// Core gifts/registry logic - used by all themes

import { useState, useCallback, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { reserveGift, getGiftReservations } from '../../lib/supabase';

/**
 * useGifts - Hook for gift registry functionality
 */
export function useGifts() {
  const { projectId, getContent } = useWedding();
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [formData, setFormData] = useState({
    reservedBy: '',
    email: '',
    message: '',
  });

  // Get gift items from content
  const content = getContent('gifts');
  const items = content.items || [];
  const bankDetails = content.bank_details || '';
  const paypalLink = content.paypal_link || '';
  const registryUrl = content.registry_url || '';

  // Load existing reservations
  const loadReservations = useCallback(async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const { data, error: fetchError } = await getGiftReservations(projectId);
      if (fetchError) throw fetchError;
      setReservations(data || []);
    } catch (err) {
      console.error('Error loading reservations:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Load on mount
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Check if item is reserved
  const isItemReserved = (itemId) => {
    return reservations.some(r => r.item_id === itemId);
  };

  // Get reservation for item
  const getReservation = (itemId) => {
    return reservations.find(r => r.item_id === itemId);
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  // Reserve a gift
  const reserve = async (itemId) => {
    if (!projectId) {
      setError('Projekt nicht gefunden');
      return { success: false };
    }
    
    if (!formData.reservedBy.trim()) {
      setError('Bitte gib deinen Namen ein');
      return { success: false };
    }
    
    // Check if already reserved
    if (isItemReserved(itemId)) {
      setError('Dieses Geschenk wurde bereits reserviert');
      return { success: false };
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const { data, error: submitError } = await reserveGift(
        projectId, 
        itemId, 
        formData.reservedBy.trim()
      );
      
      if (submitError) throw submitError;
      
      setSuccess(true);
      setFormData({ reservedBy: '', email: '', message: '' });
      setSelectedItem(null);
      
      // Reload reservations
      await loadReservations();
      
      return { success: true, data };
      
    } catch (err) {
      console.error('Gift reservation error:', err);
      setError('Reservierung fehlgeschlagen');
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  // Open reservation modal for an item
  const openReservationModal = (item) => {
    setSelectedItem(item);
    setError(null);
    setSuccess(false);
  };

  // Close reservation modal
  const closeReservationModal = () => {
    setSelectedItem(null);
    setFormData({ reservedBy: '', email: '', message: '' });
    setError(null);
    setSuccess(false);
  };

  // Get items with reservation status
  const itemsWithStatus = items.map(item => ({
    ...item,
    isReserved: isItemReserved(item.id),
    reservation: getReservation(item.id),
  }));

  // Stats
  const totalItems = items.length;
  const reservedCount = reservations.length;
  const availableCount = totalItems - reservedCount;

  return {
    // State
    items: itemsWithStatus,
    reservations,
    loading,
    submitting,
    error,
    success,
    formData,
    selectedItem,
    
    // Content
    bankDetails,
    paypalLink,
    registryUrl,
    
    // Stats
    stats: {
      total: totalItems,
      reserved: reservedCount,
      available: availableCount,
    },
    
    // Actions
    updateField,
    reserve,
    isItemReserved,
    openReservationModal,
    closeReservationModal,
    loadReservations,
  };
}

export default useGifts;
