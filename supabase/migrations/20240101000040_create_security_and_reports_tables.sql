-- =====================================================
-- migration: create security and reports tables
-- =====================================================
-- purpose: store api keys, ip restrictions and quarterly reports
-- affected tables: api_keys, ip_restrictions, quarterly_reports
-- =====================================================

-- 1. API Keys Table
create table public.api_keys (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  key text not null unique,
  is_active boolean not null default true,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.api_keys enable row level security;

create policy "api_keys_select_super_admin"
  on public.api_keys for select
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

create policy "api_keys_all_super_admin"
  on public.api_keys for all
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- 2. IP Restrictions Table
create table public.ip_restrictions (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  ip_range text not null,
  type text not null check (type in ('allow', 'deny')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ip_restrictions enable row level security;

create policy "ip_restrictions_select_super_admin"
  on public.ip_restrictions for select
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

create policy "ip_restrictions_all_super_admin"
  on public.ip_restrictions for all
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- 3. Quarterly Reports Table
create table public.quarterly_reports (
  id uuid not null default gen_random_uuid() primary key,
  title text not null,
  quarter text not null check (quarter in ('Q1', 'Q2', 'Q3', 'Q4')),
  year integer not null,
  summary text,
  file_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quarterly_reports enable row level security;

create policy "quarterly_reports_select_admin"
  on public.quarterly_reports for select
  to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role in ('country_admin', 'super_admin')
    )
  );

create policy "quarterly_reports_all_super_admin"
  on public.quarterly_reports for all
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- Triggers for updated_at
create trigger update_api_keys_updated_at before update on public.api_keys for each row execute function public.update_updated_at_column();
create trigger update_ip_restrictions_updated_at before update on public.ip_restrictions for each row execute function public.update_updated_at_column();
create trigger update_quarterly_reports_updated_at before update on public.quarterly_reports for each row execute function public.update_updated_at_column();
