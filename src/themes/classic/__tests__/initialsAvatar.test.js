import { initialsAvatar } from '../ContactWitnesses';

describe('initialsAvatar', () => {
  const svg = (name) => decodeURIComponent(initialsAvatar(name).split(',')[1]);
  it('erzeugt ein lokales Bild ohne fremde Adresse', () => {
    const url = initialsAvatar('Mara Beispiel');
    expect(url.startsWith('data:image/svg+xml')).toBe(true);
    expect(svg('Mara Beispiel').replace('http://www.w3.org/2000/svg', '')).not.toMatch(/https?:/);
  });
  it('zeigt die Initialen der ersten zwei Namensteile', () => {
    expect(svg('Mara Beispiel')).toContain('>MB<');
    expect(svg('şule özgür demir')).toContain('>ŞÖ<');
    expect(svg('Oma')).toContain('>O<');
  });
  it('kommt mit leeren und auffälligen Namen zurecht', () => {
    expect(svg('')).toContain('></text>');
    expect(svg(undefined)).toContain('></text>');
    expect(svg('<script> &')).toContain('></text>');
  });
});
