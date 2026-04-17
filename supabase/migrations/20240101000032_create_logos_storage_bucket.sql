-- Create storage bucket for logos
CREATE OR REPLACE FUNCTION public.create_logos_bucket()
RETURNS void AS $$
BEGIN
    -- Check if bucket exists, create if not
    PERFORM 1 FROM storage.buckets WHERE name = 'logos';
    
    IF NOT FOUND THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('logos', 'logos', true);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT public.create_logos_bucket();

-- Set up storage policies for logos bucket
CREATE POLICY "Enable public read access for logos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'logos');

CREATE POLICY "Enable authenticated upload for logos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Enable authenticated update for logos"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'logos');

CREATE POLICY "Enable authenticated delete for logos"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'logos');