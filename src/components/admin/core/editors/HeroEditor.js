// core/editors/HeroEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';

function HeroEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.hero || {};
  const update = (field, value) => updateContent('hero', { ...content, [field]: value });

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Hero bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <ImageUploader
          components={C}
          image={content.background_image}
          onUpload={(url) => update('background_image', url)}
          folder={`${baseFolder}/hero`}
          label="Hintergrundbild"
        />
        
        <C.FormGroup>
          <C.Label>Hintergrundvideo (optional)</C.Label>
          <C.Input 
            value={content.background_video || ''} 
            onChange={(e) => update('background_video', e.target.value)}
            placeholder="Cloudinary Video URL"
          />
          <C.HelpText>Nur für Video-Theme relevant</C.HelpText>
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Tagline</C.Label>
          <C.Input 
            value={content.tagline || ''} 
            onChange={(e) => update('tagline', e.target.value)}
            placeholder="Wir heiraten!"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Ort (kurz)</C.Label>
          <C.Input 
            value={content.location_short || ''} 
            onChange={(e) => update('location_short', e.target.value)}
            placeholder="Hamburg"
          />
        </C.FormGroup>
        
        <C.Divider />
        <C.Button onClick={() => saveContent('hero')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default HeroEditor;
