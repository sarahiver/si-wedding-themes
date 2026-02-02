// themes/luxe/LuxeAdminStyles.js - Dark elegance, gold accents
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const shimmer = keyframes`0% { background-position: -200% 0; } 100% { background-position: 200% 0; }`;

// Luxe: Deep charcoal, champagne gold, cream accents
// --luxe-black: #1A1A1A, --luxe-gold: #C9A86C, --luxe-cream: #F5F3EF

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
`;

export const LoginBox = styled.div`
  background: #242424;
  border: 1px solid #333;
  max-width: 440px;
  width: 90%;
  padding: 3rem;
  animation: ${fadeIn} 0.6s ease;
`;

export const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    color: #C9A86C;
    span { font-style: italic; color: #F5F3EF; }
  }
  p { font-family: 'Montserrat', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #777; margin-top: 0.75rem; }
`;

export const LoginForm = styled.form`display: flex; flex-direction: column; gap: 1.5rem;`;
export const LoginError = styled.p`font-size: 0.85rem; color: #FF6B6B; text-align: center; padding: 1rem; background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3);`;
export const LoginButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #C9A86C, #E0C994, #C9A86C);
  background-size: 200% auto;
  color: #1A1A1A;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { animation: ${shimmer} 2s linear infinite; }
`;
export const BackLink = styled.a`display: block; text-align: center; margin-top: 2rem; font-size: 0.8rem; color: #666; text-decoration: none; letter-spacing: 0.1em; cursor: pointer; &:hover { color: #C9A86C; }`;

export const DashboardContainer = styled.div`min-height: 100vh; display: flex; background: #1A1A1A;`;

export const Sidebar = styled.aside`
  width: 280px;
  background: #242424;
  border-right: 1px solid #333;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  padding: 2rem 0;
  overflow-y: auto;
  z-index: 100;
  @media (max-width: 968px) { transform: translateX(${p => p.$open ? '0' : '-100%'}); transition: transform 0.3s ease; }
`;

export const SidebarHeader = styled.div`padding: 0 1.5rem 2rem; border-bottom: 1px solid #333; margin-bottom: 1rem;`;
export const SidebarLogo = styled.div`font-family: 'Playfair Display', serif; font-size: 1.25rem; letter-spacing: 0.1em; color: #C9A86C; span { font-style: italic; color: #F5F3EF; }`;
export const SidebarSub = styled.p`font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #666; margin-top: 0.25rem;`;
export const NavSection = styled.div`margin-bottom: 0.5rem;`;
export const NavSectionTitle = styled.div`padding: 0.75rem 1.5rem 0.5rem; font-family: 'Montserrat', sans-serif; font-size: 0.55rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #555;`;

