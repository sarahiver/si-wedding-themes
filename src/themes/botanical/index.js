// Botanical Fruit Theme - Index
export { default as WeddingPage } from './WeddingPage';
export { default as GlobalStyles } from './GlobalStyles';
export { default as TreeSVG } from './TreeSVG';
export { default as ContentBox } from './ContentBox';
export { default as AdminDashboard } from './AdminDashboard';

// Content exports
export { default as HeroContent } from './contents/HeroContent';
export { default as CountdownContent } from './contents/CountdownContent';
export { default as StoryContent } from './contents/StoryContent';
export { default as GalleryContent } from './contents/GalleryContent';
export { default as TimelineContent } from './contents/TimelineContent';
export { default as RSVPContent } from './contents/RSVPContent';
export { default as FAQContent } from './contents/FAQContent';
export { default as GiftsContent } from './contents/GiftsContent';

// Theme config
export const themeConfig = {
  id: 'botanical-fruit',
  name: 'Botanical Fruit',
  description: 'Ein architektonischer Baum mit Früchten als Navigation - klicke oder scrolle durch die Inhalte',
  preview: '/previews/botanical-fruit.jpg',
  colors: {
    primary: '#1a1a1a',
    secondary: '#666666',
    background: '#faf9f7',
  }
};
