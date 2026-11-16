// CassisAdminStyles.js – Kundendashboard im Aussehen des Cassis-Themes
// Aufbau wie das Classic-Dashboard; Farben der Einladung (Papier, Blaugrau, dunkle Schrift)
// und die beiden Schriften des Themes (lokal eingebunden über themes/cassis/GlobalStyles).
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const lineExpand = keyframes`from { width: 0; } to { width: 60px; }`;

// Farben des Cassis-Themes. „gold“ ist hier das Druckgrau der Einladung (Akzent, auf Weiß gut lesbar).
const c = {
  white: '#FFFFFF',
  cream: '#F8F6F6',
  creamDark: '#F0ECED',
  warm: '#E7E3E6',
  dark: '#33353F',
  text: '#33353F',
  textSec: '#5D5C66',
  textMuted: '#6E6D78',
  gold: '#747178',
  border: 'rgba(51,53,63,0.14)',
  borderDark: 'rgba(51,53,63,0.22)',
  error: '#C41E3A',
  success: '#3A7D44',
};

// LOGIN - Cream background, centered white card
export const LoginContainer = styled.div`
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  background:${c.creamDark};
`;
export const LoginBox = styled.div`
  background:${c.white}; max-width:420px; width:90%; padding:3.5rem 3rem;
  position:relative; box-shadow:0 4px 30px rgba(0,0,0,0.06);
  animation:${fadeIn} 0.6s ease;
  &::before { content:''; position:absolute; top:0; left:50%; transform:translateX(-50%);
    width:60px; height:2px; background:${c.gold}; animation:${lineExpand} 0.8s ease forwards; }
`;
export const LoginLogo = styled.div`
  text-align:center; margin-bottom:2.5rem; padding-top:1rem;
  h1 { font-family:'Cassis Serif','Cormorant Garamond',serif; font-size:2.2rem; font-weight:300;
    letter-spacing:0.12em; color:${c.dark}; line-height:1.2;
    span { display:block; font-family:'Cassis Serif','Cormorant Garamond',serif; font-size:1.1rem;
      font-weight:400; color:${c.gold}; letter-spacing:0.02em; margin-top:0.25rem; } }
  p { font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; letter-spacing:0.25em;
    text-transform:uppercase; color:${c.textMuted}; margin-top:1rem; }
`;
export const LoginForm = styled.form`display:flex; flex-direction:column; gap:1.25rem;`;
export const LoginError = styled.p`font-family:'Cassis Sans','Lato',sans-serif; font-size:0.8rem; color:${c.error}; text-align:center; padding:0.75rem 1rem; background:rgba(196,30,58,0.05); border:1px solid rgba(196,30,58,0.12);`;
export const LoginButton = styled.button`
  width:100%; padding:1.1rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem;
  font-weight:600; letter-spacing:0.2em; text-transform:uppercase;
  background:${c.dark}; color:${c.cream}; border:none; cursor:pointer;
  transition:all 0.3s; &:hover { background:#3F424F; }
`;
export const BackLink = styled.a`display:block; text-align:center; margin-top:2rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; letter-spacing:0.1em; color:${c.textMuted}; text-decoration:none; cursor:pointer; &:hover { color:${c.gold}; }`;

