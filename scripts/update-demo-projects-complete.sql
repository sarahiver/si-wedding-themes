-- ============================================
-- COMPLETE DEMO PROJECT DATA
-- Fills ALL fields as if customer journey completed
-- Run this AFTER create-demo-projects.sql
-- ============================================

-- ============================================
-- UPDATE PROJECT SETTINGS (wie im SuperAdmin)
-- ============================================

-- BOTANICAL - Emma & Liam
UPDATE projects SET
  wedding_date = '2025-06-21',
  location = 'English Garden Estate, Richmond, London',
  hashtag = 'EmmaLiamForever',
  display_email = 'emma.liam@example.com',
  display_phone = '+44 7700 900 123'
WHERE slug = 'demo-botanical';

-- EDITORIAL - Sofia & Alessandro
UPDATE projects SET
  wedding_date = '2025-09-13',
  location = 'Villa Cimbrone, Ravello, Italia',
  hashtag = 'SofiaAlessandro2025',
  display_email = 'sofia.alessandro@example.com',
  display_phone = '+39 333 123 4567'
WHERE slug = 'demo-editorial';

-- CONTEMPORARY - Yuki & Kenji
UPDATE projects SET
  wedding_date = '2025-04-05',
  location = 'Tokyo Garden Palace, Chiyoda',
  hashtag = 'YukiKenji',
  display_email = 'yuki.kenji@example.com',
  display_phone = '+81 90 1234 5678'
WHERE slug = 'demo-contemporary';

-- LUXE - Charlotte & James
UPDATE projects SET
  wedding_date = '2025-12-31',
  location = 'Blenheim Palace, Oxfordshire',
  hashtag = 'CharlotteAndJames',
  display_email = 'charlotte.james@example.com',
  display_phone = '+44 7700 900 456'
WHERE slug = 'demo-luxe';

-- NEON - Alex & Jordan
UPDATE projects SET
  wedding_date = '2025-08-08',
  location = 'The Neon Factory, Berlin',
  hashtag = 'AlexJordan808',
  display_email = 'alex.jordan@example.com',
  display_phone = '+49 170 123 4567'
WHERE slug = 'demo-neon';

-- VIDEO - María & Carlos
UPDATE projects SET
  wedding_date = '2025-07-19',
  location = 'Finca La Concepción, Málaga',
  hashtag = 'MariaCarlos2025',
  display_email = 'maria.carlos@example.com',
  display_phone = '+34 612 345 678'
WHERE slug = 'demo-video';

-- ============================================
-- UPDATE HERO CONTENT (mit korrekten Namen)
-- ============================================

-- BOTANICAL Hero
UPDATE project_content SET content = '{
  "tagline": "We''re Getting Married",
  "location_short": "English Garden Estate, London",
  "background_image": "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
  "background_video": "",
  "name1": "Emma",
  "name2": "Liam",
  "date_display": "21. Juni 2025"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-botanical') AND component = 'hero';

-- EDITORIAL Hero
UPDATE project_content SET content = '{
  "tagline": "Un Amore Senza Fine",
  "location_short": "Villa Cimbrone, Ravello",
  "background_image": "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1920&q=80",
  "background_video": "",
  "name1": "Sofia",
  "name2": "Alessandro",
  "date_display": "13 Settembre 2025"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-editorial') AND component = 'hero';

-- CONTEMPORARY Hero
UPDATE project_content SET content = '{
  "tagline": "永遠の愛 - Eternal Love",
  "location_short": "Tokyo Garden Palace",
  "background_image": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920&q=80",
  "background_video": "",
  "name1": "Yuki",
  "name2": "Kenji",
  "date_display": "5th April 2025"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-contemporary') AND component = 'hero';

-- LUXE Hero
UPDATE project_content SET content = '{
  "tagline": "A New Year''s Eve Celebration",
  "location_short": "Blenheim Palace, Oxfordshire",
  "background_image": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80",
  "background_video": "",
  "name1": "Charlotte",
  "name2": "James",
  "date_display": "31st December 2025"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-luxe') AND component = 'hero';

