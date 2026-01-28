// core/sections/RSVPSection.js - Pure Logic
import React from 'react';
import { useAdmin } from '../AdminContext';

function RSVPSection({ components: C }) {
  const { rsvpData, searchTerm, setSearchTerm, exportCSV } = useAdmin();
  
  const filteredData = rsvpData.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <C.ActionBar>
        <C.SearchInput 
          placeholder="Suchen..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
        <C.Button onClick={() => exportCSV(rsvpData, 'rsvp')}>
          📥 CSV Export
        </C.Button>
      </C.ActionBar>
      
      <C.Panel>
        <C.PanelContent>
          <C.TableWrapper>
            <C.Table>
              <thead>
                <tr>
                  <C.Th>Name</C.Th>
                  <C.Th>E-Mail</C.Th>
                  <C.Th>Personen</C.Th>
                  <C.Th>Status</C.Th>
                  <C.Th>Ernährung</C.Th>
                  <C.Th>Nachricht</C.Th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(r => (
                  <tr key={r.id}>
                    <C.Td><strong>{r.name}</strong></C.Td>
                    <C.Td>{r.email}</C.Td>
                    <C.Td>{r.persons || 1}</C.Td>
                    <C.Td>
                      <C.StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>
                        {r.attending ? 'Zusage' : 'Absage'}
                      </C.StatusBadge>
                    </C.Td>
                    <C.Td>{r.dietary || '-'}</C.Td>
                    <C.Td>{r.message || '-'}</C.Td>
                  </tr>
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
