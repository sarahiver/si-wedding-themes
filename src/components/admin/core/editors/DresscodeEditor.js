import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function DresscodeEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.dresscode || {};
  const update = (field, value) => updateContentField('dresscode', field, value);

  const renderColorItem = (item, index, onChange) => {
    const hex = typeof item === 'string' ? item : (item?.hex || '#8B9D83');
    const name = typeof item === 'string' ? '' : (item?.name || '');
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
        <C.FormGroup style={{ flex: '0 0 auto' }}>
          <C.Label>Farbe</C.Label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: hex, borderRadius: '6px', border: '2px solid var(--admin-border, rgba(255,255,255,0.3))' }} />
              <input type="color" value={hex} onChange={(e) => onChange({ name, hex: e.target.value })} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary, rgba(255,255,255,0.6))', fontFamily: 'monospace' }}>{hex}</span>
          </div>
        </C.FormGroup>
        <C.FormGroup style={{ flex: 1 }}>
          <C.Label>Name (optional)</C.Label>
          <C.Input value={name} onChange={(e) => onChange({ hex, name: e.target.value })} placeholder="z.B. Salbei" />
        </C.FormGroup>
      </div>
    );
  };

  const renderDoItem = (item, index, onChange) => (
    <C.FormGroup>
      <C.Input value={item || ''} onChange={(e) => onChange(null, e.target.value)} placeholder="z.B. Elegante Abendgarderobe" />
    </C.FormGroup>
  );

  return (
    <C.Panel>
      <C.PanelHeader><C.PanelTitle>Dresscode bearbeiten</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input value={content.title || ''} onChange={(e) => update('title', e.target.value)} placeholder="Dresscode" />
        </C.FormGroup>
        <C.FormGroup>
          <C.Label>Dresscode *</C.Label>
          <C.Input value={content.code || ''} onChange={(e) => update('code', e.target.value)} placeholder="Festlich elegant" />
        </C.FormGroup>
        <C.FormGroup>
          <C.Label>Beschreibung</C.Label>
          <C.TextArea value={content.description || ''} onChange={(e) => update('description', e.target.value)} placeholder="Details..." />
        </C.FormGroup>

        <C.SectionLabel>Bilder</C.SectionLabel>
        <ImageUploader components={C} image={content.image} onUpload={(url) => update('image', url)} folder={`${baseFolder}/dresscode`} label="Hauptbild" helpText="Großes Bild links" />
        <ImageUploader components={C} image={content.accent_image} onUpload={(url) => update('accent_image', url)} folder={`${baseFolder}/dresscode`} label="Akzent-Bild" helpText="Kleines überlappendes Bild" />

        <C.SectionLabel>Farbpalette</C.SectionLabel>
        <ListEditor components={C} items={content.colors || []} onItemsChange={(colors) => update('colors', colors)}
          renderItem={renderColorItem} createNewItem={() => ({ hex: '#8B9D83', name: '' })} addLabel="+ Farbe" />

        <C.SectionLabel>Do's</C.SectionLabel>
        <ListEditor components={C} items={content.dos || []} onItemsChange={(dos) => update('dos', dos)}
          renderItem={renderDoItem} createNewItem={() => ''} addLabel="+ Empfehlung" />

        <C.SectionLabel>Don'ts</C.SectionLabel>
        <ListEditor components={C} items={content.donts || []} onItemsChange={(donts) => update('donts', donts)}
          renderItem={renderDoItem} createNewItem={() => ''} addLabel="+ Don't" />

        <C.Divider />
        <C.Button onClick={() => saveContent('dresscode')} disabled={isSaving}>{isSaving ? 'Speichern...' : '💾 Speichern'}</C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}
export default DresscodeEditor;
