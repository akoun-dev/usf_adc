-- =====================================================
-- migration: enhance news system for admin management
-- =====================================================
-- purpose: add comprehensive news management features
-- affected tables: news, news_categories, news_gallery_images, article_translations
-- special considerations:
--   - adds status workflow (draft, in_review, published, archived)
--   - supports featured images and gallery
--   - adds multilingual content support
--   - adds SEO metadata
--   - establishes proper category relationship
-- =====================================================

-- =====================================================
-- 1. create news_status enum
-- =====================================================
-- note: defines the publication workflow states

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'news_status') THEN
        CREATE TYPE news_status AS ENUM (
            'draft',
            'in_review',
            'published',
            'archived'
        );
    END IF;
END$$;

-- =====================================================
-- 2. create news_categories table
-- =====================================================
-- note: stores categories for news articles

CREATE TABLE IF NOT EXISTS public.news_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_fr text NOT NULL,
  name_en text NOT NULL,
  name_pt text NOT NULL,
  slug text NOT NULL UNIQUE,
  color text,
  icon text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================
-- 3. alter news table to add new columns
-- =====================================================
-- note: enhances existing news table with admin features

ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS status news_status NOT NULL DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS featured_image text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS meta_keywords text,
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS allow_comments boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.news_categories(id) ON DELETE SET NULL;

-- =====================================================
-- 4. create migration function for existing data
-- =====================================================
-- note: maps existing category names to proper relationships

CREATE OR REPLACE FUNCTION migrate_existing_news_categories()
RETURNS void AS $$
DECLARE
    news_record RECORD;
    category_record RECORD;
BEGIN
    -- For each news item that has a category name but no category_id
    FOR news_record IN
        SELECT id, category FROM public.news WHERE category IS NOT NULL AND category_id IS NULL
    LOOP
        -- Find the matching category by name (trying French name first)
        SELECT id INTO category_record FROM public.news_categories 
        WHERE name_fr = news_record.category LIMIT 1;
        
        -- If not found by French name, try English name
        IF NOT FOUND THEN
            SELECT id INTO category_record FROM public.news_categories 
            WHERE name_en = news_record.category LIMIT 1;
        END IF;
        
        -- If still not found by English name, try Portuguese name
        IF NOT FOUND THEN
            SELECT id INTO category_record FROM public.news_categories 
            WHERE name_pt = news_record.category LIMIT 1;
        END IF;
        
        -- If category found, update the news item
        IF FOUND THEN
            UPDATE public.news 
            SET category_id = category_record.id
            WHERE id = news_record.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_existing_news_categories();

-- =====================================================
-- 5. enable row level security on news_categories
-- =====================================================

ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. create rls policies for news_categories
-- =====================================================

-- policy: select - all authenticated users can view categories
CREATE POLICY "news_categories_select_all"
  ON public.news_categories FOR SELECT
  TO authenticated
  USING (true);

-- policy: select - anonymous users can view active categories
CREATE POLICY "news_categories_select_anon"
  ON public.news_categories FOR SELECT
  TO anon
  USING (is_active = true);

-- policy: insert - admins can create categories
CREATE POLICY "news_categories_insert_admins"
  ON public.news_categories FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));

-- policy: update - admins can update categories
CREATE POLICY "news_categories_update_admins"
  ON public.news_categories FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));

-- policy: delete - admins can delete categories
CREATE POLICY "news_categories_delete_admins"
  ON public.news_categories FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));

-- =====================================================
-- 7. create trigger for news_categories updated_at
-- =====================================================

CREATE TRIGGER update_news_categories_updated_at
  BEFORE UPDATE ON public.news_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 8. create news_gallery_images table
-- =====================================================
-- note: stores gallery images for news articles

CREATE TABLE IF NOT EXISTS public.news_gallery_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id uuid NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  alt_text text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================
-- 9. enable row level security on news_gallery_images
-- =====================================================

