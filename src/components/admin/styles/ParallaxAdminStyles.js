// ParallaxAdminStyles.js - Parallax Theme Admin Dashboard
// White theme, DM Sans, sharp edges, black/white minimal design
import styled, { keyframes, css } from 'styled-components';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

// ============================================
// LOGIN PAGE - Clean, white, minimal
// ============================================
export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  --admin-text: rgba(0,0,0,0.85);
  --admin-text-secondary: rgba(0,0,0,0.7);
  --admin-text-muted: rgba(0,0,0,0.5);
  --admin-text-subtle: rgba(0,0,0,0.3);
  --admin-border: rgba(0,0,0,0.12);
  --admin-border-subtle: rgba(0,0,0,0.06);
  --admin-bg-subtle: rgba(0,0,0,0.03);
  --admin-bg-hover: rgba(0,0,0,0.06);
  --admin-glass: rgba(0,0,0,0.02);
  --admin-glass-hover: rgba(0,0,0,0.04);
  --admin-glass-border: rgba(0,0,0,0.06);
  position: relative;
  overflow: hidden;

  &::before {
    content: 'ADMIN';
    position: absolute;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(15rem, 40vw, 35rem);
    font-weight: 800;
    color: rgba(0, 0, 0, 0.04);
    letter-spacing: -0.05em;
    text-transform: uppercase;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const LoginBox = styled.div`
  background: transparent;
  max-width: 400px;
  width: 90%;
  padding: 3rem 2rem;
  position: relative;
  animation: ${fadeIn} 0.8s ease;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: #000;
  }
`;

export const LoginLogo = styled.div`
  margin-bottom: 3rem;

  h1 {
    font-family: 'DM Sans', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    color: #000;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 1.5rem 0 0.5rem;

    span {
      display: block;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      font-style: normal;
      text-transform: none;
      letter-spacing: 0.1em;
      color: rgba(0, 0, 0, 0.5);
      margin-top: 0.5rem;
    }
  }

  p {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #000;
    margin-top: 1rem;
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const LoginError = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  color: #c00;
  text-align: center;
  padding: 1rem;
  background: rgba(200, 0, 0, 0.06);
  border: 1px solid rgba(200, 0, 0, 0.2);
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #222;
    transform: translateY(-2px);
  }
`;

export const BackLink = styled.a`
  display: inline-block;
  margin-top: 2rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.5);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover { color: #000; }
`;

// ============================================
// DASHBOARD LAYOUT
// ============================================
export const DashboardContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: #ffffff;
  color: rgba(0, 0, 0, 0.85);
  font-family: 'DM Sans', sans-serif;
  --admin-text: rgba(0,0,0,0.85);
  --admin-text-secondary: rgba(0,0,0,0.7);
  --admin-text-muted: rgba(0,0,0,0.5);
  --admin-text-subtle: rgba(0,0,0,0.3);
  --admin-border: rgba(0,0,0,0.12);
  --admin-border-subtle: rgba(0,0,0,0.06);
  --admin-bg-subtle: rgba(0,0,0,0.03);
  --admin-bg-hover: rgba(0,0,0,0.06);
  --admin-glass: rgba(0,0,0,0.02);
  --admin-glass-hover: rgba(0,0,0,0.04);
  --admin-glass-border: rgba(0,0,0,0.06);
`;

export const Sidebar = styled.aside`
  width: 280px;
  background: #fafafa;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0; left: 0; bottom: 0;
  padding: 2rem 0;
  overflow-y: auto;
  z-index: 100;

  @media (max-width: 968px) {
    transform: translateX(${p => p.$open ? '0' : '-100%'});
    transition: transform 0.3s ease;
    box-shadow: ${p => p.$open ? '0 0 50px rgba(0,0,0,0.15)' : 'none'};
  }
`;

export const SidebarHeader = styled.div`
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

export const SidebarLogo = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #000;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  span { color: #000; }
`;

export const SidebarSub = styled.p`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 0.5rem;
`;

export const NavSection = styled.div`margin-bottom: 1rem;`;

export const NavSectionTitle = styled.div`
  padding: 1rem 1.5rem 0.5rem;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.4);