-- NEON Hero
UPDATE project_content SET content = '{
  "tagline": "Let''s Get Married",
  "location_short": "Berlin, Germany",
  "background_image": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80",
  "background_video": "",
  "name1": "Alex",
  "name2": "Jordan",
  "date_display": "08.08.2025"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-neon') AND component = 'hero';

-- VIDEO Hero
UPDATE project_content SET content = '{
  "tagline": "Nos Casamos",
  "location_short": "Málaga, España",
  "background_image": "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1920&q=80",
  "background_video": "https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d",
  "background_media": "https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d",
  "name1": "María",
  "name2": "Carlos",
  "date_display": "19 de Julio 2025"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-video') AND component = 'hero';

-- ============================================
-- UPDATE COUNTDOWN (mit korrekten Zieldaten)
-- ============================================

UPDATE project_content SET content = '{
  "title": "Days Until Forever",
  "target_date": "2025-06-21T14:00:00",
  "show_seconds": true
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-botanical') AND component = 'countdown';

UPDATE project_content SET content = '{
  "title": "Giorni Fino Al Sì",
  "target_date": "2025-09-13T16:00:00",
  "show_seconds": false
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-editorial') AND component = 'countdown';

UPDATE project_content SET content = '{
  "title": "Days Until Our Wedding",
  "target_date": "2025-04-05T11:00:00",
  "show_seconds": false
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-contemporary') AND component = 'countdown';

UPDATE project_content SET content = '{
  "title": "Countdown to Forever",
  "target_date": "2025-12-31T17:00:00",
  "show_seconds": true
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-luxe') AND component = 'countdown';

UPDATE project_content SET content = '{
  "title": "Days Until We Say I Do",
  "target_date": "2025-08-08T20:00:00",
  "show_seconds": true
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-neon') AND component = 'countdown';

UPDATE project_content SET content = '{
  "title": "Días Para El Sí",
  "target_date": "2025-07-19T18:00:00",
  "show_seconds": false
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-video') AND component = 'countdown';

-- ============================================
-- UPDATE FOOTER (mit korrekten Namen & Hashtags)
-- ============================================

UPDATE project_content SET content = '{
  "names": "Emma & Liam",
  "tagline": "21st June 2025 • English Garden Estate",
  "hashtag": "EmmaLiamForever"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-botanical') AND component = 'footer';

UPDATE project_content SET content = '{
  "names": "Sofia & Alessandro",
  "tagline": "13 Settembre 2025 • Villa Cimbrone, Ravello",
  "hashtag": "SofiaAlessandro2025"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-editorial') AND component = 'footer';

UPDATE project_content SET content = '{
  "names": "Yuki & Kenji",
  "tagline": "5th April 2025 • Tokyo Garden Palace",
  "hashtag": "YukiKenji"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-contemporary') AND component = 'footer';

UPDATE project_content SET content = '{
  "names": "Charlotte & James",
  "tagline": "New Year''s Eve 2025 • Blenheim Palace",
  "hashtag": "CharlotteAndJames"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-luxe') AND component = 'footer';

UPDATE project_content SET content = '{
  "names": "Alex & Jordan",
  "tagline": "08.08.2025 • Berlin",
  "hashtag": "AlexJordan808"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-neon') AND component = 'footer';

UPDATE project_content SET content = '{
  "names": "María & Carlos",
  "tagline": "19 de Julio 2025 • Málaga",
  "hashtag": "MariaCarlos2025"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-video') AND component = 'footer';

-- ============================================
-- UPDATE RSVP (mit korrekten Deadlines)
-- ============================================

