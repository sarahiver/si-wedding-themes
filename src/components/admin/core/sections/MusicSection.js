// core/sections/MusicSection.js - Pure Logic
import React from 'react';
import { useAdmin } from '../AdminContext';

function MusicSection({ components: C }) {
  const { musicWishes, deleteMusic, exportCSV } = useAdmin();
  
  return (
    <>
      <C.ActionBar>
        <C.Button onClick={() => exportCSV(musicWishes, 'musikwuensche')}>
          📥 CSV Export
        </C.Button>
      </C.ActionBar>
      
      <C.Panel>
        <C.PanelHeader>
          <C.PanelTitle>Musikwünsche ({musicWishes.length})</C.PanelTitle>
        </C.PanelHeader>
        <C.PanelContent $maxHeight="600px">
          {musicWishes.map(wish => (
            <C.EntryCard key={wish.id}>
              <C.EntryHeader>
                <C.EntryName>🎵 {wish.song_title}</C.EntryName>
                <C.SmallButton $variant="danger" onClick={() => deleteMusic(wish.id)}>
                  ×
                </C.SmallButton>
              </C.EntryHeader>
              <C.EntryContent>
                <strong>{wish.artist}</strong> — von {wish.name}
              </C.EntryContent>
              {wish.message && <C.EntryMeta>„{wish.message}"</C.EntryMeta>}
            </C.EntryCard>
          ))}
          {!musicWishes.length && <C.EmptyState>Keine Musikwünsche</C.EmptyState>}
        </C.PanelContent>
      </C.Panel>
    </>
  );
}

export default MusicSection;
