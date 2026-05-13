-- =====================================================
-- migration: harden rls policies for territorial isolation
-- date: 2026-05-12
-- =====================================================

-- 1. Hardening Projects Table Policies
-- Drop existing insecure policies
DROP POLICY IF EXISTS "projects_insert_admins" ON public.projects;
DROP POLICY IF EXISTS "projects_update_admins" ON public.projects;

-- New Insert Policy: enforce country_id match for country_admin and point_focal
CREATE POLICY "projects_insert_territorial_isolation"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR (
      (public.has_role(auth.uid(), 'country_admin') OR public.has_role(auth.uid(), 'point_focal'))
      AND country_id = public.get_user_country(auth.uid())
    )
  );

-- New Update Policy: enforce country_id match
CREATE POLICY "projects_update_territorial_isolation"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR (
      (public.has_role(auth.uid(), 'country_admin') OR public.has_role(auth.uid(), 'point_focal'))
      AND country_id = public.get_user_country(auth.uid())
    )
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR (
      (public.has_role(auth.uid(), 'country_admin') OR public.has_role(auth.uid(), 'point_focal'))
      AND country_id = public.get_user_country(auth.uid())
    )
  );

-- 2. Hardening CMDT Contributions Table Policies
DROP POLICY IF EXISTS "cmdt_contributions_insert_authenticated" ON public.cmdt_contributions;
DROP POLICY IF EXISTS "cmdt_contributions_update_authenticated" ON public.cmdt_contributions;

CREATE POLICY "cmdt_contributions_insert_territorial_isolation"
  ON public.cmdt_contributions FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR (
      (public.has_role(auth.uid(), 'country_admin') OR public.has_role(auth.uid(), 'point_focal'))
      AND country_id = public.get_user_country(auth.uid())
    )
    OR (
      created_by = auth.uid() 
      AND (country_id IS NULL OR country_id = public.get_user_country(auth.uid()))
    )
  );

CREATE POLICY "cmdt_contributions_update_territorial_isolation"
  ON public.cmdt_contributions FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR (
      (public.has_role(auth.uid(), 'country_admin') OR public.has_role(auth.uid(), 'point_focal'))
      AND country_id = public.get_user_country(auth.uid())
    )
    OR created_by = auth.uid()
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR (
      (public.has_role(auth.uid(), 'country_admin') OR public.has_role(auth.uid(), 'point_focal'))
      AND country_id = public.get_user_country(auth.uid())
    )
  );

-- 3. Hardening Profiles Table: Prevent self-modification of country_id
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_update_own_protected"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND (
      (public.has_role(auth.uid(), 'super_admin'))
      OR (country_id = (SELECT country_id FROM public.profiles WHERE id = auth.uid()))
    )
  );

-- 4. Audit Log for security changes
INSERT INTO public.audit_logs (action, target_table, metadata)
VALUES ('SECURITY_HARDENING', 'multiple', '{"details": "Applied territorial RLS isolation to projects and contributions"}'::jsonb);
