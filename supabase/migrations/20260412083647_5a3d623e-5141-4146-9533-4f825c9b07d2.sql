
-- Platform settings table (key-value store)
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '""'::jsonb,
  label text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Global admins can manage platform settings"
ON public.platform_settings FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

CREATE POLICY "Country admins can view platform settings"
ON public.platform_settings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'country_admin'::app_role));

CREATE TRIGGER update_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default settings
INSERT INTO public.platform_settings (key, value, label, category) VALUES
  ('site_name', '"USF-ADC"'::jsonb, 'Nom de la plateforme', 'general'),
  ('default_language', '"fr"'::jsonb, 'Langue par défaut', 'general'),
  ('maintenance_mode', 'false'::jsonb, 'Mode maintenance', 'general'),
  ('welcome_message', '"Bienvenue sur la plateforme USF-ADC de suivi des indicateurs de service universel en Afrique."'::jsonb, 'Message d''accueil', 'general'),
  ('fsu_submission_deadline_days', '30'::jsonb, 'Délai de soumission FSU (jours)', 'fsu'),
  ('fsu_auto_reminder', 'true'::jsonb, 'Rappels automatiques FSU', 'fsu'),
  ('fsu_reminder_days_before', '7'::jsonb, 'Jours avant rappel FSU', 'fsu');

-- Submission periods table
CREATE TABLE public.submission_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  reminder_days_before integer NOT NULL DEFAULT 7,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.submission_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Global admins can manage submission periods"
ON public.submission_periods FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

CREATE POLICY "Authenticated users can view active submission periods"
ON public.submission_periods FOR SELECT
TO authenticated
USING (true);

CREATE TRIGGER update_submission_periods_updated_at
BEFORE UPDATE ON public.submission_periods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Allow global admins to manage countries
CREATE POLICY "Global admins can insert countries"
ON public.countries FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

CREATE POLICY "Global admins can update countries"
ON public.countries FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

CREATE POLICY "Global admins can delete countries"
ON public.countries FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role));
