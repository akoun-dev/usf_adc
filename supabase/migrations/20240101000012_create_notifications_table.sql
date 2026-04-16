-- =====================================================
-- migration: create notifications table
-- =====================================================
-- purpose: store user notifications for in-app alerts
-- affected tables: notifications
-- special considerations:
--   - notifications are user-specific and should be read by their owner
--   - read_at timestamp tracks whether a notification has been read
-- =====================================================

-- =====================================================
-- 1. create notifications table
-- =====================================================
-- note: stores in-app notifications for users
-- these appear as alerts/badges in the ui

create table public.notifications (
  id uuid not null default gen_random_uuid() primary key,
  -- the user who should receive this notification
  user_id uuid not null references auth.users(id) on delete cascade,
  -- type of notification (affects display styling)
  type public.notification_type not null default 'info',
  -- notification title (short, bold text)
  title text not null,
  -- notification message (longer description)
  message text not null,
  -- optional link to redirect when notification is clicked
  link text,
  -- timestamp when notification was marked as read
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- warning: rls is critical - notifications are private to each user
-- without proper rls, users could see notifications meant for others

alter table public.notifications enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up notification queries

create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_read_at on public.notifications(read_at);
create index idx_notifications_created_at on public.notifications(created_at);

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - users can view their own notifications
-- rationale: users should only see notifications addressed to them
create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

-- policy: update - users can mark their own notifications as read
-- rationale: users need to update read_at when they view a notification
create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- policy: insert - global admins can create notifications for any user
-- rationale: admins may need to send system-wide or targeted notifications
create policy "notifications_insert_global_admin"
  on public.notifications for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - global admins can delete any notification
-- rationale: admins may need to remove inappropriate notifications
create policy "notifications_delete_global_admin"
  on public.notifications for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - users can delete their own notifications
-- rationale: users may want to dismiss/remove notifications
create policy "notifications_delete_own"
  on public.notifications for delete
  to authenticated
  using (user_id = auth.uid());

-- =====================================================
-- 5. enable realtime for live updates
-- =====================================================
-- note: realtime allows the frontend to receive new notifications instantly
-- this is critical for timely notification delivery

alter publication supabase_realtime add table public.notifications;
