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

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN STYLES
// ═══════════════════════════════════════════════════════════════════════════

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%);
  padding: 2rem;
`;

const LoginBox = styled.div`
  background: var(--cream-light);
  border: 1px solid var(--sage-light);
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  max-width: 420px;
  width: 100%;
  padding: 3rem;
  animation: ${fadeIn} 0.6s ease;
`;

const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  .leaf {
    width: 40px;
    height: 40px;
    fill: var(--sage);
    margin-bottom: 1rem;
    animation: ${sway} 4s ease-in-out infinite;
  }
  
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 400;
    color: var(--forest);
    
    span { font-style: italic; color: var(--sage); }
  }
  
  p {
    font-family: 'Lato', sans-serif;
    font-size: 0.85rem;
    color: var(--text-light);
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
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-light);
`;

const Input = styled.input`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem 1.25rem;
  background: var(--cream);
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  color: var(--forest);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 3px var(--sage-muted);
  }
  
  &::placeholder { color: var(--text-muted); }
`;

const LoginButton = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1.25rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--sage-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const LoginError = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: var(--error);
  text-align: center;
  padding: 1rem;
  background: rgba(192, 57, 43, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(192, 57, 43, 0.3);
  animation: ${shake} 0.4s ease;
`;

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD STYLES
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  min-height: 100vh;
  padding: 2rem;
  background: var(--cream);
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
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--sage-light);
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 400;
  color: var(--forest);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .leaf {
    width: 28px;
    height: 28px;
    fill: var(--sage);
    animation: ${sway} 4s ease-in-out infinite;
  }
  
  span { font-style: italic; color: var(--sage); }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StatusSelect = styled.select`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  padding: 0.75rem 1.5rem;
  background: var(--cream-light);
  color: var(--forest);
  border: 1px solid var(--sage-light);
  border-radius: 8px;
  cursor: pointer;
  
  &:focus { outline: none; border-color: var(--sage); }
`;

const LogoutButton = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: white;
  background: var(--sage);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover { background: var(--sage-dark); }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: var(--cream-light);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--sage-light);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease ${p => p.$delay}s both;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${p => p.$color || 'var(--sage)'};
    border-radius: 4px 4px 0 0;
  }
`;

const StatValue = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 400;
  color: ${p => p.$color || 'var(--forest)'};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-light);
`;

const TabsBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--sage-light);
  padding-bottom: 0.5rem;
`;

const Tab = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${p => p.$active ? 'var(--forest)' : 'var(--text-light)'};
  background: ${p => p.$active ? 'var(--cream-light)' : 'transparent'};
  padding: 1rem 1.5rem;
  border: ${p => p.$active ? '1px solid var(--sage-light)' : '1px solid transparent'};
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  ${p => p.$active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--cream);
    }
  `}
  
  &:hover { color: var(--forest); }
`;

const TableWrapper = styled.div`
  background: var(--cream-light);
  border-radius: 12px;
  border: 1px solid var(--sage-light);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-light);
  background: var(--cream-dark);
  border-bottom: 1px solid var(--sage-light);
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
  border-bottom: 1px solid rgba(139, 157, 131, 0.1);
`;

const StatusBadge = styled.span`
  display: inline-block;
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  background: ${p => {
    if (p.$attending === true || p.$approved) return 'rgba(39, 174, 96, 0.15)';
    if (p.$attending === false) return 'rgba(192, 57, 43, 0.15)';
    return 'rgba(212, 160, 23, 0.15)';
  }};
  color: ${p => {
    if (p.$attending === true || p.$approved) return 'var(--success)';
    if (p.$attending === false) return 'var(--error)';
    return 'var(--warning)';
  }};
`;

const ActionButton = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
  border: none;
  
  &.approve {
    background: rgba(39, 174, 96, 0.15);
    color: var(--success);
    &:hover { background: rgba(39, 174, 96, 0.25); }
  }
  
  &.delete {
    background: rgba(192, 57, 43, 0.15);
    color: var(--error);
    &:hover { background: rgba(192, 57, 43, 0.25); }
  }
`;

const ExportButton = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--forest);
  background: var(--cream-light);
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--sage-light);
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--sage-muted);
    border-color: var(--sage);
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const PhotoCard = styled.div`
  aspect-ratio: 1;
  background: var(--cream-dark);
  border-radius: 12px;
  border: 2px solid ${p => p.$approved ? 'var(--sage)' : 'var(--warning)'};
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
  background: linear-gradient(transparent, rgba(45, 59, 45, 0.9));
  display: flex;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
  
  .emoji { font-size: 4rem; margin-bottom: 1rem; }
  p { font-family: 'Lato', sans-serif; font-size: 1rem; }
