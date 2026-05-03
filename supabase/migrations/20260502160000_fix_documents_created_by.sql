-- Add created_by to documents table to match co-redaction service expectations
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS created_by UUID NULL;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'documents_created_by_fkey'
  ) THEN
    ALTER TABLE public.documents
      ADD CONSTRAINT documents_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add index
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON public.documents(created_by);

-- Update existing rows: set created_by to uploaded_by if available
UPDATE public.documents SET created_by = uploaded_by WHERE created_by IS NULL AND uploaded_by IS NOT NULL;
