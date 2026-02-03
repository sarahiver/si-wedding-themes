// themes/botanical/BotanicalAdminStyles.js - DARK GLASS THEME
// Matches the new Botanical Glass frontend with dark jungle aesthetic
import styled, { keyframes, css } from 'styled-components';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

// ============================================
// CSS VARIABLES - DARK GLASS THEME
// ============================================
const darkGlassVars = css`
  --admin-bg: #040604;
  --admin-bg-secondary: #0a0f0a;
  --admin-glass: rgba(255, 255, 255, 0.03);
  --admin-glass-hover: rgba(255, 255, 255, 0.06);
  --admin-glass-border: rgba(255, 255, 255, 0.08);
  --admin-glass-border-hover: rgba(139, 180, 120, 0.3);
  --admin-accent: rgba(139, 180, 120, 0.9);
  --admin-accent-light: rgba(139, 180, 120, 0.15);
  --admin-accent-muted: rgba(139, 180, 120, 0.08);
  --admin-text: rgba(255, 255, 255, 0.95);
  --admin-text-secondary: rgba(255, 255, 255, 0.6);
  --admin-text-muted: rgba(255, 255, 255, 0.35);
  --admin-success: #4CAF50;
  --admin-warning: #FF9800;
  --admin-error: #f44336;
`;

// ============================================
// LOGIN PAGE
// ============================================
export const LoginContainer = styled.div`
  ${darkGlassVars}
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--admin-bg);
  position: relative;
  overflow: hidden;
  
  /* Jungle gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(ellipse at 20% 80%, rgba(139, 180, 120, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(139, 180, 120, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const LoginBox = styled.div`
  background: var(--admin-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--admin-glass-border);
  border-radius: 20px;
  max-width: 420px;
  width: 90%;
  padding: 3rem;
  animation: ${fadeIn} 0.6s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(139, 180, 120, 0.2), transparent 50%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

export const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h1 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-weight: 400;
    color: var(--admin-text);
    letter-spacing: 0.05em;
    
    span {
      font-style: italic;
      color: var(--admin-accent);
    }
  }
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--admin-text-muted);
    margin-top: 0.75rem;
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const LoginError = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: var(--admin-error);
  text-align: center;
  padding: 1rem;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.2);
  border-radius: 10px;
  margin-bottom: 0.5rem;
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: var(--admin-accent);
  color: #000;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(139, 180, 120, 1);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const BackLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--admin-text-muted);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--admin-accent);
  }
`;

// ============================================
// DASHBOARD LAYOUT
// ============================================
export const DashboardContainer = styled.div`
  ${darkGlassVars}
  min-height: 100vh;
  display: flex;
  background: var(--admin-bg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

export const Sidebar = styled.aside`
  width: 280px;
  background: var(--admin-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid var(--admin-glass-border);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0;
  overflow-y: auto;
  z-index: 100;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--admin-glass-border);
    border-radius: 2px;
  }
  
  @media (max-width: 968px) {
    transform: translateX(${p => p.$open ? '0' : '-100%'});
    transition: transform 0.3s ease;
    box-shadow: ${p => p.$open ? '0 0 50px rgba(0,0,0,0.5)' : 'none'};
  }
`;

export const SidebarHeader = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid var(--admin-glass-border);
`;

export const SidebarLogo = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--admin-text);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  span {
    font-style: italic;
    color: var(--admin-accent);
  }
`;

export const SidebarSub = styled.p`
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--admin-text-muted);
  margin-top: 0.5rem;
`;

export const NavSection = styled.div`
  margin-bottom: 0.5rem;
`;

export const NavSectionTitle = styled.div`
  padding: 1.5rem 1.5rem 0.75rem;
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--admin-text-muted);
`;

export const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: ${p => p.$active ? '500' : '400'};
  color: ${p => p.$active ? 'var(--admin-text)' : 'var(--admin-text-secondary)'};
  background: ${p => p.$active ? 'var(--admin-accent-light)' : 'transparent'};
  border: none;
  border-left: 2px solid ${p => p.$active ? 'var(--admin-accent)' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--admin-glass-hover);
    color: var(--admin-text);
  }
