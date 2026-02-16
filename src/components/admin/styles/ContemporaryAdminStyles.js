// ContemporaryAdminStyles.js - Brutalist Colorful Admin Dashboard
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const spin = keyframes`to { transform: rotate(360deg); }`;

// LOGIN
export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%);
  padding: 2rem;
`;

export const LoginBox = styled.div`
  background: #FAFAFA;
  border: 4px solid #0D0D0D;
  box-shadow: 12px 12px 0 #0D0D0D;
  max-width: 420px;
  width: 100%;
  padding: 3rem;
`;

export const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  h1 { font-size: 2rem; font-weight: 700; text-transform: uppercase; color: #0D0D0D; span { color: #FF6B6B; } }
  p { font-size: 0.8rem; color: #404040; margin-top: 0.5rem; }
`;

export const LoginForm = styled.form`display: flex; flex-direction: column; gap: 1.25rem;`;
export const LoginError = styled.p`color: #FF6B6B; text-align: center; padding: 1rem; background: rgba(255,107,107,0.1); border: 3px solid #FF6B6B;`;
export const LoginButton = styled.button`width: 100%; padding: 1.25rem; font-size: 1rem; font-weight: 700; text-transform: uppercase; background: #FF6B6B; color: #FAFAFA; border: 3px solid #0D0D0D; box-shadow: 6px 6px 0 #0D0D0D; cursor: pointer; &:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 #0D0D0D; }`;
export const BackLink = styled.a`display: block; text-align: center; margin-top: 1.5rem; font-size: 0.8rem; color: #404040; cursor: pointer; &:hover { color: #FF6B6B; }`;

// DASHBOARD LAYOUT
export const DashboardContainer = styled.div`min-height: 100vh; display: flex; background: #F5F5F5;
  --admin-text: #0D0D0D;
  --admin-text-secondary: rgba(0,0,0,0.6);
  --admin-text-muted: rgba(0,0,0,0.4);
  --admin-text-subtle: rgba(0,0,0,0.25);
  --admin-border: rgba(0,0,0,0.12);
  --admin-border-subtle: rgba(0,0,0,0.06);
  --admin-bg-subtle: rgba(0,0,0,0.03);
  --admin-bg-hover: rgba(0,0,0,0.05);
  --admin-glass: rgba(0,0,0,0.02);
  --admin-glass-hover: rgba(0,0,0,0.04);
  --admin-glass-border: rgba(0,0,0,0.08);`;
export const Sidebar = styled.aside`width: 280px; background: #FAFAFA; border-right: 3px solid #0D0D0D; position: fixed; top: 0; left: 0; bottom: 0; padding: 2rem 0; overflow-y: auto; z-index: 100; @media (max-width: 968px) { transform: translateX(${p => p.$open ? '0' : '-100%'}); transition: transform 0.3s ease; }`;
export const SidebarHeader = styled.div`padding: 0 1.5rem 2rem; border-bottom: 3px solid #E5E5E5; margin-bottom: 1rem;`;
export const SidebarLogo = styled.div`font-size: 1.5rem; font-weight: 700; text-transform: uppercase; span { color: #FF6B6B; }`;
export const SidebarSub = styled.p`font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: #404040; margin-top: 0.25rem;`;
export const NavSection = styled.div`margin-bottom: 0.5rem;`;
export const NavSectionTitle = styled.div`padding: 1rem 1.5rem 0.5rem; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #525252;`;
export const NavItem = styled.button`width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1.5rem; font-size: 0.85rem; font-weight: ${p => p.$active ? '700' : '500'}; color: ${p => p.$active ? '#0D0D0D' : '#525252'}; background: ${p => p.$active ? '#FFE66D' : 'transparent'}; border: none; border-left: 4px solid ${p => p.$active ? '#0D0D0D' : 'transparent'}; cursor: pointer; text-align: left; &:hover { background: ${p => p.$active ? '#FFE66D' : '#F5F5F5'}; }`;
export const NavBadge = styled.span`margin-left: auto; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.5rem; background: ${p => p.$warning ? '#FF6B6B' : '#0D0D0D'}; color: #FAFAFA;`;
export const NavDivider = styled.div`height: 3px; background: #E5E5E5; margin: 1rem 1.5rem;`;
export const Main = styled.main`flex: 1; margin-left: 280px; padding: 2rem; max-width: 900px; @media (max-width: 968px) { margin-left: 0; padding: 1.5rem; padding-top: 4.5rem; }`;
export const Header = styled.header`display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 3px solid #0D0D0D;`;
export const PageTitle = styled.h1`font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; text-transform: uppercase;`;
export const MobileMenuToggle = styled.button`display: none; position: fixed; top: 1rem; right: 1rem; z-index: 101; width: 50px; height: 50px; background: #FFE66D; border: 3px solid #0D0D0D; box-shadow: 4px 4px 0 #0D0D0D; cursor: pointer; @media (max-width: 968px) { display: flex; align-items: center; justify-content: center; }`;

