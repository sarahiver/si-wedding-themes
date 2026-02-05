// core/sections/RSVPSection.js - Eine Zeile pro Person, filterbar
import React, { useState, useMemo } from 'react';
import { useAdmin } from '../AdminContext';
import { submitRSVP, updateRSVPResponse, deleteRSVPResponse } from '../../../../lib/supabase';

// Hilfsfunktion: Guests-JSON parsen
function parseGuests(r) {
  if (r.guests && Array.isArray(r.guests)) return r.guests;
  if (typeof r.guests === 'string') {
    try { return JSON.parse(r.guests); } catch { return []; }
  }
  return [];
}

// Hilfsfunktion: RSVP-Daten in flache Zeilen umwandeln (1 Zeile pro Person)
function flattenRsvpData(rsvpData) {
  const rows = [];

  rsvpData.forEach(r => {
    const guests = parseGuests(r);

    // Hauptperson (immer erste Zeile)
    rows.push({
      _rsvpId: r.id,
      _isMain: true,
      _groupSize: r.persons || 1,
      _rawEntry: r,
      name: r.name || '',
      email: r.email || '',
      persons: r.persons || 1,
      attending: r.attending,
      dietary: r.dietary || '',
      allergies: r.allergies || '',
      custom_answer: r.custom_answer || '',
      message: r.message || '',
      created_at: r.created_at,
    });

    // Begleitpersonen (aus guests Array, ab Index 1)
    if (guests.length > 1) {
      guests.slice(1).forEach((guest) => {
        if (guest.name || guest.dietary || guest.allergies) {
          rows.push({
            _rsvpId: r.id,
            _isMain: false,
            _groupSize: 0,
            _rawEntry: r,
            name: guest.name || '',
            email: r.email || '',
            persons: '',
            attending: r.attending,
            dietary: guest.dietary || '',
            allergies: guest.allergies || '',
            custom_answer: '',
            message: '',
            created_at: r.created_at,
          });
        }
      });
    }
  });

  return rows;
}

