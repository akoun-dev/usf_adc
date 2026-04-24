-- =====================================================
-- Create event_registrations table for event participation tracking
-- =====================================================

-- Create table only if it doesn't exist
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  registered_at timestamp with time zone default now(),
  status text default 'registered' check (status in ('registered', 'attended', 'cancelled')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(event_id, user_id)
);

-- Create indexes if not exist
create index if not exists idx_event_registrations_event_id on public.event_registrations(event_id);
create index if not exists idx_event_registrations_user_id on public.event_registrations(user_id);

-- Enable RLS
alter table public.event_registrations enable row level security;

-- Drop existing policies if any (they might exist without the proper structure)
drop policy if exists "event_registrations_read" on public.event_registrations;
drop policy if exists "event_registrations_insert_own" on public.event_registrations;
drop policy if exists "event_registrations_update" on public.event_registrations;
drop policy if exists "Allow authenticated users to read their own registrations" on public.event_registrations;
drop policy if exists "Allow users to insert their own registrations" on public.event_registrations;

-- Create policies
create policy "event_registrations_read" on public.event_registrations
  for select to authenticated using (
    user_id = auth.uid()
    or public.has_role(auth.uid(), 'super_admin')
    or public.has_role(auth.uid(), 'country_admin')
  );

create policy "event_registrations_insert_own" on public.event_registrations
  for insert to authenticated with check (user_id = auth.uid());

create policy "event_registrations_update" on public.event_registrations
  for update to authenticated using (
    user_id = auth.uid()
    or public.has_role(auth.uid(), 'super_admin')
    or public.has_role(auth.uid(), 'country_admin')
  );

-- Drop existing trigger if any
drop trigger if exists update_event_registrations_updated_at on public.event_registrations;

-- Create auto-update trigger
create trigger update_event_registrations_updated_at
  before update on public.event_registrations
  for each row execute function public.update_updated_at_column();