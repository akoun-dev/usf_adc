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
insert into public.countries (code_iso, name_fr, name_en, region) values
  ('bj', 'Bénin', 'Benin', 'CEDEAO'),
  ('bf', 'Burkina Faso', 'Burkina Faso', 'CEDEAO'),
  ('cv', 'Cap-Vert', 'Cape Verde', 'CEDEAO'),
  ('ci', 'Côte d''Ivoire', 'Ivory Coast', 'CEDEAO'),
  ('gm', 'Gambie', 'Gambia', 'CEDEAO'),
  ('gh', 'Ghana', 'Ghana', 'CEDEAO'),
  ('gn', 'Guinée', 'Guinea', 'CEDEAO'),
  ('gw', 'Guinée-Bissau', 'Guinea-Bissau', 'CEDEAO'),
  ('lr', 'Libéria', 'Liberia', 'CEDEAO'),
  ('ml', 'Mali', 'Mali', 'CEDEAO'),
  ('ne', 'Niger', 'Niger', 'CEDEAO'),
  ('ng', 'Nigeria', 'Nigeria', 'CEDEAO'),
  ('sn', 'Sénégal', 'Senegal', 'CEDEAO'),
  ('sl', 'Sierra Leone', 'Sierra Leone', 'CEDEAO'),
  ('tg', 'Togo', 'Togo', 'CEDEAO');

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
insert into public.countries (code_iso, name_fr, name_en, region) values
  ('ao', 'Angola', 'Angola', 'SADC'),
  ('bw', 'Botswana', 'Botswana', 'SADC'),
  ('ls', 'Lesotho', 'Lesotho', 'SADC'),
  ('sz', 'Eswatini', 'Eswatini', 'SADC'),
  ('mg', 'Madagascar', 'Madagascar', 'SADC'),
  ('mz', 'Mozambique', 'Mozambique', 'SADC'),
  ('na', 'Namibie', 'Namibia', 'SADC'),
  ('za', 'Afrique du Sud', 'South Africa', 'SADC'),
  ('zw', 'Zimbabwe', 'Zimbabwe', 'SADC');

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
