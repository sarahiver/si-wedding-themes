-- ============================================
-- DEMO PROJECTS FOR ALL THEMES
-- Run this in Supabase SQL Editor
-- ============================================
-- Themes: botanical, editorial, contemporary, luxe, neon, video
-- All password protected with: 7054
-- Status: demo
-- All components active
-- ============================================

-- First, delete existing demo projects (if any)
DELETE FROM project_content WHERE project_id IN (
  SELECT id FROM projects WHERE slug IN (
    'demo-botanical', 'demo-editorial', 'demo-contemporary',
    'demo-luxe', 'demo-neon', 'demo-video'
  )
);
DELETE FROM projects WHERE slug IN (
  'demo-botanical', 'demo-editorial', 'demo-contemporary',
  'demo-luxe', 'demo-neon', 'demo-video'
);

-- ============================================
-- 1. BOTANICAL - Emma & Liam (Classic English)
-- ============================================
INSERT INTO projects (
  slug, theme, status, couple_names, wedding_date, location,
  hashtag, active_components, password_protected
) VALUES (
  'demo-botanical', 'botanical', 'demo', 'Emma & Liam', '2025-06-21', 'English Garden Estate, London',
  '#EmmaLiamForever',
  ARRAY['hero', 'countdown', 'lovestory', 'timeline', 'locations', 'directions', 'accommodations', 'dresscode', 'rsvp', 'gallery', 'photoupload', 'guestbook', 'musicwishes', 'gifts', 'witnesses', 'faq', 'weddingabc'],
  true
);

-- ============================================
-- 2. EDITORIAL - Sofia & Alessandro (Italian)
-- ============================================
INSERT INTO projects (
  slug, theme, status, couple_names, wedding_date, location,
  hashtag, active_components, password_protected
) VALUES (
  'demo-editorial', 'editorial', 'demo', 'Sofia & Alessandro', '2025-09-13', 'Villa Cimbrone, Ravello',
  '#SofiaAlessandro2025',
  ARRAY['hero', 'countdown', 'lovestory', 'timeline', 'locations', 'directions', 'accommodations', 'dresscode', 'rsvp', 'gallery', 'photoupload', 'guestbook', 'musicwishes', 'gifts', 'witnesses', 'faq', 'weddingabc'],
  true
);

-- ============================================
-- 3. CONTEMPORARY - Yuki & Kenji (Japanese)
-- ============================================
INSERT INTO projects (
  slug, theme, status, couple_names, wedding_date, location,
  hashtag, active_components, password_protected
) VALUES (
  'demo-contemporary', 'contemporary', 'demo', 'Yuki & Kenji', '2025-04-05', 'Tokyo Garden Palace',
  '#YukiKenji',
  ARRAY['hero', 'countdown', 'lovestory', 'timeline', 'locations', 'directions', 'accommodations', 'dresscode', 'rsvp', 'gallery', 'photoupload', 'guestbook', 'musicwishes', 'gifts', 'witnesses', 'faq', 'weddingabc'],
  true
);

-- ============================================
-- 4. LUXE - Charlotte & James (British Aristocratic)
-- ============================================
INSERT INTO projects (
  slug, theme, status, couple_names, wedding_date, location,
  hashtag, active_components, password_protected
) VALUES (
  'demo-luxe', 'luxe', 'demo', 'Charlotte & James', '2025-12-31', 'Blenheim Palace, Oxfordshire',
  '#CharlotteAndJames',
  ARRAY['hero', 'countdown', 'lovestory', 'timeline', 'locations', 'directions', 'accommodations', 'dresscode', 'rsvp', 'gallery', 'photoupload', 'guestbook', 'musicwishes', 'gifts', 'witnesses', 'faq', 'weddingabc'],
  true
);

-- ============================================
-- 5. NEON - Alex & Jordan (Same-Sex, Modern)
-- ============================================
INSERT INTO projects (
  slug, theme, status, couple_names, wedding_date, location,
  hashtag, active_components, password_protected
) VALUES (
  'demo-neon', 'neon', 'demo', 'Alex & Jordan', '2025-08-08', 'The Neon Factory, Berlin',
  '#AlexJordan808',
  ARRAY['hero', 'countdown', 'lovestory', 'timeline', 'locations', 'directions', 'accommodations', 'dresscode', 'rsvp', 'gallery', 'photoupload', 'guestbook', 'musicwishes', 'gifts', 'witnesses', 'faq', 'weddingabc'],
  true
);

-- ============================================
-- 6. VIDEO - María & Carlos (Spanish)
-- ============================================
INSERT INTO projects (
  slug, theme, status, couple_names, wedding_date, location,
  hashtag, active_components, password_protected
) VALUES (
  'demo-video', 'video', 'demo', 'María & Carlos', '2025-07-19', 'Finca La Concepción, Málaga',
  '#MariaCarlos2025',
  ARRAY['hero', 'countdown', 'lovestory', 'timeline', 'locations', 'directions', 'accommodations', 'dresscode', 'rsvp', 'gallery', 'photoupload', 'guestbook', 'musicwishes', 'gifts', 'witnesses', 'faq', 'weddingabc'],
  true
);

-- ============================================
-- SET PASSWORDS (via RPC function)
-- Password: 7054
-- ============================================
SELECT set_project_password(id, '7054') FROM projects WHERE slug = 'demo-botanical';
SELECT set_project_password(id, '7054') FROM projects WHERE slug = 'demo-editorial';
SELECT set_project_password(id, '7054') FROM projects WHERE slug = 'demo-contemporary';
SELECT set_project_password(id, '7054') FROM projects WHERE slug = 'demo-luxe';
SELECT set_project_password(id, '7054') FROM projects WHERE slug = 'demo-neon';
SELECT set_project_password(id, '7054') FROM projects WHERE slug = 'demo-video';

-- ============================================
-- CONTENT FOR BOTANICAL
-- ============================================
DO $$
DECLARE
  proj_id UUID;