// STATS
export const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;
const statColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9B5DE5'];
export const StatCard = styled.div`background: ${p => statColors[p.$index % statColors.length]}; border: 3px solid #0D0D0D; box-shadow: 6px 6px 0 #0D0D0D; padding: 1.5rem; text-align: center;`;
export const StatNumber = styled.div`font-size: 3rem; font-weight: 700; color: ${p => p.$index === 2 ? '#0D0D0D' : '#FAFAFA'}; line-height: 1;`;
export const StatLabel = styled.div`font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${p => p.$index === 2 ? '#0D0D0D' : 'rgba(255,255,255,0.9)'}; margin-top: 0.5rem;`;

// PANELS
export const Panel = styled.div`background: #FAFAFA; border: 3px solid #0D0D0D; box-shadow: 6px 6px 0 #0D0D0D; margin-bottom: 1.5rem;`;
export const PanelHeader = styled.div`padding: 1.25rem 1.5rem; border-bottom: 3px solid #E5E5E5; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;`;
export const PanelTitle = styled.h3`font-size: 1.1rem; font-weight: 700; text-transform: uppercase;`;
export const PanelContent = styled.div`padding: 1.5rem; max-height: ${p => p.$maxHeight || 'auto'}; overflow-y: auto;`;

// TABLES
export const TableWrapper = styled.div`overflow-x: auto;`;
export const Table = styled.table`width: 100%; border-collapse: collapse;`;
export const Th = styled.th`text-align: left; padding: 1rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #525252; border-bottom: 3px solid #0D0D0D; background: #F5F5F5;`;
export const Td = styled.td`padding: 1rem; font-size: 0.9rem; border-bottom: 2px solid #E5E5E5;`;
export const StatusBadge = styled.span`font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 0.3rem 0.6rem; border: 2px solid #0D0D0D; background: ${p => p.$status === 'confirmed' ? '#4ECDC4' : p.$status === 'declined' ? '#FF6B6B' : '#FFE66D'}; color: ${p => p.$status === 'pending' ? '#0D0D0D' : '#FAFAFA'};`;

// FORMS
export const FormGroup = styled.div`margin-bottom: ${p => p.$mb || '1.25rem'};`;
export const Label = styled.label`display: block; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #404040; margin-bottom: 0.5rem;`;
export const SectionLabel = styled.div`font-size: 1rem; font-weight: 700; text-transform: uppercase; color: #FF6B6B; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 3px solid #FF6B6B;`;
export const Input = styled.input`width: 100%; padding: 1rem; font-size: 1rem; color: #0D0D0D; background: #F5F5F5; border: 3px solid ${p => p.$error ? '#FF6B6B' : '#0D0D0D'}; box-sizing: border-box; &:focus { outline: none; background: #FAFAFA; box-shadow: 4px 4px 0 #0D0D0D; }`;
export const TextArea = styled.textarea`width: 100%; padding: 1rem; font-size: 1rem; color: #0D0D0D; background: #F5F5F5; border: 3px solid #0D0D0D; min-height: 120px; resize: vertical; box-sizing: border-box; &:focus { outline: none; background: #FAFAFA; box-shadow: 4px 4px 0 #0D0D0D; }`;
export const Checkbox = styled.label`display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; cursor: pointer; input { width: 20px; height: 20px; accent-color: #FF6B6B; }`;
export const CheckboxLabel = styled.label`display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: #404040; cursor: pointer; input[type="checkbox"] { width: 20px; height: 20px; accent-color: #FF6B6B; }`;
export const Select = styled.select`width: 100%; padding: 1rem; font-size: 1rem; color: #0D0D0D; background: #F5F5F5; border: 3px solid #0D0D0D; cursor: pointer; &:focus { outline: none; box-shadow: 4px 4px 0 #0D0D0D; }`;
export const ErrorText = styled.span`font-size: 0.8rem; color: #FF6B6B; margin-top: 0.25rem; display: block;`;
export const HelpText = styled.span`font-size: 0.8rem; color: #404040; margin-top: 0.25rem; display: block;`;
export const FormRow = styled.div`display: flex; gap: 1rem; @media (max-width: 600px) { flex-direction: column; }`;

