// core/editors/themeFieldConfig.js
// Central config: which fields to HIDE per theme per editor
// If a field is listed here, it will be hidden in the editor for that theme.
// This keeps editors theme-agnostic — they just check `hidden('fieldName')`.
//
// Fields not listed = always shown (default).
// Add new themes here as needed.

const HIDDEN_FIELDS = {
  parallax: {
    hero: [
      'background_image', 'background_image_mobile', 'background_video',
      'background_media', 'background_media_mobile', 'use_video',
      'image2', 'tagline', 'location_short', 'script_line',
    ],
    lovestory: ['subtitle', 'signature', 'image_accent', 'image_front', 'image_back'],
    timeline: ['event_image', 'event_icon'], // sub-fields of events[]
    dresscode: ['image', 'accent_image'],
    locations: ['icon', 'accent_image'],
    directions: ['accent_image', 'image'],
    rsvp: ['background_image', 'ask_allergies'],
    guestbook: ['image'],
    musicwishes: ['image', 'image2'],
    photoupload: ['background_image'],
    weddingabc: ['hero_image'],
    accommodations: ['hero_image'],
    countdown: ['title', 'show_seconds'],
    footer: ['hashtag', 'tagline', 'image', 'image2'],
    savethedate: ['__entire_section__'], // Hide entire editor
  },
  // Add other themes as needed:
  // neon: { hero: ['script_line'], ... },
};

/**
 * Hook: returns a `hidden(fieldName)` function for use in editors.
 * Usage in any editor:
 *   const hidden = useHiddenFields('lovestory');
 *   {!hidden('subtitle') && <C.FormGroup>...</C.FormGroup>}
 *
 * Also returns `hiddenSection` boolean for editors that should be hidden entirely.
 */
export function useHiddenFields(sectionId, project) {
  const theme = project?.theme || 'editorial';
  const hiddenList = HIDDEN_FIELDS[theme]?.[sectionId] || [];

  return {
    hidden: (fieldName) => hiddenList.includes(fieldName),
    hiddenSection: hiddenList.includes('__entire_section__'),
    isParallax: theme === 'parallax',
  };
}

export default HIDDEN_FIELDS;
