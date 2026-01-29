// core/editors/HeroEditor.js - Mit Video-Support fuer Video Theme
import React from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';
import MediaUploader from './MediaUploader';

function HeroEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder, project } = useAdmin();
  const content = contentStates.hero || {};
  const update = (field, value) => updateContent('hero', { ...content, [field]: value });

  // Check if this is the video theme
  const isVideoTheme = project?.theme === 'video';

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Hero bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        {isVideoTheme ? (
          <MediaUploader
            components={C}
            media={content.background_media}
            onUpload={(media) => update('background_media', media)}
            folder={baseFolder + '/hero'}
            label="Hintergrund (Video oder Bild)"
            ratio="16/9"
            allowVideo={true}
          />
        ) : (
          <ImageUploader
            components={C}
            image={content.background_image}
            onUpload={(url) => update('background_image', url)}
            folder={baseFolder + '/hero'}
            label="Hintergrundbild"
            ratio="16/9"
          />
        )}
        
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
          {isSaving ? 'Speichern...' : 'Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default HeroEditor;
