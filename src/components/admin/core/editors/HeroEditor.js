// core/editors/HeroEditor.js - Mit Video-Support und separatem Mobile Background
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';
import MediaUploader from './MediaUploader';

function HeroEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder, project } = useAdmin();
  const content = contentStates.hero || {};
  const update = (field, value) => updateContent('hero', { ...content, [field]: value });

  // Check if this is a theme that supports video backgrounds
  const isVideoTheme = project?.theme === 'video';
  const isClassicTheme = project?.theme === 'classic';

  // State for showing mobile upload option
  const [showMobileUpload, setShowMobileUpload] = useState(
    !!(content.background_media_mobile?.url || content.background_image_mobile)
  );

  // State for classic theme video toggle
  const [useVideo, setUseVideo] = useState(!!content.use_video);

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Hero bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        {/* Desktop Background */}
        <C.SectionLabel style={{ marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>
          Desktop Hintergrund
        </C.SectionLabel>
        
        {isVideoTheme ? (
          <MediaUploader
            components={C}
            media={content.background_media}
            onUpload={(media) => update('background_media', media)}
            folder={baseFolder + '/hero'}
            label="Hintergrund (Video oder Bild)"
            ratio="16/9"
            maxHeight="150px"
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
            maxHeight="150px"
          />
        )}

        {/* Classic Theme: Optional Video Background */}
        {isClassicTheme && (
          <>
            <C.FormGroup style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={useVideo}
                  onChange={(e) => {
                    setUseVideo(e.target.checked);
                    update('use_video', e.target.checked);
                    if (!e.target.checked) {
                      update('background_video', null);
                    }
                  }}
                  style={{ width: '18px', height: '18px', accentColor: '#C41E3A' }}
                />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Hintergrund-Video verwenden</span>
              </label>
              <C.HelpText style={{ marginTop: '0.5rem', marginLeft: '1.75rem' }}>
                Video wird auf Desktop abgespielt, Bild oben dient als Poster/Fallback
              </C.HelpText>
            </C.FormGroup>

            {useVideo && (
              <MediaUploader
                components={C}
                media={content.background_video ? { url: content.background_video, type: 'video' } : null}
                onUpload={(media) => update('background_video', media?.url || null)}
                folder={baseFolder + '/hero'}
                label="Hintergrund-Video"
                ratio="16/9"
                maxHeight="150px"
                allowVideo={true}
              />
            )}
          </>
        )}

        <C.Divider />
        
        {/* Mobile Background Toggle */}
        <C.FormGroup>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showMobileUpload}
              onChange={(e) => {
                setShowMobileUpload(e.target.checked);
                if (!e.target.checked) {
                  // Clear mobile background when disabled
                  if (isVideoTheme) {
                    update('background_media_mobile', null);
                  } else {
                    update('background_image_mobile', null);
                  }
                }
              }}
              style={{ width: '18px', height: '18px', accentColor: '#C41E3A' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Separaten Mobile-Hintergrund verwenden</span>
          </label>
          <C.HelpText style={{ marginTop: '0.5rem', marginLeft: '1.75rem' }}>
            Empfohlen: Hochformat (9:16) für bessere Darstellung auf Smartphones
          </C.HelpText>
        </C.FormGroup>
        
        {/* Mobile Background Upload */}
        {showMobileUpload && (
          <>
            <C.SectionLabel style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>
              Mobile Hintergrund
            </C.SectionLabel>
            
            {isVideoTheme ? (
              <MediaUploader
                components={C}
                media={content.background_media_mobile}
                onUpload={(media) => update('background_media_mobile', media)}
                folder={baseFolder + '/hero/mobile'}
                label="Mobile Hintergrund (Video oder Bild)"
                ratio="9/16"
                maxHeight="200px"
                allowVideo={true}
              />
            ) : (
              <ImageUploader
                components={C}
                image={content.background_image_mobile}
                onUpload={(url) => update('background_image_mobile', url)}
                folder={baseFolder + '/hero/mobile'}
                label="Mobile Hintergrundbild"
                ratio="9/16"
                maxHeight="200px"
              />
            )}
          </>
        )}
        
        <C.Divider />
        
        {/* Text Fields */}
        <C.FormGroup>
          <C.Label>Tagline</C.Label>
          <C.Input 
            value={content.tagline || ''} 
            onChange={(e) => update('tagline', e.target.value)}
            placeholder="Wir heiraten!"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Script-Zeile (unter den Namen)</C.Label>
          <C.Input 
            value={content.script_line || ''} 
            onChange={(e) => update('script_line', e.target.value)}
            placeholder="füreinander bestimmt"
          />
          <C.HelpText>Erscheint in Schreibschrift unter den Namen (z.B. Classic Theme)</C.HelpText>
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
