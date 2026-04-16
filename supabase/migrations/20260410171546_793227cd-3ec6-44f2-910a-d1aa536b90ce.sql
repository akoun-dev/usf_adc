
-- Forum categories
CREATE TABLE public.forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view categories"
ON public.forum_categories FOR SELECT TO authenticated
USING (true);

-- Forum topics
CREATE TABLE public.forum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category_id uuid REFERENCES public.forum_categories(id),
  created_by uuid NOT NULL,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view topics"
ON public.forum_topics FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authorized users can create topics"
ON public.forum_topics FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid() AND (
    has_role(auth.uid(), 'point_focal') OR
    has_role(auth.uid(), 'country_admin') OR
    has_role(auth.uid(), 'global_admin')
  )
);

CREATE POLICY "Authors can update own topics"
ON public.forum_topics FOR UPDATE TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Global admins can update any topic"
ON public.forum_topics FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'global_admin'))
WITH CHECK (has_role(auth.uid(), 'global_admin'));

CREATE POLICY "Authors can delete own topics"
ON public.forum_topics FOR DELETE TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "Global admins can delete any topic"
ON public.forum_topics FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'global_admin'));

-- Forum posts (replies)
CREATE TABLE public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  author_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view posts"
ON public.forum_posts FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create posts"
ON public.forum_posts FOR INSERT TO authenticated
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own posts"
ON public.forum_posts FOR UPDATE TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Global admins can update any post"
ON public.forum_posts FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'global_admin'))
WITH CHECK (has_role(auth.uid(), 'global_admin'));

CREATE POLICY "Authors can delete own posts"
ON public.forum_posts FOR DELETE TO authenticated
USING (author_id = auth.uid());

CREATE POLICY "Global admins can delete any post"
ON public.forum_posts FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'global_admin'));

-- Triggers for updated_at
CREATE TRIGGER update_forum_topics_updated_at
BEFORE UPDATE ON public.forum_topics
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
BEFORE UPDATE ON public.forum_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_topics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;

-- Demo categories
INSERT INTO public.forum_categories (name, description, slug, sort_order) VALUES
  ('Connectivité', 'Discussions sur les infrastructures de connectivité et accès Internet', 'connectivite', 1),
  ('Financement', 'Échanges sur les mécanismes de financement et budgets', 'financement', 2),
  ('Réglementation', 'Cadre réglementaire et politiques numériques', 'reglementation', 3),
  ('Général', 'Discussions générales et sujets divers', 'general', 4);
