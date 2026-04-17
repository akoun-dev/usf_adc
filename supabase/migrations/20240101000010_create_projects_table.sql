-- =====================================================
-- migration: create projects table
-- =====================================================
-- purpose: store infrastructure project information and locations
-- affected tables: projects
-- special considerations:
--   - stores geographical coordinates for map display
--   - budget information for financial tracking
-- =====================================================

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
  -- user who created this project record
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 3. enable row level security (rls)
-- =====================================================
-- warning: rls is required - project data may be sensitive
-- without proper rls, users could access project data from other countries

alter table public.projects enable row level security;

-- =====================================================
-- 4. create indexes for performance
-- =====================================================
-- note: these indexes speed up map and dashboard queries

create index idx_projects_country_id on public.projects(country_id);
create index idx_projects_status on public.projects(status);
create index idx_projects_location on public.projects(latitude, longitude);

-- =====================================================
-- 5. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - all users can view projects
-- rationale: project information is meant to be publicly accessible
create policy "projects_select_anon"
  on public.projects for select
  to anon, authenticated
  using (true);

-- policy: insert - country admins can create projects for their country
-- rationale: country admins manage project data for their country
create policy "projects_insert_country_admin"
  on public.projects for insert
  to authenticated
  with check (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: insert - global admins can create projects for any country
-- rationale: global admins may need to create projects anywhere
create policy "projects_insert_super_admin"
  on public.projects for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'super_admin'));

-- policy: update - country admins can update projects in their country
-- rationale: country admins manage project data for their country
create policy "projects_update_country_admin"
  on public.projects for update
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  )
  with check (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: update - global admins can update any project
-- rationale: global admins have full control over all projects
create policy "projects_update_super_admin"
  on public.projects for update
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- policy: delete - global admins can delete projects
-- rationale: only global admins should delete projects (others should mark as suspended)
create policy "projects_delete_super_admin"
  on public.projects for delete
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- =====================================================
-- 6. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 7. insert demo project data
-- =====================================================
-- note: these demo projects are used for development and testing
-- they showcase various project types across different african regions

insert into public.projects (country_id, title, description, status, budget, latitude, longitude, region)
select
  (select id from public.countries where code_iso = 'ng'),
  'Réseau fibre optique Lagos-Abuja',
  'Déploiement de 900 km de fibre optique reliant Lagos à Abuja',
  'in_progress',
  45000000.00,
  7.4951,
  3.3947,
  'CEDEAO'
where exists (select 1 from public.countries where code_iso = 'ng');

insert into public.projects (country_id, title, description, status, budget, latitude, longitude, region)
select
  (select id from public.countries where code_iso = 'sn'),
  'Hub numérique de Dakar',
  'Centre de données et incubateur technologique',
  'planned',
  12000000.00,
  14.7167,
  -17.4677,
  'CEDEAO'
where exists (select 1 from public.countries where code_iso = 'sn');

insert into public.projects (country_id, title, description, status, budget, latitude, longitude, region)
select
  (select id from public.countries where code_iso = 'ke'),
  'Connectivité rurale Rift Valley',
  'Extension du réseau mobile 4G dans la vallée du Rift',
  'in_progress',
  8500000.00,
  -0.0236,
  37.9062,
  'EAC'
where exists (select 1 from public.countries where code_iso = 'ke');

insert into public.projects (country_id, title, description, status, budget, latitude, longitude, region)
select
  (select id from public.countries where code_iso = 'za'),
  'Smart Grid Cape Town',
  'Réseau électrique intelligent pour la région du Cap',
  'completed',
  32000000.00,
  -33.9249,
  18.4241,
  'SADC'
where exists (select 1 from public.countries where code_iso = 'za');

insert into public.projects (country_id, title, description, status, budget, latitude, longitude, region)
select
  (select id from public.countries where code_iso = 'ma'),
  'Plateforme e-gouvernement Rabat',
  'Digitalisation des services administratifs',
  'in_progress',
  15000000.00,
  34.0209,
  -6.8416,
  'UMA'
where exists (select 1 from public.countries where code_iso = 'ma');

-- =====================================================
-- 8. create project_images table (for multiple images per project)
-- =====================================================
-- note: projects can have multiple images
-- this table stores the image urls for each project

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
-- note: access to images is derived from access to the parent project

-- policy: select - users can view images of projects they can access
create policy "project_images_select_anon"
  on public.project_images for select
  to anon, authenticated
  using (true);

-- policy: insert - admins can insert images for projects they can modify
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

-- policy: delete - admins can delete images from projects they can modify
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
-- 11. create project_tags table (for many-to-many relationship)
-- =====================================================
-- note: stores tags associated with projects
-- allows for flexible categorization and filtering

create table public.project_tags (
  id uuid not null default gen_random_uuid() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  tag text not null,
  unique(project_id, tag)
);

-- =====================================================
-- 12. enable rls on project_tags
-- =====================================================

alter table public.project_tags enable row level security;

-- =====================================================
-- 13. create rls policies for project_tags
-- =====================================================
-- note: access to tags is derived from access to the parent project

-- policy: select - users can view tags of projects they can access
create policy "project_tags_select_anon"
  on public.project_tags for select
  to anon, authenticated
  using (true);

-- policy: insert - admins can insert tags for projects they can modify
create policy "project_tags_insert_admins"
  on public.project_tags for insert
  to authenticated
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_tags.project_id
        and (
          (public.has_role(auth.uid(), 'country_admin') and p.country_id = public.get_user_country(auth.uid()))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- policy: delete - admins can delete tags from projects they can modify
create policy "project_tags_delete_admins"
  on public.project_tags for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_tags.project_id
        and (
          (public.has_role(auth.uid(), 'country_admin') and p.country_id = public.get_user_country(auth.uid()))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );
