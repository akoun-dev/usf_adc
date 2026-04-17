-- =====================================================
-- migration: create notification triggers
-- =====================================================
-- purpose: set up automatic notifications for important events
-- affected objects: triggers on forum_topics, fsu_submissions, support_tickets, support_ticket_comments
-- special considerations:
--   - triggers fire after specific database events
--   - notifications are created automatically by these triggers
-- =====================================================

-- =====================================================
-- 1. create trigger: notify on new forum topic
-- =====================================================
-- note: sends notifications to all admins when a new forum topic is created
-- this helps moderators stay aware of new discussions

create or replace function public.notify_on_forum_topic()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _author_name text;
  _topic_title text;
  _target_user record;
begin
  -- get the author's name for the notification
  select full_name into _author_name from public.profiles where id = new.created_by;
  _topic_title := new.title;

  -- notify all admins (point_focal and above) except the author
  for _target_user in
    select distinct ur.user_id
    from public.user_roles ur
    where ur.user_id <> new.created_by
      and ur.role in ('point_focal', 'country_admin', 'super_admin')
  loop
    insert into public.notifications (user_id, type, title, message, link)
    values (
      _target_user.user_id,
      'info',
      'Nouveau sujet sur le forum',
      coalesce(_author_name, 'Un utilisateur') || ' a créé le sujet « ' || _topic_title || ' »',
      '/forum/' || new.id
    );
  end loop;

  return new;
end;
$$;

-- =====================================================
-- 2. attach trigger to forum_topics
-- =====================================================
-- note: fires after a new topic is inserted

create trigger trg_notify_forum_topic
  after insert on public.forum_topics
  for each row execute function public.notify_on_forum_topic();

-- =====================================================
-- 3. create trigger: notify on fsu submission submitted
-- =====================================================
-- note: sends notifications to country admins when an fsu submission is submitted
-- this alerts validators that a submission needs review

create or replace function public.notify_on_fsu_submitted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _submitter_name text;
  _country_name text;
  _target_user record;
begin
  -- only fire when status becomes 'submitted'
  if new.status <> 'submitted' then
    return new;
  end if;
  if tg_op = 'update' and old.status = 'submitted' then
    return new;
  end if;

  -- get submitter and country names
  select full_name into _submitter_name from public.profiles where id = new.submitted_by;
  select name_fr into _country_name from public.countries where id = new.country_id;

  -- notify country admins of the same country
  for _target_user in
    select distinct ur.user_id
    from public.user_roles ur
    join public.profiles p on p.id = ur.user_id
    where ur.user_id <> new.submitted_by
      and (
        (ur.role = 'country_admin' and p.country_id = new.country_id)
        or ur.role = 'super_admin'
      )
  loop
    insert into public.notifications (user_id, type, title, message, link)
    values (
      _target_user.user_id,
      'action_required',
      'Nouvelle soumission FSU',
      coalesce(_submitter_name, 'Un utilisateur') || ' a soumis un formulaire FSU pour ' || coalesce(_country_name, 'un pays'),
      '/fsu/submissions/' || new.id
    );
  end loop;

  return new;
end;
$$;

-- =====================================================
-- 4. attach trigger to fsu_submissions
-- =====================================================
-- note: fires after insert or update when status becomes 'submitted'

create trigger trg_notify_fsu_submitted
  after insert or update on public.fsu_submissions
  for each row execute function public.notify_on_fsu_submitted();

-- =====================================================
-- 5. create trigger: notify on ticket status change
-- =====================================================
-- note: notifies ticket creator when status changes
-- this keeps users informed about their support requests

create or replace function public.notify_on_ticket_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _status_labels jsonb := '{"open":"Ouvert","in_progress":"En cours","resolved":"Résolu","closed":"Fermé"}'::jsonb;
  _new_label text;
begin
  -- only fire if status actually changed
  if old.status = new.status then
    return new;
  end if;

  -- don't notify if the ticket creator is the one changing the status
  if new.created_by = auth.uid() then
    return new;
  end if;

  _new_label := coalesce(_status_labels ->> new.status::text, new.status::text);

  insert into public.notifications (user_id, type, title, message, link)
  values (
    new.created_by,
    'info',
    'Statut du ticket mis à jour',
    'Le statut de votre ticket « ' || new.title || ' » a été changé en ' || _new_label,
    '/support/' || new.id
  );

  return new;
end;
$$;

-- =====================================================
-- 6. attach trigger to support_tickets
-- =====================================================
-- note: fires after update when status changes

create trigger trg_notify_on_ticket_status_change
  after update on public.support_tickets
  for each row execute function public.notify_on_ticket_status_change();

-- =====================================================
-- 7. create trigger: notify on ticket comment
-- =====================================================
-- note: notifies ticket creator and admins when a comment is added
-- this keeps the support conversation flowing

create or replace function public.notify_on_ticket_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _author_name text;
  _ticket record;
  _target_user record;
begin
  -- get author and ticket details
  select full_name into _author_name from public.profiles where id = new.author_id;
  select * into _ticket from public.support_tickets where id = new.ticket_id;

  if _ticket is null then
    return new;
  end if;

  -- notify ticket creator (if not the commenter)
  if _ticket.created_by <> new.author_id then
    insert into public.notifications (user_id, type, title, message, link)
    values (
      _ticket.created_by,
      'info',
      'Nouveau commentaire sur votre ticket',
      coalesce(_author_name, 'Un utilisateur') || ' a commenté votre ticket « ' || _ticket.title || ' »',
      '/support/' || _ticket.id
    );
  end if;

  -- notify relevant admins
  for _target_user in
    select distinct ur.user_id
    from public.user_roles ur
    left join public.profiles p on p.id = ur.user_id
    where ur.user_id <> new.author_id
      and ur.user_id <> _ticket.created_by
      and (
        ur.role = 'super_admin'
        or (ur.role = 'country_admin' and p.country_id = public.get_user_country(_ticket.created_by))
      )
  loop
    insert into public.notifications (user_id, type, title, message, link)
    values (
      _target_user.user_id,
      'info',
      'Nouveau commentaire sur un ticket',
      coalesce(_author_name, 'Un utilisateur') || ' a commenté le ticket « ' || _ticket.title || ' »',
      '/support/' || _ticket.id
    );
  end loop;

  return new;
end;
$$;

-- =====================================================
-- 8. attach trigger to support_ticket_comments
-- =====================================================
-- note: fires after a new comment is inserted

create trigger trg_notify_on_ticket_comment
  after insert on public.support_ticket_comments
  for each row execute function public.notify_on_ticket_comment();
