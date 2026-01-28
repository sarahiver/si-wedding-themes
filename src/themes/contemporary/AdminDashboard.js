import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { 
  getRSVPResponses, 
  getGuestbookEntries, 
  getMusicWishes, 
  getPhotoUploads,
  approveGuestbookEntry,
  deleteGuestbookEntry,
  approvePhotoUpload,
  deletePhotoUpload,
  deleteMusicWish,
  updateProjectStatus
} from '../../lib/supabase';

// ============================================
// ANIMATIONS
// ============================================
const pop = keyframes`
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

// ============================================
// LOGIN STYLES
// ============================================
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--black, #0D0D0D);
  padding: 2rem;
`;

const LoginBox = styled.div`
  background: var(--gray-800, #262626);
  border: 4px solid var(--coral, #FF6B6B);
  box-shadow: 8px 8px 0 var(--coral, #FF6B6B);
  max-width: 420px;
  width: 100%;
  padding: 3rem;
  animation: ${pop} 0.4s ease;
`;

const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--white, #FAFAFA);
    text-transform: uppercase;
    
    span {
      color: var(--coral, #FF6B6B);
    }
  }
  
  p {
    font-size: 0.9rem;
    color: var(--gray-400, #A3A3A3);
    margin-top: 0.5rem;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-400, #A3A3A3);
`;

const Input = styled.input`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: var(--black, #0D0D0D);
  border: 3px solid var(--gray-600, #525252);
  color: var(--white, #FAFAFA);
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--electric, #4ECDC4);
  }
  
  &::placeholder {
    color: var(--gray-500, #737373);
  }
`;

const LoginButton = styled.button`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem;
  background: var(--coral, #FF6B6B);
  color: var(--white, #FAFAFA);
  border: 3px solid var(--black, #0D0D0D);
  box-shadow: 4px 4px 0 var(--black, #0D0D0D);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--black, #0D0D0D);
  }
  
  &:active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0 var(--black, #0D0D0D);
  }
`;

const LoginError = styled.p`
  font-size: 0.85rem;
  color: var(--coral, #FF6B6B);
  text-align: center;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border: 2px solid var(--coral, #FF6B6B);
  animation: ${shake} 0.4s ease;
`;

// ============================================
// DASHBOARD STYLES
// ============================================
const Section = styled.section`
  min-height: 100vh;
  padding: 2rem;
  background: var(--black, #0D0D0D);
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 3px solid var(--gray-800, #262626);
`;

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--white, #FAFAFA);
  text-transform: uppercase;
  
  span {
    color: var(--coral, #FF6B6B);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StatusSelect = styled.select`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  background: var(--gray-800, #262626);
  color: var(--white, #FAFAFA);
  border: 3px solid var(--electric, #4ECDC4);
  cursor: pointer;
  text-transform: uppercase;
  
  option {
    background: var(--gray-800, #262626);
  }
`;

const LogoutButton = styled.button`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--white, #FAFAFA);
  background: var(--coral, #FF6B6B);
  padding: 0.75rem 1.5rem;
  border: 3px solid var(--black, #0D0D0D);
  box-shadow: 4px 4px 0 var(--black, #0D0D0D);
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--black, #0D0D0D);
  }
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: var(--gray-800, #262626);
  padding: 2rem;
  border: 3px solid ${p => p.$color};
  position: relative;
  overflow: hidden;
  animation: ${pop} 0.4s ease ${p => p.$delay}s both;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${p => p.$color};
  }
`;

const StatValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: ${p => p.$color};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-400, #A3A3A3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const TabsBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${p => p.$active ? 'var(--black)' : 'var(--white)'};
  background: ${p => p.$active ? 'var(--yellow)' : 'var(--gray-800)'};
  padding: 1rem 2rem;
  border: 3px solid var(--black, #0D0D0D);
  box-shadow: ${p => p.$active ? '4px 4px 0 var(--black)' : 'none'};
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${p => p.$active ? 'var(--yellow)' : 'var(--gray-700)'};
  }
`;

const TableWrapper = styled.div`
  background: var(--gray-800, #262626);
  border: 3px solid var(--gray-600, #525252);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-400, #A3A3A3);
  background: var(--gray-900, #1a1a1a);
  border-bottom: 2px solid var(--gray-700, #404040);
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  color: var(--white, #FAFAFA);
  border-bottom: 1px solid var(--gray-700, #404040);
`;

const StatusBadge = styled.span`
  display: inline-block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.35rem 0.75rem;
  border: 2px solid var(--black, #0D0D0D);
  background: ${p => {
    if (p.$status === 'confirmed' || p.$status === 'approved' || p.$attending === true) return 'var(--electric)';
    if (p.$status === 'declined' || p.$attending === false) return 'var(--coral)';
    return 'var(--yellow)';
  }};
  color: var(--black, #0D0D0D);
`;

const ActionButton = styled.button`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border: 2px solid var(--black, #0D0D0D);
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
  
  &.approve {
    background: var(--electric, #4ECDC4);
    color: var(--black);
  }
  
  &.delete {
    background: var(--coral, #FF6B6B);
    color: var(--white);
  }
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ExportButton = styled.button`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--black, #0D0D0D);
  background: var(--electric, #4ECDC4);
  padding: 0.75rem 1.5rem;
  border: 3px solid var(--black, #0D0D0D);
  box-shadow: 4px 4px 0 var(--black, #0D0D0D);
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--black, #0D0D0D);
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const PhotoCard = styled.div`
  aspect-ratio: 1;
  background: var(--gray-700, #404040);
  border: 3px solid ${p => p.$approved ? 'var(--electric)' : 'var(--yellow)'};
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PhotoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gray-500, #737373);
  
  .emoji {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1rem;
  }
`;

const GuestbookCard = styled.div`
  background: var(--gray-800, #262626);
  border: 3px solid ${p => p.$approved ? 'var(--electric)' : 'var(--yellow)'};
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const GuestbookHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const GuestbookName = styled.div`
  font-weight: 700;
  color: var(--white, #FAFAFA);
`;

const GuestbookMessage = styled.p`
  color: var(--gray-300, #D4D4D4);
  line-height: 1.6;
`;

// ============================================
// COMPONENT
// ============================================
function AdminDashboard() {
  const { project, projectId, coupleNames, slug } = useWedding();
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Data state
  const [activeTab, setActiveTab] = useState('rsvp');
  const [rsvps, setRsvps] = useState([]);
  const [guestbook, setGuestbook] = useState([]);
  const [musicWishes, setMusicWishes] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(project?.status || 'live');

  // Get admin password from project settings
  const ADMIN_PASSWORD = project?.admin_password || project?.settings?.admin_password || 'admin123';

  // Load data when logged in
  useEffect(() => {
    if (isLoggedIn && projectId) {
      loadAllData();
    }
  }, [isLoggedIn, projectId]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [rsvpRes, guestbookRes, musicRes, photoRes] = await Promise.all([
        getRSVPResponses(projectId),
        getGuestbookEntries(projectId, false),
        getMusicWishes(projectId),
        getPhotoUploads(projectId, false),
      ]);
      
      setRsvps(rsvpRes.data || []);
      setGuestbook(guestbookRes.data || []);
      setMusicWishes(musicRes.data || []);
      setPhotos(photoRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPassword === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Falsches Passwort');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginPassword('');
  };

  const handleStatusChange = async (newStatus) => {
    if (projectId) {
      await updateProjectStatus(projectId, newStatus);
      setCurrentStatus(newStatus);
    }
  };

  const handleApproveGuestbook = async (id) => {
    await approveGuestbookEntry(id, true);
    loadAllData();
  };

  const handleDeleteGuestbook = async (id) => {
    if (window.confirm('Eintrag wirklich löschen?')) {
      await deleteGuestbookEntry(id);
      loadAllData();
    }
  };

  const handleApprovePhoto = async (id) => {
    await approvePhotoUpload(id, true);
    loadAllData();
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm('Foto wirklich löschen?')) {
      await deletePhotoUpload(id);
      loadAllData();
    }
  };

  const handleDeleteMusic = async (id) => {
    if (window.confirm('Musikwunsch wirklich löschen?')) {
      await deleteMusicWish(id);
      loadAllData();
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Personen', 'Zusage', 'Ernährung', 'Allergien', 'Nachricht'];
    const rows = rsvps.map(r => [
      r.name,
      r.email,
      r.persons || 1,
      r.attending ? 'Ja' : 'Nein',
      r.dietary || '-',
      r.allergies || '-',
      r.message || '-'
    ]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp-export-${slug || 'wedding'}.csv`;
    a.click();
  };

  // Calculate stats
  const confirmedRsvps = rsvps.filter(r => r.attending === true);
  const declinedRsvps = rsvps.filter(r => r.attending === false);
  const totalGuests = confirmedRsvps.reduce((sum, r) => sum + (r.persons || 1), 0);
  const pendingGuestbook = guestbook.filter(g => !g.approved).length;
  const pendingPhotos = photos.filter(p => !p.approved).length;

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!isLoggedIn) {
    return (
      <LoginContainer>
        <LoginBox>
          <LoginLogo>
            <h1>Admin <span>Panel</span></h1>
            <p>{coupleNames || 'Hochzeit'}</p>
          </LoginLogo>
          
          {loginError && <LoginError>{loginError}</LoginError>}
          
          <LoginForm onSubmit={handleLogin}>
            <FormGroup>
              <Label>Passwort</Label>
              <Input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Admin-Passwort eingeben"
                required
              />
            </FormGroup>
            <LoginButton type="submit">Anmelden →</LoginButton>
          </LoginForm>
        </LoginBox>
      </LoginContainer>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================
  return (
    <Section>
      <Container>
        <Header>
          <Title>🎛️ Admin <span>Dashboard</span></Title>
          <HeaderActions>
            <StatusSelect value={currentStatus} onChange={e => handleStatusChange(e.target.value)}>
              <option value="std">Save the Date</option>
              <option value="live">Live</option>
              <option value="archiv">Archiv</option>
            </StatusSelect>
            <LogoutButton onClick={handleLogout}>Logout →</LogoutButton>
          </HeaderActions>
        </Header>
        
        <StatsGrid>
          <StatCard $color={colors[0]} $delay={0}>
            <StatValue $color={colors[0]}>{confirmedRsvps.length}</StatValue>
            <StatLabel>Zusagen</StatLabel>
          </StatCard>
          <StatCard $color={colors[1]} $delay={0.1}>
            <StatValue $color={colors[1]}>{totalGuests}</StatValue>
            <StatLabel>Gäste total</StatLabel>
          </StatCard>
          <StatCard $color={colors[2]} $delay={0.2}>
            <StatValue $color={colors[2]}>{declinedRsvps.length}</StatValue>
            <StatLabel>Absagen</StatLabel>
          </StatCard>
          <StatCard $color={colors[3]} $delay={0.3}>
            <StatValue $color={colors[3]}>{pendingGuestbook + pendingPhotos}</StatValue>
            <StatLabel>Zu prüfen</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <TabsBar>
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
        </TabsBar>
        
        {/* RSVP TAB */}
        {activeTab === 'rsvp' && (
          <>
            <ExportButton onClick={exportCSV}>📥 CSV Export</ExportButton>
            {rsvps.length === 0 ? (
              <EmptyState>
                <div className="emoji">📬</div>
                <p>Noch keine Rückmeldungen eingegangen</p>
              </EmptyState>
            ) : (
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Personen</Th>
                      <Th>Status</Th>
                      <Th>Ernährung</Th>
                      <Th>Nachricht</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map((r, i) => (
                      <tr key={r.id || i}>
                        <Td>{r.name}</Td>
                        <Td>{r.email}</Td>
                        <Td>{r.persons || 1}</Td>
                        <Td>
                          <StatusBadge $attending={r.attending}>
                            {r.attending ? 'Zusage' : 'Absage'}
                          </StatusBadge>
                        </Td>
                        <Td>{r.dietary || '-'}</Td>
                        <Td>{r.message || '-'}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            )}
          </>
        )}
        
        {/* GUESTBOOK TAB */}
        {activeTab === 'guestbook' && (
          <>
            {guestbook.length === 0 ? (
              <EmptyState>
                <div className="emoji">📖</div>
                <p>Noch keine Gästebuch-Einträge</p>
              </EmptyState>
            ) : (
              guestbook.map(entry => (
                <GuestbookCard key={entry.id} $approved={entry.approved}>
                  <GuestbookHeader>
                    <GuestbookName>
                      {entry.name}
                      {!entry.approved && <StatusBadge $status="pending" style={{ marginLeft: '1rem' }}>Neu</StatusBadge>}
                    </GuestbookName>
                    <div>
                      {!entry.approved && (
                        <ActionButton className="approve" onClick={() => handleApproveGuestbook(entry.id)}>
                          ✓ Freigeben
                        </ActionButton>
                      )}
                      <ActionButton className="delete" onClick={() => handleDeleteGuestbook(entry.id)}>
                        ✕ Löschen
                      </ActionButton>
                    </div>
                  </GuestbookHeader>
                  <GuestbookMessage>{entry.message}</GuestbookMessage>
                </GuestbookCard>
              ))
            )}
          </>
        )}
        
        {/* MUSIC TAB */}
        {activeTab === 'music' && (
          <>
            {musicWishes.length === 0 ? (
              <EmptyState>
                <div className="emoji">🎵</div>
                <p>Noch keine Musikwünsche</p>
              </EmptyState>
            ) : (
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <Th>Von</Th>
                      <Th>Künstler</Th>
                      <Th>Song</Th>
                      <Th>Aktionen</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {musicWishes.map(wish => (
                      <tr key={wish.id}>
                        <Td>{wish.name}</Td>
                        <Td>{wish.artist}</Td>
                        <Td>{wish.song_title}</Td>
                        <Td>
                          <ActionButton className="delete" onClick={() => handleDeleteMusic(wish.id)}>
                            ✕ Löschen
                          </ActionButton>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            )}
          </>
        )}
        
        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <>
            {photos.length === 0 ? (
              <EmptyState>
                <div className="emoji">📸</div>
                <p>Noch keine Fotos hochgeladen</p>
              </EmptyState>
            ) : (
              <PhotoGrid>
                {photos.map(photo => (
                  <PhotoCard key={photo.id} $approved={photo.approved}>
                    <img src={photo.cloudinary_url} alt="Hochzeitsfoto" />
                    <PhotoOverlay>
                      {!photo.approved && (
                        <ActionButton className="approve" onClick={() => handleApprovePhoto(photo.id)}>
                          ✓
                        </ActionButton>
                      )}
                      <ActionButton className="delete" onClick={() => handleDeletePhoto(photo.id)}>
                        ✕
                      </ActionButton>
                    </PhotoOverlay>
                  </PhotoCard>
                ))}
              </PhotoGrid>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}

export default AdminDashboard;
