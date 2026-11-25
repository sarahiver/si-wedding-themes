import { splitTime } from '../Timeline';

test('Uhrzeit für den Zeitstrahl: Stunde und Minuten getrennt, freie Angaben bleiben', () => {
  expect(splitTime('15:00')).toEqual({ hour: '15', minutes: '00' });
  expect(splitTime('9.30')).toEqual({ hour: '9', minutes: '30' });
  expect(splitTime(' 21h15 ')).toEqual({ hour: '21', minutes: '15' });
  expect(splitTime('ab 15 Uhr')).toBeNull();
  expect(splitTime('')).toBeNull();
  expect(splitTime(undefined)).toBeNull();
});
