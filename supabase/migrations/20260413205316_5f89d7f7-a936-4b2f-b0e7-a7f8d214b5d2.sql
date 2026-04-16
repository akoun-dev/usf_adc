
CREATE OR REPLACE FUNCTION public.notify_on_role_promotion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _promoted_name text;
  _promoter_name text;
  _target_admin record;
BEGIN
  -- Only fire for point_focal role
  IF NEW.role <> 'point_focal' THEN
    RETURN NEW;
  END IF;

  SELECT full_name INTO _promoted_name FROM public.profiles WHERE id = NEW.user_id;

  -- Notify the promoted user
  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (
    NEW.user_id,
    'info',
    'Promotion en Point Focal',
    'Félicitations ! Vous avez été promu(e) au rôle de Point Focal National. Vous avez désormais accès aux fonctionnalités de soumission FSU et au forum.',
    '/dashboard'
  );

  -- Notify global admins about the promotion
  FOR _target_admin IN
    SELECT DISTINCT ur.user_id
    FROM public.user_roles ur
    WHERE ur.role = 'global_admin'
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      _target_admin.user_id,
      'info',
      'Nouveau Point Focal',
      COALESCE(_promoted_name, 'Un utilisateur') || ' a été promu(e) au rôle de Point Focal National.',
      '/users'
    );
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_role_promotion
AFTER INSERT ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_role_promotion();