// BUTTONS
export const Button = styled.button`
  font-size: 0.85rem; font-weight: 700; text-transform: uppercase; padding: 0.85rem 1.5rem; cursor: pointer; border: 3px solid #0D0D0D; transition: all 0.2s ease;
  ${p => p.$variant === 'danger' ? css`background: #FF6B6B; color: #FAFAFA; box-shadow: 4px 4px 0 #0D0D0D;` : p.$variant === 'success' ? css`background: #4ECDC4; color: #FAFAFA; box-shadow: 4px 4px 0 #0D0D0D;` : p.$variant === 'secondary' ? css`background: #FAFAFA; color: #0D0D0D;` : css`background: #FF6B6B; color: #FAFAFA; box-shadow: 4px 4px 0 #0D0D0D;`}
  &:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #0D0D0D; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
export const SmallButton = styled.button`font-size: 0.75rem; font-weight: 600; padding: 0.4rem 0.8rem; cursor: pointer; border: 2px solid #0D0D0D; ${p => p.$variant === 'success' ? css`background: #4ECDC4; color: #FAFAFA;` : p.$variant === 'danger' ? css`background: #FF6B6B; color: #FAFAFA;` : css`background: #F5F5F5; color: #0D0D0D;`} &:hover { opacity: 0.8; }`;
export const ButtonGroup = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`;

// LAYOUT
export const ActionBar = styled.div`display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;`;
export const GridRow = styled.div`display: grid; grid-template-columns: ${p => p.$cols || '1fr 1fr'}; gap: 0.75rem; margin-bottom: 0.75rem;`;
export const Divider = styled.hr`border: none; border-top: 3px solid #E5E5E5; margin: 2rem 0;`;

// ENTRIES
export const EntryCard = styled.div`padding: 1.25rem; border-bottom: 2px solid #E5E5E5; &:last-child { border-bottom: none; } &:hover { background: #F5F5F5; }`;
export const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;`;
export const EntryName = styled.span`font-weight: 700; color: #0D0D0D;`;
export const EntryContent = styled.p`font-size: 0.9rem; color: #404040; line-height: 1.5; margin: 0;`;
export const EntryMeta = styled.div`font-size: 0.75rem; color: #525252; margin-top: 0.5rem;`;
export const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;

// ITEMS
export const ItemCard = styled.div`border: 3px solid #0D0D0D; padding: 1.25rem; margin-bottom: 1rem; background: #FAFAFA;`;
export const ItemHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
export const ItemNumber = styled.span`font-size: 0.85rem; font-weight: 700; color: #FF6B6B;`;
export const ItemActions = styled.div`display: flex; gap: 0.25rem;`;

// ALERTS
export const AlertBox = styled.div`padding: 1rem 1.25rem; margin-bottom: 1rem; font-size: 0.9rem; border: 3px solid #0D0D0D; ${p => p.$type === 'success' ? css`background: #4ECDC4; color: #FAFAFA;` : p.$type === 'warning' ? css`background: #FFE66D; color: #0D0D0D;` : css`background: #F5F5F5; color: #0D0D0D;`}`;
export const SearchInput = styled.input`flex: 1; min-width: 200px; padding: 0.85rem 1rem; font-size: 0.9rem; color: #0D0D0D; background: #FAFAFA; border: 3px solid #0D0D0D; &:focus { outline: none; box-shadow: 4px 4px 0 #0D0D0D; }`;

