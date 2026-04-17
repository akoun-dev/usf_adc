-- Create storage bucket for documents
CREATE OR REPLACE FUNCTION public.create_documents_bucket()
RETURNS void AS $$
BEGIN
    -- Check if bucket exists, create if not
    PERFORM 1 FROM storage.buckets WHERE name = 'documents';
    
    IF NOT FOUND THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('documents', 'documents', true);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT public.create_documents_bucket();

-- Set up storage policies for documents bucket
CREATE POLICY "Enable public read access for documents"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'documents');

CREATE POLICY "Enable authenticated upload for documents"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Enable authenticated update for documents"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'documents');

CREATE POLICY "Enable authenticated delete for documents"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'documents');