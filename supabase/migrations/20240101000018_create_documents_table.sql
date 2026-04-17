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
