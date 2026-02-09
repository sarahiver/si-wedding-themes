// core/sections/GiftsSection.js
// Übersicht aller Geschenk-Reservierungen - merged from DB + Content
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../AdminContext';
import { getGiftReservations, deleteGiftReservation, unreserveGiftByItemId } from '../../../../lib/supabase';

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

const SourceBadge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 600;
  margin-left: 0.5rem;
  background: ${p => p.$source === 'db' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(156, 39, 176, 0.1)'};
  color: ${p => p.$source === 'db' ? '#1976d2' : '#7b1fa2'};
  border: 1px solid ${p => p.$source === 'db' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(156, 39, 176, 0.3)'};
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
  const { projectId, contentStates, updateContent, saveContent, showFeedback } = useAdmin();
  const [dbReservations, setDbReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const giftsContent = contentStates.gifts || {};
  const items = giftsContent.items || [];

  const loadReservations = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const { data, error } = await getGiftReservations(projectId);
      if (error) throw error;
      setDbReservations(data || []);
    } catch (err) {
      console.error('Error loading gift reservations:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Merge both sources into a unified reservation list
  const mergedReservations = (() => {
    const result = [];
    const dbItemIds = new Set();

    // 1. Add all DB reservations
    dbReservations.forEach(r => {
      const item = items.find(i => i.id === r.item_id);
      dbItemIds.add(r.item_id);
      result.push({
        id: r.id,
        itemId: r.item_id,
        itemTitle: item?.title || item?.name || `Geschenk #${r.item_id?.slice(0, 6) || '?'}`,
        itemCost: item?.cost || '',
        reservedBy: r.reserved_by || '',
        email: r.reserved_by_email || '',
        createdAt: r.created_at,
        source: 'db',
      });
    });

    // 2. Add content-only reservations (not already in DB)
    items.forEach((item, index) => {
      if (item.reserved && !dbItemIds.has(item.id)) {
        result.push({
          id: `content-${index}`,
          itemId: item.id,
          itemTitle: item.title || `Geschenk #${index + 1}`,
          itemCost: item.cost || '',
          reservedBy: item.reserved_by || 'Unbekannt',
          email: '',
          createdAt: null,
          source: 'content',
        });
      }
    });

    return result;
  })();

  const reservedCount = mergedReservations.length;
  const totalCount = items.length;
  const availableCount = totalCount - reservedCount;

  const handleRemove = async (reservation) => {
    const label = reservation.reservedBy || 'Unbekannt';
    if (!window.confirm(`Reservierung von "${label}" für "${reservation.itemTitle}" aufheben?`)) return;

    try {
      // Remove from DB if it's a DB reservation
      if (reservation.source === 'db') {
        const { error } = await deleteGiftReservation(reservation.id);
        if (error) throw error;
      }

      // Also clear from content JSON
      const updatedItems = items.map(item => {
        if (item.id === reservation.itemId) {
          return { ...item, reserved: false, reserved_by: '' };
        }
        return item;
      });
      updateContent('gifts', { ...giftsContent, items: updatedItems });

      // Save content to persist the change
      // We need to save after a tick so updateContent has taken effect
      setTimeout(async () => {
        try {
          await saveContent('gifts');
        } catch (e) {
          // Silent - the main feedback is below
        }
      }, 100);

      showFeedback('success', 'Reservierung aufgehoben');
      await loadReservations();
    } catch (err) {
      console.error('Error removing reservation:', err);
      showFeedback('error', 'Fehler beim Aufheben');
    }
  };

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

      {mergedReservations.length === 0 ? (
        <EmptyState>
          Noch keine Reservierungen vorhanden.<br />
          Gäste können Geschenke auf eurer Website reservieren.
        </EmptyState>
      ) : (
        mergedReservations.map(r => (
          <ReservationCard key={r.id}>
            <ItemInfo>
              <ItemTitle>
                {r.itemTitle}
                {r.itemCost && <span style={{ fontWeight: 400, color: '#888', marginLeft: '0.5rem', fontSize: '0.85rem' }}>{r.itemCost}</span>}
                <SourceBadge $source={r.source}>
                  {r.source === 'db' ? 'Gast' : 'Admin'}
                </SourceBadge>
              </ItemTitle>
              <ReservedBy>
                Reserviert von <strong>{r.reservedBy}</strong>
              </ReservedBy>
              {r.email && (
                <ReservedEmail href={`mailto:${r.email}`}>
                  {r.email}
                </ReservedEmail>
              )}
            </ItemInfo>
            {r.createdAt && <DateLabel>{formatDate(r.createdAt)}</DateLabel>}
            <RemoveButton onClick={() => handleRemove(r)}>
              Aufheben
            </RemoveButton>
          </ReservationCard>
        ))
      )}
    </>
  );
}
