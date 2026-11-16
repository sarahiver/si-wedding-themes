import { zonedToUtcMs, remaining, monthGrid, buildIcs, eventTimes } from '../calendar';

describe('Zeitzone Europe/Paris', () => {
  test('15.05.2027 15:00 Paris ist 13:00 UTC (Sommerzeit)', () => {
    expect(new Date(zonedToUtcMs('2027-05-15', '15:00', 'Europe/Paris')).toISOString()).toBe('2027-05-15T13:00:00.000Z');
  });
  test('Winterzeit: 15:00 Paris ist 14:00 UTC', () => {
    expect(new Date(zonedToUtcMs('2027-01-15', '15:00', 'Europe/Paris')).toISOString()).toBe('2027-01-15T14:00:00.000Z');
  });
  test('ungültiges Datum: null', () => {
    expect(zonedToUtcMs('', '15:00', 'Europe/Paris')).toBeNull();
  });
});

describe('eventTimes', () => {
  test('ohne Endzeit: 02:00 Uhr am Folgetag', () => {
    const { startMs, endMs } = eventTimes({ date: '2027-05-15', time: '15:00' });
    expect(new Date(startMs).toISOString()).toBe('2027-05-15T13:00:00.000Z');
    expect(new Date(endMs).toISOString()).toBe('2027-05-16T00:00:00.000Z');
  });
  test('Endzeit am selben Tag bleibt am selben Tag', () => {
    const { endMs } = eventTimes({ date: '2027-05-15', time: '15:00', endTime: '23:30' });
    expect(new Date(endMs).toISOString()).toBe('2027-05-15T21:30:00.000Z');
  });
  test('eigenes Enddatum wird übernommen', () => {
    const { endMs } = eventTimes({ date: '2027-05-15', time: '15:00', endDate: '2027-05-16', endTime: '04:00' });
    expect(new Date(endMs).toISOString()).toBe('2027-05-16T02:00:00.000Z');
  });
  test('ohne Datum: kein Termin', () => {
    expect(eventTimes({ date: '' })).toEqual({ startMs: null, endMs: null });
  });
});

describe('remaining', () => {
  const target = Date.UTC(2027, 4, 15, 13, 0, 0);
  test('zählt Tage, Stunden, Minuten', () => {
    const r = remaining(target, Date.UTC(2027, 4, 13, 11, 30, 0));
    expect([r.days, r.hours, r.minutes, r.past]).toEqual([2, 1, 30, false]);
  });
  test('nach dem Termin: 0 und nie negativ', () => {
    const r = remaining(target, target + 5000);
    expect([r.days, r.hours, r.minutes, r.seconds, r.past]).toEqual([0, 0, 0, 0, true]);
  });
  test('ohne Ziel: 0, nicht „vorbei"', () => {
    expect(remaining(null).past).toBe(false);
  });
});

describe('monthGrid', () => {
  test('Mai 2027 beginnt an einem Samstag und hat 31 Tage', () => {
    const cells = monthGrid(2027, 5);
    expect(cells.slice(0, 6)).toEqual([null, null, null, null, null, 1]);
    expect(cells[cells.length - 1]).toBe(31);
    expect(cells.indexOf(15) % 7).toBe(5); // Samstag
  });
  test('Februar im Schaltjahr', () => {
    expect(monthGrid(2028, 2).filter(Boolean).length).toBe(29);
  });
});

describe('buildIcs', () => {
  const base = { uid: 'x@siwedding.de', title: 'We are getting married: Lena Tom', startMs: Date.UTC(2027, 4, 15, 13), endMs: Date.UTC(2027, 4, 16, 0), nowMs: Date.UTC(2026, 10, 16, 10) };
  test('Beginn und Ende als eindeutige UTC-Zeiten', () => {
    const ics = buildIcs(base);
    expect(ics).toContain('DTSTART:20270515T130000Z');
    expect(ics).toContain('DTEND:20270516T000000Z');
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });
  test('Sonderzeichen werden maskiert, lange Zeilen umbrochen', () => {
    const ics = buildIcs({ ...base, location: 'Château de Cassis, Traverse du Château; 13260 Cassis', description: 'a\nb '.repeat(40) });
    expect(ics).toContain('LOCATION:Château de Cassis\\, Traverse du Château\\; 13260 Cassis');
    ics.split('\r\n').forEach((line) => expect(line.length).toBeLessThanOrEqual(75));
  });
  test('ohne Beginn keine Datei; Ende vor Beginn wird auf eine Stunde korrigiert', () => {
    expect(buildIcs({ ...base, startMs: null })).toBeNull();
    expect(buildIcs({ ...base, endMs: base.startMs - 1 })).toContain('DTEND:20270515T140000Z');
  });
});
