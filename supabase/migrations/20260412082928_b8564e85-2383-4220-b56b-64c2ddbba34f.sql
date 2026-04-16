
-- Country admins can view tickets from users in their country
CREATE POLICY "Country admins can view country tickets"
ON public.support_tickets FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND get_user_country(created_by) = get_user_country(auth.uid())
);

-- Country admins can update tickets from their country
CREATE POLICY "Country admins can update country tickets"
ON public.support_tickets FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND get_user_country(created_by) = get_user_country(auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND get_user_country(created_by) = get_user_country(auth.uid())
);

-- Country admins can view comments on country tickets
CREATE POLICY "Country admins can view country ticket comments"
ON public.support_ticket_comments FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'country_admin'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.support_tickets t
    WHERE t.id = support_ticket_comments.ticket_id
    AND get_user_country(t.created_by) = get_user_country(auth.uid())
  )
);

-- Country admins can add comments on country tickets
CREATE POLICY "Country admins can add comments to country tickets"
ON public.support_ticket_comments FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND has_role(auth.uid(), 'country_admin'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.support_tickets t
    WHERE t.id = support_ticket_comments.ticket_id
    AND get_user_country(t.created_by) = get_user_country(auth.uid())
  )
);
