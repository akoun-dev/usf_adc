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
-- 3. insert demo forum topics (referencing admin user)
-- =====================================================
-- note: these are example topics for development
-- in production, real topics would be created by users through the ui
-- skipped for now as they require valid user references

-- =====================================================
-- 4. insert demo events
-- =====================================================
-- note: these are example events for development

insert into public.events (id, title, description, start_date, end_date, location, event_type, status, max_participants, registration_url, price, image_url, organizer, is_public)
values
  (
    'd0000000-0000-0000-0000-000000000001',
    'Sommet Africa Tech 2026',
    'Le plus grand rassemblement des acteurs du numérique en Afrique. Éditions précédentes : 3000 participants, 50 pays représentés, 200 conférenciers.',
    '2026-05-15 09:00:00',
    '2026-05-18 18:00:00',
    'Palais des Congrès, Abidjan, Côte d''Ivoire',
    'conference',
    'upcoming',
    3000,
    'https://atuuat.africa/events/africa-tech-2025',
    'Gratuit sur invitation',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630&fit=crop',
    'Union Africaine des Télécommunications',
    true
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'Webinaire : Stratégies de mobilisation du FSU',
    'Découvrez les stratégies efficaces pour mobiliser les ressources du Fonds de Service Universel.',
    '2026-05-22 14:00:00',
    '2026-05-22 17:00:00',
    'En ligne',
    'webinar',
    'upcoming',
    500,
    'https://atuuat.africa/webinars/fsu-financement',
    'Gratuit',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=630&fit=crop',
    'UAT - Programmes',
    true
  )
on conflict (id) do nothing;

-- =====================================================
-- 5. insert event tags
-- =====================================================
-- note: tags associated with events

insert into public.event_tags (event_id, tag)
values
  ('d0000000-0000-0000-0000-000000000001', 'Conférence'),
  ('d0000000-0000-0000-0000-000000000001', 'Sommet'),
  ('d0000000-0000-0000-0000-000000000001', 'Technologie'),
  ('d0000000-0000-0000-0000-000000000001', 'Innovation'),
  ('d0000000-0000-0000-0000-000000000002', 'Webinaire'),
  ('d0000000-0000-0000-0000-000000000002', 'Financement'),
  ('d0000000-0000-0000-0000-000000000002', 'FSU'),
  ('d0000000-0000-0000-0000-000000000002', 'Formation')
on conflict (event_id, tag) do nothing;

-- =====================================================
-- 6. insert demo news articles
-- =====================================================
-- note: these are example news articles for development
-- skipped for now as they require valid user references

-- =====================================================
-- 7. insert news tags
-- =====================================================
-- note: tags associated with news articles
-- skipped as news articles are not inserted

-- =====================================================
-- 8. insert demo documents
-- =====================================================
-- note: these are example documents for development
-- skipped for now as they require valid user references

-- =====================================================
-- 9. insert document tags
-- =====================================================
-- note: tags associated with documents
-- skipped as documents are not inserted

-- =====================================================
-- 10. insert demo projects with additional data
-- =====================================================
-- note: these are example projects to complement the initial seed
-- projects reference countries by code, so we need to look up the country ids

-- côte d'ivoire projects
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  (
    'a0000000-0000-0000-0000-000000000001',
    (select id from public.countries where code_iso = 'ci'),
    'Connectivité Rurale Phase 1 - Nord',
    'Déploiement de la connectivité haut débit dans 150 localités du Nord de la Côte d''Ivoire.',
    'in_progress',
    45000000.00,
    7.4951,
    -3.3947,
    'CEDEAO',
    'connectivite',
    65,
    '300000',
    'Orange CI'
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    (select id from public.countries where code_iso = 'ci'),
    'Écoles Numériques Côte d''Ivoire',
    'Équipement de 200 écoles primaires en ordinateurs et connexion internet.',
    'in_progress',
    12000000.00,
    5.3600,
    -4.0083,
    'CEDEAO',
    'education',
    40,
    '50000',
    'MTN CI'
  )
on conflict do nothing;

-- sénégal projects
insert into public.projects (id, country_id, title, description, status, budget, latitude, longitude, region, thematic, progress, beneficiaries, operator)
values
  (
    'a0000000-0000-0000-0000-000000000003',
    (select id from public.countries where code_iso = 'sn'),
    'Sites Solaires Autonomes',
    'Déploiement de 150 sites télécoms alimentés par énergie solaire.',
    'completed',
    32000000.00,
    14.7167,
    -17.4677,
    'CEDEAO',
    'connectivite',
    100,
    '300000',
    'Orange Sénégal'
  )
on conflict do nothing;

-- =====================================================
-- 11. insert project images
-- =====================================================
-- note: demo images for projects

insert into public.project_images (project_id, image_url, sort_order)
values
  ('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', 1),
  ('a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', 1),
  ('a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80', 1)
on conflict do nothing;

-- =====================================================
-- 12. insert project tags
-- =====================================================
-- note: tags associated with projects

insert into public.project_tags (project_id, tag)
values
  ('a0000000-0000-0000-0000-000000000001', 'fibre'),
  ('a0000000-0000-0000-0000-000000000001', 'rural'),
  ('a0000000-0000-0000-0000-000000000001', '5G'),
  ('a0000000-0000-0000-0000-000000000001', 'CEDEAO'),
  ('a0000000-0000-0000-0000-000000000002', 'éducation'),
  ('a0000000-0000-0000-0000-000000000002', 'formation'),
  ('a0000000-0000-0000-0000-000000000002', 'digitalisation'),
  ('a0000000-0000-0000-0000-000000000003', 'solaire'),
  ('a0000000-0000-0000-0000-000000000003', 'énergie-verte'),
  ('a0000000-0000-0000-0000-000000000003', 'off-grid')
on conflict do nothing;

-- =====================================================
-- 13. insert forum topic tags
-- =====================================================
-- note: tags associated with the demo forum topic
-- skipped as forum topics are not inserted
