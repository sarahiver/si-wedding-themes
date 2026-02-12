// Theme Definitions - EXAKT wie in den Wedding Website Themes

export const themes = {
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    description: 'Zeitlose Magazin-Ästhetik',
    fonts: {
      heading: "'Instrument Serif', Georgia, serif",
      body: "'Inter', -apple-system, sans-serif",
    },
    colors: {
      bg: '#FFFFFF',
      bgAlt: '#FAFAFA',
      text: '#1A1A1A',
      textMuted: '#666666',
      accent: '#000000',
      border: '#E0E0E0',
    },
  },

  botanical: {
    id: 'botanical',
    name: 'Botanical',
    description: 'Organisch & Natürlich',
    fonts: {
      heading: "'Playfair Display', Georgia, serif",
      body: "'Lato', -apple-system, sans-serif",
    },
    colors: {
      bg: '#F5F1EB',
      bgAlt: '#FAF8F5',
      text: '#2D3B2D',
      textMuted: '#5A6B5A',
      accent: '#8B9D83',
      border: 'rgba(139, 157, 131, 0.3)',
    },
  },

  contemporary: {
    id: 'contemporary',
    name: 'Contemporary',
    description: 'Modern & Playful',
    fonts: {
      heading: "'Space Grotesk', sans-serif",
      body: "'Space Grotesk', sans-serif",
    },
    colors: {
      bg: '#FAFAFA',
      bgAlt: '#F5F5F5',
      text: '#0D0D0D',
      textMuted: 'rgba(13,13,13,0.6)',
      accent: '#FF6B6B',
      accent2: '#4ECDC4',
      accent3: '#FFE66D',
      border: '#0D0D0D',
    },
  },

  luxe: {
    id: 'luxe',
    name: 'Luxe',
    description: 'Opulent & Glamourös',
    fonts: {
      heading: "'Cormorant Garamond', Georgia, serif",
      body: "'Montserrat', -apple-system, sans-serif",
    },
    colors: {
      bg: '#FFFFFF',
      bgAlt: '#FDFCFA',
      text: '#5A5A5A',
      textMuted: '#9A9A9A',
      accent: '#C8B88A',
      border: '#ECEAE6',
    },
  },

  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Bold & Digital',
    fonts: {
      heading: "'Space Grotesk', sans-serif",
      body: "'Space Grotesk', sans-serif",
    },
    colors: {
      bg: '#0a0a0f',
      bgAlt: '#12121a',
      text: '#FFFFFF',
      textMuted: 'rgba(255,255,255,0.6)',
      accent: '#00ffff',
      accent2: '#ff00ff',
      border: 'rgba(0, 255, 255, 0.3)',
    },
  },

  video: {
    id: 'video',
    name: 'Video',
    description: 'Cineastisch & Dramatisch',
    fonts: {
      heading: "'Cormorant Garamond', Georgia, serif",
      body: "'Inter', -apple-system, sans-serif",
    },
    colors: {
      bg: '#FAF8F5',
      bgAlt: '#F5F3F0',
      text: '#1A1A1A',
      textMuted: '#666666',
      accent: '#B8976A',
      border: '#E8E4DE',
    },
  },

  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Warm & Zeitlos',
    fonts: {
      heading: "'Cormorant Garamond', Georgia, serif",
      body: "'Josefin Sans', -apple-system, sans-serif",
    },
    colors: {
      bg: '#F5F0EB',
      bgAlt: '#FFFDF9',
      text: '#3A3A3A',
      textMuted: '#7A7A7A',
      accent: '#C4A87C',
      border: 'rgba(196, 168, 124, 0.25)',
    },
  },
};

export const themeOrder = ['editorial', 'botanical', 'contemporary', 'luxe', 'neon', 'video', 'classic'];
export const isDarkTheme = (id) => id === 'neon';
export const getTheme = (id) => themes[id] || themes.editorial;

export default themes;
