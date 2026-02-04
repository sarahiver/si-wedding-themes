-- ============================================
-- ADDITIONAL DEMO DATA: Music Wishes, Guestbook, etc.
-- Run AFTER create-demo-projects.sql
-- ============================================

-- ============================================
-- MUSIC WISHES FOR ALL DEMO PROJECTS
-- ============================================

-- BOTANICAL
INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Thomas & Julia', 'Ed Sheeran', 'Perfect', NOW() - INTERVAL '5 days'
FROM projects WHERE slug = 'demo-botanical';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Familie Schmidt', 'Bruno Mars', 'Marry You', NOW() - INTERVAL '3 days'
FROM projects WHERE slug = 'demo-botanical';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Sarah', 'Whitney Houston', 'I Wanna Dance With Somebody', NOW() - INTERVAL '2 days'
FROM projects WHERE slug = 'demo-botanical';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Oma Ingrid', 'ABBA', 'Dancing Queen', NOW() - INTERVAL '1 day'
FROM projects WHERE slug = 'demo-botanical';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Max & Lisa', 'Queen', 'Don''t Stop Me Now', NOW()
FROM projects WHERE slug = 'demo-botanical';

-- EDITORIAL
INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Marco Bianchi', 'Andrea Bocelli', 'Con Te Partirò', NOW() - INTERVAL '4 days'
FROM projects WHERE slug = 'demo-editorial';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Giulia e Paolo', 'Eros Ramazzotti', 'Più Bella Cosa', NOW() - INTERVAL '3 days'
FROM projects WHERE slug = 'demo-editorial';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'La Famiglia Rossi', 'Domenico Modugno', 'Nel Blu Dipinto Di Blu', NOW() - INTERVAL '2 days'
FROM projects WHERE slug = 'demo-editorial';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Francesca', 'Coldplay', 'Yellow', NOW() - INTERVAL '1 day'
FROM projects WHERE slug = 'demo-editorial';

-- CONTEMPORARY
INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Sakura-san', 'Official HIGE DANdism', 'Pretender', NOW() - INTERVAL '3 days'
FROM projects WHERE slug = 'demo-contemporary';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Takeshi', 'RADWIMPS', 'Sparkle', NOW() - INTERVAL '2 days'
FROM projects WHERE slug = 'demo-contemporary';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Yumi & Ken', 'Utada Hikaru', 'First Love', NOW() - INTERVAL '1 day'
FROM projects WHERE slug = 'demo-contemporary';

-- LUXE
INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Lord Winchester', 'Frank Sinatra', 'The Way You Look Tonight', NOW() - INTERVAL '5 days'
FROM projects WHERE slug = 'demo-luxe';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Lady Pemberton', 'Nat King Cole', 'Unforgettable', NOW() - INTERVAL '4 days'
FROM projects WHERE slug = 'demo-luxe';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'The Ashworths', 'Michael Bublé', 'Everything', NOW() - INTERVAL '2 days'
FROM projects WHERE slug = 'demo-luxe';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Victoria', 'Beyoncé', 'Halo', NOW() - INTERVAL '1 day'
FROM projects WHERE slug = 'demo-luxe';

-- NEON
INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Sam & Riley', 'Daft Punk', 'Get Lucky', NOW() - INTERVAL '4 days'
FROM projects WHERE slug = 'demo-neon';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'DJ Max', 'The Weeknd', 'Blinding Lights', NOW() - INTERVAL '3 days'
FROM projects WHERE slug = 'demo-neon';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Luna', 'Lady Gaga', 'Rain On Me', NOW() - INTERVAL '2 days'
FROM projects WHERE slug = 'demo-neon';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'The Berlin Crew', 'Robyn', 'Dancing On My Own', NOW() - INTERVAL '1 day'
FROM projects WHERE slug = 'demo-neon';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Kai', 'Dua Lipa', 'Levitating', NOW()
FROM projects WHERE slug = 'demo-neon';

-- VIDEO
INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Tía Carmen', 'Julio Iglesias', 'Me Olvidé de Vivir', NOW() - INTERVAL '4 days'
FROM projects WHERE slug = 'demo-video';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Los Primos', 'Gipsy Kings', 'Bamboléo', NOW() - INTERVAL '3 days'
FROM projects WHERE slug = 'demo-video';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Ana García', 'Rosalía', 'Malamente', NOW() - INTERVAL '2 days'
FROM projects WHERE slug = 'demo-video';

INSERT INTO music_wishes (project_id, name, artist, song_title, created_at)
SELECT id, 'Miguel', 'Enrique Iglesias', 'Bailando', NOW() - INTERVAL '1 day'
FROM projects WHERE slug = 'demo-video';

