// Video Theme - AdminDashboard with SINGLE Background Upload
import React, { useState } from 'react';
import styled from 'styled-components';
import { AdminProvider } from '../../components/admin/core/AdminContext';
import { useWedding } from '../../context/WeddingContext';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { updateProjectContent } from '../../lib/supabase';

// Background Manager Component - SINGLE BACKGROUND
const BackgroundManager = () => {
  const { project, content, refreshContent } = useWedding();
  const [background, setBackground] = useState(content?.video_background || { type: 'video', url: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleTypeChange = (type) => {
    setBackground(prev => ({ ...prev, type }));
  };

  const handleUrlChange = (url) => {
    setBackground(prev => ({ ...prev, url }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      if (result.url) {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setBackground({ type, url: result.url });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!project?.id) return;
    setSaving(true);
    try {
      await updateProjectContent(project.id, {
        ...content,
        video_background: background
      });
      if (refreshContent) await refreshContent();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionTitle>Hintergrund-Video / Bild</SectionTitle>
      <InfoText>
        Lade ein Video oder Bild hoch, das als fixer Hintergrund fuer die gesamte Seite verwendet wird.
        Das Medium wird automatisch in Schwarz-Weiss dargestellt.
        <br /><br />
        <strong>Tipp:</strong> Stockfootage von <a href="https://www.pexels.com/videos/" target="_blank" rel="noopener noreferrer" style={{ color: '#6B8CAE' }}>Pexels</a>, 
        <a href="https://coverr.co/" target="_blank" rel="noopener noreferrer" style={{ color: '#6B8CAE' }}> Coverr</a> oder 
        <a href="https://pixabay.com/videos/" target="_blank" rel="noopener noreferrer" style={{ color: '#6B8CAE' }}> Pixabay</a> funktioniert super!
      </InfoText>
      
      <BackgroundCard>
        <CardHeader>
          <CardTitle>Hintergrund-Medium</CardTitle>
          <TypeToggle>
            <TypeBtn $active={background.type !== 'video'} onClick={() => handleTypeChange('image')}>
              Bild
            </TypeBtn>
            <TypeBtn $active={background.type === 'video'} onClick={() => handleTypeChange('video')}>
              Video
            </TypeBtn>
          </TypeToggle>
        </CardHeader>
        
        <Preview>
          {background.url ? (
            background.type === 'video' ? (
              <video 
                src={background.url} 
                muted 
                loop 
                autoPlay 
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} 
              />
            ) : (
              <img 
                src={background.url} 
                alt="Background Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} 
              />
            )
          ) : (
            <PlaceholderBox>
              <PlaceholderIcon>🎬</PlaceholderIcon>
              <PlaceholderText>Kein Hintergrund ausgewaehlt</PlaceholderText>
            </PlaceholderBox>
          )}
        </Preview>
        
        <UploadArea>
          <input 
            type="file" 
            accept={background.type === 'video' ? 'video/*' : 'image/*'}
            onChange={(e) => handleFileUpload(e.target.files[0])}
            style={{ display: 'none' }}
            id="background-upload"
          />
          <UploadBtn as="label" htmlFor="background-upload">
            {uploading ? 'Wird hochgeladen...' : 'Datei auswaehlen'}
          </UploadBtn>
          
          <Divider>oder</Divider>
          
          <UrlInput 
            type="text" 
            placeholder="Video/Bild URL eingeben..."
            value={background.url}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </UploadArea>
        
        {background.url && (
          <RemoveBtn onClick={() => setBackground({ type: 'video', url: '' })}>
            Hintergrund entfernen
          </RemoveBtn>
        )}
      </BackgroundCard>
      
      <SaveArea>
        <SaveButton onClick={handleSave} disabled={saving}>
          {saving ? 'Speichern...' : 'Aenderungen speichern'}
        </SaveButton>
      </SaveArea>
    </div>
  );
};

// Styled Components
const Wrapper = styled.div`
  background: #1A1A1A;
  min-height: 100vh;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  overflow-y: auto;
`;

const Header = styled.header`
  background: #0A0A0A;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderTitle = styled.h1`
  font-family: 'Manrope', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const CloseBtn = styled.button`
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #888;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255,255,255,0.15);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { color: #FFF; border-color: #6B8CAE; }
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-family: 'Manrope', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #FFF;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 2rem;
  line-height: 1.7;
`;

const BackgroundCard = styled.div`
  background: #252525;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #FFF;
`;

const TypeToggle = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const TypeBtn = styled.button`
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  color: ${p => p.$active ? '#FFF' : '#888'};
  background: ${p => p.$active ? '#6B8CAE' : 'transparent'};
  border: 1px solid ${p => p.$active ? '#6B8CAE' : 'rgba(255,255,255,0.15)'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { border-color: #6B8CAE; }
`;

const Preview = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: #1A1A1A;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
`;

const PlaceholderBox = styled.div`
  text-align: center;
`;

const PlaceholderIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const PlaceholderText = styled.span`
  font-size: 0.8rem;
  color: #555;
`;

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UploadBtn = styled.button`
  padding: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFF;
  background: #6B8CAE;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: background 0.2s ease;
  
  &:hover { background: #8BA5C1; }
`;

const Divider = styled.div`
  text-align: center;
  font-size: 0.75rem;
  color: #555;
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: rgba(255,255,255,0.1);
  }
  
  &::before { left: 0; }
  &::after { right: 0; }
`;

const UrlInput = styled.input`
  padding: 1rem;
  font-size: 0.9rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #FFF;
  
  &:focus { outline: none; border-color: #6B8CAE; }
  &::placeholder { color: #555; }
`;

const RemoveBtn = styled.button`
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #888;
  text-decoration: underline;
  cursor: pointer;
  
  &:hover { color: #FF6B6B; }
`;

const SaveArea = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #FFF;
  background: #6B8CAE;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover { background: #8BA5C1; }
  &:disabled { background: #555; cursor: not-allowed; }
`;

// Main Admin Dashboard
function AdminDashboard({ onClose }) {
  return (
    <Wrapper>
      <Header>
        <HeaderTitle>Video Theme Admin</HeaderTitle>
        <CloseBtn onClick={onClose}>Zurueck zur Seite</CloseBtn>
      </Header>
      <MainContent>
        <AdminProvider>
          <BackgroundManager />
        </AdminProvider>
      </MainContent>
    </Wrapper>
  );
}

export default AdminDashboard;
