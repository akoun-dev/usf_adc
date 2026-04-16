-- =====================================================
-- migration: create documents table and storage bucket
-- =====================================================
-- purpose: store document library with file attachments
-- affected tables: documents, storage.buckets, storage.objects
-- special considerations:
--   - documents are stored in a public storage bucket
--   - is_public flag controls access to document records
-- =====================================================

-- =====================================================
-- 1. create storage bucket for documents
-- =====================================================
-- note: this bucket stores publicly accessible documents
-- files can be downloaded without authentication (for public documents)

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- =====================================================
-- 2. create rls policies for document storage objects
-- =====================================================
-- note: storage rls policies control who can upload and delete document files

-- policy: select - anyone can view document files
-- rationale: documents are served publicly via the storage bucket
create policy "documents_objects_select_public"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'documents');

-- policy: insert - admins can upload document files
-- rationale: only admins should upload documents
create policy "documents_objects_insert_admins"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'documents'
    and (
      public.has_role(auth.uid(), 'global_admin')
      or public.has_role(auth.uid(), 'country_admin')
    )
  );

-- policy: update - admins can update document files
-- rationale: admins may need to replace documents
create policy "documents_objects_update_admins"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'documents'
    and (
      public.has_role(auth.uid(), 'global_admin')
      or public.has_role(auth.uid(), 'country_admin')
    )
  );

-- policy: delete - global admins can delete document files
-- rationale: only global admins should delete documents
create policy "documents_objects_delete_global_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'documents'
    and public.has_role(auth.uid(), 'global_admin')
  );

-- =====================================================
-- 3. create documents table
-- =====================================================
-- note: stores metadata about documents in the library
-- actual files are stored in the 'documents' storage bucket

create table public.documents (
  id uuid not null default gen_random_uuid() primary key,
  -- document title
  title text not null,
  -- document description
  description text,
  -- category for grouping (e.g., 'guides', 'reports', 'templates')
  category text not null default 'general',
  -- original file name from upload
  file_name text not null,
  -- path to the file in storage
  file_path text not null,
  -- file size in bytes
  file_size integer not null default 0,
  -- mime type of the file
  mime_type text not null,
  -- whether this document is visible to non-admin users
  is_public boolean not null default true,
  -- document type (pdf, doc, xls, ppt, video, guide)
  type text,
  -- language code (default: 'fr')
  language text not null default 'fr',
  -- published date (for display and sorting)
  published_date timestamptz,
  -- download url (if different from file_path)
  download_url text,
  -- thumbnail image url
  thumbnail text,
  -- whether this is a featured document (shown prominently)
  featured boolean not null default false,
  -- user who uploaded this document
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 4. enable row level security (rls) on documents
-- =====================================================
-- warning: rls is critical - private documents should not be visible

alter table public.documents enable row level security;

-- =====================================================
-- 5. create indexes for performance
-- =====================================================
-- note: these indexes speed up document library queries

create index idx_documents_category on public.documents(category);
create index idx_documents_is_public on public.documents(is_public);
create index idx_documents_uploaded_by on public.documents(uploaded_by);

-- =====================================================
-- 6. create rls policies for documents
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - all authenticated users can view public documents
-- rationale: the document library is a shared resource
create policy "documents_select_public"
  on public.documents for select
  to authenticated
  using (is_public = true);

-- policy: select - global admins can view all documents
-- rationale: global admins need to see private documents
create policy "documents_select_global_admin"
  on public.documents for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: insert - country admins can upload documents
-- rationale: country admins contribute to the document library
create policy "documents_insert_country_admin"
  on public.documents for insert
  to authenticated
  with check (
    public.has_role(auth.uid(), 'country_admin')
    and uploaded_by = auth.uid()
  );

-- policy: insert - global admins can upload documents
-- rationale: global admins can add any document
create policy "documents_insert_global_admin"
  on public.documents for insert
  to authenticated
  with check (
    public.has_role(auth.uid(), 'global_admin')
  );

-- policy: update - country admins can update documents they uploaded
-- rationale: country admins can manage their own uploads
create policy "documents_update_country_admin_own"
  on public.documents for update
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and uploaded_by = auth.uid()
  )
  with check (
    public.has_role(auth.uid(), 'country_admin')
    and uploaded_by = auth.uid()
  );

-- policy: update - global admins can update any document
-- rationale: global admins have full control over the library
create policy "documents_update_global_admin"
  on public.documents for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - global admins can delete documents
-- rationale: only global admins should delete documents
create policy "documents_delete_global_admin"
  on public.documents for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 7. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_documents_updated_at
  before update on public.documents
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 8. create document_tags table (for many-to-many relationship)
-- =====================================================
-- note: stores tags associated with documents
-- allows for flexible categorization and filtering

create table public.document_tags (
  id uuid not null default gen_random_uuid() primary key,
  document_id uuid not null references public.documents(id) on delete cascade,
  tag text not null,
  unique(document_id, tag)
);

-- =====================================================
-- 9. enable rls on document_tags
-- =====================================================

alter table public.document_tags enable row level security;

-- =====================================================
-- 10. create rls policies for document_tags
-- =====================================================
-- note: access to tags is derived from access to the parent document

-- policy: select - users can view tags of public documents or documents they can access
create policy "document_tags_select_from_documents"
  on public.document_tags for select
  to authenticated
  using (
    exists (
      select 1 from public.documents d
      where d.id = document_tags.document_id
        and (d.is_public = true or public.has_role(auth.uid(), 'global_admin'))
    )
  );

-- policy: insert - admins can insert tags for documents they can modify
create policy "document_tags_insert_admins"
  on public.document_tags for insert
  to authenticated
  with check (
    exists (
      select 1 from public.documents d
      where d.id = document_tags.document_id
        and (
          (d.uploaded_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'global_admin')
        )
    )
  );

-- policy: delete - admins can delete tags from documents they can modify
create policy "document_tags_delete_admins"
  on public.document_tags for delete
  to authenticated
  using (
    exists (
      select 1 from public.documents d
      where d.id = document_tags.document_id
        and (
          (d.uploaded_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'global_admin')
        )
    )
  );
