// themes/editorial/EditorialAdminStyles.js - ONLY STYLES, NO LOGIC
import styled, { keyframes } from 'styled-components';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const spin = keyframes`to { transform: rotate(360deg); }`;

// ============================================
// EDITORIAL THEME STYLES - Minimal, clean, magazine-style
// ============================================

// Login
export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAFAFA;
`;

export const LoginBox = styled.div`
  background: #FFF;
  border: 1px solid #E0E0E0;
  max-width: 420px;
  width: 90%;
  padding: 3rem;
  animation: ${fadeIn} 0.6s ease;
`;

export const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  h1 {
    font-family: 'Instrument Serif', serif;
    font-size: 2rem;
    span { font-style: italic; }
  }
  p { font-size: 0.85rem; color: #999; }
`;

export const LoginForm = styled.form`display: flex; flex-direction: column; gap: 1.5rem;`;
export const LoginError = styled.p`font-size: 0.85rem; color: #C62828; text-align: center; padding: 1rem; background: #FFEBEE;`;
export const LoginButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: #000;
  color: #FFF;
  border: none;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;
export const BackLink = styled.a`display: block; text-align: center; margin-top: 2rem; font-size: 0.8rem; color: #999; text-decoration: none; cursor: pointer; &:hover { color: #000; }`;

// Dashboard Layout
export const DashboardContainer = styled.div`min-height: 100vh; display: flex; background: #FAFAFA;`;

export const Sidebar = styled.aside`
  width: 280px;
  background: #FFF;
  border-right: 1px solid #E0E0E0;
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

export const SidebarHeader = styled.div`padding: 0 1.5rem 2rem; border-bottom: 1px solid #F0F0F0; margin-bottom: 1rem;`;
export const SidebarLogo = styled.div`font-family: 'Instrument Serif', serif; font-size: 1.25rem; span { font-style: italic; }`;
export const SidebarSub = styled.p`font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-top: 0.25rem;`;
export const NavSection = styled.div`margin-bottom: 0.5rem;`;
export const NavSectionTitle = styled.div`padding: 0.75rem 1.5rem 0.5rem; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #999;`;

