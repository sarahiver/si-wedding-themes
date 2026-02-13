// core/editors/GiftsEditor.js - Synced with gift_reservations DB
import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import ListEditor from './ListEditor';
import ImageUploader from './ImageUploader';
import { getGiftReservations, reserveGift, unreserveGiftByItemId } from '../../../../lib/supabase';

function GiftsEditor({ components: C }) {
  const { projectId, contentStates, updateContent, saveContent, isSaving, baseFolder } = useAdmin();
  const content = contentStates.gifts || {};
  const [dbReservations, setDbReservations] = useState([]);

  // Load DB reservations
  const loadDbReservations = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data } = await getGiftReservations(projectId);
      setDbReservations(data || []);
    } catch (e) {
      console.error('Error loading DB reservations:', e);
    }
  }, [projectId]);

  useEffect(() => {
    loadDbReservations();
  }, [loadDbReservations]);

  // Migrate items without IDs
  useEffect(() => {
    const items = content.items || [];
    const needsMigration = items.some(item => !item.id);
    if (needsMigration && items.length > 0) {
      const migratedItems = items.map(item =>
        item.id ? item : { ...item, id: crypto.randomUUID() }
      );
      updateContent('gifts', { ...content, items: migratedItems });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync: check if item is reserved in EITHER source
  const getDbReservation = (itemId) => dbReservations.find(r => r.item_id === itemId);
  const isReservedAnywhere = (item) => {
    if (item.reserved) return true;
    if (getDbReservation(item.id)) return true;
    return false;
  };
  const getReservedBy = (item) => {
    const dbRes = getDbReservation(item.id);
    return dbRes?.reserved_by || item.reserved_by || '';
  };

  const update = (field, value) => updateContent('gifts', { ...content, [field]: value });

  // Toggle reservation - syncs BOTH sources
  const handleToggleReservation = async (index, item, shouldReserve) => {
    const items = [...(content.items || [])];

    if (shouldReserve) {
      // Mark as reserved in content JSON
      items[index] = { ...items[index], reserved: true };
      update('items', items);
    } else {
      // Clear reservation in content JSON
      items[index] = { ...items[index], reserved: false, reserved_by: '' };
      update('items', items);
      // Also remove from DB if exists
      if (getDbReservation(item.id)) {
        try {
          await unreserveGiftByItemId(projectId, item.id);
          await loadDbReservations();
        } catch (e) {
          console.error('Error removing DB reservation:', e);
        }
      }
    }
  };

  // Clear reservation from both sources
  const clearReservation = async (index) => {
    const items = [...(content.items || [])];
    const item = items[index];

    // Clear content JSON
    items[index] = { ...items[index], reserved: false, reserved_by: '' };
    update('items', items);

    // Clear DB
    if (getDbReservation(item.id)) {
      try {
        await unreserveGiftByItemId(projectId, item.id);
        await loadDbReservations();
      } catch (e) {
        console.error('Error removing DB reservation:', e);
      }
    }
  };

  const renderItem = (item, index, onChange) => {
    const reserved = isReservedAnywhere(item);
    const reservedBy = getReservedBy(item);
    const dbRes = getDbReservation(item.id);
    const source = dbRes ? 'Gast (Frontend)' : item.reserved ? 'Manuell (Admin)' : null;

    return (
      <>
        <ImageUploader
          components={C}
          image={item.image}
          onUpload={(url) => onChange('image', url)}
          folder={`${baseFolder}/gifts`}
          ratio="1/1"
          maxHeight="100px"
          label="Bild"
        />
        <C.FormGroup>
          <C.Label>Titel *</C.Label>
          <C.Input
            value={item.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Kaffeemaschine"
          />
        </C.FormGroup>
        <C.FormGroup>
          <C.Label>Beschreibung</C.Label>
          <C.TextArea
            value={item.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Für den perfekten Start in den Tag..."
            style={{ minHeight: '60px' }}
          />
        </C.FormGroup>
        <C.FormGroup>
          <C.Label>Preis (optional)</C.Label>
          <C.Input
            value={item.cost || ''}
            onChange={(e) => onChange('cost', e.target.value)}
            placeholder="350€"
          />
        </C.FormGroup>
        <C.FormGroup>
          <C.Label>Shop-Link (optional)</C.Label>
          <C.Input
            value={item.link || ''}
            onChange={(e) => onChange('link', e.target.value)}
            placeholder="https://amazon.de/..."
          />
        </C.FormGroup>

        {/* Reservierungs-Status - synced across DB + Content */}
        <div style={{
          background: reserved ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255,255,255,0.03)',
          padding: '1rem',
          borderRadius: '8px',
          border: reserved ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(255,255,255,0.1)'
        }}>
          <C.FormGroup style={{ marginBottom: reserved ? '0.75rem' : 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={reserved}
                onChange={(e) => handleToggleReservation(index, item, e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#4CAF50' }}
              />
              <span style={{ color: reserved ? '#4CAF50' : 'rgba(255,255,255,0.7)', fontWeight: reserved ? '600' : '400' }}>
                {reserved ? '✓ Reserviert' : 'Reserviert'}
              </span>
            </label>
          </C.FormGroup>
          {reserved && (
            <>
              {source && (
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                  Quelle: {source}
                  {dbRes?.created_at && ` · ${new Date(dbRes.created_at).toLocaleDateString('de-DE')}`}
                </div>
              )}
              <C.FormGroup style={{ marginBottom: '0.5rem' }}>
                <C.Label>Reserviert von</C.Label>
                <C.Input
                  value={reservedBy}
                  onChange={(e) => onChange('reserved_by', e.target.value)}
                  placeholder="Name des Gastes"
                  readOnly={!!dbRes}
                  style={dbRes ? { opacity: 0.7, cursor: 'default' } : {}}
                />
              </C.FormGroup>
              {dbRes?.reserved_by_email && (
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
                  ✉ {dbRes.reserved_by_email}
                </div>
              )}
              <button
                type="button"
                onClick={() => clearReservation(index)}
                style={{
                  background: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  color: '#f44336',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Reservierung aufheben
              </button>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Geschenke bearbeiten</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.SectionLabel>Section-Bilder</C.SectionLabel>
        <C.HelpText>Dekorative Bilder neben der Geschenkliste (Classic: überlappende Bilder)</C.HelpText>
        <ImageUploader
          components={C}
          image={content.image}
          onUpload={(url) => update('image', url)}
          folder={`${baseFolder}/gifts`}
          ratio="3/4"
          label="Bild 1 (groß, hinten)"
          maxHeight="120px"
        />
        <ImageUploader
          components={C}
          image={content.image2}
          onUpload={(url) => update('image2', url)}
          folder={`${baseFolder}/gifts`}
          ratio="4/5"
          label="Bild 2 (klein, vorne)"
          maxHeight="100px"
        />
        <C.Divider />
        
        <C.FormGroup>
          <C.Label>Titel</C.Label>
          <C.Input
            value={content.title || ''}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Geschenke"
          />
        </C.FormGroup>

        <C.FormGroup>
          <C.Label>Beschreibung</C.Label>
          <C.TextArea
            value={content.description || ''}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Das größte Geschenk ist eure Anwesenheit..."
          />
        </C.FormGroup>

        <C.SectionLabel>Geldgeschenke</C.SectionLabel>
        <C.HelpText style={{ marginBottom: '1rem' }}>
          Bankdaten und/oder PayPal für Geldgeschenke anzeigen.
        </C.HelpText>

        <C.FormGroup>
          <C.Label>Bankverbindung</C.Label>
          <C.TextArea
            value={content.bank_details || ''}
            onChange={(e) => update('bank_details', e.target.value)}
            placeholder="Kontoinhaber: Max & Anna Mustermann
IBAN: DE89 3704 0044 0532 0130 00
BIC: COBADEFFXXX
Bank: Commerzbank
Verwendungszweck: Hochzeitsgeschenk"
            style={{ minHeight: '120px', fontFamily: 'monospace' }}
          />
        </C.FormGroup>

        <C.FormGroup>
          <C.Label>PayPal.me Link</C.Label>
          <C.Input
            value={content.paypal_link || ''}
            onChange={(e) => update('paypal_link', e.target.value)}
            placeholder="https://paypal.me/maxanna"
          />
        </C.FormGroup>

        <C.Divider />

        <C.SectionLabel>Externe Geschenkeliste</C.SectionLabel>
        <C.HelpText style={{ marginBottom: '1rem' }}>
          Link zu einer externen Wunschliste (z.B. Amazon, myToys, etc.)
        </C.HelpText>

        <C.FormGroup>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={content.show_registry || false}
              onChange={(e) => update('show_registry', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#C41E3A' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Link zur externen Geschenkeliste anzeigen</span>
          </label>
        </C.FormGroup>

        {content.show_registry && (
          <C.FormGroup>
            <C.Label>URL der Geschenkeliste</C.Label>
            <C.Input
              value={content.registry_url || ''}
              onChange={(e) => update('registry_url', e.target.value)}
              placeholder="https://www.amazon.de/wedding/..."
            />
          </C.FormGroup>
        )}

        <C.Divider />

        <C.SectionLabel>Wunschliste (max. 20)</C.SectionLabel>
        <C.HelpText style={{ marginBottom: '1rem' }}>
          Füge Geschenkideen hinzu. Gäste können diese dann reservieren.
        </C.HelpText>
        <ListEditor
          components={C}
          items={content.items || []}
          onItemsChange={(items) => update('items', items)}
          renderItem={renderItem}
          createNewItem={() => ({ id: crypto.randomUUID(), title: '', description: '', image: '', cost: '', link: '', reserved: false, reserved_by: '' })}
          addLabel="+ Wunsch hinzufügen"
          maxItems={20}
        />

        <C.Divider />
        <C.Button onClick={() => saveContent('gifts')} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Speichern'}
        </C.Button>
      </C.PanelContent>
    </C.Panel>
  );
}

export default GiftsEditor;
