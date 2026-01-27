import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  min-height: 100vh;
  padding: 8rem 2rem 4rem;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
  animation: ${fadeIn} 0.6s ease;
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--forest);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .icon {
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  margin-top: 0.5rem;
`;

const LogoutBtn = styled.button`
  padding: 0.85rem 1.75rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sage-dark);
  background: transparent;
  border: 1px solid var(--sage);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--sage);
    color: var(--cream);
  }
`;

// Stats Grid
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.6s ease;
  animation-delay: 0.1s;
  animation-fill-mode: both;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: var(--cream-dark);
  border-radius: 25px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(45, 59, 45, 0.1);
  }
  
  .icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .number {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    font-style: italic;
    color: var(--sage);
    line-height: 1;
  }
  
  .label {
    font-family: 'Lato', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-light);
    margin-top: 0.5rem;
  }
`;

// Tabs
const Tabs = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(139, 157, 131, 0.3);
  animation: ${fadeIn} 0.6s ease;
  animation-delay: 0.2s;
  animation-fill-mode: both;
`;

const Tab = styled.button`
  padding: 1.25rem 2rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.active ? 'var(--sage-dark)' : 'var(--text-light)'};
  background: ${p => p.active ? 'var(--cream-dark)' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${p => p.active ? 'var(--sage)' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--sage-dark);
    background: rgba(139, 157, 131, 0.05);
  }
`;

// Tab Content
const TabContent = styled.div`
  background: var(--cream-dark);
  border-radius: 25px;
  padding: 2rem;
  animation: ${fadeIn} 0.4s ease;
`;

// Table
const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1.25rem 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(139, 157, 131, 0.15);
  }
  
  th {
    font-family: 'Lato', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sage-dark);
    background: rgba(139, 157, 131, 0.05);
  }
  
  td {
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
    color: var(--text);
  }
  
  tbody tr {
    transition: background 0.2s ease;
    
    &:hover {
      background: rgba(139, 157, 131, 0.05);
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 20px;
  
  ${p => p.status === 'yes' && `
    background: rgba(46, 204, 113, 0.15);
    color: #27ae60;
    border: 1px solid rgba(46, 204, 113, 0.3);
  `}
  
  ${p => p.status === 'no' && `
    background: rgba(231, 76, 60, 0.15);
    color: #c0392b;
    border: 1px solid rgba(231, 76, 60, 0.3);
  `}
  
  ${p => p.status === 'pending' && `
    background: rgba(241, 196, 15, 0.15);
    color: #d4a017;
    border: 1px solid rgba(241, 196, 15, 0.3);
  `}
`;

// Photo Grid
const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
`;

const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: var(--cream);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 10px 30px rgba(45, 59, 45, 0.15);
    
    img {
      transform: scale(1.1);
    }
    
    .overlay {
      opacity: 1;
    }
  }
`;

const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(45, 59, 45, 0.8) 100%);
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const PhotoInfo = styled.div`
  .guest-name {
    font-family: 'Lato', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--cream);
  }
  
  .date {
    font-family: 'Lato', sans-serif;
    font-size: 0.7rem;
    color: rgba(245, 241, 235, 0.7);
  }
`;

const PlaceholderPhoto = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--cream), var(--cream-dark));
  
  span {
    font-size: 2.5rem;
    opacity: 0.3;
  }
`;

// Action Bar
const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(139, 157, 131, 0.2);
`;

const ActionBtn = styled.button`
  padding: 0.85rem 1.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: ${p => p.primary ? 'var(--sage)' : 'transparent'};
  color: ${p => p.primary ? 'var(--cream)' : 'var(--sage-dark)'};
  border: ${p => p.primary ? 'none' : '1px solid var(--sage)'};
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    ${p => p.primary 
      ? 'background: var(--sage-dark); transform: translateY(-2px);' 
      : 'background: var(--sage); color: var(--cream);'
    }
  }
`;

// Empty State
const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--forest);
    margin-bottom: 0.5rem;
  }
  
  p {
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
    color: var(--text-light);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function AdminDashboard({
  coupleNames = 'Olivia & Benjamin',
  rsvpData = [
    { name: 'Lisa & Martin Hoffmann', email: 'lisa@email.de', status: 'yes', guests: 2, menu: 'Vegetarisch', allergies: '', date: '2024-03-15' },
    { name: 'Thomas Weber', email: 'thomas@email.de', status: 'yes', guests: 1, menu: 'Vegan', allergies: 'Nüsse', date: '2024-03-14' },
    { name: 'Anna Schmidt', email: 'anna@email.de', status: 'no', guests: 0, menu: '-', allergies: '', date: '2024-03-13' },
    { name: 'Familie Müller', email: 'mueller@email.de', status: 'yes', guests: 4, menu: 'Fleisch', allergies: '', date: '2024-03-12' },
  ],
  photos = [
    { url: null, guestName: 'Lisa Hoffmann', date: '2024-03-15' },
    { url: null, guestName: 'Thomas Weber', date: '2024-03-14' },
    { url: null, guestName: 'Lisa Hoffmann', date: '2024-03-15' },
    { url: null, guestName: 'Familie Müller', date: '2024-03-12' },
  ],
  onLogout = () => console.log('Logout'),
}) {
  const [activeTab, setActiveTab] = useState('rsvp');

  // Calculate stats
  const confirmedYes = rsvpData.filter(r => r.status === 'yes');
  const totalGuests = confirmedYes.reduce((sum, r) => sum + (r.guests || 0), 0);
  const pendingCount = rsvpData.filter(r => r.status === 'pending').length;
  const declinedCount = rsvpData.filter(r => r.status === 'no').length;

  // Download CSV
  const downloadCSV = () => {
    const headers = ['Name', 'E-Mail', 'Status', 'Gäste', 'Menü', 'Allergien', 'Datum'];
    const rows = rsvpData.map(r => [
      r.name, 
      r.email, 
      r.status === 'yes' ? 'Zusage' : r.status === 'no' ? 'Absage' : 'Offen',
      r.guests, 
      r.menu, 
      r.allergies || '-',
      r.date
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rsvp-${coupleNames.replace(/\s/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Section id="admin">
      <Container>
        <Header>
          <HeaderLeft>
            <Title>
              <span className="icon">🌿</span>
              Admin Dashboard
            </Title>
            <Subtitle>Übersicht für {coupleNames}</Subtitle>
          </HeaderLeft>
          <LogoutBtn onClick={onLogout}>Abmelden</LogoutBtn>
        </Header>

        <StatsGrid>
          <StatCard>
            <div className="icon">✅</div>
            <div className="number">{confirmedYes.length}</div>
            <div className="label">Zusagen</div>
          </StatCard>
          <StatCard>
            <div className="icon">👥</div>
            <div className="number">{totalGuests}</div>
            <div className="label">Gäste gesamt</div>
          </StatCard>
          <StatCard>
            <div className="icon">⏳</div>
            <div className="number">{pendingCount}</div>
            <div className="label">Ausstehend</div>
          </StatCard>
          <StatCard>
            <div className="icon">📷</div>
            <div className="number">{photos.length}</div>
            <div className="label">Fotos</div>
          </StatCard>
        </StatsGrid>

        <Tabs>
          <Tab active={activeTab === 'rsvp'} onClick={() => setActiveTab('rsvp')}>
            RSVP Übersicht
          </Tab>
          <Tab active={activeTab === 'photos'} onClick={() => setActiveTab('photos')}>
            Fotos
          </Tab>
        </Tabs>

        <TabContent>
          {activeTab === 'rsvp' && (
            <>
              {rsvpData.length > 0 ? (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>E-Mail</th>
                        <th>Status</th>
                        <th>Gäste</th>
                        <th>Menü</th>
                        <th>Allergien</th>
                        <th>Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvpData.map((r, i) => (
                        <tr key={i}>
                          <td><strong>{r.name}</strong></td>
                          <td>{r.email}</td>
                          <td>
                            <StatusBadge status={r.status}>
                              {r.status === 'yes' ? '✓ Zusage' : r.status === 'no' ? '✗ Absage' : '○ Offen'}
                            </StatusBadge>
                          </td>
                          <td>{r.guests}</td>
                          <td>{r.menu}</td>
                          <td>{r.allergies || '-'}</td>
                          <td>{r.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              ) : (
                <EmptyState>
                  <div className="icon">📭</div>
                  <h3>Noch keine Antworten</h3>
                  <p>Sobald Gäste antworten, erscheinen sie hier.</p>
                </EmptyState>
              )}
              
              <ActionBar>
                <ActionBtn onClick={downloadCSV}>
                  📊 CSV Export
                </ActionBtn>
                <ActionBtn primary>
                  ✉️ Erinnerung senden
                </ActionBtn>
              </ActionBar>
            </>
          )}

          {activeTab === 'photos' && (
            <>
              {photos.length > 0 ? (
                <PhotoGrid>
                  {photos.map((photo, i) => (
                    <PhotoCard key={i}>
                      {photo.url ? (
                        <img src={photo.url} alt={`Foto von ${photo.guestName}`} />
                      ) : (
                        <PlaceholderPhoto>
                          <span>🌸</span>
                        </PlaceholderPhoto>
                      )}
                      <PhotoOverlay className="overlay">
                        <PhotoInfo>
                          <div className="guest-name">{photo.guestName}</div>
                          {photo.date && <div className="date">{photo.date}</div>}
                        </PhotoInfo>
                      </PhotoOverlay>
                    </PhotoCard>
                  ))}
                </PhotoGrid>
              ) : (
                <EmptyState>
                  <div className="icon">📷</div>
                  <h3>Noch keine Fotos</h3>
                  <p>Sobald Gäste Fotos hochladen, erscheinen sie hier.</p>
                </EmptyState>
              )}
              
              <ActionBar>
                <ActionBtn primary>
                  📥 Alle Fotos herunterladen
                </ActionBtn>
              </ActionBar>
            </>
          )}
        </TabContent>
      </Container>
    </Section>
  );
}

export default AdminDashboard;
