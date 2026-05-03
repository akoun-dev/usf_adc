-- Create fsu_agencies table
CREATE TABLE IF NOT EXISTS public.fsu_agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
    dg_name TEXT,
    dg_message TEXT,
    dg_photo_url TEXT,
    fsu_name TEXT,
    agency_type TEXT DEFAULT 'agency', -- agency, regulator, ministry, institution, etc.
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(country_id) -- One main agency per country for this specific feature
);

-- Enable RLS
ALTER TABLE public.fsu_agencies ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public fsu_agencies are viewable by everyone" 
ON public.fsu_agencies FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage their country agency" 
ON public.fsu_agencies FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role = 'super_admin' OR profiles.country_id = fsu_agencies.country_id)
    )
);

-- Trigger for updated_at
CREATE TRIGGER update_fsu_agencies_updated_at
    BEFORE UPDATE ON public.fsu_agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Remove columns from countries if they were added (assuming they might exist)
-- ALTER TABLE public.countries DROP COLUMN IF EXISTS dg_name;
-- ALTER TABLE public.countries DROP COLUMN IF EXISTS dg_message;
-- ALTER TABLE public.countries DROP COLUMN IF EXISTS dg_photo_url;
-- ALTER TABLE public.countries DROP COLUMN IF EXISTS fsu_name;
