// core/sections/MusicSection.js - Mit Excel Export und besseren Buttons
import React from 'react';
import { useAdmin } from '../AdminContext';

function MusicSection({ components: C }) {
  const { musicWishes, deleteMusic, showFeedback } = useAdmin();

  // Excel Export
  const exportExcel = () => {
    try {
      const headers = ['Song', 'Künstler', 'Gewünscht von', 'Nachricht', 'Datum'];
      const rows = musicWishes.map(w => [
        w.song_title || '',
        w.artist || '',
        w.name || '',
        w.message || '',
        new Date(w.created_at).toLocaleDateString('de-DE')
      ]);
      
      const csvContent = '\uFEFF' + [headers, ...rows].map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Musikwuensche_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showFeedback('success', 'Export erstellt');
    } catch (e) {
      showFeedback('error', 'Export fehlgeschlagen');
    }
  };
  
  return (
    <>
      <C.ActionBar>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
          {musicWishes.length} Musikwünsche
        </span>
        <C.Button onClick={exportExcel}>📥 Excel Export</C.Button>
      </C.ActionBar>
      
      <C.Panel>
        <C.PanelContent style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {musicWishes.map(wish => (
            <C.EntryCard key={wish.id}>
              <C.EntryHeader>
                <C.EntryName>🎵 {wish.song_title}</C.EntryName>
                <C.SmallButton 
                  onClick={() => deleteMusic(wish.id)}
                  style={{ background: 'transparent', color: '#C41E3A', border: '1px solid #C41E3A' }}
                >
                  🗑 Löschen
                </C.SmallButton>
              </C.EntryHeader>
              <C.EntryContent>
                <strong>{wish.artist}</strong> — gewünscht von {wish.name}
              </C.EntryContent>
              {wish.message && <C.EntryMeta>„{wish.message}"</C.EntryMeta>}
            </C.EntryCard>
          ))}
          {!musicWishes.length && <C.EmptyState>Keine Musikwünsche vorhanden</C.EmptyState>}
        </C.PanelContent>
      </C.Panel>
    </>
  );
}

export default MusicSection;
