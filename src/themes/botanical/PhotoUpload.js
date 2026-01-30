import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg-alt);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 1rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: var(--zen-text-light);
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.1s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const UploadArea = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  border: 1px dashed var(--zen-line);
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.2s, border-color 0.3s ease, background 0.3s ease;
  &.visible { opacity: 1; transform: translateY(0); }
  &:hover { border-color: var(--zen-text); background: var(--zen-bg); }
`;

const UploadIcon = styled.span`
  font-size: 2rem;
  color: var(--zen-text-muted);
  margin-bottom: 1rem;
`;

const UploadText = styled.span`
  font-size: 0.8rem;
  color: var(--zen-text-light);
`;

const HiddenInput = styled.input`
  display: none;
`;

const Preview = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const PreviewImg = styled.div`
  aspect-ratio: 1;
  background-image: url(${p => p.$src});
  background-size: cover;
  background-position: center;
`;

const Submit = styled.button`
  margin-top: 1.5rem;
  padding: 1rem 2rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--zen-bg);
  background: var(--zen-text);
  border: none;
  cursor: pointer;
  &:hover { opacity: 0.8; }
  &:disabled { opacity: 0.4; }
`;

const Success = styled.p`
  font-size: 0.9rem;
  color: var(--zen-text-light);
  margin-top: 2rem;
`;

function PhotoUpload() {
  const { content } = useWedding();
  const data = content?.photoupload || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  
  const title = data.title || 'Fotos hochladen';
  const subtitle = data.subtitle || 'Teilt eure schönsten Momente mit uns.';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      setPreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    // Simulate upload
    await new Promise(r => setTimeout(r, 1500));
    setUploaded(true);
    setUploading(false);
  };

  if (uploaded) {
    return (
      <Section id="photoupload" ref={sectionRef}>
        <Content>
          <Title className="visible">{title}</Title>
          <Success>Danke! {files.length} Foto{files.length > 1 ? 's' : ''} hochgeladen.</Success>
        </Content>
      </Section>
    );
  }

  return (
    <Section id="photoupload" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Subtitle className={visible ? 'visible' : ''}>{subtitle}</Subtitle>
        
        <UploadArea className={visible ? 'visible' : ''}>
          <UploadIcon>↑</UploadIcon>
          <UploadText>Klicken oder Dateien hierher ziehen</UploadText>
          <HiddenInput type="file" multiple accept="image/*" onChange={handleChange} />
        </UploadArea>
        
        {previews.length > 0 && (
          <>
            <Preview>
              {previews.slice(0, 6).map((src, i) => (
                <PreviewImg key={i} $src={src} />
              ))}
            </Preview>
            <Submit onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Hochladen...' : `${files.length} Foto${files.length > 1 ? 's' : ''} hochladen`}
            </Submit>
          </>
        )}
      </Content>
    </Section>
  );
}

export default PhotoUpload;
