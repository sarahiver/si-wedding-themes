// core/editors/PhotoUploadEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';

function PhotoUploadEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving, baseFolder , project} = useAdmin();
  const content = contentStates.photoupload || {};
  const isClassic = project?.theme === 'classic';
  const update = (field, value) => updateContentField('photoupload', field, value);

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Foto-Upload bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        {isClassic && (
          <ImageUploader
            components={C}
            image={content.background_image}
            onUpload={(url) => update('background_image', url)}
            folder={`${baseFolder}/photoupload`}
            ratio="21/9"
            label="Hintergrundbild"
            helpText="Vollbild hinter der Upload-Sektion"
            maxHeight="120px"
          />
        )}
        
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Teilt eure Fotos"
          />
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Beschreibung</C.Label>
          <C.TextArea 
            value={content.description || ''} 
            onChange={(e) => update('description', e.target.value)}
            placeholder="Ladet hier eure schönsten Momente hoch..."
          />
        </C.FormGroup>
        
        <C.Divider />
        <C.Button onClick={() => saveContent('photoupload')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default PhotoUploadEditor;
