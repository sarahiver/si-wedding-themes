// core/sections/RSVPSection.js - Mit Edit, Delete und Excel Export
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { submitRSVP, updateRSVPResponse, deleteRSVPResponse } from '../../../lib/supabase';

function RSVPSection({ components: C }) {
  const { rsvpData, searchTerm, setSearchTerm, loadData, showFeedback, projectId } = useAdmin();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ name: '', email: '', persons: 1, attending: true, dietary: '', message: '' });
  
  const filteredData = rsvpData.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Excel Export (XLSX)
  const exportExcel = async () => {
    try {
      // Create CSV with BOM for Excel compatibility
      const headers = ['Name', 'E-Mail', 'Personen', 'Status', 'Ernährung', 'Allergien', 'Nachricht', 'Datum'];
      const rows = rsvpData.map(r => [
        r.name || '',
        r.email || '',
        r.persons || 1,
        r.attending ? 'Zusage' : 'Absage',
        r.dietary || '',
        r.allergies || '',
        r.message || '',
        new Date(r.created_at).toLocaleDateString('de-DE')
      ]);
      
      const csvContent = '\uFEFF' + [headers, ...rows].map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RSVP_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showFeedback('success', 'Export erstellt');
    } catch (e) {
      showFeedback('error', 'Export fehlgeschlagen');
    }
  };

  // Delete RSVP
  const deleteRSVP = async (id) => {
    if (!window.confirm('RSVP wirklich löschen?')) return;
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
      setNewEntry({ name: '', email: '', persons: 1, attending: true, dietary: '', message: '' });
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
      message: rsvp.message || ''
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
        <C.StatCard><C.StatNumber>{stats.total}</C.StatNumber><C.StatLabel>Gesamt</C.StatLabel></C.StatCard>
        <C.StatCard><C.StatNumber>{stats.confirmed}</C.StatNumber><C.StatLabel>Zusagen</C.StatLabel></C.StatCard>
        <C.StatCard><C.StatNumber>{stats.declined}</C.StatNumber><C.StatLabel>Absagen</C.StatLabel></C.StatCard>
        <C.StatCard><C.StatNumber>{stats.guests}</C.StatNumber><C.StatLabel>Gäste</C.StatLabel></C.StatCard>
      </C.StatsGrid>

      <C.ActionBar>
        <C.SearchInput 
          placeholder="Suchen..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
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
                <C.Input value={newEntry.name} onChange={e => setNewEntry({...newEntry, name: e.target.value})} />
              </C.FormGroup>
              <C.FormGroup style={{ flex: 2 }}>
                <C.Label>E-Mail</C.Label>
                <C.Input value={newEntry.email} onChange={e => setNewEntry({...newEntry, email: e.target.value})} />
              </C.FormGroup>
              <C.FormGroup style={{ flex: 1 }}>
                <C.Label>Personen</C.Label>
                <C.Input type="number" min="1" value={newEntry.persons} onChange={e => setNewEntry({...newEntry, persons: parseInt(e.target.value) || 1})} />
              </C.FormGroup>
            </C.FormRow>
            <C.FormRow>
              <C.FormGroup style={{ flex: 1 }}>
                <C.Label>Status</C.Label>
                <C.Select value={newEntry.attending ? 'yes' : 'no'} onChange={e => setNewEntry({...newEntry, attending: e.target.value === 'yes'})}>
                  <option value="yes">Zusage</option>
                  <option value="no">Absage</option>
                </C.Select>
              </C.FormGroup>
              <C.FormGroup style={{ flex: 2 }}>
                <C.Label>Ernährung</C.Label>
                <C.Input value={newEntry.dietary} onChange={e => setNewEntry({...newEntry, dietary: e.target.value})} placeholder="vegetarisch, vegan..." />
              </C.FormGroup>
            </C.FormRow>
            <C.FormGroup>
              <C.Label>Nachricht</C.Label>
              <C.TextArea value={newEntry.message} onChange={e => setNewEntry({...newEntry, message: e.target.value})} />
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
                  <C.Th>Nachricht</C.Th>
                  <C.Th style={{ width: '100px' }}>Aktionen</C.Th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(r => (
                  editingId === r.id ? (
                    <tr key={r.id}>
                      <C.Td><C.Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></C.Td>
                      <C.Td><C.Input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} /></C.Td>
                      <C.Td><C.Input type="number" style={{ width: '60px' }} value={editForm.persons} onChange={e => setEditForm({...editForm, persons: parseInt(e.target.value) || 1})} /></C.Td>
                      <C.Td>
                        <C.Select value={editForm.attending ? 'yes' : 'no'} onChange={e => setEditForm({...editForm, attending: e.target.value === 'yes'})}>
                          <option value="yes">Zusage</option>
                          <option value="no">Absage</option>
                        </C.Select>
                      </C.Td>
                      <C.Td><C.Input value={editForm.dietary} onChange={e => setEditForm({...editForm, dietary: e.target.value})} /></C.Td>
                      <C.Td><C.Input value={editForm.message} onChange={e => setEditForm({...editForm, message: e.target.value})} /></C.Td>
                      <C.Td>
                        <C.ButtonGroup>
                          <C.SmallButton onClick={() => updateRSVP(r.id)}>✓</C.SmallButton>
                          <C.SmallButton onClick={() => setEditingId(null)}>✕</C.SmallButton>
                        </C.ButtonGroup>
                      </C.Td>
                    </tr>
                  ) : (
                    <tr key={r.id}>
                      <C.Td><strong>{r.name}</strong></C.Td>
                      <C.Td>{r.email || '-'}</C.Td>
                      <C.Td>{r.persons || 1}</C.Td>
                      <C.Td>
                        <C.StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>
                          {r.attending ? 'Zusage' : 'Absage'}
                        </C.StatusBadge>
                      </C.Td>
                      <C.Td>{r.dietary || '-'}</C.Td>
                      <C.Td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.message || '-'}</C.Td>
                      <C.Td>
                        <C.ButtonGroup>
                          <C.SmallButton onClick={() => startEdit(r)}>✎</C.SmallButton>
                          <C.SmallButton onClick={() => deleteRSVP(r.id)} style={{ color: '#C41E3A' }}>🗑</C.SmallButton>
                        </C.ButtonGroup>
                      </C.Td>
                    </tr>
                  )
                ))}
              </tbody>
            </C.Table>
          </C.TableWrapper>
          {!filteredData.length && <C.EmptyState>Keine RSVPs gefunden</C.EmptyState>}
        </C.PanelContent>
      </C.Panel>
    </>
  );
}

export default RSVPSection;
