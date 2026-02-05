// src/themes/citrus/CitrusDemo.js
// Demo Page for Citrus Theme - Standalone preview without Supabase
import React from 'react';
import GlobalStyles from './GlobalStyles';
import CitrusHero from './CitrusHero';
import CitrusCountdown from './CitrusCountdown';
import CitrusLoveStory from './CitrusLoveStory';
import CitrusRSVP from './CitrusRSVP';
import CitrusLocation from './CitrusLocation';
import CitrusTimeline from './CitrusTimeline';
import CitrusFooter from './CitrusFooter';

// ============================================
// DEMO DATA
// ============================================
const DEMO_DATA = {
  coupleNames: 'Lisa & Marco',
  date: '15. August 2026',
  tagline: 'Zitronensüß & Limettenfrisch',
  targetDate: '2026-08-15T14:00:00',
  hashtag: '#LisaMarco2026',
  email: 'hochzeit@lisamarco.de',
  deadline: '01. Juni 2026',

  story: [
    {
      date: 'Juli 2019',
      title: 'Urlaub in Italien',
      description: 'In einem kleinen Café an der Amalfiküste trafen wir uns zum ersten Mal. Die Zitronen dufteten, und es war um uns geschehen.',
      icon: '🍋'
    },
    {
      date: 'September 2019',
      title: 'Das erste Date',
      description: 'Zurück in Hamburg: ein Picknick im Stadtpark mit selbstgemachter Limonade.',
      icon: '🧺'
    },
    {
      date: 'März 2021',
      title: 'Zusammen gezogen',
      description: 'Eine Wohnung mit kleinem Balkon - perfekt für unsere eigenen Zitronenbäumchen!',
      icon: '🏡'
    },
    {
      date: 'August 2025',
      title: 'Der Antrag',
      description: 'Bei Sonnenuntergang in Sorrento, unter einem blühenden Zitronenbaum.',
      icon: '💍'
    }
  ],

  locations: [
    {
      type: 'Trauung',
      name: 'Alte Gärtnerei Hamburg',
      address: 'Blumenweg 42',
      city: '22765 Hamburg',
      time: '14:00 Uhr',
      description: 'Die freie Trauung findet im wunderschönen Glashaus zwischen Zitrusbäumen statt.',
      mapUrl: 'https://maps.google.com'
    },
    {
      type: 'Feier',
      name: 'Restaurant Limone',
      address: 'Hafenstraße 89',
      city: '22767 Hamburg',
      time: '16:00 Uhr',
      description: 'Mediterranes Flair direkt am Wasser - hier feiern wir bis in die Nacht!',
      mapUrl: 'https://maps.google.com'
    }
  ],

  schedule: [
    { time: '14:00', title: 'Empfang', description: 'Limoncello-Spritz & Antipasti im Garten', icon: '🥂' },
    { time: '14:30', title: 'Trauung', description: 'Freie Trauung unter dem Zitronenbaum', icon: '💒' },
    { time: '15:30', title: 'Gratulation', description: 'Zeit für Glückwünsche und Fotos', icon: '📸' },
    { time: '16:30', title: 'Kaffee & Torte', description: 'Limetten-Mascarpone-Torte und mehr', icon: '🍰' },
    { time: '18:30', title: 'Abendessen', description: 'Italienisches 4-Gänge-Menü', icon: '🍝' },
    { time: '21:00', title: 'Eröffnungstanz', description: 'Wir eröffnen die Tanzfläche', icon: '💃' },
    { time: '22:00', title: 'Party!', description: 'Tanzen unter Lichterketten', icon: '🎉' }
  ]
};

// ============================================
// DEMO COMPONENT
// ============================================
const CitrusDemo = () => {
  const handleRSVPSubmit = async (formData) => {
    console.log('RSVP submitted:', formData);
    // In demo mode, just log the data
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <>
      <GlobalStyles />

      <CitrusHero
        coupleNames={DEMO_DATA.coupleNames}
        date={DEMO_DATA.date}
        tagline={DEMO_DATA.tagline}
      />

      <CitrusCountdown
        targetDate={DEMO_DATA.targetDate}
        title="Noch so lange..."
      />

      <CitrusLoveStory
        title="Unsere Geschichte"
        subtitle="Von Zitronen und der Liebe"
        story={DEMO_DATA.story}
      />

      <CitrusTimeline
        title="Der große Tag"
        subtitle="Was euch erwartet"
        schedule={DEMO_DATA.schedule}
      />

      <CitrusLocation
        title="Wo wir feiern"
        locations={DEMO_DATA.locations}
      />

      <CitrusRSVP
        title="Sagt uns Bescheid"
        subtitle="Wir freuen uns auf euch!"
        deadline={DEMO_DATA.deadline}
        onSubmit={handleRSVPSubmit}
      />

      <CitrusFooter
        coupleNames={DEMO_DATA.coupleNames}
        date={DEMO_DATA.date}
        hashtag={DEMO_DATA.hashtag}
        email={DEMO_DATA.email}
      />
    </>
  );
};

export default CitrusDemo;