`;

export const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.5rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: ${p => p.$active ? '700' : '500'};
  color: ${p => p.$active ? '#000' : 'rgba(0, 0, 0, 0.5)'};
  background: ${p => p.$active ? 'rgba(0, 0, 0, 0.05)' : 'transparent'};
  border: none;
  border-left: 2px solid ${p => p.$active ? '#000' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: #000;
  }
`;

export const NavBadge = styled.span`
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  background: ${p => p.$warning ? '#000' : 'rgba(0, 0, 0, 0.08)'};
  color: ${p => p.$warning ? '#fff' : 'rgba(0, 0, 0, 0.5)'};
`;

export const NavDivider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 1rem 1.5rem;
`;

export const Main = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  min-height: 100vh;
  max-width: 900px;

  @media (max-width: 968px) {
    margin-left: 0;
    padding: 1.5rem;
    padding-top: 4rem;
    max-width: 100%;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 80px;
    height: 2px;
    background: #000;
  }
`;

export const PageTitle = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #000;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1;
`;

export const MobileMenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 1rem; right: 1rem;
  z-index: 101;
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #000;
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  cursor: pointer;

  @media (max-width: 968px) { display: block; }
`;

// ============================================
// STATS
// ============================================
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

export const StatCard = styled.div`
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent);
  }
`;

export const StatNumber = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  color: #000;
  line-height: 1;
`;

export const StatLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 0.5rem;
`;

// ============================================
// PANELS
// ============================================
export const Panel = styled.div`
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.5s ease;
`;

export const PanelHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const PanelTitle = styled.h3`
  font-family: 'DM Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const PanelContent = styled.div`
  padding: 1.5rem;
  max-height: ${p => p.$maxHeight || 'auto'};
  overflow-y: auto;
`;

// ============================================
// TABLES
// ============================================
export const TableWrapper = styled.div`overflow-x: auto;`;
export const Table = styled.table`width: 100%; border-collapse: collapse; font-size: 0.85rem;`;
export const Th = styled.th`
  text-align: left;
  padding: 1rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;
export const Td = styled.td`
  padding: 1rem;
  color: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const StatusBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.3rem 0.6rem;
  background: ${p => p.$status === 'confirmed' ? 'rgba(46, 125, 50, 0.1)' : p.$status === 'declined' ? 'rgba(200, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
  color: ${p => p.$status === 'confirmed' ? '#2E7D32' : p.$status === 'declined' ? '#c00' : 'rgba(0, 0, 0, 0.5)'};
`;

// ============================================
// FORMS
// ============================================
export const FormGroup = styled.div`margin-bottom: ${p => p.$mb || '1.25rem'};`;

export const Label = styled.label`
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 0.5rem;
`;

export const SectionLabel = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #000;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: #000;
  background: #fff;
  border: 1px solid ${p => p.$error ? '#c00' : 'rgba(0, 0, 0, 0.15)'};
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000;
    background: #fff;
  }

  &::placeholder { color: rgba(0, 0, 0, 0.35); }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: #000;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  min-height: 120px;
  resize: vertical;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000;
    background: #fff;
  }

  &::placeholder { color: rgba(0, 0, 0, 0.35); }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  accent-color: #000;
  cursor: pointer;
`;

export const Select = styled.select`
  width: 100%;
  padding: 1rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: #000;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;

  &:focus { outline: none; border-color: #000; }
  option { background: #fff; color: #000; }
`;

export const ErrorText = styled.span`font-size: 0.75rem; color: #c00; margin-top: 0.25rem; display: block;`;
export const HelpText = styled.span`font-size: 0.75rem; color: rgba(0, 0, 0, 0.5); margin-top: 0.25rem; display: block;`;
export const CheckboxLabel = styled.span`font-size: 0.9rem; color: rgba(0, 0, 0, 0.7);`;
export const FormRow = styled.div`display: flex; gap: 1rem; @media (max-width: 600px) { flex-direction: column; }`;

// ============================================
// BUTTONS
// ============================================
export const Button = styled.button`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.85rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${p => {
    if (p.$variant === 'danger') return css`background: #c00; color: #fff; border: none; &:hover { background: #a00; }`;
    if (p.$variant === 'success') return css`background: #2E7D32; color: #fff; border: none; &:hover { background: #1B5E20; }`;
    if (p.$variant === 'secondary') return css`background: transparent; color: rgba(0, 0, 0, 0.6); border: 1px solid rgba(0, 0, 0, 0.2); &:hover { border-color: rgba(0, 0, 0, 0.5); color: #000; }`;
    return css`background: #000; color: #fff; border: none; &:hover { background: #222; }`;
  }}

  &:disabled { background: rgba(0, 0, 0, 0.08); color: rgba(0, 0, 0, 0.35); cursor: not-allowed; }
`;

export const SmallButton = styled.button`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.15);

  ${p => {
    if (p.$variant === 'success') return css`background: rgba(46, 125, 50, 0.1); color: #2E7D32; border-color: rgba(46, 125, 50, 0.3);`;
    if (p.$variant === 'danger') return css`background: rgba(200, 0, 0, 0.08); color: #c00; border-color: rgba(200, 0, 0, 0.3);`;
    return css`background: rgba(0, 0, 0, 0.03); color: rgba(0, 0, 0, 0.7);`;
  }}

  &:hover { opacity: 0.8; }
`;

export const ButtonGroup = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`;

// ============================================
// LAYOUT HELPERS
// ============================================
export const ActionBar = styled.div`display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;`;
export const GridRow = styled.div`display: grid; grid-template-columns: ${p => p.$cols || '1fr 1fr'}; gap: 0.75rem; margin-bottom: 0.75rem;`;
export const Divider = styled.hr`border: none; border-top: 1px solid rgba(0, 0, 0, 0.1); margin: 2rem 0;`;

// ============================================
// ENTRIES
// ============================================
export const EntryCard = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  &:last-child { border-bottom: none; }
  &:hover { background: rgba(0, 0, 0, 0.02); }
`;
export const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;`;
export const EntryName = styled.span`font-weight: 700; color: #000;`;
export const EntryContent = styled.p`font-size: 0.9rem; color: rgba(0, 0, 0, 0.7); margin: 0; line-height: 1.5;`;
export const EntryMeta = styled.div`font-size: 0.75rem; color: rgba(0, 0, 0, 0.45); margin-top: 0.5rem;`;
export const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;

// ============================================
// ITEMS
// ============================================
export const ItemCard = styled.div`border: 1px solid rgba(0, 0, 0, 0.1); padding: 1.25rem; margin-bottom: 1rem; background: rgba(0, 0, 0, 0.02);`;
export const ItemHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
export const ItemNumber = styled.span`font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 800; color: #000;`;
export const ItemActions = styled.div`display: flex; gap: 0.25rem;`;

// ============================================
// ALERTS
// ============================================
export const AlertBox = styled.div`
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  border-left: 3px solid;
  ${p => {
    if (p.$type === 'success') return css`background: rgba(46, 125, 50, 0.06); border-color: #2E7D32; color: #2E7D32;`;
    if (p.$type === 'warning') return css`background: rgba(200, 0, 0, 0.06); border-color: #c00; color: #c00;`;
    if (p.$type === 'info') return css`background: rgba(33, 150, 243, 0.06); border-color: #1976D2; color: #1976D2;`;
    return css`background: rgba(0, 0, 0, 0.03); border-color: rgba(0, 0, 0, 0.3); color: rgba(0, 0, 0, 0.7);`;
  }}
`;

// ============================================
// SEARCH
// ============================================
export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.85rem 1rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #000;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  &:focus { outline: none; border-color: #000; }
  &::placeholder { color: rgba(0, 0, 0, 0.35); }
`;

// ============================================
// PHOTOS
// ============================================
export const PhotoGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem;`;
export const PhotoActions = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center;`;
export const PhotoCount = styled.span`color: rgba(0, 0, 0, 0.5); font-size: 0.8rem;`;
export const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 2px solid ${p => p.$selected ? '#000' : 'rgba(0, 0, 0, 0.1)'};
  transition: all 0.2s ease;
  &:hover > div { opacity: 1; }
`;
export const PhotoImage = styled.div`
  width: 100%; height: 100%;
  background: ${p => p.$url ? `url(${p.$url}) center/cover` : 'rgba(0, 0, 0, 0.04)'};
  transition: opacity 0.3s ease;
  cursor: pointer;
`;
export const PhotoOverlay = styled.div`position: absolute; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; gap: 0.5rem; opacity: 0; transition: opacity 0.2s;`;
export const PhotoButton = styled.button`width: 36px; height: 36px; border-radius: 50%; border: none; background: #000; color: white; cursor: pointer; font-size: 16px; transition: transform 0.2s ease; &:hover { transform: scale(1.1); }`;
export const PhotoPending = styled.div`position: absolute; bottom: 0; left: 0; right: 0; background: #000; color: white; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.3rem; text-align: center;`;
export const PhotoCaption = styled.div`position: absolute; top: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.8); color: white; font-size: 0.65rem; padding: 0.35rem 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;

// ============================================
// UPLOAD
// ============================================
export const DropZone = styled.div`
  border: 2px dashed ${p => p.$dragging ? '#000' : p.$hasImage ? 'rgba(46, 125, 50, 0.5)' : 'rgba(0, 0, 0, 0.15)'};
  background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : 'rgba(0, 0, 0, 0.02)'};
  min-height: 100px;
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  aspect-ratio: ${p => p.$ratio || '16/9'};
  transition: all 0.2s ease;
  &:hover { border-color: #000; }
  &:hover .overlay { opacity: 1; }
`;
export const DropOverlay = styled.div`position: absolute; inset: 0; background: rgba(255, 255, 255, 0.9); display: flex; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0; transition: opacity 0.2s;`;
export const DropButton = styled.span`padding: 0.6rem 1.25rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; background: ${p => p.$danger ? '#c00' : '#000'}; color: #fff;`;
export const DropPlaceholder = styled.div`text-align: center; color: rgba(0, 0, 0, 0.45); font-size: 0.85rem; span { display: block; font-size: 2.5rem; margin-bottom: 0.75rem; }`;
export const ProgressBar = styled.div`position: absolute; bottom: 0; left: 0; height: 3px; background: #000; width: ${p => p.$progress}%; transition: width 0.3s;`;

// ============================================
// MULTI IMAGE
// ============================================
export const ImageGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, 80px); gap: 0.5rem;`;
export const ImageItem = styled.div`aspect-ratio: 1; background: ${p => p.$url ? `url(${p.$url}) center/cover` : 'rgba(0, 0, 0, 0.04)'}; position: relative; &:hover button { opacity: 1; }`;
export const RemoveButton = styled.button`position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; border-radius: 50%; background: #000; color: #fff; border: none; cursor: pointer; font-size: 12px; opacity: 0; transition: opacity 0.2s;`;
export const AddButton = styled.button`aspect-ratio: 1; background: rgba(0, 0, 0, 0.02); border: 2px dashed rgba(0, 0, 0, 0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; color: rgba(0, 0, 0, 0.5); transition: all 0.2s ease; span { font-size: 1.5rem; } &:hover { border-color: #000; color: #000; }`;

