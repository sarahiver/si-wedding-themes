import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import IconPicker from './IconPicker';
import ImageUploader from './ImageUploader';

function TimelineEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving, baseFolder, project } = useAdmin();
  const theme = project?.theme;
  const showIcon = ['botanical', 'editorial', 'contemporary'].includes(theme);
  const showLocation = ['editorial', 'contemporary', 'neon'].includes(theme);
  const showImage = theme === 'classic';
  const content = contentStates.timeline || {};
  const update = (field, value) => updateContentField('timeline', field, value);

  const renderItem = (item, index, onChange) => (
    <>
      <C.FormRow>
        <C.FormGroup style={{ flex: 1 }}>
          <C.Label>Uhrzeit *</C.Label>
          <C.Input value={item.time || ''} onChange={(e) => onChange('time', e.target.value)} placeholder="14:00" />
        </C.FormGroup>
        {showIcon && (
          <C.FormGroup style={{ width: '120px', flexShrink: 0 }}>
            <C.Label>Icon</C.Label>
            <IconPicker value={item.icon || ''} onChange={(val) => onChange('icon', val)} components={C} />
          </C.FormGroup>
        )}
      </C.FormRow>
      <C.FormGroup>
        <C.Label>Titel *</C.Label>
        <C.Input value={item.title || ''} onChange={(e) => onChange('title', e.target.value)} placeholder="Trauung" />
      </C.FormGroup>
      {showLocation && (
        <C.FormGroup>
          <C.Label>Ort</C.Label>
          <C.Input value={item.location || ''} onChange={(e) => onChange('location', e.target.value)} placeholder="Kirche St. Marien" />
        </C.FormGroup>
      )}
      <C.FormGroup>
        <C.Label>Beschreibung</C.Label>
        <C.TextArea value={item.description || ''} onChange={(e) => onChange('description', e.target.value)} placeholder="Details..." />
      </C.FormGroup>
      {showImage && (
        <ImageUploader
          components={C}
          image={item.image}
          onUpload={(url) => onChange('image', url)}
          label="Hintergrundbild (optional)"
          helpText="Wird als Kachel-Hintergrund angezeigt"
        />
      )}
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Tagesablauf bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} placeholder="Tagesablauf" />
        </C.FormGroup>
        <C.SectionLabel>Programmpunkte</C.SectionLabel>
        <ListEditor components={C} items={content.events || []} onItemsChange={(events) => update('events', events)}
          renderItem={renderItem} createNewItem={() => ({ time: '', title: '', description: '', icon: '💒', location: '', image: '' })} addLabel="+ Programmpunkt" />
        <C.Divider />
        <C.Button onClick={() => saveContent('timeline')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default TimelineEditor;
