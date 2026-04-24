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
  category text,
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

create index if not exists idx_cmdt_contributions_status on public.cmdt_contributions(status);
create index if not exists idx_cmdt_contributions_country_id on public.cmdt_contributions(country_id);
create index if not exists idx_cmdt_contributions_created_by on public.cmdt_contributions(created_by);
create index if not exists idx_cmdt_contributions_category on public.cmdt_contributions(category);

alter table public.cmdt_contributions enable row level security;

drop policy if exists "cmdt_contributions_read_authenticated" on public.cmdt_contributions;
create policy "cmdt_contributions_read_authenticated" on public.cmdt_contributions
  for select to authenticated using (true);

drop policy if exists "cmdt_contributions_insert_authenticated" on public.cmdt_contributions;
create policy "cmdt_contributions_insert_authenticated" on public.cmdt_contributions
  for insert to authenticated with check (created_by = auth.uid() or public.has_role(auth.uid(), 'country_admin'));

drop policy if exists "cmdt_contributions_update_authenticated" on public.cmdt_contributions;
create policy "cmdt_contributions_update_authenticated" on public.cmdt_contributions
  for update to authenticated using (
    created_by = auth.uid() 
    or public.has_role(auth.uid(), 'country_admin')
    or public.has_role(auth.uid(), 'super_admin')
  );

drop policy if exists "cmdt_contributions_delete_super_admin" on public.cmdt_contributions;
create policy "cmdt_contributions_delete_super_admin" on public.cmdt_contributions
  for delete to authenticated using (public.has_role(auth.uid(), 'super_admin'));

drop trigger if exists update_cmdt_contributions_updated_at on public.cmdt_contributions;
create trigger update_cmdt_contributions_updated_at
  before update on public.cmdt_contributions
  for each row execute function public.update_updated_at_column();

comment on table public.cmdt_contributions is 'CMDT-25 collaborative contributions workspace';