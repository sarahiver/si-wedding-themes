// themes/botanical/BotanicalAdminStyles.js - ONLY STYLES, NO LOGIC
import styled, { keyframes } from 'styled-components';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const spin = keyframes`to { transform: rotate(360deg); }`;

// ============================================
// BOTANICAL THEME STYLES
// ============================================

// Login
export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%);
`;

export const LoginBox = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 420px;
  width: 90%;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(45, 59, 45, 0.15);
  animation: ${fadeIn} 0.6s ease;
`;

export const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 400;
    color: var(--forest);
    span { font-style: italic; color: var(--sage); }
  }
  p { font-size: 0.85rem; color: var(--text-light); margin-top: 0.5rem; }
`;

export const LoginForm = styled.form`display: flex; flex-direction: column; gap: 1.5rem;`;
export const LoginError = styled.p`font-size: 0.85rem; color: #C62828; text-align: center; padding: 1rem; background: rgba(198, 40, 40, 0.1); border-radius: 8px; margin-bottom: 1rem;`;
export const LoginButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;
export const BackLink = styled.a`display: block; text-align: center; margin-top: 2rem; font-size: 0.85rem; color: var(--text-light); text-decoration: none; cursor: pointer; &:hover { color: var(--forest); }`;

// Dashboard Layout
export const DashboardContainer = styled.div`min-height: 100vh; display: flex; background: var(--cream);`;

export const Sidebar = styled.aside`
  width: 280px;
  background: white;
  border-right: 1px solid var(--sage-light);
  position: fixed;
  top: 0; left: 0; bottom: 0;
  padding: 2rem 0;
  overflow-y: auto;
  z-index: 100;
  @media (max-width: 968px) {
    transform: translateX(${p => p.$open ? '0' : '-100%'});
    transition: transform 0.3s ease;
  }
`;

export const SidebarHeader = styled.div`padding: 0 1.5rem 2rem; border-bottom: 1px solid var(--cream-dark); margin-bottom: 1rem;`;

export const SidebarLogo = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  color: var(--forest);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  span { font-style: italic; color: var(--sage); }
`;

export const SidebarSub = styled.p`font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-top: 0.25rem;`;
export const NavSection = styled.div`margin-bottom: 0.5rem;`;
export const NavSectionTitle = styled.div`padding: 0.75rem 1.5rem 0.5rem; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted);`;

export const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: ${p => p.$active ? 'var(--forest)' : 'var(--text-light)'};
  background: ${p => p.$active ? 'var(--sage-muted)' : 'transparent'};
  border: none;
  border-left: 3px solid ${p => p.$active ? 'var(--sage)' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  &:hover { background: var(--cream); }
`;

export const NavBadge = styled.span`
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  background: ${p => p.$warning ? 'rgba(230, 81, 0, 0.15)' : 'var(--sage)'};
  color: ${p => p.$warning ? '#E65100' : 'white'};
`;

export const NavDivider = styled.div`height: 1px; background: var(--cream-dark); margin: 1rem 1.5rem;`;

export const Main = styled.main`flex: 1; margin-left: 280px; padding: 2rem; @media (max-width: 968px) { margin-left: 0; }`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--sage-light);
`;

export const PageTitle = styled.h1`font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 400; color: var(--forest);`;

export const MobileMenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 1rem; right: 1rem;
  z-index: 101;
  background: white;
  border: 1px solid var(--sage-light);
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  @media (max-width: 968px) { display: block; }
`;

// Stats
export const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;

export const StatCard = styled.div`
  background: white;
  border: 1px solid var(--sage-light);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
`;

export const StatNumber = styled.div`font-family: 'Playfair Display', serif; font-size: 2.5rem; color: var(--sage);`;
export const StatLabel = styled.div`font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-light); margin-top: 0.25rem;`;

// Panels
export const Panel = styled.div`background: white; border: 1px solid var(--sage-light); border-radius: 12px; margin-bottom: 1.5rem; overflow: hidden;`;
export const PanelHeader = styled.div`padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--cream-dark); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;`;
export const PanelTitle = styled.h3`font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 400; color: var(--forest);`;
export const PanelContent = styled.div`padding: 1.5rem; max-height: ${p => p.$maxHeight || 'auto'}; overflow-y: auto;`;

// Tables
export const TableWrapper = styled.div`overflow-x: auto;`;
export const Table = styled.table`width: 100%; border-collapse: collapse; font-size: 0.85rem;`;
export const Th = styled.th`text-align: left; padding: 1rem; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-light); border-bottom: 1px solid var(--sage-light);`;
export const Td = styled.td`padding: 1rem; border-bottom: 1px solid var(--cream-dark); color: var(--text);`;

export const StatusBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  background: ${p => p.$status === 'confirmed' ? 'rgba(139, 157, 131, 0.2)' : p.$status === 'declined' ? 'rgba(198, 40, 40, 0.1)' : 'rgba(230, 81, 0, 0.1)'};
  color: ${p => p.$status === 'confirmed' ? 'var(--sage-dark)' : p.$status === 'declined' ? '#C62828' : '#E65100'};
