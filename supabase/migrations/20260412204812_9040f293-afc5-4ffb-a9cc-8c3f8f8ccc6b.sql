
-- Forum moderation: reports table
CREATE TABLE public.forum_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('post', 'topic')),
  target_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_reports ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can create a report
CREATE POLICY "Users can report content"
ON public.forum_reports FOR INSERT TO authenticated
WITH CHECK (reporter_id = auth.uid());

-- Users can view own reports
CREATE POLICY "Users can view own reports"
ON public.forum_reports FOR SELECT TO authenticated
USING (reporter_id = auth.uid());

-- Global admins can manage all reports
CREATE POLICY "Global admins can manage reports"
ON public.forum_reports FOR ALL TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

-- Country admins can view reports from their country users
CREATE POLICY "Country admins can view country reports"
ON public.forum_reports FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND get_user_country(reporter_id) = get_user_country(auth.uid())
);

-- Validation workflow settings per country
CREATE TABLE public.validation_workflow_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid NOT NULL UNIQUE REFERENCES public.countries(id) ON DELETE CASCADE,
  approval_levels integer NOT NULL DEFAULT 1 CHECK (approval_levels IN (1, 2)),
  default_deadline_days integer NOT NULL DEFAULT 14,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.validation_workflow_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Global admins can manage workflow settings"
ON public.validation_workflow_settings FOR ALL TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

CREATE POLICY "Country admins can view own workflow settings"
ON public.validation_workflow_settings FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND country_id = get_user_country(auth.uid())
);

CREATE POLICY "Country admins can update own workflow settings"
ON public.validation_workflow_settings FOR UPDATE TO authenticated
USING (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND country_id = get_user_country(auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND country_id = get_user_country(auth.uid())
);

-- Trigger for updated_at
CREATE TRIGGER update_validation_workflow_settings_updated_at
BEFORE UPDATE ON public.validation_workflow_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