export const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: ${p => p.$active ? '#000' : '#666'};
  background: ${p => p.$active ? '#F5F5F5' : 'transparent'};
  border: none;
  border-left: 2px solid ${p => p.$active ? '#000' : 'transparent'};
  cursor: pointer;
  text-align: left;
  &:hover { background: #FAFAFA; }
`;

export const NavBadge = styled.span`
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  background: ${p => p.$warning ? '#FFF3E0' : '#000'};
  color: ${p => p.$warning ? '#E65100' : '#FFF'};
`;

export const NavDivider = styled.div`height: 1px; background: #F0F0F0; margin: 1rem 1.5rem;`;
export const Main = styled.main`flex: 1; margin-left: 280px; padding: 2rem; @media (max-width: 968px) { margin-left: 0; }`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #E0E0E0;
`;

export const PageTitle = styled.h1`font-family: 'Instrument Serif', serif; font-size: 1.75rem; font-weight: 400; span { font-style: italic; }`;

export const MobileMenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 1rem; right: 1rem;
  z-index: 101;
  background: #FFF;
  border: 1px solid #E0E0E0;
  padding: 0.75rem;
  cursor: pointer;
  @media (max-width: 968px) { display: block; }
`;

// Stats
export const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;
export const StatCard = styled.div`background: #FFF; border: 1px solid #E0E0E0; padding: 1.25rem; text-align: center;`;
export const StatNumber = styled.div`font-family: 'Instrument Serif', serif; font-size: 2rem;`;
export const StatLabel = styled.div`font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #666; margin-top: 0.25rem;`;

// Panels
export const Panel = styled.div`background: #FFF; border: 1px solid #E0E0E0; margin-bottom: 1.5rem;`;
export const PanelHeader = styled.div`padding: 1.25rem 1.5rem; border-bottom: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;`;
export const PanelTitle = styled.h3`font-family: 'Instrument Serif', serif; font-size: 1.25rem;`;
export const PanelContent = styled.div`padding: 1.5rem; max-height: ${p => p.$maxHeight || 'auto'}; overflow-y: auto;`;

// Tables
export const TableWrapper = styled.div`overflow-x: auto;`;
export const Table = styled.table`width: 100%; border-collapse: collapse; font-size: 0.85rem;`;
export const Th = styled.th`text-align: left; padding: 1rem; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #666; border-bottom: 1px solid #E0E0E0;`;
export const Td = styled.td`padding: 1rem; border-bottom: 1px solid #F0F0F0;`;

export const StatusBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  background: ${p => p.$status === 'confirmed' ? '#E8F5E9' : p.$status === 'declined' ? '#FFEBEE' : '#FFF3E0'};
  color: ${p => p.$status === 'confirmed' ? '#2E7D32' : p.$status === 'declined' ? '#C62828' : '#E65100'};
`;

// Forms
export const FormGroup = styled.div`margin-bottom: ${p => p.$mb || '1rem'};`;
export const Label = styled.label`display: block; font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #000; margin-bottom: 0.5rem;`;
export const SectionLabel = styled.div`font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #000; margin: 1.5rem 0 1rem;`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  border: 1px solid ${p => p.$error ? '#C62828' : '#E0E0E0'};
  box-sizing: border-box;
  &:focus { outline: none; border-color: #000; }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  border: 1px solid #E0E0E0;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #000; }
`;

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  input { width: 18px; height: 18px; }
`;

export const ErrorText = styled.span`font-size: 0.75rem; color: #C62828; margin-top: 0.25rem; display: block;`;
export const HelpText = styled.span`font-size: 0.75rem; color: #999; margin-top: 0.25rem; display: block;`;
export const Select = styled.select`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  border: 1px solid #E0E0E0;
  background: #FFF;
  cursor: pointer;
  &:focus { outline: none; border-color: #000; }
`;

// Buttons
export const Button = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  background: ${p => p.$variant === 'danger' ? '#C62828' : p.$variant === 'success' ? '#2E7D32' : p.$variant === 'secondary' ? '#FFF' : '#000'};
  color: ${p => p.$variant === 'secondary' ? '#000' : '#FFF'};
  border: ${p => p.$variant === 'secondary' ? '1px solid #E0E0E0' : 'none'};
  &:hover { opacity: 0.9; }
  &:disabled { background: #CCC; cursor: not-allowed; }
`;

export const SmallButton = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border: 1px solid #E0E0E0;
  background: ${p => p.$variant === 'success' ? '#E8F5E9' : p.$variant === 'danger' ? '#FFEBEE' : '#FFF'};
  color: ${p => p.$variant === 'success' ? '#2E7D32' : p.$variant === 'danger' ? '#C62828' : '#666'};
  &:hover { opacity: 0.8; }
`;

export const ButtonGroup = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`;

// Layout Helpers
export const ActionBar = styled.div`display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;`;
export const GridRow = styled.div`display: grid; grid-template-columns: ${p => p.$cols || '1fr 1fr'}; gap: 0.75rem; margin-bottom: 0.75rem;`;
export const Divider = styled.hr`border: none; border-top: 1px solid #E0E0E0; margin: 1.5rem 0;`;

// Entries
export const EntryCard = styled.div`padding: 1.25rem; border-bottom: 1px solid #F0F0F0; &:last-child { border-bottom: none; }`;
export const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;`;
export const EntryName = styled.span`font-weight: 500;`;
export const EntryContent = styled.p`font-size: 0.9rem; color: #666; margin: 0;`;
export const EntryMeta = styled.div`font-size: 0.75rem; color: #999; margin-top: 0.5rem;`;
export const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;

// Items
export const ItemCard = styled.div`border: 1px solid #E0E0E0; padding: 1rem; margin-bottom: 1rem; background: #FFF;`;
export const ItemHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
export const ItemNumber = styled.span`font-size: 0.7rem; font-weight: 600; color: #999;`;
export const ItemActions = styled.div`display: flex; gap: 0.25rem;`;

// Alerts
export const AlertBox = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  background: ${p => p.$type === 'success' ? '#E8F5E9' : p.$type === 'warning' ? '#FFF3E0' : '#E3F2FD'};
  color: ${p => p.$type === 'success' ? '#2E7D32' : p.$type === 'warning' ? '#E65100' : '#1565C0'};
`;

// Search
export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  border: 1px solid #E0E0E0;
  &:focus { outline: none; border-color: #000; }
`;

// Photos (same structure, different colors)
export const PhotoGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;`;
export const PhotoActions = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center;`;
export const PhotoCount = styled.span`color: #999; font-size: 0.8rem;`;
export const PhotoCard = styled.div`position: relative; aspect-ratio: 1; overflow: hidden; border: 2px solid ${p => p.$selected ? '#000' : p.$approved ? '#E0E0E0' : '#FFF3E0'}; &:hover > div { opacity: 1; }`;
export const PhotoImage = styled.div`width: 100%; height: 100%; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#F0F0F0'}; cursor: pointer;`;
export const PhotoOverlay = styled.div`position: absolute; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; gap: 0.5rem; opacity: 0; transition: opacity 0.2s;`;
export const PhotoButton = styled.button`width: 32px; height: 32px; border-radius: 50%; border: none; background: ${p => p.$approve ? '#2E7D32' : '#C62828'}; color: white; cursor: pointer; font-size: 14px;`;
export const PhotoPending = styled.div`position: absolute; bottom: 0; left: 0; right: 0; background: #E65100; color: white; font-size: 0.65rem; padding: 0.25rem; text-align: center;`;
export const PhotoCaption = styled.div`position: absolute; top: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; font-size: 0.6rem; padding: 0.25rem 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;

// Upload (same structure, different colors)
export const DropZone = styled.div`
  border: 2px dashed ${p => p.$dragging ? '#000' : p.$hasImage ? '#2E7D32' : '#E0E0E0'};
  background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : '#FAFAFA'};
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  aspect-ratio: ${p => p.$ratio || 'auto'};
  &:hover { border-color: #000; }
  &:hover .overlay { opacity: 1; }
`;
export const DropOverlay = styled.div`position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0; transition: opacity 0.2s;`;
export const DropButton = styled.span`padding: 0.5rem 1rem; font-size: 0.75rem; cursor: pointer; background: ${p => p.$danger ? 'rgba(198,40,40,0.9)' : 'rgba(255,255,255,0.95)'}; color: ${p => p.$danger ? '#FFF' : '#000'};`;
export const DropPlaceholder = styled.div`text-align: center; color: #999; font-size: 0.85rem; span { display: block; font-size: 2rem; margin-bottom: 0.5rem; }`;
export const ProgressBar = styled.div`position: absolute; bottom: 0; left: 0; height: 4px; background: #2E7D32; width: ${p => p.$progress}%; transition: width 0.3s;`;

// Multi Image
export const ImageGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.5rem;`;
export const ImageItem = styled.div`aspect-ratio: 1; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#F0F0F0'}; position: relative; &:hover button { opacity: 1; }`;
export const RemoveButton = styled.button`position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background: rgba(198,40,40,0.9); color: #FFF; border: none; cursor: pointer; font-size: 12px; opacity: 0; transition: opacity 0.2s;`;
export const AddButton = styled.button`aspect-ratio: 1; background: #FAFAFA; border: 2px dashed #E0E0E0; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; color: #999; span { font-size: 1.5rem; } &:hover { border-color: #000; color: #000; }`;

// Colors
export const ColorPalette = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: flex-end;`;
export const ColorItem = styled.div`display: flex; flex-direction: column; gap: 0.25rem;`;
export const ColorInput = styled.input`width: 40px; height: 40px; padding: 0; border: 1px solid #E0E0E0; cursor: pointer;`;

// Status
export const StatusDescription = styled.div`font-size: 0.9rem; color: #666; margin-bottom: 1.5rem; line-height: 1.6; p { margin: 0.5rem 0; }`;
export const InfoRow = styled.div`display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #F0F0F0;`;
export const InfoLabel = styled.span`font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999;`;
export const InfoValue = styled.span`font-size: 0.9rem;`;

// Loading & Empty
export const LoadingSpinner = styled.div`display: flex; justify-content: center; padding: 2rem; &::after { content: ''; width: 30px; height: 30px; border: 2px solid #E0E0E0; border-top-color: #000; border-radius: 50%; animation: ${spin} 1s linear infinite; }`;
export const EmptyState = styled.p`text-align: center; color: #999; padding: 2rem;`;

// Feedback
export const FeedbackModal = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: ${p => p.type === 'success' ? '#2E7D32' : p.type === 'error' ? '#C62828' : '#1565C0'};
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.3s ease;
  z-index: 1000;
`;

// No logo icon for Editorial (minimal)
export const LogoIcon = null;

// Export all as single object
export const EditorialAdminComponents = {
  LoginContainer, LoginBox, LoginLogo, LoginForm, LoginError, LoginButton, BackLink,
  DashboardContainer, Sidebar, SidebarHeader, SidebarLogo, SidebarSub,
  NavSection, NavSectionTitle, NavItem, NavBadge, NavDivider,
  Main, Header, PageTitle, MobileMenuToggle,
  StatsGrid, StatCard, StatNumber, StatLabel,
  Panel, PanelHeader, PanelTitle, PanelContent,
  TableWrapper, Table, Th, Td, StatusBadge,
  FormGroup, Label, SectionLabel, Input, TextArea, Checkbox, ErrorText, HelpText, Select,
  Button, SmallButton, ButtonGroup,
  ActionBar, GridRow, Divider,
  EntryCard, EntryHeader, EntryName, EntryContent, EntryMeta, EntryActions,
  ItemCard, ItemHeader, ItemNumber, ItemActions,
  AlertBox, SearchInput,
  PhotoGrid, PhotoActions, PhotoCount, PhotoCard, PhotoImage, PhotoOverlay, PhotoButton, PhotoPending, PhotoCaption,
  DropZone, DropOverlay, DropButton, DropPlaceholder, ProgressBar,
  ImageGrid, ImageItem, RemoveButton, AddButton,
  ColorPalette, ColorItem, ColorInput,
  StatusDescription, InfoRow, InfoLabel, InfoValue,
  LoadingSpinner, EmptyState, FeedbackModal,
  LogoIcon,
};

export default EditorialAdminComponents;