`;

const GuestbookCard = styled.div`
  background: var(--cream-light);
  border: 1px solid ${p => p.$approved ? 'var(--sage-light)' : 'var(--warning)'};
  border-radius: 12px;
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
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  color: var(--forest);
`;

const GuestbookMessage = styled.p`
  font-family: 'Lato', sans-serif;
  color: var(--text-light);
  line-height: 1.7;
`;

const LeafSVG = () => (
  <svg viewBox="0 0 24 24" className="leaf">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.97C7.14 20.19 7.64 20.39 8.16 20.56L7.5 22.59L9.4 23.25L10.08 21.2C14.6 22.35 19.67 19.97 22 15.5C22 15.5 18 14 17 8Z"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function AdminDashboard() {
  const { project, projectId, coupleNames, slug } = useWedding();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('rsvp');
  const [rsvps, setRsvps] = useState([]);
  const [guestbook, setGuestbook] = useState([]);
  const [musicWishes, setMusicWishes] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(project?.status || 'live');

  const ADMIN_PASSWORD = project?.admin_password || project?.settings?.admin_password || 'admin123';

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
      r.name, r.email, r.persons || 1, r.attending ? 'Ja' : 'Nein',
      r.dietary || '-', r.allergies || '-', r.message || '-'
    ]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp-export-${slug || 'wedding'}.csv`;
    a.click();
  };

  const confirmedRsvps = rsvps.filter(r => r.attending === true);
  const declinedRsvps = rsvps.filter(r => r.attending === false);
  const totalGuests = confirmedRsvps.reduce((sum, r) => sum + (r.persons || 1), 0);
  const pendingCount = guestbook.filter(g => !g.approved).length + photos.filter(p => !p.approved).length;

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <LoginContainer>
        <LoginBox>
          <LoginLogo>
            <LeafSVG />
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
            <LoginButton type="submit">Anmelden</LoginButton>
          </LoginForm>
        </LoginBox>
      </LoginContainer>
    );
  }

  // DASHBOARD
  return (
    <Section>
      <Container>
        <Header>
          <Title>
            <LeafSVG />
            Admin <span>Dashboard</span>
          </Title>
          <HeaderActions>
            <StatusSelect value={currentStatus} onChange={e => handleStatusChange(e.target.value)}>
              <option value="std">Save the Date</option>
              <option value="live">Live</option>
              <option value="archiv">Archiv</option>
            </StatusSelect>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </HeaderActions>
        </Header>
        
        <StatsGrid>
          <StatCard $color="var(--sage)" $delay={0}>
            <StatValue $color="var(--sage)">{confirmedRsvps.length}</StatValue>
            <StatLabel>Zusagen</StatLabel>
          </StatCard>
          <StatCard $color="var(--forest)" $delay={0.1}>
            <StatValue $color="var(--forest)">{totalGuests}</StatValue>
            <StatLabel>Gäste total</StatLabel>
          </StatCard>
          <StatCard $color="var(--terracotta)" $delay={0.2}>
            <StatValue $color="var(--terracotta)">{declinedRsvps.length}</StatValue>
            <StatLabel>Absagen</StatLabel>
          </StatCard>
          <StatCard $color="var(--blush)" $delay={0.3}>
            <StatValue>{pendingCount}</StatValue>
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
        
        {activeTab === 'rsvp' && (
          <>
            <ExportButton onClick={exportCSV}>📥 CSV Export</ExportButton>
            {rsvps.length === 0 ? (
              <EmptyState>
                <div className="emoji">🌿</div>
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
                      {!entry.approved && <StatusBadge style={{ marginLeft: '1rem' }}>Neu</StatusBadge>}
                    </GuestbookName>
                    <div>
                      {!entry.approved && (
                        <ActionButton className="approve" onClick={() => handleApproveGuestbook(entry.id)}>
                          ✓ Freigeben
                        </ActionButton>
                      )}
                      <ActionButton className="delete" onClick={() => handleDeleteGuestbook(entry.id)}>
                        Löschen
                      </ActionButton>
                    </div>
                  </GuestbookHeader>
                  <GuestbookMessage>{entry.message}</GuestbookMessage>
                </GuestbookCard>
              ))
            )}
          </>
        )}
        
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
                            Löschen
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
                        <ActionButton className="approve" onClick={() => handleApprovePhoto(photo.id)}>✓</ActionButton>
                      )}
                      <ActionButton className="delete" onClick={() => handleDeletePhoto(photo.id)}>✕</ActionButton>
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
