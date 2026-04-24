-- =====================================================
-- 1. create project_status enum
-- =====================================================
-- note: defines the lifecycle states of infrastructure projects

create type public.project_status as enum ('planned', 'in_progress', 'completed', 'suspended');

-- =====================================================
-- 2. create projects table
-- =====================================================
-- note: stores information about infrastructure projects across africa
-- includes location data for map visualization

create table public.projects (
  id uuid not null default gen_random_uuid() primary key,
  -- foreign key to countries - project belongs to a specific country
  country_id uuid not null references public.countries(id),
  -- project title/name
  title text not null,
  -- detailed project description
  description text,
  -- current status of the project
  status public.project_status not null default 'planned',
  -- project budget in local currency
  budget numeric(15,2),
  -- latitude for map display
  latitude double precision,
  -- longitude for map display
  longitude double precision,
  -- region or city where project is located
  region text,
  -- project progress percentage (0-100)
  progress integer check (progress >= 0 and progress <= 100),
  -- number of beneficiaries (people impacted by the project)
  beneficiaries text,
  -- project operator or partner
  operator text,
  -- thematic area (connectivite, education, sante, agriculture, etc.)
  thematic text,
  -- project start date
  start_date timestamptz,
  -- project end date
  end_date timestamptz,
  -- project objectives
  objectives text,
  -- project performance indicators
  indicators text,
  -- user who created this project record
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 8. create project_images table
-- =====================================================

create table public.project_images (
  id uuid not null default gen_random_uuid() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- =====================================================
-- 9. enable rls on project_images
-- =====================================================

alter table public.project_images enable row level security;

-- =====================================================
-- 10. create rls policies for project_images
-- =====================================================

create policy "project_images_select_anon"
  on public.project_images for select
  to anon, authenticated
  using (true);

create policy "project_images_insert_admins"
  on public.project_images for insert
  to authenticated
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_images.project_id
        and (
          (public.has_role(auth.uid(), 'country_admin') and p.country_id = public.get_user_country(auth.uid()))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

create policy "project_images_delete_admins"
  on public.project_images for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_images.project_id
        and (
          (public.has_role(auth.uid(), 'country_admin') and p.country_id = public.get_user_country(auth.uid()))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- =====================================================
-- 11. enable rls on projects
-- =====================================================

alter table public.projects enable row level security;

-- =====================================================
-- 9. create rls policies for projects
-- =====================================================

-- policy: select - anyone can view projects (public read)
create policy "projects_select_public"
  on public.projects for select
  to anon
  using (true);

-- policy: select - any authenticated user can view projects
create policy "projects_select_authenticated"
  on public.projects for select
  to authenticated
  using (true);

-- policy: insert - country admins and super admins can insert projects
create policy "projects_insert_admins"
  on public.projects for insert
  to authenticated
  with check (
    public.has_role(auth.uid(), 'country_admin')
    or public.has_role(auth.uid(), 'super_admin')
  );

-- policy: update - country admins and super admins can update projects
create policy "projects_update_admins"
  on public.projects for update
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    or public.has_role(auth.uid(), 'super_admin')
  );

-- policy: delete - only super admins can delete projects
create policy "projects_delete_super_admin"
  on public.projects for delete
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));


create table public.project_actors (
  id uuid not null default gen_random_uuid() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  type text not null check (type in ('carrier', 'partner', 'beneficiary', 'stakeholder')),
  role text,
  organization text,
  contact text,
  created_at timestamptz not null default now()
);

-- =====================================================
-- 9. enable rls on project_actors
-- =====================================================

alter table public.project_actors enable row level security;

-- =====================================================
-- 10. create rls policies for project_actors
-- =====================================================
-- note: access to actors is derived from access to the parent project

-- policy: select - users can view actors of projects they can access
create policy "project_actors_select_anon"
  on public.project_actors for select
  to anon, authenticated
  using (true);

-- policy: insert - admins can insert actors for projects they can modify
create policy "project_actors_insert_admins"
  on public.project_actors for insert
  to authenticated
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_actors.project_id
        and (
          (public.has_role(auth.uid(), 'country_admin') and p.country_id = public.get_user_country(auth.uid()))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- policy: delete - admins can delete actors from projects they can modify
create policy "project_actors_delete_admins"
  on public.project_actors for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_actors.project_id
        and (
          (public.has_role(auth.uid(), 'country_admin') and p.country_id = public.get_user_country(auth.uid()))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- =====================================================
-- 11. create project_documents table (for documents associated with projects)
-- =====================================================
-- note: stores documents associated with projects

create table public.project_documents (
  id uuid not null default gen_random_uuid() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  file_name text not null,
  mime_type text not null,
  file_size bigint not null,
  file_url text not null,
  document_type text check (document_type in ('contract', 'report', 'budget', 'technical', 'other')),
  created_at timestamptz not null default now()
);

-- =====================================================
-- 12. enable rls on project_documents
-- =====================================================

alter table public.project_documents enable row level security;

-- =====================================================
-- 13. create rls policies for project_documents
-- =====================================================
-- note: access to documents is derived from access to the parent project

-- policy: select - users can view documents of projects they can access
create policy "project_documents_select_anon"
  on public.project_documents for select
  to anon, authenticated
  using (true);

-- policy: insert - admins can upload documents to projects they can modify
create policy "project_documents_insert_admins"
  on public.project_documents for insert
  to authenticated
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and (
          (public.has_role(auth.uid(), 'country_admin') and p.country_id = public.get_user_country(auth.uid()))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- policy: delete - admins can delete documents from projects they can modify
create policy "project_documents_delete_admins"
  on public.project_documents for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and (
          (public.has_role(auth.uid(), 'country_admin') and p.country_id = public.get_user_country(auth.uid()))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- =====================================================
-- 14. create project_tags table (for tagging projects)
-- =====================================================

create table public.project_tags (
  id uuid not null default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

-- =====================================================
-- 15. create project_project_tags junction table
-- =====================================================

create table public.project_project_tags (
  project_id uuid not null references public.projects(id) on delete cascade,
  tag_id uuid not null references public.project_tags(id) on delete cascade,
  primary key (project_id, tag_id)
);

-- =====================================================
-- 16. enable rls on project tags
-- =====================================================

alter table public.project_tags enable row level security;
alter table public.project_project_tags enable row level security;

-- =====================================================
-- 17. create rls policies for project tags
-- =====================================================

create policy "project_tags_select_anon"
  on public.project_tags for select
  to anon, authenticated
  using (true);

create policy "project_project_tags_select_anon"
  on public.project_project_tags for select
  to anon, authenticated
  using (true);

