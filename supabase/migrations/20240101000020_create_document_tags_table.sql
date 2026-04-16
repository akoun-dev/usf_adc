-- Create document_tags table for tagging documents
create table if not exists public.document_tags (
  document_id uuid not null references public.documents(id) on delete cascade,
  tag text not null,
  created_at timestamp with time zone default now(),
  primary key (document_id, tag)
);

-- Create index for faster tag queries
create index idx_document_tags_tag on public.document_tags(tag);

-- Enable RLS
alter table public.document_tags enable row level security;

-- RLS policies
create policy "public_document_tags_are_readable" on public.document_tags
  for select using (
    exists (
      select 1 from public.documents
      where documents.id = document_tags.document_id
      and documents.is_public = true
    )
  );

create policy "authenticated_can_view_all_tags" on public.document_tags
  for select to authenticated using (true);

create policy "only_admins_can_insert" on public.document_tags
  for insert to authenticated with check (public.has_role(auth.uid(), 'global_admin'));

create policy "only_admins_can_delete" on public.document_tags
  for delete to authenticated using (public.has_role(auth.uid(), 'global_admin'));
