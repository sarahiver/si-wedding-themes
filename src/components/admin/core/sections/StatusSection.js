// core/sections/StatusSection.js - Status-Anzeige + Datum-Eingabe für automatische Umschaltung
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

function StatusSection({ components: C }) {
  const { currentStatus, projectId, coupleNames, project, saveContent, contentStates, updateContent, isSaving } = useAdmin();
  
  // Status-Daten aus content.status (oder direkt aus project)
  const statusData = contentStates?.status || {};
  const [localStdDate, setLocalStdDate] = useState(statusData.std_until || project?.std_until || '');
  const [localArchiveDate, setLocalArchiveDate] = useState(statusData.archive_from || project?.archive_from || '');
  
  const statusInfo = {
    std: { label: 'Save the Date', desc: 'Nur grundlegende Infos sichtbar', color: '#f59e0b' },
    live: { label: 'Live', desc: 'Alle Komponenten aktiv', color: '#10b981' },
    archiv: { label: 'Archiv', desc: 'Nach der Hochzeit', color: '#6366f1' },
  };
  
  const status = statusInfo[currentStatus] || { label: currentStatus, desc: '', color: '#888' };
  
  const handleSaveDates = async () => {
    // Speichere die Daten - diese werden dann vom SuperAdmin ausgelesen
    await updateContent('status', {
      ...statusData,
      std_until: localStdDate,
      archive_from: localArchiveDate,
    });
    await saveContent('status');
  };

  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Website-Status</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        {/* Aktueller Status - groß und deutlich */}
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '12px',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: status.color,
            borderRadius: '20px',
            marginBottom: '1rem'
          }}>
            <span style={{ 
              fontSize: '0.8rem', 
              fontWeight: '700', 
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#fff'
            }}>
              {status.label}
            </span>
          </div>
          <p style={{ 
            color: 'rgba(255,255,255,0.6)', 
            fontSize: '0.9rem',
            marginTop: '0.5rem'
          }}>
            {status.desc}
          </p>
        </div>
        
        {/* Datum-Eingaben für automatische Umschaltung */}
        <C.AlertBox $type="info">
          Tragt hier eure Daten ein - der Status wechselt dann automatisch.
        </C.AlertBox>
        
        <C.FormGroup>
          <C.Label>Save the Date aktiv bis</C.Label>
          <C.Input 
            type="date" 
            value={localStdDate}
            onChange={(e) => setLocalStdDate(e.target.value)}
            style={{ colorScheme: 'dark' }}
          />
          <C.HelpText>Ab diesem Datum wechselt der Status automatisch zu "Live"</C.HelpText>
        </C.FormGroup>
        
        <C.FormGroup>
          <C.Label>Archiv-Modus ab</C.Label>
          <C.Input 
            type="date" 
            value={localArchiveDate}
            onChange={(e) => setLocalArchiveDate(e.target.value)}
            style={{ colorScheme: 'dark' }}
          />
          <C.HelpText>Ab diesem Datum wechselt der Status automatisch zu "Archiv" (z.B. 1 Woche nach der Hochzeit)</C.HelpText>
        </C.FormGroup>
        
        <C.Button onClick={handleSaveDates} disabled={isSaving}>
          {isSaving ? 'Speichern...' : '💾 Daten speichern'}
        </C.Button>
        
        <C.Divider />
        
        {/* Projekt-Infos */}
        <C.InfoRow>
          <C.InfoLabel>Projekt-ID</C.InfoLabel>
          <C.InfoValue>{projectId}</C.InfoValue>
        </C.InfoRow>
        <C.InfoRow>
          <C.InfoLabel>Namen</C.InfoLabel>
          <C.InfoValue>{coupleNames}</C.InfoValue>
        </C.InfoRow>
        {project?.wedding_date && (
          <C.InfoRow>
            <C.InfoLabel>Hochzeitsdatum</C.InfoLabel>
            <C.InfoValue>
              {new Date(project.wedding_date).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </C.InfoValue>
          </C.InfoRow>
        )}
      </C.PanelContent>
    </C.Panel>
  );
}

export default StatusSection;
