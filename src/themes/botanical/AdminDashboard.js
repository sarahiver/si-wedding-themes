import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`min-height: 100vh; padding: 2rem; background: var(--cream);`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;`;
const Title = styled.h1`font-family: var(--font-serif); font-size: 2rem;`;
const CloseBtn = styled.button`padding: 0.5rem 1rem; font-size: 0.8rem; background: var(--black); color: var(--white); cursor: pointer;`;
const Message = styled.p`color: var(--medium);`;

function AdminDashboard({ onClose }) {
  return (
    <Wrapper>
      <Header>
        <Title>Admin</Title>
        <CloseBtn onClick={onClose}>Schließen</CloseBtn>
      </Header>
      <Message>Admin Dashboard - wird vom bestehenden System übernommen.</Message>
    </Wrapper>
  );
}
export default AdminDashboard;
