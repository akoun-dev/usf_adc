-- =====================================================
-- migration: create countries table
-- =====================================================
-- purpose: store reference data for countries/regions
-- affected tables: countries
-- special considerations: none - this is reference data
-- =====================================================

-- =====================================================
-- 1. create countries table
-- =====================================================
-- note: this table stores static reference data for countries
-- it is referenced by many other tables (profiles, fsu_submissions, projects, etc.)
-- rls is enabled with a permissive read policy since this is public reference data

create table public.countries (
  id uuid not null default gen_random_uuid() primary key,
  -- iso 3166-1 alpha-2 country code (e.g., 'FR', 'US', 'CI')
  code_iso char(2) not null unique,
  -- french name of the country (primary language of the platform)
  name_fr text not null,
  -- english name of the country
  name_en text not null,
  -- region classification (e.g., 'CEDEAO', 'EAC', 'SADC', 'UMA', 'CEEAC')
  region text not null,
  -- official country name (e.g., 'République de Côte d''Ivoire')
  official_name text,
  -- flag URL (external source like flagcdn.com)
  flag_url text,
  -- FSU description and activities in the country
  description text,
  -- population (text format: '27,5 millions')
  population text,
  -- capital city
  capital text,
  -- year FSU was established (text format: '2019')
  fsu_established text,
  -- FSU budget (text format: '20 milliards FCFA')
  fsu_budget text,
  -- FSU coordinator name
  fsu_coordinator_name text,
  -- FSU coordinator email
  fsu_coordinator_email text,
  -- FSU coordinator phone
  fsu_coordinator_phone text,
  -- logo path in Supabase Storage (for custom uploaded logos)
  logo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- note: rls is mandatory for all tables in this application
-- even though countries are reference data, we enable rls for consistency

alter table public.countries enable row level security;

-- =====================================================
-- 3. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role
-- countries are public reference data, so all authenticated users can read them

-- policy: select - all users can read all countries
-- rationale: countries are public reference data needed for dropdowns, filters, etc.
create policy "countries_select_anon"
  on public.countries for select
  to anon, authenticated
  using (true);

-- policy: insert - super_admin can add countries
create policy "countries_insert_super_admin"
  on public.countries for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'super_admin'));

-- policy: update - super_admin can update countries
create policy "countries_update_super_admin"
  on public.countries for update
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- policy: delete - super_admin can delete countries
create policy "countries_delete_super_admin"
  on public.countries for delete
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- =====================================================
-- 4. create indexes for performance
-- =====================================================
-- note: indexes speed up queries that filter or join on these columns

create index idx_countries_code_iso on public.countries(code_iso);
create index idx_countries_region on public.countries(region);

-- =====================================================
-- 5. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_countries_updated_at
  before update on public.countries
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 6. insert seed data
-- =====================================================
-- note: african countries organized by regional economic community (rec)

