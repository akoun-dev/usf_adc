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
insert into public.countries (id, code_iso, name_fr, name_en, region, official_name, flag_url, description, population, capital, fsu_established, fsu_budget, fsu_coordinator_name, fsu_coordinator_email, fsu_coordinator_phone) values
  ('2ff49cae-b29f-4d09-802c-bb31aba2ff7e', 'bj', 'Bénin', 'Benin', 'CEDEAO', 'République du Bénin', 'https://flagcdn.com/w320/bj.png', null, null, null, null, null, null, null, null),
  ('346716f6-50c3-499e-8262-4e606e559ffe', 'bf', 'Burkina Faso', 'Burkina Faso', 'CEDEAO', 'Burkina Faso', 'https://flagcdn.com/w320/bf.png', null, null, null, null, null, null, null, null),
  ('7bd90175-43f1-4a48-9e36-7898b30c4a3a', 'cv', 'Cap-Vert', 'Cape Verde', 'CEDEAO', 'République du Cap-Vert', 'https://flagcdn.com/w320/cv.png', null, null, null, null, null, null, null, null),
  ('d3077782-c322-400c-8a2c-51b8fbd2a628', 'ci', 'Côte d''Ivoire', 'Ivory Coast', 'CEDEAO', 'République de Côte d''Ivoire', 'https://flagcdn.com/w320/ci.png', 'La Côte d''Ivoire a établi son Fonds de Service Universel en 2019 avec pour mission de connecter 1000 localités rurales d''ici 2026. Le programme se concentre sur la connectivité scolaire, les centres de santé communautaires et l''inclusion numérique des femmes.', '27,5 millions', 'Yamoussoukro', '2019', '20 milliards FCFA', 'Dr. Amani Kouassi', 'fsu@gouv.ci', '+225 27 20 00 00 00'),
  ('d61c7e1e-1ac6-4d15-864d-115da6032ba7', 'gm', 'Gambie', 'Gambia', 'CEDEAO', 'République de Gambie', 'https://flagcdn.com/w320/gm.png', null, null, null, null, null, null, null, null),
  ('d947b5eb-80bb-4265-afe4-adad4f36e4d4', 'gh', 'Ghana', 'Ghana', 'CEDEAO', 'République du Ghana', 'https://flagcdn.com/w320/gh.png', 'Le Ghana a un FSU mature depuis 2017, avec un focus particulier sur l''éducation numérique et les télécentres communautaires. Le programme est cité comme modèle dans la sous-région.', '32,8 millions', 'Accra', '2017', '30 milliards FCFA', 'M. Kwame Mensah', 'fsu@ghana.gov', '+233 30 000 0000'),
  ('8c90a2a9-8f70-4e98-b40f-ace2e6e6389b', 'gn', 'Guinée', 'Guinea', 'CEDEAO', 'République de Guinée', 'https://flagcdn.com/w320/gn.png', null, null, null, null, null, null, null, null),
  ('c1f52831-9ddf-40a6-bc73-a293d017998a', 'gw', 'Guinée-Bissau', 'Guinea-Bissau', 'CEDEAO', 'République de Guinée-Bissau', 'https://flagcdn.com/w320/gw.png', null, null, null, null, null, null, null, null),
  ('3b85da8f-673b-45ab-b169-331dbf7043ee', 'lr', 'Libéria', 'Liberia', 'CEDEAO', 'République du Libéria', 'https://flagcdn.com/w320/lr.png', null, null, null, null, null, null, null, null),
  ('7662f35c-a341-43f1-b5c9-d09d23cc145c', 'ml', 'Mali', 'Mali', 'CEDEAO', 'République du Mali', 'https://flagcdn.com/w320/ml.png', null, null, null, null, null, null, null, null),
  ('46eba4c4-b0ca-4022-915e-abbacc4f9d5b', 'ne', 'Niger', 'Niger', 'CEDEAO', 'République du Niger', 'https://flagcdn.com/w320/ne.png', null, null, null, null, null, null, null, null),
  ('43a4dd5f-750e-43e9-8be5-d14e4af254af', 'ng', 'Nigeria', 'Nigeria', 'CEDEAO', 'République Fédérale du Nigeria', 'https://flagcdn.com/w320/ng.png', null, null, null, null, null, null, null, null),
  ('4866a87c-4369-499c-acbb-587e06748d7a', 'sn', 'Sénégal', 'Senegal', 'CEDEAO', 'République du Sénégal', 'https://flagcdn.com/w320/sn.png', 'Pionnier dans la région, le Sénégal a créé son FSU en 2018 et a obtenu la certification ISO 9001 en 2024. Le programme sénégalais est reconnu pour ses innovations dans les sites solaires autonomes et son modèle de subvention efficace.', '17,4 millions', 'Dakar', '2018', '25 milliards FCFA', 'Mme Fatou Diallo', 'fsu@senegal.gouv', '+221 33 800 00 00'),
  ('9984edb2-67a5-4fcb-8cd2-3739b6fe97cf', 'sl', 'Sierra Leone', 'Sierra Leone', 'CEDEAO', 'République de Sierra Leone', 'https://flagcdn.com/w320/sl.png', null, null, null, null, null, null, null, null),
  ('b050ce65-58b3-4f68-8c5d-644a20cdd01f', 'tg', 'Togo', 'Togo', 'CEDEAO', 'République Togolaise', 'https://flagcdn.com/w320/tg.png', null, null, null, null, null, null, null, null);

