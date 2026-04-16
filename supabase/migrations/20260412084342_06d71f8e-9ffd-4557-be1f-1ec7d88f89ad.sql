
-- 1. Trigger: notify on ticket status change
CREATE OR REPLACE FUNCTION public.notify_on_ticket_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _status_labels jsonb := '{"open":"Ouvert","in_progress":"En cours","resolved":"Résolu","closed":"Fermé"}'::jsonb;
  _new_label text;
BEGIN
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Don't notify if the ticket creator is the one changing the status
  IF NEW.created_by = auth.uid() THEN
    RETURN NEW;
  END IF;

  _new_label := COALESCE(_status_labels ->> NEW.status::text, NEW.status::text);

  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (
    NEW.created_by,
    'info',
    'Statut du ticket mis à jour',
    'Le statut de votre ticket « ' || NEW.title || ' » a été changé en ' || _new_label,
    '/support/' || NEW.id
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_on_ticket_status_change
  AFTER UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_ticket_status_change();

-- 2. Trigger: notify on ticket comment
CREATE OR REPLACE FUNCTION public.notify_on_ticket_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _author_name text;
  _ticket record;
  _target_user record;
BEGIN
  SELECT full_name INTO _author_name FROM public.profiles WHERE id = NEW.author_id;
  SELECT * INTO _ticket FROM public.support_tickets WHERE id = NEW.ticket_id;

  IF _ticket IS NULL THEN
    RETURN NEW;
  END IF;

  -- Notify ticket creator (if not the commenter)
  IF _ticket.created_by <> NEW.author_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      _ticket.created_by,
      'info',
      'Nouveau commentaire sur votre ticket',
      COALESCE(_author_name, 'Un utilisateur') || ' a commenté votre ticket « ' || _ticket.title || ' »',
      '/support/' || _ticket.id
    );
  END IF;

  -- Notify relevant admins (global_admin + country_admin of same country)
  FOR _target_user IN
    SELECT DISTINCT ur.user_id
    FROM public.user_roles ur
    LEFT JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id <> NEW.author_id
      AND ur.user_id <> _ticket.created_by
      AND (
        ur.role = 'global_admin'
        OR (ur.role = 'country_admin' AND p.country_id = get_user_country(_ticket.created_by))
      )
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      _target_user.user_id,
      'info',
      'Nouveau commentaire sur un ticket',
      COALESCE(_author_name, 'Un utilisateur') || ' a commenté le ticket « ' || _ticket.title || ' »',
      '/support/' || _ticket.id
    );
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_on_ticket_comment
  AFTER INSERT ON public.support_ticket_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_ticket_comment();
