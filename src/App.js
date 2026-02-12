// App.js - SI Wedding Themes
// Status-based rendering: draft/in_progress → Coming Soon, live/std/archive → Content
// Triple-click on Coming Soon logo shows admin preview login
// NEW: Password protection support

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { WeddingProvider, useWedding } from './context/WeddingContext';
import { checkPasswordRequired } from './lib/supabase';

// Central WeddingPage (handles all themes)
import WeddingPage from './pages/WeddingPage';

// Demo All Page (Component Showcase)
import DemoAllPage from './pages/DemoAllPage';

// Shared Components
import ComingSoon from './components/shared/ComingSoon';
import PasswordGate from './components/shared/PasswordGate';

// GlobalStyles direkt importieren (nicht lazy) - verhindert Flash of unstyled content
import BotanicalGlobalStyles from './themes/botanical/GlobalStyles';
import LuxeGlobalStyles from './themes/luxe/GlobalStyles';
import NeonGlobalStyles from './themes/neon/GlobalStyles';
import ContemporaryGlobalStyles from './themes/contemporary/GlobalStyles';
import VideoGlobalStyles from './themes/video/GlobalStyles';
import EditorialGlobalStyles from './themes/editorial/GlobalStyles';
import ClassicGlobalStyles from './themes/classic/GlobalStyles';

const globalStylesMap = {
  botanical: BotanicalGlobalStyles,
  luxe: LuxeGlobalStyles,
  neon: NeonGlobalStyles,
  contemporary: ContemporaryGlobalStyles,
  video: VideoGlobalStyles,
  editorial: EditorialGlobalStyles,
  classic: ClassicGlobalStyles,
};

// Lazy load theme-specific pages (aber nicht GlobalStyles)
const themePages = {
  botanical: {
    AdminDashboard: lazy(() => import('./themes/botanical/AdminDashboard')),
    ArchivePage: lazy(() => import('./themes/botanical/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/botanical/SaveTheDate')),
  },
  luxe: {
    AdminDashboard: lazy(() => import('./themes/luxe/AdminDashboard')),
    ArchivePage: lazy(() => import('./themes/luxe/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/luxe/SaveTheDate')),
  },
  neon: {
    AdminDashboard: lazy(() => import('./themes/neon/AdminDashboard')),
    ArchivePage: lazy(() => import('./themes/neon/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/neon/SaveTheDate')),
  },
  contemporary: {
    AdminDashboard: lazy(() => import('./themes/contemporary/AdminDashboard')),
    ArchivePage: lazy(() => import('./themes/contemporary/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/contemporary/SaveTheDate')),
  },
  video: {
    AdminDashboard: lazy(() => import('./themes/video/AdminDashboard')),
    ArchivePage: lazy(() => import('./themes/video/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/video/SaveTheDate')),
  },
  editorial: {
    AdminDashboard: lazy(() => import('./themes/editorial/AdminDashboard')),
    ArchivePage: lazy(() => import('./themes/editorial/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/editorial/SaveTheDate')),
  },
  classic: {
    AdminDashboard: lazy(() => import('./themes/classic/AdminDashboard')),
    ArchivePage: lazy(() => import('./themes/classic/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/classic/SaveTheDate')),
  },
};

// Loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh',
    background: '#0a0a0a'
  }}>
    <div style={{ 
      width: 40, 
      height: 40, 
      border: '3px solid #0a0a0a', 
      borderTopColor: '#0a0a0a',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Preview Banner für Admin-Vorschau
function PreviewBanner({ status }) {
  const statusLabels = {
    draft: 'Entwurf',
    in_progress: 'In Bearbeitung',
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#F59E0B',
      color: '#000',
      padding: '0.5rem 1rem',
      fontSize: '0.8rem',
      fontWeight: 600,
      textAlign: 'center',
      zIndex: 9999,
      fontFamily: 'system-ui, sans-serif',
    }}>
      ⚠️ VORSCHAU ({statusLabels[status] || status}) – Nur für dich sichtbar
    </div>
  );
}

