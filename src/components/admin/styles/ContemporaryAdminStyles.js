// themes/contemporary/ContemporaryAdminStyles.js - Modern, clean, geometric
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const spin = keyframes`to { transform: rotate(360deg); }`;

// Contemporary: Warm neutrals, geometric, Cormorant Garamond + Montserrat
// Colors: --sand: #D4C5B5, --charcoal: #2C2C2C, --warm-white: #FAF9F7

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #FAF9F7 0%, #EDE8E3 100%);
`;

export const LoginBox = styled.div`
  background: white;
  max-width: 440px;
  width: 90%;
  padding: 3rem;
  box-shadow: 0 30px 60px rgba(44, 44, 44, 0.1);
  animation: ${fadeIn} 0.6s ease;
`;

export const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.25rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    color: #2C2C2C;
    span { font-weight: 500; }
  }
  p { font-family: 'Montserrat', sans-serif; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-top: 0.5rem; }
`;

export const LoginForm = styled.form`display: flex; flex-direction: column; gap: 1.5rem;`;
export const LoginError = styled.p`font-size: 0.85rem; color: #B71C1C; text-align: center; padding: 1rem; background: #FFEBEE;`;
export const LoginButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: #2C2C2C;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  &:hover { background: #444; }
`;
export const BackLink = styled.a`display: block; text-align: center; margin-top: 2rem; font-size: 0.8rem; color: #999; text-decoration: none; letter-spacing: 0.05em; cursor: pointer; &:hover { color: #2C2C2C; }`;

export const DashboardContainer = styled.div`min-height: 100vh; display: flex; background: #FAF9F7;`;

export const Sidebar = styled.aside`
  width: 280px;
  background: white;
  border-right: 1px solid #EDE8E3;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  padding: 2rem 0;
  overflow-y: auto;
  z-index: 100;
  @media (max-width: 968px) { transform: translateX(${p => p.$open ? '0' : '-100%'}); transition: transform 0.3s ease; }
`;

export const SidebarHeader = styled.div`padding: 0 1.5rem 2rem; border-bottom: 1px solid #EDE8E3; margin-bottom: 1rem;`;
export const SidebarLogo = styled.div`font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; letter-spacing: 0.05em; color: #2C2C2C; span { font-weight: 500; }`;
export const SidebarSub = styled.p`font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; margin-top: 0.25rem;`;
export const NavSection = styled.div`margin-bottom: 0.5rem;`;
export const NavSectionTitle = styled.div`padding: 0.75rem 1.5rem 0.5rem; font-family: 'Montserrat', sans-serif; font-size: 0.55rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #BBB;`;

