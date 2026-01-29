// core/editors/FooterEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';

function FooterEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.footer || {};
  const update = (field, value) => updateContent('footer', { ...content, [field]: value });

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Footer bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Tagline</C.Label>
          <C.Input 
            value={content.tagline || ''} 
            onChange={(e) => update('tagline', e.target.value)}
            placeholder="Wir freuen uns auf euch!"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Hashtag</C.Label>
          <C.Input 
            value={content.hashtag || ''} 
            onChange={(e) => update('hashtag', e.target.value)}
            placeholder="#SarahUndIver2026"
          />
        </C.FormGroup>
        
        <C.Divider />
        <C.Button onClick={() => saveContent('footer')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default FooterEditor;