UPDATE project_content SET content = '{
  "title": "RSVP",
  "description": "Please let us know if you can celebrate with us. We kindly ask for your response by 1st May 2025.",
  "deadline": "2025-05-01",
  "allow_plus_one": true,
  "dietary_question": true,
  "custom_question": "Any song requests for the DJ?",
  "button_text": "Send RSVP"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-botanical') AND component = 'rsvp';

UPDATE project_content SET content = '{
  "title": "Conferma Presenza",
  "description": "Vi preghiamo di confermare la vostra presenza entro il 1 Luglio 2025.",
  "deadline": "2025-07-01",
  "allow_plus_one": true,
  "dietary_question": true,
  "custom_question": "Avete intolleranze alimentari?",
  "button_text": "Conferma"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-editorial') AND component = 'rsvp';

UPDATE project_content SET content = '{
  "title": "RSVP - ご出席のお返事",
  "description": "Please respond by March 1st, 2025. We look forward to celebrating with you!",
  "deadline": "2025-03-01",
  "allow_plus_one": true,
  "dietary_question": true,
  "custom_question": "Any dietary restrictions?",
  "button_text": "Submit"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-contemporary') AND component = 'rsvp';

UPDATE project_content SET content = '{
  "title": "RSVP",
  "description": "Kindly respond by 1st November 2025. We would be honoured by your presence.",
  "deadline": "2025-11-01",
  "allow_plus_one": true,
  "dietary_question": true,
  "custom_question": "Any special requirements?",
  "button_text": "Confirm Attendance"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-luxe') AND component = 'rsvp';

UPDATE project_content SET content = '{
  "title": "RSVP",
  "description": "Let us know by July 1st if you''re coming to party with us!",
  "deadline": "2025-07-01",
  "allow_plus_one": true,
  "dietary_question": true,
  "custom_question": "What''s your karaoke song?",
  "button_text": "Count Me In!"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-neon') AND component = 'rsvp';

UPDATE project_content SET content = '{
  "title": "Confirmar Asistencia",
  "description": "Por favor confirma tu asistencia antes del 1 de Junio 2025. ¡Esperamos verte!",
  "deadline": "2025-06-01",
  "allow_plus_one": true,
  "dietary_question": true,
  "custom_question": "¿Alguna canción para el DJ?",
  "button_text": "Confirmar"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-video') AND component = 'rsvp';

-- ============================================
-- UPDATE DRESSCODE (komplett befüllt)
-- ============================================

UPDATE project_content SET content = '{
  "title": "Dress Code",
  "code": "Garden Party Elegant",
  "description": "Think elegant summer garden party. Light fabrics, soft colours, and comfortable shoes for walking on the lawn.",
  "colors": ["#809671", "#D4AF37", "#F5F5DC", "#FFFFFF"],
  "dos": ["Floral prints welcome", "Light summer fabrics", "Comfortable heels or elegant flats", "Hats encouraged for ladies"],
  "donts": ["No stilettos (lawn)", "No all-black outfits", "No white (reserved for the bride)", "No jeans or casual wear"],
  "image": "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-botanical') AND component = 'dresscode';

UPDATE project_content SET content = '{
  "title": "Dress Code",
  "code": "Black Tie Optional",
  "description": "Eleganza italiana sotto le stelle. Abiti lunghi per le signore, smoking o abito scuro per i signori.",
  "colors": ["#1a1a1a", "#D4AF37", "#F5F5DC", "#8B4513"],
  "dos": ["Abiti eleganti", "Colori classici", "Gioielli raffinati", "Scarpe eleganti"],
  "donts": ["No jeans", "No sneakers", "No bianco (riservato alla sposa)", "No abbigliamento casual"],
  "image": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-editorial') AND component = 'dresscode';