`;

// Forms
export const FormGroup = styled.div`margin-bottom: 1rem;`;
export const Label = styled.label`display: block; font-family: 'Lato', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-light); margin-bottom: 0.5rem;`;
export const SectionLabel = styled.div`font-family: 'Lato', sans-serif; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--forest); margin: 1.5rem 0 1rem;`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  border: 1px solid ${p => p.$error ? '#C62828' : 'var(--sage-light)'};
  border-radius: 10px;
  background: var(--cream);
  color: var(--forest);
  box-sizing: border-box;
  &:focus { outline: none; border-color: var(--sage); box-shadow: 0 0 0 3px var(--sage-muted); }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  background: var(--cream);
  color: var(--forest);
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;
  &:focus { outline: none; border-color: var(--sage); box-shadow: 0 0 0 3px var(--sage-muted); }
`;

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
  cursor: pointer;
  input { width: 18px; height: 18px; accent-color: var(--sage); }
`;

export const ErrorText = styled.span`font-size: 0.75rem; color: #C62828; margin-top: 0.25rem; display: block;`;

// Buttons
export const Button = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: ${p => p.$variant === 'danger' ? '#C62828' : p.$variant === 'secondary' ? 'white' : 'var(--sage)'};
  color: ${p => p.$variant === 'secondary' ? 'var(--forest)' : 'white'};
  border: ${p => p.$variant === 'secondary' ? '1px solid var(--sage-light)' : 'none'};
  &:hover { opacity: 0.9; }
  &:disabled { background: var(--sage-light); cursor: not-allowed; }
`;

export const SmallButton = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border: 1px solid var(--sage-light);
  border-radius: 6px;
  background: ${p => p.$variant === 'success' ? 'rgba(139, 157, 131, 0.15)' : p.$variant === 'danger' ? 'rgba(198, 40, 40, 0.1)' : 'white'};
  color: ${p => p.$variant === 'success' ? 'var(--sage-dark)' : p.$variant === 'danger' ? '#C62828' : 'var(--text-light)'};
  transition: all 0.2s ease;
  &:hover { opacity: 0.8; }
`;

export const ButtonGroup = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`;

// Layout Helpers
export const ActionBar = styled.div`display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;`;
export const GridRow = styled.div`display: grid; grid-template-columns: ${p => p.$cols || '1fr 1fr'}; gap: 0.75rem; margin-bottom: 0.75rem;`;
export const Divider = styled.hr`border: none; border-top: 1px solid var(--cream-dark); margin: 1.5rem 0;`;

// Entries
export const EntryCard = styled.div`padding: 1.25rem; border-bottom: 1px solid var(--cream-dark); &:last-child { border-bottom: none; }`;
export const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;`;
export const EntryName = styled.span`font-weight: 500; color: var(--forest);`;
export const EntryContent = styled.p`font-size: 0.9rem; color: var(--text-light); margin: 0; line-height: 1.6;`;
export const EntryMeta = styled.div`font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;`;
export const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;

// Items (for list editors)
export const ItemCard = styled.div`border: 1px solid var(--sage-light); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; background: var(--cream);`;
export const ItemHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
export const ItemNumber = styled.span`font-family: 'Playfair Display', serif; font-size: 0.9rem; color: var(--sage);`;
export const ItemActions = styled.div`display: flex; gap: 0.25rem;`;

// Alerts
export const AlertBox = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  border-radius: 8px;
  background: ${p => p.$type === 'success' ? 'rgba(139, 157, 131, 0.15)' : p.$type === 'warning' ? 'rgba(230, 81, 0, 0.1)' : 'rgba(52, 152, 219, 0.1)'};
  color: ${p => p.$type === 'success' ? 'var(--sage-dark)' : p.$type === 'warning' ? '#E65100' : '#1565C0'};
`;

// Search
export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  border: 1px solid var(--sage-light);
  border-radius: 8px;
  background: white;
  &:focus { outline: none; border-color: var(--sage); }
`;

// Photos
export const PhotoGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;`;
export const PhotoActions = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center;`;
export const PhotoCount = styled.span`color: var(--text-muted); font-size: 0.8rem;`;

export const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${p => p.$selected ? 'var(--sage)' : p.$approved ? 'var(--sage-light)' : 'rgba(230, 81, 0, 0.3)'};
  &:hover > div { opacity: 1; }
`;

export const PhotoImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${p => p.$url ? `url(${p.$url}) center/cover` : 'var(--cream-dark)'};
  cursor: pointer;
`;

export const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(45, 59, 45, 0.7);
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
  background: ${p => p.$approve ? 'var(--sage)' : 'rgba(198, 40, 40, 0.9)'};
  color: white;
  cursor: pointer;
  font-size: 14px;
`;

export const PhotoPending = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(230, 81, 0, 0.9);
  color: white;
  font-size: 0.65rem;
  padding: 0.25rem;
  text-align: center;
`;

