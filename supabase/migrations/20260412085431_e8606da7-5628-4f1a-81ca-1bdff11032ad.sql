
-- Create invitation status enum
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

-- Create invitations table
CREATE TABLE public.invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  role public.app_role NOT NULL,
  country_id uuid REFERENCES public.countries(id),
  token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '48 hours'),
  status public.invitation_status NOT NULL DEFAULT 'pending',
  invited_by uuid NOT NULL,
  accepted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Global admins can do everything
CREATE POLICY "Global admins can manage all invitations"
ON public.invitations FOR ALL TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

-- Country admins can insert invitations for their country (PF and public_external only)
CREATE POLICY "Country admins can insert country invitations"
ON public.invitations FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND country_id = get_user_country(auth.uid())
  AND role IN ('point_focal'::app_role, 'public_external'::app_role)
  AND invited_by = auth.uid()
);

-- Country admins can view their country invitations
CREATE POLICY "Country admins can view country invitations"
ON public.invitations FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND country_id = get_user_country(auth.uid())
);

-- Trigger for updated_at
CREATE TRIGGER update_invitations_updated_at
BEFORE UPDATE ON public.invitations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to accept invitation (called during signup)
CREATE OR REPLACE FUNCTION public.accept_invitation(_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invitation record;
  _user_id uuid;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT * INTO _invitation FROM public.invitations
  WHERE token = _token AND status = 'pending' AND expires_at > now();

  IF _invitation IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invitation');
  END IF;

  -- Assign role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _invitation.role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Set country if provided
  IF _invitation.country_id IS NOT NULL THEN
    UPDATE public.profiles SET country_id = _invitation.country_id WHERE id = _user_id;
  END IF;

  -- Mark invitation as accepted
  UPDATE public.invitations
  SET status = 'accepted', accepted_at = now()
  WHERE id = _invitation.id;

  RETURN jsonb_build_object('success', true, 'role', _invitation.role);
END;
$$;
