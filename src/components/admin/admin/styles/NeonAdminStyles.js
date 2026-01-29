// themes/neon/NeonAdminStyles.js - Bold neon on dark, cyberpunk vibes
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const glow = keyframes`0%, 100% { box-shadow: 0 0 5px #FF3366, 0 0 10px #FF3366; } 50% { box-shadow: 0 0 20px #FF3366, 0 0 30px #FF3366; }`;
const neonPulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.8; }`;

// Neon: Deep black, hot pink/magenta, electric cyan accents
// --neon-black: #0A0A0A, --neon-pink: #FF3366, --neon-cyan: #00D4FF

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0A0A0A;
  background-image: radial-gradient(circle at 50% 50%, rgba(255, 51, 102, 0.05) 0%, transparent 50%);
`;

export const LoginBox = styled.div`
  background: #111;
  border: 1px solid #FF3366;
  box-shadow: 0 0 30px rgba(255, 51, 102, 0.2);
  max-width: 440px;
  width: 90%;
  padding: 3rem;
  animation: ${fadeIn} 0.6s ease;
`;

export const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #FF3366;
    text-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
    animation: ${neonPulse} 2s ease-in-out infinite;
    span { color: #00D4FF; text-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
  }
  p { font-family: 'Inter', sans-serif; font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: #666; margin-top: 0.75rem; }
`;

export const LoginForm = styled.form`display: flex; flex-direction: column; gap: 1.5rem;`;
export const LoginError = styled.p`font-size: 0.85rem; color: #FF3366; text-align: center; padding: 1rem; background: rgba(255, 51, 102, 0.1); border: 1px solid rgba(255, 51, 102, 0.3);`;
export const LoginButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: #FF3366;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { animation: ${glow} 1.5s ease-in-out infinite; }
`;
export const BackLink = styled.a`display: block; text-align: center; margin-top: 2rem; font-size: 0.8rem; color: #666; text-decoration: none; letter-spacing: 0.1em; cursor: pointer; &:hover { color: #00D4FF; }`;

export const DashboardContainer = styled.div`min-height: 100vh; display: flex; background: #0A0A0A;`;

export const Sidebar = styled.aside`
  width: 280px;
  background: #111;
  border-right: 1px solid #222;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  padding: 2rem 0;
  overflow-y: auto;
  z-index: 100;
  @media (max-width: 968px) { transform: translateX(${p => p.$open ? '0' : '-100%'}); transition: transform 0.3s ease; }
`;

export const SidebarHeader = styled.div`padding: 0 1.5rem 2rem; border-bottom: 1px solid #222; margin-bottom: 1rem;`;
export const SidebarLogo = styled.div`font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; letter-spacing: 0.05em; color: #FF3366; text-shadow: 0 0 10px rgba(255, 51, 102, 0.3); span { color: #00D4FF; }`;
export const SidebarSub = styled.p`font-family: 'Inter', sans-serif; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #555; margin-top: 0.25rem;`;
export const NavSection = styled.div`margin-bottom: 0.5rem;`;
export const NavSectionTitle = styled.div`padding: 0.75rem 1.5rem 0.5rem; font-family: 'Inter', sans-serif; font-size: 0.55rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: #444;`;

export const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: ${p => p.$active ? '600' : '400'};
  color: ${p => p.$active ? '#FFF' : '#888'};
  background: ${p => p.$active ? 'rgba(255, 51, 102, 0.1)' : 'transparent'};
  border: none;
  border-left: 3px solid ${p => p.$active ? '#FF3366' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  &:hover { background: rgba(255, 51, 102, 0.05); color: #FFF; }
`;

export const NavBadge = styled.span`margin-left: auto; font-size: 0.55rem; font-weight: 700; padding: 0.15rem 0.5rem; background: ${p => p.$warning ? '#FF9800' : '#FF3366'}; color: ${p => p.$warning ? '#000' : '#FFF'}; box-shadow: ${p => p.$warning ? 'none' : '0 0 10px rgba(255, 51, 102, 0.5)'};`;
export const NavDivider = styled.div`height: 1px; background: linear-gradient(90deg, transparent, #333, transparent); margin: 1rem 1.5rem;`;
export const Main = styled.main`flex: 1; margin-left: 280px; padding: 2rem; @media (max-width: 968px) { margin-left: 0; }`;
export const Header = styled.header`display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #222;`;
export const PageTitle = styled.h1`font-family: 'Space Grotesk', sans-serif; font-size: 1.75rem; font-weight: 700; letter-spacing: 0.02em; color: #FFF;`;
export const MobileMenuToggle = styled.button`display: none; position: fixed; top: 1rem; right: 1rem; z-index: 101; background: #111; border: 1px solid #FF3366; color: #FF3366; padding: 0.75rem; cursor: pointer; @media (max-width: 968px) { display: block; }`;

export const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;
export const StatCard = styled.div`background: #111; border: 1px solid #222; padding: 1.5rem; text-align: center; transition: all 0.3s; &:hover { border-color: #FF3366; box-shadow: 0 0 20px rgba(255, 51, 102, 0.2); }`;
export const StatNumber = styled.div`font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; font-weight: 700; color: #FF3366; text-shadow: 0 0 20px rgba(255, 51, 102, 0.3);`;
export const StatLabel = styled.div`font-family: 'Inter', sans-serif; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #666; margin-top: 0.5rem;`;

export const Panel = styled.div`background: #111; border: 1px solid #222; margin-bottom: 1.5rem;`;
export const PanelHeader = styled.div`padding: 1.25rem 1.5rem; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;`;
export const PanelTitle = styled.h3`font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 600; color: #FFF;`;
export const PanelContent = styled.div`padding: 1.5rem; max-height: ${p => p.$maxHeight || 'auto'}; overflow-y: auto;`;

export const TableWrapper = styled.div`overflow-x: auto;`;
export const Table = styled.table`width: 100%; border-collapse: collapse; font-size: 0.85rem;`;
export const Th = styled.th`text-align: left; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #666; border-bottom: 1px solid #222;`;
export const Td = styled.td`padding: 1rem; border-bottom: 1px solid #1A1A1A; color: #DDD;`;
export const StatusBadge = styled.span`font-size: 0.65rem; font-weight: 600; padding: 0.25rem 0.6rem; background: ${p => p.$status === 'confirmed' ? 'rgba(0, 212, 255, 0.15)' : p.$status === 'declined' ? 'rgba(255, 51, 102, 0.15)' : 'rgba(255, 152, 0, 0.15)'}; color: ${p => p.$status === 'confirmed' ? '#00D4FF' : p.$status === 'declined' ? '#FF3366' : '#FF9800'};`;

export const FormGroup = styled.div`margin-bottom: 1rem;`;
export const Label = styled.label`display: block; font-family: 'Inter', sans-serif; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #666; margin-bottom: 0.5rem;`;
export const SectionLabel = styled.div`font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #FF3366; margin: 1.5rem 0 1rem;`;
export const Input = styled.input`width: 100%; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 0.95rem; border: 1px solid ${p => p.$error ? '#FF3366' : '#222'}; background: #0A0A0A; color: #FFF; box-sizing: border-box; transition: all 0.3s; &:focus { outline: none; border-color: #FF3366; box-shadow: 0 0 10px rgba(255, 51, 102, 0.2); }`;
export const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 0.95rem; border: 1px solid #222; background: #0A0A0A; color: #FFF; min-height: 100px; resize: vertical; box-sizing: border-box; &:focus { outline: none; border-color: #FF3366; box-shadow: 0 0 10px rgba(255, 51, 102, 0.2); }`;
export const Checkbox = styled.label`display: flex; align-items: center; gap: 0.75rem; font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #DDD; cursor: pointer; input { width: 18px; height: 18px; accent-color: #FF3366; }`;
export const ErrorText = styled.span`font-size: 0.75rem; color: #FF3366; margin-top: 0.25rem; display: block;`;

export const Button = styled.button`font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.75rem 1.25rem; cursor: pointer; transition: all 0.3s; background: ${p => p.$variant === 'danger' ? '#FF3366' : p.$variant === 'secondary' ? 'transparent' : '#FF3366'}; color: ${p => p.$variant === 'secondary' ? '#FF3366' : '#FFF'}; border: ${p => p.$variant === 'secondary' ? '1px solid #FF3366' : 'none'}; &:hover { box-shadow: 0 0 20px rgba(255, 51, 102, 0.4); } &:disabled { background: #333; color: #666; box-shadow: none; cursor: not-allowed; }`;
export const SmallButton = styled.button`font-family: 'Inter', sans-serif; font-size: 0.6rem; font-weight: 600; padding: 0.4rem 0.8rem; cursor: pointer; border: 1px solid #222; background: ${p => p.$variant === 'success' ? 'rgba(0, 212, 255, 0.1)' : p.$variant === 'danger' ? 'rgba(255, 51, 102, 0.1)' : '#1A1A1A'}; color: ${p => p.$variant === 'success' ? '#00D4FF' : p.$variant === 'danger' ? '#FF3366' : '#AAA'}; &:hover { opacity: 0.8; }`;
export const ButtonGroup = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`;

export const ActionBar = styled.div`display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;`;
export const GridRow = styled.div`display: grid; grid-template-columns: ${p => p.$cols || '1fr 1fr'}; gap: 0.75rem; margin-bottom: 0.75rem;`;
export const Divider = styled.hr`border: none; border-top: 1px solid #222; margin: 1.5rem 0;`;

export const EntryCard = styled.div`padding: 1.25rem; border-bottom: 1px solid #1A1A1A; &:last-child { border-bottom: none; }`;
export const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;`;
export const EntryName = styled.span`font-weight: 600; color: #FFF;`;
export const EntryContent = styled.p`font-size: 0.9rem; color: #888; margin: 0; line-height: 1.6;`;
export const EntryMeta = styled.div`font-size: 0.75rem; color: #555; margin-top: 0.5rem;`;
export const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;

export const ItemCard = styled.div`border: 1px solid #222; padding: 1.25rem; margin-bottom: 1rem; background: #0A0A0A;`;
export const ItemHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
export const ItemNumber = styled.span`font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; color: #FF3366;`;
export const ItemActions = styled.div`display: flex; gap: 0.25rem;`;

export const AlertBox = styled.div`padding: 1rem; margin-bottom: 1rem; font-size: 0.85rem; border: 1px solid; background: ${p => p.$type === 'success' ? 'rgba(0, 212, 255, 0.1)' : p.$type === 'warning' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(33, 150, 243, 0.1)'}; border-color: ${p => p.$type === 'success' ? 'rgba(0, 212, 255, 0.3)' : p.$type === 'warning' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(33, 150, 243, 0.3)'}; color: ${p => p.$type === 'success' ? '#00D4FF' : p.$type === 'warning' ? '#FF9800' : '#64B5F6'};`;
export const SearchInput = styled.input`flex: 1; min-width: 200px; padding: 0.75rem 1rem; font-family: 'Inter', sans-serif; font-size: 0.9rem; border: 1px solid #222; background: #0A0A0A; color: #FFF; &:focus { outline: none; border-color: #FF3366; box-shadow: 0 0 10px rgba(255, 51, 102, 0.2); }`;

export const PhotoGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;`;
export const PhotoActions = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center;`;
export const PhotoCount = styled.span`color: #666; font-size: 0.8rem;`;
export const PhotoCard = styled.div`position: relative; aspect-ratio: 1; overflow: hidden; border: 2px solid ${p => p.$selected ? '#FF3366' : p.$approved ? '#222' : '#FF9800'}; transition: all 0.3s; &:hover { border-color: #FF3366; box-shadow: 0 0 15px rgba(255, 51, 102, 0.3); } &:hover > div { opacity: 1; }`;
export const PhotoImage = styled.div`width: 100%; height: 100%; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#1A1A1A'}; cursor: pointer;`;
export const PhotoOverlay = styled.div`position: absolute; inset: 0; background: rgba(10, 10, 10, 0.85); display: flex; align-items: center; justify-content: center; gap: 0.5rem; opacity: 0; transition: opacity 0.2s;`;
export const PhotoButton = styled.button`width: 32px; height: 32px; border-radius: 50%; border: none; background: ${p => p.$approve ? '#00D4FF' : '#FF3366'}; color: ${p => p.$approve ? '#000' : '#FFF'}; cursor: pointer; font-size: 14px; box-shadow: 0 0 10px ${p => p.$approve ? 'rgba(0, 212, 255, 0.5)' : 'rgba(255, 51, 102, 0.5)'};`;
export const PhotoPending = styled.div`position: absolute; bottom: 0; left: 0; right: 0; background: #FF9800; color: #000; font-size: 0.65rem; font-weight: 600; padding: 0.25rem; text-align: center;`;

export const DropZone = styled.div`border: 2px dashed ${p => p.$dragging ? '#FF3366' : p.$hasImage ? '#00D4FF' : '#222'}; background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : '#0A0A0A'}; min-height: 150px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; aspect-ratio: ${p => p.$ratio || 'auto'}; transition: all 0.3s; &:hover { border-color: #FF3366; box-shadow: 0 0 20px rgba(255, 51, 102, 0.2); } &:hover .overlay { opacity: 1; }`;
export const DropOverlay = styled.div`position: absolute; inset: 0; background: rgba(10, 10, 10, 0.9); display: flex; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0; transition: opacity 0.2s;`;
export const DropButton = styled.span`padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; background: ${p => p.$danger ? '#FF3366' : '#00D4FF'}; color: ${p => p.$danger ? '#FFF' : '#000'};`;
export const DropPlaceholder = styled.div`text-align: center; color: #555; font-size: 0.85rem; span { display: block; font-size: 2rem; margin-bottom: 0.5rem; }`;
export const ProgressBar = styled.div`position: absolute; bottom: 0; left: 0; height: 4px; background: linear-gradient(90deg, #FF3366, #00D4FF); width: ${p => p.$progress}%; transition: width 0.3s; box-shadow: 0 0 10px rgba(255, 51, 102, 0.5);`;

export const ImageGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem; margin-top: 0.5rem;`;
export const ImageItem = styled.div`aspect-ratio: 1; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#1A1A1A'}; position: relative; transition: all 0.3s; &:hover { box-shadow: 0 0 15px rgba(255, 51, 102, 0.3); } &:hover button { opacity: 1; }`;
export const RemoveButton = styled.button`position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; background: #FF3366; color: white; border: none; cursor: pointer; font-size: 14px; opacity: 0; transition: opacity 0.2s;`;
export const AddButton = styled.button`aspect-ratio: 1; background: #0A0A0A; border: 2px dashed #222; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; color: #555; span { font-size: 1.5rem; } transition: all 0.3s; &:hover { border-color: #FF3366; color: #FF3366; }`;

export const ColorPalette = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: flex-end;`;
export const ColorItem = styled.div`display: flex; flex-direction: column; gap: 0.25rem;`;
export const ColorInput = styled.input`width: 40px; height: 40px; padding: 0; border: 1px solid #222; cursor: pointer; background: #0A0A0A;`;

export const StatusDescription = styled.div`font-size: 0.9rem; color: #888; margin-bottom: 1.5rem; line-height: 1.6; p { margin: 0.5rem 0; }`;
export const InfoRow = styled.div`display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #1A1A1A;`;
export const InfoLabel = styled.span`font-family: 'Inter', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #555;`;
export const InfoValue = styled.span`font-size: 0.9rem; color: #FFF;`;

export const LoadingSpinner = styled.div`display: flex; justify-content: center; padding: 2rem; &::after { content: ''; width: 30px; height: 30px; border: 2px solid #222; border-top-color: #FF3366; border-radius: 50%; animation: ${spin} 1s linear infinite; box-shadow: 0 0 15px rgba(255, 51, 102, 0.3); }`;
export const EmptyState = styled.p`text-align: center; color: #555; padding: 2rem; font-family: 'Inter', sans-serif;`;
export const FeedbackModal = styled.div`position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; background: ${p => p.type === 'success' ? '#00D4FF' : p.type === 'error' ? '#FF3366' : '#64B5F6'}; color: ${p => p.type === 'success' ? '#000' : '#FFF'}; box-shadow: 0 0 30px ${p => p.type === 'success' ? 'rgba(0, 212, 255, 0.5)' : 'rgba(255, 51, 102, 0.5)'}; animation: ${fadeIn} 0.3s ease; z-index: 1000;`;

// Neon bolt icon
export const LogoIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: '#FF3366', filter: 'drop-shadow(0 0 3px rgba(255, 51, 102, 0.8))' }}>
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
  </svg>
);

export const NeonAdminComponents = {
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
  AlertBox, SearchInput,
  PhotoGrid, PhotoActions, PhotoCount, PhotoCard, PhotoImage, PhotoOverlay, PhotoButton, PhotoPending,
  DropZone, DropOverlay, DropButton, DropPlaceholder, ProgressBar,
  ImageGrid, ImageItem, RemoveButton, AddButton,
  ColorPalette, ColorItem, ColorInput,
  StatusDescription, InfoRow, InfoLabel, InfoValue,
  LoadingSpinner, EmptyState, FeedbackModal, LogoIcon,
};

export default NeonAdminComponents;
