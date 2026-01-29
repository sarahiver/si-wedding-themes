// core/sections/StatusSection.js - Pure Logic
import React from 'react';
import { useAdmin } from '../AdminContext';

function StatusSection({ components: C }) {
  const { currentStatus, changeStatus, projectId, coupleNames } = useAdmin();
  
  const statusInfo = {
    std: { label: 'Save the Date', desc: 'Nur grundlegende Infos sichtbar' },
    live: { label: 'Live', desc: 'Alle Komponenten aktiv' },
    archiv: { label: 'Archiv', desc: 'Nach der Hochzeit' },
  };
  
  return (
    <C.Panel>
      <C.PanelHeader>
        <C.PanelTitle>Website-Status</C.PanelTitle>
      </C.PanelHeader>
      <C.PanelContent>
        <C.AlertBox $type={currentStatus === 'live' ? 'success' : currentStatus === 'archiv' ? 'info' : 'warning'}>
          Aktueller Status: <strong>{statusInfo[currentStatus]?.label || currentStatus}</strong>
        </C.AlertBox>
        
        <C.StatusDescription>
          <p><strong>Save the Date:</strong> Nur grundlegende Infos sichtbar</p>
          <p><strong>Live:</strong> Alle Komponenten aktiv</p>
          <p><strong>Archiv:</strong> Nach der Hochzeit</p>
        </C.StatusDescription>
        
        <C.ButtonGroup>
          <C.Button 
            onClick={() => changeStatus('std')} 
            $variant={currentStatus === 'std' ? 'primary' : 'secondary'}
          >
            Save the Date
          </C.Button>
          <C.Button 
            onClick={() => changeStatus('live')} 
            $variant={currentStatus === 'live' ? 'primary' : 'secondary'}
          >
            Live
          </C.Button>
          <C.Button 
            onClick={() => changeStatus('archiv')} 
            $variant={currentStatus === 'archiv' ? 'primary' : 'secondary'}
          >
            Archiv
          </C.Button>
        </C.ButtonGroup>
        
        <C.Divider />
        
        <C.InfoRow>
          <C.InfoLabel>Projekt-ID</C.InfoLabel>
          <C.InfoValue>{projectId}</C.InfoValue>
        </C.InfoRow>
        <C.InfoRow>
          <C.InfoLabel>Namen</C.InfoLabel>
          <C.InfoValue>{coupleNames}</C.InfoValue>
        </C.InfoRow>
      </C.PanelContent>
    </C.Panel>
  );
}

export default StatusSection;