// Theme Router - handles status-based rendering AND password protection
function ThemeRouter() {
  const { project, isLoading, error, status, theme, projectId, slug, coupleNames } = useWedding();
  const [hasPreviewAccess, setHasPreviewAccess] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordChecked, setPasswordChecked] = useState(false);
  const [hasPasswordAccess, setHasPasswordAccess] = useState(false);
  
  // Check sessionStorage für Admin-Vorschau
  useEffect(() => {
    if (projectId) {
      const access = sessionStorage.getItem(`admin_preview_${projectId}`);
      setHasPreviewAccess(access === 'true');
    }
  }, [projectId]);
  
  // Check ob Passwortschutz aktiv ist
  useEffect(() => {
    async function checkPassword() {
      if (!slug) return;
      
      // Erst prüfen ob bereits Zugang gewährt wurde (Session)
      const storedAccess = sessionStorage.getItem(`pw_access_${slug}`);
      if (storedAccess === 'granted') {
        setHasPasswordAccess(true);
        setPasswordChecked(true);
        return;
      }
      
      // Passwortschutz-Status von Supabase abrufen
      const { required } = await checkPasswordRequired(slug);
      setPasswordRequired(required);
      setPasswordChecked(true);
    }
    
    checkPassword();
  }, [slug]);
  
  // WICHTIG: Warte bis project UND theme UND password check geladen sind
  if (isLoading || !project || !passwordChecked) return <Loading />;
  
  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#fff'
      }}>
        <div>
          <h1 style={{ marginBottom: '1rem' }}>Projekt nicht gefunden</h1>
          <p style={{ color: '#666' }}>{error}</p>
        </div>
      </div>
    );
  }

  // Theme aus project direkt verwenden (nicht aus hook mit fallback)
  const themeName = project.theme || 'botanical';
  const pages = themePages[themeName] || themePages.botanical;
  const GlobalStyles = globalStylesMap[themeName] || globalStylesMap.botanical;
  
  const { 
    AdminDashboard, 
    ArchivePage, 
    SaveTheDate 
  } = pages;

  // Status-basierte Sichtbarkeit
  // Öffentlich: live, std, archive, demo (für Marketing-Website)
  // Nicht-öffentlich: draft, in_progress → Coming Soon (außer mit Admin-Vorschau)
  const publicStatuses = ['live', 'std', 'archive', 'archiv', 'save-the-date', 'demo'];
  const isPublic = publicStatuses.includes(status);

  // Render basierend auf Status UND Passwortschutz
  const renderMain = () => {
    // Nicht öffentlich und kein Admin-Zugang → Coming Soon
    if (!isPublic && !hasPreviewAccess) {
      return (
        <ComingSoon 
          onAdminAccess={() => {
            setHasPreviewAccess(true);
          }} 
        />
      );
    }
    
    // Passwortschutz: Wenn aktiv und noch kein Zugang
    if (passwordRequired && !hasPasswordAccess && !hasPreviewAccess) {
      return (
        <PasswordGate
          slug={slug}
          theme={themeName}
          coupleNames={coupleNames}
          onSuccess={() => setHasPasswordAccess(true)}
        />
      );
    }
    
    // Render je nach Status
    switch (status) {
      case 'std':
      case 'save-the-date':
        return <SaveTheDate />;
      case 'archiv':
      case 'archive':
        return <ArchivePage />;
      case 'draft':
      case 'in_progress':
        // Admin hat Zugang - zeige Vorschau mit Banner
        if (hasPreviewAccess) {
          return (
            <>
              <PreviewBanner status={status} />
              <div style={{ paddingTop: '36px' }}>
                <WeddingPage />
              </div>
            </>
          );
        }
        return <ComingSoon onAdminAccess={() => setHasPreviewAccess(true)} />;
      case 'live':
      default:
        return <WeddingPage />;
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={renderMain()} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/save-the-date" element={<SaveTheDate />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

// Project wrapper - sets noindex for all customer wedding pages
function ProjectWrapper() {
  const { slug } = useParams();

  // Prevent Google from indexing individual wedding pages
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      // Cleanup on unmount
      if (meta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      }
    };
  }, []);

  return (
    <WeddingProvider slug={slug}>
      <ThemeRouter />
    </WeddingProvider>
  );
}

// Platzhalterseite für siwedding.de Root → Link zu sarahiver.com
function LandingPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'Roboto, system-ui, sans-serif',
      textAlign: 'center',
      padding: '2rem',
      background: '#0a0a0a',
      color: '#fff'
    }}>
      <div>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
          marginBottom: '0.5rem',
          fontWeight: 700,
          letterSpacing: '-0.06em'
        }}>S&I.</h1>
        <p style={{ 
          color: '#666', 
          fontSize: '0.85rem', 
          marginBottom: '2.5rem',
          letterSpacing: '0.05em' 
        }}>Premium Hochzeits-Websites</p>
        <a 
          href="https://sarahiver.com" 
          style={{
            display: 'inline-block',
            padding: '0.9rem 2.5rem',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.target.style.background = '#fff'; e.target.style.color = '#0a0a0a'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; }}
        >
          Mehr erfahren →
        </a>
      </div>
    </div>
  );
}

// Main App
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/demoall" element={<DemoAllPage />} />
        <Route path="/:slug/*" element={<ProjectWrapper />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
