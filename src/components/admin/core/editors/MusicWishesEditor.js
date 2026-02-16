// core/editors/MusicWishesEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';

function MusicWishesEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving } = useAdmin();
  const content = contentStates.musicwishes || {};
  const update = (field, value) => updateContentField('musicwishes', field, value);

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Musikwünsche bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Musikwünsche"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Beschreibung</C.Label>
          <C.TextArea 
            value={content.description || ''} 
            onChange={(e) => update('description', e.target.value)}
            placeholder="Welcher Song bringt euch auf die Tanzfläche?"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Spotify Playlist Link</C.Label>
          <C.Input 
            value={content.spotify_playlist || ''} 
            onChange={(e) => update('spotify_playlist', e.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
          />
        </C.FormGroup>
        
        <C.SectionLabel>Bilder</C.SectionLabel>
        <ImageUploader components={C} image={content.image} onUpload={(url) => update('image', url)} label="Bild 1" helpText="Erstes Bild (hinten, links)" />
        <ImageUploader components={C} image={content.image2} onUpload={(url) => update('image2', url)} label="Bild 2" helpText="Zweites Bild (vorne, rechts)" />

        <C.Divider />
        <C.Button onClick={() => saveContent('musicwishes')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default MusicWishesEditor;
