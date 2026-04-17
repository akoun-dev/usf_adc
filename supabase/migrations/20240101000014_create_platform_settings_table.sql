-- =====================================================
-- migration: create platform settings tables
-- =====================================================
-- purpose: store platform-wide configuration and settings
-- affected tables: platform_settings, submission_periods
-- special considerations:
--   - platform_settings is a key-value store for dynamic configuration
--   - submission_periods define reporting windows for fsu submissions
-- =====================================================

-- =====================================================
-- 1. create platform_settings table
-- =====================================================
-- note: stores application configuration as key-value pairs
-- allows settings to be changed without code deployment

create table public.platform_settings (
  id uuid not null default gen_random_uuid() primary key,
  -- unique key identifying the setting
  key text not null unique,
  -- setting value (stored as jsonb for flexibility)
  value jsonb not null default '"{}"'::jsonb,
  -- human-readable label for the setting
  label text not null,
  -- category for grouping related settings
  category text not null default 'general',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls) on platform_settings
-- =====================================================
-- warning: rls is critical - settings control application behavior

alter table public.platform_settings enable row level security;

-- =====================================================
-- 3. create rls policies for platform_settings
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - country admins can view platform settings
-- rationale: country admins need to read settings for their country
create policy "platform_settings_select_country_admin"
  on public.platform_settings for select
  to authenticated
  using (public.has_role(auth.uid(), 'country_admin'));

-- policy: select - global admins can view all settings
-- rationale: global admins need full access to all settings
create policy "platform_settings_select_super_admin"
  on public.platform_settings for select
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- policy: update - global admins can update all settings
-- rationale: only global admins should modify platform configuration
create policy "platform_settings_update_super_admin"
  on public.platform_settings for update
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- policy: insert - global admins can create new settings
-- rationale: only global admins should add new configuration options
create policy "platform_settings_insert_super_admin"
  on public.platform_settings for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'super_admin'));

-- policy: delete - global admins can delete settings
-- rationale: only global admins should remove configuration options
create policy "platform_settings_delete_super_admin"
  on public.platform_settings for delete
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- =====================================================
-- 4. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_platform_settings_updated_at
  before update on public.platform_settings
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 5. insert default platform settings
-- =====================================================
-- note: these are the initial default values for platform configuration

insert into public.platform_settings (key, value, label, category) values
  ('site_name', '"USF-ADC"'::jsonb, 'Nom de la plateforme', 'general'),
  ('default_language', '"fr"'::jsonb, 'Langue par défaut', 'general'),
  ('maintenance_mode', 'false'::jsonb, 'Mode maintenance', 'general'),
  ('welcome_message', '"Bienvenue sur la plateforme USF-ADC de suivi des indicateurs de service universel en Afrique."'::jsonb, 'Message d''accueil', 'general'),
  ('fsu_submission_deadline_days', '30'::jsonb, 'Délai de soumission FSU (jours)', 'fsu'),
  ('fsu_auto_reminder', 'true'::jsonb, 'Rappels automatiques FSU', 'fsu'),
  ('fsu_reminder_days_before', '7'::jsonb, 'Jours avant rappel FSU', 'fsu');

-- =====================================================
-- 6. create submission_periods table
-- =====================================================
-- note: defines the time periods for fsu submissions
-- allows for structured reporting windows (e.g., q1, q2, q3, q4)

create table public.submission_periods (
  id uuid not null default gen_random_uuid() primary key,
  -- human-readable label (e.g., 'Q1 2024', 'Année 2024')
  label text not null,
  -- start date of the submission period
  start_date date not null,
  -- end date of the submission period
  end_date date not null,
  -- whether this period is currently active
  is_active boolean not null default true,
  -- days before deadline to send reminder
  reminder_days_before integer not null default 7,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 7. enable row level security (rls) on submission_periods
-- =====================================================
-- warning: rls is required - submission periods control when users can submit

alter table public.submission_periods enable row level security;

-- =====================================================
-- 8. create rls policies for submission_periods
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - all authenticated users can view submission periods
-- rationale: users need to see what periods are available for submission
create policy "submission_periods_select_authenticated"
  on public.submission_periods for select
  to authenticated
  using (true);

-- policy: insert - global admins can create submission periods
-- rationale: only global admins should define submission windows
create policy "submission_periods_insert_super_admin"
  on public.submission_periods for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'super_admin'));

-- policy: update - global admins can update submission periods
-- rationale: only global admins should modify submission windows
create policy "submission_periods_update_super_admin"
  on public.submission_periods for update
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- policy: delete - global admins can delete submission periods
-- rationale: only global admins should remove submission windows
create policy "submission_periods_delete_super_admin"
  on public.submission_periods for delete
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- =====================================================
-- 9. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_submission_periods_updated_at
  before update on public.submission_periods
  for each row execute function public.update_updated_at_column();
