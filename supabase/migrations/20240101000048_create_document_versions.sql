-- =====================================================
-- Document Versions Management
-- =====================================================

-- 1. Create document_versions table
CREATE TABLE IF NOT EXISTS public.document_versions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    file_path text NOT NULL,
    file_name text NOT NULL,
    file_size bigint,
    mime_type text,
    changelog text,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_version_number ON public.document_versions(version_number);

-- 3. Enable RLS
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY document_versions_select ON public.document_versions FOR SELECT TO authenticated USING (true);

CREATE POLICY document_versions_insert ON public.document_versions FOR INSERT TO authenticated WITH CHECK (
    has_role(auth.uid(), 'country_admin') OR has_role(auth.uid(), 'super_admin')
);