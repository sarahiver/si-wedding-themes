// core/AdminShell.js - Main Layout (Logic Only)
import React, { useState } from 'react';
import { useAdmin, AdminProvider } from './AdminContext';

// Import Sections
import DashboardSection from './sections/DashboardSection';
import RSVPSection from './sections/RSVPSection';
import GuestbookSection from './sections/GuestbookSection';
import MusicSection from './sections/MusicSection';
import PhotosSection from './sections/PhotosSection';
import StatusSection from './sections/StatusSection';

// Import Editors
import * as Editors from './editors';

function AdminShellInner({ components: C, LoginComponent }) {
  const admin = useAdmin();
  const {
    isLoggedIn, loginError, login,
    activeTab, setActiveTab,
    sidebarOpen, setSidebarOpen,
    navItems, coupleNames, slug,
    isLoading,
    feedback, closeFeedback,
  } = admin;

  // Tab titles
  const titles = {
    'dashboard': 'Übersicht',
    'rsvp': 'RSVP-Antworten',
    'guestbook': 'Gästebuch',
    'music': 'Musikwünsche',
    'photos': 'Gäste-Fotos',
    'edit-hero': 'Hero',
    'edit-countdown': 'Countdown',
    'edit-lovestory': 'Love Story',
    'edit-timeline': 'Ablauf',
    'edit-locations': 'Locations',
    'edit-directions': 'Anfahrt',
    'edit-rsvp': 'RSVP-Einstellungen',
    'edit-dresscode': 'Dresscode',
    'edit-gifts': 'Geschenke',
    'edit-hotels': 'Hotels',
    'edit-witnesses': 'Trauzeugen',
    'edit-gallery': 'Galerie',
    'edit-faq': 'FAQ',
    'edit-abc': 'Hochzeits-ABC',
    'edit-contact': 'Kontakt',
    'edit-footer': 'Footer',
    'status': 'Status',
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return LoginComponent ? (
      <LoginComponent 
        components={C} 
        onLogin={login} 
        error={loginError}
        coupleNames={coupleNames}
        slug={slug}
      />
    ) : (
      <DefaultLogin 
        components={C} 
        onLogin={login} 
        error={loginError} 
        coupleNames={coupleNames} 
        slug={slug} 
      />
    );
  }

  // Render active section
  const renderContent = () => {
    if (isLoading) return <C.LoadingSpinner />;

    switch (activeTab) {
      case 'dashboard': return <DashboardSection components={C} />;
      case 'rsvp': return <RSVPSection components={C} />;
      case 'guestbook': return <GuestbookSection components={C} />;
      case 'music': return <MusicSection components={C} />;
      case 'photos': return <PhotosSection components={C} />;
      case 'edit-hero': return <Editors.HeroEditor components={C} />;
      case 'edit-countdown': return <Editors.CountdownEditor components={C} />;
      case 'edit-lovestory': return <Editors.LovestoryEditor components={C} />;
      case 'edit-timeline': return <Editors.TimelineEditor components={C} />;
      case 'edit-locations': return <Editors.LocationsEditor components={C} />;
      case 'edit-directions': return <Editors.DirectionsEditor components={C} />;
      case 'edit-rsvp': return <Editors.RSVPEditor components={C} />;
      case 'edit-dresscode': return <Editors.DresscodeEditor components={C} />;
      case 'edit-gifts': return <Editors.GiftsEditor components={C} />;
      case 'edit-hotels': return <Editors.HotelsEditor components={C} />;
      case 'edit-witnesses': return <Editors.WitnessesEditor components={C} />;
      case 'edit-gallery': return <Editors.GalleryEditor components={C} />;
      case 'edit-faq': return <Editors.FAQEditor components={C} />;
      case 'edit-abc': return <Editors.ABCEditor components={C} />;
      case 'edit-contact': return <Editors.ContactEditor components={C} />;
      case 'edit-footer': return <Editors.FooterEditor components={C} />;
      case 'status': return <StatusSection components={C} />;
      default: return <C.EmptyState>Bereich nicht gefunden</C.EmptyState>;
    }
  };

  // MAIN DASHBOARD
  return (
    <C.DashboardContainer>
      <C.MobileMenuToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </C.MobileMenuToggle>

      <C.Sidebar $open={sidebarOpen}>
        <C.SidebarHeader>
          <C.SidebarLogo>
            {C.LogoIcon && <C.LogoIcon />}
            Admin <span>Panel</span>
          </C.SidebarLogo>
          <C.SidebarSub>{coupleNames}</C.SidebarSub>
        </C.SidebarHeader>

        {navItems.map(section => (
          <C.NavSection key={section.section}>
            <C.NavSectionTitle>{section.section}</C.NavSectionTitle>
            {section.items.map(item => (
              <C.NavItem
                key={item.id}
                $active={activeTab === item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              >
                {item.icon} {item.label}
                {item.badge > 0 && (
                  <C.NavBadge $warning={item.warning}>{item.badge}</C.NavBadge>
                )}
              </C.NavItem>
            ))}
          </C.NavSection>
        ))}

        <C.NavDivider />
        <C.NavItem onClick={() => window.location.href = slug ? `/${slug}` : '/'}>
          ← Zurück zur Website
        </C.NavItem>
      </C.Sidebar>

      <C.Main>
        <C.Header>
          <C.PageTitle>{titles[activeTab] || 'Admin'}</C.PageTitle>
        </C.Header>
        {renderContent()}
      </C.Main>

      {feedback.show && (
        <C.FeedbackModal
          type={feedback.type}
          message={feedback.message}
          onClose={closeFeedback}
        />
      )}
    </C.DashboardContainer>
  );
}

// Default Login Component
function DefaultLogin({ components: C, onLogin, error, coupleNames, slug }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <C.LoginContainer>
      <C.LoginBox>
        <C.LoginLogo>
          <h1>Admin <span>Panel</span></h1>
          <p>{coupleNames || 'Hochzeit'}</p>
        </C.LoginLogo>
        {error && <C.LoginError>{error}</C.LoginError>}
        <C.LoginForm onSubmit={handleSubmit}>
          <C.FormGroup>
            <C.Label>Passwort</C.Label>
            <C.Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin-Passwort"
              required
            />
          </C.FormGroup>
          <C.LoginButton type="submit">Anmelden</C.LoginButton>
        </C.LoginForm>
        <C.BackLink href={slug ? `/${slug}` : '/'}>
          ← Zurück zur Website
        </C.BackLink>
      </C.LoginBox>
    </C.LoginContainer>
  );
}

// Main Export - Wrapped with Provider
function AdminShell({ components, LoginComponent }) {
  return (
    <AdminProvider>
      <AdminShellInner components={components} LoginComponent={LoginComponent} />
    </AdminProvider>
  );
}

export default AdminShell;
