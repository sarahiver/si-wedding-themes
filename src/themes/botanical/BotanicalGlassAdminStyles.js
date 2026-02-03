// BotanicalGlassAdminStyles.js - Matching the dark jungle glass theme
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// ============================================
// GLOBAL ADMIN STYLES
// ============================================

export const AdminGlobalStyles = createGlobalStyle`
  :root {
    /* Dark Jungle Palette */
    --admin-bg: #040604;
    --admin-surface: rgba(255, 255, 255, 0.03);
    --admin-surface-hover: rgba(255, 255, 255, 0.06);
    --admin-glass: rgba(255, 255, 255, 0.05);
    --admin-glass-border: rgba(255, 255, 255, 0.1);
    --admin-glass-hover: rgba(255, 255, 255, 0.08);
    
    /* Text */
    --admin-text: rgba(255, 255, 255, 0.95);
    --admin-text-secondary: rgba(255, 255, 255, 0.7);
    --admin-text-muted: rgba(255, 255, 255, 0.45);
    --admin-text-dim: rgba(255, 255, 255, 0.25);
    
    /* Accents */
    --admin-accent: rgba(139, 180, 120, 0.9);
    --admin-accent-muted: rgba(139, 180, 120, 0.15);
    --admin-success: rgba(76, 175, 80, 0.9);
    --admin-success-muted: rgba(76, 175, 80, 0.15);
    --admin-warning: rgba(255, 167, 38, 0.9);
    --admin-warning-muted: rgba(255, 167, 38, 0.15);
    --admin-danger: rgba(239, 83, 80, 0.9);
    --admin-danger-muted: rgba(239, 83, 80, 0.15);
    
    /* Fonts */
    --admin-font-display: 'Cormorant Garamond', serif;
    --admin-font-body: 'Montserrat', sans-serif;
  }
  
  body {
    background: var(--admin-bg);
    color: var(--admin-text);
    font-family: var(--admin-font-body);
  }
`;

// ============================================
// ANIMATIONS
// ============================================

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.5; }`;

// ============================================
// LOGIN
// ============================================

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--admin-bg);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at top left, rgba(30, 80, 45, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at bottom right, rgba(40, 90, 35, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const LoginBox = styled.div`
  background: var(--admin-glass);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border: 1px solid var(--admin-glass-border);
  border-radius: 24px;
  max-width: 420px;
  width: 90%;
  padding: 3rem;
  animation: ${fadeIn} 0.6s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 50%, transparent);
  }
`;

export const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-family: var(--admin-font-display);
    font-size: 2rem;
    font-weight: 400;
    color: var(--admin-text);
    span { font-style: italic; color: var(--admin-accent); }
  }
  
  p {
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--admin-text-muted);
    margin-top: 0.5rem;
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const LoginError = styled.p`
  font-size: 0.85rem;
  color: var(--admin-danger);
  text-align: center;
  padding: 1rem;
  background: var(--admin-danger-muted);
  border: 1px solid rgba(239, 83, 80, 0.3);
  border-radius: 12px;
  margin-bottom: 1rem;
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-family: var(--admin-font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: var(--admin-accent);
  color: #0a150a;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover { opacity: 0.9; transform: translateY(-2px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

export const BackLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 2rem;
  font-size: 0.8rem;
  color: var(--admin-text-muted);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover { color: var(--admin-text); }
`;

// ============================================
// DASHBOARD LAYOUT
// ============================================

export const DashboardContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: var(--admin-bg);
`;

export const Sidebar = styled.aside`
  width: 280px;
  background: var(--admin-glass);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--admin-glass-border);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 2rem 0;
  overflow-y: auto;
  z-index: 100;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  
  @media (max-width: 968px) {
    transform: translateX(${p => p.$open ? '0' : '-100%'});
    transition: transform 0.3s ease;
  }
`;

export const SidebarHeader = styled.div`
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid var(--admin-glass-border);
  margin-bottom: 1rem;
`;

export const SidebarLogo = styled.div`
  font-family: var(--admin-font-display);
  font-size: 1.4rem;
  color: var(--admin-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span { font-style: italic; color: var(--admin-accent); }
`;

export const SidebarSub = styled.p`
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--admin-text-muted);
  margin-top: 0.25rem;
`;

export const NavSection = styled.div`
  margin-bottom: 0.5rem;
`;

export const NavSectionTitle = styled.div`
  padding: 0.75rem 1.5rem 0.5rem;
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--admin-text-dim);
`;

export const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-family: var(--admin-font-body);
  font-size: 0.85rem;
  color: ${p => p.$active ? 'var(--admin-text)' : 'var(--admin-text-secondary)'};
  background: ${p => p.$active ? 'var(--admin-accent-muted)' : 'transparent'};
  border: none;
  border-left: 3px solid ${p => p.$active ? 'var(--admin-accent)' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--admin-surface-hover);
    color: var(--admin-text);
  }