// Image Upload
export const DropZone = styled.div`
  border: 2px dashed ${p => p.$dragging ? 'var(--sage)' : p.$hasImage ? 'var(--sage)' : 'var(--sage-light)'};
  background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : 'var(--cream)'};
  border-radius: 12px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  aspect-ratio: ${p => p.$ratio || 'auto'};
  transition: all 0.3s ease;
  &:hover { border-color: var(--sage); }
  &:hover .overlay { opacity: 1; }
`;

export const DropOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(45, 59, 45, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 10px;
`;

export const DropButton = styled.span`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: 6px;
  background: ${p => p.$danger ? 'rgba(198, 40, 40, 0.9)' : 'white'};
  color: ${p => p.$danger ? 'white' : 'var(--forest)'};
`;

export const DropPlaceholder = styled.div`
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  span { display: block; font-size: 2rem; margin-bottom: 0.5rem; }
`;

export const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: var(--sage);
  width: ${p => p.$progress}%;
  transition: width 0.3s;
  border-radius: 0 0 10px 10px;
`;

// Multi Image Upload
export const ImageGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem; margin-top: 0.5rem;`;
export const ImageItem = styled.div`aspect-ratio: 1; background: ${p => p.$url ? `url(${p.$url}) center/cover` : 'var(--cream-dark)'}; border-radius: 8px; position: relative; &:hover button { opacity: 1; }`;
export const RemoveButton = styled.button`position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; background: rgba(198, 40, 40, 0.9); color: white; border: none; cursor: pointer; font-size: 14px; opacity: 0; transition: opacity 0.2s;`;
export const AddButton = styled.button`aspect-ratio: 1; background: var(--cream); border: 2px dashed var(--sage-light); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; color: var(--text-muted); span { font-size: 1.5rem; } &:hover { border-color: var(--sage); color: var(--forest); }`;

// Colors
export const ColorPalette = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: flex-end;`;
export const ColorItem = styled.div`display: flex; flex-direction: column; gap: 0.25rem;`;
export const ColorInput = styled.input`width: 40px; height: 40px; padding: 0; border: 1px solid var(--sage-light); border-radius: 6px; cursor: pointer;`;

// Status Section
export const StatusDescription = styled.div`font-size: 0.9rem; color: var(--text-light); margin-bottom: 1.5rem; line-height: 1.6; p { margin: 0.5rem 0; }`;
export const InfoRow = styled.div`display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--cream-dark);`;
export const InfoLabel = styled.span`font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted);`;
export const InfoValue = styled.span`font-size: 0.9rem; color: var(--forest);`;

// Loading & Empty
export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
  &::after {
    content: '';
    width: 30px;
    height: 30px;
    border: 2px solid var(--sage-light);
    border-top-color: var(--sage);
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

export const EmptyState = styled.p`text-align: center; color: var(--text-muted); padding: 2rem; font-family: 'Lato', sans-serif;`;

// Feedback Modal
export const FeedbackModal = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: ${p => p.type === 'success' ? 'var(--sage)' : p.type === 'error' ? '#C62828' : '#1565C0'};
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
`;

// Leaf Icon (Theme specific)
export const LogoIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: 'var(--sage)' }}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.97C7.14 20.19 7.64 20.39 8.16 20.56L7.5 22.59L9.4 23.25L10.08 21.2C14.6 22.35 19.67 19.97 22 15.5C22 15.5 18 14 17 8Z"/>
  </svg>
);

// Export all as single object for easy passing to AdminShell
export const BotanicalAdminComponents = {
  LoginContainer, LoginBox, LoginLogo, LoginForm, LoginError, LoginButton, BackLink,
  DashboardContainer, Sidebar, SidebarHeader, SidebarLogo, SidebarSub,
  NavSection, NavSectionTitle, NavItem, NavBadge, NavDivider,
  Main, Header, PageTitle, MobileMenuToggle,
  StatsGrid, StatCard, StatNumber, StatLabel,
  Panel, PanelHeader, PanelTitle, PanelContent,
  TableWrapper, Table, Th, Td, StatusBadge,
  FormGroup, Label, SectionLabel, Input, TextArea, Checkbox, ErrorText,
  Button, SmallButton, ButtonGroup,
  ActionBar, GridRow, Divider,
  EntryCard, EntryHeader, EntryName, EntryContent, EntryMeta, EntryActions,
  ItemCard, ItemHeader, ItemNumber, ItemActions,
  AlertBox, SearchInput,
  PhotoGrid, PhotoActions, PhotoCount, PhotoCard, PhotoImage, PhotoOverlay, PhotoButton, PhotoPending,
  DropZone, DropOverlay, DropButton, DropPlaceholder, ProgressBar,
  ImageGrid, ImageItem, RemoveButton, AddButton,
  ColorPalette, ColorItem, ColorInput,
  StatusDescription, InfoRow, InfoLabel, InfoValue,
  LoadingSpinner, EmptyState, FeedbackModal,
  LogoIcon,
};

export default BotanicalAdminComponents;
