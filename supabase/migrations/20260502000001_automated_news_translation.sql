-- =====================================================
-- migration: automated news translation system
-- =====================================================
-- purpose: implement automatic translation via triggers and edge functions
-- affected tables: news, platform_settings
-- =====================================================

-- 1. enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. create/update platform_settings for AI
-- note: this provides a central place for the API key used by both frontend and backend
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.platform_settings WHERE key = 'ai_settings') THEN
        INSERT INTO public.platform_settings (key, label, category, value)
        VALUES (
            'ai_settings',
            'Configuration de l''IA de Traduction',
            'system',
            jsonb_build_object(
                'provider', 'openai',
                'model', 'gpt-4o',
                'apiKey', '',
                'systemPrompt', 'You are a professional translator for USF-ADC (Universal Service Fund - Digital Development). Translate the following text naturally and accurately.',
                'temperature', 0.3,
                'enabled', false
            )
        );
    END IF;
END$$;

-- 3. create trigger function for automated translation
-- note: this function calls the Supabase Edge Function asynchronously
CREATE OR REPLACE FUNCTION public.handle_news_translation_trigger()
RETURNS trigger AS $$
DECLARE
    request_id bigint;
    edge_url text;
BEGIN
    -- prevent recursive loops by checking if the content has actually changed
    -- and if it wasn't a translation-only update (optional, but safer)
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.title = NEW.title AND OLD.content = NEW.content AND OLD.excerpt = NEW.excerpt AND OLD.language = NEW.language) THEN
            RETURN NEW;
        END IF;
    END IF;

    -- local development URL vs production
    -- In Docker, we use the container name to reach the gateway
    edge_url := 'http://supabase_kong_usf_adc:8000/functions/v1/translate-news';

    -- call the edge function
    -- we pass the record ID and the source language
    SELECT net.http_post(
        url := edge_url,
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (SELECT value->>'apiKey' FROM public.platform_settings WHERE key = 'ai_settings')
        ),
        body := jsonb_build_object(
            'record_id', NEW.id,
            'source_lang', NEW.language,
            'table', 'news'
        )
    ) INTO request_id;

    RAISE NOTICE 'Translation request queued for news %: request_id %', NEW.id, request_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. create the trigger on news table
DROP TRIGGER IF EXISTS on_news_translation_needed ON public.news;
CREATE TRIGGER on_news_translation_needed
AFTER INSERT OR UPDATE OF title, content, excerpt, language
ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.handle_news_translation_trigger();
