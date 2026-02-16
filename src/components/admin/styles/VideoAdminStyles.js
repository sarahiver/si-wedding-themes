// VideoAdminStyles.js - Video Theme Admin Dashboard
// Dark, cinematic, dusty blue accents, Inter/Manrope fonts
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

// ============================================
// LOGIN PAGE
// ============================================
export const LoginContainer = styled.div`
  min-height: 100vh;
  --admin-text: rgba(255,255,255,0.85);
  --admin-text-secondary: rgba(255,255,255,0.7);
  --admin-text-muted: rgba(255,255,255,0.5);
  --admin-text-subtle: rgba(255,255,255,0.3);
  --admin-border: rgba(255,255,255,0.12);
  --admin-border-subtle: rgba(255,255,255,0.06);
  --admin-bg-subtle: rgba(255,255,255,0.05);
  --admin-bg-hover: rgba(255,255,255,0.08);
  --admin-glass: rgba(255,255,255,0.03);
  --admin-glass-hover: rgba(255,255,255,0.06);
  --admin-glass-border: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0A0A0A;
`;

export const LoginBox = styled.div`
  background: #1A1A1A;
  border: 1px solid rgba(255,255,255,0.1);
  max-width: 400px;
  width: 90%;
  padding: 3rem 2rem;
  animation: ${fadeIn} 0.8s ease;
`;

export const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #FFFFFF;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #6B8CAE;
    margin-top: 0.5rem;
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LoginError = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #E57373;
  text-align: center;
  padding: 1rem;
  background: rgba(229,115,115,0.1);
  border: 1px solid rgba(229,115,115,0.3);
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: #6B8CAE;
  color: #FFF;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover { background: #8BA5C1; }
`;

export const BackLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
  cursor: pointer;
  
  &:hover { color: #FFF; }
`;

// ============================================
// DASHBOARD LAYOUT
// ============================================
export const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  min-height: 100vh;
  background: #0A0A0A;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
`;

export const Sidebar = styled.aside`
  width: 260px;
  background: #111;
  border-right: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  overflow-y: auto;
  
  @media (max-width: 968px) {
    transform: translateX(${p => p.$open ? '0' : '-100%'});
    transition: transform 0.3s ease;
    box-shadow: ${p => p.$open ? '0 0 50px rgba(0,0,0,0.5)' : 'none'};
  }
`;

export const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
`;

export const SidebarTitle = styled.h2`
  font-family: 'Manrope', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #FFF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  span {
    font-weight: 400;
    color: #6B8CAE;
  }
`;

export const SidebarLogo = styled.div`
  font-family: 'Manrope', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #FFF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const SidebarSub = styled.p`
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #6B8CAE;
  margin-top: 0.25rem;
`;

export const SidebarNav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
`;

export const NavSection = styled.div`
  margin-bottom: 1rem;
`;

export const NavSectionTitle = styled.div`
  padding: 1rem 1.5rem 0.5rem;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
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
  color: ${p => p.$active ? '#FFF' : 'rgba(255,255,255,0.5)'};
  background: ${p => p.$active ? 'rgba(107,140,174,0.15)' : 'transparent'};
  border: none;
  border-left: 2px solid ${p => p.$active ? '#6B8CAE' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255,255,255,0.05);
    color: #FFF;
  }
`;

export const NavBadge = styled.span`
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  background: ${p => p.$warning ? '#6B8CAE' : 'rgba(255,255,255,0.1)'};
  color: ${p => p.$warning ? '#FFF' : 'rgba(255,255,255,0.6)'};
`;

export const NavDivider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin: 1rem 1.5rem;
`;

export const Main = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  max-width: 900px;
  height: 100vh;
  overflow-y: auto;
  background: #0A0A0A;
  
  @media (max-width: 968px) {
    margin-left: 0;
    padding: 1.5rem;
    padding-top: 4rem;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 80px;
    height: 2px;
    background: #6B8CAE;
  }
`;

export const PageTitle = styled.h1`
  font-family: 'Manrope', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  color: #FFF;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

export const MobileMenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 101;
  background: #111;
  border: 1px solid rgba(255,255,255,0.1);
  color: #FFF;
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  cursor: pointer;
  
  @media (max-width: 968px) {
    display: block;
  }
`;

export const SidebarOverlay = styled.div`
  display: none;
  
  @media (max-width: 968px) {
    display: ${p => p.$open ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99;
  }
`;

// ============================================
// PANELS & CARDS
// ============================================
export const Panel = styled.div`
  background: #252525;
  border: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.5s ease;
`;

export const PanelHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PanelTitle = styled.h3`
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #FFF;
`;

export const PanelContent = styled.div`
  padding: 1.5rem;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: #252525;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1.5rem;
`;

export const StatNumber = styled.div`
  font-family: 'Manrope', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #FFF;
`;

