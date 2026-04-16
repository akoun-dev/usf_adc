
-- 1. Fix attachments bucket: remove overly broad SELECT policy
DROP POLICY IF EXISTS "Authenticated users can read own attachments" ON storage.objects;

-- 2. Remove duplicate INSERT policy on attachments
DROP POLICY IF EXISTS "Authenticated users can upload to attachments" ON storage.objects;

-- 3. Add UPDATE policy on documents bucket for admins
CREATE POLICY "Admins can update document files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents'
  AND (
    has_role(auth.uid(), 'global_admin'::app_role)
    OR has_role(auth.uid(), 'country_admin'::app_role)
  )
);

-- 4. Fix forum_topics SELECT policy to respect is_public
DROP POLICY IF EXISTS "Authenticated users can view topics" ON public.forum_topics;

CREATE POLICY "Authenticated users can view topics"
ON public.forum_topics FOR SELECT
TO authenticated
USING (
  is_public = true
  OR created_by = auth.uid()
  OR has_role(auth.uid(), 'global_admin'::app_role)
  OR has_role(auth.uid(), 'country_admin'::app_role)
);

-- 5. Fix user_roles policy: country admins can only manage users WITH a country
DROP POLICY IF EXISTS "Country admins can manage roles in their country" ON public.user_roles;

CREATE POLICY "Country admins can manage roles in their country"
ON public.user_roles FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND get_user_country(user_id) IS NOT NULL
  AND get_user_country(user_id) = get_user_country(auth.uid())
  AND role NOT IN ('global_admin'::app_role, 'country_admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND get_user_country(user_id) IS NOT NULL
  AND get_user_country(user_id) = get_user_country(auth.uid())
  AND role NOT IN ('global_admin'::app_role, 'country_admin'::app_role)
);