-- ============================================
-- GUESTBOOK ENTRIES FOR ALL DEMO PROJECTS
-- ============================================

-- BOTANICAL
INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Familie Schmidt',
'Wir freuen uns so sehr für euch beide! Emma und Liam, ihr seid füreinander bestimmt. Alles Liebe für eure gemeinsame Zukunft! 💚',
true, NOW() - INTERVAL '7 days'
FROM projects WHERE slug = 'demo-botanical';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Sarah & Tom',
'What a beautiful couple! We''re so honoured to be part of your special day. Here''s to a lifetime of love and laughter!',
true, NOW() - INTERVAL '5 days'
FROM projects WHERE slug = 'demo-botanical';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Grandma Rose',
'My dearest Emma, watching you grow into such a wonderful woman and now seeing you marry the love of your life fills my heart with joy. Liam, welcome to the family!',
true, NOW() - INTERVAL '3 days'
FROM projects WHERE slug = 'demo-botanical';

-- EDITORIAL
INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'La Famiglia Bianchi',
'Sofia e Alessandro, che il vostro amore sia eterno come le colline della Toscana. Auguri di cuore!',
true, NOW() - INTERVAL '6 days'
FROM projects WHERE slug = 'demo-editorial';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Marco & Chiara',
'Siamo così felici per voi! Non vediamo l''ora di festeggiare il vostro grande giorno a Ravello. Un abbraccio forte!',
true, NOW() - INTERVAL '4 days'
FROM projects WHERE slug = 'demo-editorial';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Zia Lucia',
'Alessandro, sei come un figlio per me. Sofia, sei una donna meravigliosa. Che Dio vi benedica sempre!',
true, NOW() - INTERVAL '2 days'
FROM projects WHERE slug = 'demo-editorial';

-- CONTEMPORARY
INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Tanaka Family',
'結婚おめでとうございます！お二人の幸せを心からお祈りしています。Congratulations on your wedding!',
true, NOW() - INTERVAL '5 days'
FROM projects WHERE slug = 'demo-contemporary';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Sakura-san',
'Yuki-chan, Kenji-kun, I''m so happy for both of you! May your life together be filled with cherry blossoms and sunshine 🌸',
true, NOW() - INTERVAL '3 days'
FROM projects WHERE slug = 'demo-contemporary';

-- LUXE
INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'The Duke of Westbury',
'Dearest Charlotte and James, It is with great pleasure that we offer our warmest congratulations on your forthcoming union. May your marriage be blessed with happiness and prosperity.',
true, NOW() - INTERVAL '7 days'
FROM projects WHERE slug = 'demo-luxe';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Lady Victoria Spencer',
'My darling cousin Charlotte, I couldn''t be happier for you. James is a wonderful man and together you''ll create a beautiful life. All my love, V.',
true, NOW() - INTERVAL '4 days'
FROM projects WHERE slug = 'demo-luxe';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'The Ashworth Family',
'Welcome to the family, Charlotte! We''re thrilled that James has found such an extraordinary partner. Here''s to many happy years ahead.',
true, NOW() - INTERVAL '2 days'
FROM projects WHERE slug = 'demo-luxe';

-- NEON
INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Sam Chen',
'ALEX!!! I can''t believe you''re getting MARRIED! You two are literally the cutest couple ever. Love you both so much! 🎉💜',
true, NOW() - INTERVAL '5 days'
FROM projects WHERE slug = 'demo-neon';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Riley Kim',
'Jordan, my soul sibling, you deserve all the happiness in the world. Alex is so lucky to have you (and vice versa obviously). Can''t wait to party with you both! 🌈✨',
true, NOW() - INTERVAL '3 days'
FROM projects WHERE slug = 'demo-neon';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'The Berlin Squad',
'CONGRATULATIONS! Pride Berlin brought you together and now you''re getting married. This is the most beautiful love story. We''re so ready to celebrate with you! 🏳️‍🌈',
true, NOW() - INTERVAL '1 day'
FROM projects WHERE slug = 'demo-neon';

-- VIDEO
INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Tía Carmen',
'¡Mi querida María! Te conozco desde que eras una niña pequeña y ahora te casas con el hombre perfecto para ti. Carlos, cuídala bien. ¡Os quiero mucho!',
true, NOW() - INTERVAL '6 days'
FROM projects WHERE slug = 'demo-video';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Los Primos',
'¡María y Carlos, que viva el amor! No podemos esperar para bailar sevillanas en vuestra boda. ¡Olé! 💃',
true, NOW() - INTERVAL '4 days'
FROM projects WHERE slug = 'demo-video';