// DASHBOARD
export const DashboardContainer = styled.div`
  min-height:100vh; display:flex; background:${c.cream};
  --admin-text: ${c.dark};
  --admin-text-secondary: ${c.textSec};
  --admin-text-muted: ${c.textMuted};
  --admin-text-subtle: rgba(0,0,0,0.25);
  --admin-border: ${c.border};
  --admin-border-subtle: rgba(0,0,0,0.04);
  --admin-bg-subtle: rgba(0,0,0,0.02);
  --admin-bg-hover: rgba(0,0,0,0.04);
  --admin-glass: rgba(0,0,0,0.02);
  --admin-glass-hover: rgba(0,0,0,0.04);
  --admin-glass-border: ${c.border};
  --admin-glass-border-hover: rgba(196,168,124,0.3);
  --admin-accent: ${c.gold};
  --admin-accent-light: rgba(196,168,124,0.15);
  --admin-accent-muted: rgba(196,168,124,0.08);
  --admin-success: ${c.success};
  --admin-error: ${c.error};
`;
export const Sidebar = styled.aside`
  width:260px; background:${c.white}; border-right:1px solid ${c.border};
  position:fixed; top:0; left:0; bottom:0; padding:2rem 0; overflow-y:auto; z-index:100;
  @media(max-width:968px){ transform:translateX(${p=>p.$open?'0':'-100%'}); transition:transform 0.3s ease; box-shadow:${p=>p.$open?'4px 0 20px rgba(0,0,0,0.08)':'none'}; }
`;
export const SidebarHeader = styled.div`
  padding:0 1.5rem 1.5rem; border-bottom:1px solid ${c.border}; margin-bottom:1.25rem;
  &::after { content:''; display:block; width:30px; height:1px; background:${c.gold}; margin-top:1rem; }
`;
export const SidebarLogo = styled.div`font-family:'Cassis Serif','Cormorant Garamond',serif; font-size:1.3rem; font-weight:300; letter-spacing:0.1em; color:${c.dark}; span { font-family:'Cassis Serif','Cormorant Garamond',serif; font-size:0.9rem; color:${c.gold}; }`;
export const SidebarSub = styled.p`font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; color:${c.textMuted}; margin-top:0.35rem;`;
export const NavSection = styled.div`margin-bottom:0.25rem;`;
export const NavSectionTitle = styled.div`padding:1rem 1.5rem 0.5rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; font-weight:600; letter-spacing:0.25em; text-transform:uppercase; color:${c.textMuted};`;
export const NavItem = styled.button`
  width:100%; display:flex; align-items:center; gap:0.75rem; padding:0.65rem 1.5rem;
  font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; font-weight:${p=>p.$active?'400':'300'};
  letter-spacing:0.04em; color:${p=>p.$active?c.dark:c.textSec};
  background:${p=>p.$active?c.creamDark:'transparent'};
  border:none; border-left:2px solid ${p=>p.$active?c.gold:'transparent'};
  cursor:pointer; text-align:left; transition:all 0.2s;
  &:hover { background:${c.cream}; color:${c.dark}; }
`;
export const NavBadge = styled.span`margin-left:auto; font-size:0.75rem; font-weight:600; padding:0.15rem 0.45rem; background:${p=>p.$warning?'rgba(196,30,58,0.08)':'rgba(196,168,124,0.15)'}; color:${p=>p.$warning?c.error:c.gold};`;
export const NavDivider = styled.div`height:1px; background:${c.border}; margin:0.75rem 1.5rem;`;
export const Main = styled.main`flex:1; margin-left:260px; padding:2.5rem 2rem; max-width:920px; @media(max-width:968px){ margin-left:0; }`;
export const Header = styled.header`
  display:flex; justify-content:space-between; align-items:flex-end;
  margin-bottom:2.5rem; padding-bottom:1.25rem; border-bottom:1px solid ${c.border}; position:relative;
  &::after { content:''; position:absolute; bottom:-1px; left:0; width:40px; height:2px; background:${c.gold}; }
`;
export const PageTitle = styled.h1`font-family:'Cassis Serif','Cormorant Garamond',serif; font-size:1.6rem; font-weight:300; letter-spacing:0.06em; color:${c.dark};`;
export const MobileMenuToggle = styled.button`display:none; position:fixed; top:1rem; right:1rem; z-index:101; background:${c.white}; border:1px solid ${c.border}; color:${c.dark}; padding:0.75rem; cursor:pointer; @media(max-width:968px){ display:block; }`;

// STATS
export const StatsGrid = styled.div`display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:1px; background:${c.border}; border:1px solid ${c.border}; margin-bottom:2rem;`;
export const StatCard = styled.div`background:${c.white}; padding:1.25rem 1rem; text-align:center;`;
export const StatNumber = styled.div`font-family:'Cassis Serif','Cormorant Garamond',serif; font-size:2.2rem; font-weight:300; color:${c.dark};`;
export const StatLabel = styled.div`font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; color:${c.textMuted}; margin-top:0.4rem;`;
export const Card = styled.div`background:${c.white}; border:1px solid ${c.border}; padding:1.25rem;`;

