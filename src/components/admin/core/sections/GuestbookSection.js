// core/sections/GuestbookSection.js - Pure Logic
import React from 'react';
import { useAdmin } from '../AdminContext';

function GuestbookSection({ components: C }) {
  const { guestbookEntries, approveGuestbook, deleteGuestbook } = useAdmin();
  
  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Gästebuch-Einträge ({guestbookEntries.length})</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent $maxHeight="600px">
        {guestbookEntries.map(entry => (
          <C.EntryCard key={entry.id}>
            <C.EntryHeader>
              <C.EntryName>{entry.name}</C.EntryName>
              <C.StatusBadge $status={entry.approved ? 'confirmed' : 'pending'}>
                {entry.approved ? 'Sichtbar' : 'Ausstehend'}
              </C.StatusBadge>
            </C.EntryHeader>
            <C.EntryContent>{entry.message}</C.EntryContent>
            <C.EntryMeta>
              {new Date(entry.created_at).toLocaleDateString('de-DE')}
            </C.EntryMeta>
            <C.EntryActions>
              {!entry.approved && (
                <C.SmallButton $variant="success" onClick={() => approveGuestbook(entry.id, true)}>
                  ✓ Freigeben
                </C.SmallButton>
              )}
              {entry.approved && (
                <C.SmallButton onClick={() => approveGuestbook(entry.id, false)}>
                  Ausblenden
                </C.SmallButton>
              )}
              <C.SmallButton $variant="danger" onClick={() => deleteGuestbook(entry.id)}>
                🗑 Löschen
              </C.SmallButton>
            </C.EntryActions>
          </C.EntryCard>
        ))}
        {!guestbookEntries.length && <C.EmptyState>Keine Einträge</C.EmptyState>}
      </C.PanelContent>
    </C.Panel>
  );
}

export default GuestbookSection;
