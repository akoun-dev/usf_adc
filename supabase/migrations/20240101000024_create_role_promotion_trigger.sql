-- =====================================================
-- migration: create role promotion trigger
-- =====================================================
-- purpose: log role assignments and send notifications for point_focal promotions
-- affected objects: trigger on user_roles
-- special considerations:
--   - this trigger fires after any role is assigned
--   - point_focal promotions trigger special notifications
-- =====================================================

-- =====================================================
-- 1. create trigger: log and notify on role assignment
-- =====================================================
-- note: this is the final version that includes both logging and notifications
-- it replaces any previous versions of the notify_on_role_promotion function

create or replace function public.notify_on_role_promotion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _promoted_name text;
  _country_id uuid;
  _target_user record;
begin
  -- log every role assignment in role_promotions for audit trail
  insert into public.role_promotions (user_id, role)
  values (new.user_id, new.role::text);

  -- only send notifications for point_focal promotions
  if new.role <> 'point_focal' then
    return new;
  end if;

  -- get user details
  select full_name, country_id into _promoted_name, _country_id
  from public.profiles where id = new.user_id;

  -- notify the promoted user
  insert into public.notifications (user_id, type, title, message, link)
  values (
    new.user_id,
    'info',
    'Promotion en Point Focal',
    'Félicitations ! Vous avez été promu(e) au rôle de Point Focal National. Vous avez désormais accès aux fonctionnalités de soumission FSU et au forum.',
    '/dashboard'
  );

  -- notify all global admins
  for _target_user in
    select distinct ur.user_id from public.user_roles ur where ur.role = 'global_admin'
  loop
    insert into public.notifications (user_id, type, title, message, link)
    values (
      _target_user.user_id,
      'info',
      'Nouveau Point Focal',
      coalesce(_promoted_name, 'Un utilisateur') || ' a été promu(e) au rôle de Point Focal National.',
      '/users'
    );
  end loop;

  -- notify country admins of the same country
  if _country_id is not null then
    for _target_user in
      select distinct ur.user_id from public.user_roles ur
      join public.profiles p on p.id = ur.user_id
      where ur.role = 'country_admin' and p.country_id = _country_id
    loop
      insert into public.notifications (user_id, type, title, message, link)
      values (
        _target_user.user_id,
        'info',
        'Nouveau Point Focal dans votre pays',
        coalesce(_promoted_name, 'Un utilisateur') || ' a été promu(e) au rôle de Point Focal National dans votre pays.',
        '/users'
      );
    end loop;
  end if;

  return new;
end;
$$;

-- =====================================================
-- 2. drop existing trigger if present
-- =====================================================
-- note: this ensures we don't create duplicate triggers

drop trigger if exists on_role_promotion on public.user_roles;

-- =====================================================
-- 3. attach trigger to user_roles
-- =====================================================
-- note: fires after a new role is inserted

create trigger on_role_promotion
  after insert on public.user_roles
  for each row execute function public.notify_on_role_promotion();