INSERT INTO guestbook_entries (project_id, name, message, approved, created_at)
SELECT id, 'Ana García',
'María, eres la mejor prima del mundo. Carlos, bienvenido a la familia loca. ¡Os deseamos toda la felicidad! 🌻',
true, NOW() - INTERVAL '2 days'
FROM projects WHERE slug = 'demo-video';

-- ============================================
-- RSVP RESPONSES FOR ALL DEMO PROJECTS
-- ============================================

-- BOTANICAL
INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Thomas & Julia Schmidt', 'schmidt@example.com', 2, true, 'Vegetarisch', 'Wir freuen uns riesig! See you there!', NOW() - INTERVAL '10 days'
FROM projects WHERE slug = 'demo-botanical';

INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Sarah Thompson', 'sarah.t@example.com', 1, true, '', 'Cannot wait to celebrate with you both! 💕', NOW() - INTERVAL '8 days'
FROM projects WHERE slug = 'demo-botanical';

INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Familie Brown', 'brown.family@example.com', 4, true, 'One child gluten-free', 'The whole family will be there!', NOW() - INTERVAL '5 days'
FROM projects WHERE slug = 'demo-botanical';

-- EDITORIAL
INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Marco & Chiara Bianchi', 'bianchi@example.com', 2, true, '', 'Non vediamo l''ora!', NOW() - INTERVAL '12 days'
FROM projects WHERE slug = 'demo-editorial';

INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Francesca Russo', 'francesca@example.com', 1, true, 'Vegana', 'Sarà meraviglioso!', NOW() - INTERVAL '7 days'
FROM projects WHERE slug = 'demo-editorial';

-- CONTEMPORARY
INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Tanaka Family', 'tanaka@example.com', 3, true, 'No shellfish', '参加します！楽しみにしています！', NOW() - INTERVAL '9 days'
FROM projects WHERE slug = 'demo-contemporary';

INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Sakura Yamamoto', 'sakura@example.com', 2, true, '', 'We will be there! So excited!', NOW() - INTERVAL '6 days'
FROM projects WHERE slug = 'demo-contemporary';

-- LUXE
INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'The Duke & Duchess of Westbury', 'westbury@example.com', 2, true, '', 'We shall attend with great pleasure.', NOW() - INTERVAL '14 days'
FROM projects WHERE slug = 'demo-luxe';

INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Lady Victoria Spencer', 'victoria@example.com', 2, true, 'Pescatarian', 'Wouldn''t miss it for the world!', NOW() - INTERVAL '10 days'
FROM projects WHERE slug = 'demo-luxe';

-- NEON
INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Sam Chen', 'sam@example.com', 1, true, 'Vegan', 'YESSS! I''m bringing my dancing shoes! 🕺', NOW() - INTERVAL '8 days'
FROM projects WHERE slug = 'demo-neon';

INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Riley Kim', 'riley@example.com', 2, true, '', 'Count us in! Prepared for karaoke!! 🎤', NOW() - INTERVAL '6 days'
FROM projects WHERE slug = 'demo-neon';

INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'The Berlin Crew', 'crew@example.com', 5, true, '2 vegetarian', 'All of us are coming! Get ready to party! 🎉', NOW() - INTERVAL '4 days'
FROM projects WHERE slug = 'demo-neon';

-- VIDEO
INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Tía Carmen', 'carmen@example.com', 1, true, '', '¡Allí estaré, mi niña!', NOW() - INTERVAL '11 days'
FROM projects WHERE slug = 'demo-video';

INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Los Primos García', 'primos@example.com', 6, true, '1 sin gluten', '¡Toda la familia viene! ¡Que vivan los novios!', NOW() - INTERVAL '7 days'
FROM projects WHERE slug = 'demo-video';

INSERT INTO rsvp_responses (project_id, name, email, persons, attending, dietary, message, created_at)
SELECT id, 'Miguel Rodríguez', 'miguel@example.com', 2, true, '', '¡No me lo pierdo por nada! ¡Vamos a bailar!', NOW() - INTERVAL '3 days'
FROM projects WHERE slug = 'demo-video';

-- ============================================
-- VERIFY COUNTS
-- ============================================
SELECT
  p.slug,
  (SELECT COUNT(*) FROM music_wishes WHERE project_id = p.id) as music_wishes,
  (SELECT COUNT(*) FROM guestbook_entries WHERE project_id = p.id) as guestbook_entries,
  (SELECT COUNT(*) FROM rsvp_responses WHERE project_id = p.id) as rsvp_responses
FROM projects p
WHERE p.slug LIKE 'demo-%'
ORDER BY p.slug;