// PANELS
export const Panel = styled.div`background:${c.white}; border:1px solid ${c.border}; margin-bottom:1.5rem;`;
export const PanelHeader = styled.div`padding:1rem 1.5rem; border-bottom:1px solid ${c.border}; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;`;
export const PanelTitle = styled.h3`font-family:'Cassis Serif','Cormorant Garamond',serif; font-size:1.15rem; font-weight:400; letter-spacing:0.03em; color:${c.dark};`;
export const PanelContent = styled.div`padding:1.5rem; max-height:${p=>p.$maxHeight||'auto'}; overflow-y:auto;`;

// TABLE
export const TableWrapper = styled.div`overflow-x:auto;`;
export const Table = styled.table`width:100%; border-collapse:collapse; font-size:0.85rem;`;
export const Th = styled.th`text-align:left; padding:0.75rem 1rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:${c.textMuted}; border-bottom:1px solid ${c.borderDark};`;
export const Td = styled.td`padding:0.85rem 1rem; border-bottom:1px solid ${c.border}; color:${c.textSec}; font-weight:300;`;
export const StatusBadge = styled.span`font-size:0.75rem; font-weight:500; padding:0.2rem 0.5rem; background:${p=>p.$status==='confirmed'?'rgba(58,125,68,0.08)':p.$status==='declined'?'rgba(196,30,58,0.08)':'rgba(196,168,124,0.1)'}; color:${p=>p.$status==='confirmed'?c.success:p.$status==='declined'?c.error:c.gold};`;

// FORMS
export const FormGroup = styled.div`margin-bottom:1rem;`;
export const Label = styled.label`display:block; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:${c.textSec}; margin-bottom:0.5rem;`;
export const SectionLabel = styled.div`font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:${c.gold}; margin:1.75rem 0 0.75rem; padding-bottom:0.5rem; border-bottom:1px solid rgba(196,168,124,0.2);`;
export const Input = styled.input`width:100%; padding:0.85rem 1rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.85rem; font-weight:300; border:1px solid ${p=>p.$error?c.error:c.border}; background:${c.cream}; color:${c.dark}; box-sizing:border-box; transition:border-color 0.2s; &:focus{outline:none;border-color:${c.gold};} &::placeholder{color:${c.textMuted};}`;
export const TextArea = styled.textarea`width:100%; padding:0.85rem 1rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.85rem; font-weight:300; border:1px solid ${c.border}; background:${c.cream}; color:${c.dark}; min-height:100px; resize:vertical; box-sizing:border-box; line-height:1.7; &:focus{outline:none;border-color:${c.gold};} &::placeholder{color:${c.textMuted};}`;
export const Checkbox = styled.label`display:flex; align-items:center; gap:0.75rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.8rem; font-weight:300; color:${c.textSec}; cursor:pointer; input{width:16px;height:16px;accent-color:${c.gold};}`;
export const CheckboxLabel = styled.label`display:flex; align-items:center; gap:0.75rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.8rem; font-weight:300; color:${c.textSec}; cursor:pointer; input[type="checkbox"]{width:16px;height:16px;accent-color:${c.gold};}`;
export const ErrorText = styled.span`font-size:0.75rem; color:${c.error}; margin-top:0.25rem; display:block;`;
export const HelpText = styled.span`font-size:0.75rem; color:${c.textMuted}; margin-top:0.25rem; display:block; font-weight:300;`;
export const Select = styled.select`width:100%; padding:0.85rem 1rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.85rem; font-weight:300; border:1px solid ${c.border}; background:${c.cream}; color:${c.dark}; box-sizing:border-box; cursor:pointer; &:focus{outline:none;border-color:${c.gold};} option{background:${c.white};color:${c.dark};}`;
export const FormRow = styled.div`display:flex; gap:1rem; @media(max-width:600px){flex-direction:column;}`;