-- cedeao (economic community of west african states)
insert into public.countries (code_iso, name_fr, name_en, region, official_name, flag_url, description, population, capital, fsu_established, fsu_budget, fsu_coordinator_name, fsu_coordinator_email, fsu_coordinator_phone) values
  ('bj', 'Bénin', 'Benin', 'CEDEAO', 'République du Bénin', 'https://flagcdn.com/w320/bj.png', null, null, null, null, null, null, null, null),
  ('bf', 'Burkina Faso', 'Burkina Faso', 'CEDEAO', 'Burkina Faso', 'https://flagcdn.com/w320/bf.png', null, null, null, null, null, null, null, null),
  ('cv', 'Cap-Vert', 'Cape Verde', 'CEDEAO', 'République du Cap-Vert', 'https://flagcdn.com/w320/cv.png', null, null, null, null, null, null, null, null),
  ('ci', 'Côte d''Ivoire', 'Ivory Coast', 'CEDEAO', 'République de Côte d''Ivoire', 'https://flagcdn.com/w320/ci.png', 'La Côte d''Ivoire a établi son Fonds de Service Universel en 2019 avec pour mission de connecter 1000 localités rurales d''ici 2026. Le programme se concentre sur la connectivité scolaire, les centres de santé communautaires et l''inclusion numérique des femmes.', '27,5 millions', 'Yamoussoukro', '2019', '20 milliards FCFA', 'Dr. Amani Kouassi', 'fsu@gouv.ci', '+225 27 20 00 00 00'),
  ('gm', 'Gambie', 'Gambia', 'CEDEAO', 'République de Gambie', 'https://flagcdn.com/w320/gm.png', null, null, null, null, null, null, null, null),
  ('gh', 'Ghana', 'Ghana', 'CEDEAO', 'République du Ghana', 'https://flagcdn.com/w320/gh.png', 'Le Ghana a un FSU mature depuis 2017, avec un focus particulier sur l''éducation numérique et les télécentres communautaires. Le programme est cité comme modèle dans la sous-région.', '32,8 millions', 'Accra', '2017', '30 milliards FCFA', 'M. Kwame Mensah', 'fsu@ghana.gov', '+233 30 000 0000'),
  ('gn', 'Guinée', 'Guinea', 'CEDEAO', 'République de Guinée', 'https://flagcdn.com/w320/gn.png', null, null, null, null, null, null, null, null),
  ('gw', 'Guinée-Bissau', 'Guinea-Bissau', 'CEDEAO', 'République de Guinée-Bissau', 'https://flagcdn.com/w320/gw.png', null, null, null, null, null, null, null, null),
  ('lr', 'Libéria', 'Liberia', 'CEDEAO', 'République du Libéria', 'https://flagcdn.com/w320/lr.png', null, null, null, null, null, null, null, null),
  ('ml', 'Mali', 'Mali', 'CEDEAO', 'République du Mali', 'https://flagcdn.com/w320/ml.png', null, null, null, null, null, null, null, null),
  ('ne', 'Niger', 'Niger', 'CEDEAO', 'République du Niger', 'https://flagcdn.com/w320/ne.png', null, null, null, null, null, null, null, null),
  ('ng', 'Nigeria', 'Nigeria', 'CEDEAO', 'République Fédérale du Nigeria', 'https://flagcdn.com/w320/ng.png', null, null, null, null, null, null, null, null),
  ('sn', 'Sénégal', 'Senegal', 'CEDEAO', 'République du Sénégal', 'https://flagcdn.com/w320/sn.png', 'Pionnier dans la région, le Sénégal a créé son FSU en 2018 et a obtenu la certification ISO 9001 en 2024. Le programme sénégalais est reconnu pour ses innovations dans les sites solaires autonomes et son modèle de subvention efficace.', '17,4 millions', 'Dakar', '2018', '25 milliards FCFA', 'Mme Fatou Diallo', 'fsu@senegal.gouv', '+221 33 800 00 00'),
  ('sl', 'Sierra Leone', 'Sierra Leone', 'CEDEAO', 'République de Sierra Leone', 'https://flagcdn.com/w320/sl.png', null, null, null, null, null, null, null, null),
  ('tg', 'Togo', 'Togo', 'CEDEAO', 'République Togolaise', 'https://flagcdn.com/w320/tg.png', null, null, null, null, null, null, null, null);

-- eac (east african community)
insert into public.countries (code_iso, name_fr, name_en, region) values
  ('bi', 'Burundi', 'Burundi', 'EAC'),
  ('km', 'Comores', 'Comoros', 'EAC'),
  ('cd', 'RD Congo', 'DR Congo', 'EAC'),
  ('dj', 'Djibouti', 'Djibouti', 'EAC'),
  ('er', 'Érythrée', 'Eritrea', 'EAC'),
  ('et', 'Éthiopie', 'Ethiopia', 'EAC'),
  ('ke', 'Kenya', 'Kenya', 'EAC'),
  ('mw', 'Malawi', 'Malawi', 'EAC'),
  ('mu', 'Maurice', 'Mauritius', 'EAC'),
  ('rw', 'Rwanda', 'Rwanda', 'EAC'),
  ('sc', 'Seychelles', 'Seychelles', 'EAC'),
  ('so', 'Somalie', 'Somalia', 'EAC'),
  ('ss', 'Soudan du Sud', 'South Sudan', 'EAC'),
  ('tz', 'Tanzanie', 'Tanzania', 'EAC'),
  ('ug', 'Ouganda', 'Uganda', 'EAC'),
  ('zm', 'Zambie', 'Zambia', 'EAC');

