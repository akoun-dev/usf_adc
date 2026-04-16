
-- Create fsu_validation_actions table
CREATE TABLE public.fsu_validation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.fsu_submissions(id) ON DELETE CASCADE,
  action public.validation_action_type NOT NULL,
  comment text,
  performed_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fsu_validation_actions ENABLE ROW LEVEL SECURITY;

-- RLS: Submission author can view actions on their submissions
CREATE POLICY "Authors can view actions on own submissions"
ON public.fsu_validation_actions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.fsu_submissions s
    WHERE s.id = fsu_validation_actions.submission_id
      AND s.submitted_by = auth.uid()
  )
);

-- RLS: Country admin can view actions on country submissions
CREATE POLICY "Country admins can view country validation actions"
ON public.fsu_validation_actions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.fsu_submissions s
    WHERE s.id = fsu_validation_actions.submission_id
      AND public.has_role(auth.uid(), 'country_admin')
      AND s.country_id = public.get_user_country(auth.uid())
  )
);

-- RLS: Global admin can view all actions
CREATE POLICY "Global admins can view all validation actions"
ON public.fsu_validation_actions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'global_admin'));

-- RLS: Country admin can insert actions on country submissions
CREATE POLICY "Country admins can insert validation actions"
ON public.fsu_validation_actions FOR INSERT
TO authenticated
WITH CHECK (
  performed_by = auth.uid()
  AND public.has_role(auth.uid(), 'country_admin')
  AND EXISTS (
    SELECT 1 FROM public.fsu_submissions s
    WHERE s.id = fsu_validation_actions.submission_id
      AND s.country_id = public.get_user_country(auth.uid())
  )
);

-- RLS: Global admin can insert any action
CREATE POLICY "Global admins can insert validation actions"
ON public.fsu_validation_actions FOR INSERT
TO authenticated
WITH CHECK (
  performed_by = auth.uid()
  AND public.has_role(auth.uid(), 'global_admin')
);

-- UPDATE policy on fsu_submissions for country admins
CREATE POLICY "Country admins can update country submissions status"
ON public.fsu_submissions FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'country_admin')
  AND country_id = public.get_user_country(auth.uid())
)
WITH CHECK (
  public.has_role(auth.uid(), 'country_admin')
  AND country_id = public.get_user_country(auth.uid())
);

-- UPDATE policy on fsu_submissions for global admins
CREATE POLICY "Global admins can update all submissions"
ON public.fsu_submissions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'global_admin'))
WITH CHECK (public.has_role(auth.uid(), 'global_admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.fsu_validation_actions;