`;

export const NavBadge = styled.span`
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  background: ${p => p.$warning ? 'var(--admin-warning-muted)' : 'var(--admin-accent)'};
  color: ${p => p.$warning ? 'var(--admin-warning)' : '#0a150a'};
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
  
  @media (max-width: 968px) {
    margin-left: 0;
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
  font-family: var(--admin-font-display);
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
  width: 44px;
  height: 44px;
  background: var(--admin-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--admin-glass-border);
  border-radius: 10px;
  color: var(--admin-text);
  font-size: 1.2rem;
  cursor: pointer;
  
  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// ============================================
// STATS
// ============================================

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: var(--admin-glass);
  border: 1px solid var(--admin-glass-border);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--admin-glass-hover);
    transform: translateY(-2px);
  }
`;

export const StatNumber = styled.div`
  font-family: var(--admin-font-display);
  font-size: 2.75rem;
  font-weight: 400;
  color: var(--admin-accent);
`;

export const StatLabel = styled.div`
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--admin-text-muted);
  margin-top: 0.25rem;
`;

// ============================================
// PANELS
// ============================================

export const Panel = styled.div`
  background: var(--admin-glass);
  border: 1px solid var(--admin-glass-border);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  animation: ${slideIn} 0.4s ease;
`;

export const PanelHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--admin-glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const PanelTitle = styled.h3`
  font-family: var(--admin-font-display);
  font-size: 1.25rem;
  font-weight: 400;
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
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--admin-text-muted);
  border-bottom: 1px solid var(--admin-glass-border);
`;

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  color: var(--admin-text-secondary);
`;

export const StatusBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
  background: ${p => 
    p.$status === 'confirmed' ? 'var(--admin-success-muted)' : 
    p.$status === 'declined' ? 'var(--admin-danger-muted)' : 
    'var(--admin-warning-muted)'};
  color: ${p => 
    p.$status === 'confirmed' ? 'var(--admin-success)' : 
    p.$status === 'declined' ? 'var(--admin-danger)' : 
    'var(--admin-warning)'};
`;

// ============================================
// FORMS
// ============================================

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--admin-text-muted);
  margin-bottom: 0.5rem;
`;

export const SectionLabel = styled.div`
  font-size: 0.7rem;
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
  padding: 1rem 1.25rem;
  font-family: var(--admin-font-body);
  font-size: 0.95rem;
  color: var(--admin-text);
  background: var(--admin-surface);
  border: 1px solid ${p => p.$error ? 'var(--admin-danger)' : 'var(--admin-glass-border)'};
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--admin-accent);
    background: var(--admin-surface-hover);
  }
  
  &::placeholder { color: var(--admin-text-dim); }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 1.25rem;
  font-family: var(--admin-font-body);
  font-size: 0.95rem;
  color: var(--admin-text);
  background: var(--admin-surface);
  border: 1px solid var(--admin-glass-border);
  border-radius: 12px;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--admin-accent);
    background: var(--admin-surface-hover);
  }
  
  &::placeholder { color: var(--admin-text-dim); }
`;

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--admin-text-secondary);
  cursor: pointer;
  
  input {
    width: 18px;
    height: 18px;
    accent-color: var(--admin-accent);
  }
`;

export const ErrorText = styled.span`
  font-size: 0.75rem;
  color: var(--admin-danger);
  margin-top: 0.25rem;
  display: block;
`;

export const HelpText = styled.span`
  font-size: 0.75rem;
  color: var(--admin-text-muted);
  margin-top: 0.25rem;
  display: block;
  line-height: 1.4;
`;

export const Select = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  font-family: var(--admin-font-body);
  font-size: 0.95rem;
  color: var(--admin-text);
  background: var(--admin-surface);
  border: 1px solid var(--admin-glass-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--admin-accent);
    background: var(--admin-surface-hover);
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
  font-family: var(--admin-font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.85rem 1.5rem;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
  
  background: ${p => 
    p.$variant === 'danger' ? 'var(--admin-danger)' : 
    p.$variant === 'secondary' ? 'transparent' : 
    'var(--admin-accent)'};
  color: ${p => 
    p.$variant === 'secondary' ? 'var(--admin-text)' : 
    p.$variant === 'danger' ? 'white' :
    '#0a150a'};
  border: ${p => 
    p.$variant === 'secondary' ? '1px solid var(--admin-glass-border)' : 
    'none'};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SmallButton = styled.button`
  font-family: var(--admin-font-body);
  font-size: 0.65rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  background: ${p => 
    p.$variant === 'success' ? 'var(--admin-success-muted)' : 
    p.$variant === 'danger' ? 'var(--admin-danger-muted)' : 
    'var(--admin-surface)'};
  color: ${p => 
    p.$variant === 'success' ? 'var(--admin-success)' : 
    p.$variant === 'danger' ? 'var(--admin-danger)' : 
    'var(--admin-text-secondary)'};
  border: 1px solid ${p => 
    p.$variant === 'success' ? 'rgba(76, 175, 80, 0.3)' : 
    p.$variant === 'danger' ? 'rgba(239, 83, 80, 0.3)' : 
    'var(--admin-glass-border)'};
  
  &:hover { opacity: 0.8; }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// ============================================
