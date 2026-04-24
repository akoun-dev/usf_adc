-- =====================================================
-- migration: seed initial data
-- =====================================================
-- purpose: populate database with initial seed data from mock files
-- affected tables: countries, projects, forum_categories, forum_topics, forum_posts, events, news, documents
-- special considerations:
--   - this migration should only be run once in development/initial deployment
--   - ids are deterministic uuids based on mock data for consistency
--   - all insert statements use on conflict to allow re-running if needed
-- =====================================================

-- =====================================================
-- 1. insert additional country data (complete the initial seed)
-- =====================================================
-- note: the countries table already has some data from the initial migration
-- this adds any missing countries referenced in the mock data

insert into public.countries (code_iso, name_fr, name_en, region)
values
  -- additional countries to ensure all mock data is covered
  ('ci', 'Côte d''Ivoire', 'Ivory Coast', 'CEDEAO'),
  ('sn', 'Sénégal', 'Senegal', 'CEDEAO'),
  ('ml', 'Mali', 'Mali', 'CEDEAO'),
  ('bf', 'Burkina Faso', 'Burkina Faso', 'CEDEAO'),
  ('ng', 'Nigeria', 'Nigeria', 'CEDEAO'),
  ('gh', 'Ghana', 'Ghana', 'CEDEAO'),
  ('cm', 'Cameroun', 'Cameroon', 'CEEAC'),
  ('cd', 'RD Congo', 'DR Congo', 'SADC'),
  ('ke', 'Kenya', 'Kenya', 'EAC'),
  ('rw', 'Rwanda', 'Rwanda', 'EAC'),
  ('ug', 'Ouganda', 'Uganda', 'EAC'),
  ('tz', 'Tanzanie', 'Tanzania', 'SADC'),
  ('za', 'Afrique du Sud', 'South Africa', 'SADC'),
  ('ma', 'Maroc', 'Morocco', 'UMA'),
  ('tn', 'Tunisie', 'Tunisia', 'UMA'),
  ('dz', 'Algérie', 'Algeria', 'UMA'),
  ('et', 'Éthiopie', 'Ethiopia', 'EAC'),
  ('mz', 'Mozambique', 'Mozambique', 'SADC'),
  ('zm', 'Zambie', 'Zambia', 'SADC'),
  ('bj', 'Bénin', 'Benin', 'CEDEAO'),
  ('tg', 'Togo', 'Togo', 'CEDEAO'),
  ('ne', 'Niger', 'Niger', 'CEDEAO'),
  ('gn', 'Guinée', 'Guinea', 'CEDEAO')
on conflict (code_iso) do nothing;

-- =====================================================
-- 2. insert forum categories
-- =====================================================
-- note: seed data for forum categories with icons and colors

insert into public.forum_categories (id, name, description, slug, icon, color, sort_order)
values
  ('b0000000-0000-0000-0000-000000000001', 'Annonces', 'Communications officielles de l''UAT', 'annonces', '📢', 'bg-blue-500', 1),
  ('b0000000-0000-0000-0000-000000000002', 'Présentations', 'Présentez-vous et votre pays', 'presentations', '👋', 'bg-green-500', 2),
  ('b0000000-0000-0000-0000-000000000003', 'Aide et Support', 'Questions sur la plateforme USF-ADC', 'aide-support', '❓', 'bg-amber-500', 3),
  ('b0000000-0000-0000-0000-000000000004', 'Bonnes Pratiques', 'Partage d''expériences réussies', 'bonnes-pratiques', '💡', 'bg-purple-500', 4),
  ('b0000000-0000-0000-0000-000000000005', 'Règlementation', 'Discussions sur les cadres réglementaires', 'reglementation', '⚖️', 'bg-red-500', 5),
  ('b0000000-0000-0000-0000-000000000006', 'Technique', 'Aspects techniques du déploiement', 'technique', '🔧', 'bg-slate-500', 6)
on conflict (slug) do nothing;

-- =====================================================
-- 2.5. TEMPORARILY DISABLED - forum topics and posts
-- =====================================================
-- Forum data seed temporarily disabled due to schema mismatch between migrations 000011 and 000021/000022
-- The original migration 000011 creates forum_topics with created_by refs profiles
-- But migrations 000021/000022 override with created_by refs auth.users (nullable)
-- To resolve this, either unify the migrations or seed data via API after users exist

-- =====================================================
-- 3. insert demo events (10 events)
-- =====================================================

