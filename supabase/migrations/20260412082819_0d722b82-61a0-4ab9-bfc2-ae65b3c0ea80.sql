
CREATE TABLE public.support_ticket_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_ticket_comments ENABLE ROW LEVEL SECURITY;

-- Users can view comments on their own tickets
CREATE POLICY "Users can view comments on own tickets"
ON public.support_ticket_comments FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.support_tickets t
  WHERE t.id = support_ticket_comments.ticket_id AND t.created_by = auth.uid()
));

-- Global admins can view all comments
CREATE POLICY "Global admins can view all comments"
ON public.support_ticket_comments FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role));

-- Users can add comments to own tickets
CREATE POLICY "Users can add comments to own tickets"
ON public.support_ticket_comments FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.support_tickets t
    WHERE t.id = support_ticket_comments.ticket_id AND t.created_by = auth.uid()
  )
);

-- Global admins can add comments to any ticket
CREATE POLICY "Global admins can add comments to any ticket"
ON public.support_ticket_comments FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND has_role(auth.uid(), 'global_admin'::app_role)
);
