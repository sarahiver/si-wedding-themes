// App.js - SI Wedding Themes
// Dynamic theme loading based on project settings from Supabase

import React, { Suspense, lazy, useEffect, useState } from 'react';
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

// Loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        width: 40, 
        height: 40, 
        border: '3px solid #eee', 
        borderTopColor: '#333',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }} />
      <p>Laden...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

// Theme Router - renders the correct theme based on project settings
function ThemeRouter() {
  const { project, loading, error, status } = useWedding();
  const [isArchived, setIsArchived] = useState(false);
  
  // Get theme from project or default to botanical
  const themeName = project?.settings?.theme || 'botanical';
  const theme = themes[themeName] || themes.botanical;
  
  const { 
    WeddingPage, 
    AdminDashboard, 
    GlobalStyles, 
    ArchivePage, 
    SaveTheDate 
  } = theme;

  // Check if archived
  useEffect(() => {
    if (status === 'archiv') {
      setIsArchived(true);
    }
  }, [status]);

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Fehler</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <GlobalStyles />
      <Routes>
        <Route 
          path="/" 
          element={isArchived ? <Navigate to="/archive" replace /> : <WeddingPage />} 
        />
        <Route path="/save-the-date" element={<SaveTheDate />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/admin" element={<AdminDashboard onArchiveToggle={setIsArchived} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

// Project wrapper - loads project by slug from URL
function ProjectWrapper() {
  const { slug } = useParams();
  
  return (
    <WeddingProvider projectSlug={slug}>
      <ThemeRouter />
    </WeddingProvider>
  );
}

// Demo mode with static config
const demoConfig = {
  coupleName: "Olivia & Benjamin",
  weddingDate: "2025-06-21",
  theme: "botanical"
};

function DemoWrapper() {
  return (
    <WeddingProvider initialConfig={demoConfig}>
      <ThemeRouter />
    </WeddingProvider>
  );
}

// Main App
function App() {
  return (
    <Router>
      <Routes>
        {/* Demo route */}
        <Route path="/demo/*" element={<DemoWrapper />} />
        
        {/* Project routes - /:slug loads from Supabase */}
        <Route path="/:slug/*" element={<ProjectWrapper />} />
        
        {/* Root redirects to demo */}
        <Route path="/" element={<Navigate to="/demo" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
