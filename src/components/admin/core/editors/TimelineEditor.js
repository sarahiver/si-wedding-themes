// core/editors/TimelineEditor.js - Schema-konform, mit Icon-Picker
import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';

// Kuratierte Hochzeits-Icons nach Kategorien
const ICON_CATEGORIES = [
  {
    label: 'Zeremonie',
    icons: ['💒', '⛪', '💍', '🤵', '👰', '💐', '🕊️', '✨'],
  },
  {
    label: 'Feier',
    icons: ['🥂', '🍾', '🎉', '🥳', '🎊', '🪅', '🎈', '🎆'],
  },
  {
    label: 'Essen & Trinken',
    icons: ['🍽️', '☕', '🍰', '🎂', '🍔', '🍕', '🍷', '🍹'],
  },
  {
    label: 'Musik & Tanz',
    icons: ['💃', '🕺', '🎶', '🎵', '🎤', '🎸', '🎧', '🪩'],
  },
  {
    label: 'Tageszeit & Ort',
    icons: ['☀️', '🌅', '🌙', '⭐', '🌸', '🏰', '🌿', '🌊'],
  },
  {
    label: 'Sonstiges',
    icons: ['📸', '🎁', '💌', '🚗', '✈️', '🧳', '❤️', '🫶'],
  },
];

// Inline Icon Picker Popover
function IconPicker({ value, onChange, components: C }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          padding: '0.6rem 0.8rem',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '4px',
          fontSize: '0.95rem',
          color: 'rgba(255,255,255,0.85)',
          minHeight: '44px',
          transition: 'border-color 0.2s',
        }}
      >
        <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{value || '—'}</span>
        <span style={{
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginLeft: 'auto',
        }}>
          {open ? '▲' : '▼'}
        </span>
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          minWidth: '280px',
          zIndex: 50,
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '6px',
          padding: '0.5rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          maxHeight: '320px',
          overflowY: 'auto',
        }}>
          {/* Kein Icon */}
          <div
            onClick={() => { onChange(''); setOpen(false); }}
            style={{
              padding: '0.4rem 0.6rem',
              marginBottom: '0.4rem',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              borderRadius: '3px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            ✕ Kein Icon
          </div>

          {ICON_CATEGORIES.map((cat) => (
            <div key={cat.label} style={{ marginBottom: '0.35rem' }}>
              <div style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                padding: '0.3rem 0.3rem 0.2rem',
              }}>
                {cat.label}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '2px',
              }}>
                {cat.icons.map((icon) => (
                  <div
                    key={icon}
                    onClick={() => { onChange(icon); setOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      padding: '0.35rem',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      background: value === icon ? 'rgba(255,255,255,0.12)' : 'transparent',
                      border: value === icon ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (value !== icon) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      if (value !== icon) e.currentTarget.style.background = 'transparent';
                    }}
                    title={icon}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineEditor({ components: C }) {
  const { contentStates, updateContent, saveContent, isSaving } = useAdmin();
  const content = contentStates.timeline || {};
  const update = (field, value) => updateContent('timeline', { ...content, [field]: value });

  const renderItem = (item, index, onChange) => (
    <>
      <C.FormRow>
        <C.FormGroup style={{ flex: 1 }}>
          <C.Label>Uhrzeit *</C.Label>
          <C.Input
            value={item.time || ''}
            onChange={(e) => onChange('time', e.target.value)}
            placeholder="14:00"
          />
        </C.FormGroup>
        <C.FormGroup style={{ width: '120px', flexShrink: 0 }}>
          <C.Label>Icon</C.Label>
          <IconPicker
            value={item.icon || ''}
            onChange={(val) => onChange('icon', val)}
            components={C}
          />
        </C.FormGroup>
      </C.FormRow>
      <C.FormGroup>
        <C.Label>Titel *</C.Label>
        <C.Input
          value={item.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Trauung"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Ort</C.Label>
        <C.Input
          value={item.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="Kirche St. Marien"
        />
      </C.FormGroup>
      <C.FormGroup>
        <C.Label>Beschreibung</C.Label>
        <C.TextArea
          value={item.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Details zum Programmpunkt..."
        />
      </C.FormGroup>
    </>
  );

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Tagesablauf bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input
            value={content.title || ''}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Tagesablauf"
          />
        </C.FormGroup>

        <C.SectionLabel>Programmpunkte</C.SectionLabel>
        <ListEditor
          components={C}
          items={content.events || []}
          onItemsChange={(events) => update('events', events)}
          renderItem={renderItem}
          createNewItem={() => ({ time: '', title: '', description: '', icon: '💒', location: '' })}
          addLabel="+ Programmpunkt"
        />

        <C.Divider />
        <C.Button onClick={() => saveContent('timeline')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default TimelineEditor;