export const StatLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  margin-top: 0.25rem;
`;

// ============================================
// FORM ELEMENTS
// ============================================
export const FormGroup = styled.div`
  margin-bottom: ${p => p.$mb || '1.25rem'};
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 0.5rem;
`;

export const SectionLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6B8CAE;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  color: #FFF;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6B8CAE;
    background: rgba(255,255,255,0.08);
  }
  
  &::placeholder { color: #555; }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  color: #FFF;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #6B8CAE;
  }
  
  &::placeholder { color: #555; }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  color: #FFF;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #6B8CAE;
  }
  
  option { background: #252525; }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  accent-color: #6B8CAE;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #CCC;
  cursor: pointer;
`;

export const HelpText = styled.p`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.5rem;
`;

export const ErrorText = styled.p`
  font-size: 0.75rem;
  color: #E57373;
  margin-top: 0.5rem;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  color: #FFF;
  
  &:focus {
    outline: none;
    border-color: #6B8CAE;
  }
  
  &::placeholder { color: #555; }
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
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: #6B8CAE;
  color: #FFF;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { background: #8BA5C1; }
  &:disabled { background: #444; cursor: not-allowed; }
  
  ${p => p.$secondary && css`
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    &:hover { background: rgba(255,255,255,0.05); border-color: #6B8CAE; }
  `}
  
  ${p => p.$danger && css`
    background: #C62828;
    &:hover { background: #B71C1C; }
  `}
`;

export const SmallButton = styled.button`
  padding: 0.5rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: ${p => p.$active ? '#6B8CAE' : 'transparent'};
  color: ${p => p.$active ? '#FFF' : '#888'};
  border: 1px solid ${p => p.$active ? '#6B8CAE' : 'rgba(255,255,255,0.15)'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { border-color: #6B8CAE; color: #FFF; }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 1.5rem 0;
`;

// ============================================
// IMAGE UPLOAD
// ============================================
export const DropZone = styled.div`
  position: relative;
  aspect-ratio: ${p => p.$ratio || '16/9'};
  max-width: 300px;
  background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : 'rgba(255,255,255,0.03)'};
  border: 2px dashed ${p => p.$dragging ? '#6B8CAE' : 'rgba(255,255,255,0.15)'};
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: #6B8CAE;
    .overlay { opacity: 1; }
  }
`;

export const DropOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

export const DropPlaceholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #666;
  font-size: 0.85rem;
  
  span { font-size: 2rem; }
`;

export const DropButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${p => p.$danger ? '#C62828' : '#6B8CAE'};
  color: #FFF;
  border: none;
  cursor: pointer;
  
  &:hover { opacity: 0.9; }
`;

export const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255,255,255,0.1);
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${p => p.$progress}%;
    background: #6B8CAE;
    transition: width 0.3s ease;
  }
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  gap: 0.5rem;
`;

export const ImageItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: url(${p => p.$src}) center/cover;
  border: 1px solid rgba(255,255,255,0.1);
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background: rgba(198,40,40,0.9);
  color: #FFF;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AddButton = styled.button`
  aspect-ratio: 1;
  background: rgba(255,255,255,0.03);
  border: 2px dashed rgba(255,255,255,0.15);
  color: #666;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #6B8CAE;
    color: #6B8CAE;
  }
