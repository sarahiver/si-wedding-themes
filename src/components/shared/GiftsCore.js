// src/components/shared/GiftsCore.js
import { useState, useCallback, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { reserveGift, getGiftReservations } from '../../lib/supabase';

export function useGifts() {
  const weddingContext = useWedding();
  const projectId = weddingContext?.projectId || weddingContext?.project?.id;
  const getContent = weddingContext?.getContent;
  
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

  const isDemo = !projectId || projectId === 'demo';
  
  const content = getContent ? getContent('gifts') : {};
  const items = content.items || [];
  const bankDetails = content.bank_details || '';
  const paypalLink = content.paypal_link || '';
  const registryUrl = content.registry_url || '';

  const loadReservations = useCallback(async () => {
    if (isDemo) {
      setReservations([]);
      return;
    }
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
  }, [projectId, isDemo]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const isItemReserved = (itemId) => {
    // Check DB reservations
    if (reservations.some(r => r.item_id === itemId)) return true;
    // Also check content-level reserved flag (set manually in admin editor)
    const item = items.find(i => i.id === itemId);
    if (item?.reserved) return true;
    return false;
  };
  const getReservation = (itemId) => reservations.find(r => r.item_id === itemId);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  // Reserve with internal form data (for modal-based flows)
  const reserve = async (itemId) => {
    if (!formData.reservedBy.trim()) {
      setError('Bitte gib deinen Namen ein');
      return { success: false };
    }

    return await reserveGiftItem(itemId, formData.reservedBy.trim(), formData.email);
  };

  // Reserve with explicit name/email (for direct calls from theme components)
  const reserveGiftItem = async (itemId, name, email = '') => {
    if (!name?.trim()) {
      setError('Bitte gib deinen Namen ein');
      return { success: false };
    }

    if (isItemReserved(itemId)) {
      setError('Dieses Geschenk wurde bereits reserviert');
      return { success: false };
    }

    setSubmitting(true);
    setError(null);

    try {
      if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(true);
        setFormData({ reservedBy: '', email: '', message: '' });
        setSelectedItem(null);
        setReservations(prev => [...prev, { id: Date.now(), item_id: itemId, reserved_by: name }]);
        return { success: true, data: { demo: true } };
      }

      const { data, error: submitError } = await reserveGift(projectId, itemId, name.trim(), email);
      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({ reservedBy: '', email: '', message: '' });
      setSelectedItem(null);
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

  const openReservationModal = (item) => {
    setSelectedItem(item);
    setError(null);
    setSuccess(false);
  };

  const closeReservationModal = () => {
    setSelectedItem(null);
    setFormData({ reservedBy: '', email: '', message: '' });
    setError(null);
    setSuccess(false);
  };

  const itemsWithStatus = items.map(item => ({
    ...item,
    isReserved: isItemReserved(item.id),
    reservation: getReservation(item.id),
    reservedBy: getReservation(item.id)?.reserved_by || item.reserved_by || '',
  }));

  const reservedCount = itemsWithStatus.filter(i => i.isReserved).length;

  return {
    items: itemsWithStatus, reservations, loading, submitting, error, success, formData, selectedItem, isDemo,
    bankDetails, paypalLink, registryUrl,
    stats: { total: items.length, reserved: reservedCount, available: items.length - reservedCount },
    updateField, reserve, reserveGiftItem, isItemReserved, openReservationModal, closeReservationModal, loadReservations,
  };
}

export default useGifts;