`;

export const NavBadge = styled.span`
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  background: ${p => p.$warning ? 'rgba(255, 152, 0, 0.2)' : 'var(--admin-accent)'};
  color: ${p => p.$warning ? 'var(--admin-warning)' : '#000'};
`;

export const NavDivider = styled.div`
  height: 1px;
  background: var(--admin-glass-border);
  margin: 1rem 1.5rem;
`;

export const Main = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  min-height: 100vh;
  background: var(--admin-bg);
  
  @media (max-width: 968px) {
    margin-left: 0;
    padding: 1.5rem;
    padding-top: 5rem;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--admin-glass-border);
`;

export const PageTitle = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--admin-text);
`;

export const MobileMenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 101;
  background: var(--admin-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--admin-glass-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--admin-text);
  font-size: 1.25rem;
  cursor: pointer;
  
  @media (max-width: 968px) {
    display: block;
  }
`;

// ============================================
// STATS
// ============================================
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: var(--admin-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--admin-glass-border);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--admin-glass-border-hover);
    transform: translateY(-2px);
  }
`;

export const StatNumber = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--admin-accent);
`;

export const StatLabel = styled.div`
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--admin-text-muted);
  margin-top: 0.5rem;
`;

// ============================================
// PANELS
// ============================================
export const Panel = styled.div`
  background: var(--admin-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--admin-glass-border);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  animation: ${fadeIn} 0.4s ease;
`;

export const PanelHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--admin-glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const PanelTitle = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--admin-text);
`;

export const PanelContent = styled.div`
  padding: 1.5rem;
  max-height: ${p => p.$maxHeight || 'auto'};
  overflow-y: auto;
`;

// ============================================
// TABLES
// ============================================
export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
`;

export const Th = styled.th`
  text-align: left;
  padding: 1rem;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--admin-text-muted);
  border-bottom: 1px solid var(--admin-glass-border);
`;

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--admin-glass-border);
  color: var(--admin-text-secondary);
  
  &:first-child {
    color: var(--admin-text);
    font-weight: 500;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  background: ${p => 
    p.$status === 'confirmed' ? 'rgba(76, 175, 80, 0.15)' : 
    p.$status === 'declined' ? 'rgba(244, 67, 54, 0.15)' : 
    'rgba(255, 152, 0, 0.15)'
  };
  color: ${p => 
    p.$status === 'confirmed' ? 'var(--admin-success)' : 
    p.$status === 'declined' ? 'var(--admin-error)' : 
    'var(--admin-warning)'
  };
`;

// ============================================
// FORMS
// ============================================
export const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

export const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--admin-text-muted);
  margin-bottom: 0.5rem;
`;

export const SectionLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--admin-accent);
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--admin-glass-border);
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  background: var(--admin-glass);
  border: 1px solid ${p => p.$error ? 'var(--admin-error)' : 'var(--admin-glass-border)'};
  border-radius: 10px;
  color: var(--admin-text);
  box-sizing: border-box;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--admin-accent);
    box-shadow: 0 0 0 3px var(--admin-accent-muted);
  }
  
  &::placeholder {
    color: var(--admin-text-muted);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  background: var(--admin-glass);
  border: 1px solid var(--admin-glass-border);
  border-radius: 10px;
  color: var(--admin-text);
  min-height: 120px;
  resize: vertical;
  box-sizing: border-box;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--admin-accent);
    box-shadow: 0 0 0 3px var(--admin-accent-muted);
  }
  
  &::placeholder {
    color: var(--admin-text-muted);
  }
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--admin-accent);
  cursor: pointer;
`;

export const ErrorText = styled.span`
  font-size: 0.75rem;
  color: var(--admin-error);
  margin-top: 0.25rem;
  display: block;
