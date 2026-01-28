// core/editors/LovestoryEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function LovestoryEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.lovestory;
  
  const update = (field, value) => {
    updateContent('lovestory', { ...content, [field]: value });
  };

  const renderItem = (item, index, onChange) => (
    <>
      <C.FormGroup>
        <C.Label>Jahr</C.Label>
        <C.Input 
          value={item.date || ''} 
          onChange={(e) => onChange('date', e.target.value)}
          placeholder="z.B. 2019"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Titel</C.Label>
        <C.Input 
          value={item.title || ''} 
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="z.B. Erstes Date"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Beschreibung</C.Label>
        <C.TextArea 
          value={item.description || ''} 
          onChange={(e) => onChange('description', e.target.value)}
        />
      </C.FormGroup>
      <ImageUploader
        components={C}
        image={item.image}
        onUpload={(url) => onChange('image', url)}
        folder={`${baseFolder}/lovestory`}
        ratio="4/3"
        label="Bild"
      />
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
        
        <C.SectionLabel>Meilensteine</C.SectionLabel>
        
        <ListEditor
          components={C}
          items={content.events || []}
          onItemsChange={(events) => update('events', events)}
          renderItem={renderItem}
          createNewItem={() => ({ date: '', title: '', description: '', image: null })}
          addLabel="+ Meilenstein"
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
