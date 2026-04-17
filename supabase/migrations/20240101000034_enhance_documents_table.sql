-- Enhance documents table with additional fields
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS version text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS metadata jsonb;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);

-- Update RLS policies to include new fields
ALTER POLICY "only_admins_can_insert" ON public.documents 
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

ALTER POLICY "only_admins_can_update" ON public.documents 
USING (public.has_role(auth.uid(), 'super_admin'));

ALTER POLICY "only_admins_can_delete" ON public.documents 
USING (public.has_role(auth.uid(), 'super_admin'));

-- Add comments for documentation
COMMENT ON TABLE public.documents IS 'Table for storing document library files with metadata and access control';
COMMENT ON COLUMN public.documents.uploaded_by IS 'User who uploaded the document';
COMMENT ON COLUMN public.documents.download_count IS 'Number of times the document has been downloaded';
COMMENT ON COLUMN public.documents.version IS 'Document version identifier';
COMMENT ON COLUMN public.documents.status IS 'Document status (active, draft, archived)';
COMMENT ON COLUMN public.documents.metadata IS 'Additional document metadata in JSON format';