// BUTTONS
export const Button = styled.button`font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; padding:0.7rem 1.25rem; cursor:pointer; transition:all 0.2s; background:${p=>p.$variant==='danger'?'transparent':p.$variant==='secondary'?'transparent':c.dark}; color:${p=>p.$variant==='danger'?c.error:p.$variant==='secondary'?c.gold:c.cream}; border:1px solid ${p=>p.$variant==='danger'?c.error:p.$variant==='secondary'?c.gold:c.dark}; &:hover{opacity:0.85;} &:disabled{background:${c.creamDark};color:${c.textMuted};border-color:${c.border};cursor:not-allowed;}`;
export const SmallButton = styled.button`font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; letter-spacing:0.05em; padding:0.35rem 0.7rem; cursor:pointer; border:1px solid ${c.border}; background:${p=>p.$variant==='success'?'rgba(58,125,68,0.06)':p.$variant==='danger'?'rgba(196,30,58,0.06)':c.white}; color:${p=>p.$variant==='success'?c.success:p.$variant==='danger'?c.error:c.textSec}; &:hover{opacity:0.8;}`;
export const ButtonGroup = styled.div`display:flex; gap:0.5rem; flex-wrap:wrap;`;
export const ActionBar = styled.div`display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap;`;
export const GridRow = styled.div`display:grid; grid-template-columns:${p=>p.$cols||'1fr 1fr'}; gap:0.75rem; margin-bottom:0.75rem;`;
export const Divider = styled.hr`border:none; border-top:1px solid ${c.border}; margin:1.5rem 0;`;
export const Badge = styled.span`font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; padding:0.2rem 0.6rem; background:rgba(196,168,124,0.1); color:${c.gold};`;

// ENTRIES
export const EntryCard = styled.div`padding:1.25rem; border-bottom:1px solid ${c.border}; &:last-child{border-bottom:none;}`;
export const EntryHeader = styled.div`display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;`;
export const EntryName = styled.span`font-weight:400; color:${c.dark}; font-size:0.9rem;`;
export const EntryContent = styled.p`font-size:0.85rem; color:${c.textSec}; margin:0; line-height:1.7; font-weight:300;`;
export const EntryMeta = styled.div`font-size:0.75rem; color:${c.textMuted}; margin-top:0.5rem;`;
export const EntryActions = styled.div`display:flex; gap:0.5rem; margin-top:0.75rem;`;

// ITEMS
export const ItemCard = styled.div`border:1px solid ${c.border}; padding:1.25rem; margin-bottom:1rem; background:${c.cream};`;
export const ItemHeader = styled.div`display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;`;
export const ItemNumber = styled.span`font-family:'Cassis Serif','Cormorant Garamond',serif; font-size:1rem; color:${c.gold}; font-weight:300;`;
export const ItemActions = styled.div`display:flex; gap:0.25rem;`;

// ALERTS
export const AlertBox = styled.div`padding:1rem; margin-bottom:1rem; font-size:0.8rem; font-weight:300; border:1px solid; background:${p=>p.$type==='success'?'rgba(58,125,68,0.05)':p.$type==='warning'?'rgba(196,168,124,0.06)':'rgba(33,150,243,0.04)'}; border-color:${p=>p.$type==='success'?'rgba(58,125,68,0.15)':p.$type==='warning'?'rgba(196,168,124,0.15)':'rgba(33,150,243,0.15)'}; color:${p=>p.$type==='success'?c.success:p.$type==='warning'?c.gold:'#4A90D9'};`;
export const SearchInput = styled.input`flex:1; min-width:200px; padding:0.7rem 1rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.8rem; font-weight:300; border:1px solid ${c.border}; background:${c.white}; color:${c.dark}; &:focus{outline:none;border-color:${c.gold};} &::placeholder{color:${c.textMuted};}`;

// PHOTOS
export const PhotoGrid = styled.div`display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:0.75rem;`;
export const PhotoActions = styled.div`display:flex; gap:0.5rem; margin-bottom:1rem; flex-wrap:wrap; align-items:center;`;
export const PhotoCount = styled.span`color:${c.textMuted}; font-size:0.75rem; font-weight:300;`;
export const PhotoCard = styled.div`position:relative; aspect-ratio:1; overflow:hidden; border:1px solid ${p=>p.$selected?c.gold:p.$approved?c.border:'rgba(196,168,124,0.4)'}; &:hover>div{opacity:1;}`;
export const PhotoImage = styled.div`width:100%; height:100%; background:${p=>p.$url?`url(${p.$url}) center/cover`:c.creamDark}; cursor:pointer;`;
export const PhotoOverlay = styled.div`position:absolute; inset:0; background:rgba(255,255,255,0.9); display:flex; align-items:center; justify-content:center; gap:0.5rem; opacity:0; transition:opacity 0.2s;`;
export const PhotoButton = styled.button`width:30px; height:30px; border-radius:50%; border:none; background:${p=>p.$approve?c.success:c.error}; color:white; cursor:pointer; font-size:13px;`;
export const PhotoPending = styled.div`position:absolute; bottom:0; left:0; right:0; background:${c.gold}; color:${c.dark}; font-size:0.75rem; font-weight:600; letter-spacing:0.05em; padding:0.2rem; text-align:center;`;
export const PhotoCaption = styled.div`position:absolute; top:0; left:0; right:0; background:rgba(26,26,26,0.75); color:white; font-size:0.75rem; padding:0.3rem 0.5rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`;

// IMAGE UPLOAD
export const DropZone = styled.div`border:1px dashed ${p=>p.$dragging?c.gold:p.$hasImage?c.gold:c.border}; background:${p=>p.$hasImage?`url(${p.$image}) center/cover`:c.cream}; min-height:90px; max-width:280px; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; aspect-ratio:${p=>p.$ratio||'16/9'}; transition:border-color 0.3s; &:hover{border-color:${c.gold};} &:hover .overlay{opacity:1;}`;
export const DropOverlay = styled.div`position:absolute; inset:0; background:rgba(255,255,255,0.92); display:flex; align-items:center; justify-content:center; gap:0.75rem; opacity:0; transition:opacity 0.2s;`;
export const DropButton = styled.span`padding:0.4rem 0.9rem; font-size:0.75rem; letter-spacing:0.05em; cursor:pointer; background:${p=>p.$danger?c.error:c.dark}; color:${c.white};`;
export const DropPlaceholder = styled.div`text-align:center; color:${c.textMuted}; font-size:0.75rem; font-weight:300; span{display:block;font-size:1.5rem;margin-bottom:0.5rem;}`;
export const ProgressBar = styled.div`position:absolute; bottom:0; left:0; height:2px; background:${c.gold}; width:${p=>p.$progress}%; transition:width 0.3s;`;

export const ImageGrid = styled.div`display:grid; grid-template-columns:repeat(auto-fill,75px); gap:0.5rem; margin-top:0.5rem;`;
export const ImageItem = styled.div`aspect-ratio:1; background:${p=>p.$url?`url(${p.$url}) center/cover`:c.creamDark}; position:relative; border:1px solid ${c.border}; &:hover button{opacity:1;}`;
export const RemoveButton = styled.button`position:absolute; top:3px; right:3px; width:22px; height:22px; border-radius:50%; background:${c.error}; color:white; border:none; cursor:pointer; font-size:12px; opacity:0; transition:opacity 0.2s;`;
export const AddButton = styled.button`aspect-ratio:1; background:${c.cream}; border:1px dashed ${c.border}; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; font-size:0.75rem; color:${c.textMuted}; span{font-size:1.25rem;} &:hover{border-color:${c.gold};color:${c.gold};}`;

// COLORS
export const ColorPalette = styled.div`display:flex; gap:0.5rem; margin-bottom:1.5rem; flex-wrap:wrap; align-items:flex-end;`;
export const ColorItem = styled.div`display:flex; flex-direction:column; gap:0.25rem;`;
export const ColorInput = styled.input`width:36px; height:36px; padding:0; border:1px solid ${c.border}; cursor:pointer; background:${c.white};`;

