// core/editors/ABCEditor.js - Alle 26 Buchstaben fix vorgegeben
import React from 'react';
import { useAdmin } from '../AdminContext';
import ImageUploader from './ImageUploader';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function ABCEditor({ components: C }) {
  const { contentStates, updateContentField, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.weddingabc || {};
  const entries = content.entries || [];
  
  const update = (field, value) => updateContentField('weddingabc', field, value);

  // Get entry for a letter
  const getEntry = (letter) => entries.find(e => e.letter === letter) || { letter, word: '', description: '' };
  
  // Update entry for a letter
  const updateEntry = (letter, field, value) => {
    const newEntries = [...entries];
    const existingIndex = newEntries.findIndex(e => e.letter === letter);
    
    if (existingIndex >= 0) {
      newEntries[existingIndex] = { ...newEntries[existingIndex], [field]: value };
    } else {
      newEntries.push({ letter, word: '', description: '', [field]: value });
    }
    
    // Sort alphabetically and filter out empty entries for storage
    const sortedEntries = newEntries
      .filter(e => e.word || e.description)
      .sort((a, b) => a.letter.localeCompare(b.letter));
    
    update('entries', sortedEntries);
  };

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Hochzeits-ABC bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <ImageUploader
          components={C}
          image={content.hero_image}
          onUpload={(url) => update('hero_image', url)}
          folder={`${baseFolder}/weddingabc`}
          ratio="21/9"
          label="Banner-Bild (Vollbreite oben)"
          maxHeight="120px"
        />
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input 
            value={content.title || ''} 
            onChange={(e) => update('title', e.target.value)}
            placeholder="Das Hochzeits-ABC"
          />
        </C.FormGroup>
        
        <C.HelpText style={{ marginBottom: '1.5rem' }}>
          Nur ausgefüllte Buchstaben werden auf der Website angezeigt.
        </C.HelpText>
        
        {ALPHABET.map(letter => {
          const entry = getEntry(letter);
          return (
            <C.ItemCard key={letter} style={{ marginBottom: '0.75rem', padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: entry.word ? '#C41E3A' : 'var(--admin-bg-subtle, rgba(255,255,255,0.05))',
                  color: entry.word ? '#fff' : 'var(--admin-text-subtle, rgba(255,255,255,0.3))',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontFamily: 'Oswald, sans-serif',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  {letter}
                </div>
                <div style={{ flex: 1 }}>
                  <C.Input 
                    value={entry.word || ''} 
                    onChange={(e) => updateEntry(letter, 'word', e.target.value)}
                    placeholder={`Wort für ${letter}...`}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <C.TextArea 
                    value={entry.description || ''} 
                    onChange={(e) => updateEntry(letter, 'description', e.target.value)}
                    placeholder="Erklärung..."
                    style={{ minHeight: '60px' }}
                  />
                </div>
              </div>
            </C.ItemCard>
          );
        })}
        
        <C.Divider />
        <C.Button onClick={() => saveContent('weddingabc')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default ABCEditor;
