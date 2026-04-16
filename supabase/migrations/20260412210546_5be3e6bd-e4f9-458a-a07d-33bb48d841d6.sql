-- Create newsletters table
CREATE TABLE public.newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  content text NOT NULL,
  target_roles app_role[] NOT NULL DEFAULT '{point_focal,country_admin,global_admin}',
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  email_sent boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view published newsletters targeting their role
CREATE POLICY "Users can view published newsletters for their roles"
  ON public.newsletters FOR SELECT TO authenticated
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = ANY(target_roles)
    )
  );

-- Global admins can manage all newsletters
CREATE POLICY "Global admins can manage newsletters"
  ON public.newsletters FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'global_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_newsletters_updated_at
  BEFORE UPDATE ON public.newsletters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();