// STATUS & INFO
export const StatusDescription = styled.div`font-size:0.85rem; color:${c.textSec}; margin-bottom:1.5rem; line-height:1.7; font-weight:300; p{margin:0.5rem 0;}`;
export const InfoRow = styled.div`display:flex; justify-content:space-between; padding:0.75rem 0; border-bottom:1px solid ${c.border};`;
export const InfoLabel = styled.span`font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; letter-spacing:0.15em; text-transform:uppercase; color:${c.textMuted};`;
export const InfoValue = styled.span`font-size:0.85rem; color:${c.dark}; font-weight:300;`;

// LOADING & FEEDBACK
export const LoadingSpinner = styled.div`display:flex; justify-content:center; padding:2rem; &::after{content:'';width:24px;height:24px;border:1px solid ${c.border};border-top-color:${c.gold};border-radius:50%;animation:${spin} 1s linear infinite;}`;
export const EmptyState = styled.p`text-align:center; color:${c.textMuted}; padding:2rem; font-family:'Cassis Sans','Lato',sans-serif; font-weight:300; font-size:0.85rem;`;
export const FeedbackModal = styled.div`position:fixed; bottom:2rem; right:2rem; padding:0.85rem 1.5rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.8rem; background:${c.white}; color:${p=>p.type==='success'?c.success:p.type==='error'?c.error:c.gold}; border:1px solid ${p=>p.type==='success'?'rgba(58,125,68,0.2)':p.type==='error'?'rgba(196,30,58,0.2)':'rgba(196,168,124,0.2)'}; box-shadow:0 4px 20px rgba(0,0,0,0.08); animation:${fadeIn} 0.3s ease; z-index:1000;`;

// MODAL
export const ModalOverlay = styled.div`position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; animation:${fadeIn} 0.2s ease; padding:1rem;`;
export const ModalContent = styled.div`background:${c.white}; max-width:450px; width:100%; border:1px solid ${c.border}; box-shadow:0 10px 40px rgba(0,0,0,0.12); animation:${fadeIn} 0.3s ease;`;
export const ModalHeader = styled.div`padding:1.25rem 1.5rem; border-bottom:1px solid ${c.border};`;
export const ModalTitle = styled.h3`font-family:'Cassis Serif','Cormorant Garamond',serif; font-size:1.15rem; font-weight:400; color:${c.dark}; margin:0;`;
export const ModalBody = styled.div`padding:1.5rem; color:${c.textSec}; line-height:1.7; font-weight:300; p{margin:0;}`;
export const ModalFooter = styled.div`padding:1.25rem 1.5rem; border-top:1px solid ${c.border}; display:flex; justify-content:flex-end; gap:0.75rem;`;
export const ActionButton = styled.button`padding:0.65rem 1.25rem; font-family:'Cassis Sans','Lato',sans-serif; font-size:0.75rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all 0.2s; border:1px solid; ${p=>p.$primary?css`background:${c.dark};border-color:${c.dark};color:${c.cream};&:hover:not(:disabled){background:#3F424F;}`:css`background:transparent;border-color:${c.border};color:${c.textSec};&:hover:not(:disabled){border-color:${c.textSec};color:${c.dark};}`} &:disabled{opacity:0.4;cursor:not-allowed;}`;

export const LogoIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#747178' }}>
    <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.5L18.5 12 12 18.5 5.5 12 12 5.5z"/>
  </svg>
);

// EXPORT
export const CassisAdminComponents = {
  LoginContainer, LoginBox, LoginLogo, LoginForm, LoginError, LoginButton, BackLink,
  DashboardContainer, Sidebar, SidebarHeader, SidebarLogo, SidebarSub,
  NavSection, NavSectionTitle, NavItem, NavBadge, NavDivider,
  Main, Header, PageTitle, MobileMenuToggle,
  StatsGrid, StatCard, StatNumber, StatLabel, Card,
  Panel, PanelHeader, PanelTitle, PanelContent,
  TableWrapper, Table, Th, Td, StatusBadge,
  FormGroup, Label, SectionLabel, Input, TextArea, Checkbox, CheckboxLabel, ErrorText, HelpText, Select, FormRow,
  Button, SmallButton, ButtonGroup, ActionBar, GridRow, Divider, Badge,
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

export default CassisAdminComponents;