export const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: ${p => p.$active ? '#2C2C2C' : '#777'};
  background: ${p => p.$active ? '#FAF9F7' : 'transparent'};
  border: none;
  border-left: 2px solid ${p => p.$active ? '#D4C5B5' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  &:hover { background: #FAF9F7; }
`;

export const NavBadge = styled.span`margin-left: auto; font-size: 0.55rem; font-weight: 600; padding: 0.15rem 0.5rem; background: ${p => p.$warning ? '#FFF3E0' : '#2C2C2C'}; color: ${p => p.$warning ? '#E65100' : 'white'};`;
export const NavDivider = styled.div`height: 1px; background: #EDE8E3; margin: 1rem 1.5rem;`;
export const Main = styled.main`flex: 1; margin-left: 280px; padding: 2rem; @media (max-width: 968px) { margin-left: 0; }`;
export const Header = styled.header`display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #EDE8E3;`;
export const PageTitle = styled.h1`font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; letter-spacing: 0.05em; color: #2C2C2C;`;
export const MobileMenuToggle = styled.button`display: none; position: fixed; top: 1rem; right: 1rem; z-index: 101; background: white; border: 1px solid #EDE8E3; padding: 0.75rem; cursor: pointer; @media (max-width: 968px) { display: block; }`;

export const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;
export const StatCard = styled.div`background: white; border: 1px solid #EDE8E3; padding: 1.5rem; text-align: center;`;
export const StatNumber = styled.div`font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 300; color: #D4C5B5;`;
export const StatLabel = styled.div`font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; margin-top: 0.5rem;`;

export const Panel = styled.div`background: white; border: 1px solid #EDE8E3; margin-bottom: 1.5rem;`;
export const PanelHeader = styled.div`padding: 1.25rem 1.5rem; border-bottom: 1px solid #EDE8E3; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;`;
export const PanelTitle = styled.h3`font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 400; color: #2C2C2C;`;
export const PanelContent = styled.div`padding: 1.5rem; max-height: ${p => p.$maxHeight || 'auto'}; overflow-y: auto;`;

export const TableWrapper = styled.div`overflow-x: auto;`;
export const Table = styled.table`width: 100%; border-collapse: collapse; font-size: 0.85rem;`;
export const Th = styled.th`text-align: left; padding: 1rem; font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #999; border-bottom: 1px solid #EDE8E3;`;
export const Td = styled.td`padding: 1rem; border-bottom: 1px solid #F5F5F5; color: #2C2C2C;`;
export const StatusBadge = styled.span`font-size: 0.65rem; font-weight: 500; padding: 0.25rem 0.6rem; background: ${p => p.$status === 'confirmed' ? '#E8F5E9' : p.$status === 'declined' ? '#FFEBEE' : '#FFF3E0'}; color: ${p => p.$status === 'confirmed' ? '#2E7D32' : p.$status === 'declined' ? '#C62828' : '#E65100'};`;

export const FormGroup = styled.div`margin-bottom: 1rem;`;
export const Label = styled.label`display: block; font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #999; margin-bottom: 0.5rem;`;
export const SectionLabel = styled.div`font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #2C2C2C; margin: 1.5rem 0 1rem;`;
export const Input = styled.input`width: 100%; padding: 1rem; font-family: 'Montserrat', sans-serif; font-size: 0.95rem; border: 1px solid ${p => p.$error ? '#C62828' : '#EDE8E3'}; background: #FAF9F7; box-sizing: border-box; &:focus { outline: none; border-color: #D4C5B5; }`;
export const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: 'Montserrat', sans-serif; font-size: 0.95rem; border: 1px solid #EDE8E3; background: #FAF9F7; min-height: 100px; resize: vertical; box-sizing: border-box; &:focus { outline: none; border-color: #D4C5B5; }`;
export const Checkbox = styled.label`display: flex; align-items: center; gap: 0.75rem; font-family: 'Montserrat', sans-serif; font-size: 0.85rem; color: #2C2C2C; cursor: pointer; input { width: 18px; height: 18px; accent-color: #D4C5B5; }`;
export const ErrorText = styled.span`font-size: 0.75rem; color: #C62828; margin-top: 0.25rem; display: block;`;

export const Button = styled.button`font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.25rem; cursor: pointer; transition: all 0.3s; background: ${p => p.$variant === 'danger' ? '#C62828' : p.$variant === 'secondary' ? 'white' : '#2C2C2C'}; color: ${p => p.$variant === 'secondary' ? '#2C2C2C' : 'white'}; border: ${p => p.$variant === 'secondary' ? '1px solid #EDE8E3' : 'none'}; &:hover { opacity: 0.9; } &:disabled { background: #CCC; cursor: not-allowed; }`;
export const SmallButton = styled.button`font-family: 'Montserrat', sans-serif; font-size: 0.6rem; padding: 0.4rem 0.8rem; cursor: pointer; border: 1px solid #EDE8E3; background: ${p => p.$variant === 'success' ? '#E8F5E9' : p.$variant === 'danger' ? '#FFEBEE' : 'white'}; color: ${p => p.$variant === 'success' ? '#2E7D32' : p.$variant === 'danger' ? '#C62828' : '#777'}; &:hover { opacity: 0.8; }`;
export const ButtonGroup = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`;

export const ActionBar = styled.div`display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;`;
export const GridRow = styled.div`display: grid; grid-template-columns: ${p => p.$cols || '1fr 1fr'}; gap: 0.75rem; margin-bottom: 0.75rem;`;
export const Divider = styled.hr`border: none; border-top: 1px solid #EDE8E3; margin: 1.5rem 0;`;

export const EntryCard = styled.div`padding: 1.25rem; border-bottom: 1px solid #F5F5F5; &:last-child { border-bottom: none; }`;
export const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;`;
export const EntryName = styled.span`font-weight: 500; color: #2C2C2C;`;
export const EntryContent = styled.p`font-size: 0.9rem; color: #777; margin: 0; line-height: 1.6;`;
export const EntryMeta = styled.div`font-size: 0.75rem; color: #BBB; margin-top: 0.5rem;`;
export const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;

export const ItemCard = styled.div`border: 1px solid #EDE8E3; padding: 1.25rem; margin-bottom: 1rem; background: #FAF9F7;`;
export const ItemHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
export const ItemNumber = styled.span`font-family: 'Cormorant Garamond', serif; font-size: 1rem; color: #D4C5B5;`;
export const ItemActions = styled.div`display: flex; gap: 0.25rem;`;

export const AlertBox = styled.div`padding: 1rem; margin-bottom: 1rem; font-size: 0.85rem; background: ${p => p.$type === 'success' ? '#E8F5E9' : p.$type === 'warning' ? '#FFF3E0' : '#E3F2FD'}; color: ${p => p.$type === 'success' ? '#2E7D32' : p.$type === 'warning' ? '#E65100' : '#1565C0'};`;
export const SearchInput = styled.input`flex: 1; min-width: 200px; padding: 0.75rem 1rem; font-family: 'Montserrat', sans-serif; font-size: 0.9rem; border: 1px solid #EDE8E3; background: white; &:focus { outline: none; border-color: #D4C5B5; }`;

export const PhotoGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;`;
export const PhotoActions = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center;`;
export const PhotoCount = styled.span`color: #999; font-size: 0.8rem;`;
export const PhotoCard = styled.div`position: relative; aspect-ratio: 1; overflow: hidden; border: 2px solid ${p => p.$selected ? '#D4C5B5' : p.$approved ? '#EDE8E3' : '#FFF3E0'}; &:hover > div { opacity: 1; }`;
export const PhotoImage = styled.div`width: 100%; height: 100%; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#EDE8E3'}; cursor: pointer;`;
export const PhotoOverlay = styled.div`position: absolute; inset: 0; background: rgba(44, 44, 44, 0.7); display: flex; align-items: center; justify-content: center; gap: 0.5rem; opacity: 0; transition: opacity 0.2s;`;
export const PhotoButton = styled.button`width: 32px; height: 32px; border-radius: 50%; border: none; background: ${p => p.$approve ? '#2E7D32' : '#C62828'}; color: white; cursor: pointer; font-size: 14px;`;
export const PhotoPending = styled.div`position: absolute; bottom: 0; left: 0; right: 0; background: #E65100; color: white; font-size: 0.65rem; padding: 0.25rem; text-align: center;`;

export const DropZone = styled.div`border: 2px dashed ${p => p.$dragging ? '#D4C5B5' : p.$hasImage ? '#D4C5B5' : '#EDE8E3'}; background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : '#FAF9F7'}; min-height: 150px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; aspect-ratio: ${p => p.$ratio || 'auto'}; transition: all 0.3s; &:hover { border-color: #D4C5B5; } &:hover .overlay { opacity: 1; }`;
export const DropOverlay = styled.div`position: absolute; inset: 0; background: rgba(44, 44, 44, 0.7); display: flex; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0; transition: opacity 0.2s;`;
export const DropButton = styled.span`padding: 0.5rem 1rem; font-size: 0.75rem; cursor: pointer; background: ${p => p.$danger ? '#C62828' : 'white'}; color: ${p => p.$danger ? 'white' : '#2C2C2C'};`;
export const DropPlaceholder = styled.div`text-align: center; color: #999; font-size: 0.85rem; span { display: block; font-size: 2rem; margin-bottom: 0.5rem; }`;
export const ProgressBar = styled.div`position: absolute; bottom: 0; left: 0; height: 4px; background: #D4C5B5; width: ${p => p.$progress}%; transition: width 0.3s;`;

export const ImageGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem; margin-top: 0.5rem;`;
export const ImageItem = styled.div`aspect-ratio: 1; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#EDE8E3'}; position: relative; &:hover button { opacity: 1; }`;
export const RemoveButton = styled.button`position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; background: #C62828; color: white; border: none; cursor: pointer; font-size: 14px; opacity: 0; transition: opacity 0.2s;`;
export const AddButton = styled.button`aspect-ratio: 1; background: #FAF9F7; border: 2px dashed #EDE8E3; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; color: #999; span { font-size: 1.5rem; } &:hover { border-color: #D4C5B5; color: #2C2C2C; }`;

export const ColorPalette = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: flex-end;`;
export const ColorItem = styled.div`display: flex; flex-direction: column; gap: 0.25rem;`;
export const ColorInput = styled.input`width: 40px; height: 40px; padding: 0; border: 1px solid #EDE8E3; cursor: pointer;`;

export const StatusDescription = styled.div`font-size: 0.9rem; color: #777; margin-bottom: 1.5rem; line-height: 1.6; p { margin: 0.5rem 0; }`;
export const InfoRow = styled.div`display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #F5F5F5;`;
export const InfoLabel = styled.span`font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999;`;
export const InfoValue = styled.span`font-size: 0.9rem; color: #2C2C2C;`;

export const LoadingSpinner = styled.div`display: flex; justify-content: center; padding: 2rem; &::after { content: ''; width: 30px; height: 30px; border: 2px solid #EDE8E3; border-top-color: #D4C5B5; border-radius: 50%; animation: ${spin} 1s linear infinite; }`;
export const EmptyState = styled.p`text-align: center; color: #999; padding: 2rem; font-family: 'Montserrat', sans-serif;`;
export const FeedbackModal = styled.div`position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; background: ${p => p.type === 'success' ? '#2E7D32' : p.type === 'error' ? '#C62828' : '#1565C0'}; color: white; box-shadow: 0 4px 20px rgba(0,0,0,0.2); animation: ${fadeIn} 0.3s ease; z-index: 1000;`;
export const LogoIcon = null;

export const ContemporaryAdminComponents = {
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

export default ContemporaryAdminComponents;