BEGIN
  SELECT id INTO proj_id FROM projects WHERE slug = 'demo-botanical';

  -- Hero
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'hero', '{
    "tagline": "We''re Getting Married",
    "location_short": "English Garden Estate",
    "background_image": "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920",
    "background_video": ""
  }'::jsonb);

  -- Countdown
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'countdown', '{
    "title": "Days Until Forever",
    "target_date": "2025-06-21T14:00:00",
    "show_seconds": true
  }'::jsonb);

  -- Love Story
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'lovestory', '{
    "title": "Our Love Story",
    "subtitle": "How we found each other",
    "events": [
      {
        "date": "2019-03-15",
        "title": "The First Glance",
        "description": "We met at a friend''s garden party. Emma was arranging flowers when Liam walked in. Our eyes met across the roses.",
        "image": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800"
      },
      {
        "date": "2019-07-20",
        "title": "First Date",
        "description": "A picnic in Hyde Park. Liam brought sandwiches, Emma brought her grandmother''s lemonade recipe. We talked until sunset.",
        "image": "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800"
      },
      {
        "date": "2021-12-24",
        "title": "The Proposal",
        "description": "Under the Christmas tree, surrounded by fairy lights. Liam got down on one knee. Through happy tears, Emma said yes.",
        "image": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800"
      }
    ]
  }'::jsonb);

  -- Timeline
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'timeline', '{
    "title": "Wedding Day",
    "events": [
      {"time": "14:00", "title": "Ceremony", "description": "Exchange of vows in the rose garden", "icon": "rings"},
      {"time": "15:30", "title": "Drinks Reception", "description": "Champagne and canapés on the terrace", "icon": "champagne"},
      {"time": "17:00", "title": "Wedding Breakfast", "description": "Three-course meal in the orangery", "icon": "dinner"},
      {"time": "20:00", "title": "First Dance", "description": "Under the stars in the garden marquee", "icon": "music"},
      {"time": "21:00", "title": "Party", "description": "Dance the night away", "icon": "party"},
      {"time": "00:00", "title": "Farewell", "description": "Sparkler send-off", "icon": "sparkles"}
    ]
  }'::jsonb);

  -- Locations
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'locations', '{
    "title": "The Venue",
    "locations": [
      {
        "name": "English Garden Estate",
        "type": "Ceremony & Reception",
        "address": "Garden Lane, Richmond, London TW10 6QX",
        "description": "A stunning Georgian manor house with award-winning gardens",
        "image": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
        "maps_url": "https://goo.gl/maps/example"
      }
    ]
  }'::jsonb);

  -- Directions
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'directions', '{
    "title": "Getting There",
    "address": "Garden Lane, Richmond, London TW10 6QX",
    "description": "The estate is easily accessible from central London",
    "options": [
      {"type": "car", "title": "By Car", "description": "Free parking available on site. 30 minutes from central London via A316."},
      {"type": "train", "title": "By Train", "description": "Richmond Station (District Line) then 10 min taxi ride."},
      {"type": "taxi", "title": "Taxi", "description": "We recommend booking Addison Lee. Use code EMMALIAM for 10% off."}
    ]
  }'::jsonb);

  -- Accommodations
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'accommodations', '{
    "title": "Where to Stay",
    "description": "We have arranged special rates at these nearby hotels",
    "hotels": [
      {
        "name": "The Richmond Hill Hotel",
        "stars": 4,
        "distance": "5 min drive",
        "price": "from £150/night",
        "booking_url": "https://example.com",
        "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "code": "EMMALIAM2025"
      },
      {
        "name": "The Bingham Riverhouse",
        "stars": 5,
        "distance": "10 min drive",
        "price": "from £220/night",
        "booking_url": "https://example.com",
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
      }
    ]
  }'::jsonb);

  -- Dresscode
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'dresscode', '{
    "title": "Dress Code",
    "code": "Garden Party Elegant",
    "description": "Think elegant summer garden party. Light fabrics, soft colours, and comfortable shoes for the lawn.",
    "colors": ["#809671", "#D4AF37", "#F5F5DC", "#FFFFFF"],
    "dos": ["Floral prints welcome", "Light summer fabrics", "Comfortable heels or wedges"],
    "donts": ["No stilettos (lawn)", "No black (not a funeral!)", "No white (reserved for the bride)"]
  }'::jsonb);

  -- RSVP
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'rsvp', '{
    "title": "RSVP",
    "description": "Please let us know by 1st May 2025",
    "deadline": "2025-05-01",
    "allow_plus_one": true,
    "dietary_question": true,
    "custom_question": "Any song requests for the DJ?"
  }'::jsonb);

  -- Gallery
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'gallery', '{
    "title": "Our Moments",
    "images": [
      {"url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", "caption": "Our engagement shoot"},
      {"url": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800", "caption": "That summer in Cornwall"},
      {"url": "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800", "caption": "Picnic in the park"},
      {"url": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800", "caption": "Dancing in the rain"},
      {"url": "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800", "caption": "Holiday in Scotland"},
      {"url": "https://images.unsplash.com/photo-1537907510278-5ebb8e1e6a47?w=800", "caption": "Christmas 2023"}
    ]
  }'::jsonb);

  -- Gifts
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'gifts', '{
    "title": "Gift Registry",
    "description": "Your presence is the greatest gift. If you wish to give something, we have a small registry or a honeymoon fund.",
    "type": "mixed",
    "honeymoon_fund": {
      "enabled": true,
      "title": "Honeymoon Fund",
      "description": "Help us explore the Scottish Highlands",
      "paypal": "emmaliam@example.com"
    },
    "items": [
      {"id": "1", "name": "Le Creuset Casserole", "price": 250, "image": "https://images.unsplash.com/photo-1584990347449-a2d4e2f7bc7f?w=400"},
      {"id": "2", "name": "Dyson Vacuum", "price": 400, "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"},
      {"id": "3", "name": "KitchenAid Mixer", "price": 350, "image": "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400"}
    ]
  }'::jsonb);

  -- Witnesses
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'witnesses', '{
    "title": "Wedding Party",
    "persons": [
      {
        "name": "Sarah Thompson",
        "role": "Maid of Honour",
        "relation": "Best friend since university",
        "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        "phone": "+44 7700 900123",
        "email": "sarah@example.com"
      },
      {
        "name": "Oliver Brown",
        "role": "Best Man",
        "relation": "Childhood friend",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        "phone": "+44 7700 900456",
        "email": "oliver@example.com"
      }
    ]
  }'::jsonb);

  -- FAQ
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'faq', '{
    "title": "Questions & Answers",
    "questions": [
      {"question": "Can I bring my children?", "answer": "We love your little ones, but this will be an adults-only celebration. We hope you understand!"},
      {"question": "Is there parking?", "answer": "Yes, free parking is available on site for all guests."},
      {"question": "What if it rains?", "answer": "The ceremony will be held in the orangery if the weather doesn''t cooperate. The party goes on!"},
      {"question": "Are plus ones allowed?", "answer": "If your invitation says ''and guest'', absolutely! Otherwise, we''ve kept numbers tight."},
      {"question": "When should I arrive?", "answer": "Please arrive by 13:30 for a 14:00 ceremony start."}
    ]
  }'::jsonb);

  -- Wedding ABC
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'weddingabc', '{
    "title": "Wedding A-Z",
    "entries": [
      {"letter": "A", "title": "Arrival", "description": "Please arrive by 13:30"},
      {"letter": "B", "title": "Bouquet Toss", "description": "Ladies, be ready around 22:00!"},
      {"letter": "C", "title": "Confetti", "description": "Biodegradable petals will be provided"},
      {"letter": "D", "title": "Dancing", "description": "Starts after the first dance at 20:00"},
      {"letter": "P", "title": "Photos", "description": "Our photographer is @janedoephotography"},
      {"letter": "S", "title": "Speeches", "description": "During the wedding breakfast"},
      {"letter": "U", "title": "Unplugged", "description": "Please keep phones away during the ceremony"}
    ]
  }'::jsonb);

  -- Guestbook
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'guestbook', '{
    "title": "Guestbook",
    "description": "Leave us a message or a memory"
  }'::jsonb);

  -- Music Wishes
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'musicwishes', '{
    "title": "Song Requests",
    "description": "What song will get you on the dance floor?"
  }'::jsonb);

  -- Photo Upload
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'photoupload', '{
    "title": "Share Your Photos",
    "description": "Upload your photos from the day"
  }'::jsonb);

  -- Footer
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'footer', '{
    "names": "Emma & Liam",
    "tagline": "21st June 2025",
    "hashtag": "#EmmaLiamForever"
  }'::jsonb);

