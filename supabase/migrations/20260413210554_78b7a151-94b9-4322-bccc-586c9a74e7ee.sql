
-- Table to track role promotion history
CREATE TABLE public.role_promotions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role text NOT NULL,
  promoted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.role_promotions ENABLE ROW LEVEL SECURITY;

-- Users can view their own promotion history
CREATE POLICY "Users can view own promotions"
  ON public.role_promotions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Country admins can view promotions for users in their country
CREATE POLICY "Country admins can view country promotions"
  ON public.role_promotions FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'country_admin') 
    AND get_user_country(user_id) IS NOT NULL
    AND get_user_country(user_id) = get_user_country(auth.uid())
  );

-- Global admins can view all promotions
CREATE POLICY "Global admins can view all promotions"
  ON public.role_promotions FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'global_admin'));

-- Index for fast user lookups
CREATE INDEX idx_role_promotions_user_id ON public.role_promotions (user_id);

-- Update trigger to also log into role_promotions
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
  -- Log every role assignment in role_promotions
  INSERT INTO public.role_promotions (user_id, role)
  VALUES (NEW.user_id, NEW.role::text);

  -- Only send notifications for point_focal promotions
  IF NEW.role <> 'point_focal' THEN
    RETURN NEW;
  END IF;

  SELECT full_name, country_id INTO _promoted_name, _country_id
  FROM public.profiles WHERE id = NEW.user_id;

  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (
    NEW.user_id, 'info', 'Promotion en Point Focal',
    'Félicitations ! Vous avez été promu(e) au rôle de Point Focal National. Vous avez désormais accès aux fonctionnalités de soumission FSU et au forum.',
    '/dashboard'
  );

  FOR _target_user IN
    SELECT DISTINCT ur.user_id FROM public.user_roles ur WHERE ur.role = 'global_admin'
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (_target_user.user_id, 'info', 'Nouveau Point Focal',
      COALESCE(_promoted_name, 'Un utilisateur') || ' a été promu(e) au rôle de Point Focal National.', '/users');
  END LOOP;

  IF _country_id IS NOT NULL THEN
    FOR _target_user IN
      SELECT DISTINCT ur.user_id FROM public.user_roles ur
      JOIN public.profiles p ON p.id = ur.user_id
      WHERE ur.role = 'country_admin' AND p.country_id = _country_id
    LOOP
      INSERT INTO public.notifications (user_id, type, title, message, link)
      VALUES (_target_user.user_id, 'info', 'Nouveau Point Focal dans votre pays',
        COALESCE(_promoted_name, 'Un utilisateur') || ' a été promu(e) au rôle de Point Focal National dans votre pays.', '/users');
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;
