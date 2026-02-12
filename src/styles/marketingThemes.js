// src/styles/marketingThemes.js
// Design-Tokens exakt aus si-wedding-themes übernommen

export const marketingThemes = {
  // ═══════════════════════════════════════════════════════════
  // EDITORIAL - Magazine Bold Style mit Rot-Akzent
  // S/W Bilder, Oswald Headlines, Source Serif Accents
  // ═══════════════════════════════════════════════════════════
  editorial: {
    id: "editorial",
    name: "Editorial",
    description: "Magazine Bold — S/W mit Rot-Akzent",
    isDark: false,
    colors: {
      primary: "#C41E3A",        // Editorial Red - HAUPT-AKZENT!
      secondary: "#0A0A0A",
      accent: "#C41E3A",
      background: "#FAFAFA",
      backgroundAlt: "#0A0A0A",  // Für dunkle Sections
      surface: "#FFFFFF",
      text: "#0A0A0A",
      textLight: "#FAFAFA",
      textSecondary: "#666666",
      textMuted: "#999999",
      border: "#E5E5E5",
      borderHover: "#C41E3A",
    },
    fonts: {
      headline: "'Oswald', 'Arial Narrow', sans-serif",
      serif: "'Source Serif 4', Georgia, serif",
      body: "'Inter', sans-serif",
    },
    style: {
      headingWeight: "700",
      headingLetterSpacing: "-0.02em",
      headingTextTransform: "uppercase",
      headingLineHeight: "0.9",
      bodyWeight: "300",
      bodyLetterSpacing: "0",
      borderRadius: "0",
      borderWidth: "1px",
      dividerWidth: "2px",
      dividerColor: "#C41E3A",
      buttonStyle: "solid",
      imageFilter: "grayscale(100%)",
      shadowStyle: "subtle",
      animationStyle: "smooth",
      sectionSpacing: "clamp(4rem, 10vh, 8rem)",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // BOTANICAL - Dark Glassmorphism mit Pflanzen
  // Apple-style Glass, dunkler Hintergrund, Cormorant + Montserrat
  // ═══════════════════════════════════════════════════════════
  botanical: {
    id: "botanical",
    name: "Botanical",
    description: "Dark Glassmorphism — Tropisch elegant",
    isDark: true,
    colors: {
      primary: "rgba(45, 90, 60, 0.8)",
      secondary: "rgba(80, 140, 90, 0.6)",
      accent: "rgba(45, 90, 60, 0.8)",
      background: "#040604",
      backgroundAlt: "#081208",
      surface: "rgba(255, 255, 255, 0.08)",
      surfaceHover: "rgba(255, 255, 255, 0.12)",
      text: "rgba(255, 255, 255, 0.95)",
      textSecondary: "rgba(255, 255, 255, 0.55)",
      textMuted: "rgba(255, 255, 255, 0.35)",
      border: "rgba(255, 255, 255, 0.15)",
      borderHover: "rgba(255, 255, 255, 0.25)",
      glass: {
        bg: "rgba(255, 255, 255, 0.08)",
        border: "rgba(255, 255, 255, 0.15)",
        blur: "40px",
        shadow: "0 0 0 1px rgba(255,255,255,0.05) inset, 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 40px rgba(0, 0, 0, 0.25)",
      },
    },
    fonts: {
      headline: "'Cormorant Garamond', Georgia, serif",
      body: "'Montserrat', sans-serif",
    },
    style: {
      headingWeight: "300",
      headingLetterSpacing: "0",
      headingTextTransform: "none",
      headingLineHeight: "1.1",
      bodyWeight: "300",
      bodyLetterSpacing: "0.02em",
      borderRadius: "28px",
      borderWidth: "1px",
      dividerWidth: "1px",
      buttonStyle: "glass",
      backdropFilter: "blur(40px) saturate(180%)",
      shadowStyle: "glass",
      animationStyle: "smooth",
      sectionSpacing: "clamp(4rem, 10vh, 8rem)",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // CONTEMPORARY - Neobrutalism Playful
  // Bunte Palette, harte Schatten, Space Grotesk
  // ═══════════════════════════════════════════════════════════
  contemporary: {
    id: "contemporary",
    name: "Contemporary",
    description: "Neobrutalism — Playful & Bold",
    isDark: false,
    colors: {
      primary: "#FF6B6B",       // Coral
      secondary: "#4ECDC4",     // Electric Teal
      accent: "#FFE66D",        // Yellow
      purple: "#9B5DE5",
      pink: "#F15BB5",
      background: "#FAFAFA",
      backgroundAlt: "#0D0D0D",
      surface: "#FFFFFF",
      text: "#0D0D0D",
      textLight: "#FAFAFA",
      textSecondary: "#737373",
      textMuted: "#A3A3A3",
      border: "#0D0D0D",
      borderHover: "#0D0D0D",
      // Neobrutalism Shadows
      shadowSm: "4px 4px 0 #0D0D0D",
      shadowMd: "6px 6px 0 #0D0D0D",
      shadowLg: "8px 8px 0 #0D0D0D",
      shadowXl: "12px 12px 0 #0D0D0D",
    },
    fonts: {
      headline: "'Space Grotesk', sans-serif",
      body: "'Space Grotesk', sans-serif",
    },
    style: {
      headingWeight: "700",
      headingLetterSpacing: "-0.02em",
      headingTextTransform: "uppercase",
      headingLineHeight: "1.1",
      bodyWeight: "400",
      bodyLetterSpacing: "0",
      borderRadius: "0",
      borderWidth: "3px",
      dividerWidth: "3px",
      buttonStyle: "brutal",
      shadowStyle: "brutal",
      animationStyle: "bouncy",
      sectionSpacing: "clamp(4rem, 10vh, 8rem)",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // LUXE - Cinematic Dark Luxury
  // Sehr langsame, elegante Animationen, Cormorant + Outfit
  // ═══════════════════════════════════════════════════════════
  luxe: {
    id: "luxe",
    name: "Luxe",
    description: "Cinematic Luxury — Elegant & Timeless",
    isDark: true,
    colors: {
      primary: "#C9A962",       // Gold
      secondary: "#D4AF37",     // Champagne
      accent: "#C9A962",
      background: "#0A0A0A",    // Void
      backgroundAlt: "#0E0E11", // Anthracite
      surface: "#1A1A1D",       // Charcoal
      text: "#F8F6F3",          // Cream
      textSecondary: "#E8E6E1", // Pearl
      textMuted: "rgba(248, 246, 243, 0.5)",
      border: "rgba(201, 169, 98, 0.25)",
      borderHover: "#C9A962",
    },
    fonts: {
      headline: "'Cormorant', 'Didot', Georgia, serif",
      body: "'Outfit', 'Montserrat', sans-serif",
    },
    style: {
      headingWeight: "300",
      headingLetterSpacing: "-0.02em",
      headingTextTransform: "none",
      headingLineHeight: "1.1",
      headingFontStyle: "italic",
      bodyWeight: "300",
      bodyLetterSpacing: "0",
      borderRadius: "0",
      borderWidth: "1px",
      dividerWidth: "1px",
      dividerColor: "#C9A962",
      buttonStyle: "outline",
      shadowStyle: "subtle",
      animationStyle: "cinematic",
      transitionEase: "cubic-bezier(0.16, 1, 0.3, 1)",
      transitionDuration: "1.2s",
      sectionSpacing: "clamp(5rem, 15vh, 10rem)",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // NEON - Cyberpunk Glow
  // Glitch-Effekte, Glow Shadows, Grid Background
  // ═══════════════════════════════════════════════════════════
  neon: {
    id: "neon",
    name: "Neon",
    description: "Cyberpunk — Glow & Glitch",
    isDark: true,
    colors: {
      primary: "#00ffff",       // Cyan
      secondary: "#ff00ff",     // Pink/Magenta
      accent: "#00ff88",        // Green
      purple: "#b347ff",
      background: "#0a0a0f",
      backgroundAlt: "#12121a",
      surface: "rgba(255, 255, 255, 0.05)",
      text: "#FFFFFF",
      textSecondary: "rgba(255, 255, 255, 0.6)",
      textMuted: "rgba(255, 255, 255, 0.4)",
      border: "rgba(0, 255, 255, 0.3)",
      borderHover: "#00ffff",
      // Glow Effects
      glowCyan: "0 0 10px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3)",
      glowPink: "0 0 10px rgba(255, 0, 255, 0.5), 0 0 30px rgba(255, 0, 255, 0.3)",
      glowGreen: "0 0 10px rgba(0, 255, 136, 0.5), 0 0 30px rgba(0, 255, 136, 0.3)",
      textGlowCyan: "0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5)",
      textGlowPink: "0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.5)",
    },
    fonts: {
      headline: "'Space Grotesk', sans-serif",
      body: "'Space Grotesk', sans-serif",
    },
    style: {
      headingWeight: "700",
      headingLetterSpacing: "0",
      headingTextTransform: "uppercase",
      headingLineHeight: "1.1",
      bodyWeight: "400",
      bodyLetterSpacing: "0",
      borderRadius: "0",
      borderWidth: "1px",
      dividerWidth: "1px",
      buttonStyle: "glow",
      shadowStyle: "glow",
      animationStyle: "glitch",
      gridBackground: true,
      sectionSpacing: "clamp(4rem, 10vh, 8rem)",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // VIDEO - Horizontal Cinematic S/W
  // Dusty Blue Akzent, Manrope + Inter, Grayscale Bilder
  // ═══════════════════════════════════════════════════════════
  video: {
    id: "video",
    name: "Video",
    description: "Cinematic S/W — Horizontal & Modern",
    isDark: true,
    colors: {
      primary: "#6B8CAE",       // Dusty Blue - NICHT Gold!
      secondary: "#8BA5C1",
      accent: "#6B8CAE",
      background: "#0A0A0A",
      backgroundAlt: "#1A1A1A",
      surface: "#252525",
      text: "#FFFFFF",
      textSecondary: "#B0B0B0", // Silver
      textMuted: "#888888",
      border: "rgba(107, 140, 174, 0.3)",
      borderHover: "#6B8CAE",
    },
    fonts: {
      headline: "'Manrope', sans-serif",
      accent: "'Cormorant Garamond', Georgia, serif",
      body: "'Inter', sans-serif",
    },
    style: {
      headingWeight: "600",
      headingLetterSpacing: "-0.02em",
      headingTextTransform: "uppercase",
      headingLineHeight: "1.1",
      bodyWeight: "400",
      bodyLetterSpacing: "0",
      borderRadius: "0",
      borderWidth: "1px",
      dividerWidth: "1px",
      dividerColor: "#6B8CAE",
      buttonStyle: "outline",
      imageFilter: "grayscale(100%)",
      shadowStyle: "subtle",
      animationStyle: "smooth",
      transitionEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      sectionSpacing: "clamp(4rem, 10vh, 8rem)",
    },
  },

  classic: {
    id: "classic",
    name: "Classic",
    description: "Warm, Elegant & Zeitlos",
    isDark: false,
    colors: {
      primary: "#C4A87C",
      secondary: "#A68B5B",
      accent: "#C4A87C",
      background: "#F5F0EB",
      backgroundAlt: "#FFFDF9",
      surface: "#FFFFFF",
      text: "#2C2C2C",
      textSecondary: "#3A3A3A",
      textMuted: "#7A7A7A",
      border: "rgba(196, 168, 124, 0.25)",
      borderHover: "#C4A87C",
    },
    fonts: {
      headline: "'Cormorant Garamond', Georgia, serif",
      accent: "'Great Vibes', cursive",
      body: "'Josefin Sans', sans-serif",
    },
    style: {
      headingWeight: "300",
      headingLetterSpacing: "0.01em",
      headingTextTransform: "none",
      headingLineHeight: "1.2",
      bodyWeight: "300",
      bodyLetterSpacing: "0",
      borderRadius: "0",
      borderWidth: "1px",
      dividerWidth: "1px",
      dividerColor: "#C4A87C",
      buttonStyle: "outline",
      imageFilter: "none",
      shadowStyle: "soft",
      animationStyle: "smooth",
      transitionEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      sectionSpacing: "clamp(4rem, 10vh, 8rem)",
    },
  },
};

// ============================================
// THEME ORDER - Für Switcher (Themes, keine Fake-Themes mehr)
// ============================================
export const themeOrder = [
  "editorial",
  "botanical", 
  "contemporary",
  "luxe",
  "neon",
  "video",
  "classic",
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get theme by id
export const getTheme = (themeId) => {
  return marketingThemes[themeId] || marketingThemes.editorial;
};

// Check if theme is dark
export const isDarkTheme = (themeId) => {
  const theme = marketingThemes[themeId];
  return theme?.isDark || false;
};

// Get all dark themes
export const getDarkThemes = () => {
  return themeOrder.filter(id => marketingThemes[id]?.isDark);
};

// Get all light themes
export const getLightThemes = () => {
  return themeOrder.filter(id => !marketingThemes[id]?.isDark);
};

export default marketingThemes;