END $$;

-- ============================================
-- CONTENT FOR EDITORIAL
-- ============================================
DO $$
DECLARE
  proj_id UUID;
BEGIN
  SELECT id INTO proj_id FROM projects WHERE slug = 'demo-editorial';

  -- Hero
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'hero', '{
    "tagline": "Un Amore Senza Fine",
    "location_short": "Ravello, Italia",
    "background_image": "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1920",
    "background_video": ""
  }'::jsonb);

  -- Countdown
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'countdown', '{
    "title": "Giorni Fino Al Sì",
    "target_date": "2025-09-13T16:00:00",
    "show_seconds": false
  }'::jsonb);

  -- Love Story
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'lovestory', '{
    "title": "La Nostra Storia",
    "subtitle": "Un viaggio di amore",
    "events": [
      {
        "date": "2018-08-20",
        "title": "Firenze",
        "description": "We met at a gallery opening in Florence. Sofia was admiring a Botticelli, Alessandro was admiring her.",
        "image": "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800"
      },
      {
        "date": "2020-02-14",
        "title": "Roma",
        "description": "Valentine''s Day at the Trevi Fountain. We threw coins and wished for forever.",
        "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800"
      },
      {
        "date": "2024-06-01",
        "title": "La Proposta",
        "description": "On the terrace of Villa Cimbrone at sunset, Alessandro asked Sofia to be his wife.",
        "image": "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800"
      }
    ]
  }'::jsonb);

  -- Timeline
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'timeline', '{
    "title": "Il Programma",
    "events": [
      {"time": "16:00", "title": "Cerimonia", "description": "Nella terrazza con vista mare", "icon": "rings"},
      {"time": "17:30", "title": "Aperitivo", "description": "Prosecco e antipasti nel giardino", "icon": "champagne"},
      {"time": "19:30", "title": "Cena", "description": "Menu degustazione nella sala principale", "icon": "dinner"},
      {"time": "22:00", "title": "Primo Ballo", "description": "Sotto le stelle", "icon": "music"},
      {"time": "23:00", "title": "Festa", "description": "Musica e balli fino a tardi", "icon": "party"}
    ]
  }'::jsonb);

  -- Locations
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'locations', '{
    "title": "La Location",
    "locations": [
      {
        "name": "Villa Cimbrone",
        "type": "Cerimonia e Ricevimento",
        "address": "Via Santa Chiara 26, 84010 Ravello SA, Italia",
        "description": "Una villa storica con i giardini più belli della Costiera Amalfitana",
        "image": "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800",
        "maps_url": "https://goo.gl/maps/example"
      }
    ]
  }'::jsonb);

  -- Directions
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'directions', '{
    "title": "Come Arrivare",
    "address": "Via Santa Chiara 26, 84010 Ravello SA, Italia",
    "description": "Ravello si trova sulla Costiera Amalfitana",
    "options": [
      {"type": "plane", "title": "In Aereo", "description": "Vola a Napoli (NAP), poi 75 min in auto o shuttle."},
      {"type": "car", "title": "In Auto", "description": "Da Napoli: A3 direzione Salerno, uscita Vietri sul Mare."},
      {"type": "shuttle", "title": "Shuttle", "description": "Abbiamo organizzato navette gratuite dall''aeroporto di Napoli."}
    ]
  }'::jsonb);

  -- Accommodations
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'accommodations', '{
    "title": "Dove Dormire",
    "description": "Hotel convenzionati nella zona",
    "hotels": [
      {
        "name": "Palazzo Avino",
        "stars": 5,
        "distance": "5 min a piedi",
        "price": "da €350/notte",
        "booking_url": "https://example.com",
        "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "code": "SOFIAALESSANDRO"
      },
      {
        "name": "Hotel Caruso",
        "stars": 5,
        "distance": "2 min a piedi",
        "price": "da €450/notte",
        "booking_url": "https://example.com",
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
      }
    ]
  }'::jsonb);

  -- Dresscode
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'dresscode', '{
    "title": "Dress Code",
    "code": "Black Tie Optional",
    "description": "Eleganza italiana sotto le stelle. Abiti lunghi per le signore, smoking o abito scuro per i signori.",
    "colors": ["#1a1a1a", "#D4AF37", "#F5F5DC", "#8B4513"],
    "dos": ["Abiti eleganti", "Colori classici", "Gioielli raffinati"],
    "donts": ["No jeans", "No sneakers", "No bianco (riservato alla sposa)"]
  }'::jsonb);

  -- RSVP
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'rsvp', '{
    "title": "Conferma Presenza",
    "description": "Per favore conferma entro il 1 Luglio 2025",
    "deadline": "2025-07-01",
    "allow_plus_one": true,
    "dietary_question": true,
    "custom_question": "Qualche intolleranza alimentare?"
  }'::jsonb);

  -- Gallery
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'gallery', '{
    "title": "I Nostri Momenti",
    "images": [
      {"url": "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800", "caption": "Firenze"},
      {"url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", "caption": "Roma"},
      {"url": "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800", "caption": "Ravello"},
      {"url": "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800", "caption": "Venezia"},
      {"url": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800", "caption": "Toscana"},
      {"url": "https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800", "caption": "Portofino"}
    ]
  }'::jsonb);

  -- Gifts
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'gifts', '{
    "title": "Lista Nozze",
    "description": "La vostra presenza è il regalo più bello. Se desiderate contribuire alla nostra luna di miele in Giappone:",
    "type": "honeymoon",
    "honeymoon_fund": {
      "enabled": true,
      "title": "Luna di Miele in Giappone",
      "description": "Aiutateci a scoprire Tokyo, Kyoto e le Alpi Giapponesi",
      "iban": "IT00X0000000000000000000000"
    },
    "items": []
  }'::jsonb);

  -- Witnesses
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'witnesses', '{
    "title": "Testimoni",
    "persons": [
      {
        "name": "Giulia Rossi",
        "role": "Testimone della Sposa",
        "relation": "Sorella di Sofia",
        "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        "phone": "+39 333 1234567",
        "email": "giulia@example.com"
      },
      {
        "name": "Marco Bianchi",
        "role": "Testimone dello Sposo",
        "relation": "Migliore amico",
        "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        "phone": "+39 333 7654321",
        "email": "marco@example.com"
      }
    ]
  }'::jsonb);

  -- FAQ
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'faq', '{
    "title": "Domande Frequenti",
    "questions": [
      {"question": "I bambini sono invitati?", "answer": "Questa sarà una celebrazione solo per adulti. Grazie per la comprensione!"},
      {"question": "C''è parcheggio?", "answer": "Sì, parcheggio gratuito disponibile. Navette dalla piazza principale."},
      {"question": "Che lingua si parlerà?", "answer": "Italiano e inglese. La cerimonia sarà bilingue."},
      {"question": "Posso portare un accompagnatore?", "answer": "Se il tuo invito include ''e accompagnatore'', certamente!"},
      {"question": "A che ora devo arrivare?", "answer": "Per favore arriva alle 15:30 per una cerimonia alle 16:00."}
    ]
  }'::jsonb);

  -- Wedding ABC
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'weddingabc', '{
    "title": "ABC del Matrimonio",
    "entries": [
      {"letter": "A", "title": "Arrivo", "description": "Per favore arriva alle 15:30"},
      {"letter": "B", "title": "Bouquet", "description": "Il lancio del bouquet sarà alle 23:00"},
      {"letter": "C", "title": "Cerimonia", "description": "Sulla terrazza panoramica"},
      {"letter": "F", "title": "Foto", "description": "Il nostro fotografo è @italianweddingphoto"},
      {"letter": "M", "title": "Menu", "description": "Menu degustazione con specialità locali"},
      {"letter": "T", "title": "Trasporti", "description": "Navette gratuite disponibili"}
    ]
  }'::jsonb);

  -- Guestbook, Music, Photos, Footer
  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'guestbook', '{"title": "Libro degli Ospiti", "description": "Lasciaci un messaggio"}'::jsonb),
  (proj_id, 'musicwishes', '{"title": "Richieste Musicali", "description": "Quale canzone ti farà ballare?"}'::jsonb),
  (proj_id, 'photoupload', '{"title": "Le Vostre Foto", "description": "Condividi i tuoi scatti"}'::jsonb),
  (proj_id, 'footer', '{"names": "Sofia & Alessandro", "tagline": "13 Settembre 2025", "hashtag": "#SofiaAlessandro2025"}'::jsonb);

