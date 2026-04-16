-- =====================================================
-- migration: seed forum topics and posts data
-- =====================================================
-- purpose: populate forum with demo discussions for testing
-- affected tables: forum_topics, forum_posts
-- special considerations:
--   - created_by is NULL for system-generated seed data
--   - in production, topics/posts are created by authenticated users
-- =====================================================

-- =====================================================
-- 1. Insert demo forum topics
-- =====================================================
insert into public.forum_topics (title, content, category_id, created_by, is_pinned, is_locked, is_public, status, created_at, updated_at)
select 
  'Bienvenue sur le forum USF-ADC'::text as title,
  'Bienvenue sur le forum public de la plateforme USF-ADC ! Cette plateforme est dédiée à la collaboration et à l''échange d''expériences entre les points focaux et les experts des Fonds de Service Universel en Afrique. N''hésitez pas à poser vos questions et à partager vos expertise.'::text as content,
  (select id from public.forum_categories where slug = 'general' limit 1)::uuid as category_id,
  NULL::uuid as created_by, true::boolean as is_pinned, false::boolean as is_locked, true::boolean as is_public, 'open'::text as status, 
  (NOW() - INTERVAL '30 days')::timestamptz as created_at, (NOW() - INTERVAL '30 days')::timestamptz as updated_at
union all
select 'Stratégies de financement du FSU'::text, 'Quelles sont les meilleures pratiques pour mobiliser les ressources du Fonds de Service Universel ? Partagez vos expériences et vos stratégies réussies.'::text, (select id from public.forum_categories where slug = 'financement' limit 1)::uuid, NULL::uuid, false, false, true, 'open'::text, (NOW() - INTERVAL '25 days')::timestamptz, (NOW() - INTERVAL '25 days')::timestamptz
union all
select 'Problèmes d''accès à la plateforme'::text, 'Je rencontre des difficultés pour me connecter à la plateforme. Comment puis-je résoudre ce problème ?'::text, (select id from public.forum_categories where slug = 'general' limit 1)::uuid, NULL::uuid, false, false, true, 'solved'::text, (NOW() - INTERVAL '20 days')::timestamptz, (NOW() - INTERVAL '18 days')::timestamptz
union all
select 'Utilisation de la 5G pour le FSU'::text, 'Avez-vous des projets de déploiement 5G utilisant les ressources du FSU ? Partagez les détails et les défis rencontrés.'::text, (select id from public.forum_categories where slug = 'connectivite' limit 1)::uuid, NULL::uuid, false, false, true, 'open'::text, (NOW() - INTERVAL '15 days')::timestamptz, (NOW() - INTERVAL '15 days')::timestamptz
union all
select 'Connectivité rurale efficace'::text, 'Quelle est la solution la plus rentable pour connecter les zones rurales ? Retours d''expérience bienvenus.'::text, (select id from public.forum_categories where slug = 'connectivite' limit 1)::uuid, NULL::uuid, true, false, true, 'open'::text, (NOW() - INTERVAL '10 days')::timestamptz, (NOW() - INTERVAL '8 days')::timestamptz
union all
select 'Gouvernance des FSU'::text, 'Comment garantir une bonne gouvernance des Fonds de Service Universel au niveau national ?'::text, (select id from public.forum_categories where slug = 'reglementation' limit 1)::uuid, NULL::uuid, false, false, true, 'open'::text, (NOW() - INTERVAL '7 days')::timestamptz, (NOW() - INTERVAL '7 days')::timestamptz
union all
select 'Partnership PPP dans le secteur télécom'::text, 'Exemple de partenariats public-privé réussis pour les télécommunications en Afrique.'::text, (select id from public.forum_categories where slug = 'financement' limit 1)::uuid, NULL::uuid, false, false, true, 'open'::text, (NOW() - INTERVAL '5 days')::timestamptz, (NOW() - INTERVAL '4 days')::timestamptz
union all
select 'Annonce : Nouvelle version de la plateforme'::text, 'La version 2.0 de la plateforme USF-ADC est maintenant en ligne avec de nombreuses nouvelles fonctionnalités.'::text, (select id from public.forum_categories where slug = 'general' limit 1)::uuid, NULL::uuid, true, false, true, 'open'::text, (NOW() - INTERVAL '3 days')::timestamptz, (NOW() - INTERVAL '3 days')::timestamptz
on conflict do nothing;

-- =====================================================
-- 2. Insert demo forum posts
-- =====================================================
insert into public.forum_posts (topic_id, created_by, content, is_solution, created_at, updated_at)
select 
  t.id,
  NULL::uuid,
  'De mon expérience, il est crucial de combiner le financement gouvernemental avec les investissements privés pour maximiser les ressources du FSU.'::text,
  false, (NOW() - INTERVAL '24 days')::timestamptz, (NOW() - INTERVAL '24 days')::timestamptz
from public.forum_topics t
where t.title = 'Stratégies de financement du FSU'
union all
select t.id, NULL::uuid, 'Absolument ! Au Sénégal, nous avons utilisé un modèle mixte avec succès. Les opérateurs privés contribuent 30% du financement.'::text, true, (NOW() - INTERVAL '23 days')::timestamptz, (NOW() - INTERVAL '23 days')::timestamptz
from public.forum_topics t where t.title = 'Stratégies de financement du FSU'
union all
select t.id, NULL::uuid, 'Avez-vous vérifié votre connexion internet ? Essayez de vider le cache de votre navigateur.'::text, false, (NOW() - INTERVAL '19 days')::timestamptz, (NOW() - INTERVAL '19 days')::timestamptz
from public.forum_topics t where t.title = 'Problèmes d''accès à la plateforme'
union all
select t.id, NULL::uuid, 'Cela a résolu mon problème ! Merci beaucoup.'::text, true, (NOW() - INTERVAL '18 days')::timestamptz, (NOW() - INTERVAL '18 days')::timestamptz
from public.forum_topics t where t.title = 'Problèmes d''accès à la plateforme'
union all
select t.id, NULL::uuid, 'Nous avons lancé un projet pilote 5G au Nigeria avec le soutien du FSU. Les résultats sont très prometteurs.'::text, false, (NOW() - INTERVAL '14 days')::timestamptz, (NOW() - INTERVAL '14 days')::timestamptz
from public.forum_topics t where t.title = 'Utilisation de la 5G pour le FSU'
union all
select t.id, NULL::uuid, 'La fibre optique reste la solution la plus efficace pour les zones rurales, malgré les coûts initiaux élevés.'::text, false, (NOW() - INTERVAL '9 days')::timestamptz, (NOW() - INTERVAL '9 days')::timestamptz
from public.forum_topics t where t.title = 'Connectivité rurale efficace'
union all
select t.id, NULL::uuid, 'D''accord, mais avez-vous considéré les solutions par satellite pour les zones très reculées ?'::text, false, (NOW() - INTERVAL '8 days')::timestamptz, (NOW() - INTERVAL '8 days')::timestamptz
from public.forum_topics t where t.title = 'Connectivité rurale efficace'
union all
select t.id, NULL::uuid, 'Au Kenya, le partenariat PPP avec Safaricom a permis d''étendre la couverture mobile à 85% du pays.'::text, false, (NOW() - INTERVAL '4 days')::timestamptz, (NOW() - INTERVAL '4 days')::timestamptz
from public.forum_topics t where t.title = 'Partnership PPP dans le secteur télécom'
on conflict do nothing;
