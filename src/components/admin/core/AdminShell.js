// core/AdminShell.js - Main Layout (Logic Only)
import React, { useState, useEffect } from 'react';
import { useAdmin, AdminProvider } from './AdminContext';
import { LANGUAGE_NAMES } from '../../../lib/i18n';
import { AdminMobileStyles, SidebarBackdrop } from './AdminMobile';

// Import Sections
import DashboardSection from './sections/DashboardSection';
import RSVPSection from './sections/RSVPSection';
import GuestbookSection from './sections/GuestbookSection';
import MusicSection from './sections/MusicSection';
import PhotosSection from './sections/PhotosSection';
import GiftsSection from './sections/GiftsSection';
import GuestListSection from './sections/GuestListSection';
import StatusSection from './sections/StatusSection';
import SettingsSection from './sections/SettingsSection';

// Import Editors
import * as Editors from './editors';

// Error Boundary - fängt Crashes in Sections/Editors ab
class AdminErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Admin section crash:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '2rem auto',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Etwas ist schiefgelaufen
          </h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.6, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Dieser Bereich konnte nicht geladen werden. Bitte versuche es erneut.
            Falls der Fehler weiterhin besteht, wende dich an{' '}
            <a href="mailto:wedding@sarahiver.de" style={{ color: '#C41E3A' }}>wedding@sarahiver.de</a>
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '0.6rem 1.5rem',
                background: 'rgba(128,128,128,0.15)',
                border: '1px solid rgba(128,128,128,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: 'inherit',
              }}
            >
              Erneut versuchen
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.onNavigate?.('dashboard');
              }}
              style={{
                padding: '0.6rem 1.5rem',
                background: '#C41E3A',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: '#fff',
              }}
            >
              Zurück zur Übersicht
            </button>
          </div>
          {this.state.error && (
            <details style={{ marginTop: '1.5rem', textAlign: 'left', fontSize: '0.75rem', opacity: 0.4 }}>
              <summary style={{ cursor: 'pointer' }}>Fehlerdetails</summary>
              <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminShellInner({ components: C, LoginComponent }) {
  const admin = useAdmin();
  const {
    isLoggedIn, loginError, login,
    activeTab, setActiveTab,
    sidebarOpen, setSidebarOpen,
    navItems, coupleNames, slug,
    isLoading,
    feedback, closeFeedback,
    contentLanguages, masterLanguage, editLang, setEditLang,
  } = admin;

  // Body einfrieren, solange das Slide-in-Menü auf dem Handy offen ist
  useEffect(() => {
    const isMobile = typeof window !== 'undefined'
      && window.matchMedia('(max-width: 968px)').matches;
    if (sidebarOpen && isMobile) {
      document.body.classList.add('si-admin-menu-open');
    } else {
      document.body.classList.remove('si-admin-menu-open');
    }
    return () => document.body.classList.remove('si-admin-menu-open');
  }, [sidebarOpen]);

  // Tab titles
  const titles = {
    'dashboard': 'Übersicht',
    'rsvp': 'RSVP-Antworten',
    'guestbook': 'Gästebuch',
    'music': 'Musikwünsche',
    'photos': 'Gäste-Fotos',
    'gifts-overview': 'Geschenke-Reservierungen',
    'guest-list': 'Gästeliste & Erinnerungen',
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
    'edit-witnesses': 'Trauzeug:innen',
    'edit-gallery': 'Galerie',
    'edit-guestbook': 'Gästebuch bearbeiten',
    'edit-musicwishes': 'Musikwünsche bearbeiten',
    'edit-photoupload': 'Foto-Upload bearbeiten',
    'edit-faq': 'FAQ',
    'edit-abc': 'Hochzeits-ABC',
    'edit-footer': 'Footer',
    'edit-savethedate': 'Save the Date',
    'edit-archive': 'Archiv-Seite',
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
      case 'gifts-overview': return <GiftsSection components={C} />;
      case 'guest-list': return <GuestListSection components={C} />;
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
      case 'edit-guestbook': return <Editors.GuestbookEditor components={C} />;
      case 'edit-musicwishes': return <Editors.MusicWishesEditor components={C} />;
      case 'edit-photoupload': return <Editors.PhotoUploadEditor components={C} />;
      case 'edit-faq': return <Editors.FAQEditor components={C} />;
      case 'edit-abc': return <Editors.ABCEditor components={C} />;
      case 'edit-footer': return <Editors.FooterEditor components={C} />;
      case 'edit-savethedate': return <Editors.SaveTheDateEditor components={C} />;
      case 'edit-archive': return <Editors.ArchiveEditor components={C} />;
      case 'settings': return <SettingsSection components={C} />;
      case 'status': return <StatusSection components={C} />;
      default: return <C.EmptyState>Bereich nicht gefunden</C.EmptyState>;
    }
  };

  // MAIN DASHBOARD
  return (
    <C.DashboardContainer className="si-admin">
      <AdminMobileStyles />
      <C.MobileMenuToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '✕' : '☰'}
      </C.MobileMenuToggle>

      <SidebarBackdrop $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

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
        {String(activeTab).startsWith('edit-') && contentLanguages.length > 1 && (
          <LanguageBar languages={contentLanguages} master={masterLanguage} current={editLang || masterLanguage} onChange={setEditLang} />
        )}
        <AdminErrorBoundary key={activeTab} onNavigate={setActiveTab}>
          {renderContent()}
        </AdminErrorBoundary>
      </C.Main>

      {feedback.show && (
        <C.FeedbackModal type={feedback.type}>
          {feedback.message}
        </C.FeedbackModal>
      )}
    </C.DashboardContainer>
  );
}

