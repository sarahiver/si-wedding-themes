// App.js - SI Wedding Themes
// All data comes from Supabase based on URL slug

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { WeddingProvider, useWedding } from './context/WeddingContext';

// Lazy load themes for code splitting
const themes = {
  botanical: {
    WeddingPage: lazy(() => import('./themes/botanical/WeddingPage')),
    AdminDashboard: lazy(() => import('./themes/botanical/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/botanical/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/botanical/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/botanical/SaveTheDate')),
  },
  luxe: {
    WeddingPage: lazy(() => import('./themes/luxe/WeddingPage')),
    AdminDashboard: lazy(() => import('./themes/luxe/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/luxe/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/luxe/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/luxe/SaveTheDate')),
  },
  neon: {
    WeddingPage: lazy(() => import('./themes/neon/WeddingPage')),
    AdminDashboard: lazy(() => import('./themes/neon/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/neon/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/neon/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/neon/SaveTheDate')),
  },
  contemporary: {
    WeddingPage: lazy(() => import('./themes/contemporary/WeddingPage')),
    AdminDashboard: lazy(() => import('./themes/contemporary/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/contemporary/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/contemporary/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/contemporary/SaveTheDate')),
  },
  video: {
    WeddingPage: lazy(() => import('./themes/video/WeddingPage')),
    AdminDashboard: lazy(() => import('./themes/video/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/video/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/video/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/video/SaveTheDate')),
  },
  editorial: {
    WeddingPage: lazy(() => import('./themes/editorial/WeddingPage')),
    AdminDashboard: lazy(() => import('./themes/editorial/AdminDashboard')),
    GlobalStyles: lazy(() => import('./themes/editorial/GlobalStyles')),
    ArchivePage: lazy(() => import('./themes/editorial/ArchivePage')),
    SaveTheDate: lazy(() => import('./themes/editorial/SaveTheDate')),
  },
};

// Loading component - invisible (black on black) until theme LoadingScreen takes over
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

// Theme Router - theme comes from Supabase project settings
function ThemeRouter() {
  const { project, isLoading, error, status, theme } = useWedding();
  
  // Get theme from project (loaded from Supabase)
  const themeName = theme || 'botanical';
  const themeComponents = themes[themeName] || themes.botanical;
  
  const { 
    WeddingPage, 
    AdminDashboard, 
    GlobalStyles, 
    ArchivePage, 
    SaveTheDate 
  } = themeComponents;

  if (isLoading) return <Loading />;
  
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Fehler</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Render based on project status
  const renderMain = () => {
    switch (status) {
      case 'std':
      case 'save-the-date':
        return <SaveTheDate />;
      case 'archiv':
      case 'archive':
        return <ArchivePage />;
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

// Project wrapper - loads project by slug from URL
function ProjectWrapper() {
  const { slug } = useParams();
  
  return (
    <WeddingProvider slug={slug}>
      <ThemeRouter />
    </WeddingProvider>
  );
}

// Landing page for root (no slug)
function LandingPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>IverLasting</h1>
        <p style={{ color: '#666' }}>Wedding Websites</p>
      </div>
    </div>
  );
}

// Main App
function App() {
  return (
    <Router>
      <Routes>
        {/* Project routes - /:slug loads from Supabase */}
        <Route path="/:slug/*" element={<ProjectWrapper />} />
        
        {/* Root shows landing page */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
