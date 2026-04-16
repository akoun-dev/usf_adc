
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'medium',
  created_by uuid NOT NULL,
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Users can view own tickets
CREATE POLICY "Users can view own tickets"
ON public.support_tickets FOR SELECT
TO authenticated
USING (created_by = auth.uid());

-- Global admins can view all tickets
CREATE POLICY "Global admins can view all tickets"
ON public.support_tickets FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role));

-- Users can create own tickets
CREATE POLICY "Users can create own tickets"
ON public.support_tickets FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Global admins can update all tickets
CREATE POLICY "Global admins can update all tickets"
ON public.support_tickets FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

-- Global admins can delete tickets
CREATE POLICY "Global admins can delete tickets"
ON public.support_tickets FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