-- eac (east african community)
insert into public.countries (id, code_iso, name_fr, name_en, region) values
  ('7dc54d18-a13c-4f75-b6a7-0d85cf99cba4', 'bi', 'Burundi', 'Burundi', 'EAC'),
  ('fad2387a-3245-4566-966f-c63111f6ea2a', 'km', 'Comores', 'Comoros', 'EAC'),
  ('b9498406-133d-47ae-afe5-8ea423a8f317', 'cd', 'RD Congo', 'DR Congo', 'EAC'),
  ('f3d66f78-9572-4260-aa3e-41c7e69acd6f', 'dj', 'Djibouti', 'Djibouti', 'EAC'),
  ('33392bf1-8998-45bd-8e4b-4ab72dfa3abd', 'er', 'Érythrée', 'Eritrea', 'EAC'),
  ('d87661dc-c852-4187-ba26-a0c67e420a9f', 'et', 'Éthiopie', 'Ethiopia', 'EAC'),
  ('7eee4f15-e529-4095-bc82-9f3aa33a3d4b', 'ke', 'Kenya', 'Kenya', 'EAC'),
  ('dac6b009-256f-4659-88e7-015438a1a32b', 'mw', 'Malawi', 'Malawi', 'EAC'),
  ('17afb2ae-5221-48ee-a5bf-3ca45aa1eaf1', 'mu', 'Maurice', 'Mauritius', 'EAC'),
  ('2f971707-e13c-4085-9bf9-691dd126d50b', 'rw', 'Rwanda', 'Rwanda', 'EAC'),
  ('f0d53e77-8038-4f2f-a808-00262bbdd434', 'sc', 'Seychelles', 'Seychelles', 'EAC'),
  ('eada8438-2d71-46cc-8188-a546db522d32', 'so', 'Somalie', 'Somalia', 'EAC'),
  ('7872e877-022f-4eca-8d12-4859ed8a253d', 'ss', 'Soudan du Sud', 'South Sudan', 'EAC'),
  ('fbf6bccc-53df-475b-a519-1d996d4e6ec0', 'tz', 'Tanzanie', 'Tanzania', 'EAC'),
  ('a5b2e0d7-959c-414b-895e-2e922704bbda', 'ug', 'Ouganda', 'Uganda', 'EAC'),
  ('99824537-dd3e-4999-898f-eef526492db3', 'zm', 'Zambie', 'Zambia', 'EAC');