// LAYOUT HELPERS
// ============================================

export const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const GridRow = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$cols || '1fr 1fr'};
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--admin-glass-border);
  margin: 1.5rem 0;
`;

// ============================================
// ENTRIES & ITEMS
// ============================================

export const EntryCard = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: background 0.3s ease;
  
  &:last-child { border-bottom: none; }
  &:hover { background: var(--admin-surface-hover); }
`;

export const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const EntryName = styled.span`
  font-weight: 500;
  color: var(--admin-text);
`;

export const EntryContent = styled.p`
  font-size: 0.9rem;
  color: var(--admin-text-secondary);
  margin: 0;
  line-height: 1.6;
`;

export const EntryMeta = styled.div`
  font-size: 0.75rem;
  color: var(--admin-text-dim);
  margin-top: 0.5rem;
`;

export const EntryActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

export const ItemCard = styled.div`
  background: var(--admin-surface);
  border: 1px solid var(--admin-glass-border);
  border-radius: 14px;
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
  font-family: var(--admin-font-display);
  font-size: 0.9rem;
  color: var(--admin-accent);
`;

export const ItemActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

// ============================================
// ALERTS & SEARCH
// ============================================

export const AlertBox = styled.div`
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  border-radius: 10px;
  
  background: ${p => 
    p.$type === 'success' ? 'var(--admin-success-muted)' : 
    p.$type === 'warning' ? 'var(--admin-warning-muted)' : 
    'rgba(52, 152, 219, 0.1)'};
  color: ${p => 
    p.$type === 'success' ? 'var(--admin-success)' : 
    p.$type === 'warning' ? 'var(--admin-warning)' : 
    'rgba(52, 152, 219, 0.9)'};
  border: 1px solid ${p => 
    p.$type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 
    p.$type === 'warning' ? 'rgba(255, 167, 38, 0.3)' : 
    'rgba(52, 152, 219, 0.3)'};
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.85rem 1.25rem;
  font-family: var(--admin-font-body);
  font-size: 0.9rem;
  color: var(--admin-text);
  background: var(--admin-surface);
  border: 1px solid var(--admin-glass-border);
  border-radius: 10px;
  
  &:focus {
    outline: none;
    border-color: var(--admin-accent);
  }
  
  &::placeholder { color: var(--admin-text-dim); }
`;

// ============================================
// PHOTOS
// ============================================

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`;

export const PhotoActions = styled.div`
  display: flex;
  gap: 0.5rem;
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
    'var(--admin-warning)'};
  
  &:hover > div { opacity: 1; }
`;

export const PhotoImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${p => p.$url ? `url(${p.$url}) center/cover` : 'var(--admin-surface)'};
  cursor: pointer;
`;

export const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
`;

export const PhotoButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${p => p.$approve ? 'var(--admin-success)' : 'var(--admin-danger)'};
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s;
  
  &:hover { transform: scale(1.1); }
`;

export const PhotoPending = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--admin-warning);
  color: #0a150a;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.25rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ============================================
// IMAGE UPLOAD
// ============================================

export const DropZone = styled.div`
  border: 2px dashed ${p => 
    p.$dragging ? 'var(--admin-accent)' : 
    p.$hasImage ? 'var(--admin-success)' : 
    'var(--admin-glass-border)'};
  background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : 'var(--admin-surface)'};
  border-radius: 14px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  aspect-ratio: ${p => p.$ratio || 'auto'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--admin-accent);
    background-color: var(--admin-surface-hover);
  }
  
  &:hover .overlay { opacity: 1; }
`;

export const DropOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 12px;
`;

export const DropButton = styled.span`
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  cursor: pointer;
  border-radius: 6px;
  background: ${p => p.$danger ? 'var(--admin-danger)' : 'white'};
  color: ${p => p.$danger ? 'white' : '#0a150a'};
  font-weight: 500;
