import React from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';

function FooterEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving, baseFolder , project} = useAdmin();
  const content = contentStates.footer || {};
  const isClassic = project?.theme === 'classic';
  const update = (field, value) => updateContentField('footer', field, value);

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Footer bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        {!isClassic && (
          <C.FormGroup>
            <C.Label>Tagline</C.Label>
            <C.Input value={content.tagline || ''} onChange={(e) => update('tagline', e.target.value)} placeholder="Wir freuen uns auf euch!" />
          </C.FormGroup>
        )}
        <C.FormGroup>
          <C.Label>Hashtag</C.Label>
          <C.Input value={content.hashtag || ''} onChange={(e) => update('hashtag', e.target.value)} placeholder="#SarahUndIver2026" />
        </C.FormGroup>

        {isClassic && (<>
          <C.SectionLabel>Bilder</C.SectionLabel>
          <ImageUploader components={C} image={content.image} onUpload={(url) => update('image', url)} folder={`${baseFolder}/footer`} label="Bild links" />
          <ImageUploader components={C} image={content.image2} onUpload={(url) => update('image2', url)} folder={`${baseFolder}/footer`} label="Bild rechts" />
        </>)}

        <C.Divider />
        <C.Button onClick={() => saveContent('footer')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default FooterEditor;