-- sadc (southern african development community)
insert into public.countries (id, code_iso, name_fr, name_en, region, official_name, flag_url, description, population, capital, fsu_established, fsu_budget, fsu_coordinator_name, fsu_coordinator_email, fsu_coordinator_phone) values
  ('0ddc7577-c622-465a-aa32-53c2d4e2711c', 'ao', 'Angola', 'Angola', 'SADC', 'République d''Angola', 'https://flagcdn.com/w320/ao.png', null, null, null, null, null, null, null, null),
  ('7ff18250-99dc-4273-bb41-02d85d03279c', 'bw', 'Botswana', 'Botswana', 'SADC', 'République du Botswana', 'https://flagcdn.com/w320/bw.png', null, null, null, null, null, null, null, null),
  ('dbcd1a10-4e92-4a35-bb35-f2e8bac2d7b7', 'ls', 'Lesotho', 'Lesotho', 'SADC', 'Royaume du Lesotho', 'https://flagcdn.com/w320/ls.png', null, null, null, null, null, null, null, null),
  ('06d720d2-ae4b-4fa8-9b17-e7efdefb2f8f', 'sz', 'Eswatini', 'Eswatini', 'SADC', 'Royaume d''Eswatini', 'https://flagcdn.com/w320/sz.png', null, null, null, null, null, null, null, null),
  ('1ef5e1e8-82b9-4cc3-a6f0-e1e1d4e41913', 'mg', 'Madagascar', 'Madagascar', 'SADC', 'République de Madagascar', 'https://flagcdn.com/w320/mg.png', null, null, null, null, null, null, null, null),
  ('7cf3de43-25ff-430b-a4dc-c051c64102c2', 'mz', 'Mozambique', 'Mozambique', 'SADC', 'République du Mozambique', 'https://flagcdn.com/w320/mz.png', 'Le Mozambique a créé son FSU en 2021 pour connecter les zones rurales après les cyclones. Le programme finance des infrastructures résilientes.', '31,3 millions', 'Maputo', '2021', '22 milliards FCFA', 'M. Carlos Machava', 'fsu@mozambique.mz', '+258 20 00 00 00'),
  ('17357f75-cfc7-4d45-a3ba-9fd43beb46aa', 'na', 'Namibie', 'Namibia', 'SADC', 'République de Namibie', 'https://flagcdn.com/w320/na.png', null, null, null, null, null, null, null, null),
  ('b7114415-09f1-45a4-b081-4c54cf74261a', 'za', 'Afrique du Sud', 'South Africa', 'SADC', 'République d''Afrique du Sud', 'https://flagcdn.com/w320/za.png', 'L''Afrique du Sud dispose d''un FSU mature depuis 2016, finançant des projets de connectivité broadband et de centres numériques communautaires dans les townships.', '60,0 millions', 'Pretoria', '2016', '60 milliards FCFA', 'Mme Thandi Mbeki', 'fsu@southafrica.gov.za', '+27 10 000 0000'),
  ('8166fbd4-b182-41f6-a8aa-358faa6822b8', 'zw', 'Zimbabwe', 'Zimbabwe', 'SADC', 'République du Zimbabwe', 'https://flagcdn.com/w320/zw.png', null, null, null, null, null, null, null, null);

-- uma (arab maghreb union)
insert into public.countries (id, code_iso, name_fr, name_en, region) values
  ('1ce09dee-9260-403c-9dae-db03a4967b28', 'dz', 'Algérie', 'Algeria', 'UMA'),
  ('0fbfa247-ae4f-4229-827e-e8a04e67608e', 'eh', 'Sahara occidental', 'Western Sahara', 'UMA'),
  ('37e8811e-4c17-4b9f-84d9-8d4da9a0c674', 'ly', 'Libye', 'Libya', 'UMA'),
  ('5b7122f7-1e73-4b3a-a5db-5119ecfa3d81', 'ma', 'Maroc', 'Morocco', 'UMA'),
  ('d95bcaf3-d52f-4586-a339-60c685f90812', 'mr', 'Mauritanie', 'Mauritania', 'UMA'),
  ('c5a99ef6-3220-49d1-a725-0b3d9794d4b7', 'tn', 'Tunisie', 'Tunisia', 'UMA');

-- ceeac (economic community of central african states)
insert into public.countries (id, code_iso, name_fr, name_en, region) values
  ('f03b776f-8a8e-4ab1-95d6-d3d8845f7e44', 'cm', 'Cameroun', 'Cameroon', 'CEEAC'),
  ('4d844e0f-5083-4c87-a8af-b4697150a3df', 'cf', 'Centrafrique', 'Central African Republic', 'CEEAC'),
  ('c6315886-ed21-4941-b353-9780d29f011c', 'td', 'Tchad', 'Chad', 'CEEAC'),
  ('14579777-28d6-46e8-82d0-6f664a53be0a', 'cg', 'Congo', 'Congo', 'CEEAC'),
  ('0e5086fe-5c73-4900-bdf7-7967dcc084fc', 'ga', 'Gabon', 'Gabon', 'CEEAC'),
  ('cdbc6568-7633-470a-b7f2-47a64bbf8758', 'gq', 'Guinée équatoriale', 'Equatorial Guinea', 'CEEAC'),
  ('66fe379c-e25d-4320-b21d-5881f0412dec', 'st', 'Sao Tomé-et-Principe', 'São Tomé and Príncipe', 'CEEAC');

-- other african countries
insert into public.countries (id, code_iso, name_fr, name_en, region) values
  ('0ab2ec37-4634-4185-a417-2c62d24117e2', 'eg', 'Égypte', 'Egypt', 'North Africa');
