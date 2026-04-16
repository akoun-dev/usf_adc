
CREATE OR REPLACE FUNCTION public.notify_on_role_promotion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _promoted_name text;
  _country_id uuid;
  _target_user record;
BEGIN
  IF NEW.role <> 'point_focal' THEN
    RETURN NEW;
  END IF;

  SELECT full_name, country_id INTO _promoted_name, _country_id
  FROM public.profiles WHERE id = NEW.user_id;

  -- Notify the promoted user
  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (
    NEW.user_id,
    'info',
    'Promotion en Point Focal',
    'Félicitations ! Vous avez été promu(e) au rôle de Point Focal National. Vous avez désormais accès aux fonctionnalités de soumission FSU et au forum.',
    '/dashboard'
  );

  -- Notify global admins
  FOR _target_user IN
    SELECT DISTINCT ur.user_id
    FROM public.user_roles ur
    WHERE ur.role = 'global_admin'
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      _target_user.user_id,
      'info',
      'Nouveau Point Focal',
      COALESCE(_promoted_name, 'Un utilisateur') || ' a été promu(e) au rôle de Point Focal National.',
      '/users'
    );
  END LOOP;

  -- Notify country_admin of the same country
  IF _country_id IS NOT NULL THEN
    FOR _target_user IN
      SELECT DISTINCT ur.user_id
      FROM public.user_roles ur
      JOIN public.profiles p ON p.id = ur.user_id
      WHERE ur.role = 'country_admin'
        AND p.country_id = _country_id
    LOOP
      INSERT INTO public.notifications (user_id, type, title, message, link)
      VALUES (
        _target_user.user_id,
        'info',
        'Nouveau Point Focal dans votre pays',
        COALESCE(_promoted_name, 'Un utilisateur') || ' a été promu(e) au rôle de Point Focal National dans votre pays.',
        '/users'
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;
