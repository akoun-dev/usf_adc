-- Create documents table for storing document library files
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null, -- 'guides', 'reports', 'templates', etc.
  file_name text not null,
  file_path text not null,
  file_size bigint,
  mime_type text,
  is_public boolean default false,
  type text, -- 'pdf', 'docx', 'xlsx', etc.
  language text default 'fr', -- 'fr', 'en', 'pt'
  published_at timestamp with time zone,
  thumbnail text, -- thumbnail image URL
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes
create index idx_documents_category on public.documents(category);
create index idx_documents_language on public.documents(language);
create index idx_documents_is_public on public.documents(is_public);
create index idx_documents_published_at on public.documents(published_at);

-- Enable RLS
alter table public.documents enable row level security;

-- RLS policies
create policy "public_documents_are_readable" on public.documents
  for select using (is_public = true);

create policy "authenticated_users_can_view_all" on public.documents
  for select to authenticated using (true);

create policy "only_admins_can_insert" on public.documents
  for insert to authenticated with check (public.has_role(auth.uid(), 'super_admin'));

create policy "only_admins_can_update" on public.documents
  for update to authenticated using (public.has_role(auth.uid(), 'super_admin'));

create policy "only_admins_can_delete" on public.documents
  for delete to authenticated using (public.has_role(auth.uid(), 'super_admin'));

-- =====================================================
-- Create cmdt_contributions table for CMDT-25 contributions
-- =====================================================

create table if not exists public.cmdt_contributions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  content text,
  status text not null default 'draft' check (status in ('draft', 'review', 'pending', 'validated', 'rejected')),
  version text default 'v1',
  category text, -- 'declaration', 'rapport', 'recommandations', 'compte_rendu', 'note'
  country_id uuid references public.countries(id),
  created_by uuid references auth.users(id),
  collaborators jsonb default '[]',
  is_pinned boolean default false,
  views integer default 0,
  comments_count integer default 0,
  submitted_at timestamp with time zone,
  validated_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index idx_cmdt_contributions_status on public.cmdt_contributions(status);
create index idx_cmdt_contributions_country_id on public.cmdt_contributions(country_id);
create index idx_cmdt_contributions_created_by on public.cmdt_contributions(created_by);
create index idx_cmdt_contributions_category on public.cmdt_contributions(category);

-- RLS
alter table public.cmdt_contributions enable row level security;

create policy "cmdt_contributions_read_authenticated" on public.cmdt_contributions
  for select to authenticated using (true);

create policy "cmdt_contributions_insert_authenticated" on public.cmdt_contributions
  for insert to authenticated with check (created_by = auth.uid() or public.has_role(auth.uid(), 'country_admin'));

create policy "cmdt_contributions_update_authenticated" on public.cmdt_contributions
  for update to authenticated using (
    created_by = auth.uid() 
    or public.has_role(auth.uid(), 'country_admin')
    or public.has_role(auth.uid(), 'super_admin')
  );

create policy "cmdt_contributions_delete_super_admin" on public.cmdt_contributions
  for delete to authenticated using (public.has_role(auth.uid(), 'super_admin'));

-- Trigger for updated_at
create trigger update_cmdt_contributions_updated_at
  before update on public.cmdt_contributions
  for each row execute function public.update_updated_at_column();