ALTER TABLE public.news_gallery_images ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. create rls policies for news_gallery_images
-- =====================================================

-- policy: select - users can view gallery images of news they can view
CREATE POLICY "news_gallery_images_select_users"
  ON public.news_gallery_images FOR SELECT
  TO authenticated
  USING (true);

-- policy: select - anonymous users can view gallery images of public news
CREATE POLICY "news_gallery_images_select_anon"
  ON public.news_gallery_images FOR SELECT
  TO anon
  USING (exists (
    select 1 from public.news n where n.id = news_gallery_images.news_id and n.is_public = true
  ));

-- policy: insert - admins can add gallery images to news they can modify
CREATE POLICY "news_gallery_images_insert_admins"
  ON public.news_gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (
    exists (
      select 1 from public.news n
      where n.id = news_gallery_images.news_id
        and (
          (n.created_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- policy: update - admins can update gallery images they can modify
CREATE POLICY "news_gallery_images_update_admins"
  ON public.news_gallery_images FOR UPDATE
  TO authenticated
  USING (
    exists (
      select 1 from public.news n
      where n.id = news_gallery_images.news_id
        and (
          (n.created_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  )
  WITH CHECK (
    exists (
      select 1 from public.news n
      where n.id = news_gallery_images.news_id
        and (
          (n.created_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- policy: delete - admins can delete gallery images they can modify
CREATE POLICY "news_gallery_images_delete_admins"
  ON public.news_gallery_images FOR DELETE
  TO authenticated
  USING (
    exists (
      select 1 from public.news n
      where n.id = news_gallery_images.news_id
        and (
          (n.created_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- =====================================================
-- 11. create trigger for news_gallery_images updated_at
-- =====================================================

CREATE TRIGGER update_news_gallery_images_updated_at
  BEFORE UPDATE ON public.news_gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 12. create article_translations table
-- =====================================================
-- note: stores multilingual content for news articles

CREATE TABLE IF NOT EXISTS public.article_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id uuid NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  language text NOT NULL,
  title text NOT NULL,
  content text,
  excerpt text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(news_id, language)
);

-- =====================================================
-- 13. enable row level security on article_translations
-- =====================================================

ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 14. create rls policies for article_translations
-- =====================================================

-- policy: select - users can view translations of news they can view
CREATE POLICY "article_translations_select_users"
  ON public.article_translations FOR SELECT
  TO authenticated
  USING (true);

-- policy: select - anonymous users can view translations of public news
CREATE POLICY "article_translations_select_anon"
  ON public.article_translations FOR SELECT
  TO anon
  USING (exists (
    select 1 from public.news n where n.id = article_translations.news_id and n.is_public = true
  ));

-- policy: insert - admins can add translations to news they can modify
CREATE POLICY "article_translations_insert_admins"
  ON public.article_translations FOR INSERT
  TO authenticated
  WITH CHECK (
    exists (
      select 1 from public.news n
      where n.id = article_translations.news_id
        and (
          (n.created_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- policy: update - admins can update translations they can modify
CREATE POLICY "article_translations_update_admins"
  ON public.article_translations FOR UPDATE
  TO authenticated
  USING (
    exists (
      select 1 from public.news n
      where n.id = article_translations.news_id
        and (
          (n.created_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  )
  WITH CHECK (
    exists (
      select 1 from public.news n
      where n.id = article_translations.news_id
        and (
          (n.created_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- policy: delete - admins can delete translations they can modify
CREATE POLICY "article_translations_delete_admins"
  ON public.article_translations FOR DELETE
  TO authenticated
  USING (
    exists (
      select 1 from public.news n
      where n.id = article_translations.news_id
        and (
          (n.created_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'super_admin')
        )
    )
  );

-- =====================================================
-- 15. create trigger for article_translations updated_at
-- =====================================================

CREATE TRIGGER update_article_translations_updated_at
  BEFORE UPDATE ON public.article_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 16. update news table rls policies to include status
-- =====================================================

-- drop existing policies to recreate them
DROP POLICY IF EXISTS "news_select_anon" ON public.news;
DROP POLICY IF EXISTS "news_select_super_admin" ON public.news;

-- policy: select - anonymous and authenticated users can view published news
CREATE POLICY "news_select_anon"
  ON public.news FOR SELECT
  TO anon, authenticated
  USING (is_public = true AND status = 'published');

-- policy: select - global admins can view all news regardless of status
CREATE POLICY "news_select_super_admin"
  ON public.news FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- policy: select - country admins can view their own news regardless of status
CREATE POLICY "news_select_country_admin_own"
  ON public.news FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid()
    and public.has_role(auth.uid(), 'country_admin')
  );

-- =====================================================
-- 17. create indexes for performance
-- =====================================================

CREATE INDEX idx_news_status ON public.news(status);
CREATE INDEX idx_news_slug ON public.news(slug);
CREATE INDEX idx_news_sort_order ON public.news(sort_order);
CREATE INDEX idx_news_is_featured ON public.news(is_featured);
CREATE INDEX idx_news_category_id ON public.news(category_id);

CREATE INDEX idx_news_categories_slug ON public.news_categories(slug);
CREATE INDEX idx_news_categories_sort_order ON public.news_categories(sort_order);

CREATE INDEX idx_news_gallery_images_news_id ON public.news_gallery_images(news_id);
CREATE INDEX idx_news_gallery_images_sort_order ON public.news_gallery_images(sort_order);

CREATE INDEX idx_article_translations_news_id ON public.article_translations(news_id);
CREATE INDEX idx_article_translations_language ON public.article_translations(language);
CREATE INDEX idx_article_translations_news_language ON public.article_translations(news_id, language);

-- =====================================================
-- 18. create storage buckets for news images
-- =====================================================

-- Create article-images bucket for featured images
CREATE OR REPLACE FUNCTION create_article_images_bucket() RETURNS void AS $$
BEGIN
    PERFORM storage.create_bucket('article-images');
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Bucket article-images already exists or could not be created';
END$$ LANGUAGE plpgsql;

SELECT create_article_images_bucket();

-- Create article-gallery bucket for gallery images
CREATE OR REPLACE FUNCTION create_article_gallery_bucket() RETURNS void AS $$
BEGIN
    PERFORM storage.create_bucket('article-gallery');
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Bucket article-gallery already exists or could not be created';
END$$ LANGUAGE plpgsql;

SELECT create_article_gallery_bucket();

-- =====================================================
-- 19. set up storage policies for the new buckets
-- =====================================================

-- Policy for article-images bucket
CREATE POLICY "article_images_public_read_policy"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-images');

CREATE POLICY "article_images_admin_insert_policy"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'article-images' AND (
    auth.role() = 'authenticated' AND (
      public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin')
    )
  ));

CREATE POLICY "article_images_admin_update_policy"
  ON storage.objects FOR UPDATE
  WITH CHECK (bucket_id = 'article-images' AND (
    auth.role() = 'authenticated' AND (
      public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin')
    )
  ));

CREATE POLICY "article_images_admin_delete_policy"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'article-images' AND (
    auth.role() = 'authenticated' AND (
      public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin')
    )
  ));

-- Policy for article-gallery bucket
CREATE POLICY "article_gallery_public_read_policy"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-gallery');

CREATE POLICY "article_gallery_admin_insert_policy"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'article-gallery' AND (
    auth.role() = 'authenticated' AND (
      public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin')
    )
  ));

CREATE POLICY "article_gallery_admin_update_policy"
  ON storage.objects FOR UPDATE
  WITH CHECK (bucket_id = 'article-gallery' AND (
    auth.role() = 'authenticated' AND (
      public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin')
    )
  ));

CREATE POLICY "article_gallery_admin_delete_policy"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'article-gallery' AND (
    auth.role() = 'authenticated' AND (
      public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin')
    )
  ));