// Sprache, in der die Inhalte bearbeitet werden. Erscheint nur bei mehrsprachigen Projekten.
function LanguageBar({ languages, master, current, onChange }) {
  const ordered = [master, ...languages.filter((l) => l !== master)];
  const translating = current !== master;
  const tab = (on) => ({
    minHeight: '2.75rem', padding: '0 1rem', border: '1px solid var(--admin-border, rgba(0,0,0,0.15))', borderBottom: on ? '2px solid currentColor' : '1px solid var(--admin-border, rgba(0,0,0,0.15))',
    background: on ? 'var(--admin-bg-hover, rgba(0,0,0,0.04))' : 'transparent', color: 'inherit', font: 'inherit', fontSize: '0.9rem', fontWeight: on ? 600 : 400, cursor: 'pointer',
  });
  return (
    <div data-testid="content-language" style={{ margin: '0 0 1.5rem', color: 'var(--admin-text, #1a1a1a)' }}>
      <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--admin-text-secondary, #555)' }}>Inhalte bearbeiten in</div>
      <div role="group" aria-label="Sprache der Inhalte" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {ordered.map((l) => (
          <button key={l} type="button" lang={l} aria-pressed={l === current} onClick={() => onChange(l === master ? null : l)} style={tab(l === current)}>
            {LANGUAGE_NAMES[l] || l}{l === master ? ' (Hauptsprache)' : ''}
          </button>
        ))}
      </div>
      <p role="status" style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--admin-text-secondary, #555)' }}>
        {translating
          ? `Übersetzung ${LANGUAGE_NAMES[current] || current}: Hier ändert ihr nur Texte. Wo noch keine Übersetzung eingetragen ist, steht der Text der Hauptsprache – so erscheint er auch auf der Website. Uhrzeiten, Daten, Bilder und neue Einträge legt ihr in der Hauptsprache an. Speichern nicht vergessen.`
          : 'Hauptsprache: Hier legt ihr Einträge, Uhrzeiten und Bilder an. Die anderen Sprachen übernehmen alles, was nicht übersetzt ist.'}
      </p>
    </div>
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
    <C.LoginContainer className="si-admin">
      <AdminMobileStyles />
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
