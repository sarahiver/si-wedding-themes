// core/editors/ABCEditor.js - Schema-konform (WeddingABC)
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';

function ABCEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.weddingabc || {};
  const update = (field, value) => updateContent('weddingabc', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <C.FormRow>
        <C.FormGroup style={{ width: '80px' }}>
          <C.Label>Buchstabe *</C.Label>
          <C.Input 
            value={item.letter || ''} 
            onChange={(e) => onChange('letter', e.target.value.toUpperCase().slice(0, 1))}
            placeholder="A"
            maxLength={1}
            style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}
          />
        </C.FormGroup>
        <C.FormGroup style={{ flex: 1 }}>
          <C.Label>Wort *</C.Label>
          <C.Input 
            value={item.word || ''} 
            onChange={(e) => onChange('word', e.target.value)}
            placeholder="Anreise"
          />
        </C.FormGroup>
      </C.FormRow>
      <C.FormGroup>
        <C.Label>Erklärung *</C.Label>
        <C.TextArea 
          value={item.description || ''} 
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Beschreibung zum Buchstaben..."
        />
      </C.FormGroup>
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Hochzeits-ABC bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Das Hochzeits-ABC"
          />
        </C.FormGroup>
        
        <C.HelpText>Max. 1 Eintrag pro Buchstabe. Buchstaben können leer bleiben.</C.HelpText>
        
        <C.SectionLabel>A-Z Einträge</C.SectionLabel>
        <ListEditor 
          components={C} 
          items={content.entries || []} 
          onItemsChange={(entries) => update('entries', entries)} 
          renderItem={renderItem} 
          createNewItem={() => ({ letter: '', word: '', description: '' })} 
          addLabel="+ Buchstabe"
          maxItems={26}
        />
        
        <C.Divider />
        <C.Button onClick={() => saveContent('weddingabc')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default ABCEditor;