function RSVPSection({ components: C }) {
  const { rsvpData, searchTerm, setSearchTerm, loadData, showFeedback, projectId } = useAdmin();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ name: '', email: '', persons: 1, attending: true, dietary: '', allergies: '', message: '', custom_answer: '' });
  const [filterDietary, setFilterDietary] = useState('');

  // Flache Zeilen: 1 Zeile pro Person
  const flatRows = useMemo(() => flattenRsvpData(rsvpData), [rsvpData]);

  // Filtern nach Suche und Ernährung
  const filteredRows = useMemo(() => {
    return flatRows.filter(row => {
      const matchesSearch = !searchTerm ||
        row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDietary = !filterDietary ||
        row.dietary?.toLowerCase().includes(filterDietary.toLowerCase());

      return matchesSearch && matchesDietary;
    });
  }, [flatRows, searchTerm, filterDietary]);

  // Alle einzigartigen Ernährungs-Optionen für Filter-Dropdown
  const dietaryOptions = useMemo(() => {
    const set = new Set();
    flatRows.forEach(row => {
      if (row.dietary) {
        row.dietary.split(',').forEach(d => {
          const trimmed = d.trim().toLowerCase();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    return Array.from(set).sort();
  }, [flatRows]);

  // Excel Export - flaches Format (1 Zeile pro Person)
  const exportExcel = async () => {
    try {
      const headers = ['Name', 'E-Mail', 'Personen', 'Status', 'Ernährung', 'Allergien', 'Custom Antwort', 'Nachricht', 'Datum'];

      const exportRows = flatRows.map(row => [
        row.name,
        row.email,
        row._isMain ? (row.persons || 1) : '',
        row.attending ? 'Zusage' : 'Absage',
        row.dietary,
        row.allergies,
        row._isMain ? (row.custom_answer || '') : '',
        row._isMain ? (row.message || '') : '',
        row._isMain ? new Date(row.created_at).toLocaleDateString('de-DE') : '',
      ]);

      const csvContent = '\uFEFF' + [headers, ...exportRows].map(row =>
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RSVP_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showFeedback('success', 'Export erstellt');
    } catch (e) {
      showFeedback('error', 'Export fehlgeschlagen');
    }
  };

  // Delete RSVP
  const deleteRSVP = async (id) => {
    if (!window.confirm('RSVP wirklich löschen? (inkl. aller Begleitpersonen)')) return;
    try {
      const { error } = await deleteRSVPResponse(id);
      if (error) throw error;
      await loadData();
      showFeedback('success', 'Gelöscht');
    } catch (e) {
      console.error('Delete error:', e);
      showFeedback('error', 'Fehler beim Löschen');
    }
  };

  // Update RSVP
  const updateRSVP = async (id) => {
    try {
      const { error } = await updateRSVPResponse(id, editForm);
      if (error) throw error;
      await loadData();
      setEditingId(null);
      showFeedback('success', 'Gespeichert');
    } catch (e) {
      console.error('Update error:', e);
      showFeedback('error', 'Fehler beim Speichern');
    }
  };

  // Add new RSVP
  const addRSVP = async () => {
    if (!newEntry.name) {
      showFeedback('error', 'Name ist erforderlich');
      return;
    }
    try {
      const { error } = await submitRSVP(projectId, newEntry);
      if (error) throw error;
      await loadData();
      setShowAddForm(false);
      setNewEntry({ name: '', email: '', persons: 1, attending: true, dietary: '', allergies: '', message: '', custom_answer: '' });
      showFeedback('success', 'RSVP hinzugefügt');
    } catch (e) {
      console.error('Add error:', e);
      showFeedback('error', 'Fehler beim Hinzufügen');
    }
  };

  const startEdit = (rsvp) => {
    setEditingId(rsvp.id);
    setEditForm({
      name: rsvp.name || '',
      email: rsvp.email || '',
      persons: rsvp.persons || 1,
      attending: rsvp.attending,
      dietary: rsvp.dietary || '',
      allergies: rsvp.allergies || '',
      message: rsvp.message || '',
      custom_answer: rsvp.custom_answer || ''
    });
  };

  // Stats
  const stats = {
    total: rsvpData.length,
    confirmed: rsvpData.filter(r => r.attending).length,
    declined: rsvpData.filter(r => !r.attending).length,
    guests: rsvpData.filter(r => r.attending).reduce((sum, r) => sum + (r.persons || 1), 0)
  };

  return (
    <>
      {/* Stats */}
      <C.StatsGrid style={{ marginBottom: '1.5rem' }}>
        <C.StatCard $index={0}><C.StatNumber $index={0}>{stats.total}</C.StatNumber><C.StatLabel $index={0}>Anmeldungen</C.StatLabel></C.StatCard>
        <C.StatCard $index={1}><C.StatNumber $index={1}>{stats.confirmed}</C.StatNumber><C.StatLabel $index={1}>Zusagen</C.StatLabel></C.StatCard>
        <C.StatCard $index={2}><C.StatNumber $index={2}>{stats.declined}</C.StatNumber><C.StatLabel $index={2}>Absagen</C.StatLabel></C.StatCard>
        <C.StatCard $index={3}><C.StatNumber $index={3}>{stats.guests}</C.StatNumber><C.StatLabel $index={3}>Gäste total</C.StatLabel></C.StatCard>
      </C.StatsGrid>

      <C.ActionBar>
        <C.SearchInput
          placeholder="Name oder E-Mail suchen..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {dietaryOptions.length > 0 && (
          <C.Select
            value={filterDietary}
            onChange={e => setFilterDietary(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="">Alle Ernährung</option>
            {dietaryOptions.map(opt => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </C.Select>
        )}
        <C.Button onClick={() => setShowAddForm(true)}>+ Hinzufügen</C.Button>
        <C.Button onClick={exportExcel}>📥 Excel Export</C.Button>
      </C.ActionBar>

      {/* Add Form */}
      {showAddForm && (
        <C.Panel style={{ marginBottom: '1rem' }}>
          <C.PanelHeader><C.PanelTitle>Neuen RSVP hinzufügen</C.PanelTitle></C.PanelHeader>
          <C.PanelContent>
            <C.FormRow>
              <C.FormGroup style={{ flex: 2 }}>
                <C.Label>Name *</C.Label>
                <C.Input value={newEntry.name} onChange={e => setNewEntry({ ...newEntry, name: e.target.value })} />
              </C.FormGroup>
              <C.FormGroup style={{ flex: 2 }}>
                <C.Label>E-Mail</C.Label>
                <C.Input value={newEntry.email} onChange={e => setNewEntry({ ...newEntry, email: e.target.value })} />
              </C.FormGroup>
              <C.FormGroup style={{ flex: 1 }}>
                <C.Label>Personen</C.Label>
                <C.Input type="number" min="1" value={newEntry.persons} onChange={e => setNewEntry({ ...newEntry, persons: parseInt(e.target.value) || 1 })} />
              </C.FormGroup>
            </C.FormRow>
            <C.FormRow>
              <C.FormGroup style={{ flex: 1 }}>
                <C.Label>Status</C.Label>
                <C.Select value={newEntry.attending ? 'yes' : 'no'} onChange={e => setNewEntry({ ...newEntry, attending: e.target.value === 'yes' })}>
                  <option value="yes">Zusage</option>
                  <option value="no">Absage</option>
                </C.Select>
              </C.FormGroup>
              <C.FormGroup style={{ flex: 1 }}>
                <C.Label>Ernährung</C.Label>
                <C.Input value={newEntry.dietary} onChange={e => setNewEntry({ ...newEntry, dietary: e.target.value })} placeholder="vegetarisch, vegan..." />
              </C.FormGroup>
              <C.FormGroup style={{ flex: 1 }}>
                <C.Label>Allergien</C.Label>
                <C.Input value={newEntry.allergies} onChange={e => setNewEntry({ ...newEntry, allergies: e.target.value })} placeholder="Nüsse, Laktose..." />
              </C.FormGroup>
            </C.FormRow>
            <C.FormGroup>
              <C.Label>Custom Antwort</C.Label>
              <C.Input value={newEntry.custom_answer} onChange={e => setNewEntry({ ...newEntry, custom_answer: e.target.value })} placeholder="Antwort auf eigene Frage" />
            </C.FormGroup>
            <C.FormGroup>
              <C.Label>Nachricht</C.Label>
              <C.TextArea value={newEntry.message} onChange={e => setNewEntry({ ...newEntry, message: e.target.value })} />
            </C.FormGroup>
            <C.ButtonGroup>
              <C.Button onClick={addRSVP}>💾 Speichern</C.Button>
              <C.SmallButton onClick={() => setShowAddForm(false)}>Abbrechen</C.SmallButton>
            </C.ButtonGroup>
          </C.PanelContent>
        </C.Panel>
      )}

      <C.Panel>
        <C.PanelContent>
          <C.TableWrapper>
            <C.Table>
              <thead>
                <tr>
                  <C.Th>Name</C.Th>
                  <C.Th>E-Mail</C.Th>
                  <C.Th>Pers.</C.Th>
                  <C.Th>Status</C.Th>
                  <C.Th>Ernährung</C.Th>
                  <C.Th>Allergien</C.Th>
                  <C.Th>Custom Antwort</C.Th>
                  <C.Th>Nachricht</C.Th>
                  <C.Th>Datum</C.Th>
                  <C.Th style={{ width: '100px' }}>Aktionen</C.Th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => {
                  // Edit-Modus: nur für Hauptperson
                  if (row._isMain && editingId === row._rsvpId) {
                    return (
                      <tr key={`edit-${row._rsvpId}`}>
                        <C.Td><C.Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></C.Td>
                        <C.Td><C.Input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></C.Td>
                        <C.Td><C.Input type="number" style={{ width: '60px' }} value={editForm.persons} onChange={e => setEditForm({ ...editForm, persons: parseInt(e.target.value) || 1 })} /></C.Td>
                        <C.Td>
                          <C.Select value={editForm.attending ? 'yes' : 'no'} onChange={e => setEditForm({ ...editForm, attending: e.target.value === 'yes' })}>
                            <option value="yes">Zusage</option>
                            <option value="no">Absage</option>
                          </C.Select>
                        </C.Td>
                        <C.Td><C.Input value={editForm.dietary} onChange={e => setEditForm({ ...editForm, dietary: e.target.value })} /></C.Td>
                        <C.Td><C.Input value={editForm.allergies} onChange={e => setEditForm({ ...editForm, allergies: e.target.value })} /></C.Td>
                        <C.Td><C.Input value={editForm.custom_answer} onChange={e => setEditForm({ ...editForm, custom_answer: e.target.value })} /></C.Td>
                        <C.Td><C.Input value={editForm.message} onChange={e => setEditForm({ ...editForm, message: e.target.value })} /></C.Td>
                        <C.Td>{new Date(row.created_at).toLocaleDateString('de-DE')}</C.Td>
                        <C.Td>
                          <C.ButtonGroup>
                            <C.SmallButton onClick={() => updateRSVP(row._rsvpId)}>✓</C.SmallButton>
                            <C.SmallButton onClick={() => setEditingId(null)}>✕</C.SmallButton>
                          </C.ButtonGroup>
                        </C.Td>
                      </tr>
                    );
                  }

                  // Begleitperson-Zeile
                  if (!row._isMain) {
                    return (
                      <tr
                        key={`companion-${row._rsvpId}-${idx}`}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          borderLeft: '3px solid rgba(196, 30, 58, 0.3)',
                        }}
                      >
                        <C.Td style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                          ↳ {row.name || 'Begleitung'}
                        </C.Td>
                        <C.Td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{row.email}</C.Td>
                        <C.Td></C.Td>
                        <C.Td>
                          <C.StatusBadge $status={row.attending ? 'confirmed' : 'declined'}>
                            {row.attending ? 'Zusage' : 'Absage'}
                          </C.StatusBadge>
                        </C.Td>
                        <C.Td style={{ fontSize: '0.85rem' }}>{row.dietary || '-'}</C.Td>
                        <C.Td style={{ fontSize: '0.85rem' }}>{row.allergies || '-'}</C.Td>
                        <C.Td></C.Td>
                        <C.Td></C.Td>
                        <C.Td></C.Td>
                        <C.Td></C.Td>
                      </tr>
                    );
                  }

                  // Hauptperson-Zeile
                  return (
                    <tr key={`main-${row._rsvpId}`}>
                      <C.Td>
                        <strong>{row.name}</strong>
                        {row._groupSize > 1 && (
                          <span style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.7rem',
                            background: 'rgba(196, 30, 58, 0.15)',
                            color: '#C41E3A',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '3px',
                            fontWeight: 600,
                          }}>
                            +{row._groupSize - 1}
                          </span>
                        )}
                      </C.Td>
                      <C.Td>{row.email || '-'}</C.Td>
                      <C.Td>{row.persons || 1}</C.Td>
                      <C.Td>
                        <C.StatusBadge $status={row.attending ? 'confirmed' : 'declined'}>
                          {row.attending ? 'Zusage' : 'Absage'}
                        </C.StatusBadge>
                      </C.Td>
                      <C.Td>{row.dietary || '-'}</C.Td>
                      <C.Td>{row.allergies || '-'}</C.Td>
                      <C.Td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.custom_answer || '-'}
                      </C.Td>
                      <C.Td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.message || '-'}
                      </C.Td>
                      <C.Td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                        {new Date(row.created_at).toLocaleDateString('de-DE')}
                      </C.Td>
                      <C.Td>
                        <C.ButtonGroup>
                          <C.SmallButton onClick={() => startEdit(row._rawEntry)}>✎</C.SmallButton>
                          <C.SmallButton onClick={() => deleteRSVP(row._rsvpId)} style={{ color: '#C41E3A' }}>🗑</C.SmallButton>
                        </C.ButtonGroup>
                      </C.Td>
                    </tr>
                  );
                })}
              </tbody>
            </C.Table>
          </C.TableWrapper>
          {!filteredRows.length && <C.EmptyState>Keine RSVPs gefunden</C.EmptyState>}
        </C.PanelContent>
      </C.Panel>
    </>
  );
}

export default RSVPSection;
