// Video Theme - AdminDashboard with ALL Section Background Management
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AdminProvider } from '../../components/admin/core/AdminContext';
import { useWedding } from '../../context/WeddingContext';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { updateProjectContent } from '../../lib/supabase';

// Background Manager Component
const BackgroundManager = () => {
  const { project, content, refreshContent } = useWedding();
  const [backgrounds, setBackgrounds] = useState(content?.section_backgrounds || {});
  const [uploading, setUploading] = useState({});
  const [saving, setSaving] = useState(false);

  // ALL SECTIONS
  const sections = [
    { id: 'hero', label: 'Hero / Start' },
    { id: 'countdown', label: 'Countdown' },
    { id: 'story', label: 'Unsere Geschichte' },
    { id: 'timeline', label: 'Tagesablauf' },
    { id: 'locations', label: 'Location' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'dresscode', label: 'Dresscode' },
    { id: 'gifts', label: 'Geschenke' },
    { id: 'accommodations', label: 'Unterkuenfte' },
    { id: 'directions', label: 'Anfahrt' },
    { id: 'faq', label: 'FAQ' },
    { id: 'abc', label: 'Hochzeits-ABC' },
    { id: 'guestbook', label: 'Gaestebuch' },
    { id: 'music', label: 'Musikwuensche' },
    { id: 'photos', label: 'Foto-Upload' },
    { id: 'witnesses', label: 'Trauzeugen' },
    { id: 'contact', label: 'Kontakt' },
    { id: 'footer', label: 'Footer / Ende' },
  ];

  const handleTypeChange = (sectionId, type) => {
    setBackgrounds(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], type }
    }));
  };

  const handleUrlChange = (sectionId, url) => {
    setBackgrounds(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], url }
    }));
  };

  const handleFileUpload = async (sectionId, file) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [sectionId]: true }));
    try {
      const result = await uploadToCloudinary(file);
      if (result.url) {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setBackgrounds(prev => ({
          ...prev,
          [sectionId]: { type, url: result.url }
        }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleSave = async () => {
    if (!project?.id) return;
    setSaving(true);
    try {
      await updateProjectContent(project.id, {
        ...content,
        section_backgrounds: backgrounds
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
      <SectionTitle>Section Hintergruende</SectionTitle>
      <InfoText>
        Lade fuer jede Section ein Bild oder Video hoch. 
        Alle Medien werden automatisch in S/W dargestellt.
        Tipp: Stockfootage von Pexels, Unsplash oder Coverr funktioniert super!
      </InfoText>
      
      <Grid>
        {sections.map(section => (
          <BackgroundCard key={section.id}>
            <CardHeader>
              <CardTitle>{section.label}</CardTitle>
              <TypeToggle>
                <TypeBtn 
                  $active={backgrounds[section.id]?.type !== 'video'} 
                  onClick={() => handleTypeChange(section.id, 'image')}
                >
                  Bild
                </TypeBtn>
                <TypeBtn 
                  $active={backgrounds[section.id]?.type === 'video'} 
                  onClick={() => handleTypeChange(section.id, 'video')}
                >
                  Video
                </TypeBtn>
              </TypeToggle>
            </CardHeader>
            
            <Preview>
              {backgrounds[section.id]?.url ? (
                backgrounds[section.id]?.type === 'video' ? (
                  <video src={backgrounds[section.id].url} muted loop autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
                ) : (
                  <img src={backgrounds[section.id].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
                )
              ) : (
                <PlaceholderText>Kein Hintergrund</PlaceholderText>
              )}
            </Preview>
            
            <UploadArea>
              <input 
                type="file" 
                accept={backgrounds[section.id]?.type === 'video' ? 'video/*' : 'image/*'}
                onChange={(e) => handleFileUpload(section.id, e.target.files[0])}
                style={{ display: 'none' }}
                id={`upload-${section.id}`}
              />
              <UploadBtn as="label" htmlFor={`upload-${section.id}`}>
                {uploading[section.id] ? 'Uploading...' : 'Datei waehlen'}
              </UploadBtn>
              <UrlInput 
                type="text" 
                placeholder="Oder URL eingeben..."
                value={backgrounds[section.id]?.url || ''}
                onChange={(e) => handleUrlChange(section.id, e.target.value)}
              />
            </UploadArea>
          </BackgroundCard>
        ))}
      </Grid>
      
      <SaveArea>
        <SaveButton onClick={handleSave} disabled={saving}>
          {saving ? 'Speichern...' : 'Alle Aenderungen speichern'}
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
  max-width: 1400px;
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
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const BackgroundCard = styled.div`
  background: #252525;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  color: #FFF;
`;

const TypeToggle = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const TypeBtn = styled.button`
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.35rem 0.75rem;
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
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PlaceholderText = styled.span`
  font-size: 0.7rem;
  color: #555;
`;

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UploadBtn = styled.button`
  padding: 0.6rem 1rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFF;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer;
  text-align: center;
  
  &:hover { background: rgba(255,255,255,0.15); }
`;

const UrlInput = styled.input`
  padding: 0.6rem;
  font-size: 0.8rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #FFF;
  
  &:focus { outline: none; border-color: #6B8CAE; }
  &::placeholder { color: #555; }
`;

const SaveArea = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  padding: 1rem 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #FFF;
  background: #6B8CAE;
  cursor: pointer;
  
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
