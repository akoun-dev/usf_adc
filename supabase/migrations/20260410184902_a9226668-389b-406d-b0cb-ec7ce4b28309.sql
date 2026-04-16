-- Trigger function: notify on new forum topic
CREATE OR REPLACE FUNCTION public.notify_on_forum_topic()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _author_name text;
  _topic_title text;
  _target_user record;
BEGIN
  SELECT full_name INTO _author_name FROM public.profiles WHERE id = NEW.created_by;
  _topic_title := NEW.title;

  FOR _target_user IN
    SELECT DISTINCT ur.user_id
    FROM public.user_roles ur
    WHERE ur.user_id <> NEW.created_by
      AND ur.role IN ('point_focal', 'country_admin', 'global_admin')
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      _target_user.user_id,
      'info',
      'Nouveau sujet sur le forum',
      COALESCE(_author_name, 'Un utilisateur') || ' a créé le sujet « ' || _topic_title || ' »',
      '/forum/' || NEW.id
    );
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_forum_topic
AFTER INSERT ON public.forum_topics
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_forum_topic();

-- Trigger function: notify on FSU submission submitted
CREATE OR REPLACE FUNCTION public.notify_on_fsu_submitted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _submitter_name text;
  _country_name text;
  _target_user record;
BEGIN
  -- Only fire when status becomes 'submitted'
  IF NEW.status <> 'submitted' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'submitted' THEN
    RETURN NEW;
  END IF;

  SELECT full_name INTO _submitter_name FROM public.profiles WHERE id = NEW.submitted_by;
  SELECT name_fr INTO _country_name FROM public.countries WHERE id = NEW.country_id;

  -- Notify country_admin of same country
  FOR _target_user IN
    SELECT DISTINCT ur.user_id
    FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id <> NEW.submitted_by
      AND (
        (ur.role = 'country_admin' AND p.country_id = NEW.country_id)
        OR ur.role = 'global_admin'
      )
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      _target_user.user_id,
      'action_required',
      'Nouvelle soumission FSU',
      COALESCE(_submitter_name, 'Un utilisateur') || ' a soumis un formulaire FSU pour ' || COALESCE(_country_name, 'un pays'),
      '/fsu/submissions/' || NEW.id
    );
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_fsu_submitted
AFTER INSERT OR UPDATE ON public.fsu_submissions
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_fsu_submitted();