`;

export const DropPlaceholder = styled.div`
  text-align: center;
  color: var(--admin-text-muted);
  font-size: 0.85rem;
  
  span {
    display: block;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

export const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: var(--admin-accent);
  width: ${p => p.$progress}%;
  transition: width 0.3s;
  border-radius: 0 0 12px 12px;
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const ImageItem = styled.div`
  aspect-ratio: 1;
  background: ${p => p.$url ? `url(${p.$url}) center/cover` : 'var(--admin-surface)'};
  border-radius: 8px;
  position: relative;
  
  &:hover button { opacity: 1; }
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--admin-danger);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s;
`;

export const AddButton = styled.button`
  aspect-ratio: 1;
  background: var(--admin-surface);
  border: 2px dashed var(--admin-glass-border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.65rem;
  color: var(--admin-text-muted);
  transition: all 0.3s ease;
  
  span { font-size: 1.5rem; margin-bottom: 0.25rem; }
  
  &:hover {
    border-color: var(--admin-accent);
    color: var(--admin-text);
  }
`;

// ============================================
// COLORS
// ============================================

export const ColorPalette = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
`;

export const ColorItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ColorInput = styled.input`
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--admin-glass-border);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
`;

// ============================================
// STATUS SECTION
// ============================================

export const StatusDescription = styled.div`
  font-size: 0.9rem;
  color: var(--admin-text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.7;
  
  p { margin: 0.5rem 0; }
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
`;

export const InfoLabel = styled.span`
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--admin-text-dim);
`;

export const InfoValue = styled.span`
  font-size: 0.9rem;
  color: var(--admin-text);
`;

// ============================================
// LOADING & EMPTY
// ============================================

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem;
  
  &::after {
    content: '';
    width: 35px;
    height: 35px;
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
  font-family: var(--admin-font-body);
  
  span {
    display: block;
    font-size: 2.5rem;
    margin-bottom: 1rem;
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
    p.type === 'error' ? 'var(--admin-danger)' : 
    'rgba(52, 152, 219, 0.9)'};
  color: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  animation: ${slideIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  font-size: 0.9rem;
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
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: var(--admin-bg);
  max-width: 450px;
  width: 100%;
  border: 1px solid var(--admin-glass-border);
  border-radius: 16px;
  backdrop-filter: blur(20px);
`;

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--admin-glass-border);
`;

export const ModalTitle = styled.h3`
  font-family: var(--admin-font-display);
  font-size: 1.25rem;
  font-weight: 500;
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

export const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-family: var(--admin-font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 10px;

  background: ${p => p.$primary ? 'var(--admin-accent)' : 'transparent'};
  color: ${p => p.$primary ? '#0a150a' : 'var(--admin-text-secondary)'};
  border: 1px solid ${p => p.$primary ? 'var(--admin-accent)' : 'var(--admin-glass-border)'};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============================================
// LOGO ICON
// ============================================

export const LogoIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: 'var(--admin-accent)' }}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.97C7.14 20.19 7.64 20.39 8.16 20.56L7.5 22.59L9.4 23.25L10.08 21.2C14.6 22.35 19.67 19.97 22 15.5C22 15.5 18 14 17 8Z"/>
  </svg>
);

// ============================================
// WRAPPER & EXPORT
// ============================================

export const BotanicalGlassAdminWrapper = styled.div`
  min-height: 100vh;
  background: var(--admin-bg);
  font-family: var(--admin-font-body);
`;

// Export all components for AdminShell
export const BotanicalGlassAdminComponents = {
  // Login
  LoginContainer, LoginBox, LoginLogo, LoginForm, LoginError, LoginButton, BackLink,
  // Layout
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
  // Entries & Items
  EntryCard, EntryHeader, EntryName, EntryContent, EntryMeta, EntryActions,
  ItemCard, ItemHeader, ItemNumber, ItemActions,
  // Alerts & Search
  AlertBox, SearchInput, ActionButton,
  // Modal
  ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter,
  // Photos
  PhotoGrid, PhotoActions, PhotoCount, PhotoCard, PhotoImage, PhotoOverlay, PhotoButton, PhotoPending,
  // Image Upload
  DropZone, DropOverlay, DropButton, DropPlaceholder, ProgressBar,
  ImageGrid, ImageItem, RemoveButton, AddButton,
  // Colors
  ColorPalette, ColorItem, ColorInput,
  // Status
  StatusDescription, InfoRow, InfoLabel, InfoValue,
  // Loading & Empty
  LoadingSpinner, EmptyState, FeedbackModal,
  // Logo
  LogoIcon,
};

export default BotanicalGlassAdminComponents;