UPDATE project_content SET content = '{
  "title": "Dress Code",
  "code": "Formal / 正装",
  "description": "Japanese formal wear or Western formal attire. Kimono welcome and encouraged!",
  "colors": ["#FFFFFF", "#F5F5DC", "#D4AF37", "#1a1a1a"],
  "dos": ["Formal attire", "Kimono welcome", "Subtle elegance", "Traditional Japanese dress"],
  "donts": ["No casual wear", "No white for ladies", "No bright patterns", "No jeans or sneakers"],
  "image": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-contemporary') AND component = 'dresscode';

UPDATE project_content SET content = '{
  "title": "Dress Code",
  "code": "Black Tie",
  "description": "Evening glamour befitting a New Year''s Eve celebration at a palace. Floor-length gowns and dinner jackets required.",
  "colors": ["#000000", "#D4AF37", "#1a1a2e", "#C0C0C0"],
  "dos": ["Floor-length gowns", "Dinner jacket or Tuxedo", "Diamonds and fine jewelry", "Elegant accessories"],
  "donts": ["No lounge suits", "No cocktail dresses", "No white", "No casual footwear"],
  "image": "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-luxe') AND component = 'dresscode';

UPDATE project_content SET content = '{
  "title": "What To Wear",
  "code": "Express Yourself",
  "description": "Wear whatever makes you feel amazing. Glitter encouraged. Heels optional. Neon colors welcome. Just be YOU!",
  "colors": ["#FF00FF", "#00FFFF", "#FF1493", "#7B68EE"],
  "dos": ["Neon colors", "Glitter & sparkle", "Comfortable dancing shoes", "Bold accessories", "Express yourself!"],
  "donts": ["No judgement zone", "Nothing you can''t dance in", "No boring allowed", "No dress code police here"],
  "image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-neon') AND component = 'dresscode';

UPDATE project_content SET content = '{
  "title": "Código de Vestimenta",
  "code": "Elegante Verano",
  "description": "Elegante pero cómodo para una noche de verano andaluza. ¡Cuidado con los tacones en el jardín!",
  "colors": ["#FFFFFF", "#F5F5DC", "#87CEEB", "#FFD700"],
  "dos": ["Colores claros", "Tejidos ligeros", "Tacón ancho o cuña", "Complementos elegantes"],
  "donts": ["Nada de tacón de aguja", "Evitar negro", "No blanco (reservado para la novia)", "No vaqueros"],
  "image": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800"
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-video') AND component = 'dresscode';

-- ============================================
-- UPDATE GIFTS (komplett befüllt)
-- ============================================

