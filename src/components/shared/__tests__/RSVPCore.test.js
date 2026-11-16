// Vergleichsbasis für die gemeinsame RSVP-Logik (Stand vor der Erweiterung).
// Diese Tests müssen nach jeder Änderung an RSVPCore unverändert bestehen.
import { renderHook, act } from '../../../testing/renderHook';
import { useRSVP } from '../RSVPCore';

let mockProjectId;
let mockDuplicate;
let mockSubmitResult;
let mockSubmitCalls;
jest.mock('../../../context/WeddingContext', () => ({ useWedding: () => ({ projectId: mockProjectId }) }));
jest.mock('../../../lib/supabase', () => ({
  checkDuplicateRSVP: async () => ({ exists: mockDuplicate }),
  submitRSVP: async (projectId, data) => { mockSubmitCalls.push({ projectId, data }); return mockSubmitResult; },
}));

beforeEach(() => {
  mockProjectId = 'p1';
  mockDuplicate = false;
  mockSubmitResult = { data: { id: 'r1' }, error: null };
  mockSubmitCalls = [];
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

async function setup(fields = {}) {
  const h = await renderHook(() => useRSVP());
  for (const [k, v] of Object.entries(fields)) await act(async () => { h.result.current.updateField(k, v); });
  return h.result;
}
const submit = async (r) => { let out; await act(async () => { out = await r.current.submit(); }); return out; };

test('Startwerte des Formulars', async () => {
  const r = await setup();
  expect(r.current.formData).toMatchObject({ name: '', email: '', persons: 1, attending: true, guests: [] });
  expect(r.current.isDemo).toBe(false);
});

test('Pflichtfelder: Name, E-Mail, gültige E-Mail, mindestens eine Person', async () => {
  let r = await setup();
  expect((await submit(r)).success).toBe(false);
  expect(r.current.error).toBe('Bitte gib deinen Namen ein');
  r = await setup({ name: 'Anna' });
  await submit(r);
  expect(r.current.error).toBe('Bitte gib deine E-Mail-Adresse ein');
  r = await setup({ name: 'Anna', email: 'kein-at' });
  await submit(r);
  expect(r.current.error).toBe('Bitte gib eine gültige E-Mail-Adresse ein');
  r = await setup({ name: 'Anna', email: 'a@example.test', persons: 0 });
  await submit(r);
  expect(r.current.error).toBe('Mindestens 1 Person erforderlich');
  expect(mockSubmitCalls).toHaveLength(0);
});

test('erfolgreiche Zusage: Daten werden bereinigt und einmal gesendet', async () => {
  const r = await setup({ name: '  Anna Beispiel ', email: 'Anna@Example.TEST', persons: 2, dietary: ' vegan ', message: ' Hallo ', customAnswer: ' ja ' });
  const out = await submit(r);
  expect(out.success).toBe(true);
  expect(r.current.submitted).toBe(true);
  expect(mockSubmitCalls).toHaveLength(1);
  expect(mockSubmitCalls[0]).toEqual({
    projectId: 'p1',
    data: { name: 'Anna Beispiel', email: 'anna@example.test', persons: 2, attending: true, dietary: 'vegan', allergies: '', message: 'Hallo', guests: [], custom_answer: 'ja' },
  });
});

test('E-Mail mit Leerzeichen davor oder dahinter gilt als ungültig', async () => {
  const r = await setup({ name: 'Anna', email: ' a@example.test ' });
  await submit(r);
  expect(r.current.error).toBe('Bitte gib eine gültige E-Mail-Adresse ein');
  expect(mockSubmitCalls).toHaveLength(0);
});

test('doppelte E-Mail wird vor dem Senden abgefangen', async () => {
  mockDuplicate = true;
  const r = await setup({ name: 'Anna', email: 'a@example.test' });
  const out = await submit(r);
  expect(out).toEqual({ success: false, error: 'duplicate' });
  expect(r.current.error).toBe('Du hast bereits eine Rückmeldung gegeben.');
  expect(mockSubmitCalls).toHaveLength(0);
});

test('Fehler beim Speichern zeigt eine Meldung und gilt nicht als gesendet', async () => {
  mockSubmitResult = { data: null, error: { message: 'kaputt' } };
  const r = await setup({ name: 'Anna', email: 'a@example.test' });
  const out = await submit(r);
  expect(out.success).toBe(false);
  expect(r.current.submitted).toBe(false);
  expect(r.current.error).toBe('Fehler beim Senden. Bitte versuche es erneut.');
});

test('Demo-Modus sendet nichts an den Server', async () => {
  mockProjectId = 'demo';
  const r = await setup({ name: 'Anna', email: 'a@example.test' });
  const out = await submit(r);
  expect(out.success).toBe(true);
  expect(mockSubmitCalls).toHaveLength(0);
});

test('Personenzahl bleibt über die Knöpfe zwischen 1 und 10', async () => {
  const r = await setup();
  for (let i = 0; i < 15; i++) await act(async () => { r.current.adjustPersons(1); });
  expect(r.current.formData.persons).toBe(10);
  for (let i = 0; i < 15; i++) await act(async () => { r.current.adjustPersons(-1); });
  expect(r.current.formData.persons).toBe(1);
});

test('Zurücksetzen leert das Formular', async () => {
  const r = await setup({ name: 'Anna', email: 'a@example.test' });
  await submit(r);
  await act(async () => { r.current.resetForm(); });
  expect(r.current.submitted).toBe(false);
  expect(r.current.formData.name).toBe('');
});