`;

// ============================================
// TABLE
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
  color: #888;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

export const Td = styled.td`
  padding: 1rem;
  font-size: 0.9rem;
  color: #CCC;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  
  &:first-child { font-weight: 500; color: #FFF; }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${p => p.$variant === 'success' ? 'rgba(76,175,80,0.2)' : p.$variant === 'error' ? 'rgba(244,67,54,0.2)' : 'rgba(107,140,174,0.2)'};
  color: ${p => p.$variant === 'success' ? '#81C784' : p.$variant === 'error' ? '#E57373' : '#8BA5C1'};
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${p => p.$status === 'confirmed' ? 'rgba(76,175,80,0.2)' : p.$status === 'declined' ? 'rgba(244,67,54,0.2)' : 'rgba(255,193,7,0.2)'};
  color: ${p => p.$status === 'confirmed' ? '#81C784' : p.$status === 'declined' ? '#E57373' : '#FFD54F'};
`;

// ============================================
// ENTRY CARDS (Guestbook, etc.)
// ============================================
export const EntryCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1.25rem;
  margin-bottom: 1rem;
`;

export const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

export const EntryName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #FFF;
`;

export const EntryContent = styled.p`
  font-size: 0.9rem;
  color: #AAA;
  line-height: 1.6;
`;

export const EntryMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: #666;
`;

export const EntryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// ============================================
// ITEM CARDS (Timeline, FAQ, etc.)
// ============================================
export const ItemCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
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
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B8CAE;
`;

export const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// ============================================
// PHOTOS
// ============================================
export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

export const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #1A1A1A;
  overflow: hidden;
`;

export const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  transition: opacity 0.2s ease;
  
  ${PhotoCard}:hover & {
    opacity: 1;
  }
`;

export const PhotoButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${p => p.$danger ? '#C62828' : '#6B8CAE'};
  color: #FFF;
  border: none;
  cursor: pointer;
`;

export const PhotoPending = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #FF9800;
  color: #FFF;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
`;

export const PhotoCaption = styled.p`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  background: rgba(0,0,0,0.8);
  font-size: 0.8rem;
  color: #CCC;
`;

export const PhotoActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const PhotoCount = styled.span`
  font-size: 0.85rem;
  color: #888;
`;

// ============================================
// COLOR PALETTE
// ============================================
export const ColorPalette = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const ColorItem = styled.button`
  width: 40px;
  height: 40px;
  background: ${p => p.$color};
  border: 2px solid ${p => p.$active ? '#FFF' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { transform: scale(1.1); }
`;

export const ColorInput = styled.input`
  width: 60px;
  height: 40px;
  padding: 0;
  border: none;
  cursor: pointer;
`;

// ============================================
// STATUS & INFO
// ============================================
export const StatusDescription = styled.p`
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 1.5rem;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
`;

export const InfoLabel = styled.span`
  font-size: 0.85rem;
  color: #888;
`;

export const InfoValue = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: #FFF;
`;

export const AlertBox = styled.div`
  padding: 1rem 1.25rem;
  background: ${p => p.$type === 'warning' ? 'rgba(255,152,0,0.1)' : p.$type === 'error' ? 'rgba(244,67,54,0.1)' : 'rgba(107,140,174,0.1)'};
  border: 1px solid ${p => p.$type === 'warning' ? 'rgba(255,152,0,0.3)' : p.$type === 'error' ? 'rgba(244,67,54,0.3)' : 'rgba(107,140,174,0.3)'};
  color: ${p => p.$type === 'warning' ? '#FFB74D' : p.$type === 'error' ? '#E57373' : '#8BA5C1'};
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

// ============================================
// MISC
// ============================================
export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255,255,255,0.1);
    border-top-color: #6B8CAE;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  
  p { font-size: 1rem; margin-bottom: 1rem; }
  span { font-size: 3rem; display: block; margin-bottom: 1rem; }
`;

export const FeedbackModal = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: ${p => p.$type === 'success' ? '#2E7D32' : p.$type === 'error' ? '#C62828' : '#6B8CAE'};
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
  cursor: pointer;
`;

// MODAL
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: #0A0A0A;
  max-width: 450px;
  width: 100%;
  border: 1px solid rgba(107, 140, 174, 0.3);
  animation: ${fadeIn} 0.3s ease;
`;

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(107, 140, 174, 0.2);
`;

export const ModalTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6B8CAE;
  margin: 0;
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.6;
  
  p { margin: 0; }
`;

export const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(107, 140, 174, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
  
  ${p => p.$primary ? css`
    background: #6B8CAE;
    border-color: #6B8CAE;
    color: #FFF;
    
    &:hover:not(:disabled) {
      background: #7A9BBD;
    }
  ` : css`
    background: transparent;
    border-color: rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.7);
    
    &:hover:not(:disabled) {
      border-color: rgba(255,255,255,0.4);
      color: #FFF;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #6B8CAE;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: #FFF;
`;

// ============================================
export const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.25rem;
`;
// EXPORT ALL COMPONENTS
// ============================================
export const VideoAdminComponents = {
  // Login
  LoginContainer, LoginBox, LoginLogo, LoginForm, LoginError, LoginButton, BackLink,
  
  // Layout
  DashboardContainer, Sidebar, SidebarHeader, SidebarLogo, SidebarTitle, SidebarSub, SidebarNav,
  NavSection, NavSectionTitle, NavItem, NavBadge, NavDivider,
  Main, Header, PageTitle, MobileMenuToggle, SidebarOverlay,
  
  // Stats
  StatsGrid, StatCard, StatNumber, StatLabel, Card,
  
  // Panels
  Panel, PanelHeader, PanelTitle, PanelContent,
  
  // Tables
  TableWrapper, Table, Th, Td, StatusBadge, Badge,
  
  // Forms
  FormGroup, FormRow, Label, SectionLabel, Input, TextArea, Select, 
  Checkbox, CheckboxLabel, HelpText, ErrorText, SearchInput,
  
  // Buttons
  Button, SmallButton, ButtonGroup, ActionBar, GridRow, Divider,
  
  // Entry Cards
  EntryCard, EntryHeader, EntryName, EntryContent, EntryMeta, EntryActions,
  
  // Item Cards
  ItemCard, ItemHeader, ItemNumber, ItemActions,
  
  // Photos
  PhotoGrid, PhotoCard, PhotoImage, PhotoOverlay, PhotoButton, PhotoPending, PhotoCaption, PhotoActions, PhotoCount,
  
  // Image Upload
  DropZone, DropOverlay, DropButton, DropPlaceholder, ProgressBar,
  ImageGrid, ImageItem, RemoveButton, AddButton,
  
  // Color
  ColorPalette, ColorItem, ColorInput,
  
  // Status
  StatusDescription, InfoRow, InfoLabel, InfoValue, AlertBox, ActionButton,
  
  // Modal
  ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter,
  
  // Misc
  LoadingSpinner, EmptyState, FeedbackModal, LogoIcon,
};

export default VideoAdminComponents;
