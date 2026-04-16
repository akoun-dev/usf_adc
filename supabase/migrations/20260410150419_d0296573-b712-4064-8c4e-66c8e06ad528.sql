
-- ============================================================
-- FSU SUBMISSIONS
-- ============================================================
CREATE TABLE public.fsu_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL REFERENCES public.countries(id),
  submitted_by UUID NOT NULL REFERENCES auth.users(id),
  status public.submission_status NOT NULL DEFAULT 'draft',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.fsu_submissions ENABLE ROW LEVEL SECURITY;

-- Point Focal: own submissions
CREATE POLICY "Users can view own submissions"
  ON public.fsu_submissions FOR SELECT TO authenticated
  USING (submitted_by = auth.uid());

CREATE POLICY "Users can create own submissions"
  ON public.fsu_submissions FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Users can update own draft submissions"
  ON public.fsu_submissions FOR UPDATE TO authenticated
  USING (submitted_by = auth.uid() AND status = 'draft')
  WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Users can delete own draft submissions"
  ON public.fsu_submissions FOR DELETE TO authenticated
  USING (submitted_by = auth.uid() AND status = 'draft');

-- Country Admin: view country submissions
CREATE POLICY "Country admins can view country submissions"
  ON public.fsu_submissions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'country_admin') AND country_id = get_user_country(auth.uid()));

-- Global Admin: view all
CREATE POLICY "Global admins can view all submissions"
  ON public.fsu_submissions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'global_admin'));

-- Trigger updated_at
CREATE TRIGGER update_fsu_submissions_updated_at
  BEFORE UPDATE ON public.fsu_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.fsu_submissions;

-- ============================================================
-- FSU SUBMISSION ATTACHMENTS
-- ============================================================
CREATE TABLE public.fsu_submission_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.fsu_submissions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.fsu_submission_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments of own submissions"
  ON public.fsu_submission_attachments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.fsu_submissions s WHERE s.id = submission_id AND s.submitted_by = auth.uid()));

CREATE POLICY "Users can insert attachments to own draft submissions"
  ON public.fsu_submission_attachments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.fsu_submissions s WHERE s.id = submission_id AND s.submitted_by = auth.uid() AND s.status = 'draft'));

CREATE POLICY "Users can delete attachments of own draft submissions"
  ON public.fsu_submission_attachments FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.fsu_submissions s WHERE s.id = submission_id AND s.submitted_by = auth.uid() AND s.status = 'draft'));

CREATE POLICY "Country admins can view country submission attachments"
  ON public.fsu_submission_attachments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.fsu_submissions s WHERE s.id = submission_id AND has_role(auth.uid(), 'country_admin') AND s.country_id = get_user_country(auth.uid())));

CREATE POLICY "Global admins can view all attachments"
  ON public.fsu_submission_attachments FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'global_admin'));

-- ============================================================
-- FSU SUBMISSION VERSIONS
-- ============================================================
CREATE TABLE public.fsu_submission_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.fsu_submissions(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(submission_id, version_number)
);

ALTER TABLE public.fsu_submission_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of own submissions"
  ON public.fsu_submission_versions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.fsu_submissions s WHERE s.id = submission_id AND s.submitted_by = auth.uid()));

CREATE POLICY "Users can insert versions of own submissions"
  ON public.fsu_submission_versions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.fsu_submissions s WHERE s.id = submission_id AND s.submitted_by = auth.uid()));

CREATE POLICY "Country admins can view country submission versions"
  ON public.fsu_submission_versions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.fsu_submissions s WHERE s.id = submission_id AND has_role(auth.uid(), 'country_admin') AND s.country_id = get_user_country(auth.uid())));

CREATE POLICY "Global admins can view all versions"
  ON public.fsu_submission_versions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'global_admin'));

-- ============================================================
-- STORAGE POLICIES for attachments bucket
-- ============================================================
CREATE POLICY "Authenticated users can upload to attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Authenticated users can read own attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'attachments');

CREATE POLICY "Authenticated users can delete own attachments"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[2]);