`;

export const HelpText = styled.span`
  font-size: 0.75rem;
  color: var(--admin-text-muted);
  margin-top: 0.25rem;
  display: block;
`;

export const Select = styled.select`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  background: var(--admin-glass);
  border: 1px solid var(--admin-glass-border);
  border-radius: 10px;
  color: var(--admin-text);
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--admin-accent);
    box-shadow: 0 0 0 3px var(--admin-accent-muted);
  }

  option {
    background: var(--admin-bg);
    color: var(--admin-text);
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

// ============================================
// BUTTONS
// ============================================
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--admin-accent);
  color: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(139, 180, 120, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  ${p => p.$secondary && css`
    background: transparent;
    border: 1px solid var(--admin-glass-border);
    color: var(--admin-text);
    
    &:hover {
      border-color: var(--admin-accent);
      box-shadow: none;
    }
  `}
  
  ${p => p.$danger && css`
    background: var(--admin-error);
    color: white;
    
    &:hover {
      box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
    }
  `}
`;

export const SmallButton = styled.button`
  padding: 0.5rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: ${p => p.$active ? 'var(--admin-accent)' : 'transparent'};
  color: ${p => p.$active ? '#000' : 'var(--admin-text-secondary)'};
  border: 1px solid ${p => p.$active ? 'var(--admin-accent)' : 'var(--admin-glass-border)'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--admin-accent);
    color: ${p => p.$active ? '#000' : 'var(--admin-text)'};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// ============================================
// LAYOUT HELPERS
// ============================================
export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${p => p.$cols || 2}, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: var(--admin-glass-border);
  margin: 1.5rem 0;
`;

// ============================================
// ENTRY CARDS (Guestbook, Music, etc.)
// ============================================
export const EntryCard = styled.div`
  background: var(--admin-glass);
  border: 1px solid ${p => p.$pending ? 'var(--admin-warning)' : 'var(--admin-glass-border)'};
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--admin-glass-border-hover);
  }
`;

export const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

export const EntryName = styled.h4`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--admin-text);
`;

export const EntryContent = styled.p`
  font-size: 0.9rem;
  color: var(--admin-text-secondary);
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

export const EntryMeta = styled.span`
  font-size: 0.7rem;
  color: var(--admin-text-muted);
`;

export const EntryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// ============================================
// ITEM CARDS (Timeline, FAQ, etc.)
// ============================================
export const ItemCard = styled.div`
  background: var(--admin-glass);
  border: 1px solid var(--admin-glass-border);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ItemNumber = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--admin-accent);
`;

export const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// ============================================
// ALERTS & SEARCH
// ============================================
export const AlertBox = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  
  ${p => p.$type === 'info' && css`
    background: rgba(33, 150, 243, 0.1);
    border: 1px solid rgba(33, 150, 243, 0.2);
    color: #64B5F6;
  `}
  
  ${p => p.$type === 'warning' && css`
    background: rgba(255, 152, 0, 0.1);
    border: 1px solid rgba(255, 152, 0, 0.2);
    color: var(--admin-warning);
  `}
  
  ${p => p.$type === 'success' && css`
    background: rgba(76, 175, 80, 0.1);
    border: 1px solid rgba(76, 175, 80, 0.2);
    color: var(--admin-success);
  `}
`;

export const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  background: var(--admin-glass);
  border: 1px solid var(--admin-glass-border);
  border-radius: 8px;
  color: var(--admin-text);
  min-width: 200px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--admin-accent);
  }
  
  &::placeholder {
    color: var(--admin-text-muted);
  }
`;

// ============================================
// PHOTO MANAGEMENT
// ============================================
export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`;

export const PhotoActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

export const PhotoCount = styled.span`
  color: var(--admin-text-muted);
  font-size: 0.8rem;
`;

export const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid ${p => 
    p.$selected ? 'var(--admin-accent)' : 
    p.$approved ? 'var(--admin-glass-border)' : 
    'rgba(255, 152, 0, 0.4)'
  };
  
  &:hover > div {
    opacity: 1;
  }
`;

