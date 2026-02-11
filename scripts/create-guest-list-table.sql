-- ============================================
-- GUEST LIST TABLE für RSVP-Erinnerungen
-- Führe dieses SQL in Supabase → SQL Editor aus
-- ============================================

CREATE TABLE IF NOT EXISTS guest_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  group_name TEXT DEFAULT '',
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  reminder_sent_at TIMESTAMPTZ DEFAULT NULL,
  reminder_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für schnellen Abgleich mit rsvp_responses
CREATE INDEX IF NOT EXISTS idx_guest_list_project ON guest_list(project_id);
CREATE INDEX IF NOT EXISTS idx_guest_list_email ON guest_list(project_id, email);

-- Unique: Pro Projekt kann eine E-Mail nur einmal in der Gästeliste stehen
ALTER TABLE guest_list ADD CONSTRAINT unique_guest_per_project UNIQUE (project_id, email);

-- RLS aktivieren
ALTER TABLE guest_list ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann lesen/schreiben (Anon Key, wie bei anderen Tabellen)
CREATE POLICY "guest_list_all" ON guest_list FOR ALL USING (true) WITH CHECK (true);
