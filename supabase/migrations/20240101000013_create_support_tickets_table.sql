-- =====================================================
-- migration: create support tickets tables
-- =====================================================
-- purpose: create support ticket system for user help requests
-- affected tables: support_tickets, support_ticket_comments
-- special considerations:
--   - tickets have a status workflow (open -> in_progress -> resolved -> closed)
--   - comments allow discussion between users and support staff
-- =====================================================

-- =====================================================
-- 1. create support_tickets table
-- =====================================================
-- note: stores support/help requests from users
-- includes priority level and assignment to support staff

create table public.support_tickets (
  id uuid not null default gen_random_uuid() primary key,
  -- ticket title
  title text not null,
  -- detailed description of the issue
  description text not null,
  -- current status in the support workflow
  status public.ticket_status not null default 'open',
  -- priority level (low, medium, high, urgent)
  priority text not null default 'medium',
  -- user who created the ticket
  created_by uuid not null references auth.users(id),
  -- support staff member assigned to this ticket
  assigned_to uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls) on support_tickets
-- =====================================================
-- warning: rls is critical - tickets may contain sensitive user information

alter table public.support_tickets enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up support dashboard queries

create index idx_support_tickets_created_by on public.support_tickets(created_by);
create index idx_support_tickets_assigned_to on public.support_tickets(assigned_to);
create index idx_support_tickets_status on public.support_tickets(status);

-- =====================================================
-- 4. create rls policies for support_tickets
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - users can view their own tickets
-- rationale: users need to see the tickets they created
create policy "support_tickets_select_own"
  on public.support_tickets for select
  to authenticated
  using (created_by = auth.uid());

-- policy: select - country admins can view tickets from users in their country
-- rationale: country admins provide support for users in their jurisdiction
create policy "support_tickets_select_country_admin"
  on public.support_tickets for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and public.get_user_country(created_by) = public.get_user_country(auth.uid())
  );

-- policy: select - global admins can view all tickets
-- rationale: global admins need full visibility for support oversight
create policy "support_tickets_select_global_admin"
  on public.support_tickets for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: insert - all authenticated users can create tickets
-- rationale: any user may need to request support
create policy "support_tickets_insert_authenticated"
  on public.support_tickets for insert
  to authenticated
  with check (created_by = auth.uid());

-- policy: update - users can update their own tickets
-- rationale: users may need to add information or change status
create policy "support_tickets_update_own"
  on public.support_tickets for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

-- policy: update - country admins can update tickets from their country
-- rationale: country admins provide support and manage tickets
create policy "support_tickets_update_country_admin"
  on public.support_tickets for update
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and public.get_user_country(created_by) = public.get_user_country(auth.uid())
  )
  with check (
    public.has_role(auth.uid(), 'country_admin')
    and public.get_user_country(created_by) = public.get_user_country(auth.uid())
  );

-- policy: update - global admins can update any ticket
-- rationale: global admins have full control over all tickets
create policy "support_tickets_update_global_admin"
  on public.support_tickets for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - global admins can delete tickets
-- rationale: only global admins should delete tickets (for cleanup)
create policy "support_tickets_delete_global_admin"
  on public.support_tickets for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 5. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_support_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 6. create support_ticket_comments table
-- =====================================================
-- note: stores comments/discussion on support tickets
-- allows back-and-forth between users and support staff

create table public.support_ticket_comments (
  id uuid not null default gen_random_uuid() primary key,
  -- foreign key to support_tickets - deleted on cascade
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  -- user who wrote this comment (references profiles, not auth.users)
  author_id uuid not null references public.profiles(id),
  -- comment content
  content text not null,
  created_at timestamptz not null default now()
);

-- =====================================================
-- 7. enable row level security (rls) on support_ticket_comments
-- =====================================================
-- warning: rls is critical - comments may contain sensitive information

alter table public.support_ticket_comments enable row level security;

-- =====================================================
-- 8. create indexes for performance
-- =====================================================
-- note: these indexes speed up comment queries

create index idx_support_ticket_comments_ticket_id on public.support_ticket_comments(ticket_id);
create index idx_support_ticket_comments_author_id on public.support_ticket_comments(author_id);

-- =====================================================
-- 9. create rls policies for support_ticket_comments
-- =====================================================
-- note: access to comments is derived from access to the parent ticket

-- policy: select - users can view comments on their own tickets
-- rationale: users need to see the discussion on their tickets
create policy "support_ticket_comments_select_own"
  on public.support_ticket_comments for select
  to authenticated
  using (
    exists (
      select 1 from public.support_tickets t
      where t.id = support_ticket_comments.ticket_id
        and t.created_by = auth.uid()
    )
  );

-- policy: select - country admins can view comments on country tickets
-- rationale: country admins need to see discussions on tickets they manage
create policy "support_ticket_comments_select_country_admin"
  on public.support_ticket_comments for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and exists (
      select 1 from public.support_tickets t
      where t.id = support_ticket_comments.ticket_id
        and public.get_user_country(t.created_by) = public.get_user_country(auth.uid())
    )
  );

-- policy: select - global admins can view all comments
-- rationale: global admins need full visibility into all discussions
create policy "support_ticket_comments_select_global_admin"
  on public.support_ticket_comments for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: insert - users can add comments to their own tickets
-- rationale: users participate in the support discussion
create policy "support_ticket_comments_insert_own"
  on public.support_ticket_comments for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.support_tickets t
      where t.id = support_ticket_comments.ticket_id
        and t.created_by = auth.uid()
    )
  );

-- policy: insert - country admins can add comments to country tickets
-- rationale: country admins provide support through comments
create policy "support_ticket_comments_insert_country_admin"
  on public.support_ticket_comments for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.has_role(auth.uid(), 'country_admin')
    and exists (
      select 1 from public.support_tickets t
      where t.id = support_ticket_comments.ticket_id
        and public.get_user_country(t.created_by) = public.get_user_country(auth.uid())
    )
  );

-- policy: insert - global admins can add comments to any ticket
-- rationale: global admins can participate in any support discussion
create policy "support_ticket_comments_insert_global_admin"
  on public.support_ticket_comments for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.has_role(auth.uid(), 'global_admin')
  );