export const PhotoImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${p => p.$url ? `url(${p.$url}) center/cover` : 'var(--admin-glass)'};
  cursor: pointer;
`;

export const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

export const PhotoButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${p => p.$approve ? 'var(--admin-success)' : 'var(--admin-error)'};
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

export const PhotoPending = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 152, 0, 0.9);
  color: white;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.35rem;
  text-align: center;
`;

export const PhotoCaption = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 0.65rem;
  padding: 0.35rem 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// ============================================
// IMAGE UPLOAD / DROP ZONE
// ============================================
export const DropZone = styled.div`
  border: 2px dashed ${p =>
    p.$dragging ? 'var(--admin-accent)' :
    p.$hasImage ? 'var(--admin-accent)' :
    'var(--admin-glass-border)'
  };
  background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : 'var(--admin-glass)'};
  border-radius: 12px;
  min-height: 120px;
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  aspect-ratio: ${p => p.$ratio || '16/9'};
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--admin-accent);
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

export const DropOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 10px;
`;

export const DropButton = styled.span`
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  background: ${p => p.$danger ? 'var(--admin-error)' : 'var(--admin-accent)'};
  color: ${p => p.$danger ? 'white' : '#000'};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const DropPlaceholder = styled.div`
  text-align: center;
  color: var(--admin-text-muted);
  font-size: 0.85rem;
  
  span {
    display: block;
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }
`;

export const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: var(--admin-accent);
  width: ${p => p.$progress}%;
  transition: width 0.3s ease;
  border-radius: 0 0 10px 10px;
`;

// ============================================
// MULTI IMAGE UPLOAD
// ============================================
export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

export const ImageItem = styled.div`
  aspect-ratio: 1;
  background: ${p => p.$url ? `url(${p.$url}) center/cover` : 'var(--admin-glass)'};
  border-radius: 8px;
  position: relative;
  border: 1px solid var(--admin-glass-border);
  
  &:hover button {
    opacity: 1;
  }
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--admin-error);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

export const AddButton = styled.button`
  aspect-ratio: 1;
  background: var(--admin-glass);
  border: 2px dashed var(--admin-glass-border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.65rem;
  color: var(--admin-text-muted);
  transition: all 0.2s ease;
  
  span {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }
  
  &:hover {
    border-color: var(--admin-accent);
    color: var(--admin-accent);
  }
`;

// ============================================
// COLORS
// ============================================
export const ColorPalette = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
`;

export const ColorItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const ColorInput = styled.input`
  width: 44px;
  height: 44px;
  padding: 2px;
  border: 1px solid var(--admin-glass-border);
  border-radius: 8px;
  cursor: pointer;
  background: var(--admin-glass);
`;

// ============================================
// STATUS SECTION
// ============================================
export const StatusDescription = styled.div`
  font-size: 0.9rem;
  color: var(--admin-text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.7;
  
  p {
    margin: 0.5rem 0;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--admin-glass-border);
`;

export const InfoLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--admin-text-muted);
`;

export const InfoValue = styled.span`
  font-size: 0.9rem;
  color: var(--admin-text);
`;

// ============================================
// LOADING & EMPTY STATES
// ============================================
export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  &::after {
    content: '';
    width: 36px;
    height: 36px;
    border: 2px solid var(--admin-glass-border);
    border-top-color: var(--admin-accent);
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  color: var(--admin-text-muted);
  padding: 3rem 2rem;
  font-family: 'Inter', sans-serif;
  
  p {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  span {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 1rem;
  }
`;

// ============================================
// MODAL
// ============================================
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: var(--admin-bg-secondary);
  max-width: 450px;
  width: 100%;
  border: 1px solid var(--admin-glass-border);
  border-radius: 16px;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(20px);
`;

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--admin-glass-border);
`;

export const ModalTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--admin-text);
  margin: 0;
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  color: var(--admin-text-secondary);
  line-height: 1.6;
  
  p { margin: 0; }
