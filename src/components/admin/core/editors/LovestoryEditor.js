// core/editors/LovestoryEditor.js - Schema-konform
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function LovestoryEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder, project } = useAdmin();
  const content = contentStates.lovestory || {};
  const update = (field, value) => updateContent('lovestory', { ...content, [field]: value });
  
  // All themes can use images in lovestory
  const showImages = true;

  const renderItem = (item, index, onChange) => (
    <>
      {showImages && (
        <ImageUploader
          components={C}
          image={item.image}
          onUpload={(url) => onChange('image', url)}
          folder={`${baseFolder}/lovestory`}
          ratio="4/3"
          label="Bild"
          maxHeight="80px"
        />
      )}
      <C.FormGroup>
        <C.Label>Zeitpunkt *</C.Label>
        <C.Input 
          value={item.date || ''} 
          onChange={(e) => onChange('date', e.target.value)}
          placeholder="Juni 2019"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Titel *</C.Label>
        <C.Input 
          value={item.title || ''} 
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Das erste Date"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Beschreibung</C.Label>
        <C.TextArea 
          value={item.description || ''} 
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Erzählt eure Geschichte..."
        />
      </C.FormGroup>
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Love Story bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Unsere Geschichte"
          />
        </C.FormGroup>
        
        <C.SectionLabel>Meilensteine (max. 8)</C.SectionLabel>
        <ListEditor 
          components={C} 
          items={content.events || []} 
          onItemsChange={(events) => update('events', events)} 
          renderItem={renderItem} 
          createNewItem={() => ({ date: '', title: '', description: '', image: '' })} 
          addLabel="+ Meilenstein"
          maxItems={8}
        />
        
        <C.Divider />
        <C.Button onClick={() => saveContent('lovestory')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default LovestoryEditor;