// PHOTOS
export const PhotoGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem;`;
export const PhotoActions = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center;`;
export const PhotoCount = styled.span`color: #404040; font-size: 0.85rem;`;
export const PhotoCard = styled.div`position: relative; aspect-ratio: 1; overflow: hidden; border: 3px solid ${p => p.$selected ? '#FF6B6B' : '#0D0D0D'}; box-shadow: ${p => p.$selected ? '4px 4px 0 #FF6B6B' : '4px 4px 0 #0D0D0D'}; &:hover > div { opacity: 1; }`;
export const PhotoImage = styled.div`width: 100%; height: 100%; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#E5E5E5'}; cursor: pointer;`;
export const PhotoOverlay = styled.div`position: absolute; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; gap: 0.5rem; opacity: 0; transition: opacity 0.2s;`;
export const PhotoButton = styled.button`width: 36px; height: 36px; background: #FF6B6B; border: 2px solid #FAFAFA; color: white; cursor: pointer; font-size: 16px; &:hover { background: #E85555; }`;
export const PhotoPending = styled.div`position: absolute; bottom: 0; left: 0; right: 0; background: #FFE66D; color: #0D0D0D; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 0.3rem; text-align: center; border-top: 2px solid #0D0D0D;`;
export const PhotoCaption = styled.div`position: absolute; top: 0; left: 0; right: 0; background: #0D0D0D; color: white; font-size: 0.7rem; padding: 0.35rem 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;

// UPLOAD
export const DropZone = styled.div`border: 3px dashed ${p => p.$dragging ? '#FF6B6B' : p.$hasImage ? '#4ECDC4' : '#0D0D0D'}; background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : '#F5F5F5'}; min-height: 100px; max-width: 300px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; aspect-ratio: ${p => p.$ratio || '16/9'}; &:hover { border-color: #FF6B6B; } &:hover .overlay { opacity: 1; }`;
export const DropOverlay = styled.div`position: absolute; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0; transition: opacity 0.2s;`;
export const DropButton = styled.span`padding: 0.6rem 1.25rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; cursor: pointer; background: ${p => p.$danger ? '#FF6B6B' : '#FAFAFA'}; color: ${p => p.$danger ? '#FAFAFA' : '#0D0D0D'}; border: 2px solid #0D0D0D;`;
export const DropPlaceholder = styled.div`text-align: center; color: #404040; font-size: 0.9rem; span { display: block; font-size: 2.5rem; margin-bottom: 0.75rem; }`;
export const ProgressBar = styled.div`position: absolute; bottom: 0; left: 0; height: 4px; background: #FF6B6B; width: ${p => p.$progress}%; transition: width 0.3s;`;

// MULTI IMAGE
export const ImageGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, 80px); gap: 0.5rem;`;
export const ImageItem = styled.div`aspect-ratio: 1; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#E5E5E5'}; position: relative; border: 2px solid #0D0D0D; &:hover button { opacity: 1; }`;
export const RemoveButton = styled.button`position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; background: #FF6B6B; color: #FAFAFA; border: none; cursor: pointer; font-size: 12px; opacity: 0; transition: opacity 0.2s;`;
export const AddButton = styled.button`aspect-ratio: 1; background: #F5F5F5; border: 3px dashed #0D0D0D; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; color: #404040; span { font-size: 1.5rem; } &:hover { border-color: #FF6B6B; color: #FF6B6B; }`;

// COLORS
export const ColorPalette = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: flex-end;`;
export const ColorItem = styled.div`display: flex; flex-direction: column; gap: 0.25rem;`;
export const ColorInput = styled.input`width: 50px; height: 50px; padding: 0; border: 3px solid #0D0D0D; cursor: pointer; background: transparent;`;

// STATUS
export const StatusDescription = styled.div`font-size: 0.95rem; color: #404040; margin-bottom: 1.5rem; line-height: 1.7; p { margin: 0.5rem 0; } strong { color: #0D0D0D; }`;
export const InfoRow = styled.div`display: flex; justify-content: space-between; padding: 0.85rem 0; border-bottom: 2px solid #E5E5E5;`;
export const InfoLabel = styled.span`font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #404040;`;
export const InfoValue = styled.span`font-size: 0.95rem; color: #0D0D0D;`;

