-- =====================================================================
-- S&I. – Migration „Zusatzfunktionen je Projekt" (Cassis-Theme, RSVP-Regeln)
-- Stand: 16.11.2026 · Im isolierten Test geprüft. B1–B4 und B5 wurden am 16.11.2026 vom Inhaber
-- im Supabase-Dashboard ausgeführt (B5 nachträglich ergänzt: Einschränkung check_theme).
--
-- Ausführen NUR nach ausdrücklicher Freigabe. Reihenfolge beim Livegang:
--   1. Abschnitt A (Vorabprüfung, nur lesen) ausführen und Ergebnis ansehen
--   2. Abschnitt B (Migration) ausführen
--   3. Abschnitt C (Nachprüfung, nur lesen) ausführen
--   4. erst danach den neuen Code ausliefern
--
-- Eigenschaften:
--   * rein additiv: drei neue Spalten, ein neuer Index, ein zusätzlich erlaubtes Theme
--   * keine bestehende Spalte, Zeile, Richtlinie (RLS) oder Funktion wird geändert
--   * mehrfach ausführbar (if not exists)
--   * bestehende Projekte behalten ihr Verhalten: features = {} bedeutet „alles wie bisher"
-- =====================================================================


-- ---------------------------------------------------------------------
-- A. VORABPRÜFUNG (nur lesen)
-- ---------------------------------------------------------------------

-- A1: Gibt es die Spalten schon? Erwartet: 0 Zeilen vor der Migration.
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and ((table_name = 'projects' and column_name = 'features')
    or (table_name = 'rsvp_responses' and column_name in ('language', 'dedupe_key')));

-- A2: Größe der betroffenen Tabellen (zur Einordnung; beide sind klein).
select 'projects' as tabelle, count(*) from public.projects
union all select 'rsvp_responses', count(*) from public.rsvp_responses;

-- A3: Ist RLS eingeschaltet und welche Richtlinien gibt es? Nur zur Dokumentation –
--     diese Migration ändert daran nichts.
select c.relname as tabelle, c.relrowsecurity as rls_aktiv
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('projects', 'rsvp_responses', 'project_content');

select tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public' and tablename in ('projects', 'rsvp_responses', 'project_content')
order by tablename, policyname;


-- A4: Welche Themes erlaubt die Datenbank heute? Erwartet: elf Werte ohne 'cassis'.
select conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'public.projects'::regclass and contype = 'c';


-- ---------------------------------------------------------------------
-- B. MIGRATION
-- ---------------------------------------------------------------------
begin;

-- B1: Zusatzfunktionen je Projekt. Leeres Objekt = Verhalten wie bisher.
--     Beispiel Cassis:
--     {"i18n": {"languages": ["en","tr","de","fr"], "default": "en"},
--      "rsvp": {"max_persons": 8, "child_ages": true, "confirmation_mail": true}}
alter table public.projects
  add column if not exists features jsonb not null default '{}'::jsonb;

-- B2: Sprache, in der ein Gast geantwortet hat (en, tr, de, fr). Leer bei alten Antworten.
alter table public.rsvp_responses
  add column if not exists language text;

-- B3: Schlüssel gegen versehentliche Doppelantworten (kleingeschriebene E-Mail).
--     Wird nur bei Projekten mit eingeschalteten RSVP-Regeln gesetzt.
--     Alte Antworten und alle bisherigen Themes behalten NULL und sind nicht betroffen.
alter table public.rsvp_responses
  add column if not exists dedupe_key text;

-- B4: Eindeutigkeit je Projekt, nur wo ein Schlüssel gesetzt ist (Teilindex).
--     Dieser Index ist die eigentliche Sicherung bei gleichzeitigen Anfragen.
create unique index if not exists rsvp_responses_project_dedupe_key
  on public.rsvp_responses (project_id, dedupe_key)
  where dedupe_key is not null;

-- B5: Theme „cassis" in der Liste der erlaubten Themes ergänzen.
--     Die bisherigen elf Werte bleiben unverändert erlaubt. Vorher mit A4 prüfen,
--     dass die Liste noch dem hier angenommenen Stand entspricht.
alter table public.projects drop constraint if exists check_theme;
alter table public.projects add constraint check_theme
  check (theme = any (array[
    'classic'::text, 'botanical'::text, 'contemporary'::text, 'editorial'::text,
    'luxe'::text, 'modern'::text, 'neon'::text, 'video'::text,
    'parallax'::text, 'summer'::text, 'cinematic'::text, 'cassis'::text
  ]));

comment on column public.projects.features is 'Zusatzfunktionen je Projekt (Sprachen, RSVP-Regeln). {} = Standardverhalten.';
comment on column public.rsvp_responses.language is 'Sprache der Antwort (en/tr/de/fr), leer bei älteren Antworten.';
comment on column public.rsvp_responses.dedupe_key is 'Schutz vor Doppelantworten; nur bei Projekten mit RSVP-Regeln gesetzt.';

commit;


-- ---------------------------------------------------------------------
-- C. NACHPRÜFUNG (nur lesen)
-- ---------------------------------------------------------------------

-- C1: Erwartet: 3 Zeilen (features jsonb, language text, dedupe_key text).
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and ((table_name = 'projects' and column_name = 'features')
    or (table_name = 'rsvp_responses' and column_name in ('language', 'dedupe_key')));

-- C2: Erwartet: alle Projekte haben features = {} (Anzahl = Gesamtzahl der Projekte).
select count(*) as projekte_gesamt, count(*) filter (where features = '{}'::jsonb) as ohne_zusatzfunktionen
from public.projects;

-- C3: Erwartet: keine alte Antwort hat Sprache oder Schlüssel.
select count(*) as antworten_gesamt, count(language) as mit_sprache, count(dedupe_key) as mit_schluessel
from public.rsvp_responses;

-- C4: Erwartet: 1 Zeile, eindeutiger Teilindex.
select indexname, indexdef from pg_indexes
where schemaname = 'public' and indexname = 'rsvp_responses_project_dedupe_key';

-- C5: Richtlinien unverändert? Ergebnis mit A3 vergleichen.
select tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public' and tablename in ('projects', 'rsvp_responses', 'project_content')
order by tablename, policyname;


-- ---------------------------------------------------------------------
-- D. PROJEKT EINSCHALTEN (erst nach dem Code-Livegang, Slug prüfen!)
--    Alternativ im SuperAdmin: Projekt → „09 Sprachen & RSVP" → „Cassis-Vorgaben übernehmen".
-- ---------------------------------------------------------------------
-- update public.projects
-- set features = '{"i18n": {"languages": ["en","tr","de","fr"], "default": "en"},
--                  "rsvp": {"max_persons": 8, "child_ages": true, "confirmation_mail": true}}'::jsonb
-- where slug = '<slug-des-projekts>';


-- ---------------------------------------------------------------------
-- E. RÜCKBAU (nur im Notfall; löscht die Inhalte der drei Spalten unwiderruflich)
--    Vorher den alten Code ausliefern. Der alte Code kommt mit vorhandenen Spalten
--    problemlos zurecht – ein Rückbau der Datenbank ist für ein Code-Rollback NICHT nötig.
-- ---------------------------------------------------------------------
-- begin;
-- drop index if exists public.rsvp_responses_project_dedupe_key;
-- alter table public.rsvp_responses drop column if exists dedupe_key;
-- alter table public.rsvp_responses drop column if exists language;
-- alter table public.projects drop column if exists features;
-- commit;
