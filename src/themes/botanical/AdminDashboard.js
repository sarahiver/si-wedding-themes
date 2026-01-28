import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { 
  getRSVPResponses, 
  getGuestbookEntries, 
  getMusicWishes,
  getPhotoUploads,
  getGiftReservations,
  approveGuestbookEntry,
  deleteGuestbookEntry,
  approvePhotoUpload,
  deletePhotoUpload,
  deleteMusicWish,
  updateProjectStatus,
  updateProjectContent,
} from '../../lib/supabase';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const sway = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS - LOGIN
// ═══════════════════════════════════════════════════════════════════════════

const LoginPage = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const FloatingLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  opacity: 0.1;
  animation: ${sway} 6s ease-in-out infinite;
  pointer-events: none;
  svg { width: 100%; height: 100%; fill: var(--sage); }
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(45, 59, 45, 0.15);
  animation: ${fadeIn} 0.6s ease;
`;

const LoginTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 400;
  color: var(--forest);
  text-align: center;
  margin-bottom: 0.5rem;
`;

const LoginSubtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginInput = styled.input`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 3px var(--sage-muted);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 1rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover { background: var(--sage-dark); }
`;

const LoginError = styled.p`
  color: #c0392b;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  text-align: center;
  margin-bottom: 1rem;
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS - DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: var(--cream);
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid var(--sage-light);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--forest);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .leaf {
    width: 24px;
    height: 24px;
    fill: var(--sage);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatusBadge = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  background: ${p => {
    switch(p.$status) {
      case 'live': return 'rgba(39, 174, 96, 0.1)';
      case 'std': return 'rgba(52, 152, 219, 0.1)';
      case 'archiv': return 'rgba(149, 165, 166, 0.1)';
      default: return 'rgba(149, 165, 166, 0.1)';
    }
  }};
  color: ${p => {
    switch(p.$status) {
      case 'live': return '#27ae60';
      case 'std': return '#3498db';
      case 'archiv': return '#95a5a6';
      default: return '#95a5a6';
    }
  }};
`;

const LogoutButton = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  background: transparent;
  color: var(--text-light);
  border: 1px solid var(--sage-light);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--sage);
    color: var(--forest);
  }
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

// Stats
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--sage-light);
`;

const StatValue = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 400;
  color: ${p => p.$color || 'var(--forest)'};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: var(--text-light);
`;

// Tabs
const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  background: ${p => p.$active ? 'var(--sage)' : 'white'};
  color: ${p => p.$active ? 'white' : 'var(--text-light)'};
  border: 1px solid ${p => p.$active ? 'var(--sage)' : 'var(--sage-light)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--sage);
    color: ${p => p.$active ? 'white' : 'var(--forest)'};
  }
`;

// Content Panel
const Panel = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid var(--sage-light);
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--sage-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PanelTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--forest);
`;

const PanelActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  background: ${p => p.$primary ? 'var(--sage)' : 'white'};
  color: ${p => p.$primary ? 'white' : 'var(--forest)'};
  border: 1px solid var(--sage);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${p => p.$primary ? 'var(--sage-dark)' : 'var(--sage-muted)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Table
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-light);
  text-align: left;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--sage-light);
`;

const Td = styled.td`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--cream-dark);
  vertical-align: top;
`;

const Badge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  background: ${p => p.$type === 'success' ? 'rgba(39, 174, 96, 0.1)' : p.$type === 'warning' ? 'rgba(241, 196, 15, 0.1)' : 'rgba(192, 57, 43, 0.1)'};
  color: ${p => p.$type === 'success' ? '#27ae60' : p.$type === 'warning' ? '#f39c12' : '#c0392b'};
`;