-- sadc (southern african development community)
insert into public.countries (code_iso, name_fr, name_en, region, official_name, flag_url, description, population, capital, fsu_established, fsu_budget, fsu_coordinator_name, fsu_coordinator_email, fsu_coordinator_phone) values
  ('ao', 'Angola', 'Angola', 'SADC', 'République d''Angola', 'https://flagcdn.com/w320/ao.png', null, null, null, null, null, null, null, null),
  ('bw', 'Botswana', 'Botswana', 'SADC', 'République du Botswana', 'https://flagcdn.com/w320/bw.png', null, null, null, null, null, null, null, null),
  ('ls', 'Lesotho', 'Lesotho', 'SADC', 'Royaume du Lesotho', 'https://flagcdn.com/w320/ls.png', null, null, null, null, null, null, null, null),
  ('sz', 'Eswatini', 'Eswatini', 'SADC', 'Royaume d''Eswatini', 'https://flagcdn.com/w320/sz.png', null, null, null, null, null, null, null, null),
  ('mg', 'Madagascar', 'Madagascar', 'SADC', 'République de Madagascar', 'https://flagcdn.com/w320/mg.png', null, null, null, null, null, null, null, null),
  ('mz', 'Mozambique', 'Mozambique', 'SADC', 'République du Mozambique', 'https://flagcdn.com/w320/mz.png', 'Le Mozambique a créé son FSU en 2021 pour connecter les zones rurales après les cyclones. Le programme finance des infrastructures résilientes.', '31,3 millions', 'Maputo', '2021', '22 milliards FCFA', 'M. Carlos Machava', 'fsu@mozambique.mz', '+258 20 00 00 00'),
  ('na', 'Namibie', 'Namibia', 'SADC', 'République de Namibie', 'https://flagcdn.com/w320/na.png', null, null, null, null, null, null, null, null),
  ('za', 'Afrique du Sud', 'South Africa', 'SADC', 'République d''Afrique du Sud', 'https://flagcdn.com/w320/za.png', 'L''Afrique du Sud dispose d''un FSU mature depuis 2016, finançant des projets de connectivité broadband et de centres numériques communautaires dans les townships.', '60,0 millions', 'Pretoria', '2016', '60 milliards FCFA', 'Mme Thandi Mbeki', 'fsu@southafrica.gov.za', '+27 10 000 0000'),
  ('zw', 'Zimbabwe', 'Zimbabwe', 'SADC', 'République du Zimbabwe', 'https://flagcdn.com/w320/zw.png', null, null, null, null, null, null, null, null);

-- uma (arab maghreb union)
insert into public.countries (code_iso, name_fr, name_en, region) values
  ('dz', 'Algérie', 'Algeria', 'UMA'),
  ('eh', 'Sahara occidental', 'Western Sahara', 'UMA'),
  ('ly', 'Libye', 'Libya', 'UMA'),
  ('ma', 'Maroc', 'Morocco', 'UMA'),
  ('mr', 'Mauritanie', 'Mauritania', 'UMA'),
  ('tn', 'Tunisie', 'Tunisia', 'UMA');

-- ceeac (economic community of central african states)
insert into public.countries (code_iso, name_fr, name_en, region) values
  ('cm', 'Cameroun', 'Cameroon', 'CEEAC'),
  ('cf', 'Centrafrique', 'Central African Republic', 'CEEAC'),
  ('td', 'Tchad', 'Chad', 'CEEAC'),
  ('cg', 'Congo', 'Congo', 'CEEAC'),
  ('ga', 'Gabon', 'Gabon', 'CEEAC'),
  ('gq', 'Guinée équatoriale', 'Equatorial Guinea', 'CEEAC'),
  ('st', 'Sao Tomé-et-Principe', 'São Tomé and Príncipe', 'CEEAC');

-- other african countries
insert into public.countries (code_iso, name_fr, name_en, region) values
  ('eg', 'Égypte', 'Egypt', 'North Africa');