// ============================================
// COLORS
// ============================================
export const ColorPalette = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: flex-end;`;
export const ColorItem = styled.div`display: flex; flex-direction: column; gap: 0.25rem;`;
export const ColorInput = styled.input`width: 44px; height: 44px; padding: 0; border: 2px solid rgba(0, 0, 0, 0.1); cursor: pointer; background: transparent; &:hover { border-color: rgba(0, 0, 0, 0.5); }`;

// ============================================
// STATUS
// ============================================
export const StatusDescription = styled.div`font-size: 0.9rem; color: rgba(0, 0, 0, 0.7); margin-bottom: 1.5rem; line-height: 1.7; p { margin: 0.5rem 0; } strong { color: #000; }`;
export const InfoRow = styled.div`display: flex; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1px solid rgba(0, 0, 0, 0.06);`;
export const InfoLabel = styled.span`font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(0, 0, 0, 0.5);`;
export const InfoValue = styled.span`font-size: 0.9rem; color: #000;`;

// ============================================
// LOADING & EMPTY
// ============================================
export const LoadingSpinner = styled.div`display: flex; justify-content: center; padding: 3rem; &::after { content: ''; width: 40px; height: 40px; border: 2px solid rgba(0, 0, 0, 0.1); border-top-color: #000; border-radius: 50%; animation: ${spin} 0.8s linear infinite; }`;
export const EmptyState = styled.p`text-align: center; color: rgba(0, 0, 0, 0.5); padding: 3rem; font-size: 0.9rem;`;

// ============================================
// MODAL
// ============================================
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: #fff;
  max-width: 450px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease;
`;

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h3`
  font-family: 'DM Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #000;
  margin: 0;
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  color: rgba(0, 0, 0, 0.8);
  line-height: 1.6;

  p { margin: 0; }
`;

export const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

// ============================================
// ACTION BUTTON
// ============================================
export const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid;

  ${p => p.$primary ? css`
    background: #000;
    border-color: #000;
    color: #fff;

    &:hover:not(:disabled) {
      background: #222;
      border-color: #222;
    }
  ` : css`
    background: transparent;
    border-color: rgba(0, 0, 0, 0.3);
    color: rgba(0, 0, 0, 0.6);

    &:hover:not(:disabled) {
      border-color: rgba(0, 0, 0, 0.6);
      color: #000;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============================================
// FEEDBACK - Toast oben rechts
// ============================================
export const FeedbackModal = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  padding: 1rem 1.5rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${p => p.type === 'success' ? '#2E7D32' : p.type === 'error' ? '#c00' : '#333'};
  color: white;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.3s ease;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 250px;

  &::before {
    content: '${p => p.type === 'success' ? '\u2713' : p.type === 'error' ? '\u2715' : '\u2139'}';
    font-size: 1.2rem;
  }
`;

export const LogoIcon = null;

// ============================================
export const Card = styled.div`
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.25rem;
`;

// ============================================
// EXPORT
// ============================================
export const ParallaxAdminComponents = {
  LoginContainer, LoginBox, LoginLogo, LoginForm, LoginError, LoginButton, BackLink,
  DashboardContainer, Sidebar, SidebarHeader, SidebarLogo, SidebarSub,
  NavSection, NavSectionTitle, NavItem, NavBadge, NavDivider,
  Main, Header, PageTitle, MobileMenuToggle,
  StatsGrid, StatCard, StatNumber, StatLabel, Card,
  Panel, PanelHeader, PanelTitle, PanelContent,
  TableWrapper, Table, Th, Td, StatusBadge,
  FormGroup, Label, SectionLabel, Input, TextArea, Checkbox, CheckboxLabel, ErrorText, HelpText, Select, FormRow,
  Button, SmallButton, ButtonGroup,
  ActionBar, GridRow, Divider,
  EntryCard, EntryHeader, EntryName, EntryContent, EntryMeta, EntryActions,
  ItemCard, ItemHeader, ItemNumber, ItemActions,
  AlertBox, SearchInput, ActionButton,
  ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter,
  PhotoGrid, PhotoActions, PhotoCount, PhotoCard, PhotoImage, PhotoOverlay, PhotoButton, PhotoPending, PhotoCaption,
  DropZone, DropOverlay, DropButton, DropPlaceholder, ProgressBar,
  ImageGrid, ImageItem, RemoveButton, AddButton,
  ColorPalette, ColorItem, ColorInput,
  StatusDescription, InfoRow, InfoLabel, InfoValue,
  LoadingSpinner, EmptyState, FeedbackModal,
  LogoIcon,
};

export default ParallaxAdminComponents;
