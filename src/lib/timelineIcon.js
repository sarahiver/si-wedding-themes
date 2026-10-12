// Timeline-Icons: Der IconPicker speichert Emojis. Ältere Inhalte (u. a. die
// Demo-Projekte) enthalten noch Icon-NAMEN wie "rings" oder "champagne" –
// die wurden bisher als Wort groß ins Layout geschrieben und liefen auf
// Mobile aus ihrer Box. Hier werden bekannte Namen auf Emojis abgebildet.

const NAME_TO_EMOJI = {
  rings: '💍', ring: '💍', wedding: '💒', church: '💒', ceremony: '💒',
  champagne: '🥂', drinks: '🥂', toast: '🥂', reception: '🥂', cheers: '🥂',
  dinner: '🍽️', food: '🍽️', lunch: '🍽️', meal: '🍽️', brunch: '🥐',
  cake: '🎂', music: '🎵', dance: '💃', dancing: '💃', party: '🎉',
  sparkles: '✨', sparkler: '✨', fireworks: '🎆', camera: '📸', photo: '📸',
  photos: '📸', car: '🚗', bus: '🚌', hotel: '🏨', sleep: '🌙', moon: '🌙',
  heart: '❤️', love: '❤️', flowers: '💐', flower: '💐', coffee: '☕',
  location: '📍', pin: '📍', clock: '🕐', time: '🕐', star: '⭐', gift: '🎁',
  bar: '🍸', cocktail: '🍸', snack: '🍔', burger: '🍔', sun: '☀️', sunset: '🌅',
};

/**
 * Liefert ein darstellbares Icon:
 * - Emojis/Sonderzeichen unverändert
 * - bekannte Namen ("rings") → Emoji
 * - unbekannte reine Wörter → fallback (Standard: kein Icon)
 */
export function timelineIcon(icon, fallback = null) {
  if (icon == null) return fallback;
  const raw = String(icon).trim();
  if (!raw) return fallback;
  // Reines ASCII-Wort (Icon-Name) → abbilden
  if (/^[a-z][a-z0-9_ -]*$/i.test(raw)) {
    const key = raw.toLowerCase().replace(/[\s_-]+/g, '');
    return NAME_TO_EMOJI[key] || NAME_TO_EMOJI[raw.toLowerCase()] || fallback;
  }
  return raw;
}

export default timelineIcon;