UPDATE project_content SET content = '{
  "title": "Gift Registry",
  "description": "Your presence is the greatest gift. If you wish to give something, we have a small registry or a honeymoon fund for our Scottish Highlands adventure.",
  "type": "mixed",
  "honeymoon_fund": {
    "enabled": true,
    "title": "Honeymoon Fund",
    "description": "Help us explore the Scottish Highlands! Every contribution helps us create unforgettable memories.",
    "paypal": "emmaliam@example.com",
    "bank_name": "Barclays Bank",
    "iban": "GB00 BARC 0000 0000 0000 00",
    "bic": "BARCGB22"
  },
  "items": [
    {"id": "1", "name": "Le Creuset Dutch Oven", "price": 250, "image": "https://images.unsplash.com/photo-1584990347449-a2d4e2f7bc7f?w=400", "description": "For cozy Sunday roasts"},
    {"id": "2", "name": "Dyson V15 Vacuum", "price": 600, "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "description": "For a spotless home"},
    {"id": "3", "name": "KitchenAid Mixer", "price": 400, "image": "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400", "description": "For our baking adventures"},
    {"id": "4", "name": "Nespresso Machine", "price": 200, "image": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400", "description": "Morning coffee essentials"}
  ]
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-botanical') AND component = 'gifts';

UPDATE project_content SET content = '{
  "title": "Lista Nozze",
  "description": "La vostra presenza è il regalo più bello. Se desiderate contribuire alla nostra luna di miele in Giappone, saremo eternamente grati.",
  "type": "honeymoon",
  "honeymoon_fund": {
    "enabled": true,
    "title": "Luna di Miele in Giappone",
    "description": "Aiutateci a scoprire Tokyo, Kyoto e le Alpi Giapponesi. Ogni contributo renderà il nostro viaggio ancora più speciale.",
    "bank_name": "Banca Intesa",
    "iban": "IT00 X000 0000 0000 0000 0000 000",
    "bic": "BCITITMM"
  },
  "items": []
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-editorial') AND component = 'gifts';

UPDATE project_content SET content = '{
  "title": "Gifts - ご祝儀",
  "description": "Your presence is our greatest gift. If you wish to give, please contribute to our honeymoon fund for our trip to the Maldives.",
  "type": "honeymoon",
  "honeymoon_fund": {
    "enabled": true,
    "title": "Honeymoon in Maldives",
    "description": "Help us relax on white sand beaches after the celebrations. We dream of overwater bungalows and crystal clear waters.",
    "bank_name": "MUFG Bank",
    "iban": "JP00 0000 0000 0000 0000 0000",
    "bic": "BOABORJT"
  },
  "items": []
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-contemporary') AND component = 'gifts';

UPDATE project_content SET content = '{
  "title": "Gift Registry",
  "description": "Your presence at our celebration is the greatest gift. Should you wish to honour us further, we have a registry at Harrods or contributions to our African safari honeymoon.",
  "type": "mixed",
  "honeymoon_fund": {
    "enabled": true,
    "title": "African Safari Adventure",
    "description": "Help us experience the magic of the Serengeti, Victoria Falls, and Cape Town.",
    "bank_name": "Coutts & Co",
    "iban": "GB00 COUT 0000 0000 0000 00",
    "bic": "COUTGB2L"
  },
  "items": [
    {"id": "1", "name": "Champagne Experience", "price": 500, "image": "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400", "description": "Dom Pérignon tasting for two"},
    {"id": "2", "name": "Fine Dining Experience", "price": 350, "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", "description": "Dinner at a Michelin restaurant"}
  ]
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-luxe') AND component = 'gifts';

UPDATE project_content SET content = '{
  "title": "Gifts",
  "description": "Honestly? Just come party with us. But if you insist, help fund our California road trip honeymoon! We''re planning LA to San Francisco in a convertible 🚗",
  "type": "honeymoon",
  "honeymoon_fund": {
    "enabled": true,
    "title": "California Road Trip",
    "description": "Help us rent that convertible Mustang, stay in quirky motels, and eat at the best taco trucks from LA to San Francisco!",
    "paypal": "alexjordan@example.com"
  },
  "items": []
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-neon') AND component = 'gifts';

UPDATE project_content SET content = '{
  "title": "Lista de Bodas",
  "description": "Vuestra presencia es el mejor regalo. Si deseáis contribuir a nuestra luna de miel en Bali, estaremos muy agradecidos.",
  "type": "honeymoon",
  "honeymoon_fund": {
    "enabled": true,
    "title": "Luna de Miel en Bali",
    "description": "Ayudadnos a descubrir Indonesia, sus templos, playas paradisíacas y su deliciosa gastronomía.",
    "bank_name": "Banco Santander",
    "iban": "ES00 0049 0000 0000 0000 0000",
    "bic": "BSCHESMM"
  },
  "items": []
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-video') AND component = 'gifts';

-- ============================================
-- UPDATE WITNESSES/TRAUZEUGEN
-- ============================================

UPDATE project_content SET content = '{
  "title": "Wedding Party",
  "persons": [
    {
      "name": "Sarah Thompson",
      "role": "Maid of Honour",
      "relation": "Emma''s best friend since university",
      "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      "phone": "+44 7700 900123",
      "email": "sarah@example.com",
      "message": "Any questions about the hen do or wedding day? I''m here to help!"
    },
    {
      "name": "Oliver Brown",
      "role": "Best Man",
      "relation": "Liam''s childhood friend",
      "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "phone": "+44 7700 900456",
      "email": "oliver@example.com",
      "message": "Stag do coordinator and speech writer extraordinaire!"
    }
  ]
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-botanical') AND component = 'witnesses';

UPDATE project_content SET content = '{
  "title": "Testimoni",
  "persons": [
    {
      "name": "Giulia Rossi",
      "role": "Testimone della Sposa",
      "relation": "Sorella di Sofia",
      "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      "phone": "+39 333 1234567",
      "email": "giulia@example.com",
      "message": "Per qualsiasi domanda sulla festa o il grande giorno, scrivetemi!"
    },
    {
      "name": "Marco Bianchi",
      "role": "Testimone dello Sposo",
      "relation": "Migliore amico di Alessandro",
      "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "phone": "+39 333 7654321",
      "email": "marco@example.com",
      "message": "Organizzatore dell''addio al celibato!"
    }
  ]
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-editorial') AND component = 'witnesses';

UPDATE project_content SET content = '{
  "title": "Wedding Party",
  "persons": [
    {
      "name": "Sakura Tanaka",
      "role": "Maid of Honor",
      "relation": "Yuki''s sister",
      "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      "phone": "+81 90 1234 5678",
      "email": "sakura@example.com",
      "message": "Questions about the wedding? Contact me!"
    },
    {
      "name": "Takeshi Yamamoto",
      "role": "Best Man",
      "relation": "Kenji''s best friend",
      "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "phone": "+81 90 8765 4321",
      "email": "takeshi@example.com",
      "message": "Coordinating the bachelor party!"
    }
  ]
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-contemporary') AND component = 'witnesses';

UPDATE project_content SET content = '{
  "title": "Wedding Party",
  "persons": [
    {
      "name": "Lady Victoria Spencer",
      "role": "Maid of Honour",
      "relation": "Charlotte''s cousin",
      "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      "phone": "+44 7700 900789",
      "email": "victoria@example.com",
      "message": "For any enquiries regarding the celebration, do not hesitate to contact me."
    },
    {
      "name": "The Hon. William Ashworth",
      "role": "Best Man",
      "relation": "James'' brother",
      "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "phone": "+44 7700 900321",
      "email": "william@example.com",
      "message": "Coordinating the stag weekend in Monaco."
    }
  ]
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-luxe') AND component = 'witnesses';

UPDATE project_content SET content = '{
  "title": "Our Crew",
  "persons": [
    {
      "name": "Sam Chen",
      "role": "Best Human",
      "relation": "Alex''s ride-or-die since forever",
      "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "phone": "+49 170 1234567",
      "email": "sam@example.com",
      "message": "Questions? Drama? Need a hype person? Hit me up! 🎉"
    },
    {
      "name": "Riley Kim",
      "role": "Person of Honor",
      "relation": "Jordan''s soul sibling",
      "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      "phone": "+49 170 7654321",
      "email": "riley@example.com",
      "message": "Planning the most epic pre-wedding party ever! 🌈"
    }
  ]
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-neon') AND component = 'witnesses';

UPDATE project_content SET content = '{
  "title": "Padrinos y Testigos",
  "persons": [
    {
      "name": "Ana García",
      "role": "Dama de Honor",
      "relation": "Prima de María",
      "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      "phone": "+34 612 345 678",
      "email": "ana@example.com",
      "message": "¿Preguntas sobre la despedida o la boda? ¡Escríbeme!"
    },
    {
      "name": "Miguel Rodríguez",
      "role": "Padrino",
      "relation": "Mejor amigo de Carlos",
      "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "phone": "+34 698 765 432",
      "email": "miguel@example.com",
      "message": "¡Organizando la mejor despedida de soltero!"
    }
  ]
}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-video') AND component = 'witnesses';

-- ============================================
-- UPDATE GUESTBOOK & MUSICWISHES TITLES
-- ============================================

UPDATE project_content SET content = '{"title": "Guest Book", "description": "Leave us a message, share a memory, or send your wishes for our future together."}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-botanical') AND component = 'guestbook';

