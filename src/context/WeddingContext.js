// src/context/WeddingContext.js
import React, { createContext, useContext } from 'react';
import { useWeddingData, useSlugDetection } from '../hooks/useWeddingData';

const WeddingContext = createContext(null);
const DemoContext = createContext(null);

// Demo content for the demo page
const demoContent = {
  hero: { 
    tagline: 'Wir heiraten', 
    location_short: 'Hamburg',
    names: 'Pauli & Mo',
    date: '15. August 2026',
    background_image: null 
  },
  countdown: { 
    target_date: '2026-08-15T14:00:00', 
    title: 'Noch', 
    show_seconds: false 
  },
  lovestory: {
    title: 'Unsere Geschichte',
    subtitle: 'Wie alles begann',
    events: [
      { date: '2019', year: '2019', title: 'Das erste Treffen', text: 'Auf einer Gartenparty bei gemeinsamen Freunden haben wir uns kennengelernt. Ein zufälliges Gespräch wurde zum Beginn von allem.', description: 'Auf einer Gartenparty bei gemeinsamen Freunden haben wir uns kennengelernt.', image: null },
      { date: '2020', year: '2020', title: 'Der erste Urlaub', text: 'Zusammen nach Italien – Sonne, Pasta und endlose Gespräche. Wir wussten, das ist etwas Besonderes.', description: 'Zusammen nach Italien – Sonne, Pasta und endlose Gespräche.', image: null },
      { date: '2022', year: '2022', title: 'Zusammenziehen', text: 'Eine kleine Wohnung mit großem Balkon wurde unser erstes gemeinsames Zuhause.', description: 'Eine kleine Wohnung mit großem Balkon wurde unser erstes gemeinsames Zuhause.', image: null },
      { date: '2024', year: '2024', title: 'Die Verlobung', text: 'Am Strand bei Sonnenuntergang stellte Mo die große Frage – und Pauli sagte unter Freudentränen Ja.', description: 'Am Strand bei Sonnenuntergang stellte Mo die große Frage.', image: null },
    ],
  },
  timeline: {
    title: 'Ablauf',
    events: [
      { time: '14:00', title: 'Trauung', description: 'Standesamtliche Trauung', icon: '💒', location: 'Standesamt' },
      { time: '15:30', title: 'Sektempfang', description: 'Stoßt mit uns an!', icon: '🥂', location: 'Terrasse' },
      { time: '17:00', title: 'Paarfotos', description: 'Kurzer Spaziergang für Fotos', icon: '📸', location: 'Garten' },
      { time: '18:00', title: 'Dinner', description: 'Festliches 4-Gänge-Menü', icon: '🍽️', location: 'Festsaal' },
      { time: '21:00', title: 'Eröffnungstanz', description: 'Unser erster Tanz als Ehepaar', icon: '💃', location: 'Tanzfläche' },
      { time: '22:00', title: 'Party', description: 'Tanzen bis in die Nacht', icon: '🎉', location: 'Tanzfläche' },
    ],
  },
  locations: {
    title: 'Die Locations',
    locations: [
      { type: 'Trauung', name: 'Standesamt Mitte', address: 'Rathausmarkt 1, 20095 Hamburg', time: '14:00 Uhr', image: null, description: 'Im historischen Festsaal' },
      { type: 'Feier', name: 'Landhaus Walter', address: 'Elbchaussee 499, 22587 Hamburg', time: '15:30 Uhr', image: null, description: 'Mit Blick auf die Elbe' },
    ],
  },
  directions: { 
    title: 'Anfahrt', 
    address: 'Elbchaussee 499, 22587 Hamburg',
    options: [
      { icon: '🚗', title: 'Mit dem Auto', description: 'A7 Ausfahrt Hamburg-Othmarschen, dann der Elbchaussee folgen. Parkplätze vorhanden.' },
      { icon: '🚇', title: 'Mit der Bahn', description: 'S1/S11 bis Blankenese, dann Bus 286 bis Teufelsbrück.' },
      { icon: '🚕', title: 'Mit dem Taxi', description: 'Etwa 25€ vom Hauptbahnhof.' },
    ] 
  },
  rsvp: { 
    title: 'RSVP', 
    subtitle: 'Bitte gebt uns bis zum 1. Juni Bescheid',
    description: 'Wir freuen uns auf eure Zusage!',
    deadline: '2026-06-01' 
  },
  dresscode: { 
    title: 'Dresscode', 
    subtitle: 'Festlich elegant', 
    code: 'Festlich elegant',
    description: 'Wir freuen uns auf festliche Kleidung. Herren gerne im Anzug, Damen im Cocktailkleid oder festlichen Outfit. Bitte vermeidet Weiß – das ist der Braut vorbehalten.', 
    colors: ['#2C3E50', '#8E44AD', '#27AE60'],
    dos: ['Anzug oder Sakko', 'Cocktailkleid', 'Festliche Farben'],
    donts: ['Weiß', 'Jeans', 'Turnschuhe']
  },
  gifts: { 
    title: 'Geschenke', 
    subtitle: 'Das größte Geschenk ist eure Anwesenheit',
    description: 'Eure Anwesenheit ist uns das Wichtigste. Wer uns dennoch etwas schenken möchte, kann gerne zu unserer Hochzeitsreise beitragen.',
    items: [] 
  },
  accommodations: { 
    title: 'Übernachtung', 
    description: 'Für unsere Gäste von weiter her haben wir Zimmerkontingente reserviert.',
    hotels: [
      { name: 'Hotel & Land', address: 'Elbchaussee 401, Hamburg', price: 'ab 120€/Nacht', code: 'PAULIMO26', url: '#' },
      { name: 'Gasthaus am Hafen', address: 'Hafenstraße 12, Hamburg', price: 'ab 89€/Nacht', code: 'HOCHZEIT26', url: '#' },
    ] 
  },
  witnesses: { 
    title: 'Trauzeugen', 
    persons: [
      { name: 'Lisa Müller', role: 'Trauzeugin', phone: '+49 170 1234567', email: 'lisa@example.com', image: null },
      { name: 'Max Schmidt', role: 'Trauzeuge', phone: '+49 171 9876543', email: 'max@example.com', image: null },
    ]
  },
  gallery: { 
    title: 'Galerie', 
    images: [] 
  },
  musicwishes: { 
    title: 'Musikwünsche', 
    description: 'Welche Songs dürfen auf unserer Hochzeit nicht fehlen? Teilt uns eure Lieblingssongs mit!' 
  },
  guestbook: { 
    title: 'Gästebuch', 
    description: 'Hinterlasst uns eine liebe Nachricht, einen Wunsch oder einen guten Rat für unsere gemeinsame Zukunft.' 
  },
  faq: { 
    title: 'FAQ', 
    questions: [
      { question: 'Kann ich jemanden mitbringen?', answer: 'Bitte sprecht uns vorher an, da wir eine begrenzte Gästezahl haben.' },
      { question: 'Gibt es vegetarisches Essen?', answer: 'Ja! Bitte gebt bei der RSVP eure Ernährungswünsche an.' },
      { question: 'Sind Kinder willkommen?', answer: 'Wir lieben Kinder! Bitte gebt bei der RSVP an, ob ihr mit Kindern kommt.' },
      { question: 'Wann beginnt die Party?', answer: 'Nach dem Abendessen gegen 21 Uhr starten wir mit dem Eröffnungstanz.' },
    ]
  },
  weddingabc: { 
    title: 'Hochzeits-ABC', 
    entries: [
      { letter: 'A', title: 'Anfahrt', text: 'Alle Infos zur Anreise findet ihr unter "Anfahrt".' },
      { letter: 'B', title: 'Blumen', text: 'Bitte bringt keine Blumen mit – wir haben bereits wunderschöne Deko.' },
      { letter: 'D', title: 'Dresscode', text: 'Festlich elegant – Details unter "Dresscode".' },
      { letter: 'F', title: 'Fotos', text: 'Unser Fotograf hält die schönsten Momente fest. Eure Schnappschüsse könnt ihr gerne hochladen!' },
      { letter: 'G', title: 'Geschenke', text: 'Eure Anwesenheit ist unser größtes Geschenk.' },
      { letter: 'K', title: 'Kinder', text: 'Kinder sind herzlich willkommen!' },
      { letter: 'P', title: 'Parken', text: 'Kostenlose Parkplätze sind ausreichend vorhanden.' },
      { letter: 'T', title: 'Taxi', text: 'Für die sichere Heimfahrt haben wir einen Fahrdienst organisiert.' },
    ]
  },
  photoupload: { 
    title: 'Eure Fotos', 
    description: 'Teilt eure schönsten Momente mit uns! Ladet eure Fotos und Videos hier hoch.' 
  },
  footer: { 
    names: 'Pauli & Mo', 
    tagline: 'Wir freuen uns auf euch!', 
    hashtag: '#PauliUndMo2026' 
  },
};

export function DemoProvider({ children }) {
  const value = {
    project: { id: 'demo', slug: '', status: 'live', couple_names: 'Pauli & Mo', active_components: ['all'] },
    content: demoContent,
    isLoading: false,
    error: null,
    getContent: (name) => demoContent[name] || {},
    isComponentActive: () => true,
    getCustomStyles: () => ({}),
    status: 'live',
    theme: 'editorial',
    coupleNames: 'Pauli & Mo',
    weddingDate: '2026-08-15',
    slug: '',
    projectId: null,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function WeddingProvider({ children, slug: propSlug }) {
  const detectedSlug = useSlugDetection();
  const slug = propSlug || detectedSlug;
  const weddingData = useWeddingData(slug);

  return (
    <WeddingContext.Provider value={weddingData}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const weddingContext = useContext(WeddingContext);
  const demoContext = useContext(DemoContext);
  
  // Use wedding context if available, otherwise demo context
  const context = weddingContext || demoContext;
  
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider or DemoProvider');
  }
  
  return context;
}

export { DemoContext };
export default WeddingContext;
