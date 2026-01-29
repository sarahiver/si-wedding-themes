// core/sections/DashboardSection.js - Pure Logic
import React from 'react';
import { useAdmin } from '../AdminContext';

function DashboardSection({ components: C }) {
  const { stats, rsvpData, cloudinaryConfigured } = useAdmin();
  
  return (
    <>
      <C.StatsGrid>
        <C.StatCard>
          <C.StatNumber>{stats.confirmed}</C.StatNumber>
          <C.StatLabel>Zusagen</C.StatLabel>
        </C.StatCard>
        <C.StatCard>
          <C.StatNumber>{stats.declined}</C.StatNumber>
          <C.StatLabel>Absagen</C.StatLabel>
        </C.StatCard>
        <C.StatCard>
          <C.StatNumber>{stats.totalGuests}</C.StatNumber>
          <C.StatLabel>Gäste</C.StatLabel>
        </C.StatCard>
        <C.StatCard>
          <C.StatNumber>{stats.pendingGuestbook + stats.pendingPhotos}</C.StatNumber>
          <C.StatLabel>Ausstehend</C.StatLabel>
        </C.StatCard>
      </C.StatsGrid>
      
      {!cloudinaryConfigured && (
        <C.AlertBox $type="warning">⚠️ Cloudinary nicht konfiguriert</C.AlertBox>
      )}
      
      <C.Panel>
        <C.PanelHeader>
          <C.PanelTitle>Letzte RSVPs</C.PanelTitle>
        </C.PanelHeader>
        <C.PanelContent>
          {rsvpData.slice(0, 5).map(r => (
            <C.EntryCard key={r.id}>
              <C.EntryHeader>
                <C.EntryName>{r.name}</C.EntryName>
                <C.StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>
                  {r.attending ? 'Zusage' : 'Absage'}
                </C.StatusBadge>
              </C.EntryHeader>
            </C.EntryCard>
          ))}
          {!rsvpData.length && <C.EmptyState>Keine RSVPs</C.EmptyState>}
        </C.PanelContent>
      </C.Panel>
    </>
  );
}

export default DashboardSection;
