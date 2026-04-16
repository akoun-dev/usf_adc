-- =====================================================
-- migration: create role promotion trigger (fixed)
-- =====================================================
-- purpose: log role assignments and send notifications for point_focal promotions
-- affected objects: trigger on user_roles

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
  insert into public.role_promotions (user_id, role)
  values (new.user_id, new.role);

  if new.role <> 'point_focal' then
    return new;
  end if;

  select full_name, country_id into _promoted_name, _country_id
  from public.profiles where id = new.user_id;

  insert into public.notifications (user_id, type, title, message, link)
  values (
    new.user_id,
    'info',
    'Promotion en Point Focal',
    'Félicitations ! Vous avez été promu(e) au rôle de Point Focal National.',
    '/dashboard'
  );

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

  return new;
end;
$$;

drop trigger if exists on_role_promotion on public.user_roles;

create trigger on_role_promotion
  after insert on public.user_roles
  for each row execute function public.notify_on_role_promotion();
