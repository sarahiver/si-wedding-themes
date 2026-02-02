// App.js - SI Wedding Themes
// Status-based rendering: draft/in_progress → Coming Soon, live/std/archive → Content
// Triple-click on Coming Soon logo shows admin preview login

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { WeddingProvider, useWedding } from './context/WeddingContext';

// Central WeddingPage (handles all themes)
import WeddingPage from './pages/WeddingPage';

// Shared Components
import ComingSoon from './components/shared/ComingSoon';

// Lazy load theme-specific pages
const themePages = {
  botanical: {
    AdminDashboard: lazy(() => import('./themes/botanical/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/botanical/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/botanical/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/botanical/SaveTheDate')),
  },
  luxe: {
    AdminDashboard: lazy(() => import('./themes/luxe/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/luxe/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/luxe/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/luxe/SaveTheDate')),
  },
  neon: {
    AdminDashboard: lazy(() => import('./themes/neon/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/neon/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/neon/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/neon/SaveTheDate')),
  },
  contemporary: {
    AdminDashboard: lazy(() => import('./themes/contemporary/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/contemporary/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/contemporary/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/contemporary/SaveTheDate')),
  },
  video: {
    AdminDashboard: lazy(() => import('./themes/video/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/video/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/video/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/video/SaveTheDate')),
  },
  editorial: {
    AdminDashboard: lazy(() => import('./themes/editorial/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/editorial/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/editorial/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/editorial/SaveTheDate')),
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

// Theme Router - handles status-based rendering
function ThemeRouter() {
  const { project, isLoading, error, status, theme, projectId } = useWedding();
  const [hasPreviewAccess, setHasPreviewAccess] = useState(false);
  
  // Check sessionStorage für Admin-Vorschau
  useEffect(() => {
    if (projectId) {
      const access = sessionStorage.getItem(`admin_preview_${projectId}`);
      setHasPreviewAccess(access === 'true');
    }
  }, [projectId]);
  
  // WICHTIG: Warte bis project UND theme geladen sind
  if (isLoading || !project) return <Loading />;
  
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
  
  const { 
    AdminDashboard, 
    GlobalStyles, 
    ArchivePage, 
    SaveTheDate 
  } = pages;

  // Status-basierte Sichtbarkeit
  // Öffentlich: live, std, archive
  // Nicht-öffentlich: draft, in_progress → Coming Soon (außer mit Admin-Vorschau)
  const publicStatuses = ['live', 'std', 'archive', 'archiv', 'save-the-date'];
  const isPublic = publicStatuses.includes(status);

  // Render basierend auf Status
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

// Project wrapper
function ProjectWrapper() {
  const { slug } = useParams();
  
  return (
    <WeddingProvider slug={slug}>
      <ThemeRouter />
    </WeddingProvider>
  );
}

// Landing page für Root
function LandingPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Roboto, system-ui, sans-serif',
      textAlign: 'center',
      padding: '2rem',
      background: '#0a0a0a',
      color: '#fff'
    }}>
      <div>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          fontWeight: 700,
          letterSpacing: '-2px'
        }}>S&I.</h1>
        <p style={{ color: '#666' }}>Premium Hochzeits-Websites</p>
      </div>
    </div>
  );
}

// Main App
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:slug/*" element={<ProjectWrapper />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