export const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: ${p => p.$active ? '#F5F3EF' : '#888'};
  background: ${p => p.$active ? 'rgba(201, 168, 108, 0.1)' : 'transparent'};
  border: none;
  border-left: 2px solid ${p => p.$active ? '#C9A86C' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  &:hover { background: rgba(201, 168, 108, 0.05); color: #F5F3EF; }
`;

export const NavBadge = styled.span`margin-left: auto; font-size: 0.55rem; font-weight: 600; padding: 0.15rem 0.5rem; background: ${p => p.$warning ? 'rgba(255, 107, 107, 0.2)' : '#C9A86C'}; color: ${p => p.$warning ? '#FF6B6B' : '#1A1A1A'};`;
export const NavDivider = styled.div`height: 1px; background: #333; margin: 1rem 1.5rem;`;
export const Main = styled.main`flex: 1; margin-left: 280px; padding: 2rem; @media (max-width: 968px) { margin-left: 0; }`;
export const Header = styled.header`display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #333;`;
export const PageTitle = styled.h1`font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 400; letter-spacing: 0.05em; color: #F5F3EF;`;
export const MobileMenuToggle = styled.button`display: none; position: fixed; top: 1rem; right: 1rem; z-index: 101; background: #242424; border: 1px solid #333; color: #F5F3EF; padding: 0.75rem; cursor: pointer; @media (max-width: 968px) { display: block; }`;

export const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;
export const StatCard = styled.div`background: #242424; border: 1px solid #333; padding: 1.5rem; text-align: center;`;
export const StatNumber = styled.div`font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #C9A86C;`;
export const StatLabel = styled.div`font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #666; margin-top: 0.5rem;`;

export const Panel = styled.div`background: #242424; border: 1px solid #333; margin-bottom: 1.5rem;`;
export const PanelHeader = styled.div`padding: 1.25rem 1.5rem; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;`;
export const PanelTitle = styled.h3`font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 400; color: #F5F3EF;`;
export const PanelContent = styled.div`padding: 1.5rem; max-height: ${p => p.$maxHeight || 'auto'}; overflow-y: auto;`;

export const TableWrapper = styled.div`overflow-x: auto;`;
export const Table = styled.table`width: 100%; border-collapse: collapse; font-size: 0.85rem;`;
export const Th = styled.th`text-align: left; padding: 1rem; font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #666; border-bottom: 1px solid #333;`;
export const Td = styled.td`padding: 1rem; border-bottom: 1px solid #2D2D2D; color: #DDD;`;
export const StatusBadge = styled.span`font-size: 0.65rem; font-weight: 500; padding: 0.25rem 0.6rem; background: ${p => p.$status === 'confirmed' ? 'rgba(76, 175, 80, 0.15)' : p.$status === 'declined' ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 183, 77, 0.15)'}; color: ${p => p.$status === 'confirmed' ? '#4CAF50' : p.$status === 'declined' ? '#FF6B6B' : '#FFB74D'};`;

export const FormGroup = styled.div`margin-bottom: 1rem;`;
export const Label = styled.label`display: block; font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #888; margin-bottom: 0.5rem;`;
export const SectionLabel = styled.div`font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A86C; margin: 1.5rem 0 1rem;`;
export const Input = styled.input`width: 100%; padding: 1rem; font-family: 'Montserrat', sans-serif; font-size: 0.95rem; border: 1px solid ${p => p.$error ? '#FF6B6B' : '#333'}; background: #1A1A1A; color: #F5F3EF; box-sizing: border-box; &:focus { outline: none; border-color: #C9A86C; }`;
export const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: 'Montserrat', sans-serif; font-size: 0.95rem; border: 1px solid #333; background: #1A1A1A; color: #F5F3EF; min-height: 100px; resize: vertical; box-sizing: border-box; &:focus { outline: none; border-color: #C9A86C; }`;
export const Checkbox = styled.label`display: flex; align-items: center; gap: 0.75rem; font-family: 'Montserrat', sans-serif; font-size: 0.85rem; color: #DDD; cursor: pointer; input { width: 18px; height: 18px; accent-color: #C9A86C; }`;
export const ErrorText = styled.span`font-size: 0.75rem; color: #FF6B6B; margin-top: 0.25rem; display: block;`;

export const Button = styled.button`font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.25rem; cursor: pointer; transition: all 0.3s; background: ${p => p.$variant === 'danger' ? '#FF6B6B' : p.$variant === 'secondary' ? 'transparent' : '#C9A86C'}; color: ${p => p.$variant === 'secondary' ? '#C9A86C' : p.$variant === 'danger' ? '#FFF' : '#1A1A1A'}; border: ${p => p.$variant === 'secondary' ? '1px solid #C9A86C' : 'none'}; &:hover { opacity: 0.9; } &:disabled { background: #444; color: #666; cursor: not-allowed; }`;
export const SmallButton = styled.button`font-family: 'Montserrat', sans-serif; font-size: 0.6rem; padding: 0.4rem 0.8rem; cursor: pointer; border: 1px solid #333; background: ${p => p.$variant === 'success' ? 'rgba(76, 175, 80, 0.15)' : p.$variant === 'danger' ? 'rgba(255, 107, 107, 0.15)' : '#2D2D2D'}; color: ${p => p.$variant === 'success' ? '#4CAF50' : p.$variant === 'danger' ? '#FF6B6B' : '#AAA'}; &:hover { opacity: 0.8; }`;
export const ButtonGroup = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`;

export const ActionBar = styled.div`display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;`;
export const GridRow = styled.div`display: grid; grid-template-columns: ${p => p.$cols || '1fr 1fr'}; gap: 0.75rem; margin-bottom: 0.75rem;`;
export const Divider = styled.hr`border: none; border-top: 1px solid #333; margin: 1.5rem 0;`;

export const EntryCard = styled.div`padding: 1.25rem; border-bottom: 1px solid #2D2D2D; &:last-child { border-bottom: none; }`;
export const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;`;
export const EntryName = styled.span`font-weight: 500; color: #F5F3EF;`;
export const EntryContent = styled.p`font-size: 0.9rem; color: #999; margin: 0; line-height: 1.6;`;
export const EntryMeta = styled.div`font-size: 0.75rem; color: #666; margin-top: 0.5rem;`;
export const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;

export const ItemCard = styled.div`border: 1px solid #333; padding: 1.25rem; margin-bottom: 1rem; background: #1A1A1A;`;
export const ItemHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
export const ItemNumber = styled.span`font-family: 'Playfair Display', serif; font-size: 1rem; color: #C9A86C;`;
export const ItemActions = styled.div`display: flex; gap: 0.25rem;`;

export const AlertBox = styled.div`padding: 1rem; margin-bottom: 1rem; font-size: 0.85rem; border: 1px solid; background: ${p => p.$type === 'success' ? 'rgba(76, 175, 80, 0.1)' : p.$type === 'warning' ? 'rgba(255, 183, 77, 0.1)' : 'rgba(33, 150, 243, 0.1)'}; border-color: ${p => p.$type === 'success' ? 'rgba(76, 175, 80, 0.3)' : p.$type === 'warning' ? 'rgba(255, 183, 77, 0.3)' : 'rgba(33, 150, 243, 0.3)'}; color: ${p => p.$type === 'success' ? '#4CAF50' : p.$type === 'warning' ? '#FFB74D' : '#64B5F6'};`;
export const SearchInput = styled.input`flex: 1; min-width: 200px; padding: 0.75rem 1rem; font-family: 'Montserrat', sans-serif; font-size: 0.9rem; border: 1px solid #333; background: #1A1A1A; color: #F5F3EF; &:focus { outline: none; border-color: #C9A86C; }`;

export const PhotoGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;`;
export const PhotoActions = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center;`;
export const PhotoCount = styled.span`color: #666; font-size: 0.8rem;`;
export const PhotoCard = styled.div`position: relative; aspect-ratio: 1; overflow: hidden; border: 2px solid ${p => p.$selected ? '#C9A86C' : p.$approved ? '#333' : 'rgba(255, 183, 77, 0.5)'}; &:hover > div { opacity: 1; }`;
export const PhotoImage = styled.div`width: 100%; height: 100%; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#2D2D2D'}; cursor: pointer;`;
export const PhotoOverlay = styled.div`position: absolute; inset: 0; background: rgba(26, 26, 26, 0.8); display: flex; align-items: center; justify-content: center; gap: 0.5rem; opacity: 0; transition: opacity 0.2s;`;
export const PhotoButton = styled.button`width: 32px; height: 32px; border-radius: 50%; border: none; background: ${p => p.$approve ? '#4CAF50' : '#FF6B6B'}; color: white; cursor: pointer; font-size: 14px;`;
export const PhotoPending = styled.div`position: absolute; bottom: 0; left: 0; right: 0; background: #FFB74D; color: #1A1A1A; font-size: 0.65rem; padding: 0.25rem; text-align: center;`;

export const DropZone = styled.div`border: 2px dashed ${p => p.$dragging ? '#C9A86C' : p.$hasImage ? '#C9A86C' : '#333'}; background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : '#1A1A1A'}; min-height: 150px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; aspect-ratio: ${p => p.$ratio || 'auto'}; transition: all 0.3s; &:hover { border-color: #C9A86C; } &:hover .overlay { opacity: 1; }`;
export const DropOverlay = styled.div`position: absolute; inset: 0; background: rgba(26, 26, 26, 0.85); display: flex; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0; transition: opacity 0.2s;`;
export const DropButton = styled.span`padding: 0.5rem 1rem; font-size: 0.75rem; cursor: pointer; background: ${p => p.$danger ? '#FF6B6B' : '#C9A86C'}; color: ${p => p.$danger ? '#FFF' : '#1A1A1A'};`;
export const DropPlaceholder = styled.div`text-align: center; color: #666; font-size: 0.85rem; span { display: block; font-size: 2rem; margin-bottom: 0.5rem; }`;
export const ProgressBar = styled.div`position: absolute; bottom: 0; left: 0; height: 4px; background: linear-gradient(90deg, #C9A86C, #E0C994); width: ${p => p.$progress}%; transition: width 0.3s;`;

export const ImageGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem; margin-top: 0.5rem;`;
export const ImageItem = styled.div`aspect-ratio: 1; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#2D2D2D'}; position: relative; &:hover button { opacity: 1; }`;
export const RemoveButton = styled.button`position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; background: #FF6B6B; color: white; border: none; cursor: pointer; font-size: 14px; opacity: 0; transition: opacity 0.2s;`;
export const AddButton = styled.button`aspect-ratio: 1; background: #1A1A1A; border: 2px dashed #333; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; color: #666; span { font-size: 1.5rem; } &:hover { border-color: #C9A86C; color: #C9A86C; }`;

export const ColorPalette = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: flex-end;`;
export const ColorItem = styled.div`display: flex; flex-direction: column; gap: 0.25rem;`;
export const ColorInput = styled.input`width: 40px; height: 40px; padding: 0; border: 1px solid #333; cursor: pointer; background: #1A1A1A;`;

export const StatusDescription = styled.div`font-size: 0.9rem; color: #999; margin-bottom: 1.5rem; line-height: 1.6; p { margin: 0.5rem 0; }`;
export const InfoRow = styled.div`display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #2D2D2D;`;
export const InfoLabel = styled.span`font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: #666;`;
export const InfoValue = styled.span`font-size: 0.9rem; color: #F5F3EF;`;

export const LoadingSpinner = styled.div`display: flex; justify-content: center; padding: 2rem; &::after { content: ''; width: 30px; height: 30px; border: 2px solid #333; border-top-color: #C9A86C; border-radius: 50%; animation: ${spin} 1s linear infinite; }`;
export const EmptyState = styled.p`text-align: center; color: #666; padding: 2rem; font-family: 'Montserrat', sans-serif;`;
export const FeedbackModal = styled.div`position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; background: ${p => p.type === 'success' ? '#4CAF50' : p.type === 'error' ? '#FF6B6B' : '#64B5F6'}; color: ${p => p.type === 'success' || p.type === 'error' ? '#FFF' : '#1A1A1A'}; box-shadow: 0 4px 20px rgba(0,0,0,0.4); animation: ${fadeIn} 0.3s ease; z-index: 1000;`;

// MODAL
export const ModalOverlay = styled.div`position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: ${fadeIn} 0.2s ease; padding: 1rem;`;
export const ModalContent = styled.div`background: #1A1A1A; max-width: 450px; width: 100%; border: 1px solid rgba(201, 168, 108, 0.3); box-shadow: 0 10px 40px rgba(0,0,0,0.6); animation: ${fadeIn} 0.3s ease;`;
export const ModalHeader = styled.div`padding: 1.5rem; border-bottom: 1px solid rgba(201, 168, 108, 0.2);`;
export const ModalTitle = styled.h3`font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 600; color: #C9A86C; margin: 0;`;
export const ModalBody = styled.div`padding: 1.5rem; color: rgba(255,255,255,0.8); line-height: 1.6; p { margin: 0; }`;
export const ModalFooter = styled.div`padding: 1.5rem; border-top: 1px solid rgba(201, 168, 108, 0.1); display: flex; justify-content: flex-end; gap: 1rem;`;
export const ActionButton = styled.button`padding: 0.75rem 1.5rem; font-family: 'Montserrat', sans-serif; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; border: 1px solid; ${p => p.$primary ? css`background: linear-gradient(135deg, #C9A86C, #B8956A); border-color: #C9A86C; color: #1A1A1A; &:hover:not(:disabled) { box-shadow: 0 4px 20px rgba(201, 168, 108, 0.4); }` : css`background: transparent; border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.7); &:hover:not(:disabled) { border-color: rgba(255,255,255,0.4); color: #FFF; }`} &:disabled { opacity: 0.5; cursor: not-allowed; }`;

// Gold diamond icon for Luxe
export const LogoIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#C9A86C' }}>
    <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.5L18.5 12 12 18.5 5.5 12 12 5.5z"/>
  </svg>
);

export const LuxeAdminComponents = {
  LoginContainer, LoginBox, LoginLogo, LoginForm, LoginError, LoginButton, BackLink,
  DashboardContainer, Sidebar, SidebarHeader, SidebarLogo, SidebarSub,
  NavSection, NavSectionTitle, NavItem, NavBadge, NavDivider,
  Main, Header, PageTitle, MobileMenuToggle,
  StatsGrid, StatCard, StatNumber, StatLabel,
  Panel, PanelHeader, PanelTitle, PanelContent,
  TableWrapper, Table, Th, Td, StatusBadge,
  FormGroup, Label, SectionLabel, Input, TextArea, Checkbox, ErrorText,
  Button, SmallButton, ButtonGroup, ActionBar, GridRow, Divider,
  EntryCard, EntryHeader, EntryName, EntryContent, EntryMeta, EntryActions,
  ItemCard, ItemHeader, ItemNumber, ItemActions,
  AlertBox, SearchInput, ActionButton,
  ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter,
  PhotoGrid, PhotoActions, PhotoCount, PhotoCard, PhotoImage, PhotoOverlay, PhotoButton, PhotoPending,
  DropZone, DropOverlay, DropButton, DropPlaceholder, ProgressBar,
  ImageGrid, ImageItem, RemoveButton, AddButton,
  ColorPalette, ColorItem, ColorInput,
  StatusDescription, InfoRow, InfoLabel, InfoValue,
  LoadingSpinner, EmptyState, FeedbackModal, LogoIcon,
};

export default LuxeAdminComponents;