UPDATE project_content SET content = '{"title": "Libro degli Ospiti", "description": "Lasciateci un messaggio, condividete un ricordo o inviateci i vostri auguri per il nostro futuro insieme."}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-editorial') AND component = 'guestbook';

UPDATE project_content SET content = '{"title": "ゲストブック", "description": "Leave us a message or share your wishes for our future together."}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-contemporary') AND component = 'guestbook';

UPDATE project_content SET content = '{"title": "Guest Book", "description": "Please leave us your well wishes and fond memories."}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-luxe') AND component = 'guestbook';

UPDATE project_content SET content = '{"title": "Leave Some Love", "description": "Write us something cute, funny, or weird - we''re into all of it! 💜"}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-neon') AND component = 'guestbook';

UPDATE project_content SET content = '{"title": "Libro de Firmas", "description": "Déjanos un mensaje, comparte un recuerdo o envíanos tus mejores deseos para nuestro futuro juntos."}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-video') AND component = 'guestbook';

-- Music Wishes
UPDATE project_content SET content = '{"title": "Song Requests", "description": "What song will get you on the dance floor? Let us know your must-play tracks!"}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-botanical') AND component = 'musicwishes';

UPDATE project_content SET content = '{"title": "Richieste Musicali", "description": "Quale canzone vi farà ballare? Fateci sapere i vostri brani preferiti!"}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-editorial') AND component = 'musicwishes';

