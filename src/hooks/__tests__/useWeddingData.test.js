// Vergleichsbasis für das Laden der Inhalte (Stand vor der Mehrsprachigkeit).
// Diese Tests müssen nach jeder Änderung an useWeddingData unverändert bestehen.
import { renderHook, flush } from '../../testing/renderHook';
import { useWeddingData } from '../useWeddingData';

let mockProject;
let mockContent;
let mockContentCalls;
jest.mock('../../lib/supabase', () => ({
  getProjectBySlugOrDomain: async () => mockProject,
  getProjectContent: async () => { mockContentCalls += 1; return mockContent; },
}));

const project = (extra = {}) => ({
  data: { id: 'p1', slug: 'mia-noah', theme: 'classic', status: 'live', couple_names: 'Mia & Noah', wedding_date: '2027-06-12', active_components: [], ...extra },
  error: null,
});

beforeEach(() => {
  mockProject = project();
  mockContent = { data: {}, error: null };
  mockContentCalls = 0;
});

async function load() {
  const h = await renderHook(() => useWeddingData('mia-noah'));
  await flush();
  return h.result;
}

test('gespeicherte Inhalte überschreiben die Standardtexte feldweise', async () => {
  mockContent = { data: { rsvp: { title: 'Eure Zusage' } }, error: null };
  const r = await load();
  const rsvp = r.current.getContent('rsvp');
  expect(rsvp.title).toBe('Eure Zusage');
  // übrige Felder des Bereichs kommen weiter aus den Standardtexten
  expect(Object.keys(rsvp).length).toBeGreaterThan(1);
});

test('Bereich ohne gespeicherte Inhalte liefert die Standardtexte', async () => {
  const r = await load();
  expect(typeof r.current.getContent('rsvp')).toBe('object');
  expect(r.current.getContent('gibt_es_nicht')).toEqual({});
});

test('unbekannter Bereich aus der Datenbank wird unverändert durchgereicht', async () => {
  mockContent = { data: { childcare: { title: 'Kinder' } }, error: null };
  const r = await load();
  expect(r.current.getContent('childcare')).toEqual({ title: 'Kinder' });
});

test('gesperrte Seite fragt keine Inhalte ab', async () => {
  mockProject = { ...project(), access: { locked: true, reason: 'password' } };
  const r = await load();
  expect(mockContentCalls).toBe(0);
  expect(r.current.access).toEqual({ locked: true, reason: 'password' });
});

test('Projekt nicht gefunden setzt einen Fehler', async () => {
  mockProject = { data: null, error: { message: 'Not found' } };
  const r = await load();
  expect(r.current.error).toBe('Project not found');
  expect(r.current.project).toBe(null);
});

test('Bereiche: leere Liste zeigt alle, sonst nur die genannten', async () => {
  let r = await load();
  expect(r.current.isComponentActive('gallery')).toBe(true);
  mockProject = project({ active_components: ['hero', 'rsvp'] });
  r = await load();
  expect(r.current.isComponentActive('rsvp')).toBe(true);
  expect(r.current.isComponentActive('gallery')).toBe(false);
  mockProject = project({ active_components: ['all'] });
  r = await load();
  expect(r.current.isComponentActive('gallery')).toBe(true);
});

test('Kurzangaben stammen aus dem Projekt', async () => {
  const r = await load();
  expect(r.current.theme).toBe('classic');
  expect(r.current.slug).toBe('mia-noah');
  expect(r.current.projectId).toBe('p1');
  expect(r.current.coupleNames).toBe('Mia & Noah');
  expect(r.current.weddingDate).toBe('2027-06-12');
});

// ---- Mehrsprachige Projekte (Opt-in) ----
const multilingual = { features: { i18n: { languages: ['en', 'de'], default: 'en' } } };

test('mehrsprachiges Projekt bekommt keine deutschen Vorgabetexte', async () => {
  mockProject = project(multilingual);
  mockContent = { data: { rsvp: { description: 'Please reply' } }, error: null };
  const r = await load();
  expect(r.current.getContent('hero').tagline).toBe('');
  expect(r.current.getContent('timeline').title).toBe('');
  expect(r.current.getContent('rsvp')).toMatchObject({ title: '', description: 'Please reply' });
  // Felder ohne Text behalten ihre Vorgabe
  expect(r.current.getContent('timeline').events).toEqual([]);
  expect(r.current.getContent('countdown').show_seconds).toBe(false);
});

test('leere Einstellung zählt als einsprachig: Vorgabetexte bleiben', async () => {
  mockProject = project({ features: {} });
  const r = await load();
  expect(r.current.getContent('hero').tagline).toBe('Wir heiraten');
  expect(r.current.getContent('rsvp').title).toBe('Zusage');
});
