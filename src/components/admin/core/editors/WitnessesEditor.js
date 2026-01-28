// core/editors/WitnessesEditor.js
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function WitnessesEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.witnesses;
  const update = (field, value) => updateContent('witnesses', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <C.GridRow $cols="1fr 1fr">
        <C.Input value={item.name || ''} onChange={(e) => onChange('name', e.target.value)} placeholder="Name" />
        <C.Input value={item.role || ''} onChange={(e) => onChange('role', e.target.value)} placeholder="Rolle" />
      </C.GridRow>
      <C.GridRow $cols="1fr 1fr">
        <C.Input value={item.phone || ''} onChange={(e) => onChange('phone', e.target.value)} placeholder="Telefon" />
        <C.Input value={item.email || ''} onChange={(e) => onChange('email', e.target.value)} placeholder="E-Mail" />
      </C.GridRow>
      <ImageUploader components={C} image={item.image} onUpload={(url) => onChange('image', url)} folder={`${baseFolder}/witnesses`} ratio="1/1" label="Foto" />
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Trauzeugen bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup><C.Label>Titel</C.Label><C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} /></C.FormGroup>
        <C.SectionLabel>Personen</C.SectionLabel>
        <ListEditor components={C} items={content.witnesses || []} onItemsChange={(witnesses) => update('witnesses', witnesses)} renderItem={renderItem} createNewItem={() => ({ name: '', role: '', phone: '', email: '', image: null })} addLabel="+ Person" />
        <C.Divider />
        <C.Button onClick={() => saveContent('witnesses')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default WitnessesEditor;
