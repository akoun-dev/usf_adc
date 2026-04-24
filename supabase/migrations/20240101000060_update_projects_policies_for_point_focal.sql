-- =====================================================
-- migration: update projects policies for point_focal role
-- =====================================================
-- purpose: allow point_focal role to create and update projects
-- affected objects: public.projects RLS policies
-- =====================================================

-- =====================================================
-- 1. Drop existing insert policy and recreate with point_focal
-- =====================================================
DROP POLICY IF EXISTS "projects_insert_admins" ON public.projects;

CREATE POLICY "projects_insert_admins"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'point_focal')
    OR public.has_role(auth.uid(), 'country_admin')
    OR public.has_role(auth.uid(), 'super_admin')
  );

-- =====================================================
-- 2. Drop existing update policy and recreate with point_focal
-- =====================================================
DROP POLICY IF EXISTS "projects_update_admins" ON public.projects;

CREATE POLICY "projects_update_admins"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'point_focal')
    OR public.has_role(auth.uid(), 'country_admin')
    OR public.has_role(auth.uid(), 'super_admin')
  );

-- =====================================================
-- 3. Also allow point_focal to delete their own drafts
-- =====================================================
DROP POLICY IF EXISTS "projects_delete_point_focal" ON public.projects;

CREATE POLICY "projects_delete_point_focal"
  ON public.projects FOR DELETE
  TO authenticated
  USING (
    -- point_focal can only delete their own projects with draft status
    (
      public.has_role(auth.uid(), 'point_focal')
      AND created_by = auth.uid()
      AND status = 'draft'
    )
    OR public.has_role(auth.uid(), 'super_admin')
  );

-- =====================================================
-- 4. Update project_actors policies for point_focal
-- =====================================================
DROP POLICY IF EXISTS "project_actors_insert_admins" ON public.project_actors;

CREATE POLICY "project_actors_insert_admins"
  ON public.project_actors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
      AND (
        public.has_role(auth.uid(), 'point_focal')
        OR public.has_role(auth.uid(), 'country_admin')
        OR public.has_role(auth.uid(), 'super_admin')
      )
    )
  );

-- =====================================================
-- 5. Update project_documents policies for point_focal
-- =====================================================
DROP POLICY IF EXISTS "project_documents_insert_admins" ON public.project_documents;

CREATE POLICY "project_documents_insert_admins"
  ON public.project_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
      AND (
        public.has_role(auth.uid(), 'point_focal')
        OR public.has_role(auth.uid(), 'country_admin')
        OR public.has_role(auth.uid(), 'super_admin')
      )
    )
  );

-- =====================================================
-- 6. Update project_tags policies for point_focal
-- =====================================================
DROP POLICY IF EXISTS "project_tags_insert_admins" ON public.project_tags;

CREATE POLICY "project_tags_insert_admins"
  ON public.project_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
      AND (
        public.has_role(auth.uid(), 'point_focal')
        OR public.has_role(auth.uid(), 'country_admin')
        OR public.has_role(auth.uid(), 'super_admin')
      )
    )
  );