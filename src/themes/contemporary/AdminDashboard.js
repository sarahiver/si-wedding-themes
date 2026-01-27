import React, { useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  min-height: 100vh;
  padding: 2rem;
  background: var(--black);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 3px solid var(--gray-800);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
`;

const LogoutButton = styled.button`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--white);
  background: var(--coral);
  padding: 0.75rem 1.5rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--coral);
  }
`;

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

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

const StatCard = styled.div`
  background: var(--gray-800);
  padding: 2rem;
  border: 3px solid ${p => p.$color};
  position: relative;
  overflow: hidden;
  
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
  font-size: 3rem;
  font-weight: 700;
  color: ${p => p.$color};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const TabsBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${p => p.$active ? 'var(--black)' : 'var(--white)'};
  background: ${p => p.$active ? 'var(--yellow)' : 'var(--gray-800)'};
  padding: 1rem 2rem;
  border: 3px solid var(--black);
  box-shadow: ${p => p.$active ? 'var(--shadow-sm)' : 'none'};
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${p => p.$active ? 'var(--yellow)' : 'var(--gray-700)'};
  }
`;

const TableWrapper = styled.div`
  background: var(--gray-800);
  border: 3px solid var(--gray-600);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-400);
  background: var(--gray-900);
  border-bottom: 2px solid var(--gray-700);
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  color: var(--white);
  border-bottom: 1px solid var(--gray-700);
`;

const StatusBadge = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.35rem 0.75rem;
  border: 2px solid var(--black);
  background: ${p => p.$status === 'confirmed' ? 'var(--electric)' : p.$status === 'declined' ? 'var(--coral)' : 'var(--yellow)'};
  color: var(--black);
`;

const ExportButton = styled.button`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--black);
  background: var(--electric);
  padding: 0.75rem 1.5rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--black);
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const PhotoCard = styled.div`
  aspect-ratio: 1;
  background: var(--gray-700);
  border: 3px solid var(--gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

function AdminDashboard({ onLogout, rsvps = [], photos = [] }) {
  const [activeTab, setActiveTab] = useState('rsvp');

  const defaultRsvps = [
    { name: 'Max Mustermann', email: 'max@test.de', guests: 2, status: 'confirmed', menu: 'Fleisch' },
    { name: 'Anna Schmidt', email: 'anna@test.de', guests: 1, status: 'pending', menu: '-' },
    { name: 'Peter Weber', email: 'peter@test.de', guests: 2, status: 'declined', menu: '-' },
  ];

  const displayRsvps = rsvps.length > 0 ? rsvps : defaultRsvps;
  const confirmed = displayRsvps.filter(r => r.status === 'confirmed');
  const totalGuests = confirmed.reduce((sum, r) => sum + (r.guests || 1), 0);
  const pending = displayRsvps.filter(r => r.status === 'pending');

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Gäste', 'Status', 'Menü'];
    const rows = displayRsvps.map(r => [r.name, r.email, r.guests, r.status, r.menu]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvp-export.csv';
    a.click();
  };

  return (
    <Section>
      <Container>
        <Header>
          <Title>🎛️ Admin Dashboard</Title>
          <LogoutButton onClick={onLogout}>Logout →</LogoutButton>
        </Header>
        
        <StatsGrid>
          <StatCard $color={colors[0]}>
            <StatValue $color={colors[0]}>{confirmed.length}</StatValue>
            <StatLabel>Zusagen</StatLabel>
          </StatCard>
          <StatCard $color={colors[1]}>
            <StatValue $color={colors[1]}>{totalGuests}</StatValue>
            <StatLabel>Gäste total</StatLabel>
          </StatCard>
          <StatCard $color={colors[2]}>
            <StatValue $color={colors[2]}>{pending.length}</StatValue>
            <StatLabel>Ausstehend</StatLabel>
          </StatCard>
          <StatCard $color={colors[3]}>
            <StatValue $color={colors[3]}>{photos.length || 12}</StatValue>
            <StatLabel>Fotos</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <TabsBar>
          <Tab $active={activeTab === 'rsvp'} onClick={() => setActiveTab('rsvp')}>RSVP</Tab>
          <Tab $active={activeTab === 'photos'} onClick={() => setActiveTab('photos')}>Fotos</Tab>
        </TabsBar>
        
        {activeTab === 'rsvp' && (
          <>
            <ExportButton onClick={exportCSV}>📥 CSV Export</ExportButton>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Gäste</Th>
                    <Th>Status</Th>
                    <Th>Menü</Th>
                  </tr>
                </thead>
                <tbody>
                  {displayRsvps.map((r, i) => (
                    <tr key={i}>
                      <Td>{r.name}</Td>
                      <Td>{r.email}</Td>
                      <Td>{r.guests}</Td>
                      <Td><StatusBadge $status={r.status}>{r.status}</StatusBadge></Td>
                      <Td>{r.menu}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </>
        )}
        
        {activeTab === 'photos' && (
          <PhotoGrid>
            {Array.from({ length: 12 }).map((_, i) => (
              <PhotoCard key={i}>📸</PhotoCard>
            ))}
          </PhotoGrid>
        )}
      </Container>
    </Section>
  );
}

export default AdminDashboard;