const SmallButton = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  background: ${p => p.$danger ? 'rgba(192, 57, 43, 0.1)' : 'var(--sage-muted)'};
  color: ${p => p.$danger ? '#c0392b' : 'var(--forest)'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.25rem;
  
  &:hover {
    background: ${p => p.$danger ? 'rgba(192, 57, 43, 0.2)' : 'var(--sage-light)'};
  }
`;

// Photo Grid
const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
`;

const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${p => p.$approved ? 'var(--sage)' : 'var(--sage-light)'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${PhotoCard}:hover & { opacity: 1; }
`;

const PhotoButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${p => p.$approve ? '#27ae60' : '#c0392b'};
  color: white;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover { transform: scale(1.1); }
`;

// Empty State
const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted);
  
  .icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
  p { font-family: 'Lato', sans-serif; }
`;

// Settings
const SettingsSection = styled.div`
  padding: 1.5rem;
`;

const SettingsGroup = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    color: var(--forest);
    margin-bottom: 1rem;
  }
`;

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--cream);
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const SettingsLabel = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
`;

const StatusSelect = styled.select`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--sage-light);
  border-radius: 6px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const LeafSVG = () => (
  <svg viewBox="0 0 24 24" className="leaf">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.97C7.14 20.19 7.64 20.39 8.16 20.56L7.5 22.59L9.4 23.25L10.08 21.2C14.6 22.35 19.67 19.97 22 15.5C22 15.5 18 14 17 8Z"/>
  </svg>
);