END $$;

-- ============================================
-- CONTENT FOR CONTEMPORARY (Yuki & Kenji)
-- ============================================
DO $$
DECLARE
  proj_id UUID;
BEGIN
  SELECT id INTO proj_id FROM projects WHERE slug = 'demo-contemporary';

  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'hero', '{
    "tagline": "永遠の愛",
    "location_short": "Tokyo Garden Palace",
    "background_image": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920",
    "background_video": ""
  }'::jsonb),
  (proj_id, 'countdown', '{"title": "Days Until Our Wedding", "target_date": "2025-04-05T11:00:00", "show_seconds": false}'::jsonb),
  (proj_id, 'lovestory', '{
    "title": "Our Story",
    "subtitle": "From Tokyo to Forever",
    "events": [
      {"date": "2020-04-01", "title": "Cherry Blossoms", "description": "We met under the sakura trees in Ueno Park. A chance encounter that changed everything.", "image": "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800"},
      {"date": "2021-12-25", "title": "Kyoto Trip", "description": "Our first trip together to the ancient capital. We knew this was special.", "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800"},
      {"date": "2024-04-05", "title": "The Proposal", "description": "One year ago today, under the same sakura trees where we met, Kenji proposed.", "image": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800"}
    ]
  }'::jsonb),
  (proj_id, 'timeline', '{
    "title": "Schedule",
    "events": [
      {"time": "11:00", "title": "Ceremony", "description": "Traditional Shinto ceremony", "icon": "rings"},
      {"time": "12:30", "title": "Reception", "description": "Welcome drinks in the garden", "icon": "champagne"},
      {"time": "14:00", "title": "Lunch", "description": "Kaiseki cuisine", "icon": "dinner"},
      {"time": "17:00", "title": "After Party", "description": "Casual celebration", "icon": "party"}
    ]
  }'::jsonb),
  (proj_id, 'locations', '{
    "title": "Venue",
    "locations": [
      {"name": "Tokyo Garden Palace", "type": "Ceremony & Reception", "address": "1-7-5 Kudan-Minami, Chiyoda, Tokyo", "description": "A serene oasis in the heart of Tokyo with traditional Japanese gardens", "image": "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800", "maps_url": "https://goo.gl/maps/example"}
    ]
  }'::jsonb),
  (proj_id, 'directions', '{
    "title": "Access",
    "address": "1-7-5 Kudan-Minami, Chiyoda, Tokyo",
    "description": "Conveniently located near Kudanshita Station",
    "options": [
      {"type": "train", "title": "By Train", "description": "3 min walk from Kudanshita Station (Tozai, Hanzomon, Shinjuku Lines)"},
      {"type": "taxi", "title": "By Taxi", "description": "10 min from Tokyo Station. Show driver: 千代田区九段南1-7-5"}
    ]
  }'::jsonb),
  (proj_id, 'accommodations', '{
    "title": "Accommodations",
    "description": "Recommended hotels nearby",
    "hotels": [
      {"name": "Hotel New Otani", "stars": 5, "distance": "5 min by taxi", "price": "from ¥35,000/night", "booking_url": "https://example.com", "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"},
      {"name": "Imperial Hotel", "stars": 5, "distance": "10 min by taxi", "price": "from ¥45,000/night", "booking_url": "https://example.com", "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"}
    ]
  }'::jsonb),
  (proj_id, 'dresscode', '{
    "title": "Dress Code",
    "code": "Formal / 正装",
    "description": "Japanese formal wear or Western formal attire. Kimono welcome!",
    "colors": ["#FFFFFF", "#F5F5DC", "#D4AF37", "#1a1a1a"],
    "dos": ["Formal attire", "Kimono welcome", "Subtle elegance"],
    "donts": ["No casual wear", "No white for ladies", "No bright patterns"]
  }'::jsonb),
  (proj_id, 'rsvp', '{"title": "RSVP", "description": "Please respond by March 1st, 2025", "deadline": "2025-03-01", "allow_plus_one": true, "dietary_question": true, "custom_question": "Any dietary restrictions?"}'::jsonb),
  (proj_id, 'gallery', '{
    "title": "Gallery",
    "images": [
      {"url": "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800", "caption": "Sakura Season"},
      {"url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", "caption": "Kyoto"},
      {"url": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800", "caption": "Tokyo"},
      {"url": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800", "caption": "Our Travels"},
      {"url": "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800", "caption": "City Nights"},
      {"url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800", "caption": "Together"}
    ]
  }'::jsonb),
  (proj_id, 'gifts', '{"title": "Gifts", "description": "Your presence is our greatest gift. If you wish to give, please contribute to our honeymoon fund.", "type": "honeymoon", "honeymoon_fund": {"enabled": true, "title": "Honeymoon in Maldives", "description": "Help us relax after the celebrations"}, "items": []}'::jsonb),
  (proj_id, 'witnesses', '{
    "title": "Wedding Party",
    "persons": [
      {"name": "Sakura Tanaka", "role": "Maid of Honor", "relation": "Yuki''s sister", "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", "phone": "+81 90 1234 5678", "email": "sakura@example.com"},
      {"name": "Takeshi Yamamoto", "role": "Best Man", "relation": "Kenji''s best friend", "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", "phone": "+81 90 8765 4321", "email": "takeshi@example.com"}
    ]
  }'::jsonb),
  (proj_id, 'faq', '{
    "title": "FAQ",
    "questions": [
      {"question": "Will the ceremony be in Japanese?", "answer": "Yes, but English translation will be provided."},
      {"question": "Can I wear a kimono?", "answer": "Absolutely! We would be honored."},
      {"question": "Is there parking?", "answer": "Yes, underground parking available (¥500/hour)."},
      {"question": "What about shoes?", "answer": "You may need to remove shoes in some areas. Slippers provided."}
    ]
  }'::jsonb),
  (proj_id, 'weddingabc', '{"title": "Wedding A-Z", "entries": [{"letter": "A", "title": "Arrival", "description": "Please arrive by 10:30"}, {"letter": "K", "title": "Kimono", "description": "Rental services available on request"}, {"letter": "S", "title": "Sakura", "description": "Peak cherry blossom season!"}]}'::jsonb),
  (proj_id, 'guestbook', '{"title": "Guest Book", "description": "Leave us a message"}'::jsonb),
  (proj_id, 'musicwishes', '{"title": "Music Requests", "description": "What song would you like to hear?"}'::jsonb),
  (proj_id, 'photoupload', '{"title": "Photo Sharing", "description": "Share your photos from our day"}'::jsonb),
  (proj_id, 'footer', '{"names": "Yuki & Kenji", "tagline": "April 5th, 2025", "hashtag": "#YukiKenji"}'::jsonb);

END $$;

-- ============================================
-- CONTENT FOR LUXE (Charlotte & James)
-- ============================================
DO $$
DECLARE
  proj_id UUID;
BEGIN
  SELECT id INTO proj_id FROM projects WHERE slug = 'demo-luxe';

  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'hero', '{
    "tagline": "A New Year''s Eve Celebration",
    "location_short": "Blenheim Palace",
    "background_image": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920",
    "background_video": ""
  }'::jsonb),
  (proj_id, 'countdown', '{"title": "Countdown to Forever", "target_date": "2025-12-31T17:00:00", "show_seconds": true}'::jsonb),
  (proj_id, 'lovestory', '{
    "title": "Our Journey",
    "subtitle": "A tale of two hearts",
    "events": [
      {"date": "2017-06-15", "title": "Polo Match", "description": "We met at the Guards Polo Club. James was playing, Charlotte was cheering - though not for him. Yet.", "image": "https://images.unsplash.com/photo-1566985222267-d76645b4ee1e?w=800"},
      {"date": "2019-02-14", "title": "Paris", "description": "A Valentine''s surprise. James whisked Charlotte to Paris for dinner at the Ritz.", "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800"},
      {"date": "2024-06-15", "title": "The Question", "description": "Seven years to the day we met. At the same polo grounds, James finally asked. She said yes.", "image": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"}
    ]
  }'::jsonb),
  (proj_id, 'timeline', '{
    "title": "Order of the Day",
    "events": [
      {"time": "17:00", "title": "Ceremony", "description": "The Long Library", "icon": "rings"},
      {"time": "18:30", "title": "Champagne Reception", "description": "The Great Hall", "icon": "champagne"},
      {"time": "20:00", "title": "Dinner", "description": "Seven-course tasting menu", "icon": "dinner"},
      {"time": "23:30", "title": "Countdown", "description": "New Year''s Eve celebration", "icon": "party"},
      {"time": "00:00", "title": "First Dance & Fireworks", "description": "Ring in the New Year as Mr & Mrs", "icon": "sparkles"}
    ]
  }'::jsonb),
  (proj_id, 'locations', '{
    "title": "The Venue",
    "locations": [
      {"name": "Blenheim Palace", "type": "Ceremony & Reception", "address": "Woodstock, Oxfordshire OX20 1PP", "description": "A UNESCO World Heritage Site and birthplace of Sir Winston Churchill", "image": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800", "maps_url": "https://goo.gl/maps/example"}
    ]
  }'::jsonb),
  (proj_id, 'directions', '{
    "title": "Arrival",
    "address": "Woodstock, Oxfordshire OX20 1PP",
    "description": "90 minutes from London",
    "options": [
      {"type": "car", "title": "By Car", "description": "Valet parking provided. Simply pull up to the main entrance."},
      {"type": "train", "title": "By Train", "description": "Oxford Parkway, then 20 min taxi. Complimentary shuttle from station at 15:00 & 16:00."},
      {"type": "helicopter", "title": "By Helicopter", "description": "Helipad available by prior arrangement. Contact the estate office."}
    ]
  }'::jsonb),
  (proj_id, 'accommodations', '{
    "title": "Accommodations",
    "description": "We have reserved rooms at these prestigious establishments",
    "hotels": [
      {"name": "The Feathers Hotel", "stars": 5, "distance": "Woodstock Village", "price": "from £280/night", "booking_url": "https://example.com", "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", "code": "CHARLOTTEJAMES"},
      {"name": "The Bear Hotel", "stars": 4, "distance": "Woodstock Village", "price": "from £180/night", "booking_url": "https://example.com", "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", "code": "CHARLOTTEJAMES"}
    ]
  }'::jsonb),
  (proj_id, 'dresscode', '{
    "title": "Dress Code",
    "code": "Black Tie",
    "description": "Evening glamour befitting a New Year''s Eve celebration at a palace",
    "colors": ["#000000", "#D4AF37", "#1a1a2e", "#C0C0C0"],
    "dos": ["Floor-length gowns", "Dinner jacket / Tuxedo", "Diamonds are appropriate"],
    "donts": ["No lounge suits", "No cocktail dresses", "No white"]
  }'::jsonb),
  (proj_id, 'rsvp', '{"title": "RSVP", "description": "Kindly respond by 1st November 2025", "deadline": "2025-11-01", "allow_plus_one": true, "dietary_question": true, "custom_question": "Any special requirements?"}'::jsonb),
  (proj_id, 'gallery', '{
    "title": "Captured Moments",
    "images": [
      {"url": "https://images.unsplash.com/photo-1566985222267-d76645b4ee1e?w=800", "caption": "Where it began"},
      {"url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", "caption": "Paris"},
      {"url": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800", "caption": "Blenheim"},
      {"url": "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800", "caption": "Engagement"},
      {"url": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800", "caption": "Summer days"},
      {"url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800", "caption": "Together"}
    ]
  }'::jsonb),
  (proj_id, 'gifts', '{"title": "Gift Registry", "description": "Your presence at our celebration is the greatest gift. Should you wish to honour us further, we have a small registry at Harrods or contributions to our safari honeymoon.", "type": "mixed", "honeymoon_fund": {"enabled": true, "title": "African Safari", "description": "Help us experience the Serengeti"}, "items": []}'::jsonb),
  (proj_id, 'witnesses', '{
    "title": "Wedding Party",
    "persons": [
      {"name": "Lady Victoria Spencer", "role": "Maid of Honour", "relation": "Charlotte''s cousin", "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", "email": "victoria@example.com"},
      {"name": "The Hon. William Ashworth", "role": "Best Man", "relation": "James'' brother", "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", "email": "william@example.com"}
    ]
  }'::jsonb),
  (proj_id, 'faq', '{
    "title": "Frequently Asked Questions",
    "questions": [
      {"question": "What time should we arrive?", "answer": "Guests should arrive no later than 16:30 to be seated for the 17:00 ceremony."},
      {"question": "Will there be fireworks?", "answer": "Yes! A spectacular display at midnight to welcome the New Year and our marriage."},
      {"question": "Is there a cloakroom?", "answer": "Yes, staffed cloakroom facilities will be available throughout the evening."},
      {"question": "Can we stay late?", "answer": "The celebration continues until 2:00am with carriages at 2:30am."}
    ]
  }'::jsonb),
  (proj_id, 'weddingabc', '{"title": "Wedding A-Z", "entries": [{"letter": "A", "title": "Arrival", "description": "Please arrive by 16:30"}, {"letter": "B", "title": "Black Tie", "description": "Strictly enforced"}, {"letter": "F", "title": "Fireworks", "description": "At midnight"}, {"letter": "N", "title": "New Year", "description": "We''ll count down together"}]}'::jsonb),
  (proj_id, 'guestbook', '{"title": "Guest Book", "description": "Leave us your well wishes"}'::jsonb),
  (proj_id, 'musicwishes', '{"title": "Song Requests", "description": "Our orchestra takes requests"}'::jsonb),
  (proj_id, 'photoupload', '{"title": "Your Photographs", "description": "Share your memories"}'::jsonb),
  (proj_id, 'footer', '{"names": "Charlotte & James", "tagline": "New Year''s Eve 2025", "hashtag": "#CharlotteAndJames"}'::jsonb);

END $$;

-- ============================================
-- CONTENT FOR NEON (Alex & Jordan - Same-Sex)
-- ============================================
DO $$
DECLARE
  proj_id UUID;
BEGIN
  SELECT id INTO proj_id FROM projects WHERE slug = 'demo-neon';

  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'hero', '{
    "tagline": "Let''s Get Married",
    "location_short": "Berlin",
    "background_image": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920",
    "background_video": ""
  }'::jsonb),
  (proj_id, 'countdown', '{"title": "Days Until We Say I Do", "target_date": "2025-08-08T20:00:00", "show_seconds": true}'::jsonb),
  (proj_id, 'lovestory', '{
    "title": "How We Met",
    "subtitle": "A story written in neon lights",
    "events": [
      {"date": "2019-08-08", "title": "Pride Berlin", "description": "We literally bumped into each other at Pride. Jordan spilled their drink, Alex offered a napkin. The rest is history.", "image": "https://images.unsplash.com/photo-1562887284-8ba6b7c90fd7?w=800"},
      {"date": "2020-03-15", "title": "Lockdown Love", "description": "Moved in together after 3 weeks of dating. Crazy? Maybe. Worth it? Absolutely.", "image": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800"},
      {"date": "2024-08-08", "title": "The Double Proposal", "description": "Both planned to propose on our anniversary. Both did. At the same restaurant. Same moment. We still argue about who asked first.", "image": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"}
    ]
  }'::jsonb),
  (proj_id, 'timeline', '{
    "title": "The Plan",
    "events": [
      {"time": "20:00", "title": "Ceremony", "description": "Short, sweet, and full of love", "icon": "rings"},
      {"time": "20:30", "title": "Drinks & Bites", "description": "Cocktails and street food", "icon": "champagne"},
      {"time": "22:00", "title": "Party Starts", "description": "DJ drops the first beat", "icon": "music"},
      {"time": "00:00", "title": "Midnight Surprise", "description": "You''ll see...", "icon": "sparkles"},
      {"time": "04:00", "title": "After Party", "description": "For those still standing", "icon": "party"}
    ]
  }'::jsonb),
  (proj_id, 'locations', '{
    "title": "The Venue",
    "locations": [
      {"name": "The Neon Factory", "type": "Everything", "address": "Revaler Str. 99, 10245 Berlin", "description": "An industrial warehouse turned into Berlin''s coolest event space", "image": "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800", "maps_url": "https://goo.gl/maps/example"}
    ]
  }'::jsonb),
  (proj_id, 'directions', '{
    "title": "How To Get There",
    "address": "Revaler Str. 99, 10245 Berlin",
    "description": "Friedrichshain - the heart of cool Berlin",
    "options": [
      {"type": "train", "title": "Public Transport", "description": "S-Bahn Warschauer Straße (S3, S5, S7, S9), then 5 min walk."},
      {"type": "taxi", "title": "Taxi/Uber", "description": "Tell driver: Neon Factory, Revaler Straße. They''ll know."},
      {"type": "bike", "title": "By Bike", "description": "Bike parking available. This is Berlin, after all."}
    ]
  }'::jsonb),
  (proj_id, 'accommodations', '{
    "title": "Where To Stay",
    "description": "Cool hotels in the area",
    "hotels": [
      {"name": "nhow Berlin", "stars": 4, "distance": "10 min walk", "price": "from €120/night", "booking_url": "https://example.com", "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", "code": "ALEXJORDAN"},
      {"name": "Michelberger Hotel", "stars": 3, "distance": "5 min walk", "price": "from €90/night", "booking_url": "https://example.com", "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"}
    ]
  }'::jsonb),
  (proj_id, 'dresscode', '{
    "title": "What To Wear",
    "code": "Express Yourself",
    "description": "Wear whatever makes you feel amazing. Glitter encouraged. Heels optional. Just be YOU.",
    "colors": ["#FF00FF", "#00FFFF", "#FF1493", "#7B68EE"],
    "dos": ["Neon colors", "Glitter & sparkle", "Comfortable dancing shoes", "Bold accessories"],
    "donts": ["No judgement zone", "Nothing you can''t move in", "No boring allowed"]
  }'::jsonb),
  (proj_id, 'rsvp', '{"title": "RSVP", "description": "Let us know by July 1st", "deadline": "2025-07-01", "allow_plus_one": true, "dietary_question": true, "custom_question": "What''s your karaoke song?"}'::jsonb),
  (proj_id, 'gallery', '{
    "title": "Us, Being Us",
    "images": [
      {"url": "https://images.unsplash.com/photo-1562887284-8ba6b7c90fd7?w=800", "caption": "Pride 2019"},
      {"url": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800", "caption": "Lockdown adventures"},
      {"url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800", "caption": "Berlin nights"},
      {"url": "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800", "caption": "Our happy place"},
      {"url": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800", "caption": "Festival season"},
      {"url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800", "caption": "Dance floor ready"}
    ]
  }'::jsonb),
  (proj_id, 'gifts', '{"title": "Gifts", "description": "Honestly? Just come party with us. But if you insist, help fund our honeymoon road trip through California!", "type": "honeymoon", "honeymoon_fund": {"enabled": true, "title": "California Road Trip", "description": "LA to San Francisco in a convertible", "paypal": "alexjordan@example.com"}, "items": []}'::jsonb),
  (proj_id, 'witnesses', '{
    "title": "Our Crew",
    "persons": [
      {"name": "Sam Chen", "role": "Best Human", "relation": "Alex''s ride-or-die since forever", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", "phone": "+49 170 1234567", "email": "sam@example.com"},
      {"name": "Riley Kim", "role": "Person of Honor", "relation": "Jordan''s soul sibling", "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", "phone": "+49 170 7654321", "email": "riley@example.com"}
    ]
  }'::jsonb),
  (proj_id, 'faq', '{
    "title": "Questions?",
    "questions": [
      {"question": "Is this kid-friendly?", "answer": "We love your kids, but this is an adults-only party. Get a sitter and let loose!"},
      {"question": "What about dietary stuff?", "answer": "We''ve got vegan, vegetarian, gluten-free - you name it. Just let us know in the RSVP."},
      {"question": "Can I bring a plus one?", "answer": "If your invite says ''and guest'', bring whoever makes you happy!"},
      {"question": "How late does it go?", "answer": "This is Berlin. The after-party goes until we say stop."},
      {"question": "Will there be karaoke?", "answer": "OBVIOUSLY. It''s not a party without it."}
    ]
  }'::jsonb),
  (proj_id, 'weddingabc', '{"title": "Party A-Z", "entries": [{"letter": "B", "title": "Berlin", "description": "Best city in the world"}, {"letter": "D", "title": "Dancing", "description": "All night long"}, {"letter": "K", "title": "Karaoke", "description": "Prepare your song!"}, {"letter": "L", "title": "Love", "description": "The whole point"}, {"letter": "N", "title": "Neon", "description": "Dress code: BRIGHT"}]}'::jsonb),
  (proj_id, 'guestbook', '{"title": "Leave Some Love", "description": "Write us something cute (or weird, we''re into that)"}'::jsonb),
  (proj_id, 'musicwishes', '{"title": "DJ Requests", "description": "What song MUST the DJ play?"}'::jsonb),
  (proj_id, 'photoupload', '{"title": "Photo Dump", "description": "Share the chaos"}'::jsonb),
  (proj_id, 'footer', '{"names": "Alex & Jordan", "tagline": "08.08.2025", "hashtag": "#AlexJordan808"}'::jsonb);

END $$;

-- ============================================
-- CONTENT FOR VIDEO (María & Carlos)
-- ============================================
DO $$
DECLARE
  proj_id UUID;
BEGIN
  SELECT id INTO proj_id FROM projects WHERE slug = 'demo-video';

  INSERT INTO project_content (project_id, component, content) VALUES
  (proj_id, 'hero', '{
    "tagline": "Nos Casamos",
    "location_short": "Málaga, España",
    "background_image": "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1920",
    "background_video": "https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=175",
    "background_media": "https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=175"
  }'::jsonb),
  (proj_id, 'countdown', '{"title": "Días Para El Sí", "target_date": "2025-07-19T18:00:00", "show_seconds": false}'::jsonb),
  (proj_id, 'lovestory', '{
    "title": "Nuestra Historia",
    "subtitle": "Un amor bajo el sol de España",
    "events": [
      {"date": "2018-07-15", "title": "Feria de Málaga", "description": "Nos conocimos bailando sevillanas en la Feria. Carlos pisó los pies de María. Ella se rio. Fue amor.", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"},
      {"date": "2020-08-20", "title": "Granada", "description": "Nuestra primera escapada juntos. Vimos el atardecer desde el Albaicín mientras sonaba un guitarrista flamenco.", "image": "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800"},
      {"date": "2024-07-19", "title": "La Pedida", "description": "En la playa de La Malagueta, con los pies en el agua, Carlos le pidió a María que fuera su esposa.", "image": "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800"}
    ]
  }'::jsonb),
  (proj_id, 'timeline', '{
    "title": "El Día",
    "events": [
      {"time": "18:00", "title": "Ceremonia", "description": "En los jardines de la finca", "icon": "rings"},
      {"time": "19:30", "title": "Cóctel", "description": "Tapas y vino en la terraza", "icon": "champagne"},
      {"time": "21:00", "title": "Cena", "description": "Bajo las estrellas", "icon": "dinner"},
      {"time": "23:30", "title": "Primer Baile", "description": "Algo muy especial...", "icon": "music"},
      {"time": "00:00", "title": "Fiesta", "description": "¡A bailar hasta el amanecer!", "icon": "party"}
    ]
  }'::jsonb),
  (proj_id, 'locations', '{
    "title": "La Finca",
    "locations": [
      {"name": "Finca La Concepción", "type": "Ceremonia y Celebración", "address": "Camino del Jardín Botánico, 29014 Málaga", "description": "Una finca histórica con jardines botánicos y vistas al Mediterráneo", "image": "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800", "maps_url": "https://goo.gl/maps/example"}
    ]
  }'::jsonb),
  (proj_id, 'directions', '{
    "title": "Cómo Llegar",
    "address": "Camino del Jardín Botánico, 29014 Málaga",
    "description": "A 15 minutos del centro de Málaga",
    "options": [
      {"type": "car", "title": "En Coche", "description": "Parking gratuito en la finca. Desde el aeropuerto: 20 min por la A-7."},
      {"type": "taxi", "title": "En Taxi", "description": "Desde el centro: ~€15. Desde el aeropuerto: ~€25."},
      {"type": "shuttle", "title": "Autobús", "description": "Habrá autobuses desde el Hotel Málaga Palacio a las 17:00 y 17:30."}
    ]
  }'::jsonb),
  (proj_id, 'accommodations', '{
    "title": "Alojamiento",
    "description": "Hoteles recomendados con descuento",
    "hotels": [
      {"name": "Hotel Málaga Palacio", "stars": 4, "distance": "15 min en coche", "price": "desde €95/noche", "booking_url": "https://example.com", "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", "code": "MARIACARLOS"},
      {"name": "Parador de Málaga", "stars": 4, "distance": "10 min en coche", "price": "desde €120/noche", "booking_url": "https://example.com", "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"}
    ]
  }'::jsonb),
  (proj_id, 'dresscode', '{
    "title": "Código de Vestimenta",
    "code": "Elegante Verano",
    "description": "Elegante pero cómodo para una noche de verano andaluza. ¡Cuidado con los tacones en el jardín!",
    "colors": ["#FFFFFF", "#F5F5DC", "#87CEEB", "#FFD700"],
    "dos": ["Colores claros", "Tejidos ligeros", "Tacón ancho o cuña"],
    "donts": ["Nada de tacón de aguja", "Evitar negro", "No blanco (reservado para la novia)"]
  }'::jsonb),
  (proj_id, 'rsvp', '{"title": "Confirmar Asistencia", "description": "Por favor confirma antes del 1 de Junio 2025", "deadline": "2025-06-01", "allow_plus_one": true, "dietary_question": true, "custom_question": "¿Alguna canción para el DJ?"}'::jsonb),
  (proj_id, 'gallery', '{
    "title": "Momentos",
    "images": [
      {"url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", "caption": "Feria de Málaga"},
      {"url": "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800", "caption": "Granada"},
      {"url": "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800", "caption": "La Malagueta"},
      {"url": "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800", "caption": "Verano"},
      {"url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", "caption": "Juntos"},
      {"url": "https://images.unsplash.com/photo-1529543544277-750e4b20f587?w=800", "caption": "Sevilla"}
    ]
  }'::jsonb),
  (proj_id, 'gifts', '{"title": "Lista de Bodas", "description": "Vuestra presencia es el mejor regalo. Si deseáis contribuir a nuestra luna de miel en Bali:", "type": "honeymoon", "honeymoon_fund": {"enabled": true, "title": "Luna de Miel en Bali", "description": "Ayudadnos a descubrir Indonesia", "iban": "ES00 0000 0000 0000 0000 0000"}, "items": []}'::jsonb),
  (proj_id, 'witnesses', '{
    "title": "Padrinos y Testigos",
    "persons": [
      {"name": "Ana García", "role": "Dama de Honor", "relation": "Prima de María", "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", "phone": "+34 612 345 678", "email": "ana@example.com"},
      {"name": "Miguel Rodríguez", "role": "Padrino", "relation": "Mejor amigo de Carlos", "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", "phone": "+34 698 765 432", "email": "miguel@example.com"}
    ]
  }'::jsonb),
  (proj_id, 'faq', '{
    "title": "Preguntas Frecuentes",
    "questions": [
      {"question": "¿Pueden venir los niños?", "answer": "¡Claro! Los peques son bienvenidos. Habrá zona infantil con cuidadores."},
      {"question": "¿Hay parking?", "answer": "Sí, parking gratuito en la finca."},
      {"question": "¿Y si hace calor?", "answer": "La ceremonia es al atardecer y hay zonas con sombra y ventiladores."},
      {"question": "¿Hasta qué hora dura?", "answer": "¡Hasta que el cuerpo aguante! Oficialmente hasta las 5:00."},
      {"question": "¿Habrá flamenco?", "answer": "Pues claro, ¡estamos en Andalucía!"}
    ]
  }'::jsonb),
  (proj_id, 'weddingabc', '{"title": "ABC de la Boda", "entries": [{"letter": "A", "title": "Llegada", "description": "Por favor llega a las 17:30"}, {"letter": "B", "title": "Baile", "description": "¡Prepara tus zapatos de bailar!"}, {"letter": "F", "title": "Flamenco", "description": "Sorpresa especial"}, {"letter": "T", "title": "Tapas", "description": "Lo mejor de Andalucía"}]}'::jsonb),
  (proj_id, 'guestbook', '{"title": "Libro de Firmas", "description": "Déjanos un mensaje"}'::jsonb),
  (proj_id, 'musicwishes', '{"title": "Peticiones Musicales", "description": "¿Qué canción te hará bailar?"}'::jsonb),
  (proj_id, 'photoupload', '{"title": "Vuestras Fotos", "description": "Compartid los recuerdos"}'::jsonb),
  (proj_id, 'footer', '{"names": "María & Carlos", "tagline": "19 de Julio 2025", "hashtag": "#MariaCarlos2025"}'::jsonb);

END $$;

-- ============================================
-- VERIFY RESULTS
-- ============================================
SELECT slug, theme, couple_names, status, password_protected
FROM projects
WHERE slug LIKE 'demo-%'
ORDER BY theme;