`;

export const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--admin-glass-border);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

// ============================================
// ACTION BUTTON (für wichtige Aktionen)
// ============================================
export const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;
  border-radius: 8px;
  
  ${p => p.$primary ? css`
    background: var(--admin-accent);
    border-color: var(--admin-accent);
    color: #0a0f0a;
    
    &:hover:not(:disabled) {
      background: rgba(139, 180, 120, 1);
      transform: translateY(-1px);
      box-shadow: 0 4px 20px var(--admin-accent-light);
    }
  ` : css`
    background: transparent;
    border-color: var(--admin-glass-border);
    color: var(--admin-text-secondary);
    
    &:hover:not(:disabled) {
      border-color: var(--admin-glass-border-hover);
      color: var(--admin-text);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============================================
// FEEDBACK MODAL
// ============================================
export const FeedbackModal = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: ${p => 
    p.type === 'success' ? 'var(--admin-success)' : 
    p.type === 'error' ? 'var(--admin-error)' : 
    '#2196F3'
  };
  color: white;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
`;

// ============================================
// LOGO ICON (Monstera Leaf)
// ============================================
export const LogoIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: 'var(--admin-accent)' }}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.97C7.14 20.19 7.64 20.39 8.16 20.56L7.5 22.59L9.4 23.25L10.08 21.2C14.6 22.35 19.67 19.97 22 15.5C22 15.5 18 14 17 8Z"/>
  </svg>
);

// ============================================
// GLOBAL ADMIN STYLES (inject once)
// ============================================
export const AdminGlobalStyles = styled.div`
  ${darkGlassVars}
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--admin-bg);
  
  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

// Alias for backward compatibility
export const BotanicalAdminStyles = AdminGlobalStyles;

// ============================================
// EXPORT ALL COMPONENTS
// ============================================
export const BotanicalAdminComponents = {
  // Login
  LoginContainer, LoginBox, LoginLogo, LoginForm, LoginError, LoginButton, BackLink,
  
  // Dashboard Layout
  DashboardContainer, Sidebar, SidebarHeader, SidebarLogo, SidebarSub,
  NavSection, NavSectionTitle, NavItem, NavBadge, NavDivider,
  Main, Header, PageTitle, MobileMenuToggle,
  
  // Stats
  StatsGrid, StatCard, StatNumber, StatLabel,
  
  // Panels
  Panel, PanelHeader, PanelTitle, PanelContent,
  
  // Tables
  TableWrapper, Table, Th, Td, StatusBadge,
  
  // Forms
  FormGroup, Label, SectionLabel, Input, TextArea, Checkbox, ErrorText, HelpText, Select, FormRow,
  
  // Buttons
  Button, SmallButton, ButtonGroup,
  
  // Layout Helpers
  ActionBar, GridRow, Divider,
  
  // Entry Cards
  EntryCard, EntryHeader, EntryName, EntryContent, EntryMeta, EntryActions,
  
  // Item Cards
  ItemCard, ItemHeader, ItemNumber, ItemActions,
  
  // Alerts & Search
  AlertBox, SearchInput, ActionButton,
  
  // Modal
  ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter,
  
  // Photos
  PhotoGrid, PhotoActions, PhotoCount, PhotoCard, PhotoImage, PhotoOverlay, PhotoButton, PhotoPending, PhotoCaption,
  
  // Image Upload
  DropZone, DropOverlay, DropButton, DropPlaceholder, ProgressBar,
  ImageGrid, ImageItem, RemoveButton, AddButton,
  
  // Colors
  ColorPalette, ColorItem, ColorInput,
  
  // Status
  StatusDescription, InfoRow, InfoLabel, InfoValue,
  
  // Loading & Empty
  LoadingSpinner, EmptyState,
  
  // Feedback
  FeedbackModal,
  
  // Icon
  LogoIcon,
};

export default BotanicalAdminComponents;
