-- Allow country admins to update profiles in their country
CREATE POLICY "Country admins can update profiles in their country"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND country_id = get_user_country(auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND country_id = get_user_country(auth.uid())
);

-- Allow global admins to update any profile
CREATE POLICY "Global admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));