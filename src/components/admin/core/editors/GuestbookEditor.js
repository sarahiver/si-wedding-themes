// core/editors/GuestbookEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';

function GuestbookEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving, baseFolder , project} = useAdmin();
  const content = contentStates.guestbook || {};
  const isClassic = project?.theme === 'classic';
  const update = (field, value) => updateContentField('guestbook', field, value);

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Gästebuch bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Gästebuch"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Beschreibung</C.Label>
          <C.TextArea 
            value={content.description || ''} 
            onChange={(e) => update('description', e.target.value)}
            placeholder="Hinterlasst uns eine Nachricht..."
          />
        </C.FormGroup>
        
        {isClassic && (<>
          <C.SectionLabel>Bild</C.SectionLabel>
          <ImageUploader components={C} image={content.image} onUpload={(url) => update('image', url)} folder={`${baseFolder}/guestbook`} label="Section-Bild" helpText="Vollbild am unteren Rand des Gästebuchs" />
        </>)}

        <C.Divider />
        <C.Button onClick={() => saveContent('guestbook')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default GuestbookEditor;
