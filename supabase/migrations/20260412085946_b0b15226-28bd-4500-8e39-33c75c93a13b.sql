
-- Add mfa_method to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mfa_method text NOT NULL DEFAULT 'email';

-- Create MFA challenges table
CREATE TABLE public.mfa_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  code text NOT NULL,
  method text NOT NULL DEFAULT 'email',
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '5 minutes'),
  verified_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.mfa_challenges ENABLE ROW LEVEL SECURITY;

-- Users can only see their own challenges
CREATE POLICY "Users can view own mfa challenges"
ON public.mfa_challenges FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own challenges
CREATE POLICY "Users can insert own mfa challenges"
ON public.mfa_challenges FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update own challenges (for verification)
CREATE POLICY "Users can update own mfa challenges"
ON public.mfa_challenges FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- Generate MFA code function
CREATE OR REPLACE FUNCTION public.generate_mfa_code(_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _code text;
BEGIN
  -- Generate 6-digit code
  _code := lpad(floor(random() * 1000000)::text, 6, '0');
  
  -- Invalidate previous pending codes
  DELETE FROM public.mfa_challenges
  WHERE user_id = _user_id AND verified_at IS NULL;
  
  -- Insert new code
  INSERT INTO public.mfa_challenges (user_id, code, method)
  VALUES (_user_id, _code, COALESCE(
    (SELECT mfa_method FROM public.profiles WHERE id = _user_id),
    'email'
  ));
  
  RETURN _code;
END;
$$;

-- Verify MFA code function
CREATE OR REPLACE FUNCTION public.verify_mfa_code(_user_id uuid, _code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _challenge record;
BEGIN
  SELECT * INTO _challenge FROM public.mfa_challenges
  WHERE user_id = _user_id
    AND code = _code
    AND verified_at IS NULL
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF _challenge IS NULL THEN
    RETURN false;
  END IF;
  
  UPDATE public.mfa_challenges
  SET verified_at = now()
  WHERE id = _challenge.id;
  
  RETURN true;
END;
$$;
