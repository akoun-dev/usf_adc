create extension if not exists "http" with schema "public";

alter table "public"."document_versions" drop constraint "document_versions_created_by_fkey";

alter table "public"."documents" drop constraint "documents_closed_by_fkey";

alter table "public"."documents" drop constraint "documents_created_by_fkey";

alter table "public"."documents" drop constraint "documents_last_edited_by_fkey";

alter table "public"."documents" drop constraint "documents_locked_by_fkey";

alter table "public"."events" add column "language" text default 'fr'::text;

alter table "public"."news" add column "country_id" uuid;

alter table "public"."news" add constraint "news_country_id_fkey" FOREIGN KEY (country_id) REFERENCES public.countries(id) not valid;

alter table "public"."news" validate constraint "news_country_id_fkey";

alter table "public"."document_versions" add constraint "document_versions_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."document_versions" validate constraint "document_versions_created_by_fkey";

alter table "public"."documents" add constraint "documents_closed_by_fkey" FOREIGN KEY (closed_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."documents" validate constraint "documents_closed_by_fkey";

alter table "public"."documents" add constraint "documents_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."documents" validate constraint "documents_created_by_fkey";

alter table "public"."documents" add constraint "documents_last_edited_by_fkey" FOREIGN KEY (last_edited_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."documents" validate constraint "documents_last_edited_by_fkey";

alter table "public"."documents" add constraint "documents_locked_by_fkey" FOREIGN KEY (locked_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."documents" validate constraint "documents_locked_by_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fn_auto_translate_jsonb(p_field_value jsonb, p_source_lang text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.fn_libretranslate(p_text text, p_source_lang text, p_target_lang text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_url text := 'http://host.docker.internal:5000/translate';
    v_response jsonb;
    v_body jsonb;
BEGIN
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
        RETURN NULL;
    END;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_news_translation_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    request_id bigint;
    edge_url text;
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.title = NEW.title AND OLD.content = NEW.content AND OLD.excerpt = NEW.excerpt AND OLD.language = NEW.language) THEN
            RETURN NEW;
        END IF;
    END IF;

    edge_url := 'http://supabase_kong_usf_adc:8000/functions/v1/translate-news';

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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_translation_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE TRIGGER on_events_translation_needed BEFORE INSERT OR UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_translation_trigger();

CREATE TRIGGER on_news_translation_needed BEFORE INSERT OR UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.handle_translation_trigger();


