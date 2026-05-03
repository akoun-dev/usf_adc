-- 1. Clean up countries table (remove previously added DG fields if they exist)
ALTER TABLE public.countries DROP COLUMN IF EXISTS dg_name;
ALTER TABLE public.countries DROP COLUMN IF EXISTS dg_message;
ALTER TABLE public.countries DROP COLUMN IF EXISTS dg_photo_url;
ALTER TABLE public.countries DROP COLUMN IF EXISTS fsu_name;

-- 2. Create fsu_agencies table
CREATE TABLE IF NOT EXISTS public.fsu_agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
    dg_name TEXT,
    dg_message JSONB,
    dg_photo_url TEXT,
    fsu_name TEXT,
    agency_type TEXT DEFAULT 'agency', -- agency, regulator, ministry, institution, etc.
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(country_id) -- One main agency per country for this specific feature
);

-- Enable RLS
ALTER TABLE public.fsu_agencies ENABLE ROW LEVEL SECURITY;

-- Policies for fsu_agencies
DROP POLICY IF EXISTS "Public agencies are viewable by everyone" ON public.fsu_agencies;
CREATE POLICY "Public agencies are viewable by everyone" 
ON public.fsu_agencies FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admins can manage their country agency" ON public.fsu_agencies;
CREATE POLICY "Admins can manage their country agency" 
ON public.fsu_agencies FOR ALL 
USING (
    -- Case 1: Super Admin
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'super_admin'
    )
    OR
    -- Case 2: Country Admin for their own country
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.country_id = fsu_agencies.country_id
    )
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_fsu_agencies_updated_at ON public.fsu_agencies;
CREATE TRIGGER update_fsu_agencies_updated_at
    BEFORE UPDATE ON public.fsu_agencies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Create dg-photos storage bucket (from previous migration)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dg-photos',
  'dg-photos',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp'];

-- RLS policies for dg-photos bucket
DROP POLICY IF EXISTS "dg_photos_select_public" ON storage.objects;
CREATE POLICY "dg_photos_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'dg-photos');

DROP POLICY IF EXISTS "dg_photos_insert_authenticated" ON storage.objects;
CREATE POLICY "dg_photos_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'dg-photos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('country_admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "dg_photos_update_authenticated" ON storage.objects;
CREATE POLICY "dg_photos_update_authenticated"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'dg-photos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('country_admin', 'super_admin')
    )
  )
  WITH CHECK (
    bucket_id = 'dg-photos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('country_admin', 'super_admin')
    )
  );