UPDATE project_content SET content = '{"title": "Music Requests", "description": "What song would you like to hear at our wedding?"}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-contemporary') AND component = 'musicwishes';

UPDATE project_content SET content = '{"title": "Song Requests", "description": "Our orchestra takes requests. What would you like to hear?"}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-luxe') AND component = 'musicwishes';

UPDATE project_content SET content = '{"title": "DJ Requests", "description": "What song MUST the DJ play? What''s your go-to banger? 🎵"}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-neon') AND component = 'musicwishes';

UPDATE project_content SET content = '{"title": "Peticiones Musicales", "description": "¿Qué canción te hará bailar? ¡Dinos tus canciones favoritas!"}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-video') AND component = 'musicwishes';

-- Photo Upload
UPDATE project_content SET content = '{"title": "Share Your Photos", "description": "Capture the magic! Upload your photos from our special day."}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-botanical') AND component = 'photoupload';

UPDATE project_content SET content = '{"title": "Le Vostre Foto", "description": "Catturate la magia! Caricate le vostre foto del nostro giorno speciale."}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-editorial') AND component = 'photoupload';

UPDATE project_content SET content = '{"title": "Photo Sharing", "description": "Share your photos from our wedding day with us!"}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-contemporary') AND component = 'photoupload';

UPDATE project_content SET content = '{"title": "Your Photographs", "description": "We would love to see your photographs from our celebration."}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-luxe') AND component = 'photoupload';

UPDATE project_content SET content = '{"title": "Photo Dump", "description": "Share the chaos! Upload your pics, videos, boomerangs - everything! 📸"}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-neon') AND component = 'photoupload';

UPDATE project_content SET content = '{"title": "Vuestras Fotos", "description": "¡Compartid los recuerdos! Subid vuestras fotos del gran día."}'::jsonb
WHERE project_id = (SELECT id FROM projects WHERE slug = 'demo-video') AND component = 'photoupload';

-- ============================================
-- VERIFY ALL CONTENT IS SET
-- ============================================
SELECT
  p.slug,
  p.couple_names,
  p.wedding_date,
  (SELECT COUNT(*) FROM project_content WHERE project_id = p.id) as content_entries
FROM projects p
WHERE p.slug LIKE 'demo-%'
ORDER BY p.slug;
