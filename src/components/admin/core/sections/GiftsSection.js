// core/sections/GiftsSection.js
// Übersicht aller Geschenk-Reservierungen im Admin-Dashboard
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../AdminContext';
import { getGiftReservations, deleteGiftReservation } from '../../../../lib/supabase';

// ============================================
// STYLED COMPONENTS
// ============================================

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StatPill = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${p => p.$type === 'reserved' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0,0,0,0.05)'};
  color: ${p => p.$type === 'reserved' ? '#2e7d32' : '#666'};
  border: 1px solid ${p => p.$type === 'reserved' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0,0,0,0.1)'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #999;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const ReservationCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  background: #fafafa;
  gap: 1rem;
  flex-wrap: wrap;

  &:last-child { margin-bottom: 0; }

  &:hover {
    border-color: #ddd;
    background: #f5f5f5;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 150px;
`;

const ItemTitle = styled.p`
  font-weight: 600;
  font-size: 0.95rem;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
`;

const ReservedBy = styled.p`
  font-size: 0.85rem;
  color: #555;
`;

const ReservedEmail = styled.a`
  font-size: 0.8rem;
  color: #888;
  text-decoration: none;
  &:hover { color: #C41E3A; text-decoration: underline; }
`;

const DateLabel = styled.span`
  font-size: 0.75rem;
  color: #aaa;
  white-space: nowrap;
`;

const RemoveButton = styled.button`
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.08);
  border: 1px solid rgba(229, 57, 53, 0.2);
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: rgba(229, 57, 53, 0.15);
    border-color: rgba(229, 57, 53, 0.4);
  }
`;

// ============================================
// COMPONENT
// ============================================

export default function GiftsSection({ components: C }) {
  const { projectId, contentStates, showFeedback } = useAdmin();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const giftsContent = contentStates.gifts || {};
  const items = giftsContent.items || [];

  const loadReservations = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const { data, error } = await getGiftReservations(projectId);
      if (error) throw error;
      setReservations(data || []);
    } catch (err) {
      console.error('Error loading gift reservations:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleRemove = async (reservation) => {
    if (!window.confirm(`Reservierung von "${reservation.reserved_by}" aufheben?`)) return;
    try {
      const { error } = await deleteGiftReservation(reservation.id);
      if (error) throw error;
      showFeedback('success', 'Reservierung aufgehoben');
      await loadReservations();
    } catch (err) {
      console.error('Error removing reservation:', err);
      showFeedback('error', 'Fehler beim Aufheben');
    }
  };

  // Match reservations to gift items by item_id
  const enrichedReservations = reservations.map(r => {
    const item = items.find(i => i.id === r.item_id);
    return {
      ...r,
      itemTitle: item?.title || item?.name || `Geschenk #${r.item_id?.slice(0, 6) || '?'}`,
      itemCost: item?.cost || '',
    };
  });

  const reservedCount = reservations.length;
  const totalCount = items.length;
  const availableCount = totalCount - reservedCount;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <EmptyState>Reservierungen werden geladen...</EmptyState>
    );
  }

  return (
    <>
      <Header>
        <Title>🎁 Geschenke-Reservierungen</Title>
        <StatsRow>
          <StatPill $type="reserved">{reservedCount} reserviert</StatPill>
          <StatPill>{availableCount} verfügbar</StatPill>
          <StatPill>{totalCount} gesamt</StatPill>
        </StatsRow>
      </Header>

      {enrichedReservations.length === 0 ? (
        <EmptyState>
          Noch keine Reservierungen vorhanden.<br />
          Gäste können Geschenke auf eurer Website reservieren.
        </EmptyState>
      ) : (
        enrichedReservations.map(r => (
          <ReservationCard key={r.id}>
            <ItemInfo>
              <ItemTitle>
                {r.itemTitle}
                {r.itemCost && <span style={{ fontWeight: 400, color: '#888', marginLeft: '0.5rem', fontSize: '0.85rem' }}>{r.itemCost}</span>}
              </ItemTitle>
              <ReservedBy>
                Reserviert von <strong>{r.reserved_by}</strong>
              </ReservedBy>
              {r.reserved_by_email && (
                <ReservedEmail href={`mailto:${r.reserved_by_email}`}>
                  {r.reserved_by_email}
                </ReservedEmail>
              )}
            </ItemInfo>
            <DateLabel>{formatDate(r.created_at)}</DateLabel>
            <RemoveButton onClick={() => handleRemove(r)}>
              Aufheben
            </RemoveButton>
          </ReservationCard>
        ))
      )}
    </>
  );
}
