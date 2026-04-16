
CREATE TABLE public.faq_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.faq_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published articles"
ON public.faq_articles FOR SELECT TO authenticated
USING (is_published = true);

CREATE POLICY "Global admins can manage all articles"
ON public.faq_articles FOR ALL TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'global_admin'::app_role));

CREATE TRIGGER update_faq_articles_updated_at
BEFORE UPDATE ON public.faq_articles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