// LOADING
export const LoadingSpinner = styled.div`display: flex; justify-content: center; padding: 3rem; &::after { content: ''; width: 40px; height: 40px; border: 4px solid #E5E5E5; border-top-color: #FF6B6B; border-radius: 50%; animation: ${spin} 0.8s linear infinite; }`;
export const EmptyState = styled.p`text-align: center; color: #404040; padding: 3rem; font-size: 0.95rem;`;
export const FeedbackModal = styled.div`position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; font-size: 0.9rem; font-weight: 600; border: 3px solid #0D0D0D; box-shadow: 6px 6px 0 #0D0D0D; background: ${p => p.type === 'success' ? '#4ECDC4' : p.type === 'error' ? '#FF6B6B' : '#FFE66D'}; color: ${p => p.type === 'success' || p.type === 'error' ? '#FAFAFA' : '#0D0D0D'}; z-index: 1000;`;

// MODAL
export const ModalOverlay = styled.div`position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: ${fadeIn} 0.2s ease; padding: 1rem;`;
export const ModalContent = styled.div`background: #FAFAFA; max-width: 450px; width: 100%; border: 4px solid #0D0D0D; box-shadow: 12px 12px 0 #0D0D0D; animation: ${fadeIn} 0.3s ease;`;
export const ModalHeader = styled.div`padding: 1.5rem; border-bottom: 3px solid #0D0D0D;`;
export const ModalTitle = styled.h3`font-size: 1.25rem; font-weight: 700; text-transform: uppercase; color: #0D0D0D; margin: 0;`;
export const ModalBody = styled.div`padding: 1.5rem; color: #404040; line-height: 1.6; p { margin: 0; }`;
export const ModalFooter = styled.div`padding: 1.5rem; border-top: 3px solid #E5E5E5; display: flex; justify-content: flex-end; gap: 1rem;`;
export const ActionButton = styled.button`padding: 0.75rem 1.5rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; border: 3px solid #0D0D0D; ${p => p.$primary ? css`background: #FF6B6B; color: #FAFAFA; box-shadow: 4px 4px 0 #0D0D0D; &:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #0D0D0D; }` : css`background: #FAFAFA; color: #0D0D0D; &:hover:not(:disabled) { background: #F5F5F5; }`} &:disabled { opacity: 0.5; cursor: not-allowed; }`;

export const LogoIcon = null;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.25rem;
`;
// EXPORT ALL
const ContemporaryAdminComponents = {
  LoginContainer, LoginBox, LoginLogo, LoginForm, LoginError, LoginButton, BackLink,
  DashboardContainer, Sidebar, SidebarHeader, SidebarLogo, SidebarSub,
  NavSection, NavSectionTitle, NavItem, NavBadge, NavDivider,
  Main, Header, PageTitle, MobileMenuToggle,
  StatsGrid, StatCard, StatNumber, StatLabel, Card,
  Panel, PanelHeader, PanelTitle, PanelContent,
  TableWrapper, Table, Th, Td, StatusBadge,
  FormGroup, Label, SectionLabel, Input, TextArea, Checkbox, CheckboxLabel, ErrorText, HelpText, Select, FormRow,
  Button, SmallButton, ButtonGroup, ActionBar, GridRow, Divider,
  EntryCard, EntryHeader, EntryName, EntryContent, EntryMeta, EntryActions,
  ItemCard, ItemHeader, ItemNumber, ItemActions,
  AlertBox, SearchInput, ActionButton,
  ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter,
  PhotoGrid, PhotoActions, PhotoCount, PhotoCard, PhotoImage, PhotoOverlay, PhotoButton, PhotoPending, PhotoCaption,
  DropZone, DropOverlay, DropButton, DropPlaceholder, ProgressBar,
  ImageGrid, ImageItem, RemoveButton, AddButton,
  ColorPalette, ColorItem, ColorInput,
  StatusDescription, InfoRow, InfoLabel, InfoValue,
  LoadingSpinner, EmptyState, FeedbackModal, LogoIcon,
};

export { ContemporaryAdminComponents };
export default ContemporaryAdminComponents;
