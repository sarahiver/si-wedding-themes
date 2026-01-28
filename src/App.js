// src/App.js
// S&I Wedding Multi-Theme App
// Lädt Theme basierend auf project.theme aus Supabase

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { WeddingProvider, DemoProvider, useWedding } from './context/WeddingContext';
import { ThemeRenderer, getGlobalStylesByTheme } from './components/ThemeRenderer';

// Admin Dashboard imports for all themes
import AdminDashboard from './themes/editorial/AdminDashboard';
import ContemporaryAdminDashboard from './themes/contemporary/AdminDashboard';
import BotanicalAdminDashboard from './themes/botanical/AdminDashboard';
import LuxeAdminDashboard from './themes/luxe/AdminDashboard';
import NeonAdminDashboard from './themes/neon/AdminDashboard';

const adminDashboards = {
  editorial: AdminDashboard,
  contemporary: ContemporaryAdminDashboard,
  botanical: BotanicalAdminDashboard,
  luxe: LuxeAdminDashboard,
  neon: NeonAdminDashboard,
};

// ============================================
// REDIRECT TO MARKETING SITE
// ============================================
const RedirectToMarketing = () => {
  useEffect(() => {
    window.location.href = 'https://sarahiver.de';
  }, []);
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAFAFA',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Weiterleitung zu sarahiver.de...</p>
      </div>
    </div>
  );
};

// ============================================
// LOADING SCREEN
// ============================================
const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FAFAFA',
    fontFamily: 'Inter, sans-serif',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '2px solid #E0E0E0',
        borderTopColor: '#000',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem',
      }} />
      <p style={{ color: '#666', fontSize: '0.9rem' }}>Laden...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

// ============================================
// ERROR SCREEN
// ============================================
const ErrorScreen = ({ message }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FAFAFA',
    fontFamily: 'Inter, sans-serif',
  }}>
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ 
        fontFamily: 'Instrument Serif, serif', 
        fontSize: '2rem', 
        marginBottom: '1rem', 
        color: '#000' 
      }}>
        Seite nicht gefunden
      </h1>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>
        {message || 'Das Hochzeitsprojekt konnte nicht gefunden werden.'}
      </p>
      <a href="https://sarahiver.de" style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.75rem',
        fontWeight: '500',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#000',
        textDecoration: 'none',
        borderBottom: '1px solid #000',
        paddingBottom: '0.25rem',
      }}>
        ← Zur Marketing-Seite
      </a>
    </div>
  </div>
);

// ============================================
// CUSTOM DOMAIN DETECTION
// ============================================
function isCustomDomain() {
  const hostname = window.location.hostname;
  const mainDomains = ['localhost', 'vercel.app', 'siwedding.de', 'siweddings.de'];
  return !mainDomains.some(d => hostname.includes(d));
}

function getCustomDomainIdentifier() {
  return window.location.hostname;
}

// ============================================
// WEDDING PAGE
// ============================================
const WeddingPage = () => {
  const { isLoading, error, project } = useWedding();
  
  if (isLoading) return <LoadingScreen />;
  if (error || !project) return <ErrorScreen message={error} />;

  return <ThemeRenderer pageType="wedding" />;
};

// ============================================
// STATUS ROUTER
// ============================================
const StatusRouter = () => {
  const { status, isLoading, error, project } = useWedding();
  
  if (isLoading) return <LoadingScreen />;
  if (error || !project) return <ErrorScreen message={error} />;

  switch (status) {
    case 'std':
      return <ThemeRenderer pageType="savethedate" />;
    case 'archiv':
      return <ThemeRenderer pageType="archive" />;
    default:
      return <ThemeRenderer pageType="wedding" />;
  }
};

// ============================================
// SLUG WRAPPER
// ============================================
const SlugWrapper = ({ children }) => {
  const { slug } = useParams();
  return <WeddingProvider slug={slug}>{children}</WeddingProvider>;
};

// ============================================
// CUSTOM DOMAIN WRAPPER
// ============================================
const CustomDomainWrapper = ({ children }) => {
  const domain = getCustomDomainIdentifier();
  return <WeddingProvider slug={domain}>{children}</WeddingProvider>;
};

// ============================================
// DEMO PAGE (für iframe-Einbettung in Marketing-Site)
// ============================================
// URLs: /demo?theme=contemporary
//       /demo?theme=contemporary&page=std
//       /demo?theme=contemporary&page=archive
//       /demo?theme=contemporary&page=admin
const DemoPage = () => {
  const params = new URLSearchParams(window.location.search);
  const theme = params.get('theme') || 'editorial';
  const page = params.get('page') || 'wedding';
  const GlobalStyles = getGlobalStylesByTheme(theme);
  
  // Admin page
  if (page === 'admin') {
    const AdminDashboardComponent = adminDashboards[theme] || adminDashboards.editorial;
    return (
      <DemoProvider theme={theme}>
        <GlobalStyles />
        <AdminDashboardComponent />
      </DemoProvider>
    );
  }
  
  // Map page param to pageType
  const pageTypeMap = {
    'wedding': 'wedding',
    'std': 'savethedate',
    'archive': 'archive',
  };
  const pageType = pageTypeMap[page] || 'wedding';
  
  return (
    <DemoProvider theme={theme}>
      <GlobalStyles />
      <ThemeRenderer pageType={pageType} />
    </DemoProvider>
  );
};

// ============================================
// MAIN APP
// ============================================
function App() {
  const customDomain = isCustomDomain();

  // Custom Domain Routing
  if (customDomain) {
    return (
      <Router>
        <CustomDomainWrapper>
          <Routes>
            <Route path="/" element={<StatusRouter />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/std" element={<ThemeRenderer pageType="savethedate" />} />
            <Route path="/archiv" element={<ThemeRenderer pageType="archive" />} />
            <Route path="/preview" element={<WeddingPage />} />
            <Route path="*" element={<ErrorScreen message="Seite nicht gefunden" />} />
          </Routes>
        </CustomDomainWrapper>
      </Router>
    );
  }

  // Standard Routing (siwedding.de)
  return (
    <Router>
      <Routes>
        {/* Root → Redirect zu Marketing-Site */}
        <Route path="/" element={<RedirectToMarketing />} />
        
        {/* Demo Route - alle Pages über Query-Parameter */}
        {/* /demo?theme=contemporary */}
        {/* /demo?theme=contemporary&page=std */}
        {/* /demo?theme=contemporary&page=archive */}
        {/* /demo?theme=contemporary&page=admin */}
        <Route path="/demo" element={<DemoPage />} />
        
        {/* Slug-based Routes */}
        <Route path="/:slug" element={<SlugWrapper><StatusRouter /></SlugWrapper>} />
        <Route path="/:slug/admin" element={<SlugWrapper><AdminDashboard /></SlugWrapper>} />
        <Route path="/:slug/std" element={<SlugWrapper><ThemeRenderer pageType="savethedate" /></SlugWrapper>} />
        <Route path="/:slug/archiv" element={<SlugWrapper><ThemeRenderer pageType="archive" /></SlugWrapper>} />
        <Route path="/:slug/preview" element={<SlugWrapper><WeddingPage /></SlugWrapper>} />
        
        {/* Fallback */}
        <Route path="*" element={<ErrorScreen message="Seite nicht gefunden" />} />
      </Routes>
    </Router>
  );
}

export default App;
