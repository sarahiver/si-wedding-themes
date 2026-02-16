// core/editors/FAQEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';

function FAQEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving } = useAdmin();
  const content = contentStates.faq || {};
  const update = (field, value) => updateContentField('faq', field, value);

  const renderItem = (item, index, onChange) => (
    <>
      <C.FormGroup>
        <C.Label>Frage</C.Label>
        <C.Input 
          value={item.question || ''} 
          onChange={(e) => onChange('question', e.target.value)} 
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Antwort</C.Label>
        <C.TextArea 
          value={item.answer || ''} 
          onChange={(e) => onChange('answer', e.target.value)} 
        />
      </C.FormGroup>
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>FAQ bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)} 
          />
        </C.FormGroup>
        
        <C.SectionLabel>Fragen & Antworten</C.SectionLabel>
        <ListEditor 
          components={C} 
          items={content.questions || []} 
          onItemsChange={(questions) => update('questions', questions)} 
          renderItem={renderItem} 
          createNewItem={() => ({ question: '', answer: '' })} 
          addLabel="+ Frage hinzufügen" 
        />
        
        <C.Divider />
        <C.Button onClick={() => saveContent('faq')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default FAQEditor;
