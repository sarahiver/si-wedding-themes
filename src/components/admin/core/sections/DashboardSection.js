// core/sections/DashboardSection.js - Pure Logic
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

function DashboardSection({ components: C }) {
  const { stats, rsvpData, cloudinaryConfigured, currentStatus, markAsDataReady, coupleNames } = useAdmin();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleDataReadyClick = () => {
    setShowConfirmDialog(true);
  };
  
  const handleConfirm = async () => {
    setIsSubmitting(true);
    const success = await markAsDataReady();
    setIsSubmitting(false);
    if (success) {
      setSubmitted(true);
      setShowConfirmDialog(false);
    }
  };
  
  const handleCancel = () => {
    setShowConfirmDialog(false);
  };
  
  // Zeige Button nur wenn Status "in_progress" ist
  const showDataReadyButton = currentStatus === 'in_progress' && !submitted;
  // Zeige Success-Message wenn gerade submitted oder Status schon ready_for_review
  const showSuccessMessage = submitted || currentStatus === 'ready_for_review';
  
  return (
    <>
      {/* Data Ready Section - Nur bei in_progress */}
      {showDataReadyButton && (
        <C.AlertBox $type="info" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>📝 Alle Daten eingegeben?</strong>
              <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Wenn ihr fertig seid, klickt hier damit wir eure Seite finalisieren können.
              </span>
            </div>
            <C.ActionButton onClick={handleDataReadyClick} $primary>
              ✓ Alle Daten eingetragen
            </C.ActionButton>
          </div>
        </C.AlertBox>
      )}
      
      {/* Success Message */}
      {showSuccessMessage && (
        <C.AlertBox $type="success" style={{ marginBottom: '1.5rem' }}>
          <strong>🎉 Vielen Dank!</strong><br />
          Wir haben eure Daten erhalten und werden eure Hochzeitsseite jetzt finalisieren. 
          Ihr werdet benachrichtigt, sobald eure Seite live geht!
        </C.AlertBox>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <C.ModalOverlay onClick={handleCancel}>
          <C.ModalContent onClick={e => e.stopPropagation()}>
            <C.ModalHeader>
              <C.ModalTitle>Daten absenden?</C.ModalTitle>
            </C.ModalHeader>
            <C.ModalBody>
              <p style={{ marginBottom: '1rem' }}>
                Habt ihr alle Inhalte für eure Hochzeitsseite eingegeben?
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                Wir werden benachrichtigt und finalisieren eure Seite. 
                Ihr könnt danach noch kleinere Änderungen vornehmen.
              </p>
            </C.ModalBody>
            <C.ModalFooter>
              <C.ActionButton onClick={handleCancel} disabled={isSubmitting}>
                Abbrechen
              </C.ActionButton>
              <C.ActionButton onClick={handleConfirm} $primary disabled={isSubmitting}>
                {isSubmitting ? 'Wird gesendet...' : 'Ja, Daten absenden'}
              </C.ActionButton>
            </C.ModalFooter>
          </C.ModalContent>
        </C.ModalOverlay>
      )}

      <C.StatsGrid>
        <C.StatCard>
          <C.StatNumber>{stats.confirmed}</C.StatNumber>
          <C.StatLabel>Zusagen</C.StatLabel>
        </C.StatCard>
        <C.StatCard>
          <C.StatNumber>{stats.declined}</C.StatNumber>
          <C.StatLabel>Absagen</C.StatLabel>
        </C.StatCard>
        <C.StatCard>
          <C.StatNumber>{stats.totalGuests}</C.StatNumber>
          <C.StatLabel>Gäste</C.StatLabel>
        </C.StatCard>
        <C.StatCard>
          <C.StatNumber>{stats.pendingGuestbook + stats.pendingPhotos}</C.StatNumber>
          <C.StatLabel>Ausstehend</C.StatLabel>
        </C.StatCard>
      </C.StatsGrid>
      
      {!cloudinaryConfigured && (
        <C.AlertBox $type="warning">⚠️ Cloudinary nicht konfiguriert</C.AlertBox>
      )}
      
      <C.Panel>
        <C.PanelHeader>
          <C.PanelTitle>Letzte RSVPs</C.PanelTitle>
        </C.PanelHeader>
        <C.PanelContent>
          {rsvpData.slice(0, 5).map(r => (
            <C.EntryCard key={r.id}>
              <C.EntryHeader>
                <C.EntryName>{r.name}</C.EntryName>
                <C.StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>
                  {r.attending ? 'Zusage' : 'Absage'}
                </C.StatusBadge>
              </C.EntryHeader>
            </C.EntryCard>
          ))}
          {!rsvpData.length && <C.EmptyState>Keine RSVPs</C.EmptyState>}
        </C.PanelContent>
      </C.Panel>
    </>
  );
}

export default DashboardSection;
