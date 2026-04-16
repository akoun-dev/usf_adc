
-- Documents library table (US-072)
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public documents"
  ON public.documents FOR SELECT TO authenticated
  USING (is_public = true);

CREATE POLICY "Global admins can manage all documents"
  ON public.documents FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'global_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

CREATE POLICY "Country admins can insert documents"
  ON public.documents FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'country_admin'::app_role) AND uploaded_by = auth.uid());

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view document files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Admins can upload document files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND (
    (SELECT has_role(auth.uid(), 'global_admin'::app_role)) OR
    (SELECT has_role(auth.uid(), 'country_admin'::app_role))
  ));

CREATE POLICY "Global admins can delete document files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND (SELECT has_role(auth.uid(), 'global_admin'::app_role)));
