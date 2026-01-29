// core/sections/RSVPSection.js - Mit Edit, Delete und Excel Export
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { submitRSVP, updateRSVPResponse, deleteRSVPResponse } from '../../../lib/supabase';

function RSVPSection({ components: C }) {
  const { rsvpData, searchTerm, setSearchTerm, loadData, showFeedback, projectId } = useAdmin();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [newEntry, setNewEntry] = useState({ name: '', email: '', persons: 1, attending: true, dietary: '', allergies: '', message: '' });
  
  const filteredData = rsvpData.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Excel Export
  const exportExcel = async () => {
    try {
      const headers = ['Name', 'E-Mail', 'Personen', 'Status', 'Ernährung', 'Allergien', 'Begleitung', 'Nachricht', 'Datum'];
      const rows = rsvpData.map(r => {
        // Parse guests array if exists
        let guestsInfo = '';
        if (r.guests && Array.isArray(r.guests)) {
          guestsInfo = r.guests
            .filter((g, i) => i > 0 && g.name)
            .map(g => `${g.name}${g.dietary ? ` (${g.dietary})` : ''}${g.allergies ? ` [${g.allergies}]` : ''}`)
            .join(', ');
        }
        
        return [
          r.name || '',
          r.email || '',
          r.persons || 1,
          r.attending ? 'Zusage' : 'Absage',
          r.dietary || '',
          r.allergies || '',
          guestsInfo,
          r.message || '',
          new Date(r.created_at).toLocaleDateString('de-DE')
        ];
      });
      
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
      setNewEntry({ name: '', email: '', persons: 1, attending: true, dietary: '', allergies: '', message: '' });
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

  // Format guests for display
  const formatGuests = (guests) => {
    if (!guests || !Array.isArray(guests)) return null;
    const additionalGuests = guests.filter((g, i) => i > 0 && (g.name || g.dietary || g.allergies));
    if (additionalGuests.length === 0) return null;
    return additionalGuests;
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
              <C.FormGroup style={{ flex: 1 }}>
                <C.Label>Ernährung</C.Label>
                <C.Input value={newEntry.dietary} onChange={e => setNewEntry({...newEntry, dietary: e.target.value})} placeholder="vegetarisch, vegan..." />
              </C.FormGroup>
              <C.FormGroup style={{ flex: 1 }}>
                <C.Label>Allergien</C.Label>
                <C.Input value={newEntry.allergies} onChange={e => setNewEntry({...newEntry, allergies: e.target.value})} placeholder="Nüsse, Laktose..." />
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
          {filteredData.map(r => {
            const guests = formatGuests(r.guests);
            const isExpanded = expandedId === r.id;
            const isEditing = editingId === r.id;
            
            return (
              <div key={r.id} style={{ 
                borderBottom: '1px solid rgba(255,255,255,0.1)', 
                padding: '1rem 0',
                marginBottom: '0.5rem'
              }}>
                {isEditing ? (
                  // Edit Mode
                  <div>
                    <C.FormRow>
                      <C.FormGroup style={{ flex: 2 }}>
                        <C.Label>Name</C.Label>
                        <C.Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                      </C.FormGroup>
                      <C.FormGroup style={{ flex: 2 }}>
                        <C.Label>E-Mail</C.Label>
                        <C.Input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                      </C.FormGroup>
                      <C.FormGroup style={{ flex: 1 }}>
                        <C.Label>Personen</C.Label>
                        <C.Input type="number" min="1" value={editForm.persons} onChange={e => setEditForm({...editForm, persons: parseInt(e.target.value) || 1})} />
                      </C.FormGroup>
                    </C.FormRow>
                    <C.FormRow>
                      <C.FormGroup style={{ flex: 1 }}>
                        <C.Label>Status</C.Label>
                        <C.Select value={editForm.attending ? 'yes' : 'no'} onChange={e => setEditForm({...editForm, attending: e.target.value === 'yes'})}>
                          <option value="yes">Zusage</option>
                          <option value="no">Absage</option>
                        </C.Select>
                      </C.FormGroup>
                      <C.FormGroup style={{ flex: 1 }}>
                        <C.Label>Ernährung</C.Label>
                        <C.Input value={editForm.dietary} onChange={e => setEditForm({...editForm, dietary: e.target.value})} />
                      </C.FormGroup>
                      <C.FormGroup style={{ flex: 1 }}>
                        <C.Label>Allergien</C.Label>
                        <C.Input value={editForm.allergies} onChange={e => setEditForm({...editForm, allergies: e.target.value})} />
                      </C.FormGroup>
                    </C.FormRow>
                    <C.FormGroup>
                      <C.Label>Nachricht</C.Label>
                      <C.TextArea value={editForm.message} onChange={e => setEditForm({...editForm, message: e.target.value})} />
                    </C.FormGroup>
                    <C.ButtonGroup>
                      <C.Button onClick={() => updateRSVP(r.id)}>💾 Speichern</C.Button>
                      <C.SmallButton onClick={() => setEditingId(null)}>Abbrechen</C.SmallButton>
                    </C.ButtonGroup>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          <strong style={{ fontSize: '1.1rem' }}>{r.name}</strong>
                          <C.StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>
                            {r.attending ? 'Zusage' : 'Absage'}
                          </C.StatusBadge>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                            {r.persons || 1} {(r.persons || 1) === 1 ? 'Person' : 'Personen'}
                          </span>
                        </div>
                        {r.email && <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{r.email}</div>}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <C.SmallButton onClick={() => startEdit(r)}>✎ Bearbeiten</C.SmallButton>
                        <C.SmallButton onClick={() => deleteRSVP(r.id)} style={{ color: '#C41E3A' }}>🗑 Löschen</C.SmallButton>
                      </div>
                    </div>
                    
                    {/* Details */}
                    {(r.dietary || r.allergies || r.message || guests) && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                        {r.dietary && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ernährung: </span>
                            <span style={{ color: '#4CAF50' }}>{r.dietary}</span>
                          </div>
                        )}
                        {r.allergies && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Allergien: </span>
                            <span style={{ color: '#FF9800' }}>{r.allergies}</span>
                          </div>
                        )}
                        {r.message && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nachricht: </span>
                            <span style={{ fontStyle: 'italic' }}>"{r.message}"</span>
                          </div>
                        )}
                        
                        {/* Additional Guests */}
                        {guests && guests.length > 0 && (
                          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                              Begleitpersonen ({guests.length})
                            </div>
                            {guests.map((g, i) => (
                              <div key={i} style={{ 
                                display: 'flex', 
                                gap: '1rem', 
                                padding: '0.5rem 0',
                                borderBottom: i < guests.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                fontSize: '0.9rem'
                              }}>
                                <span style={{ fontWeight: '500', minWidth: '120px' }}>{g.name || `Person ${i + 2}`}</span>
                                {g.dietary && <span style={{ color: '#4CAF50' }}>{g.dietary}</span>}
                                {g.allergies && <span style={{ color: '#FF9800' }}>Allergien: {g.allergies}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {!filteredData.length && <C.EmptyState>Keine RSVPs gefunden</C.EmptyState>}
        </C.PanelContent>
      </C.Panel>
    </>
  );
}

export default RSVPSection;