function AdminDashboard() {
  const { project, projectId, coupleNames } = useWedding();
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('rsvp');
  const [loading, setLoading] = useState(false);
  
  // Data state
  const [rsvps, setRsvps] = useState([]);
  const [guestbook, setGuestbook] = useState([]);
  const [musicWishes, setMusicWishes] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [giftReservations, setGiftReservations] = useState([]);
  
  // Status
  const [status, setStatus] = useState(project?.status || 'std');
  
  // Modal
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });

  // Password from project or fallback
  const adminPassword = project?.admin_password || project?.settings?.admin_password || 'admin123';

  // Check authentication
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Falsches Passwort');
    }
  };

  // Load all data
  const loadData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    
    try {
      const [rsvpRes, guestbookRes, musicRes, photoRes, giftRes] = await Promise.all([
        getRSVPResponses(projectId),
        getGuestbookEntries(projectId, false),
        getMusicWishes(projectId),
        getPhotoUploads(projectId, false),
        getGiftReservations(projectId),
      ]);
      
      setRsvps(rsvpRes.data || []);
      setGuestbook(guestbookRes.data || []);
      setMusicWishes(musicRes.data || []);
      setPhotos(photoRes.data || []);
      setGiftReservations(giftRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated, loadData]);

  // Stats
  const stats = {
    totalGuests: rsvps.filter(r => r.attending).reduce((sum, r) => sum + (r.persons || 1), 0),
    attending: rsvps.filter(r => r.attending).length,
    declined: rsvps.filter(r => !r.attending).length,
    pendingGuestbook: guestbook.filter(g => !g.approved).length,
    pendingPhotos: photos.filter(p => !p.approved).length,
  };

  // Actions
  const handleApproveGuestbook = async (id, approved) => {
    await approveGuestbookEntry(id, approved);
    setModalState({ isOpen: true, type: 'success', message: approved ? 'Eintrag freigegeben' : 'Eintrag ausgeblendet' });
    loadData();
  };

  const handleDeleteGuestbook = async (id) => {
    if (!window.confirm('Eintrag wirklich löschen?')) return;
    await deleteGuestbookEntry(id);
    setModalState({ isOpen: true, type: 'success', message: 'Eintrag gelöscht' });
    loadData();
  };

  const handleApprovePhoto = async (id, approved) => {
    await approvePhotoUpload(id, approved);
    setModalState({ isOpen: true, type: 'success', message: approved ? 'Foto freigegeben' : 'Foto ausgeblendet' });
    loadData();
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Foto wirklich löschen?')) return;
    await deletePhotoUpload(id);
    setModalState({ isOpen: true, type: 'success', message: 'Foto gelöscht' });
    loadData();
  };

  const handleDeleteMusicWish = async (id) => {
    if (!window.confirm('Musikwunsch wirklich löschen?')) return;
    await deleteMusicWish(id);
    setModalState({ isOpen: true, type: 'success', message: 'Musikwunsch gelöscht' });
    loadData();
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    const { error } = await updateProjectStatus(projectId, newStatus);
    if (error) {
      setModalState({ isOpen: true, type: 'error', message: 'Status konnte nicht geändert werden' });
    } else {
      setModalState({ isOpen: true, type: 'success', message: `Status auf "${newStatus}" geändert` });
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ['Name', 'E-Mail', 'Personen', 'Teilnahme', 'Ernährung', 'Nachricht', 'Datum'];
    const rows = rsvps.map(r => [
      r.name,
      r.email,
      r.persons,
      r.attending ? 'Ja' : 'Nein',
      r.dietary || '',
      r.message || '',
      new Date(r.created_at).toLocaleDateString('de-DE'),
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════════════════════════════════════════

  if (!isAuthenticated) {
    return (
      <LoginPage>
        <FloatingLeaf $size={100} style={{ top: '10%', left: '5%' }}><LeafSVG /></FloatingLeaf>
        <FloatingLeaf $size={70} style={{ bottom: '15%', right: '10%' }}><LeafSVG /></FloatingLeaf>
        
        <LoginCard>
          <LoginTitle>Admin-Bereich</LoginTitle>
          <LoginSubtitle>{coupleNames || 'Hochzeits-Dashboard'}</LoginSubtitle>
          
          <form onSubmit={handleLogin}>
            {authError && <LoginError>{authError}</LoginError>}
            <LoginInput
              type="password"
              placeholder="Passwort eingeben"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <LoginButton type="submit">Anmelden</LoginButton>
          </form>
        </LoginCard>
      </LoginPage>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <LeafSVG />
            {coupleNames || 'Admin'}
          </Logo>
          <HeaderActions>
            <StatusBadge $status={status}>
              {status === 'std' ? 'Save the Date' : status === 'live' ? 'Live' : 'Archiv'}
            </StatusBadge>
            <LogoutButton onClick={() => setIsAuthenticated(false)}>
              Abmelden
            </LogoutButton>
          </HeaderActions>
        </HeaderContent>
      </Header>
      
      <Main>
        {/* Stats */}
        <StatsGrid>
          <StatCard>
            <StatValue $color="var(--sage)">{stats.totalGuests}</StatValue>
            <StatLabel>Gäste gesamt</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $color="#27ae60">{stats.attending}</StatValue>
            <StatLabel>Zusagen</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $color="#c0392b">{stats.declined}</StatValue>
            <StatLabel>Absagen</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $color="#f39c12">{stats.pendingGuestbook + stats.pendingPhotos}</StatValue>
            <StatLabel>Zu prüfen</StatLabel>
          </StatCard>
        </StatsGrid>
        
        {/* Tabs */}
        <TabsContainer>
          <Tab $active={activeTab === 'rsvp'} onClick={() => setActiveTab('rsvp')}>
            RSVP ({rsvps.length})
          </Tab>
          <Tab $active={activeTab === 'guestbook'} onClick={() => setActiveTab('guestbook')}>
            Gästebuch ({guestbook.length})
          </Tab>
          <Tab $active={activeTab === 'music'} onClick={() => setActiveTab('music')}>
            Musik ({musicWishes.length})
          </Tab>
          <Tab $active={activeTab === 'photos'} onClick={() => setActiveTab('photos')}>
            Fotos ({photos.length})
          </Tab>
          <Tab $active={activeTab === 'gifts'} onClick={() => setActiveTab('gifts')}>
            Geschenke ({giftReservations.length})
          </Tab>
          <Tab $active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            Einstellungen
          </Tab>
        </TabsContainer>
        
        {/* Content Panels */}
        <Panel>
          {/* RSVP Tab */}
          {activeTab === 'rsvp' && (
            <>
              <PanelHeader>
                <PanelTitle>RSVP-Antworten</PanelTitle>
                <PanelActions>
                  <ActionButton onClick={loadData}>Aktualisieren</ActionButton>
                  <ActionButton $primary onClick={exportCSV}>CSV Export</ActionButton>
                </PanelActions>
              </PanelHeader>
              
              {rsvps.length === 0 ? (
                <EmptyState>
                  <div className="icon">📋</div>
                  <p>Noch keine Antworten eingegangen</p>
                </EmptyState>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Name</Th>
                        <Th>E-Mail</Th>
                        <Th>Personen</Th>
                        <Th>Status</Th>
                        <Th>Ernährung</Th>
                        <Th>Nachricht</Th>
                        <Th>Datum</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvps.map(rsvp => (
                        <tr key={rsvp.id}>
                          <Td><strong>{rsvp.name}</strong></Td>
                          <Td>{rsvp.email}</Td>
                          <Td>{rsvp.persons}</Td>
                          <Td>
                            <Badge $type={rsvp.attending ? 'success' : 'error'}>
                              {rsvp.attending ? 'Zusage' : 'Absage'}
                            </Badge>
                          </Td>
                          <Td>{rsvp.dietary || '-'}</Td>
                          <Td style={{ maxWidth: '200px' }}>{rsvp.message || '-'}</Td>
                          <Td>{new Date(rsvp.created_at).toLocaleDateString('de-DE')}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
          
          {/* Guestbook Tab */}
          {activeTab === 'guestbook' && (
            <>
              <PanelHeader>
                <PanelTitle>Gästebuch-Einträge</PanelTitle>
                <ActionButton onClick={loadData}>Aktualisieren</ActionButton>
              </PanelHeader>
              
              {guestbook.length === 0 ? (
                <EmptyState>
                  <div className="icon">📖</div>
                  <p>Noch keine Einträge</p>
                </EmptyState>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Name</Th>
                        <Th>Nachricht</Th>
                        <Th>Status</Th>
                        <Th>Datum</Th>
                        <Th>Aktionen</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {guestbook.map(entry => (
                        <tr key={entry.id}>
                          <Td><strong>{entry.name}</strong></Td>
                          <Td style={{ maxWidth: '300px' }}>{entry.message}</Td>
                          <Td>
                            <Badge $type={entry.approved ? 'success' : 'warning'}>
                              {entry.approved ? 'Sichtbar' : 'Ausstehend'}
                            </Badge>
                          </Td>
                          <Td>{new Date(entry.created_at).toLocaleDateString('de-DE')}</Td>
                          <Td>
                            <SmallButton onClick={() => handleApproveGuestbook(entry.id, !entry.approved)}>
                              {entry.approved ? 'Ausblenden' : 'Freigeben'}
                            </SmallButton>
                            <SmallButton $danger onClick={() => handleDeleteGuestbook(entry.id)}>
                              Löschen
                            </SmallButton>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
          
          {/* Music Tab */}
          {activeTab === 'music' && (
            <>
              <PanelHeader>
                <PanelTitle>Musikwünsche</PanelTitle>
                <ActionButton onClick={loadData}>Aktualisieren</ActionButton>
              </PanelHeader>
              
              {musicWishes.length === 0 ? (
                <EmptyState>
                  <div className="icon">🎵</div>
                  <p>Noch keine Musikwünsche</p>
                </EmptyState>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Von</Th>
                        <Th>Künstler</Th>
                        <Th>Song</Th>
                        <Th>Datum</Th>
                        <Th>Aktionen</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {musicWishes.map(wish => (
                        <tr key={wish.id}>
                          <Td>{wish.name}</Td>
                          <Td><strong>{wish.artist}</strong></Td>
                          <Td>{wish.song_title}</Td>
                          <Td>{new Date(wish.created_at).toLocaleDateString('de-DE')}</Td>
                          <Td>
                            <SmallButton $danger onClick={() => handleDeleteMusicWish(wish.id)}>
                              Löschen
                            </SmallButton>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
          
          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <>
              <PanelHeader>
                <PanelTitle>Hochgeladene Fotos</PanelTitle>
                <ActionButton onClick={loadData}>Aktualisieren</ActionButton>
              </PanelHeader>
              
              {photos.length === 0 ? (
                <EmptyState>
                  <div className="icon">📸</div>
                  <p>Noch keine Fotos hochgeladen</p>
                </EmptyState>
              ) : (
                <PhotoGrid>
                  {photos.map(photo => (
                    <PhotoCard key={photo.id} $approved={photo.approved}>
                      <img src={photo.cloudinary_url} alt="" />
                      <PhotoOverlay>
                        <PhotoButton 
                          $approve 
                          onClick={() => handleApprovePhoto(photo.id, !photo.approved)}
                          title={photo.approved ? 'Ausblenden' : 'Freigeben'}
                        >
                          {photo.approved ? '👁️' : '✓'}
                        </PhotoButton>
                        <PhotoButton 
                          onClick={() => handleDeletePhoto(photo.id)}
                          title="Löschen"
                        >
                          ×
                        </PhotoButton>
                      </PhotoOverlay>
                    </PhotoCard>
                  ))}
                </PhotoGrid>
              )}
            </>
          )}
          
          {/* Gifts Tab */}
          {activeTab === 'gifts' && (
            <>
              <PanelHeader>
                <PanelTitle>Geschenk-Reservierungen</PanelTitle>
                <ActionButton onClick={loadData}>Aktualisieren</ActionButton>
              </PanelHeader>
              
              {giftReservations.length === 0 ? (
                <EmptyState>
                  <div className="icon">🎁</div>
                  <p>Noch keine Reservierungen</p>
                </EmptyState>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Geschenk-ID</Th>
                        <Th>Reserviert von</Th>
                        <Th>Datum</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {giftReservations.map(res => (
                        <tr key={res.id}>
                          <Td>{res.item_id}</Td>
                          <Td><strong>{res.reserved_by}</strong></Td>
                          <Td>{new Date(res.created_at).toLocaleDateString('de-DE')}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <SettingsSection>
              <SettingsGroup>
                <h3>Website-Status</h3>
                <SettingsRow>
                  <SettingsLabel>Aktueller Status</SettingsLabel>
                  <StatusSelect value={status} onChange={e => handleStatusChange(e.target.value)}>
                    <option value="std">Save the Date</option>
                    <option value="live">Live (Vollständig)</option>
                    <option value="archiv">Archiv (Nach der Hochzeit)</option>
                  </StatusSelect>
                </SettingsRow>
              </SettingsGroup>
              
              <SettingsGroup>
                <h3>Übersicht</h3>
                <SettingsRow>
                  <SettingsLabel>Projekt-ID</SettingsLabel>
                  <code style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{projectId}</code>
                </SettingsRow>
                <SettingsRow>
                  <SettingsLabel>Namen</SettingsLabel>
                  <span>{coupleNames}</span>
                </SettingsRow>
              </SettingsGroup>
            </SettingsSection>
          )}
        </Panel>
      </Main>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={2000}
      />
    </DashboardContainer>
  );
}

export default AdminDashboard;
'edit-witnesses':'Trauzeugen',
    'edit-gallery':'Galerie',
    'edit-faq':'FAQ',
    'edit-abc':'Hochzeits-ABC',
    'edit-footer':'Footer',
    'status':'Status'
  };

  return (
    <DashboardContainer>
      <MobileMenuToggle onClick={()=>setSidebarOpen(!sidebarOpen)}>☰</MobileMenuToggle>
      
      <Sidebar $open={sidebarOpen}>
        <SidebarHeader>
          <SidebarLogo>
            <LeafSVG />
            Admin <span>Panel</span>
          </SidebarLogo>
          <SidebarSub>{coupleNames}</SidebarSub>
        </SidebarHeader>
        
        {navItems.map(s => (
          <NavSection key={s.section}>
            <NavSectionTitle>{s.section}</NavSectionTitle>
            {s.items.map(i => (
              <NavItem 
                key={i.id} 
                $active={activeTab === i.id} 
                onClick={() => { setActiveTab(i.id); setSidebarOpen(false); }}
              >
                {i.icon} {i.label}
                {i.badge > 0 && <NavBadge $warning={i.warning}>{i.badge}</NavBadge>}
              </NavItem>
            ))}
          </NavSection>
        ))}
        
        <NavDivider />
        <NavItem onClick={() => window.location.href = slug ? `/${slug}` : '/'}>
          ← Zurück zur Website
        </NavItem>
      </Sidebar>
      
      <Main>
        <Header>
          <PageTitle>{titles[activeTab] || 'Admin'}</PageTitle>
        </Header>
        {renderContent()}
      </Main>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={2500}
      />
    </DashboardContainer>
  );
}

export default AdminDashboard;