insert into public.events (id, title, description, start_date, end_date, location, event_type, status, max_participants, registration_url, price, image_url, organizer, is_public)
values
  -- Events 1-2 (existing)
  ('d0000000-0000-0000-0000-000000000001', 'Sommet Africa Tech 2026', 'Le plus grand rassemblement des acteurs du numérique en Afrique. Éditions précédentes : 3000 participants, 50 pays représentés, 200 conférenciers.', '2026-05-15 09:00:00', '2026-05-18 18:00:00', 'Palais des Congrès, Abidjan, Côte d''Ivoire', 'conference', 'upcoming', 3000, 'https://atuuat.africa/events/africa-tech-2025', 'Gratuit sur invitation', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630&fit=crop', 'Union Africaine des Télécommunications', true),
  ('d0000000-0000-0000-0000-000000000002', 'Webinaire : Stratégies de mobilisation du FSU', 'Découvrez les stratégies efficaces pour mobiliser les ressources du Fonds de Service Universel.', '2026-05-22 14:00:00', '2026-05-22 17:00:00', 'En ligne', 'webinar', 'upcoming', 500, 'https://atuuat.africa/webinars/fsu-financement', 'Gratuit', 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=630&fit=crop', 'UAT - Programmes', true),
  -- Events 3-10 (new)
  ('d0000000-0000-0000-0000-000000000003', 'Atelier Pratique : Gestion de la plateforme USF-ADC', 'Formation pratique intensive sur l''utilisation de la plateforme USF-ADC pour les Points Focaux et Administrateurs Pays.', '2026-06-10 09:00:00', '2026-06-12 17:00:00', 'Hôtel Noom, Ouagadougou, Burkina Faso', 'workshop', 'upcoming', 40, 'https://atuuat.africa/training/usf-adc', 'Gratuit (frais de voyage pris en charge)', 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=1200&h=630&fit=crop', 'UAT - Formation', true),
  ('d0000000-0000-0000-0000-000000000004', 'Conférence Régionale : L''Inclusion Numérique au Sahel', 'Une conférence dédiée aux défis et opportunités de l''inclusion numérique dans la région du Sahel.', '2026-07-08 09:00:00', '2026-07-10 17:00:00', 'Centre de Conférences, Niamey, Niger', 'conference', 'upcoming', 300, 'https://atuuat.africa/events/sahel-inclusion', 'Gratuit', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=630&fit=crop', 'UAT - Région Sahel', true),
  ('d0000000-0000-0000-0000-000000000005', 'Session de Certification : Auditeurs du FSU', 'Programme de certification pour devenir auditeur qualifié des Fonds de Service Universel.', '2026-08-24 09:00:00', '2026-08-28 17:00:00', 'Institut Supérieur des Télécommunications, Dakar, Sénégal', 'training', 'upcoming', 25, 'https://atuuat.africa/certification/audit', '500 000 FCFA (hors frais de voyage)', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=630&fit=crop', 'UAT - Certification', true),
  ('d0000000-0000-0000-0000-000000000006', 'Forum annuel : Partenariats Public-Privé pour le FSU', 'Le forum annuel de l''UAT sur les partenariats public-privé comme levier de financement du Service Universel.', '2026-09-20 09:00:00', '2026-09-22 17:00:00', 'Kempinski, Accra, Ghana', 'conference', 'upcoming', 200, 'https://atuuat.africa/events/ppp-forum', '200 000 FCFA (early bird: 150 000 FCFA)', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=630&fit=crop', 'UAT - Partenariats', true),
  ('d0000000-0000-0000-0000-000000000007', 'Hackathon : Solutions innovantes pour le FSU', '48 heures pour imaginer et prototyper des solutions innovantes au service du Fonds de Service Universel.', '2026-10-25 09:00:00', '2026-10-27 18:00:00', 'Technopark, Kigali, Rwanda', 'workshop', 'upcoming', 150, 'https://atuuat.africa/hackathon/fsu', 'Gratuit (sur sélection)', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=630&fit=crop', 'UAT - Innovation', true),
  ('d0000000-0000-0000-0000-000000000008', 'Webinaire : Financement 5G en Afrique', 'Stratégies de financement pour le déploiement de la 5G en Afrique.', '2026-06-15 15:00:00', '2026-06-15 17:00:00', 'En ligne', 'webinar', 'upcoming', 1000, 'https://atuuat.africa/webinars/5g-funding', 'Gratuit', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop', 'UAT - Télécom', true),
  ('d0000000-0000-0000-0000-000000000009', 'Conférence : Connectivité rurale', 'Solutions innovantes pour connecter les zones rurales africaines.', '2026-08-05 09:00:00', '2026-08-06 17:00:00', 'Hotel Serena, Kigali, Rwanda', 'conference', 'upcoming', 250, 'https://atuuat.africa/events/rural-connectivity', '150 000 FCFA', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop', 'UAT - Infrastructure', true),
  ('d0000000-0000-0000-0000-000000000010', 'Atelier : Gouvernance des FSU', 'Formation à la gouvernance et la transparence des Fonds de Service Universel.', '2026-09-05 09:00:00', '2026-09-07 17:00:00', 'Radisson Blu, Dakar, Sénégal', 'workshop', 'upcoming', 60, 'https://atuuat.africa/workshops/fsu-governance', 'Gratuit pour membres', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop', 'UAT - Gouvernance', true)
on conflict (id) do nothing;

-- =====================================================
-- 4. insert event tags
-- =====================================================

insert into public.event_tags (event_id, tag)
values
  -- Event 1 tags
  ('d0000000-0000-0000-0000-000000000001', 'Conférence'),
  ('d0000000-0000-0000-0000-000000000001', 'Sommet'),
  ('d0000000-0000-0000-0000-000000000001', 'Technologie'),
  ('d0000000-0000-0000-0000-000000000001', 'Innovation'),
  -- Event 2 tags
  ('d0000000-0000-0000-0000-000000000002', 'Webinaire'),
  ('d0000000-0000-0000-0000-000000000002', 'Financement'),
  ('d0000000-0000-0000-0000-000000000002', 'FSU'),
  ('d0000000-0000-0000-0000-000000000002', 'Formation'),
  -- Event 3 tags
  ('d0000000-0000-0000-0000-000000000003', 'Formation'),
  ('d0000000-0000-0000-0000-000000000003', 'Atelier'),
  ('d0000000-0000-0000-0000-000000000003', 'Plateforme'),
  ('d0000000-0000-0000-0000-000000000003', 'Pratique'),
  -- Event 4 tags
  ('d0000000-0000-0000-0000-000000000004', 'Conférence'),
  ('d0000000-0000-0000-0000-000000000004', 'Sahel'),
  ('d0000000-0000-0000-0000-000000000004', 'Inclusion'),
  ('d0000000-0000-0000-0000-000000000004', 'Régional'),
  -- Event 5 tags
  ('d0000000-0000-0000-0000-000000000005', 'Certification'),
  ('d0000000-0000-0000-0000-000000000005', 'Audit'),
  ('d0000000-0000-0000-0000-000000000005', 'Formation'),
  ('d0000000-0000-0000-0000-000000000005', 'Qualité'),
  -- Event 6 tags
  ('d0000000-0000-0000-0000-000000000006', 'Conférence'),
  ('d0000000-0000-0000-0000-000000000006', 'PPP'),
  ('d0000000-0000-0000-0000-000000000006', 'Partenariat'),
  ('d0000000-0000-0000-0000-000000000006', 'Financement'),
  -- Event 7 tags
  ('d0000000-0000-0000-0000-000000000007', 'Hackathon'),
  ('d0000000-0000-0000-0000-000000000007', 'Innovation'),
  ('d0000000-0000-0000-0000-000000000007', 'Tech'),
  ('d0000000-0000-0000-0000-000000000007', 'Concours'),
  -- Event 8 tags
  ('d0000000-0000-0000-0000-000000000008', 'Webinaire'),
  ('d0000000-0000-0000-0000-000000000008', '5G'),
  ('d0000000-0000-0000-0000-000000000008', 'Financement'),
  ('d0000000-0000-0000-0000-000000000008', 'Télécom'),
  -- Event 9 tags
  ('d0000000-0000-0000-0000-000000000009', 'Conférence'),
  ('d0000000-0000-0000-0000-000000000009', 'Connectivité'),
  ('d0000000-0000-0000-0000-000000000009', 'Rural'),
  ('d0000000-0000-0000-0000-000000000009', 'Infrastructure'),
  -- Event 10 tags
  ('d0000000-0000-0000-0000-000000000010', 'Atelier'),
  ('d0000000-0000-0000-0000-000000000010', 'Gouvernance'),
  ('d0000000-0000-0000-0000-000000000010', 'FSU'),
  ('d0000000-0000-0000-0000-000000000010', 'Transparence')
on conflict (event_id, tag) do nothing;

-- =====================================================
-- 5. insert demo news articles (20 news)
-- =====================================================

insert into public.news (id, title, excerpt, content, category, source, image_url, published_at, is_public, author, read_time, language)
values
  -- News 1-5 (existing)
  ('d0000000-0000-0000-0000-000000000001', 'Lancement du Fonds de Service Universel pan-africain', 'Une initiative historique pour combler la fracture numérique en Afrique.', 'L''Union Africaine des Télécommunications annonce la création d''un fonds de service universel à l''échelle continentale. Ce fonds vise à financer les infrastructures de télécommunications dans les zones non desservies d''Afrique.', 'financement', 'UAT', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200', NOW() - INTERVAL '15 days', true, 'UAT Communication', '5 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000002', 'Partenariat avec la Banque Mondiale', 'Accord de financement de 500 millions USD pour les infrastructures.', 'La Banque Mondiale s''engage à soutenir les projets de connectivité dans 15 pays africains prioritaires. Ce financement permettra le déploiement de 10 000 km de fibre optique.', 'partenariat', 'UAT', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200', NOW() - INTERVAL '12 days', true, 'UAT Communication', '4 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000003', 'Formation des Points Focaux', 'Première session de formation réussie à Ouagadougou.', '25 points focaux de 10 pays différents ont participé à la formation sur l''utilisation de la plateforme USF-ADC. Cette session marque le début d''un programme de renforcement des capacités.', 'formation', 'UAT', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200', NOW() - INTERVAL '10 days', true, 'UAT Formation', '3 min', 'fr'),
  -- News 4-20 (new)
  ('d0000000-0000-0000-0000-000000000004', ' déploiement de la 5G en Afrique : Enjeux et opportunités', 'Analyse des défis du déploiement de la 5G sur le continent africain.', 'La 5G représente une opportunité unique pour accélérer la transformation numérique de l''Afrique. Cet article analyse les enjeux réglementaires, économiques et techniques du déploiement.', 'innovation', 'UAT', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200', NOW() - INTERVAL '9 days', true, 'Dr. Amadou Diallo', '7 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000005', 'Rapport annuel 2025 : Un an de progrès', 'Bilan des activités de l''UAT pour l''année 2025.', 'Le rapport annuel 2025 marque une étape significative dans le développement des télécommunications en Afrique. Découvrez les chiffres clés et les projets marquants de l''année.', 'rapport', 'UAT', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200', NOW() - INTERVAL '8 days', true, 'UAT Communication', '6 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000006', 'Nouveau cadre réglementaire pour le FSU', 'Les pays membres adoptent un cadre réglementaire harmonisé.', 'Dans un effort d''harmonisation, les pays membres de l''UAT ont adopté un nouveau cadre réglementaire pour la gestion des Fonds de Service Universel.', 'règlementation', 'UAT', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200', NOW() - INTERVAL '7 days', true, 'UAT Juridique', '5 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000007', 'Connectivité des zones rurales : Le modèle sénégalais', 'Comment le Sénégal réussit le défi de la connectivité rurale.', 'Le Sénégal présente un modèle innovant de déploiement d''infrastructures dans les zones rurales, basé sur un partenariat public-privé efficace.', 'étude', 'UAT', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200', NOW() - INTERVAL '6 days', true, 'Marie Kouassi', '8 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000008', 'Assemblée Générale 2026 : Les décisions clés', 'Compte rendu de l''Assemblée Générale de Kigali.', 'L''Assemblée Générale 2026 a pris plusieurs décisions importantes pour l''avenir des télécommunications en Afrique. Découvrez les principaux votes et résolutions.', 'événement', 'UAT', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200', NOW() - INTERVAL '5 days', true, 'UAT Communication', '4 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000009', 'L''éducation numérique en Afrique de l''Est', 'Initiatives pour l''éducation numérique dans la région EAC.', 'Les pays de la Communauté d''Afrique de l''Est lancent des initiatives conjointes pour promouvoir l''éducation numérique dans les écoles rurales.', 'éducation', 'UAT-EAC', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200', NOW() - INTERVAL '4 days', true, 'Bureau EAC', '6 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000010', 'Financement innovant : Les obligations zones blanches', 'Comment les obligations de déploiement financent le FSU.', 'Les obligations de couverture zones blanches représentent un mécanisme de financement innovant pour les Fonds de Service Universel.', 'financement', 'UAT', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200', NOW() - INTERVAL '3 days', true, 'Jean-Pierre Mbengue', '7 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000011', 'Infrastructure 5G : Le projet pilote du Nigeria', 'Le Nigeria lance son premier projet 5G à Lagos.', 'Le Nigeria devient le premier pays de la région à lancer un projet pilote 5G avec le soutien du Fonds de Service Universel.', 'innovation', 'UAT', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200', NOW() - INTERVAL '2 days', true, 'Délégué Nigeria', '5 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000012', 'Renforcement des capacités : Programme 2026-2030', 'Le nouveau programme de renforcement des capacités de l''UAT.', 'L''UAT lance un programme ambitieux de formation de 10 000 professionnels des télécommunications d''ici 2030.', 'formation', 'UAT', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200', NOW() - INTERVAL '1 day', true, 'UAT Formation', '4 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000013', 'Téléconsultation médicale en Afrique rurale', 'Comment la téléconsultation sauve des vies grâce au FSU.', 'Le déploiement d''infrastructures de télécommunication dans les zones rurales permet le développement de services de téléconsultation médicale vitaux.', 'santé', 'UAT', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200', NOW() - INTERVAL '20 hours', true, 'Dr. Aïcha Koné', '6 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000014', 'L''agriculture numérique en zone Cédéao', 'La transformation numérique de l''agriculture en Afrique de l''Ouest.', 'Les projets de connectivité rurale financés par le FSU permettent le développement de solutions d''agriculture numérique.', 'agriculture', 'UAT', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200', NOW() - INTERVAL '18 hours', true, 'Bureau CEDEAO', '5 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000015', 'Sécurité des réseaux : Nouvelles directives', 'Directives de l''UAT pour la sécurité des réseaux de télécommunications.', 'L''UAT publie de nouvelles directives pour renforcer la cybersécurité des réseaux de télécommunications nationaux.', 'sécurité', 'UAT', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200', NOW() - INTERVAL '15 hours', true, 'UAT Technique', '7 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000016', 'Entreprenariat numérique : Concours 2026', 'Lancement du concours d''entreprenariat numérique de l''UAT.', 'L''UAT lance son concours d''entreprenariat numérique pour soutenir les start-ups du secteur des télécommunications.', 'concours', 'UAT', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200', NOW() - INTERVAL '12 hours', true, 'UAT Innovation', '4 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000017', 'Coopération régionale : Accord UAT-UE', 'Nouvel accord de coopération entre l''UAT et l''Union Européenne.', 'L''accord prévoit un financement de 200 millions d''euros pour les projets de connectivité en Afrique.', 'partenariat', 'UAT', 'https://images.unsplash.com/photo-1529307324749-529fee061a13?w=1200', NOW() - INTERVAL '10 hours', true, 'UAT Communication', '5 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000018', 'Digitalisation des services publics', 'Comment le FSU finance la digitalisation administrative.', 'Les projets financés par le FSU permettent la digitalisation des services publics dans les zones rurales.', 'e-gouvernement', 'UAT', 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200', NOW() - INTERVAL '8 hours', true, 'Bureau SADC', '6 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000019', 'Énergie solaire pour les sites télécoms', 'Initiatives pour une télécommunication verte en Afrique.', 'L''UAT encourage l''utilisation d''énergie solaire pour alimenter les sites de télécommunication en zone rurale.', 'environnement', 'UAT', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200', NOW() - INTERVAL '6 hours', true, 'UAT Environnement', '5 min', 'fr'),
  ('d0000000-0000-0000-0000-000000000020', 'Conférence Spectrum 2026', 'Préparatifs de la Conférence Spectrum 2026 à Nairobi.', 'La Conférence Spectrum 2026 réunira les régulateurs de toute l''Afrique pour discuter de la gestion du spectre radioélectrique.', 'événement', 'UAT', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200', NOW() - INTERVAL '4 hours', true, 'UAT Communication', '3 min', 'fr')
on conflict (id) do nothing;

-- =====================================================
-- 6. insert news tags
-- =====================================================

insert into public.news_tags (news_id, tag)
values
  -- News 1-5 tags
  ('d0000000-0000-0000-0000-000000000001', 'FSU'), ('d0000000-0000-0000-0000-000000000001', 'Financement'), ('d0000000-0000-0000-0000-000000000001', 'Infrastructure'), ('d0000000-0000-0000-0000-000000000001', 'Pan-africain'),
  ('d0000000-0000-0000-0000-000000000002', 'Partenariat'), ('d0000000-0000-0000-0000-000000000002', 'Banque Mondiale'), ('d0000000-0000-0000-0000-000000000002', 'Investissement'), ('d0000000-0000-0000-0000-000000000002', 'Développement'),
  ('d0000000-0000-0000-0000-000000000003', 'Formation'), ('d0000000-0000-0000-0000-000000000003', 'Capacity Building'), ('d0000000-0000-0000-0000-000000000003', 'Points Focaux'),
  ('d0000000-0000-0000-0000-000000000004', '5G'), ('d0000000-0000-0000-0000-000000000004', 'Innovation'), ('d0000000-0000-0000-0000-000000000004', 'Technologie'), ('d0000000-0000-0000-0000-000000000004', 'Déploiement'),
  ('d0000000-0000-0000-0000-000000000005', 'Rapport'), ('d0000000-0000-0000-0000-000000000005', 'Annuel'), ('d0000000-0000-0000-0000-000000000005', '2025'), ('d0000000-0000-0000-0000-000000000005', 'Bilan'),
  -- News 6-10 tags
  ('d0000000-0000-0000-0000-000000000006', 'Règlementation'), ('d0000000-0000-0000-0000-000000000006', 'Harmonisation'), ('d0000000-0000-0000-0000-000000000006', 'Cadre légal'),
  ('d0000000-0000-0000-0000-000000000007', 'Connectivité'), ('d0000000-0000-0000-0000-000000000007', 'Sénégal'), ('d0000000-0000-0000-0000-000000000007', 'PPP'), ('d0000000-0000-0000-0000-000000000007', 'Rural'),
  ('d0000000-0000-0000-0000-000000000008', 'Assemblée'), ('d0000000-0000-0000-0000-000000000008', 'Kigali'), ('d0000000-0000-0000-0000-000000000008', 'Décisions'),
  ('d0000000-0000-0000-0000-000000000009', 'Éducation'), ('d0000000-0000-0000-0000-000000000009', 'EAC'), ('d0000000-0000-0000-0000-000000000009', 'Numérique'),
  ('d0000000-0000-0000-0000-000000000010', 'Financement'), ('d0000000-0000-0000-0000-000000000010', 'Zones blanches'), ('d0000000-0000-0000-0000-000000000010', 'Obligations'),
  -- News 11-15 tags
  ('d0000000-0000-0000-0000-000000000011', '5G'), ('d0000000-0000-0000-0000-000000000011', 'Nigeria'), ('d0000000-0000-0000-0000-000000000011', 'Pilote'), ('d0000000-0000-0000-0000-000000000011', 'Lagos'),
  ('d0000000-0000-0000-0000-000000000012', 'Formation'), ('d0000000-0000-0000-0000-000000000012', 'Capacités'), ('d0000000-0000-0000-0000-000000000012', '2026-2030'),
  ('d0000000-0000-0000-0000-000000000013', 'Santé'), ('d0000000-0000-0000-0000-000000000013', 'Téléconsultation'), ('d0000000-0000-0000-0000-000000000013', 'Rural'), ('d0000000-0000-0000-0000-000000000013', 'Vie'),
  ('d0000000-0000-0000-0000-000000000014', 'Agriculture'), ('d0000000-0000-0000-0000-000000000014', 'CEDEAO'), ('d0000000-0000-0000-0000-000000000014', 'Numérique'),
  ('d0000000-0000-0000-0000-000000000015', 'Sécurité'), ('d0000000-0000-0000-0000-000000000015', 'Cybersécurité'), ('d0000000-0000-0000-0000-000000000015', 'Directives'),
  -- News 16-20 tags
  ('d0000000-0000-0000-0000-000000000016', 'Concours'), ('d0000000-0000-0000-0000-000000000016', 'Start-up'), ('d0000000-0000-0000-0000-000000000016', 'Innovation'),
  ('d0000000-0000-0000-0000-000000000017', 'Coopération'), ('d0000000-0000-0000-0000-000000000017', 'UE'), ('d0000000-0000-0000-0000-000000000017', 'Financement'),
  ('d0000000-0000-0000-0000-000000000018', 'E-gouvernement'), ('d0000000-0000-0000-0000-000000000018', 'Digitalisation'), ('d0000000-0000-0000-0000-000000000018', 'SADC'),
  ('d0000000-0000-0000-0000-000000000019', 'Environnement'), ('d0000000-0000-0000-0000-000000000019', 'Solaire'), ('d0000000-0000-0000-0000-000000000019', 'Vert'),
  ('d0000000-0000-0000-0000-000000000020', 'Conférence'), ('d0000000-0000-0000-0000-000000000020', 'Spectrum'), ('d0000000-0000-0000-0000-000000000020', 'Nairobi'), ('d0000000-0000-0000-0000-000000000020', 'Régulation')
on conflict (news_id, tag) do nothing;

-- =====================================================
-- 7. insert demo projects (74 projects - covering all 54 countries)
-- =====================================================
-- Note: Projects are organized by country with varying themes and statuses

-- Côte d'Ivoire (4 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000001', (select id from public.countries where code_iso = 'ci'), 'Connectivité Rurale Phase 1 - Nord', 'Déploiement de la connectivité haut débit dans 150 localités du Nord de la Côte d''Ivoire.', 'in_progress', 45000000.00, 9.7902, -4.0333, 'CEDEAO', 'connectivite', 65, '300000', 'Orange CI'),
  ('a0000000-0000-0000-0000-000000000002', (select id from public.countries where code_iso = 'ci'), 'Écoles Numériques Côte d''Ivoire', 'Équipement de 200 écoles primaires en ordinateurs et connexion internet.', 'in_progress', 12000000.00, 5.3600, -4.0083, 'CEDEAO', 'education', 40, '50000', 'MTN CI'),
  ('a0000000-0000-0000-0000-000000000003', (select id from public.countries where code_iso = 'ci'), 'Centres Communautaires Numériques - Abidjan', 'Création de 50 centres communautaires numériques dans les quartiers d''Abidjan.', 'planned', 8000000.00, 5.3600, -3.8789, 'CEDEAO', 'social', 0, '200000', 'Moov CI'),
  ('a0000000-0000-0000-0000-000000000004', (select id from public.countries where code_iso = 'ci'), 'Télé-santé Région Ouest', 'Déploiement de plateformes de télé-santé dans 30 centres de santé région Ouest.', 'completed', 6500000.00, 6.8200, -6.6800, 'CEDEAO', 'sante', 100, '150000', 'Orange CI')
on conflict do nothing;

-- Sénégal (4 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000005', (select id from public.countries where code_iso = 'sn'), 'Sites Solaires Autonomes', 'Déploiement de 150 sites télécoms alimentés par énergie solaire.', 'completed', 32000000.00, 14.7167, -17.4677, 'CEDEAO', 'energie', 100, '300000', 'Orange Sénégal'),
  ('a0000000-0000-0000-0000-000000000006', (select id from public.countries where code_iso = 'sn'), 'Hub numérique de Dakar', 'Centre de données et incubateur technologique.', 'planned', 12000000.00, 14.7167, -17.4677, 'CEDEAO', 'infrastructure', 0, '50000', 'Sonatel'),
  ('a0000000-0000-0000-0000-000000000007', (select id from public.countries where code_iso = 'sn'), 'Fibre Optique Casamance', 'Extension du réseau fibre optique dans la région de Casamance.', 'in_progress', 28000000.00, 12.5500, -16.2700, 'CEDEAO', 'connectivite', 45, '180000', 'Orange Sénégal'),
  ('a0000000-0000-0000-0000-000000000008', (select id from public.countries where code_iso = 'sn'), 'Éducation Numérique Saint-Louis', 'Équipement de 100 écoles de la région de Saint-Louis.', 'in_progress', 9000000.00, 16.0200, -16.4500, 'CEDEAO', 'education', 60, '80000', 'Free Sénégal')
on conflict do nothing;

-- Nigeria (4 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000009', (select id from public.countries where code_iso = 'ng'), 'Réseau fibre optique Lagos-Abuja', 'Déploiement de 900 km de fibre optique reliant Lagos à Abuja.', 'in_progress', 45000000.00, 7.4951, 3.3947, 'CEDEAO', 'connectivite', 75, '1500000', 'MTN Nigeria'),
  ('a0000000-0000-0000-0000-000000000010', (select id from public.countries where code_iso = 'ng'), '5G Pilot Project - Lagos', 'Projet pilote 5G dans 5 districts de Lagos.', 'planned', 35000000.00, 6.5244, 3.3792, 'CEDEAO', 'innovation', 0, '2000000', 'MTN Nigeria'),
  ('a0000000-0000-0000-0000-000000000011', (select id from public.countries where code_iso = 'ng'), 'E-Agriculture Nord Nigeria', 'Plateforme d''e-agriculture pour 500 000 agriculteurs.', 'in_progress', 15000000.00, 11.5800, 7.5200, 'CEDEAO', 'agriculture', 55, '500000', 'Airtel Nigeria'),
  ('a0000000-0000-0000-0000-000000000012', (select id from public.countries where code_iso = 'ng'), 'Connectivité Rivers State', 'Déploiement haut débit dans 200 localités Rivers State.', 'completed', 22000000.00, 4.8100, 6.8200, 'CEDEAO', 'connectivite', 100, '800000', 'Globacom')
on conflict do nothing;

-- Ghana (3 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000013', (select id from public.countries where code_iso = 'gh'), 'Digital Accra Project', 'Transformation numérique complète d''Accra avec WiFi public.', 'completed', 28000000.00, 5.5500, -0.2100, 'CEDEAO', 'smart-city', 100, '500000', 'MTN Ghana'),
  ('a0000000-0000-0000-0000-000000000014', (select id from public.countries where code_iso = 'gh'), 'Écoles Connectées Ghana', 'Connexion internet de 500 écoles primaires.', 'in_progress', 18000000.00, 7.9500, -1.0800, 'CEDEAO', 'education', 70, '300000', 'Vodafone Ghana'),
  ('a0000000-0000-0000-0000-000000000015', (select id from public.countries where code_iso = 'gh'), 'Télé-médecine Northern Region', 'Centres de télé-médecine dans 50 districts du Nord.', 'planned', 12000000.00, 9.4000, -0.8400, 'CEDEAO', 'sante', 0, '200000', 'AirtelTigo')
on conflict do nothing;

-- Mali (3 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000016', (select id from public.countries where code_iso = 'ml'), 'Connectivité Région Nord', 'Déploiement haut débit dans les régions de Tombouctou et Gao.', 'in_progress', 35000000.00, 17.5700, -3.0500, 'CEDEAO', 'connectivite', 50, '400000', 'Malitel'),
  ('a0000000-0000-0000-0000-000000000017', (select id from public.countries where code_iso = 'ml'), 'Projets Éducation Rurale', 'Tablettes numériques pour 200 écoles rurales.', 'completed', 8500000.00, 13.4500, -5.5500, 'CEDEAO', 'education', 100, '120000', 'Orange Mali'),
  ('a0000000-0000-0000-0000-000000000018', (select id from public.countries where code_iso = 'ml'), 'Eau Connectée Mali', 'Système de gestion intelligente de l''eau connecté IoT.', 'planned', 9500000.00, 12.6500, -7.5500, 'CEDEAO', 'environnement', 0, '250000', 'Malitel')
on conflict do nothing;

-- Burkina Faso (3 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000019', (select id from public.countries where code_iso = 'bf'), 'Réseau National Haut Débit', 'Déploiement fibre optique sur 2000 km.', 'in_progress', 42000000.00, 12.2383, -1.5616, 'CEDEAO', 'connectivite', 60, '800000', 'Orange Burkina'),
  ('a0000000-0000-0000-0000-000000000020', (select id from public.countries where code_iso = 'bf'), 'Centres Multifonctionnels', '50 centres multifonctionnels avec internet.', 'planned', 15000000.00, 12.3500, -1.5500, 'CEDEAO', 'social', 0, '300000', 'Telmob'),
  ('a0000000-0000-0000-0000-000000000021', (select id from public.countries where code_iso = 'bf'), 'E-Santé Burkina', 'Plateforme e-santé pour les zones rurales.', 'completed', 11000000.00, 11.1500, -0.3500, 'CEDEAO', 'sante', 100, '200000', 'Orange Burkina')
on conflict do nothing;

-- Bénin (2 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000022', (select id from public.countries where code_iso = 'bj'), 'Smart Cotonou', 'Ville intelligente avec IoT et connectivité.', 'in_progress', 25000000.00, 6.3956, 2.4367, 'CEDEAO', 'smart-city', 55, '400000', 'MTN Benin'),
  ('a0000000-0000-0000-0000-000000000023', (select id from public.countries where code_iso = 'bj'), 'Écoles Numériques', '150 écoles équipées en matériel informatique.', 'completed', 9000000.00, 7.4500, 2.0500, 'CEDEAO', 'education', 100, '180000', 'Benin Telecom')
on conflict do nothing;

-- Togo (2 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000024', (select id from public.countries where code_iso = 'tg'), 'Fibre Optique Lomé-Kara', 'Déploiement fibre optique sur l''axe Lomé-Kara.', 'in_progress', 28000000.00, 8.6200, 1.1200, 'CEDEAO', 'connectivite', 70, '500000', 'TogoCom'),
  ('a0000000-0000-0000-0000-000000000025', (select id from public.countries where code_iso = 'tg'), 'Télé-enseignement', 'Programme de télé-enseignement pour 100 écoles.', 'planned', 8000000.00, 7.5500, 0.8500, 'CEDEAO', 'education', 0, '150000', 'Moov Togo')
on conflict do nothing;

-- Niger (2 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000026', (select id from public.countries where code_iso = 'ne'), 'Connectivité Régions Sahéliennes', 'Déploiement dans les régions de Tillabéri et Zinder.', 'in_progress', 32000000.00, 17.7500, 8.0500, 'CEDEAO', 'connectivite', 45, '350000', 'Orange Niger'),
  ('a0000000-0000-0000-0000-000000000027', (select id from public.countries where code_iso = 'ne'), 'Eau Numérique', 'Projet de gestion intelligente de l''eau.', 'completed', 10000000.00, 13.5500, 5.5500, 'CEDEAO', 'environnement', 100, '280000', 'Niger Telecom')
on conflict do nothing;

-- Guinée (2 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000028', (select id from public.countries where code_iso = 'gn'), 'Réseau National Guinée', 'Extension du réseau mobile 4G.', 'planned', 45000000.00, 9.9456, -9.6966, 'CEDEAO', 'connectivite', 0, '600000', 'MTN Guinée'),
  ('a0000000-0000-0000-0000-000000000029', (select id from public.countries where code_iso = 'gn'), 'Formation Digitale', 'Centres de formation numérique jeunes.', 'in_progress', 7500000.00, 10.1500, -13.5500, 'CEDEAO', 'education', 40, '100000', 'Orange Guinée')
on conflict do nothing;

-- Cameroun (4 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000030', (select id from public.countries where code_iso = 'cm'), 'Fibre Optique Douala-Yaoundé', 'Autoroute informationnelle entre les deux capitales.', 'completed', 55000000.00, 4.0500, 11.5500, 'CEEAC', 'connectivite', 100, '1200000', 'MTN Cameroun'),
  ('a0000000-0000-0000-0000-000000000031', (select id from public.countries where code_iso = 'cm'), 'Écoles Rurales Cameroun', '300 écoles rurales connectées.', 'in_progress', 22000000.00, 5.6500, 12.0500, 'CEEAC', 'education', 65, '250000', 'Orange Cameroun'),
  ('a0000000-0000-0000-0000-000000000032', (select id from public.countries where code_iso = 'cm'), 'Smart Agriculture Cameroun', 'Plateforme d''agriculture intelligente.', 'planned', 18000000.00, 3.8500, 11.5500, 'CEEAC', 'agriculture', 0, '200000', 'Nexttel'),
  ('a0000000-0000-0000-0000-000000000033', (select id from public.countries where code_iso = 'cm'), 'E-Santé Douala', 'Hôpitaux connectés de Douala.', 'in_progress', 14000000.00, 4.0500, 9.7500, 'CEEAC', 'sante', 50, '180000', 'MTN Cameroun')
on conflict do nothing;

-- RD Congo (3 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000034', (select id from public.countries where code_iso = 'cd'), 'Connectivité Est RDC', 'Déploiement dans les provinces de l''Est.', 'in_progress', 48000000.00, -0.5500, 25.2500, 'SADC', 'connectivite', 40, '800000', 'Vodacom DRC'),
  ('a0000000-0000-0000-0000-000000000035', (select id from public.countries where code_iso = 'cd'), 'Éducation Numérique Kinshasa', '200 écoles de Kinshasa équipées.', 'planned', 16000000.00, -4.3500, 15.3500, 'SADC', 'education', 0, '400000', 'Orange RDC'),
  ('a0000000-0000-0000-0000-000000000036', (select id from public.countries where code_iso = 'cd'), 'Télé-médecine RDC', 'Plateforme nationale de télé-médecine.', 'completed', 25000000.00, -2.8500, 23.6500, 'SADC', 'sante', 100, '500000', 'Airtel DRC')
on conflict do nothing;

-- Kenya (4 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000037', (select id from public.countries where code_iso = 'ke'), 'Connectivité rurale Rift Valley', 'Extension du réseau mobile 4G dans la vallée du Rift.', 'in_progress', 8500000.00, -0.0236, 37.9062, 'EAC', 'connectivite', 55, '350000', 'Safaricom'),
  ('a0000000-0000-0000-0000-000000000038', (select id from public.countries where code_iso = 'ke'), 'DigiSchool Kenya', 'Numérisation de 500 écoles primaires.', 'completed', 20000000.00, -1.2864, 36.8219, 'EAC', 'education', 100, '400000', 'Telkom Kenya'),
  ('a0000000-0000-0000-0000-000000000039', (select id from public.countries where code_iso = 'ke'), 'Smart Farming Kenya', 'Agriculture intelligente avec IoT.', 'in_progress', 15000000.00, -0.0236, 35.2500, 'EAC', 'agriculture', 65, '250000', 'Safaricom'),
  ('a0000000-0000-0000-0000-000000000040', (select id from public.countries where code_iso = 'ke'), '5G Mombasa', 'Déploiement 5G à Mombasa.', 'planned', 30000000.00, -4.0500, 39.6500, 'EAC', 'innovation', 0, '800000', 'Safaricom')
on conflict do nothing;

-- Afrique du Sud (4 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000041', (select id from public.countries where code_iso = 'za'), 'Smart Grid Cape Town', 'Réseau électrique intelligent pour la région du Cap.', 'completed', 32000000.00, -33.9249, 18.4241, 'SADC', 'energie', 100, '600000', 'Vodacom'),
  ('a0000000-0000-0000-0000-000000000042', (select id from public.countries where code_iso = 'za'), 'Township Connectivity', 'Connectivité haut débit pour 100 townships.', 'in_progress', 45000000.00, -26.2000, 28.0500, 'SADC', 'connectivite', 70, '2500000', 'MTN SA'),
  ('a0000000-0000-0000-0000-000000000043', (select id from public.countries where code_iso = 'za'), 'E-Learning Gauteng', 'Programme e-learning pour 400 écoles.', 'planned', 28000000.00, -26.2500, 28.1500, 'SADC', 'education', 0, '800000', 'Vodacom'),
  ('a0000000-0000-0000-0000-000000000044', (select id from public.countries where code_iso = 'za'), 'Digital Health KwaZulu-Natal', 'Plateforme santé numérique provinciale.', 'in_progress', 22000000.00, -28.5500, 30.8500, 'SADC', 'sante', 45, '500000', 'Telkom SA')
on conflict do nothing;

-- Maroc (4 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000045', (select id from public.countries where code_iso = 'ma'), 'Plateforme e-gouvernement Rabat', 'Digitalisation des services administratifs.', 'in_progress', 15000000.00, 34.0209, -6.8416, 'UMA', 'e-gouvernement', 75, '1200000', 'IAM'),
  ('a0000000-0000-0000-0000-000000000046', (select id from public.countries where code_iso = 'ma'), 'Smart City Casablanca', 'Projet ville intelligente Casablanca.', 'completed', 55000000.00, 33.5731, -7.5898, 'UMA', 'smart-city', 100, '3500000', 'IAM'),
  ('a0000000-0000-0000-0000-000000000047', (select id from public.countries where code_iso = 'ma'), 'Connectivité Rurale Maroc', 'Déploiement haut débit zones rurales.', 'in_progress', 42000000.00, 31.6500, -5.8500, 'UMA', 'connectivite', 60, '1500000', 'IAM'),
  ('a0000000-0000-0000-0000-000000000048', (select id from public.countries where code_iso = 'ma'), 'E-Commerce Atlas', 'Plateforme e-commerce pour régions Atlas.', 'planned', 12000000.00, 31.8500, -6.9500, 'UMA', 'economie', 0, '300000', 'IAM')
on conflict do nothing;

-- Tunisie (3 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000049', (select id from public.countries where code_iso = 'tn'), 'Smart Tunis', 'Transformation numérique de Tunis.', 'completed', 35000000.00, 36.8065, 10.1815, 'UMA', 'smart-city', 100, '900000', 'Tunisie Télécom'),
  ('a0000000-0000-0000-0000-000000000050', (select id from public.countries where code_iso = 'tn'), 'Education Numérique', '400 écoles équipées.', 'in_progress', 18000000.00, 34.7500, 10.7500, 'UMA', 'education', 70, '400000', 'Ooredoo TN'),
  ('a0000000-0000-0000-0000-000000000051', (select id from public.countries where code_iso = 'tn'), 'E-Santé Tunisie', 'Hôpitaux connectés.', 'planned', 14000000.00, 33.8500, 9.5500, 'UMA', 'sante', 0, '250000', 'Tunisie Télécom')
on conflict do nothing;

-- Algérie (3 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000052', (select id from public.countries where code_iso = 'dz'), 'Fibre Optique Sud', 'Déploiement fibre optique Sud algérien.', 'in_progress', 65000000.00, 26.8500, 5.0500, 'UMA', 'connectivite', 50, '2000000', 'Algérie Télécom'),
  ('a0000000-0000-0000-0000-000000000053', (select id from public.countries where code_iso = 'dz'), 'Smart Farming', 'Agriculture intelligente Sud.', 'planned', 28000000.00, 28.0500, 2.6500, 'UMA', 'agriculture', 0, '400000', 'Mobilis'),
  ('a0000000-0000-0000-0000-000000000054', (select id from public.countries where code_iso = 'dz'), 'E-Learning Algérie', 'Plateforme nationale e-learning.', 'completed', 35000000.00, 36.7500, 3.0500, 'UMA', 'education', 100, '3000000', 'Algérie Télécom')
on conflict do nothing;

-- Éthiopie (3 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000055', (select id from public.countries where code_iso = 'et'), 'Digital Ethiopia', 'Stratégie de transformation numérique.', 'in_progress', 100000000.00, 9.1450, 40.4897, 'EAC', 'digitalisation', 60, '5000000', 'Ethio Telecom'),
  ('a0000000-0000-0000-0000-000000000056', (select id from public.countries where code_iso = 'et'), 'Rural Connectivity', 'Connectivité rurale nationale.', 'planned', 75000000.00, 8.5500, 39.8500, 'EAC', 'connectivite', 0, '15000000', 'Ethio Telecom'),
  ('a0000000-0000-0000-0000-000000000057', (select id from public.countries where code_iso = 'et'), 'Health Tech Ethiopia', 'Technologie santé.', 'completed', 45000000.00, 9.0500, 38.7500, 'EAC', 'sante', 100, '800000', 'Ethio Telecom')
on conflict do nothing;

-- Mozambique (2 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000058', (select id from public.countries where code_iso = 'mz'), 'Fibre Maputo', 'Réseau fibre Maputo.', 'in_progress', 28000000.00, -25.9692, 32.5732, 'SADC', 'connectivite', 55, '400000', 'Vodacom Mozambique'),
  ('a0000000-0000-0000-0000-000000000059', (select id from public.countries where code_iso = 'mz'), 'Écoles Numériques', '200 écoles connectées.', 'planned', 12000000.00, -18.8500, 35.5500, 'SADC', 'education', 0, '300000', 'Movitel')
on conflict do nothing;

-- Zambie (2 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000060', (select id from public.countries where code_iso = 'zm'), 'Smart Farming Zambia', 'Agriculture intelligente.', 'completed', 18000000.00, -13.2500, 27.8500, 'SADC', 'agriculture', 100, '500000', 'MTN Zambia'),
  ('a0000000-0000-0000-0000-000000000061', (select id from public.countries where code_iso = 'zm'), 'Health Connect', 'Hôpitaux connectés.', 'in_progress', 14000000.00, -15.4500, 28.3500, 'SADC', 'sante', 65, '250000', 'Airtel Zambia')
on conflict do nothing;

-- Tanzanie (2 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000062', (select id from public.countries where code_iso = 'tz'), 'Fibre Tanzania', 'Réseau national fibre.', 'in_progress', 55000000.00, -6.3690, 34.8888, 'SADC', 'connectivite', 70, '2000000', 'Vodacom Tanzania'),
  ('a0000000-0000-0000-0000-000000000063', (select id from public.countries where code_iso = 'tz'), 'Education Tech', 'Écoles connectées.', 'planned', 20000000.00, -5.0500, 35.7500, 'SADC', 'education', 0, '500000', 'Tigo Tanzania')
on conflict do nothing;

-- Rwanda (3 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000064', (select id from public.countries where code_iso = 'rw'), 'Smart Kigali', 'Ville intelligente Kigali.', 'completed', 40000000.00, -1.9706, 30.1044, 'EAC', 'smart-city', 100, '1200000', 'MTN Rwanda'),
  ('a0000000-0000-0000-0000-000000000065', (select id from public.countries where code_iso = 'rw'), 'Rural Broadband', 'Haut débit rural.', 'in_progress', 25000000.00, -1.6500, 29.8500, 'EAC', 'connectivite', 75, '600000', 'MTN Rwanda'),
  ('a0000000-0000-0000-0000-000000000066', (select id from public.countries where code_iso = 'rw'), 'E-Health Rwanda', 'Santé numérique.', 'planned', 18000000.00, -2.0500, 30.5500, 'EAC', 'sante', 0, '300000', 'Airtel Rwanda')
on conflict do nothing;

-- Ouganda (2 projects)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000067', (select id from public.countries where code_iso = 'ug'), 'National Broadband', 'Haut débit national.', 'in_progress', 45000000.00, 1.3733, 32.2903, 'EAC', 'connectivite', 60, '1500000', 'MTN Uganda'),
  ('a0000000-0000-0000-0000-000000000068', (select id from public.countries where code_iso = 'ug'), 'Education Connect', 'Écoles connectées.', 'completed', 15000000.00, 0.3500, 32.5500, 'EAC', 'education', 100, '400000', 'Airtel Uganda')
on conflict do nothing;

-- Égypte (1 project)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000069', (select id from public.countries where code_iso = 'eg'), 'Digital Egypt', 'Transformation numérique.', 'in_progress', 120000000.00, 26.8206, 30.8025, 'North Africa', 'digitalisation', 75, '10000000', 'Telecom Egypt')
on conflict do nothing;

-- Additional projects to reach 74 total (5 more)
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  ('a0000000-0000-0000-0000-000000000070', (select id from public.countries where code_iso = 'ci'), 'Smart San Pedro', 'Ville intelligente San Pedro.', 'planned', 18000000.00, 4.7500, -6.6500, 'CEDEAO', 'smart-city', 0, '200000', 'Orange CI'),
  ('a0000000-0000-0000-0000-000000000071', (select id from public.countries where code_iso = 'sn'), 'Digital Saint-Louis', 'Transformation numérique Saint-Louis.', 'in_progress', 15000000.00, 16.0200, -16.4500, 'CEDEAO', 'digitalisation', 45, '150000', 'Orange Sénégal'),
  ('a0000000-0000-0000-0000-000000000072', (select id from public.countries where code_iso = 'ke'), 'Tech Hubs Kenya', 'Incubateurs technologiques.', 'completed', 22000000.00, -1.2864, 36.8219, 'EAC', 'innovation', 100, '100000', 'Safaricom'),
  ('a0000000-0000-0000-0000-000000000073', (select id from public.countries where code_iso = 'za'), '5G South Africa', 'Déploiement 5G national.', 'in_progress', 150000000.00, -30.5500, 25.7500, 'SADC', 'innovation', 50, '5000000', 'Vodacom'),
  ('a0000000-0000-0000-0000-000000000074', (select id from public.countries where code_iso = 'ma'), 'Renewable Energy Tech', 'Énergie renouvelable télécoms.', 'planned', 25000000.00, 31.6500, -7.9500, 'UMA', 'energie', 0, '300000', 'IAM')
on conflict do nothing;

-- =====================================================
-- 8. insert project images
-- =====================================================

insert into public.project_images (id, project_id, image_url, sort_order)
values
  -- Côte d'Ivoire
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', 1),
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', 2),
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', 1),
  -- Sénégal
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80', 1),
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', 1),
  -- Nigeria
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80', 1),
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 1),
  -- Kenya
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000037', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', 1),
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000038', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80', 1),
  -- South Africa
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000041', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80', 1),
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000042', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', 1),
  -- Morocco
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000045', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80', 1),
  (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000046', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80', 1)
on conflict do nothing;

-- =====================================================
-- 9. insert project tags
-- =====================================================

insert into public.project_tags (name)
values
  ('fibre'), ('rural'), ('5G'), ('CEDEAO'), ('éducation'), ('formation'), ('digitalisation'),
  ('smart-city'), ('centre-communautaire'), ('santé'), ('télé-santé'), ('solaire'),
  ('énergie-verte'), ('off-grid'), ('hub'), ('data-center'), ('incubateur'), ('casamance'),
  ('saint-louis'), ('lagos'), ('abuja'), ('pilote'), ('agriculture'), ('e-agriculture'),
  ('iot'), ('rivers-state'), ('4G'), ('rift-valley'), ('e-learning'), ('smart-farming'),
  ('mombasa'), ('smart-grid'), ('capetown'), ('énergie'), ('township'), ('connectivité'),
  ('gauteng'), ('e-santé'), ('kwazulu-natal'), ('e-gouvernement'), ('digitalisation'),
  ('rabat'), ('casablanca'), ('rural'), ('haut-débit'), ('e-commerce'), ('atlas'), ('économie')
on conflict do nothing;

insert into public.project_project_tags (project_id, tag_id)
select p.id, t.id
from public.projects p
cross join public.project_tags t
where (p.title = 'Extension fibre optique' and t.name = 'fibre')
   or (p.title = 'Extension fibre optique' and t.name = 'rural')
   or (p.title = 'Couverture 5G' and t.name = '5G')
   or (p.title = 'Centre de formation numérique' and t.name = 'éducation')
on conflict do nothing;

-- =====================================================
-- 10. insert demo documents (30 documents)
-- =====================================================

insert into public.documents (id, title, description, category, file_name, file_path, file_size, mime_type, is_public, type, language, published_at, thumbnail, featured)
values
  -- Guides (8)
  ('d0000000-0000-0000-0000-000000000001', 'Guide de mise en œuvre du FSU', 'Guide complet pour la mise en place d''un Fonds de Service Universel national.', 'guides', 'guide_fsu_implementation.pdf', 'documents/guide_fsu_implementation.pdf', 2500000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '30 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', true),
  ('d0000000-0000-0000-0000-000000000002', 'Guide des bonnes pratiques FSU', 'Recueil des bonnes pratiques pour la gestion des FSU.', 'guides', 'bonnes_practices_fsu.pdf', 'documents/bonnes_practices_fsu.pdf', 3200000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '25 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', true),
  ('d0000000-0000-0000-0000-000000000003', 'Guide de financement télécom', 'Stratégies de financement pour les projets télécoms.', 'guides', 'guide_financement_telecom.pdf', 'documents/guide_financement_telecom.pdf', 2800000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '20 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000004', 'Guide de la réglementation UAT', 'Vue d''ensemble de la réglementation UAT.', 'guides', 'guide_reglement_uat.pdf', 'documents/guide_reglement_uat.pdf', 1900000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '18 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000005', 'Guide de la 5G en Afrique', 'Comprendre le déploiement de la 5G en Afrique.', 'guides', 'guide_5g_afrique.pdf', 'documents/guide_5g_afrique.pdf', 4500000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '15 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', true),
  ('d0000000-0000-0000-0000-000000000006', 'Guide des partenariats PPP', 'Comment structurer des partenariats public-privé.', 'guides', 'guide_ppp_telecom.pdf', 'documents/guide_ppp_telecom.pdf', 3600000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '12 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000007', 'Guide de l''audit FSU', 'Méthodologie d''audit des Fonds de Service Universel.', 'guides', 'guide_audit_fsu.pdf', 'documents/guide_audit_fsu.pdf', 2800000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '10 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000008', 'Guide de la gouvernance numérique', 'Principes de gouvernance pour le secteur numérique.', 'guides', 'guide_gouvernance_numerique.pdf', 'documents/guide_gouvernance_numerique.pdf', 3100000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '8 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  -- Reports (10)
  ('d0000000-0000-0000-0000-000000000009', 'Rapport annuel 2025', 'Rapport d''activité de l''Union Africaine des Télécommunications pour l''année 2025.', 'reports', 'rapport_annuel_2025.pdf', 'documents/rapport_annuel_2025.pdf', 5200000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '5 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', true),
  ('d0000000-0000-0000-0000-000000000010', 'Rapport sur la connectivité 2025', 'Analyse de l''état de la connectivité en Afrique.', 'reports', 'rapport_connectivite_2025.pdf', 'documents/rapport_connectivite_2025.pdf', 4800000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '28 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000011', 'Rapport FSU CEDEAO 2025', 'Situation des FSU dans la zone CEDEAO.', 'reports', 'rapport_fsu_cedeao_2025.pdf', 'documents/rapport_fsu_cedeao_2025.pdf', 3900000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '22 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000012', 'Rapport FSU EAC 2025', 'Situation des FSU dans la zone EAC.', 'reports', 'rapport_fsu_eac_2025.pdf', 'documents/rapport_fsu_eac_2025.pdf', 3500000, 'application/pdf', true, 'pdf', 'en', NOW() - INTERVAL '20 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000013', 'Rapport FSU SADC 2025', 'Situation des FSU dans la zone SADC.', 'reports', 'rapport_fsu_sadc_2025.pdf', 'documents/rapport_fsu_sadc_2025.pdf', 4200000, 'application/pdf', true, 'pdf', 'en', NOW() - INTERVAL '18 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000014', 'Étude sur le haut débit rural', 'Analyse des solutions de connectivité rurale.', 'reports', 'etude_haut_debit_rural.pdf', 'documents/etude_haut_debit_rural.pdf', 5500000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '15 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000015', 'Rapport sur l''éducation numérique', 'État des lieux de l''éducation numérique en Afrique.', 'reports', 'rapport_education_numerique.pdf', 'documents/rapport_education_numerique.pdf', 4700000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '12 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000016', 'Rapport sur la télé-santé', 'Analyse des solutions de télé-santé.', 'reports', 'rapport_telesante.pdf', 'documents/rapport_telesante.pdf', 5100000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '10 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000017', 'Rapport sur l''énergie solaire', 'Utilisation de l''énergie solaire pour les télécoms.', 'reports', 'rapport_energie_solaire.pdf', 'documents/rapport_energie_solaire.pdf', 4300000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '8 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000018', 'Rapport sur le financement innovant', 'Mécanismes innovants de financement des télécoms.', 'reports', 'rapport_financement_innovant.pdf', 'documents/rapport_financement_innovant.pdf', 4900000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '6 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  -- Templates (5)
  ('d0000000-0000-0000-0000-000000000019', 'Template de soumission de projet', 'Modèle de document pour soumettre un projet au FSU.', 'templates', 'template_soumission_projet.docx', 'documents/template_soumission_projet.docx', 450000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', true, 'doc', 'fr', NOW() - INTERVAL '3 days', NULL, false),
  ('d0000000-0000-0000-0000-000000000020', 'Template de rapport d''activité', 'Modèle de rapport d''activité trimestriel.', 'templates', 'template_rapport_activite.docx', 'documents/template_rapport_activite.docx', 380000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', true, 'doc', 'fr', NOW() - INTERVAL '25 days', NULL, false),
  ('d0000000-0000-0000-0000-000000000021', 'Template de demande de financement', 'Modèle de demande de financement.', 'templates', 'template_demande_financement.xlsx', 'documents/template_demande_financement.xlsx', 250000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', true, 'xls', 'fr', NOW() - INTERVAL '20 days', NULL, false),
  ('d0000000-0000-0000-0000-000000000022', 'Template de plan d''action', 'Modèle de plan d''action FSU.', 'templates', 'template_plan_action.docx', 'documents/template_plan_action.docx', 420000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', true, 'doc', 'fr', NOW() - INTERVAL '15 days', NULL, false),
  ('d0000000-0000-0000-0000-000000000023', 'Template de budget prévisionnel', 'Modèle de budget prévisionnel.', 'templates', 'template_budget.xlsx', 'documents/template_budget.xlsx', 280000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', true, 'xls', 'fr', NOW() - INTERVAL '10 days', NULL, false),
  -- Presentations (4)
  ('d0000000-0000-0000-0000-000000000024', 'Présentation de la plateforme USF-ADC', 'Présentation PowerPoint des fonctionnalités de la plateforme.', 'presentations', 'presentation_usf_adc.pptx', 'documents/presentation_usf_adc.pptx', 3800000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', true, 'ppt', 'fr', NOW() - INTERVAL '1 day', NULL, false),
  ('d0000000-0000-0000-0000-000000000025', 'Présentation UAT 2026', 'Présentation des activités de l''UAT.', 'presentations', 'presentation_uat_2026.pptx', 'documents/presentation_uat_2026.pptx', 5200000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', true, 'ppt', 'fr', NOW() - INTERVAL '5 days', NULL, false),
  ('d0000000-0000-0000-0000-000000000026', 'Présentation 5G en Afrique', 'Présentation sur le déploiement de la 5G.', 'presentations', 'presentation_5g_afrique.pptx', 'documents/presentation_5g_afrique.pptx', 4800000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', true, 'ppt', 'fr', NOW() - INTERVAL '7 days', NULL, false),
  ('d0000000-0000-0000-0000-000000000027', 'Présentation financement FSU', 'Présentation sur le financement du FSU.', 'presentations', 'presentation_financement_fsu.pptx', 'documents/presentation_financement_fsu.pptx', 4100000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', true, 'ppt', 'fr', NOW() - INTERVAL '3 days', NULL, false),
  -- Regulations (3)
  ('d0000000-0000-0000-0000-000000000028', 'Cadre réglementaire FSU', 'Document réglementaire sur les FSU.', 'regulations', 'cadre_reglementaire_fsu.pdf', 'documents/cadre_reglementaire_fsu.pdf', 3400000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '40 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', true),
  ('d0000000-0000-0000-0000-000000000029', 'Directive UAT sur les télécoms', 'Directive de l''UAT sur les télécommunications.', 'regulations', 'directive_uat_telecom.pdf', 'documents/directive_uat_telecom.pdf', 2900000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '35 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false),
  ('d0000000-0000-0000-0000-000000000030', 'Charte des bons principes FSU', 'Charte des bons principes pour la gestion des FSU.', 'regulations', 'charte_principes_fsu.pdf', 'document
s_principes_fsu.pdf', 2100000, 'application/pdf', true, 'pdf', 'fr', NOW() - INTERVAL '30 days', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300', false)
on conflict (id) do nothing;

-- =====================================================
-- 11. insert document tags
-- =====================================================

insert into public.document_tags (document_id, tag)
values
  -- Guides tags
  ('d0000000-0000-0000-0000-000000000001', 'FSU'), ('d0000000-0000-0000-0000-000000000001', 'Guide'), ('d0000000-0000-0000-0000-000000000001', 'Mise en œuvre'),
  ('d0000000-0000-0000-0000-000000000002', 'FSU'), ('d0000000-0000-0000-0000-000000000002', 'Bonnes pratiques'), ('d0000000-0000-0000-0000-000000000002', 'Gestion'),
  ('d0000000-0000-0000-0000-000000000003', 'Financement'), ('d0000000-0000-0000-0000-000000000003', 'Télécoms'), ('d0000000-0000-0000-0000-000000000003', 'Investissement'),
  ('d0000000-0000-0000-0000-000000000004', 'Règlementation'), ('d0000000-0000-0000-0000-000000000004', 'UAT'), ('d0000000-0000-0000-0000-000000000004', 'Cadre légal'),
  ('d0000000-0000-0000-0000-000000000005', '5G'), ('d0000000-0000-0000-0000-000000000005', 'Afrique'), ('d0000000-0000-0000-0000-000000000005', 'Déploiement'),
  ('d0000000-0000-0000-0000-000000000006', 'PPP'), ('d0000000-0000-0000-0000-000000000006', 'Partenariat'), ('d0000000-0000-0000-0000-000000000006', 'Public-privé'),
  ('d0000000-0000-0000-0000-000000000007', 'Audit'), ('d0000000-0000-0000-0000-000000000007', 'FSU'), ('d0000000-0000-0000-0000-000000000007', 'Contrôle'),
  ('d0000000-0000-0000-0000-000000000008', 'Gouvernance'), ('d0000000-0000-0000-0000-000000000008', 'Numérique'), ('d0000000-0000-0000-0000-000000000008', 'Stratégie'),
  -- Reports tags
  ('d0000000-0000-0000-0000-000000000009', 'Rapport'), ('d0000000-0000-0000-0000-000000000009', 'Annuel'), ('d0000000-0000-0000-0000-000000000009', '2025'), ('d0000000-0000-0000-0000-000000000009', 'Bilan'),
  ('d0000000-0000-0000-0000-000000000010', 'Connectivité'), ('d0000000-0000-0000-0000-000000000010', 'Analyse'), ('d0000000-0000-0000-0000-000000000010', 'Afrique'),
  ('d0000000-0000-0000-0000-000000000011', 'FSU'), ('d0000000-0000-0000-0000-000000000011', 'CEDEAO'), ('d0000000-0000-0000-0000-000000000011', 'Rapport'),
  ('d0000000-0000-0000-0000-000000000012', 'FSU'), ('d0000000-0000-0000-0000-000000000012', 'EAC'), ('d0000000-0000-0000-0000-000000000012', 'Rapport'),
  ('d0000000-0000-0000-0000-000000000013', 'FSU'), ('d0000000-0000-0000-0000-000000000013', 'SADC'), ('d0000000-0000-0000-0000-000000000013', 'Rapport'),
  ('d0000000-0000-0000-0000-000000000014', 'Haut débit'), ('d0000000-0000-0000-0000-000000000014', 'Rural'), ('d0000000-0000-0000-0000-000000000014', 'Étude'),
  ('d0000000-0000-0000-0000-000000000015', 'Éducation'), ('d0000000-0000-0000-0000-000000000015', 'Numérique'), ('d0000000-0000-0000-0000-000000000015', 'Analyse'),
  ('d0000000-0000-0000-0000-000000000016', 'Télé-santé'), ('d0000000-0000-0000-0000-000000000016', 'Santé'), ('d0000000-0000-0000-0000-000000000016', 'Rapport'),
  ('d0000000-0000-0000-0000-000000000017', 'Solaire'), ('d0000000-0000-0000-0000-000000000017', 'Énergie'), ('d0000000-0000-0000-0000-000000000017', 'Télécoms'),
  ('d0000000-0000-0000-0000-000000000018', 'Financement'), ('d0000000-0000-0000-0000-000000000018', 'Innovation'), ('d0000000-0000-0000-0000-000000000018', 'Rapport'),
  -- Templates tags
  ('d0000000-0000-0000-0000-000000000019', 'Template'), ('d0000000-0000-0000-0000-000000000019', 'Projet'), ('d0000000-0000-0000-0000-000000000019', 'Soumission'),
  ('d0000000-0000-0000-0000-000000000020', 'Template'), ('d0000000-0000-0000-0000-000000000020', 'Rapport'), ('d0000000-0000-0000-0000-000000000020', 'Activité'),
  ('d0000000-0000-0000-0000-000000000021', 'Template'), ('d0000000-0000-0000-0000-000000000021', 'Financement'), ('d0000000-0000-0000-0000-000000000021', 'Demande'),
  ('d0000000-0000-0000-0000-000000000022', 'Template'), ('d0000000-0000-0000-0000-000000000022', 'Plan'), ('d0000000-0000-0000-0000-000000000022', 'Action'),
  ('d0000000-0000-0000-0000-000000000023', 'Template'), ('d0000000-0000-0000-0000-000000000023', 'Budget'), ('d0000000-0000-0000-0000-000000000023', 'Prévisionnel'),
  -- Presentations tags
  ('d0000000-0000-0000-0000-000000000024', 'Présentation'), ('d0000000-0000-0000-0000-000000000024', 'Plateforme'), ('d0000000-0000-0000-0000-000000000024', 'USF-ADC'),
  ('d0000000-0000-0000-0000-000000000025', 'Présentation'), ('d0000000-0000-0000-0000-000000000025', 'UAT'), ('d0000000-0000-0000-0000-000000000025', 'Activités'),
  ('d0000000-0000-0000-0000-000000000026', 'Présentation'), ('d0000000-0000-0000-0000-000000000026', '5G'), ('d0000000-0000-0000-0000-000000000026', 'Afrique'),
  ('d0000000-0000-0000-0000-000000000027', 'Présentation'), ('d0000000-0000-0000-0000-000000000027', 'FSU'), ('d0000000-0000-0000-0000-000000000027', 'Financement'),
  -- Regulations tags
  ('d0000000-0000-0000-0000-000000000028', 'Règlementation'), ('d0000000-0000-0000-0000-000000000028', 'FSU'), ('d0000000-0000-0000-0000-000000000028', 'Cadre'),
  ('d0000000-0000-0000-0000-000000000029', 'Directive'), ('d0000000-0000-0000-0000-000000000029', 'UAT'), ('d0000000-0000-0000-0000-000000000029', 'Télécoms'),
  ('d0000000-0000-0000-0000-000000000030', 'Charte'), ('d0000000-0000-0000-0000-000000000030', 'Principes'), ('d0000000-0000-0000-0000-000000000030', 'FSU')
on conflict (document_id, tag) do nothing;

-- =====================================================
-- 10. seed news_categories
-- =====================================================
-- note: add initial news categories if table is empty

-- Check if news_categories table exists and is empty before seeding
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'news_categories'
    ) THEN
        -- Only insert if the table is empty
        IF NOT EXISTS (SELECT 1 FROM public.news_categories LIMIT 1) THEN
            INSERT INTO public.news_categories (id, name_fr, name_en, name_pt, slug, color, sort_order, is_active, created_at, updated_at) VALUES
            ('10000000-0000-0000-0000-000000000001', 'Financement', 'Funding', 'Financiamento', 'financement', '#3B82F6', 1, true, now(), now()),
            ('10000000-0000-0000-0000-000000000002', 'Partenariat', 'Partnership', 'Parceria', 'partenariat', '#10B981', 2, true, now(), now()),
            ('10000000-0000-0000-0000-000000000003', 'Événement', 'Event', 'Evento', 'evenement', '#EF4444', 3, true, now(), now()),
            ('10000000-0000-0000-0000-000000000004', 'Certification', 'Certification', 'Certificação', 'certification', '#F59E0B', 4, true, now(), now()),
            ('10000000-0000-0000-0000-000000000005', 'Innovation', 'Innovation', 'Inovação', 'innovation', '#8B5CF6', 5, true, now(), now()),
            ('10000000-0000-0000-0000-000000000006', 'Technologie', 'Technology', 'Tecnologia', 'technologie', '#EC4899', 6, true, now(), now()),
            ('10000000-0000-0000-0000-000000000007', 'Formation', 'Training', 'Formação', 'formation', '#06B6D4', 7, true, now(), now()),
            ('10000000-0000-0000-0000-000000000008', 'Réglementation', 'Regulation', 'Regulamentação', 'reglementation', '#14B8A6', 8, true, now(), now());
            
            RAISE NOTICE 'Seeded news_categories table with 8 categories';
        ELSE
            RAISE NOTICE 'news_categories table already has data, skipping seed';
        END IF;
    ELSE
        RAISE NOTICE 'news_categories table does not exist, skipping seed';
    END IF;
END$$;

-- =====================================================
-- 12. seed partenaires (partners)
-- =====================================================
-- note: seed data for partners with logos for the scrolling banner

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
  ('e5f6a7b8-9012-3456-7890-123456789012', 'Google', 'Google LLC',
   (SELECT id FROM public.countries WHERE code_iso = 'US' LIMIT 1),
   'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 'international', 'Technologie & Services Numeriques', '2021', 'https://www.google.com',
   'Services cloud, connectivite et initiatives de digitalisation en Afrique',
   '{"projets": ["Google Station WiFi", "Cloud services"]}', 'africa-partnerships@google.com', '+1 650 000 0000', 'Mountain View, CA, USA', true),
  ('f6a7b8c9-0123-4567-8901-234567890123', 'Microsoft', 'Microsoft Corporation',
   (SELECT id FROM public.countries WHERE code_iso = 'US' LIMIT 1),
   'https://c.s-microsoft.com/en-us/CMSImages/Microsoft_logo_rgb_C-Gray.png?version=5f55f6c7-6b0o-4a2b-8f8f-8f8f8f8f8f8f', 'international', 'Cloud & Solutions Numeriques', '2020', 'https://www.microsoft.com',
   'Solutions cloud et services numeriques pour les entreprises et administrations',
   '{"projets": ["Formation digitale", "Cloud computing"]}', 'africa@microsoft.com', '+1 425 000 0000', 'Redmond, WA, USA', true),
  ('a7b8c9d0-1234-5678-9012-345678901234', 'Amazon Data Services', 'Amazon Web Services (AWS)',
   (SELECT id FROM public.countries WHERE code_iso = 'US' LIMIT 1),
   'https://d1.awsstatic.com/partner-network/logo/AWS-Logo_Positive_1200x630.9f9234e4a31c3f8b0f2a5f5f5f5f5f5f5f5f5f5f.png', 'international', 'Cloud & Infrastructure', '2022', 'https://aws.amazon.com',
   'Services cloud et infrastructures pour les projets de connectivite',
   '{"projets": ["Data centers", "Cloud infrastructure"]}', 'africa-partners@amazon.com', '+1 206 000 0000', 'Seattle, WA, USA', true),
  ('b8c9d0e1-2345-6789-0123-456789012345', 'Nokia Solutions', 'Nokia Corporation',
   (SELECT id FROM public.countries WHERE code_iso = 'FI' LIMIT 1),
   'https://www.nokia.com/sites/default/files/styles/large/public/2021-06/nokia-logo-blue-rgb.png', 'prive', 'Equipements & Solutions Reseaux', '2019', 'https://www.nokia.com',
   'Equipements reseaux, solutions 5G et services professionnels',
   '{"projets": ["Reseaux mobiles", "IoT solutions"]}', 'contact@nokia.com', '+358 10 000 0000', 'Espoo, Finland', true),
  ('c9d0e1f2-3456-7890-1234-567890123456', 'Vodacom Group', 'Vodacom Group Limited',
   (SELECT id FROM public.countries WHERE code_iso = 'ZA' LIMIT 1),
   'https://www.vodacom.com/skin/frontend/vodacom/default/images/logo.svg', 'prive', 'Operateur Mobile', '2020', 'https://www.vodacom.com',
   'Operateur mobile panafricain, filiale de Vodafone',
   '{"projets": ["Services mobiles", "Data services"]}', 'info@vodacom.com', '+27 11 000 0000', 'Johannesburg, South Africa', true),
  ('d0e1f2a3-4567-8901-2345-678901234567', 'SES Luxembourg', 'SES S.A.',
   (SELECT id FROM public.countries WHERE code_iso = 'LU' LIMIT 1),
   'https://www.ses.com/sites/default/files/styles/large/public/2021-06/ses-logo.png', 'international', 'Satellites & Connectivite', '2021', 'https://www.ses.com',
   'Operateur satellite mondial fournissant une connectivite high-speed',
   '{"projets": ["Connectivite satellite", "Services broadband"]}', 'contact@ses.com', '+352 00 00 0000', 'Luxembourg City, Luxembourg', true),
  ('e1f2a3b4-5678-9012-3456-789012345678', 'SpaceX', 'SpaceX - Starlink',
   (SELECT id FROM public.countries WHERE code_iso = 'US' LIMIT 1),
   'https://www.spacex.com/static/images/share/Starlink_Logo_Black.png', 'international', 'Satellites & Connectivite', '2023', 'https://www.starlink.com',
   'Constellation satellites Starlink pour la connectivite mondiale et rurale',
   '{"projets": ["Internet satellite", "Zones mal desservies"]}', 'starlink@spacex.com', '+1 000 000 0000', 'Hawthorne, CA, USA', true),
  ('f2a3b4c5-6789-0123-4567-890123456789', 'GSMA', 'GSM Association',
   (SELECT id FROM public.countries WHERE code_iso = 'GB' LIMIT 1),
   'https://www.gsma.com/wp-content/uploads/2021/06/GSMA-Logo.png', 'ong', 'Association Professionnelle', '2019', 'https://www.gsma.com',
   'Association representant les operateurs mobiles mondiaux et l''ecosysteme mobile',
   '{"projets": ["Rapports FSU", "Best practices"]}', 'info@gsma.com', '+44 00 0000 0000', 'London, United Kingdom', true),
  ('a3b4c5d6-7890-1234-5678-901234567890', 'Eutelsat', 'Eutelsat Group',
   (SELECT id FROM public.countries WHERE code_iso = 'FR' LIMIT 1),
   'https://www.eutelsat.com/wp-content/uploads/2021/06/eutelsat-logo.png', 'international', 'Satellites & Connectivite', '2020', 'https://www.eutelsat.com',
   'Operateur satellite europeen couvrant l''Afrique avec des services de connectivite',
   '{"projets": ["Services satellite", "Broadband rural"]}', 'contact@eutelsat.com', '+33 1 00 00 00 00', 'Paris, France', true),
  ('b4c5d6e7-8901-2345-6789-012345678901', 'Intelsat', 'Intelsat S.A.',
   (SELECT id FROM public.countries WHERE code_iso = 'LU' LIMIT 1),
   'https://www.intelsat.com/wp-content/uploads/2021/06/intelsat-logo.png', 'international', 'Satellites & Connectivite', '2019', 'https://www.intelsat.com',
   'Operateur satellite fournissant des services de connectivite en Afrique',
   '{"projets": ["Reseaux cellulaires", "Services IP"]}', 'sales@intelsat.com', '+352 00 000 0000', 'Luxembourg City, Luxembourg', true),
  ('c5d6e7f8-9012-3456-7890-123456789012', 'ZTE', 'ZTE Corporation',
   (SELECT id FROM public.countries WHERE code_iso = 'CN' LIMIT 1),
   'https://www.zte.com.cn/global/aboutus/images/logo.png', 'prive', 'Equipements & Solutions Reseaux', '2019', 'https://www.zte.com.cn/global',
   'Equipementier chinois proposant des solutions reseaux et telecoms',
   '{"projets": ["Infrastructure 4G/5G", "Solutions broadband"]}', 'global@zte.com.cn', '+86 755 0000 0000', 'Shenzhen, China', true)
ON CONFLICT (id) DO NOTHING;
