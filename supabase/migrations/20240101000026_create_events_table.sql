-- =====================================================
-- migration: create events table
-- =====================================================
-- purpose: store information about upcoming and past events (conferences, webinars, workshops)
-- affected tables: events
-- special considerations:
--   - events can be one-time or recurring
--   - status tracks whether event is upcoming, ongoing, or completed
-- =====================================================

-- =====================================================
-- 1. create event_status enum
-- =====================================================
-- note: defines the possible states of an event

create type public.event_status as enum ('upcoming', 'ongoing', 'completed', 'cancelled');

-- =====================================================
-- 2. create event_type enum
-- =====================================================
-- note: defines the type/format of event

create type public.event_type as enum ('conference', 'webinar', 'workshop', 'training', 'meeting', 'other');

-- =====================================================
-- 3. create events table
-- =====================================================
-- note: stores events organized by uat or member countries
-- includes both public and invitation-only events

create table public.events (
  id uuid not null default gen_random_uuid() primary key,
  -- event title
  title text not null,
  -- detailed event description
  description text,
  -- start date and time
  start_date timestamptz not null,
  -- end date and time
  end_date timestamptz not null,
  -- location or platform (e.g., 'dakar, senegal' or 'online')
  location text,
  -- event type (conference, webinar, etc.)
  event_type public.event_type not null default 'conference',
  -- current status of the event
  status public.event_status not null default 'upcoming',
  -- maximum number of participants
  max_participants integer,
  -- url for event registration
  registration_url text,
  -- price or cost (e.g., 'gratuit', '50000 fcf')
  price text,
  -- event image url
  image_url text,
  -- organizing entity
  organizer text,
  -- whether event is visible to public
  is_public boolean not null default true,
  -- country id (optional, for country-specific events)
  country_id uuid references public.countries(id),
  -- created by user
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 4. enable row level security (rls)
-- =====================================================
-- warning: rls is required - events may have restricted access

alter table public.events enable row level security;

-- =====================================================
-- 5. create indexes for performance
-- =====================================================
-- note: these indexes speed up event queries

create index idx_events_start_date on public.events(start_date);
create index idx_events_end_date on public.events(end_date);
create index idx_events_status on public.events(status);
create index idx_events_type on public.events(event_type);
create index idx_events_country_id on public.events(country_id);
create index idx_events_is_public on public.events(is_public);

-- =====================================================
-- 6. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - authenticated users can view public events
-- rationale: events should be visible to all authenticated users
create policy "events_select_authenticated"
  on public.events for select
  to authenticated
  using (is_public = true);

-- policy: select - global admins can view all events
-- rationale: global admins need to see private events
create policy "events_select_global_admin"
  on public.events for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: insert - country admins can create events for their country
-- rationale: country admins manage events in their jurisdiction
create policy "events_insert_country_admin"
  on public.events for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: insert - global admins can create any event
-- rationale: global admins can organize platform-wide events
create policy "events_insert_global_admin"
  on public.events for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.has_role(auth.uid(), 'global_admin')
  );

-- policy: update - country admins can update their country events
-- rationale: country admins manage events in their jurisdiction
create policy "events_update_country_admin"
  on public.events for update
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  )
  with check (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: update - global admins can update any event
-- rationale: global admins have full control
create policy "events_update_global_admin"
  on public.events for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - global admins can delete events
-- rationale: only global admins should delete events
create policy "events_delete_global_admin"
  on public.events for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 7. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_events_updated_at
  before update on public.events
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 8. create event_tags table (for many-to-many relationship)
-- =====================================================
-- note: stores tags associated with events
-- allows for flexible categorization and filtering

create table public.event_tags (
  id uuid not null default gen_random_uuid() primary key,
  event_id uuid not null references public.events(id) on delete cascade,
  tag text not null,
  unique(event_id, tag)
);

-- =====================================================
-- 9. enable rls on event_tags
-- =====================================================

alter table public.event_tags enable row level security;

-- =====================================================
-- 10. create rls policies for event_tags
-- =====================================================
-- note: access to tags is derived from access to the parent event

-- policy: select - users can view tags of events they can view
create policy "event_tags_select_from_events"
  on public.event_tags for select
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_tags.event_id
        and (e.is_public = true or public.has_role(auth.uid(), 'global_admin'))
    )
  );

-- policy: insert - users can insert tags for events they can modify
create policy "event_tags_insert_from_events"
  on public.event_tags for insert
  to authenticated
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_tags.event_id
        and (
          (public.has_role(auth.uid(), 'country_admin') and e.country_id = public.get_user_country(auth.uid()))
          or public.has_role(auth.uid(), 'global_admin')
        )
    )
  );

-- policy: delete - users can delete tags from events they can modify
create policy "event_tags_delete_from_events"
  on public.event_tags for delete
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_tags.event_id
        and (
          (public.has_role(auth.uid(), 'country_admin') and e.country_id = public.get_user_country(auth.uid()))
          or public.has_role(auth.uid(), 'global_admin')
        )
    )
  );
