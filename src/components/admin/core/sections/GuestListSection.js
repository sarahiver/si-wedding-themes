// core/sections/GuestListSection.js
// Gästeliste verwalten: Import (CSV, Excel), Abgleich mit den Antworten über E-Mail und Namen, Erinnerungen senden
import React, { useState, useMemo, useCallback } from 'react';
import { useAdmin } from '../AdminContext';
import { uploadGuestList, deleteGuestListEntry, clearGuestList, markReminderSent, authFetch } from '../../../../lib/supabase';
import { parseCsv, parseXlsx } from '../../../../lib/guestImport';
import { matchGuestList, hasRealEmail, placeholderEmail, VIA_LABEL } from '../../../../lib/guestMatch';
import { downloadXlsx, today } from '../../../../lib/xlsxExport';

function GuestListSection({ components: C }) {
  const { guestList = [], rsvpData = [], projectId, project, loadData, showFeedback, searchTerm, setSearchTerm, hasArchive, checkActive } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingThank, setSendingThank] = useState(false);
  const [sendingPhoto, setSendingPhoto] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [sendProgress, setSendProgress] = useState({ sent: 0, total: 0 });
  const [emailPreview, setEmailPreview] = useState(null); // { type, recipients, subject, body, onConfirm }

  const [statusFilter, setStatusFilter] = useState('all');
  const [newGuest, setNewGuest] = useState(null); // { name, email, group_name }

  // Abgleich mit den Antworten: erst über die E-Mail-Adresse, dann über die Namen (auch Begleitpersonen)
  const matched = useMemo(() => matchGuestList(guestList || [], rsvpData || []), [guestList, rsvpData]);
  const enrichedGuests = matched.guests;
  // Zusagen, zu denen es keinen Eintrag auf der Gästeliste gibt
  const unlisted = useMemo(() => matched.unlisted.filter(p => p.attending), [matched]);

  // Stats
  const stats = useMemo(() => {
    const total = enrichedGuests.length;
    const confirmed = enrichedGuests.filter(g => g.status === 'confirmed').length;
    const declined = enrichedGuests.filter(g => g.status === 'declined').length;
    const pending = enrichedGuests.filter(g => g.status === 'pending').length;
    const reminderSent = enrichedGuests.filter(g => g.reminder_sent_at).length;
    const noEmail = enrichedGuests.filter(g => !hasRealEmail(g.email)).length;
    const toCheck = enrichedGuests.filter(g => g.via === 'name-likely').length;
    return { total, confirmed, declined, pending, reminderSent, noEmail, toCheck };
  }, [enrichedGuests]);

  // Filter
  const filteredGuests = useMemo(() => {
    return enrichedGuests.filter(g => {
      if (statusFilter === 'check' ? g.via !== 'name-likely' : (statusFilter !== 'all' && g.status !== statusFilter)) return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (g.name || '').toLowerCase().includes(term) ||
        (hasRealEmail(g.email) && g.email.toLowerCase().includes(term)) ||
        (g.group_name || '').toLowerCase().includes(term);
    });
  }, [enrichedGuests, searchTerm, statusFilter]);

  // Pending guests (for reminder)
  // Erinnert werden kann nur, wer eine E-Mail-Adresse hat
  const pendingGuests = useMemo(() => enrichedGuests.filter(g => g.status === 'pending' && hasRealEmail(g.email)), [enrichedGuests]);

  // Confirmed guests (for post-wedding thank you & photo reminder)
  const confirmedGuests = useMemo(() => enrichedGuests.filter(g => g.status === 'confirmed' && hasRealEmail(g.email)), [enrichedGuests]);

  // Has photo upload feature?
  const hasPhotoUpload = checkActive?.('photoupload');

  // Email preview templates
  const coupleNames = project?.couple_names || 'Brautpaar';
  const weddingDate = project?.wedding_date
    ? new Date(project.wedding_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const EMAIL_TEMPLATES = {
    rsvp_reminder: {
      icon: '📧',
      label: 'RSVP-Erinnerung',
      subject: `💌 ${coupleNames} – Bitte gebt eure Rückmeldung`,
      body: `Liebe/r [Name],\n\nwir freuen uns riesig auf unsere Hochzeit${weddingDate ? ` am ${weddingDate}` : ''} und würden euch so gerne dabei haben! Wir haben gesehen, dass ihr noch nicht zugesagt habt – könntet ihr uns eine kurze Rückmeldung geben?`,
    },
    thank_you: {
      icon: '💌',
      label: 'Danke-Mail',
      subject: `💛 ${coupleNames} – Danke, von ganzem Herzen`,
      body: `Liebe/r [Name],\n\nwir sitzen hier, blättern durch die Erinnerungen – und müssen einfach lächeln. Unser Hochzeitstag${weddingDate ? ` am ${weddingDate}` : ''} war der schönste Tag unseres Lebens. Und das wäre er ohne euch nicht gewesen.\n\nDanke, dass ihr dabei wart. Danke für eure Umarmungen, euer Lachen, eure Tränen, eure Tanzeinlagen und die Momente, die wir nie vergessen werden. Ihr habt diesen Tag zu dem gemacht, was er war: pures Glück.\n\nWir tragen diesen Tag für immer in unserem Herzen – und euch gleich mit. 💛\n\nIn Liebe,\n${coupleNames}`,
    },
    photo_reminder: {
      icon: '📸',
      label: 'Foto-Erinnerung',
      subject: `📸 ${coupleNames} – Habt ihr noch Fotos von unserem Tag?`,
      body: `Liebe/r [Name],\n\nwisst ihr, was das Schönste an unserer Hochzeit ist? Dass jeder von euch den Tag aus seiner ganz eigenen Perspektive erlebt hat. Und bestimmt habt ihr dabei Momente eingefangen, die wir selbst gar nicht mitbekommen haben.\n\nWir würden diese Bilder so gerne sehen! Ob verwackeltes Selfie, heimlicher Schnappschuss oder das perfekte Foto vom Sonnenuntergang – für uns ist jedes einzelne Bild ein kleiner Schatz.\n\nLadet eure Fotos einfach direkt auf unserer Website hoch – das dauert nur einen Moment.\n\nDanke, ihr Lieben!\n${coupleNames}`,
    },
  };

  // Show email preview before sending
  const showEmailPreview = (type, recipients, sendFn) => {
    const tpl = EMAIL_TEMPLATES[type];
    setEmailPreview({
      type, recipients, label: tpl.label, icon: tpl.icon,
      subject: tpl.subject,
      body: tpl.body,
      sendFn,
    });
  };

  // Update preview field
  const updatePreview = (field, value) => {
    setEmailPreview(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Send "Thank You" email to all confirmed guests
  const handleSendThankYou = useCallback(() => {
    if (confirmedGuests.length === 0) return;
    showEmailPreview('thank_you', confirmedGuests, async (customSubject, customBody) => {
      setEmailPreview(null);
      setSendingThank(true);
      try {
        const response = await authFetch('/api/reminder', {
          method: 'POST',
          body: JSON.stringify({
            projectId,
            guests: confirmedGuests.map(g => ({ id: g.id, name: g.name, email: g.email })),
            type: 'thank_you',
            customSubject,
            customBody,
          }),
        });
        const result = await response.json();
        if (result.success) {
          showFeedback('success', `💌 ${result.sent} Danke-Mails versendet!`);
          await loadData();
        } else {
          showFeedback('error', 'Fehler: ' + (result.error || 'Unbekannter Fehler'));
        }
      } catch (err) {
        showFeedback('error', 'Netzwerkfehler: ' + err.message);
      }
      setSendingThank(false);
    });
  }, [projectId, confirmedGuests, showFeedback, loadData]);

  // Send "Photo Reminder" email to all confirmed guests
  const handleSendPhotoReminder = useCallback(() => {
    if (confirmedGuests.length === 0) return;
    showEmailPreview('photo_reminder', confirmedGuests, async (customSubject, customBody) => {
      setEmailPreview(null);
      setSendingPhoto(true);
      try {
        const response = await authFetch('/api/reminder', {
          method: 'POST',
          body: JSON.stringify({
            projectId,
            guests: confirmedGuests.map(g => ({ id: g.id, name: g.name, email: g.email })),
            type: 'photo_reminder',
            customSubject,
            customBody,
          }),
        });
        const result = await response.json();
        if (result.success) {
          showFeedback('success', `📸 ${result.sent} Foto-Erinnerungen versendet!`);
          await loadData();
        } else {
          showFeedback('error', 'Fehler: ' + (result.error || 'Unbekannter Fehler'));
        }
      } catch (err) {
        showFeedback('error', 'Netzwerkfehler: ' + err.message);
      }
      setSendingPhoto(false);
    });
  }, [projectId, confirmedGuests, showFeedback, loadData]);

  // CSV Upload Handler
  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const isXlsx = file.name.match(/\.xlsx?$/i);
      const parsed = isXlsx ? await parseXlsx(await file.arrayBuffer()) : parseCsv(await file.text());

      if (parsed === null) {
        showFeedback('error', 'Ungültiges Format. Die Datei braucht eine Kopfzeile mit der Spalte "Name" (oder "Vorname" und "Nachname").');
        setUploading(false);
        return;
      }
      const { guests, withoutEmail } = parsed;

      if (guests.length === 0) {
        showFeedback('error', 'Keine Einträge gefunden. Prüfe, ob unter der Kopfzeile Namen stehen.');
        setUploading(false);
        return;
      }

      const { error, count } = await uploadGuestList(projectId, guests);
      if (error) {
        showFeedback('error', 'Fehler beim Upload: ' + error.message);
      } else {
        showFeedback('success', `${count} Gäste importiert${withoutEmail ? `, davon ${withoutEmail} ohne E-Mail (Abgleich über den Namen)` : ''}.`);
        setShowUpload(false);
        await loadData();
      }
    } catch (err) {
      showFeedback('error', 'Fehler beim Lesen der Datei: ' + err.message);
    }
    setUploading(false);
    // Reset file input
    e.target.value = '';
  }, [projectId, showFeedback, loadData]);

  // Send reminders to all pending guests
  const handleSendReminders = useCallback(() => {
    if (pendingGuests.length === 0) return;
    showEmailPreview('rsvp_reminder', pendingGuests, async (customSubject, customBody) => {
      setEmailPreview(null);
      setSending(true);
      setSendProgress({ sent: 0, total: pendingGuests.length });

      try {
        const response = await authFetch('/api/reminder', {
          method: 'POST',
          body: JSON.stringify({
            projectId,
            guests: pendingGuests.map(g => ({ id: g.id, name: g.name, email: g.email })),
            customSubject,
            customBody,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSendProgress({ sent: result.sent, total: pendingGuests.length });
          showFeedback('success', `${result.sent} Erinnerungen versendet!`);

          for (const g of pendingGuests) {
            await markReminderSent(g.id);
          }
          await loadData();
        } else {
          showFeedback('error', 'Fehler beim Versenden: ' + (result.error || 'Unbekannter Fehler'));
        }
    } catch (err) {
      showFeedback('error', 'Netzwerkfehler: ' + err.message);
    }

    setSending(false);
    });
  }, [projectId, pendingGuests, showFeedback, loadData]);

  // Einzelnen Gast von Hand hinzufügen (E-Mail freiwillig)
  const handleAddGuest = useCallback(async () => {
    const name = (newGuest?.name || '').replace(/\s+/g, ' ').trim();
    const mail = (newGuest?.email || '').trim().toLowerCase();
    if (!name) { showFeedback('error', 'Bitte einen Namen eintragen.'); return; }
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { showFeedback('error', 'Die E-Mail-Adresse ist nicht gültig. Das Feld darf auch leer bleiben.'); return; }
    // Gleichnamige Gäste ohne E-Mail bekommen eine laufende Nummer, damit keiner den anderen überschreibt
    let email = mail;
    if (!email) { let n = 1; const taken = new Set((guestList || []).map(g => g.email)); while (taken.has(placeholderEmail(name, n))) n++; email = placeholderEmail(name, n); }
    else if ((guestList || []).some(g => g.email === email)) { showFeedback('error', 'Diese E-Mail-Adresse steht schon auf der Liste.'); return; }
    const { error } = await uploadGuestList(projectId, [{ name, email, group_name: (newGuest?.group_name || '').trim() }]);
    if (error) { showFeedback('error', 'Fehler beim Speichern: ' + error.message); return; }
    showFeedback('success', 'Gast hinzugefügt');
    setNewGuest(null);
    await loadData();
  }, [newGuest, guestList, projectId, showFeedback, loadData]);

  // Abgleich als Excel-Datei: Gästeliste mit Status, dazu die Zusagen ohne Eintrag auf der Liste
  const handleExport = useCallback(async () => {
    try {
      const label = { confirmed: 'Zugesagt', declined: 'Abgesagt', pending: 'Offen' };
      const rows = [['Name', 'E-Mail', 'Gruppe', 'Status', 'Erkannt', 'Antwort von', 'Möglicher Treffer', 'Erinnerung gesendet']];
      enrichedGuests.forEach(g => rows.push([
        g.name, hasRealEmail(g.email) ? g.email : '', g.group_name || '', label[g.status], VIA_LABEL[g.via] || '',
        g.match ? (g.match.name === g.match.rsvpName ? g.match.name : `${g.match.name} (Antwort von ${g.match.rsvpName})`) : '',
        g.hint ? g.hint.join(', ') : '', g.reminder_sent_at ? new Date(g.reminder_sent_at) : '',
      ]));
      const extra = [['Person', 'Antwort von']];
      unlisted.forEach(p => extra.push([p.name, p.rsvpName]));
      await downloadXlsx(`Gaesteliste_Abgleich_${today()}.xlsx`, [{ name: 'Gästeliste', rows }, { name: 'Zusagen ohne Eintrag', rows: extra }]);
      showFeedback('success', 'Export erstellt');
    } catch (e) {
      showFeedback('error', 'Export fehlgeschlagen');
    }
  }, [enrichedGuests, unlisted, showFeedback]);

  // Delete single guest
  const handleDelete = useCallback(async (id) => {
    await deleteGuestListEntry(id);
    showFeedback('success', 'Gast entfernt');
    await loadData();
  }, [showFeedback, loadData]);

  // Clear all
  const handleClearAll = useCallback(async () => {
    await clearGuestList(projectId);
    setShowConfirmClear(false);
    showFeedback('success', 'Gästeliste geleert');
    await loadData();
  }, [projectId, showFeedback, loadData]);

  const statusLabel = (s) => ({ confirmed: '✅ Zugesagt', declined: '❌ Abgesagt', pending: '⏳ Offen' }[s] || s);
  const statusColor = (s) => ({ confirmed: '#22c55e', declined: '#ef4444', pending: '#f59e0b' }[s] || '#888');

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '–';

  return (
    <>
      {/* Stats */}
      <C.StatsGrid>
        <C.StatCard>
          <C.StatNumber>{stats.total}</C.StatNumber>
          <C.StatLabel>Eingeladen</C.StatLabel>
        </C.StatCard>
        <C.StatCard>
          <C.StatNumber style={{ color: '#22c55e' }}>{stats.confirmed}</C.StatNumber>
          <C.StatLabel>Zugesagt</C.StatLabel>
        </C.StatCard>
        <C.StatCard>
          <C.StatNumber style={{ color: '#ef4444' }}>{stats.declined}</C.StatNumber>
          <C.StatLabel>Abgesagt</C.StatLabel>
        </C.StatCard>
        <C.StatCard>
          <C.StatNumber style={{ color: '#f59e0b' }}>{stats.pending}</C.StatNumber>
          <C.StatLabel>Offen</C.StatLabel>
        </C.StatCard>
      </C.StatsGrid>

      {/* Actions Bar */}
      <C.ActionBar>
        <C.SearchInput
          placeholder="Name, E-Mail oder Gruppe suchen..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <C.ActionButton onClick={() => setShowUpload(!showUpload)}>
            📤 Importieren
          </C.ActionButton>
          <C.ActionButton onClick={() => setNewGuest(newGuest ? null : { name: '', email: '', group_name: '' })}>
            + Gast hinzufügen
          </C.ActionButton>
          {stats.total > 0 && (
            <C.ActionButton onClick={handleExport}>📥 Abgleich als Excel</C.ActionButton>
          )}
          {pendingGuests.length > 0 && (
            <C.ActionButton
              $primary
              onClick={handleSendReminders}
              disabled={sending}
            >
              {sending ? `⏳ Sende... (${sendProgress.sent}/${sendProgress.total})` : `📧 Erinnerung senden (${pendingGuests.length})`}
            </C.ActionButton>
          )}
          {stats.total > 0 && (
            <C.ActionButton $danger onClick={() => setShowConfirmClear(true)}>
              🗑️ Alle löschen
            </C.ActionButton>
          )}
        </div>
      </C.ActionBar>

      {/* Einzelnen Gast hinzufügen */}
      {newGuest && (
        <C.Card style={{ marginBottom: '1rem', padding: '1.25rem' }} data-testid="guest-add">
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Gast hinzufügen</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <C.SearchInput aria-label="Name" placeholder="Name" value={newGuest.name} onChange={e => setNewGuest({ ...newGuest, name: e.target.value })} />
            <C.SearchInput aria-label="E-Mail (freiwillig)" placeholder="E-Mail (freiwillig)" value={newGuest.email} onChange={e => setNewGuest({ ...newGuest, email: e.target.value })} />
            <C.SearchInput aria-label="Gruppe (freiwillig)" placeholder="Gruppe (freiwillig)" value={newGuest.group_name} onChange={e => setNewGuest({ ...newGuest, group_name: e.target.value })} />
            <C.ActionButton $primary onClick={handleAddGuest}>Speichern</C.ActionButton>
            <C.ActionButton onClick={() => setNewGuest(null)}>Abbrechen</C.ActionButton>
          </div>
        </C.Card>
      )}

      {/* Hinweise zum Abgleich */}
      {stats.total > 0 && (
        <div data-testid="guest-match-info" style={{ marginBottom: '1rem', fontSize: '0.82rem', lineHeight: 1.6, opacity: 0.75 }}>
          Der Status ergibt sich aus den Antworten: zuerst über die E-Mail-Adresse, sonst über den Namen – auch der Name einer Begleitperson zählt.
          {stats.noEmail > 0 && <> {stats.noEmail} {stats.noEmail === 1 ? 'Gast hat' : 'Gäste haben'} keine E-Mail-Adresse und {stats.noEmail === 1 ? 'kann' : 'können'} nicht per Mail erinnert werden.</>}
          {stats.toCheck > 0 && <> {stats.toCheck} {stats.toCheck === 1 ? 'Zuordnung ist' : 'Zuordnungen sind'} nicht ganz eindeutig und mit „bitte prüfen“ markiert.</>}
        </div>
      )}

      {/* Filter nach Status */}
      {stats.total > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }} role="group" aria-label="Nach Status filtern">
          {[['all', `Alle (${stats.total})`], ['pending', `Offen (${stats.pending})`], ['confirmed', `Zugesagt (${stats.confirmed})`], ['declined', `Abgesagt (${stats.declined})`], ...(stats.toCheck > 0 ? [['check', `Bitte prüfen (${stats.toCheck})`]] : [])].map(([key, label]) => (
            <C.ActionButton key={key} $primary={statusFilter === key} aria-pressed={statusFilter === key} onClick={() => setStatusFilter(key)}>{label}</C.ActionButton>
          ))}
        </div>
      )}

      {/* Post-Wedding Emails */}
      {confirmedGuests.length > 0 && (
        <C.Card style={{ marginBottom: '1rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(201,169,98,0.08), rgba(201,169,98,0.02))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>💌</span>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>Nach der Hochzeit</h3>
          </div>
          <p style={{ fontSize: '0.82rem', opacity: 0.6, lineHeight: 1.6, marginBottom: '1rem' }}>
            Verschickt persönliche Nachrichten an alle Gäste, die zugesagt haben und eine E-Mail-Adresse haben ({confirmedGuests.length} Gäste). Perfekt für die Tage und Wochen nach eurer Feier.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <C.ActionButton
              onClick={handleSendThankYou}
              disabled={sendingThank}
              style={{ background: 'rgba(201,169,98,0.15)', border: '1px solid rgba(201,169,98,0.3)' }}
            >
              {sendingThank ? '⏳ Wird gesendet...' : `💛 Danke sagen (${confirmedGuests.length})`}
            </C.ActionButton>
            {hasArchive && hasPhotoUpload && (
              <C.ActionButton
                onClick={handleSendPhotoReminder}
                disabled={sendingPhoto}
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}
              >
                {sendingPhoto ? '⏳ Wird gesendet...' : `📸 Foto-Erinnerung (${confirmedGuests.length})`}
              </C.ActionButton>
            )}
          </div>
        </C.Card>
      )}

      {/* Email Preview Modal — editable */}
      {emailPreview && (
        <C.Card style={{ marginBottom: '1rem', padding: '1.5rem', border: '2px solid rgba(201,169,98,0.4)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>{emailPreview.icon}</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Vorschau: {emailPreview.label}</h3>
            </div>
            <button onClick={() => setEmailPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.5 }}>✕</button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.4rem' }}>Betreff</p>
            <input
              type="text"
              value={emailPreview.subject}
              onChange={e => updatePreview('subject', e.target.value)}
              style={{ width: '100%', padding: '0.7rem 0.85rem', fontSize: '0.9rem', fontWeight: 600, border: '1px solid rgba(128,128,128,0.2)', borderRadius: '6px', background: 'rgba(128,128,128,0.05)', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.4rem' }}>Inhalt der E-Mail</p>
            <textarea
              value={emailPreview.body}
              onChange={e => updatePreview('body', e.target.value)}
              rows={10}
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.85rem', lineHeight: 1.8, border: '1px solid rgba(128,128,128,0.2)', borderRadius: '6px', background: 'rgba(128,128,128,0.05)', fontFamily: 'inherit', resize: 'vertical', minHeight: '180px' }}
            />
          </div>

          <div style={{ background: 'rgba(128,128,128,0.05)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.78rem', opacity: 0.6 }}>
            <strong>Empfänger:</strong> {emailPreview.recipients.length} {emailPreview.recipients.length === 1 ? 'Gast' : 'Gäste'}
            {emailPreview.recipients.length <= 5
              ? ` — ${emailPreview.recipients.map(g => g.name).join(', ')}`
              : ` — ${emailPreview.recipients.slice(0, 3).map(g => g.name).join(', ')} und ${emailPreview.recipients.length - 3} weitere`
            }
          </div>

          <p style={{ fontSize: '0.75rem', opacity: 0.45, marginBottom: '1.25rem', lineHeight: 1.5 }}>
            ℹ️ Die Mail wird im Design eures Themes versendet. Logo, Button zur Website und Footer werden automatisch hinzugefügt. [Name] wird durch den Namen jedes Gastes ersetzt.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <C.ActionButton $primary onClick={() => emailPreview.sendFn(emailPreview.subject, emailPreview.body)}>
              ✉️ Jetzt {emailPreview.recipients.length} {emailPreview.recipients.length === 1 ? 'Mail' : 'Mails'} versenden
            </C.ActionButton>
            <C.ActionButton onClick={() => setEmailPreview(null)}>Abbrechen</C.ActionButton>
          </div>
        </C.Card>
      )}

      {/* Confirm Clear */}
      {showConfirmClear && (
        <C.Card style={{ marginBottom: '1rem', padding: '1rem', border: '2px solid #ef4444' }}>
          <p style={{ marginBottom: '0.75rem' }}>⚠️ Alle {stats.total} Gäste aus der Liste entfernen? RSVP-Antworten bleiben erhalten.</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <C.ActionButton $danger onClick={handleClearAll}>Ja, alle löschen</C.ActionButton>
            <C.ActionButton onClick={() => setShowConfirmClear(false)}>Abbrechen</C.ActionButton>
          </div>
        </C.Card>
      )}

      {/* Upload Section */}
      {showUpload && (
        <C.Card style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>📤 Gästeliste importieren</h3>
          <p style={{ marginBottom: '1rem', fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.6 }}>
            Lade eine CSV- oder Excel-Datei (.xlsx) hoch. Die Datei braucht eine Kopfzeile und die Spalte <strong>Name</strong> (oder <strong>Vorname</strong> und <strong>Nachname</strong>).<br />
            Freiwillig: <strong>Email</strong> und <strong>Gruppe</strong>. Gäste ohne E-Mail-Adresse werden über den Namen mit den Antworten abgeglichen.
          </p>
          <div style={{ background: 'rgba(128,128,128,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.8 }}>
            <strong>Beispiel:</strong><br />
            Name;Email;Gruppe<br />
            Anna Müller;anna@example.de;Familie<br />
            Max Schmidt;;Freunde<br />
            Lisa Weber;lisa@example.de;Kollegen
          </div>
          <p style={{ marginBottom: '1rem', fontSize: '0.8rem', opacity: 0.5 }}>
            Unterstützt: .csv (Komma oder Semikolon getrennt) und .xlsx (Excel). Gleiche E-Mail-Adressen werden nur einmal übernommen. Ein erneuter Import ergänzt die Liste und überschreibt nichts doppelt.
          </p>
          <input
            type="file"
            accept=".csv,.txt,.xlsx,.xls"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ fontSize: '0.9rem' }}
          />
          {uploading && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>⏳ Importiere...</p>}
        </C.Card>
      )}

      {/* Empty State with visual guide */}
      {stats.total === 0 && !showUpload && (
        <C.Card style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📋</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Gästeliste & RSVP-Erinnerungen</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
              Ladet eure Gästeliste hoch und seht, wer schon geantwortet hat und wer noch fehlt – auch ohne E-Mail-Adressen, über die Namen. Gäste mit E-Mail-Adresse könnt ihr erinnern.
            </p>
          </div>

          {/* How it works - visual steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Step 1 */}
            <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(128,128,128,0.05)', borderRadius: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 700, fontSize: '0.9rem' }}>1</div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📄</div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Datei erstellen</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.5, lineHeight: 1.5 }}>Excel öffnen, Spalte "Name" anlegen, "Email" wenn vorhanden. Als .xlsx oder .csv speichern</p>
            </div>
            {/* Step 2 */}
            <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(128,128,128,0.05)', borderRadius: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 700, fontSize: '0.9rem' }}>2</div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📤</div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Hochladen</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.5, lineHeight: 1.5 }}>CSV oder Excel hier importieren – Duplikate werden automatisch erkannt</p>
            </div>
            {/* Step 3 */}
            <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(128,128,128,0.05)', borderRadius: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 700, fontSize: '0.9rem' }}>3</div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📧</div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Erinnern</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.5, lineHeight: 1.5 }}>Ein Klick verschickt Erinnerungen an alle, die noch offen sind – im Design eurer Website</p>
            </div>
          </div>

          {/* CSV format example */}
          <div style={{ background: 'rgba(128,128,128,0.08)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>📎 So muss eure Datei aussehen (CSV oder Excel):</p>
            <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 2, overflowX: 'auto' }}>
              <div style={{ opacity: 0.9, fontWeight: 600, borderBottom: '1px solid rgba(128,128,128,0.2)', paddingBottom: '0.25rem', marginBottom: '0.25rem' }}>
                Name;Email;Gruppe
              </div>
              <div style={{ opacity: 0.6 }}>Anna Müller;anna@example.de;Familie</div>
              <div style={{ opacity: 0.6 }}>Max Schmidt;;Freunde</div>
              <div style={{ opacity: 0.6 }}>Lisa Weber;lisa@example.de;Kollegen</div>
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.72rem', opacity: 0.45 }}>
              <span>✓ Komma oder Semikolon getrennt</span>
              <span>✓ Erste Zeile = Spaltenüberschriften</span>
              <span>✓ "Email" und "Gruppe" sind freiwillig</span>
            </div>
          </div>

          {/* Excel tip */}
          <div style={{ background: 'rgba(59,130,246,0.08)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.78rem', lineHeight: 1.6 }}>
            <strong>💡 Tipp:</strong> In Excel oder Google Sheets einfach die Spalten Name, Email und Gruppe anlegen und ausfüllen; Email und Gruppe dürfen leer bleiben. Ihr könnt die Datei direkt als .xlsx hochladen – oder alternativ als <em>CSV (Trennzeichen-getrennt)</em> speichern.
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <C.ActionButton $primary onClick={() => setShowUpload(true)} style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }}>
              📤 Importieren
            </C.ActionButton>
          </div>
        </C.Card>
      )}

      {/* Zusagen ohne Eintrag auf der Gästeliste */}
      {stats.total > 0 && unlisted.length > 0 && (
        <C.Card style={{ marginBottom: '1rem', padding: '1.25rem' }} data-testid="guest-unlisted">
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Zusagen ohne Eintrag auf der Gästeliste ({unlisted.length})</h3>
          <p style={{ fontSize: '0.82rem', opacity: 0.7, lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Diese Personen haben zugesagt, stehen aber unter diesem Namen nicht auf eurer Liste – etwa Begleitpersonen, Kinder oder eine andere Schreibweise.
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem', lineHeight: 1.8 }}>
            {unlisted.map((p, i) => (
              <li key={i}>{p.name}{p.name !== p.rsvpName ? <span style={{ opacity: 0.6 }}> – in der Antwort von {p.rsvpName}</span> : null}</li>
            ))}
          </ul>
        </C.Card>
      )}

      {/* Guest Table */}
      {stats.total > 0 && (
        <C.Card style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(128,128,128,0.2)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontWeight: 600 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontWeight: 600 }}>E-Mail</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontWeight: 600 }}>Gruppe</th>
                <th style={{ textAlign: 'center', padding: '0.75rem 0.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ textAlign: 'center', padding: '0.75rem 0.5rem', fontWeight: 600 }}>Erinnerung</th>
                <th style={{ textAlign: 'center', padding: '0.75rem 0.5rem', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map(g => (
                <tr key={g.id} style={{ borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
                  <td style={{ padding: '0.6rem 0.5rem', fontWeight: 500 }}>{g.name}</td>
                  <td style={{ padding: '0.6rem 0.5rem', opacity: 0.7 }}>{hasRealEmail(g.email) ? g.email : '–'}</td>
                  <td style={{ padding: '0.6rem 0.5rem', opacity: 0.5 }}>{g.group_name || '–'}</td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                    <span style={{ color: statusColor(g.status), fontWeight: 600, fontSize: '0.8rem' }}>
                      {statusLabel(g.status)}
                    </span>
                    {g.via && g.via !== 'email' && (
                      <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: '0.15rem' }}>
                        {g.via === 'name-likely' ? 'bitte prüfen: ' : 'über den Namen: '}{g.match.name}{g.match.name !== g.match.rsvpName ? ` (Antwort von ${g.match.rsvpName})` : ''}
                      </div>
                    )}
                    {!g.via && g.hint && (
                      <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: '0.15rem' }}>vielleicht: {g.hint.join(', ')}</div>
                    )}
                  </td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
                    {g.reminder_sent_at ? `📧 ${formatDate(g.reminder_sent_at)}` : '–'}
                  </td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDelete(g.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', opacity: 0.5 }}
                      title="Entfernen"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredGuests.length === 0 && (searchTerm || statusFilter !== 'all') && (
            <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>{searchTerm ? `Keine Ergebnisse für "${searchTerm}"` : 'Keine Einträge mit diesem Status'}</p>
          )}
        </C.Card>
      )}
    </>
  );
}

export default GuestListSection;
