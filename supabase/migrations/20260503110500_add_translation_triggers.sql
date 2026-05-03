-- 1. Function to translate a single string using LibreTranslate
CREATE OR REPLACE FUNCTION public.fn_libretranslate(
    p_text text,
    p_source_lang text,
    p_target_lang text
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_url text := 'http://host.docker.internal:5001/translate';
    v_response jsonb;
    v_body jsonb;
BEGIN
    -- Input validation
    IF p_text IS NULL OR p_text = '' THEN
        RETURN p_text;
    END IF;

    v_body := jsonb_build_object(
        'q', p_text,
        'source', p_source_lang,
        'target', p_target_lang,
        'format', 'text'
    );

    BEGIN
        v_response := content::jsonb FROM http_post(
            v_url,
            v_body::text,
            'application/json'
        );
        RETURN v_response->>'translatedText';
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'LibreTranslate error: %', SQLERRM;
        RETURN NULL;
    END;
END;
$$;

-- 2. Generic function to handle automatic translation for a JSONB field
CREATE OR REPLACE FUNCTION public.fn_auto_translate_jsonb(
    p_field_value jsonb,
    p_source_lang text
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    v_pivot_text text;
    v_langs text[] := ARRAY['fr', 'en', 'pt', 'ar'];
    v_lang text;
    v_result jsonb := p_field_value;
    v_input_text text;
BEGIN
    -- Get input text from the source language key
    v_input_text := p_field_value->>p_source_lang;
    IF v_input_text IS NULL OR v_input_text = '' THEN
        RETURN p_field_value;
    END IF;

    -- 1. Get pivot (English)
    IF p_source_lang = 'en' THEN
        v_pivot_text := v_input_text;
    ELSE
        v_pivot_text := public.fn_libretranslate(v_input_text, p_source_lang, 'en');
        IF v_pivot_text IS NOT NULL THEN
            v_result := v_result || jsonb_build_object('en', v_pivot_text);
        ELSE
            -- If translation fails, we use the original text as pivot for other languages
            v_pivot_text := v_input_text; 
        END IF;
    END IF;

    -- 2. Translate from pivot to others
    FOREACH v_lang IN ARRAY v_langs
    LOOP
        -- Skip source lang and English (already handled or it IS the source)
        IF v_lang = p_source_lang OR (v_lang = 'en' AND p_source_lang != 'en') THEN
            CONTINUE;
        END IF;

        DECLARE
            v_translated text;
        BEGIN
            v_translated := public.fn_libretranslate(v_pivot_text, 'en', v_lang);
            IF v_translated IS NOT NULL THEN
                v_result := v_result || jsonb_build_object(v_lang, v_translated);
            END IF;
        END;
    END LOOP;

    RETURN v_result;
END;
$$;

-- 3. Unified Trigger function for news and events
CREATE OR REPLACE FUNCTION public.handle_translation_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_source_lang text;
BEGIN
    -- Determine source language (fallback to 'fr')
    v_source_lang := COALESCE(NEW.language, 'fr');

    -- For NEWS table
    IF TG_TABLE_NAME = 'news' THEN
        IF (TG_OP = 'INSERT') OR 
           (OLD.title IS DISTINCT FROM NEW.title OR 
            OLD.content IS DISTINCT FROM NEW.content OR 
            OLD.excerpt IS DISTINCT FROM NEW.excerpt OR 
            OLD.language IS DISTINCT FROM NEW.language) THEN
            
            NEW.title := public.fn_auto_translate_jsonb(NEW.title, v_source_lang);
            IF NEW.content IS NOT NULL THEN
                NEW.content := public.fn_auto_translate_jsonb(NEW.content, v_source_lang);
            END IF;
            IF NEW.excerpt IS NOT NULL THEN
                NEW.excerpt := public.fn_auto_translate_jsonb(NEW.excerpt, v_source_lang);
            END IF;
        END IF;
    
    -- For EVENTS table
    ELSIF TG_TABLE_NAME = 'events' THEN
        IF (TG_OP = 'INSERT') OR 
           (OLD.title IS DISTINCT FROM NEW.title OR 
            OLD.description IS DISTINCT FROM NEW.description OR 
            OLD.location IS DISTINCT FROM NEW.location OR
            OLD.language IS DISTINCT FROM NEW.language) THEN
            
            NEW.title := public.fn_auto_translate_jsonb(NEW.title, v_source_lang);
            IF NEW.description IS NOT NULL THEN
                NEW.description := public.fn_auto_translate_jsonb(NEW.description, v_source_lang);
            END IF;
            IF NEW.location IS NOT NULL THEN
                NEW.location := public.fn_auto_translate_jsonb(NEW.location, v_source_lang);
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- 4. Apply Triggers
-- News
DROP TRIGGER IF EXISTS on_news_translation_needed ON news;
CREATE TRIGGER on_news_translation_needed
BEFORE INSERT OR UPDATE ON news
FOR EACH ROW EXECUTE FUNCTION public.handle_translation_trigger();

-- Events
DROP TRIGGER IF EXISTS on_events_translation_needed ON events;
CREATE TRIGGER on_events_translation_needed
BEFORE INSERT OR UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION public.handle_translation_trigger();
