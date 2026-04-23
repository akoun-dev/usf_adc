-- =====================================================
-- migration: fix news category relation
-- =====================================================
-- purpose: establish proper foreign key relationship between news and news_categories
-- affected tables: news, news_categories
-- special considerations:
--   - adds category_id foreign key to news table
--   - migrates existing category names to proper relationships
--   - maintains backward compatibility
-- =====================================================

-- =====================================================
-- 1. add category_id column to news table
-- =====================================================
-- note: this will create the foreign key relationship

ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.news_categories(id) ON DELETE SET NULL;

-- =====================================================
-- 2. create a temporary mapping function
-- =====================================================
-- note: this helps migrate existing data

CREATE OR REPLACE FUNCTION migrate_news_category()
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
            
            RAISE NOTICE 'Migrated news item % to category %', news_record.id, category_record.id;
        ELSE
            RAISE NOTICE 'No matching category found for news item % with category name %', 
                        news_record.id, news_record.category;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. run the migration
-- =====================================================

SELECT migrate_news_category();

-- =====================================================
-- 4. create index for category_id
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_news_category_id ON public.news(category_id);

-- =====================================================
-- 5. update rls policies to include category_id
-- =====================================================

-- drop existing insert policies to recreate them
DROP POLICY IF EXISTS "news_insert_super_admin" ON public.news;
DROP POLICY IF EXISTS "news_insert_country_admin" ON public.news;

-- policy: insert - global admins can create news with valid category
CREATE POLICY "news_insert_super_admin"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    and public.has_role(auth.uid(), 'super_admin')
    and (category_id IS NULL OR exists (
        select 1 from public.news_categories nc where nc.id = category_id
    ))
  );

-- policy: insert - country admins can create news with valid category
CREATE POLICY "news_insert_country_admin"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    and public.has_role(auth.uid(), 'country_admin')
    and (category_id IS NULL OR exists (
        select 1 from public.news_categories nc where nc.id = category_id
    ))
  );

-- =====================================================
-- 6. update the admin service to use the new relation
-- =====================================================
-- note: this is a comment - actual code changes needed in the application

-- The application code should be updated to:
-- 1. Use category_id instead of category name in createNews/updateNews
-- 2. Update getEnhancedNews to use the proper join: .select("*, news_categories(*)")
-- 3. Update NewsTab.tsx to use item.news_categories instead of item.category

-- =====================================================
-- 7. cleanup function (optional)
-- =====================================================
-- note: this can be run later to remove the old category column

CREATE OR REPLACE FUNCTION cleanup_old_category_column()
RETURNS void AS $$
BEGIN
    -- First ensure all news items have been migrated
    PERFORM 1 FROM public.news WHERE category IS NOT NULL AND category_id IS NULL;
    
    IF NOT FOUND THEN
        -- All items migrated, safe to drop old column
        ALTER TABLE public.news DROP COLUMN category;
        RAISE NOTICE 'Successfully removed old category column';
    ELSE
        RAISE EXCEPTION 'Cannot remove category column - some items not migrated';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Uncomment the line below when ready to cleanup
-- SELECT cleanup_old_category_column();