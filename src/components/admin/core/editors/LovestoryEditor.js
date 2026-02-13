// core/editors/LovestoryEditor.js - Schema-konform + Classic-Modus
import React from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';

function LovestoryEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving, baseFolder, project } = useAdmin();
  const content = contentStates.lovestory || {};
  const update = (field, value) => updateContent('lovestory', { ...content, [field]: value });
  const isClassic = project?.theme === 'classic';

  // ── CLASSIC MODE: 3 Bilder + Fließtext ──────────────
  if (isClassic) {
    return (
      <C.Panel>
        <C.PanelHeader>
          <C.PanelTitle>Love Story bearbeiten</C.PanelTitle>
          <C.Badge>Classic Layout</C.Badge>
        </C.PanelHeader>
        <C.PanelContent>
          <C.FormGroup>
            <C.Label>Untertitel (Eyebrow)</C.Label>
            <C.Input
              value={content.subtitle || ''}
              onChange={(e) => update('subtitle', e.target.value)}
              placeholder="Unsere Geschichte"
            />
          </C.FormGroup>
          <C.FormGroup>
            <C.Label>Titel</C.Label>
            <C.Input
              value={content.title || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Wie alles begann"
            />
          </C.FormGroup>
          <C.FormGroup>
            <C.Label>Text</C.Label>
            <C.TextArea
              value={content.text || ''}
              onChange={(e) => update('text', e.target.value)}
              placeholder="Erzählt eure Geschichte als Fließtext…"
              rows={6}
            />
          </C.FormGroup>
          <C.FormGroup>
            <C.Label>Unterschrift</C.Label>
            <C.Input
              value={content.signature || ''}
              onChange={(e) => update('signature', e.target.value)}
              placeholder="Anna & Max"
            />
          </C.FormGroup>

          <C.Divider />
          <C.SectionLabel>Bilder (3 überlappende Bilder)</C.SectionLabel>
          <C.HelpText>Die drei Bilder werden übereinander gestapelt im Editorial-Stil angezeigt.</C.HelpText>

          <ImageUploader
            components={C}
            image={content.image_back}
            onUpload={(url) => update('image_back', url)}
            folder={`${baseFolder}/lovestory`}
            ratio="3/4"
            label="Großes Bild (hinten links, 58%)"
            maxHeight="150px"
          />
          <ImageUploader
            components={C}
            image={content.image_front}
            onUpload={(url) => update('image_front', url)}
            folder={`${baseFolder}/lovestory`}
            ratio="4/5"
            label="Mittleres Bild (vorne rechts, 50%)"
            maxHeight="150px"
          />
          <ImageUploader
            components={C}
            image={content.image_accent}
            onUpload={(url) => update('image_accent', url)}
            folder={`${baseFolder}/lovestory`}
            ratio="1/1"
            label="Kleines Akzent-Bild (rechts oben, 30%)"
            maxHeight="120px"
          />

          <C.Divider />
          <C.Button onClick={() => saveContent('lovestory')} disabled={isSaving}>
            {isSaving ? 'Speichern...' : '💾 Speichern'}
          </C.Button>
        </C.PanelContent>
      </C.Panel>
    );
  }

  // ── STANDARD MODE: Meilensteine ──────────────
  const renderItem = (item, index, onChange) => (
    <>
      <ImageUploader
        components={C}
        image={item.image}
        onUpload={(url) => onChange('image', url)}
        folder={`${baseFolder}/lovestory`}
        ratio="4/3"
        label="Bild"
        maxHeight="100px"
      />
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
