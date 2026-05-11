


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;




ALTER SCHEMA "public" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."app_role" AS ENUM (
    'point_focal',
    'country_admin',
    'super_admin',
    'contributor',
    'editor',
    'participant'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE TYPE "public"."event_status" AS ENUM (
    'upcoming',
    'ongoing',
    'completed',
    'cancelled'
);


ALTER TYPE "public"."event_status" OWNER TO "postgres";


CREATE TYPE "public"."event_type" AS ENUM (
    'conference',
    'webinar',
    'workshop',
    'training',
    'meeting',
    'other'
);


ALTER TYPE "public"."event_type" OWNER TO "postgres";


CREATE TYPE "public"."invitation_status" AS ENUM (
    'pending',
    'accepted',
    'expired',
    'cancelled'
);


ALTER TYPE "public"."invitation_status" OWNER TO "postgres";


CREATE TYPE "public"."news_status" AS ENUM (
    'draft',
    'in_review',
    'published',
    'archived'
);


ALTER TYPE "public"."news_status" OWNER TO "postgres";


CREATE TYPE "public"."notification_type" AS ENUM (
    'info',
    'warning',
    'action_required',
    'system',
    'training_announcement'
);


ALTER TYPE "public"."notification_type" OWNER TO "postgres";


CREATE TYPE "public"."project_status" AS ENUM (
    'draft',
    'planned',
    'in_progress',
    'completed',
    'suspended'
);


ALTER TYPE "public"."project_status" OWNER TO "postgres";


CREATE TYPE "public"."submission_status" AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'approved',
    'rejected',
    'revision_requested'
);


ALTER TYPE "public"."submission_status" OWNER TO "postgres";


CREATE TYPE "public"."ticket_status" AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'closed'
);


ALTER TYPE "public"."ticket_status" OWNER TO "postgres";


CREATE TYPE "public"."validation_action_type" AS ENUM (
    'approve',
    'reject',
    'request_revision',
    'comment'
);


ALTER TYPE "public"."validation_action_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."accept_invitation"("_token" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  _invitation record;
  _user_id uuid;
begin
  -- get the authenticated user id
  _user_id := auth.uid();
  if _user_id is null then
    return jsonb_build_object('success', false, 'error', 'not authenticated');
  end if;

  -- find the invitation
  select * into _invitation from public.invitations
  where token = _token
    and status = 'pending'
    and expires_at > now();

  if _invitation is null then
    return jsonb_build_object('success', false, 'error', 'invalid or expired invitation');
  end if;

  -- assign the role to the user
  insert into public.user_roles (user_id, role)
  values (_user_id, _invitation.role)
  on conflict (user_id, role) do nothing;

  -- set country if provided in invitation
  if _invitation.country_id is not null then
    update public.profiles
    set country_id = _invitation.country_id
    where id = _user_id;
  end if;

  -- mark invitation as accepted
  update public.invitations
  set status = 'accepted', accepted_at = now()
  where id = _invitation.id;

  return jsonb_build_object('success', true, 'role', _invitation.role::text);
end;
$$;


ALTER FUNCTION "public"."accept_invitation"("_token" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."assign_default_role"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'point_focal')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;


ALTER FUNCTION "public"."assign_default_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_document_lock"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Déverrouiller si le lock a expiré
  IF OLD.locked_by IS NOT NULL AND OLD.locked_at < now() - interval '30 minutes' THEN
    NEW.locked_by = NULL;
    NEW.locked_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_document_lock"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_old_category_column"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."cleanup_old_category_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_article_gallery_bucket"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM storage.create_bucket('article-gallery');
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Bucket article-gallery already exists or could not be created';
END$$;


ALTER FUNCTION "public"."create_article_gallery_bucket"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_article_images_bucket"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM storage.create_bucket('article-images');
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Bucket article-images already exists or could not be created';
END$$;


ALTER FUNCTION "public"."create_article_images_bucket"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_auto_translate_jsonb"("p_field_value" "jsonb", "p_source_lang" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql"
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


ALTER FUNCTION "public"."fn_auto_translate_jsonb"("p_field_value" "jsonb", "p_source_lang" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_libretranslate"("p_text" "text", "p_source_lang" "text", "p_target_lang" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."fn_libretranslate"("p_text" "text", "p_source_lang" "text", "p_target_lang" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_mfa_code"("_user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  _code text;
begin
  -- generate a random 6-digit code
  _code := lpad(floor(random() * 1000000)::text, 6, '0');

  -- invalidate previous pending codes (security: prevent code reuse)
  delete from public.mfa_challenges
  where user_id = _user_id and verified_at is null;

  -- insert the new code
  insert into public.mfa_challenges (user_id, code, method)
  values (
    _user_id,
    _code,
    coalesce(
      (select mfa_method from public.profiles where id = _user_id),
      'email'
    )
  );

  return _code;
end;
$$;


ALTER FUNCTION "public"."generate_mfa_code"("_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_country"("_user_id" "uuid") RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select country_id from public.profiles
  where id = _user_id
$$;


ALTER FUNCTION "public"."get_user_country"("_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_internal_messages_translation"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
        BEGIN
            IF (TG_OP = 'UPDATE') THEN
                IF (OLD.subject = NEW.subject AND OLD.content = NEW.content AND OLD.language = NEW.language) THEN
                    RETURN NEW;
                END IF;
            END IF;

            NEW.subject := public.fn_auto_translate_jsonb(NEW.subject, NEW.language);
            NEW.content := public.fn_auto_translate_jsonb(NEW.content, NEW.language);
            
            RETURN NEW;
        END;
        $$;


ALTER FUNCTION "public"."handle_internal_messages_translation"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_internal_messages_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_internal_messages_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_news_translation_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."handle_news_translation_trigger"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_translation_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."handle_translation_trigger"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;


ALTER FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_forum_topic_views"("topic_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  update public.forum_topics
  set views = views + 1
  where id = topic_id;
end;
$$;


ALTER FUNCTION "public"."increment_forum_topic_views"("topic_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."migrate_existing_news_categories"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."migrate_existing_news_categories"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."migrate_news_category"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."migrate_news_category"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_document_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  doc_title TEXT;
  doc_id UUID;
BEGIN
  doc_id := COALESCE(NEW.id, OLD.id);
  doc_title := COALESCE(NEW.title, OLD.title, 'Sans titre');

  -- Notification de clôture
  IF (TG_OP = 'UPDATE' AND NEW.status_workflow = 'closed' AND OLD.status_workflow != 'closed') THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    SELECT
      dp.user_id,
      'info',
      'Document clôturé',
      'Le document "' || doc_title || '" a été clôturé et est maintenant public.',
      '/co-redaction/' || doc_id
    FROM public.document_permissions dp
    WHERE dp.document_id = doc_id AND dp.user_id != auth.uid();
    RETURN NEW;
  END IF;

  -- Notification de réouverture
  IF (TG_OP = 'UPDATE' AND NEW.status_workflow = 'reopened' AND OLD.status_workflow != 'reopened') THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    SELECT
      dp.user_id,
      'info',
      'Document réouvert',
      'Le document "' || doc_title || '" est de nouveau ouvert à la modification.',
      '/co-redaction/' || doc_id
    FROM public.document_permissions dp
    WHERE dp.document_id = doc_id AND dp.user_id != auth.uid();
    RETURN NEW;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."notify_document_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_on_forum_topic"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  _author_name text;
  _topic_title text;
  _target_user record;
begin
  -- get the author's name for the notification
  select full_name into _author_name from public.profiles where id = new.created_by;
  _topic_title := new.title;

  -- notify all admins (point_focal and above) except the author
  for _target_user in
    select distinct ur.user_id
    from public.user_roles ur
    where ur.user_id <> new.created_by
      and ur.role in ('point_focal', 'country_admin', 'super_admin')
  loop
    insert into public.notifications (user_id, type, title, message, link)
    values (
      _target_user.user_id,
      'info',
      'Nouveau sujet sur le forum',
      coalesce(_author_name, 'Un utilisateur') || ' a créé le sujet « ' || _topic_title || ' »',
      '/forum/' || new.id
    );
  end loop;

  return new;
end;
$$;


ALTER FUNCTION "public"."notify_on_forum_topic"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_on_fsu_submitted"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  _submitter_name text;
  _country_name text;
  _target_user record;
begin
  -- only fire when status becomes 'submitted'
  if new.status <> 'submitted' then
    return new;
  end if;
  if tg_op = 'update' and old.status = 'submitted' then
    return new;
  end if;

  -- get submitter and country names
  select full_name into _submitter_name from public.profiles where id = new.submitted_by;
  select name_fr into _country_name from public.countries where id = new.country_id;

  -- notify country admins of the same country
  for _target_user in
    select distinct ur.user_id
    from public.user_roles ur
    join public.profiles p on p.id = ur.user_id
    where ur.user_id <> new.submitted_by
      and (
        (ur.role = 'country_admin' and p.country_id = new.country_id)
        or ur.role = 'super_admin'
      )
  loop
    insert into public.notifications (user_id, type, title, message, link)
    values (
      _target_user.user_id,
      'action_required',
      'Nouvelle soumission FSU',
      coalesce(_submitter_name, 'Un utilisateur') || ' a soumis un formulaire FSU pour ' || coalesce(_country_name, 'un pays'),
      '/fsu/submissions/' || new.id
    );
  end loop;

  return new;
end;
$$;


ALTER FUNCTION "public"."notify_on_fsu_submitted"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_on_role_promotion"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  _promoted_name text;
  _country_id uuid;
  _target_user record;
begin
  insert into public.role_promotions (user_id, role)
  values (new.user_id, new.role);

  if new.role <> 'point_focal' then
    return new;
  end if;

  select full_name, country_id into _promoted_name, _country_id
  from public.profiles where id = new.user_id;

  insert into public.notifications (user_id, type, title, message, link)
  values (
    new.user_id,
    'info',
    'Promotion en Point Focal',
    'Félicitations ! Vous avez été promu(e) au rôle de Point Focal National.',
    '/dashboard'
  );

  for _target_user in
    select distinct ur.user_id from public.user_roles ur where ur.role = 'super_admin'
  loop
    insert into public.notifications (user_id, type, title, message, link)
    values (
      _target_user.user_id,
      'info',
      'Nouveau Point Focal',
      coalesce(_promoted_name, 'Un utilisateur') || ' a été promu(e) au rôle de Point Focal National.',
      '/users'
    );
  end loop;

  return new;
end;
$$;


ALTER FUNCTION "public"."notify_on_role_promotion"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_on_ticket_comment"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  _author_name text;
  _ticket record;
  _target_user record;
begin
  -- get author and ticket details
  select full_name into _author_name from public.profiles where id = new.author_id;
  select * into _ticket from public.support_tickets where id = new.ticket_id;

  if _ticket is null then
    return new;
  end if;

  -- notify ticket creator (if not the commenter)
  if _ticket.created_by <> new.author_id then
    insert into public.notifications (user_id, type, title, message, link)
    values (
      _ticket.created_by,
      'info',
      'Nouveau commentaire sur votre ticket',
      coalesce(_author_name, 'Un utilisateur') || ' a commenté votre ticket « ' || _ticket.title || ' »',
      '/support/' || _ticket.id
    );
  end if;

  -- notify relevant admins
  for _target_user in
    select distinct ur.user_id
    from public.user_roles ur
    left join public.profiles p on p.id = ur.user_id
    where ur.user_id <> new.author_id
      and ur.user_id <> _ticket.created_by
      and (
        ur.role = 'super_admin'
        or (ur.role = 'country_admin' and p.country_id = public.get_user_country(_ticket.created_by))
      )
  loop
    insert into public.notifications (user_id, type, title, message, link)
    values (
      _target_user.user_id,
      'info',
      'Nouveau commentaire sur un ticket',
      coalesce(_author_name, 'Un utilisateur') || ' a commenté le ticket « ' || _ticket.title || ' »',
      '/support/' || _ticket.id
    );
  end loop;

  return new;
end;
$$;


ALTER FUNCTION "public"."notify_on_ticket_comment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_on_ticket_status_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  _status_labels jsonb := '{"open":"Ouvert","in_progress":"En cours","resolved":"Résolu","closed":"Fermé"}'::jsonb;
  _new_label text;
begin
  -- only fire if status actually changed
  if old.status = new.status then
    return new;
  end if;

  -- don't notify if the ticket creator is the one changing the status
  if new.created_by = auth.uid() then
    return new;
  end if;

  _new_label := coalesce(_status_labels ->> new.status::text, new.status::text);

  insert into public.notifications (user_id, type, title, message, link)
  values (
    new.created_by,
    'info',
    'Statut du ticket mis à jour',
    'Le statut de votre ticket « ' || new.title || ' » a été changé en ' || _new_label,
    '/support/' || new.id
  );

  return new;
end;
$$;


ALTER FUNCTION "public"."notify_on_ticket_status_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."unlock_expired_documents"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.documents
  SET locked_by = NULL, locked_at = NULL
  WHERE locked_by IS NOT NULL
    AND locked_at < now() - interval '30 minutes';
END;
$$;


ALTER FUNCTION "public"."unlock_expired_documents"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verify_mfa_code"("_user_id" "uuid", "_code" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  _challenge record;
begin
  -- find the most recent unverified challenge
  select * into _challenge from public.mfa_challenges
  where user_id = _user_id
    and code = _code
    and verified_at is null
    and expires_at > now()
  order by created_at desc
  limit 1;

  if _challenge is null then
    return false;
  end if;

  -- mark the challenge as verified
  update public.mfa_challenges
  set verified_at = now()
  where id = _challenge.id;

  return true;
end;
$$;


ALTER FUNCTION "public"."verify_mfa_code"("_user_id" "uuid", "_code" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."announcements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "training_id" "uuid",
    "type" "text" DEFAULT 'info'::"text" NOT NULL,
    "published_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone,
    "target_roles" "public"."app_role"[] DEFAULT '{}'::"public"."app_role"[],
    "created_by" "uuid"
);


ALTER TABLE "public"."announcements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."api_keys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "key" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "last_used_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."api_keys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."article_translations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "news_id" "uuid" NOT NULL,
    "language" "text" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text",
    "excerpt" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."article_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "action" "text" NOT NULL,
    "target_table" "text",
    "target_id" "uuid",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "ip_address" "inet",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cmdt_contributions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "content" "text",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "version" "text" DEFAULT 'v1'::"text",
    "category" "text",
    "country_id" "uuid",
    "created_by" "uuid",
    "collaborators" "jsonb" DEFAULT '[]'::"jsonb",
    "is_pinned" boolean DEFAULT false,
    "views" integer DEFAULT 0,
    "comments_count" integer DEFAULT 0,
    "submitted_at" timestamp with time zone,
    "validated_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "cmdt_contributions_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'review'::"text", 'pending'::"text", 'validated'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."cmdt_contributions" OWNER TO "postgres";


COMMENT ON TABLE "public"."cmdt_contributions" IS 'CMDT-25 collaborative contributions workspace';



CREATE TABLE IF NOT EXISTS "public"."countries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code_iso" character(2) NOT NULL,
    "name_fr" "text" NOT NULL,
    "name_en" "text" NOT NULL,
    "region" "text" NOT NULL,
    "official_name" "text",
    "flag_url" "text",
    "description" "text",
    "population" "text",
    "capital" "text",
    "fsu_established" "text",
    "fsu_budget" "text",
    "fsu_coordinator_name" "text",
    "fsu_coordinator_email" "text",
    "fsu_coordinator_phone" "text",
    "logo_path" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "legal_texts" "text"
);


ALTER TABLE "public"."countries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."document_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "document_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "author_name" "text" DEFAULT 'Anonyme'::"text" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."document_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."document_permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "document_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'editor'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "document_permissions_role_check" CHECK (("role" = ANY (ARRAY['editor'::"text", 'reviewer'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."document_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."document_tags" (
    "document_id" "uuid" NOT NULL,
    "tag" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."document_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."document_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "document_id" "uuid" NOT NULL,
    "version_number" integer NOT NULL,
    "file_path" "text",
    "file_name" "text",
    "file_size" bigint,
    "mime_type" "text",
    "changelog" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "text" DEFAULT ''::"text",
    "change_summary" "text"
);


ALTER TABLE "public"."document_versions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "category" "text" NOT NULL,
    "file_name" "text" NOT NULL,
    "file_path" "text" NOT NULL,
    "file_size" bigint,
    "mime_type" "text",
    "is_public" boolean DEFAULT false,
    "type" "text",
    "language" "text" DEFAULT 'fr'::"text",
    "published_at" timestamp with time zone,
    "thumbnail" "text",
    "featured" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "uploaded_by" "uuid",
    "download_count" integer DEFAULT 0,
    "version" "text",
    "status" "text" DEFAULT 'active'::"text",
    "metadata" "jsonb",
    "content" "text" DEFAULT ''::"text",
    "locked_by" "uuid",
    "locked_at" timestamp with time zone,
    "status_workflow" "text" DEFAULT 'draft'::"text",
    "last_edited_by" "uuid",
    "country_id" "uuid",
    "file_url" "text",
    "closed_at" timestamp with time zone,
    "closed_by" "uuid",
    "created_by" "uuid",
    CONSTRAINT "documents_status_workflow_check" CHECK (("status_workflow" = ANY (ARRAY['draft'::"text", 'editing'::"text", 'submitted'::"text", 'closed'::"text", 'reopened'::"text"])))
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


COMMENT ON TABLE "public"."documents" IS 'Table for storing document library files with metadata and access control';



COMMENT ON COLUMN "public"."documents"."uploaded_by" IS 'User who uploaded the document';



COMMENT ON COLUMN "public"."documents"."download_count" IS 'Number of times the document has been downloaded';



COMMENT ON COLUMN "public"."documents"."version" IS 'Document version identifier';



COMMENT ON COLUMN "public"."documents"."status" IS 'Document status (active, draft, archived)';



COMMENT ON COLUMN "public"."documents"."metadata" IS 'Additional document metadata in JSON format';



CREATE TABLE IF NOT EXISTS "public"."event_registrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "registered_at" timestamp with time zone DEFAULT "now"(),
    "status" "text" DEFAULT 'registered'::"text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "event_registrations_status_check" CHECK (("status" = ANY (ARRAY['registered'::"text", 'attended'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."event_registrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "tag" "text" NOT NULL
);


ALTER TABLE "public"."event_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "jsonb" NOT NULL,
    "description" "jsonb",
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "location" "jsonb",
    "event_type" "public"."event_type" DEFAULT 'conference'::"public"."event_type" NOT NULL,
    "status" "public"."event_status" DEFAULT 'upcoming'::"public"."event_status" NOT NULL,
    "max_participants" integer,
    "registration_url" "text",
    "price" "text",
    "image_url" "text",
    "organizer" "text",
    "is_public" boolean DEFAULT true NOT NULL,
    "country_id" "uuid",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "language" "text" DEFAULT 'fr'::"text"
);


ALTER TABLE "public"."events" OWNER TO "postgres";


COMMENT ON COLUMN "public"."events"."title" IS 'Event title (multi-language JSONB)';



COMMENT ON COLUMN "public"."events"."description" IS 'Detailed event description (multi-language JSONB)';



COMMENT ON COLUMN "public"."events"."location" IS 'Location or platform (multi-language JSONB)';



CREATE TABLE IF NOT EXISTS "public"."faq_articles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "category" "text" DEFAULT 'general'::"text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "is_published" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."faq_articles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "slug" "text" NOT NULL,
    "sort_order" integer DEFAULT 0,
    "icon" "text",
    "color" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."forum_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "topic_id" "uuid" NOT NULL,
    "created_by" "uuid",
    "content" "text" NOT NULL,
    "is_solution" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."forum_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reporter_id" "uuid" NOT NULL,
    "target_type" "text" NOT NULL,
    "target_id" "uuid" NOT NULL,
    "reason" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "reviewed_by" "uuid",
    "reviewed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "forum_reports_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'reviewed'::"text", 'dismissed'::"text"]))),
    CONSTRAINT "forum_reports_target_type_check" CHECK (("target_type" = ANY (ARRAY['post'::"text", 'topic'::"text"])))
);


ALTER TABLE "public"."forum_reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_topic_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "topic_id" "uuid" NOT NULL,
    "tag" "text" NOT NULL
);


ALTER TABLE "public"."forum_topic_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_topics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "created_by" "uuid",
    "is_pinned" boolean DEFAULT false,
    "is_locked" boolean DEFAULT false,
    "is_public" boolean DEFAULT true,
    "views" integer DEFAULT 0,
    "status" "text" DEFAULT 'open'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."forum_topics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fsu_agencies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "country_id" "uuid" NOT NULL,
    "dg_name" "text",
    "dg_message" "jsonb",
    "dg_photo_url" "text",
    "fsu_name" "text",
    "agency_type" "text" DEFAULT 'agency'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "latitude" numeric,
    "longitude" numeric,
    "headquarters" "text",
    "contact_phone" "text",
    "contact_email" "text"
);


ALTER TABLE "public"."fsu_agencies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fsu_submission_attachments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "submission_id" "uuid" NOT NULL,
    "file_name" "text" NOT NULL,
    "file_path" "text" NOT NULL,
    "file_size" integer DEFAULT 0 NOT NULL,
    "mime_type" "text" NOT NULL,
    "uploaded_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."fsu_submission_attachments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fsu_submission_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "submission_id" "uuid" NOT NULL,
    "version_number" integer DEFAULT 1 NOT NULL,
    "data" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "changed_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."fsu_submission_versions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fsu_submissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "country_id" "uuid" NOT NULL,
    "submitted_by" "uuid" NOT NULL,
    "status" "public"."submission_status" DEFAULT 'draft'::"public"."submission_status" NOT NULL,
    "period_start" "date" NOT NULL,
    "period_end" "date" NOT NULL,
    "data" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "submitted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid"
);


ALTER TABLE "public"."fsu_submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fsu_validation_actions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "submission_id" "uuid" NOT NULL,
    "action" "public"."validation_action_type" NOT NULL,
    "comment" "text",
    "performed_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."fsu_validation_actions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."internal_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "recipient_id" "uuid",
    "subject" "jsonb" DEFAULT '{}'::"jsonb",
    "content" "jsonb" DEFAULT '{}'::"jsonb",
    "language" "text" DEFAULT 'fr'::"text",
    "status" "text" DEFAULT 'sent'::"text" NOT NULL,
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at_sender" timestamp with time zone,
    "deleted_at_recipient" timestamp with time zone,
    "parent_message_id" "uuid",
    "thread_id" "uuid" DEFAULT "gen_random_uuid"(),
    CONSTRAINT "internal_messages_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'sent'::"text"])))
);


ALTER TABLE "public"."internal_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invitations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "role" "public"."app_role" NOT NULL,
    "country_id" "uuid",
    "token" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '48:00:00'::interval) NOT NULL,
    "status" "public"."invitation_status" DEFAULT 'pending'::"public"."invitation_status" NOT NULL,
    "invited_by" "uuid" NOT NULL,
    "accepted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ip_restrictions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "ip_range" "text" NOT NULL,
    "type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "ip_restrictions_type_check" CHECK (("type" = ANY (ARRAY['allow'::"text", 'deny'::"text"])))
);


ALTER TABLE "public"."ip_restrictions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."membres_associes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nom" "text" NOT NULL,
    "nom_complet" "text",
    "pays_id" "uuid",
    "logo_url" "text",
    "type" "text" NOT NULL,
    "secteur" "text",
    "depuis" "text",
    "site_web" "text",
    "description" "text",
    "projets" "jsonb",
    "email_contact" "text",
    "telephone_contact" "text",
    "adresse" "text",
    "est_actif" boolean DEFAULT true,
    "date_creation" timestamp with time zone DEFAULT "now"(),
    "date_mise_a_jour" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "membres_associes_type_check" CHECK (("type" = ANY (ARRAY['agence'::"text", 'operateur'::"text", 'institution'::"text", 'association'::"text"])))
);


ALTER TABLE "public"."membres_associes" OWNER TO "postgres";


COMMENT ON TABLE "public"."membres_associes" IS 'Table containing associated members of the organization';



CREATE TABLE IF NOT EXISTS "public"."mfa_challenges" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "code" "text" NOT NULL,
    "method" "text" DEFAULT 'email'::"text" NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '00:05:00'::interval) NOT NULL,
    "verified_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."mfa_challenges" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."news" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "jsonb" NOT NULL,
    "excerpt" "jsonb",
    "content" "jsonb",
    "category" "jsonb",
    "source" "text",
    "image_url" "text",
    "published_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_public" boolean DEFAULT true NOT NULL,
    "author" "text",
    "read_time" "text",
    "language" "text" DEFAULT 'fr'::"text" NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."news_status" DEFAULT 'draft'::"public"."news_status" NOT NULL,
    "featured_image" "text",
    "meta_description" "text",
    "meta_keywords" "text",
    "slug" "text",
    "sort_order" integer DEFAULT 0,
    "is_featured" boolean DEFAULT false,
    "allow_comments" boolean DEFAULT true,
    "category_id" "uuid",
    "country_id" "uuid"
);


ALTER TABLE "public"."news" OWNER TO "postgres";


COMMENT ON COLUMN "public"."news"."title" IS 'Article title (multi-language JSONB)';



COMMENT ON COLUMN "public"."news"."excerpt" IS 'Brief summary or excerpt (multi-language JSONB)';



COMMENT ON COLUMN "public"."news"."content" IS 'Full article content (multi-language JSONB)';



COMMENT ON COLUMN "public"."news"."category" IS 'Category for grouping (multi-language JSONB)';



CREATE TABLE IF NOT EXISTS "public"."news_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name_fr" "text" NOT NULL,
    "name_en" "text" NOT NULL,
    "name_pt" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "color" "text",
    "icon" "text",
    "sort_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."news_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."news_gallery_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "news_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "caption" "text",
    "alt_text" "text",
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."news_gallery_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."news_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "news_id" "uuid" NOT NULL,
    "tag" "text" NOT NULL
);


ALTER TABLE "public"."news_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."newsletters" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "summary" "text",
    "content" "text" NOT NULL,
    "target_roles" "public"."app_role"[] DEFAULT '{point_focal,country_admin,super_admin}'::"public"."app_role"[] NOT NULL,
    "is_published" boolean DEFAULT false NOT NULL,
    "published_at" timestamp with time zone,
    "email_sent" boolean DEFAULT false NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."newsletters" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "public"."notification_type" DEFAULT 'info'::"public"."notification_type" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "link" "text",
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."partenaires" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nom" "text" NOT NULL,
    "nom_complet" "text",
    "pays_id" "uuid",
    "logo_url" "text",
    "type" "text" NOT NULL,
    "domaine" "text",
    "depuis" "text",
    "site_web" "text",
    "description" "text",
    "projets" "jsonb",
    "email_contact" "text",
    "telephone_contact" "text",
    "adresse" "text",
    "est_actif" boolean DEFAULT true,
    "date_creation" timestamp with time zone DEFAULT "now"(),
    "date_mise_a_jour" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "partenaires_type_check" CHECK (("type" = ANY (ARRAY['institutionnel'::"text", 'prive'::"text", 'ong'::"text", 'international'::"text"])))
);


ALTER TABLE "public"."partenaires" OWNER TO "postgres";


COMMENT ON TABLE "public"."partenaires" IS 'Table containing partners of the organization';



CREATE TABLE IF NOT EXISTS "public"."platform_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" "text" NOT NULL,
    "value" "jsonb" DEFAULT '"{}"'::"jsonb" NOT NULL,
    "label" "text" NOT NULL,
    "category" "text" DEFAULT 'general'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."platform_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "country_id" "uuid",
    "language" "text" DEFAULT 'fr'::"text" NOT NULL,
    "phone" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "telegram_chat_id" "text",
    "mfa_method" "text" DEFAULT 'email'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_actors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "role" "text",
    "organization" "text",
    "contact" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "project_actors_type_check" CHECK (("type" = ANY (ARRAY['carrier'::"text", 'partner'::"text", 'beneficiary'::"text", 'stakeholder'::"text"])))
);


ALTER TABLE "public"."project_actors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "file_name" "text" NOT NULL,
    "mime_type" "text" NOT NULL,
    "file_size" bigint NOT NULL,
    "file_url" "text" NOT NULL,
    "document_type" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "project_documents_document_type_check" CHECK (("document_type" = ANY (ARRAY['contract'::"text", 'report'::"text", 'budget'::"text", 'technical'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."project_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."project_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_project_tags" (
    "project_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL
);


ALTER TABLE "public"."project_project_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."project_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "country_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "status" "public"."project_status" DEFAULT 'planned'::"public"."project_status" NOT NULL,
    "budget" numeric(15,2),
    "latitude" double precision,
    "longitude" double precision,
    "region" "text",
    "progress" integer,
    "beneficiaries" "text",
    "operator" "text",
    "thematic" "text",
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "objectives" "text",
    "indicators" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "projects_progress_check" CHECK ((("progress" >= 0) AND ("progress" <= 100)))
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quarterly_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "quarter" "text" NOT NULL,
    "year" integer NOT NULL,
    "summary" "text",
    "file_url" "text",
    "is_published" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "quarterly_reports_quarter_check" CHECK (("quarter" = ANY (ARRAY['Q1'::"text", 'Q2'::"text", 'Q3'::"text", 'Q4'::"text"])))
);


ALTER TABLE "public"."quarterly_reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."role_promotions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."app_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."role_promotions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submission_periods" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "label" "text" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "reminder_days_before" integer DEFAULT 7 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."submission_periods" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."support_ticket_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ticket_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."support_ticket_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."support_tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "status" "public"."ticket_status" DEFAULT 'open'::"public"."ticket_status" NOT NULL,
    "priority" "text" DEFAULT 'medium'::"text" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "assigned_to" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."support_tickets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."training_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "training_id" "uuid" NOT NULL,
    "document_id" "uuid" NOT NULL,
    "access_roles" "public"."app_role"[] DEFAULT '{}'::"public"."app_role"[]
);


ALTER TABLE "public"."training_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."training_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "training_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "training_events_type_check" CHECK (("type" = ANY (ARRAY['online'::"text", 'onsite'::"text"])))
);


ALTER TABLE "public"."training_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."training_registrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "training_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "registered_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "training_registrations_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'confirmed'::"text", 'cancelled'::"text", 'attended'::"text"])))
);


ALTER TABLE "public"."training_registrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trainings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "type" "text" NOT NULL,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "trainer" "text",
    "capacity" integer,
    "location" "text",
    "content" "jsonb" DEFAULT '{}'::"jsonb",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "trainings_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'archived'::"text"]))),
    CONSTRAINT "trainings_type_check" CHECK (("type" = ANY (ARRAY['online'::"text", 'onsite'::"text"])))
);


ALTER TABLE "public"."trainings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."app_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."validation_workflow_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "country_id" "uuid" NOT NULL,
    "approval_levels" integer DEFAULT 1 NOT NULL,
    "default_deadline_days" integer DEFAULT 14 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "validation_workflow_settings_approval_levels_check" CHECK (("approval_levels" = ANY (ARRAY[1, 2])))
);


ALTER TABLE "public"."validation_workflow_settings" OWNER TO "postgres";


ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."api_keys"
    ADD CONSTRAINT "api_keys_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."api_keys"
    ADD CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."article_translations"
    ADD CONSTRAINT "article_translations_news_id_language_key" UNIQUE ("news_id", "language");



ALTER TABLE ONLY "public"."article_translations"
    ADD CONSTRAINT "article_translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cmdt_contributions"
    ADD CONSTRAINT "cmdt_contributions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_code_iso_key" UNIQUE ("code_iso");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_comments"
    ADD CONSTRAINT "document_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_permissions"
    ADD CONSTRAINT "document_permissions_document_id_user_id_key" UNIQUE ("document_id", "user_id");



ALTER TABLE ONLY "public"."document_permissions"
    ADD CONSTRAINT "document_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_tags"
    ADD CONSTRAINT "document_tags_pkey" PRIMARY KEY ("document_id", "tag");



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_event_id_user_id_key" UNIQUE ("event_id", "user_id");



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_tags"
    ADD CONSTRAINT "event_tags_event_id_tag_key" UNIQUE ("event_id", "tag");



ALTER TABLE ONLY "public"."event_tags"
    ADD CONSTRAINT "event_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faq_articles"
    ADD CONSTRAINT "faq_articles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forum_categories"
    ADD CONSTRAINT "forum_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forum_categories"
    ADD CONSTRAINT "forum_categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."forum_posts"
    ADD CONSTRAINT "forum_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forum_reports"
    ADD CONSTRAINT "forum_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forum_topic_tags"
    ADD CONSTRAINT "forum_topic_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forum_topic_tags"
    ADD CONSTRAINT "forum_topic_tags_topic_id_tag_key" UNIQUE ("topic_id", "tag");



ALTER TABLE ONLY "public"."forum_topics"
    ADD CONSTRAINT "forum_topics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fsu_agencies"
    ADD CONSTRAINT "fsu_agencies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fsu_submission_attachments"
    ADD CONSTRAINT "fsu_submission_attachments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fsu_submission_versions"
    ADD CONSTRAINT "fsu_submission_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fsu_submission_versions"
    ADD CONSTRAINT "fsu_submission_versions_submission_id_version_number_key" UNIQUE ("submission_id", "version_number");



ALTER TABLE ONLY "public"."fsu_submissions"
    ADD CONSTRAINT "fsu_submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fsu_validation_actions"
    ADD CONSTRAINT "fsu_validation_actions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."internal_messages"
    ADD CONSTRAINT "internal_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."ip_restrictions"
    ADD CONSTRAINT "ip_restrictions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."membres_associes"
    ADD CONSTRAINT "membres_associes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news_categories"
    ADD CONSTRAINT "news_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news_categories"
    ADD CONSTRAINT "news_categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."news_gallery_images"
    ADD CONSTRAINT "news_gallery_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news_tags"
    ADD CONSTRAINT "news_tags_news_id_tag_key" UNIQUE ("news_id", "tag");



ALTER TABLE ONLY "public"."news_tags"
    ADD CONSTRAINT "news_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."newsletters"
    ADD CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."partenaires"
    ADD CONSTRAINT "partenaires_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."platform_settings"
    ADD CONSTRAINT "platform_settings_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."platform_settings"
    ADD CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_actors"
    ADD CONSTRAINT "project_actors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_documents"
    ADD CONSTRAINT "project_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_images"
    ADD CONSTRAINT "project_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_project_tags"
    ADD CONSTRAINT "project_project_tags_pkey" PRIMARY KEY ("project_id", "tag_id");



ALTER TABLE ONLY "public"."project_tags"
    ADD CONSTRAINT "project_tags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."project_tags"
    ADD CONSTRAINT "project_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quarterly_reports"
    ADD CONSTRAINT "quarterly_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_promotions"
    ADD CONSTRAINT "role_promotions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submission_periods"
    ADD CONSTRAINT "submission_periods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."support_ticket_comments"
    ADD CONSTRAINT "support_ticket_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_documents"
    ADD CONSTRAINT "training_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_documents"
    ADD CONSTRAINT "training_documents_training_id_document_id_key" UNIQUE ("training_id", "document_id");



ALTER TABLE ONLY "public"."training_events"
    ADD CONSTRAINT "training_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_registrations"
    ADD CONSTRAINT "training_registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_registrations"
    ADD CONSTRAINT "training_registrations_training_id_user_id_key" UNIQUE ("training_id", "user_id");



ALTER TABLE ONLY "public"."trainings"
    ADD CONSTRAINT "trainings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_role_key" UNIQUE ("user_id", "role");



ALTER TABLE ONLY "public"."validation_workflow_settings"
    ADD CONSTRAINT "validation_workflow_settings_country_id_key" UNIQUE ("country_id");



ALTER TABLE ONLY "public"."validation_workflow_settings"
    ADD CONSTRAINT "validation_workflow_settings_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_article_translations_language" ON "public"."article_translations" USING "btree" ("language");



CREATE INDEX "idx_article_translations_news_id" ON "public"."article_translations" USING "btree" ("news_id");



CREATE INDEX "idx_article_translations_news_language" ON "public"."article_translations" USING "btree" ("news_id", "language");



CREATE INDEX "idx_audit_logs_action" ON "public"."audit_logs" USING "btree" ("action");



CREATE INDEX "idx_audit_logs_created_at" ON "public"."audit_logs" USING "btree" ("created_at");



CREATE INDEX "idx_audit_logs_target_table" ON "public"."audit_logs" USING "btree" ("target_table");



CREATE INDEX "idx_audit_logs_user_id" ON "public"."audit_logs" USING "btree" ("user_id");



CREATE INDEX "idx_cmdt_contributions_category" ON "public"."cmdt_contributions" USING "btree" ("category");



CREATE INDEX "idx_cmdt_contributions_country_id" ON "public"."cmdt_contributions" USING "btree" ("country_id");



CREATE INDEX "idx_cmdt_contributions_created_by" ON "public"."cmdt_contributions" USING "btree" ("created_by");



CREATE INDEX "idx_cmdt_contributions_status" ON "public"."cmdt_contributions" USING "btree" ("status");



CREATE INDEX "idx_countries_code_iso" ON "public"."countries" USING "btree" ("code_iso");



CREATE INDEX "idx_countries_region" ON "public"."countries" USING "btree" ("region");



CREATE INDEX "idx_document_comments_created_at" ON "public"."document_comments" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_document_comments_document_id" ON "public"."document_comments" USING "btree" ("document_id");



CREATE INDEX "idx_document_permissions_document_id" ON "public"."document_permissions" USING "btree" ("document_id");



CREATE INDEX "idx_document_permissions_user_id" ON "public"."document_permissions" USING "btree" ("user_id");



CREATE INDEX "idx_document_tags_tag" ON "public"."document_tags" USING "btree" ("tag");



CREATE INDEX "idx_document_versions_created_at" ON "public"."document_versions" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_document_versions_document_id" ON "public"."document_versions" USING "btree" ("document_id");



CREATE INDEX "idx_document_versions_version_number" ON "public"."document_versions" USING "btree" ("version_number");



CREATE INDEX "idx_documents_category" ON "public"."documents" USING "btree" ("category");



CREATE INDEX "idx_documents_created_by" ON "public"."documents" USING "btree" ("created_by");



CREATE INDEX "idx_documents_is_public" ON "public"."documents" USING "btree" ("is_public");



CREATE INDEX "idx_documents_language" ON "public"."documents" USING "btree" ("language");



CREATE INDEX "idx_documents_published_at" ON "public"."documents" USING "btree" ("published_at");



CREATE INDEX "idx_documents_status" ON "public"."documents" USING "btree" ("status");



CREATE INDEX "idx_documents_uploaded_by" ON "public"."documents" USING "btree" ("uploaded_by");



CREATE INDEX "idx_event_registrations_event_id" ON "public"."event_registrations" USING "btree" ("event_id");



CREATE INDEX "idx_event_registrations_user_id" ON "public"."event_registrations" USING "btree" ("user_id");



CREATE INDEX "idx_events_country_id" ON "public"."events" USING "btree" ("country_id");



CREATE INDEX "idx_events_end_date" ON "public"."events" USING "btree" ("end_date");



CREATE INDEX "idx_events_is_public" ON "public"."events" USING "btree" ("is_public");



CREATE INDEX "idx_events_start_date" ON "public"."events" USING "btree" ("start_date");



CREATE INDEX "idx_events_status" ON "public"."events" USING "btree" ("status");



CREATE INDEX "idx_events_type" ON "public"."events" USING "btree" ("event_type");



CREATE INDEX "idx_faq_articles_category" ON "public"."faq_articles" USING "btree" ("category");



CREATE INDEX "idx_faq_articles_category_order" ON "public"."faq_articles" USING "btree" ("category", "sort_order");



CREATE INDEX "idx_faq_articles_is_published" ON "public"."faq_articles" USING "btree" ("is_published");



CREATE INDEX "idx_forum_posts_created_at" ON "public"."forum_posts" USING "btree" ("created_at");



CREATE INDEX "idx_forum_posts_created_by" ON "public"."forum_posts" USING "btree" ("created_by");



CREATE INDEX "idx_forum_posts_is_solution" ON "public"."forum_posts" USING "btree" ("is_solution");



CREATE INDEX "idx_forum_posts_topic_id" ON "public"."forum_posts" USING "btree" ("topic_id");



CREATE INDEX "idx_forum_reports_reporter_id" ON "public"."forum_reports" USING "btree" ("reporter_id");



CREATE INDEX "idx_forum_reports_status" ON "public"."forum_reports" USING "btree" ("status");



CREATE INDEX "idx_forum_reports_target" ON "public"."forum_reports" USING "btree" ("target_type", "target_id");



CREATE INDEX "idx_forum_topics_category_id" ON "public"."forum_topics" USING "btree" ("category_id");



CREATE INDEX "idx_forum_topics_created_at" ON "public"."forum_topics" USING "btree" ("created_at");



CREATE INDEX "idx_forum_topics_created_by" ON "public"."forum_topics" USING "btree" ("created_by");



CREATE INDEX "idx_forum_topics_is_pinned" ON "public"."forum_topics" USING "btree" ("is_pinned");



CREATE INDEX "idx_forum_topics_is_public" ON "public"."forum_topics" USING "btree" ("is_public");



CREATE INDEX "idx_fsu_submission_attachments_submission_id" ON "public"."fsu_submission_attachments" USING "btree" ("submission_id");



CREATE INDEX "idx_fsu_submission_attachments_uploaded_by" ON "public"."fsu_submission_attachments" USING "btree" ("uploaded_by");



CREATE INDEX "idx_fsu_submission_versions_submission_id" ON "public"."fsu_submission_versions" USING "btree" ("submission_id");



CREATE INDEX "idx_fsu_submission_versions_version_number" ON "public"."fsu_submission_versions" USING "btree" ("version_number");



CREATE INDEX "idx_fsu_submissions_country_id" ON "public"."fsu_submissions" USING "btree" ("country_id");



CREATE INDEX "idx_fsu_submissions_period" ON "public"."fsu_submissions" USING "btree" ("period_start", "period_end");



CREATE INDEX "idx_fsu_submissions_status" ON "public"."fsu_submissions" USING "btree" ("status");



CREATE INDEX "idx_fsu_submissions_submitted_by" ON "public"."fsu_submissions" USING "btree" ("submitted_by");



CREATE INDEX "idx_fsu_validation_actions_action" ON "public"."fsu_validation_actions" USING "btree" ("action");



CREATE INDEX "idx_fsu_validation_actions_performed_by" ON "public"."fsu_validation_actions" USING "btree" ("performed_by");



CREATE INDEX "idx_fsu_validation_actions_submission_id" ON "public"."fsu_validation_actions" USING "btree" ("submission_id");



CREATE INDEX "idx_internal_messages_created_at" ON "public"."internal_messages" USING "btree" ("created_at");



CREATE INDEX "idx_internal_messages_recipient_id" ON "public"."internal_messages" USING "btree" ("recipient_id");



CREATE INDEX "idx_internal_messages_sender_id" ON "public"."internal_messages" USING "btree" ("sender_id");



CREATE INDEX "idx_internal_messages_status" ON "public"."internal_messages" USING "btree" ("status");



CREATE INDEX "idx_invitations_email" ON "public"."invitations" USING "btree" ("email");



CREATE INDEX "idx_invitations_expires_at" ON "public"."invitations" USING "btree" ("expires_at");



CREATE INDEX "idx_invitations_status" ON "public"."invitations" USING "btree" ("status");



CREATE INDEX "idx_invitations_token" ON "public"."invitations" USING "btree" ("token");



CREATE INDEX "idx_membres_associes_nom" ON "public"."membres_associes" USING "btree" ("nom");



CREATE INDEX "idx_membres_associes_pays" ON "public"."membres_associes" USING "btree" ("pays_id");



CREATE INDEX "idx_membres_associes_type" ON "public"."membres_associes" USING "btree" ("type");



CREATE INDEX "idx_mfa_challenges_expires_at" ON "public"."mfa_challenges" USING "btree" ("expires_at");



CREATE INDEX "idx_mfa_challenges_user_id" ON "public"."mfa_challenges" USING "btree" ("user_id");



CREATE INDEX "idx_news_categories_slug" ON "public"."news_categories" USING "btree" ("slug");



CREATE INDEX "idx_news_categories_sort_order" ON "public"."news_categories" USING "btree" ("sort_order");



CREATE INDEX "idx_news_category" ON "public"."news" USING "btree" ("category");



CREATE INDEX "idx_news_category_id" ON "public"."news" USING "btree" ("category_id");



CREATE INDEX "idx_news_gallery_images_news_id" ON "public"."news_gallery_images" USING "btree" ("news_id");



CREATE INDEX "idx_news_gallery_images_sort_order" ON "public"."news_gallery_images" USING "btree" ("sort_order");



CREATE INDEX "idx_news_is_featured" ON "public"."news" USING "btree" ("is_featured");



CREATE INDEX "idx_news_is_public" ON "public"."news" USING "btree" ("is_public");



CREATE INDEX "idx_news_language" ON "public"."news" USING "btree" ("language");



CREATE INDEX "idx_news_published_at" ON "public"."news" USING "btree" ("published_at" DESC);



CREATE INDEX "idx_news_slug" ON "public"."news" USING "btree" ("slug");



CREATE INDEX "idx_news_sort_order" ON "public"."news" USING "btree" ("sort_order");



CREATE INDEX "idx_news_status" ON "public"."news" USING "btree" ("status");



CREATE INDEX "idx_newsletters_is_published" ON "public"."newsletters" USING "btree" ("is_published");



CREATE INDEX "idx_newsletters_published_at" ON "public"."newsletters" USING "btree" ("published_at");



CREATE INDEX "idx_notifications_created_at" ON "public"."notifications" USING "btree" ("created_at");



CREATE INDEX "idx_notifications_read_at" ON "public"."notifications" USING "btree" ("read_at");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_partenaires_nom" ON "public"."partenaires" USING "btree" ("nom");



CREATE INDEX "idx_partenaires_pays" ON "public"."partenaires" USING "btree" ("pays_id");



CREATE INDEX "idx_partenaires_type" ON "public"."partenaires" USING "btree" ("type");



CREATE INDEX "idx_profiles_country_id" ON "public"."profiles" USING "btree" ("country_id");



CREATE INDEX "idx_profiles_is_active" ON "public"."profiles" USING "btree" ("is_active");



CREATE INDEX "idx_profiles_telegram_chat_id" ON "public"."profiles" USING "btree" ("telegram_chat_id");



CREATE INDEX "idx_role_promotions_created_at" ON "public"."role_promotions" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_role_promotions_user_id" ON "public"."role_promotions" USING "btree" ("user_id");



CREATE INDEX "idx_support_ticket_comments_author_id" ON "public"."support_ticket_comments" USING "btree" ("author_id");



CREATE INDEX "idx_support_ticket_comments_ticket_id" ON "public"."support_ticket_comments" USING "btree" ("ticket_id");



CREATE INDEX "idx_support_tickets_assigned_to" ON "public"."support_tickets" USING "btree" ("assigned_to");



CREATE INDEX "idx_support_tickets_created_by" ON "public"."support_tickets" USING "btree" ("created_by");



CREATE INDEX "idx_support_tickets_status" ON "public"."support_tickets" USING "btree" ("status");



CREATE INDEX "idx_user_roles_role" ON "public"."user_roles" USING "btree" ("role");



CREATE INDEX "idx_user_roles_user_id" ON "public"."user_roles" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "on_internal_messages_translation" BEFORE INSERT OR UPDATE ON "public"."internal_messages" FOR EACH ROW EXECUTE FUNCTION "public"."handle_internal_messages_translation"();



CREATE OR REPLACE TRIGGER "on_role_promotion" AFTER INSERT ON "public"."user_roles" FOR EACH ROW EXECUTE FUNCTION "public"."notify_on_role_promotion"();



CREATE OR REPLACE TRIGGER "set_internal_messages_updated_at" BEFORE UPDATE ON "public"."internal_messages" FOR EACH ROW EXECUTE FUNCTION "public"."handle_internal_messages_updated_at"();



CREATE OR REPLACE TRIGGER "trg_notify_forum_topic" AFTER INSERT ON "public"."forum_topics" FOR EACH ROW EXECUTE FUNCTION "public"."notify_on_forum_topic"();



CREATE OR REPLACE TRIGGER "trg_notify_fsu_submitted" AFTER INSERT OR UPDATE ON "public"."fsu_submissions" FOR EACH ROW EXECUTE FUNCTION "public"."notify_on_fsu_submitted"();



CREATE OR REPLACE TRIGGER "trg_notify_on_ticket_comment" AFTER INSERT ON "public"."support_ticket_comments" FOR EACH ROW EXECUTE FUNCTION "public"."notify_on_ticket_comment"();



CREATE OR REPLACE TRIGGER "trg_notify_on_ticket_status_change" AFTER UPDATE ON "public"."support_tickets" FOR EACH ROW EXECUTE FUNCTION "public"."notify_on_ticket_status_change"();



CREATE OR REPLACE TRIGGER "trigger_check_document_lock" BEFORE UPDATE ON "public"."documents" FOR EACH ROW EXECUTE FUNCTION "public"."check_document_lock"();



CREATE OR REPLACE TRIGGER "trigger_notify_document_change" AFTER UPDATE ON "public"."documents" FOR EACH ROW EXECUTE FUNCTION "public"."notify_document_change"();



CREATE OR REPLACE TRIGGER "update_api_keys_updated_at" BEFORE UPDATE ON "public"."api_keys" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_article_translations_updated_at" BEFORE UPDATE ON "public"."article_translations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_cmdt_contributions_updated_at" BEFORE UPDATE ON "public"."cmdt_contributions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_countries_updated_at" BEFORE UPDATE ON "public"."countries" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_event_registrations_updated_at" BEFORE UPDATE ON "public"."event_registrations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_events_updated_at" BEFORE UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_faq_articles_updated_at" BEFORE UPDATE ON "public"."faq_articles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_forum_posts_updated_at" BEFORE UPDATE ON "public"."forum_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_forum_topics_updated_at" BEFORE UPDATE ON "public"."forum_topics" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fsu_agencies_updated_at" BEFORE UPDATE ON "public"."fsu_agencies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fsu_submissions_updated_at" BEFORE UPDATE ON "public"."fsu_submissions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_invitations_updated_at" BEFORE UPDATE ON "public"."invitations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_ip_restrictions_updated_at" BEFORE UPDATE ON "public"."ip_restrictions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_news_categories_updated_at" BEFORE UPDATE ON "public"."news_categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_news_gallery_images_updated_at" BEFORE UPDATE ON "public"."news_gallery_images" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_news_updated_at" BEFORE UPDATE ON "public"."news" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_newsletters_updated_at" BEFORE UPDATE ON "public"."newsletters" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_platform_settings_updated_at" BEFORE UPDATE ON "public"."platform_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_quarterly_reports_updated_at" BEFORE UPDATE ON "public"."quarterly_reports" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_submission_periods_updated_at" BEFORE UPDATE ON "public"."submission_periods" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_support_tickets_updated_at" BEFORE UPDATE ON "public"."support_tickets" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_trainings_updated_at" BEFORE UPDATE ON "public"."trainings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_validation_workflow_settings_updated_at" BEFORE UPDATE ON "public"."validation_workflow_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."article_translations"
    ADD CONSTRAINT "article_translations_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."cmdt_contributions"
    ADD CONSTRAINT "cmdt_contributions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."cmdt_contributions"
    ADD CONSTRAINT "cmdt_contributions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."document_comments"
    ADD CONSTRAINT "document_comments_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."document_comments"
    ADD CONSTRAINT "document_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."document_permissions"
    ADD CONSTRAINT "document_permissions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."document_permissions"
    ADD CONSTRAINT "document_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."document_tags"
    ADD CONSTRAINT "document_tags_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_closed_by_fkey" FOREIGN KEY ("closed_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_last_edited_by_fkey" FOREIGN KEY ("last_edited_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_locked_by_fkey" FOREIGN KEY ("locked_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_tags"
    ADD CONSTRAINT "event_tags_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."forum_posts"
    ADD CONSTRAINT "forum_posts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."forum_posts"
    ADD CONSTRAINT "forum_posts_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."forum_topics"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."forum_reports"
    ADD CONSTRAINT "forum_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."forum_reports"
    ADD CONSTRAINT "forum_reports_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."forum_topics"
    ADD CONSTRAINT "forum_topics_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."forum_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."forum_topics"
    ADD CONSTRAINT "forum_topics_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."fsu_agencies"
    ADD CONSTRAINT "fsu_agencies_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fsu_submission_attachments"
    ADD CONSTRAINT "fsu_submission_attachments_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"."fsu_submissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fsu_submission_attachments"
    ADD CONSTRAINT "fsu_submission_attachments_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."fsu_submission_versions"
    ADD CONSTRAINT "fsu_submission_versions_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."fsu_submission_versions"
    ADD CONSTRAINT "fsu_submission_versions_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"."fsu_submissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fsu_submissions"
    ADD CONSTRAINT "fsu_submissions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."fsu_submissions"
    ADD CONSTRAINT "fsu_submissions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."fsu_submissions"
    ADD CONSTRAINT "fsu_submissions_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."fsu_submissions"
    ADD CONSTRAINT "fsu_submissions_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."fsu_validation_actions"
    ADD CONSTRAINT "fsu_validation_actions_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."fsu_validation_actions"
    ADD CONSTRAINT "fsu_validation_actions_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"."fsu_submissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."internal_messages"
    ADD CONSTRAINT "internal_messages_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "public"."internal_messages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."internal_messages"
    ADD CONSTRAINT "internal_messages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."internal_messages"
    ADD CONSTRAINT "internal_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."membres_associes"
    ADD CONSTRAINT "membres_associes_pays_id_fkey" FOREIGN KEY ("pays_id") REFERENCES "public"."countries"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."news_categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."news_gallery_images"
    ADD CONSTRAINT "news_gallery_images_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."news_tags"
    ADD CONSTRAINT "news_tags_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."newsletters"
    ADD CONSTRAINT "newsletters_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."partenaires"
    ADD CONSTRAINT "partenaires_pays_id_fkey" FOREIGN KEY ("pays_id") REFERENCES "public"."countries"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_actors"
    ADD CONSTRAINT "project_actors_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_documents"
    ADD CONSTRAINT "project_documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_images"
    ADD CONSTRAINT "project_images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_project_tags"
    ADD CONSTRAINT "project_project_tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_project_tags"
    ADD CONSTRAINT "project_project_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."project_tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."role_promotions"
    ADD CONSTRAINT "role_promotions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."support_ticket_comments"
    ADD CONSTRAINT "support_ticket_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."support_ticket_comments"
    ADD CONSTRAINT "support_ticket_comments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."training_documents"
    ADD CONSTRAINT "training_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_documents"
    ADD CONSTRAINT "training_documents_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_events"
    ADD CONSTRAINT "training_events_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_registrations"
    ADD CONSTRAINT "training_registrations_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_registrations"
    ADD CONSTRAINT "training_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."validation_workflow_settings"
    ADD CONSTRAINT "validation_workflow_settings_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can manage their country agency" ON "public"."fsu_agencies" USING (((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'super_admin'::"public"."app_role")))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."country_id" = "fsu_agencies"."country_id"))))));



CREATE POLICY "Enable delete for authenticated users on membres_associes" ON "public"."membres_associes" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable delete for authenticated users on partenaires" ON "public"."partenaires" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable full access for service roles on membres_associes" ON "public"."membres_associes" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Enable full access for service roles on partenaires" ON "public"."partenaires" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Enable insert for authenticated users on membres_associes" ON "public"."membres_associes" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable insert for authenticated users on partenaires" ON "public"."partenaires" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable read access for all users to membres_associes" ON "public"."membres_associes" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users to partenaires" ON "public"."partenaires" FOR SELECT USING (true);



CREATE POLICY "Enable update for authenticated users on membres_associes" ON "public"."membres_associes" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable update for authenticated users on partenaires" ON "public"."partenaires" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Public agencies are viewable by everyone" ON "public"."fsu_agencies" FOR SELECT USING (true);



CREATE POLICY "Users can insert messages" ON "public"."internal_messages" FOR INSERT WITH CHECK (("auth"."uid"() = "sender_id"));



CREATE POLICY "Users can update their own messages or mark as read" ON "public"."internal_messages" FOR UPDATE USING ((("auth"."uid"() = "sender_id") OR ("auth"."uid"() = "recipient_id")));



CREATE POLICY "Users can view messages they sent or received" ON "public"."internal_messages" FOR SELECT USING (((("auth"."uid"() = "sender_id") AND ("deleted_at_sender" IS NULL)) OR (("auth"."uid"() = "recipient_id") AND ("deleted_at_recipient" IS NULL))));



CREATE POLICY "admins_can_manage_posts" ON "public"."forum_posts" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "admins_can_manage_topics" ON "public"."forum_topics" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."announcements" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "announcements_manage" ON "public"."announcements" TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "announcements_select_all" ON "public"."announcements" FOR SELECT USING (true);



ALTER TABLE "public"."api_keys" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "api_keys_all_super_admin" ON "public"."api_keys" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "api_keys_select_super_admin" ON "public"."api_keys" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."article_translations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "article_translations_delete_admins" ON "public"."article_translations" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "article_translations"."news_id") AND ((("n"."created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "article_translations_insert_admins" ON "public"."article_translations" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "article_translations"."news_id") AND ((("n"."created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "article_translations_select_anon" ON "public"."article_translations" FOR SELECT TO "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "article_translations"."news_id") AND ("n"."is_public" = true)))));



CREATE POLICY "article_translations_select_users" ON "public"."article_translations" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "article_translations_update_admins" ON "public"."article_translations" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "article_translations"."news_id") AND ((("n"."created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "article_translations"."news_id") AND ((("n"."created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "audit_logs_insert_super_admin" ON "public"."audit_logs" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "audit_logs_select_country_admin" ON "public"."audit_logs" FOR SELECT TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("public"."get_user_country"("user_id") = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "audit_logs_select_super_admin" ON "public"."audit_logs" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "authenticated_can_create_topics" ON "public"."forum_topics" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "authenticated_can_post" ON "public"."forum_posts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "authenticated_can_view_all_tags" ON "public"."document_tags" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "authenticated_can_view_all_topics" ON "public"."forum_topics" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "authenticated_can_view_topic_posts" ON "public"."forum_posts" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "authenticated_users_can_view_all" ON "public"."documents" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "authors_can_update_own_posts" ON "public"."forum_posts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "created_by")) WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "authors_can_update_own_topics" ON "public"."forum_topics" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "created_by")) WITH CHECK (("auth"."uid"() = "created_by"));



ALTER TABLE "public"."cmdt_contributions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "cmdt_contributions_delete_super_admin" ON "public"."cmdt_contributions" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "cmdt_contributions_insert_authenticated" ON "public"."cmdt_contributions" FOR INSERT TO "authenticated" WITH CHECK ((("created_by" = "auth"."uid"()) OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "cmdt_contributions_read_authenticated" ON "public"."cmdt_contributions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "cmdt_contributions_update_authenticated" ON "public"."cmdt_contributions" FOR UPDATE TO "authenticated" USING ((("created_by" = "auth"."uid"()) OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



ALTER TABLE "public"."countries" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "countries_delete_super_admin" ON "public"."countries" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "countries_insert_super_admin" ON "public"."countries" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "countries_select_anon" ON "public"."countries" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "countries_update_super_admin" ON "public"."countries" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."document_comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "document_comments_delete_own" ON "public"."document_comments" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "document_comments_insert_authenticated" ON "public"."document_comments" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "document_comments_select_all" ON "public"."document_comments" FOR SELECT USING (true);



CREATE POLICY "document_comments_update_own" ON "public"."document_comments" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."document_permissions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "document_permissions_delete_admin" ON "public"."document_permissions" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("document_permissions"."role" = ANY (ARRAY['super_admin'::"text", 'country_admin'::"text"]))))));



CREATE POLICY "document_permissions_insert_admin" ON "public"."document_permissions" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("document_permissions"."role" = ANY (ARRAY['super_admin'::"text", 'country_admin'::"text"]))))));



CREATE POLICY "document_permissions_select_authenticated" ON "public"."document_permissions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "document_permissions_update_admin" ON "public"."document_permissions" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("document_permissions"."role" = ANY (ARRAY['super_admin'::"text", 'country_admin'::"text"]))))));



ALTER TABLE "public"."document_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."document_versions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "document_versions_insert" ON "public"."document_versions" FOR INSERT TO "authenticated" WITH CHECK (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



CREATE POLICY "document_versions_insert_authenticated" ON "public"."document_versions" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."documents"
  WHERE ("documents"."id" = "document_versions"."document_id"))));



CREATE POLICY "document_versions_select" ON "public"."document_versions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "document_versions_select_authenticated" ON "public"."document_versions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "document_versions_select_public" ON "public"."document_versions" FOR SELECT TO "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."documents"
  WHERE (("documents"."id" = "document_versions"."document_id") AND ("documents"."is_public" = true)))));



ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "documents_update_authenticated" ON "public"."documents" FOR UPDATE TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM "public"."document_permissions"
  WHERE (("document_permissions"."document_id" = "document_permissions"."id") AND ("document_permissions"."user_id" = "auth"."uid"()) AND ("document_permissions"."role" = ANY (ARRAY['editor'::"text", 'admin'::"text"]))))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE ((("profiles"."id" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role"))))));



ALTER TABLE "public"."event_registrations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "event_registrations_insert_own" ON "public"."event_registrations" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "event_registrations_read" ON "public"."event_registrations" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "event_registrations_update" ON "public"."event_registrations" FOR UPDATE TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



ALTER TABLE "public"."event_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "event_tags_delete_from_events" ON "public"."event_tags" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "event_tags"."event_id") AND (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("e"."country_id" = "public"."get_user_country"("auth"."uid"()))) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "event_tags_insert_from_events" ON "public"."event_tags" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "event_tags"."event_id") AND (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("e"."country_id" = "public"."get_user_country"("auth"."uid"()))) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "event_tags_select_anon" ON "public"."event_tags" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "events_delete_super_admin" ON "public"."events" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "events_insert_country_admin" ON "public"."events" FOR INSERT TO "authenticated" WITH CHECK ((("created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "events_insert_super_admin" ON "public"."events" FOR INSERT TO "authenticated" WITH CHECK ((("created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



CREATE POLICY "events_manage" ON "public"."training_events" TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "events_select_all" ON "public"."training_events" FOR SELECT USING (true);



CREATE POLICY "events_select_anon" ON "public"."events" FOR SELECT TO "authenticated", "anon" USING (("is_public" = true));



CREATE POLICY "events_select_super_admin" ON "public"."events" FOR SELECT TO "authenticated", "anon" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "events_update_country_admin" ON "public"."events" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"())))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "events_update_super_admin" ON "public"."events" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."faq_articles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "faq_articles_delete_super_admin" ON "public"."faq_articles" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'super_admin'::"public"."app_role")))));



CREATE POLICY "faq_articles_insert_admin" ON "public"."faq_articles" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = ANY (ARRAY['country_admin'::"public"."app_role", 'super_admin'::"public"."app_role"]))))));



CREATE POLICY "faq_articles_select_authenticated_all" ON "public"."faq_articles" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = ANY (ARRAY['country_admin'::"public"."app_role", 'super_admin'::"public"."app_role"]))))));



CREATE POLICY "faq_articles_select_public_published" ON "public"."faq_articles" FOR SELECT TO "authenticated", "anon" USING (("is_published" = true));



CREATE POLICY "faq_articles_update_admin" ON "public"."faq_articles" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = ANY (ARRAY['country_admin'::"public"."app_role", 'super_admin'::"public"."app_role"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = ANY (ARRAY['country_admin'::"public"."app_role", 'super_admin'::"public"."app_role"]))))));



ALTER TABLE "public"."forum_categories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "forum_categories_select_anon" ON "public"."forum_categories" FOR SELECT TO "anon" USING (true);



CREATE POLICY "forum_categories_select_authenticated" ON "public"."forum_categories" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."forum_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forum_reports" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "forum_reports_insert_authenticated" ON "public"."forum_reports" FOR INSERT TO "authenticated" WITH CHECK (("reporter_id" = "auth"."uid"()));



CREATE POLICY "forum_reports_select_country_admin" ON "public"."forum_reports" FOR SELECT TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("public"."get_user_country"("reporter_id") = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "forum_reports_select_own" ON "public"."forum_reports" FOR SELECT TO "authenticated" USING (("reporter_id" = "auth"."uid"()));



CREATE POLICY "forum_reports_select_super_admin" ON "public"."forum_reports" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "forum_reports_update_country_admin" ON "public"."forum_reports" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("public"."get_user_country"("reporter_id") = "public"."get_user_country"("auth"."uid"())))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("public"."get_user_country"("reporter_id") = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "forum_reports_update_super_admin" ON "public"."forum_reports" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."forum_topic_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "forum_topic_tags_delete_super_admin" ON "public"."forum_topic_tags" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."forum_topics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fsu_agencies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fsu_submission_attachments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "fsu_submission_attachments_delete_point_focal_draft" ON "public"."fsu_submission_attachments" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."fsu_submissions" "s"
  WHERE (("s"."id" = "fsu_submission_attachments"."submission_id") AND ("s"."submitted_by" = "auth"."uid"()) AND ("s"."status" = 'draft'::"public"."submission_status")))));



CREATE POLICY "fsu_submission_attachments_delete_super_admin" ON "public"."fsu_submission_attachments" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "fsu_submission_attachments_insert_point_focal_draft" ON "public"."fsu_submission_attachments" FOR INSERT TO "authenticated" WITH CHECK ((("uploaded_by" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."fsu_submissions" "s"
  WHERE (("s"."id" = "fsu_submission_attachments"."submission_id") AND ("s"."submitted_by" = "auth"."uid"()) AND ("s"."status" = 'draft'::"public"."submission_status"))))));



CREATE POLICY "fsu_submission_attachments_select_country_admin" ON "public"."fsu_submission_attachments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."fsu_submissions" "s"
  WHERE (("s"."id" = "fsu_submission_attachments"."submission_id") AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("s"."country_id" = "public"."get_user_country"("auth"."uid"()))))));



CREATE POLICY "fsu_submission_attachments_select_point_focal_own" ON "public"."fsu_submission_attachments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."fsu_submissions" "s"
  WHERE (("s"."id" = "fsu_submission_attachments"."submission_id") AND ("s"."submitted_by" = "auth"."uid"())))));



CREATE POLICY "fsu_submission_attachments_select_super_admin" ON "public"."fsu_submission_attachments" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."fsu_submission_versions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "fsu_submission_versions_insert_point_focal_own" ON "public"."fsu_submission_versions" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."fsu_submissions" "s"
  WHERE (("s"."id" = "fsu_submission_versions"."submission_id") AND ("s"."submitted_by" = "auth"."uid"())))));



CREATE POLICY "fsu_submission_versions_insert_super_admin" ON "public"."fsu_submission_versions" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "fsu_submission_versions_select_country_admin" ON "public"."fsu_submission_versions" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."fsu_submissions" "s"
  WHERE (("s"."id" = "fsu_submission_versions"."submission_id") AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("s"."country_id" = "public"."get_user_country"("auth"."uid"()))))));



CREATE POLICY "fsu_submission_versions_select_point_focal_own" ON "public"."fsu_submission_versions" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."fsu_submissions" "s"
  WHERE (("s"."id" = "fsu_submission_versions"."submission_id") AND ("s"."submitted_by" = "auth"."uid"())))));



CREATE POLICY "fsu_submission_versions_select_super_admin" ON "public"."fsu_submission_versions" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."fsu_submissions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "fsu_submissions_delete_point_focal_draft" ON "public"."fsu_submissions" FOR DELETE TO "authenticated" USING ((("submitted_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role") AND ("status" = 'draft'::"public"."submission_status")));



CREATE POLICY "fsu_submissions_delete_super_admin" ON "public"."fsu_submissions" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "fsu_submissions_insert_point_focal" ON "public"."fsu_submissions" FOR INSERT TO "authenticated" WITH CHECK ((("submitted_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "fsu_submissions_select_country_admin" ON "public"."fsu_submissions" FOR SELECT TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "fsu_submissions_select_point_focal_own" ON "public"."fsu_submissions" FOR SELECT TO "authenticated" USING ((("submitted_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role")));



CREATE POLICY "fsu_submissions_select_super_admin" ON "public"."fsu_submissions" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "fsu_submissions_update_country_admin" ON "public"."fsu_submissions" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"())))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "fsu_submissions_update_point_focal_draft" ON "public"."fsu_submissions" FOR UPDATE TO "authenticated" USING ((("submitted_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role") AND ("status" = 'draft'::"public"."submission_status"))) WITH CHECK ((("submitted_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role")));



CREATE POLICY "fsu_submissions_update_super_admin" ON "public"."fsu_submissions" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."fsu_validation_actions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "fsu_validation_actions_insert_country_admin" ON "public"."fsu_validation_actions" FOR INSERT TO "authenticated" WITH CHECK ((("performed_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND (EXISTS ( SELECT 1
   FROM "public"."fsu_submissions" "s"
  WHERE (("s"."id" = "fsu_validation_actions"."submission_id") AND ("s"."country_id" = "public"."get_user_country"("auth"."uid"())))))));



CREATE POLICY "fsu_validation_actions_insert_super_admin" ON "public"."fsu_validation_actions" FOR INSERT TO "authenticated" WITH CHECK ((("performed_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



CREATE POLICY "fsu_validation_actions_select_author" ON "public"."fsu_validation_actions" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."fsu_submissions" "s"
  WHERE (("s"."id" = "fsu_validation_actions"."submission_id") AND ("s"."submitted_by" = "auth"."uid"())))));



CREATE POLICY "fsu_validation_actions_select_country_admin" ON "public"."fsu_validation_actions" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."fsu_submissions" "s"
  WHERE (("s"."id" = "fsu_validation_actions"."submission_id") AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("s"."country_id" = "public"."get_user_country"("auth"."uid"()))))));



CREATE POLICY "fsu_validation_actions_select_super_admin" ON "public"."fsu_validation_actions" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."internal_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invitations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "invitations_delete_super_admin" ON "public"."invitations" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "invitations_insert_country_admin" ON "public"."invitations" FOR INSERT TO "authenticated" WITH CHECK ((("invited_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"())) AND ("role" = 'point_focal'::"public"."app_role")));



CREATE POLICY "invitations_insert_super_admin" ON "public"."invitations" FOR INSERT TO "authenticated" WITH CHECK ((("invited_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



CREATE POLICY "invitations_select_country_admin" ON "public"."invitations" FOR SELECT TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "invitations_select_super_admin" ON "public"."invitations" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "invitations_update_super_admin" ON "public"."invitations" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."ip_restrictions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "ip_restrictions_all_super_admin" ON "public"."ip_restrictions" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "ip_restrictions_select_super_admin" ON "public"."ip_restrictions" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."membres_associes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mfa_challenges" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "mfa_challenges_delete_own" ON "public"."mfa_challenges" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "mfa_challenges_insert_own" ON "public"."mfa_challenges" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "mfa_challenges_select_own" ON "public"."mfa_challenges" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "mfa_challenges_update_own" ON "public"."mfa_challenges" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."news" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."news_categories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "news_categories_delete_admins" ON "public"."news_categories" FOR DELETE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "news_categories_insert_admins" ON "public"."news_categories" FOR INSERT TO "authenticated" WITH CHECK (("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "news_categories_select_all" ON "public"."news_categories" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "news_categories_select_anon" ON "public"."news_categories" FOR SELECT TO "anon" USING (("is_active" = true));



CREATE POLICY "news_categories_update_admins" ON "public"."news_categories" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role"))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "news_delete_super_admin" ON "public"."news" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."news_gallery_images" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "news_gallery_images_delete_admins" ON "public"."news_gallery_images" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "news_gallery_images"."news_id") AND ((("n"."created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "news_gallery_images_insert_admins" ON "public"."news_gallery_images" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "news_gallery_images"."news_id") AND ((("n"."created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "news_gallery_images_select_anon" ON "public"."news_gallery_images" FOR SELECT TO "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "news_gallery_images"."news_id") AND ("n"."is_public" = true)))));



CREATE POLICY "news_gallery_images_select_users" ON "public"."news_gallery_images" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "news_gallery_images_update_admins" ON "public"."news_gallery_images" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "news_gallery_images"."news_id") AND ((("n"."created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "news_gallery_images"."news_id") AND ((("n"."created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "news_insert_country_admin" ON "public"."news" FOR INSERT TO "authenticated" WITH CHECK ((("created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND (("category_id" IS NULL) OR (EXISTS ( SELECT 1
   FROM "public"."news_categories" "nc"
  WHERE ("nc"."id" = "news"."category_id"))))));



CREATE POLICY "news_insert_super_admin" ON "public"."news" FOR INSERT TO "authenticated" WITH CHECK ((("created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") AND (("category_id" IS NULL) OR (EXISTS ( SELECT 1
   FROM "public"."news_categories" "nc"
  WHERE ("nc"."id" = "news"."category_id"))))));



CREATE POLICY "news_select_anon" ON "public"."news" FOR SELECT TO "authenticated", "anon" USING ((("is_public" = true) AND ("status" = 'published'::"public"."news_status")));



CREATE POLICY "news_select_country_admin_own" ON "public"."news" FOR SELECT TO "authenticated" USING ((("created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "news_select_super_admin" ON "public"."news" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."news_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "news_tags_delete_admins" ON "public"."news_tags" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "news_tags"."news_id") AND ((("n"."created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "news_tags_insert_admins" ON "public"."news_tags" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."news" "n"
  WHERE (("n"."id" = "news_tags"."news_id") AND ((("n"."created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "news_tags_select_anon" ON "public"."news_tags" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "news_update_country_admin_own" ON "public"."news" FOR UPDATE TO "authenticated" USING ((("created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role"))) WITH CHECK ((("created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "news_update_super_admin" ON "public"."news" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."newsletters" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "newsletters_delete_super_admin" ON "public"."newsletters" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "newsletters_insert_super_admin" ON "public"."newsletters" FOR INSERT TO "authenticated" WITH CHECK ((("created_by" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



CREATE POLICY "newsletters_select_super_admin" ON "public"."newsletters" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "newsletters_select_targeted" ON "public"."newsletters" FOR SELECT TO "authenticated" USING ((("is_published" = true) AND (EXISTS ( SELECT 1
   FROM "public"."user_roles" "ur"
  WHERE (("ur"."user_id" = "auth"."uid"()) AND ("ur"."role" = ANY ("newsletters"."target_roles")))))));



CREATE POLICY "newsletters_update_super_admin" ON "public"."newsletters" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "notifications_delete_own" ON "public"."notifications" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "notifications_delete_super_admin" ON "public"."notifications" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "notifications_insert_super_admin" ON "public"."notifications" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "notifications_select_own" ON "public"."notifications" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "notifications_update_own" ON "public"."notifications" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "only_admins_can_delete" ON "public"."document_tags" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "only_admins_can_delete" ON "public"."documents" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "only_admins_can_insert" ON "public"."document_tags" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "only_admins_can_insert" ON "public"."documents" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "only_admins_can_update" ON "public"."documents" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."partenaires" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."platform_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "platform_settings_delete_super_admin" ON "public"."platform_settings" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "platform_settings_insert_super_admin" ON "public"."platform_settings" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "platform_settings_select_country_admin" ON "public"."platform_settings" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role"));



CREATE POLICY "platform_settings_select_super_admin" ON "public"."platform_settings" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "platform_settings_update_super_admin" ON "public"."platform_settings" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_insert_own" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "profiles_select_country_admin" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "profiles_select_super_admin" ON "public"."profiles" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "profiles_update_country_admin" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"())))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "profiles_update_super_admin" ON "public"."profiles" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."project_actors" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "project_actors_delete_admins" ON "public"."project_actors" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."projects" "p"
  WHERE (("p"."id" = "project_actors"."project_id") AND (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("p"."country_id" = "public"."get_user_country"("auth"."uid"()))) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "project_actors_insert_admins" ON "public"."project_actors" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."projects" "p"
  WHERE (("p"."id" = "project_actors"."project_id") AND ("public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "project_actors_select_anon" ON "public"."project_actors" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."project_documents" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "project_documents_delete_admins" ON "public"."project_documents" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."projects" "p"
  WHERE (("p"."id" = "project_documents"."project_id") AND (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("p"."country_id" = "public"."get_user_country"("auth"."uid"()))) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "project_documents_insert_admins" ON "public"."project_documents" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."projects" "p"
  WHERE (("p"."id" = "project_documents"."project_id") AND ("public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "project_documents_select_anon" ON "public"."project_documents" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."project_images" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "project_images_delete_admins" ON "public"."project_images" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."projects" "p"
  WHERE (("p"."id" = "project_images"."project_id") AND (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("p"."country_id" = "public"."get_user_country"("auth"."uid"()))) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "project_images_insert_admins" ON "public"."project_images" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."projects" "p"
  WHERE (("p"."id" = "project_images"."project_id") AND (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("p"."country_id" = "public"."get_user_country"("auth"."uid"()))) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "project_images_select_anon" ON "public"."project_images" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."project_project_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "project_project_tags_insert_admins" ON "public"."project_project_tags" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."projects" "p"
  WHERE (("p"."id" = "project_project_tags"."project_id") AND ("public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"))))));



CREATE POLICY "project_project_tags_select_anon" ON "public"."project_project_tags" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."project_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "project_tags_insert_admins" ON "public"."project_tags" FOR INSERT TO "authenticated" WITH CHECK (("public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



CREATE POLICY "project_tags_select_anon" ON "public"."project_tags" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "projects_delete_point_focal" ON "public"."projects" FOR DELETE TO "authenticated" USING ((("public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role") AND ("created_by" = "auth"."uid"()) AND ("status" = 'draft'::"public"."project_status")) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



CREATE POLICY "projects_delete_super_admin" ON "public"."projects" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "projects_insert_admins" ON "public"."projects" FOR INSERT TO "authenticated" WITH CHECK (("public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



CREATE POLICY "projects_select_authenticated" ON "public"."projects" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "projects_select_public" ON "public"."projects" FOR SELECT TO "anon" USING (true);



CREATE POLICY "projects_update_admins" ON "public"."projects" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'point_focal'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



CREATE POLICY "public_document_tags_are_readable" ON "public"."document_tags" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."documents"
  WHERE (("documents"."id" = "document_tags"."document_id") AND ("documents"."is_public" = true)))));



CREATE POLICY "public_documents_are_readable" ON "public"."documents" FOR SELECT USING (("is_public" = true));



CREATE POLICY "public_posts_are_readable" ON "public"."forum_posts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."forum_topics"
  WHERE (("forum_topics"."id" = "forum_posts"."topic_id") AND ("forum_topics"."is_public" = true)))));



CREATE POLICY "public_topics_are_readable" ON "public"."forum_topics" FOR SELECT USING (("is_public" = true));



ALTER TABLE "public"."quarterly_reports" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "quarterly_reports_all_super_admin" ON "public"."quarterly_reports" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "quarterly_reports_select_admin" ON "public"."quarterly_reports" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = ANY (ARRAY['country_admin'::"public"."app_role", 'super_admin'::"public"."app_role"]))))));



CREATE POLICY "registrations_insert_own" ON "public"."training_registrations" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "registrations_select_own" ON "public"."training_registrations" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "registrations_update_admin" ON "public"."training_registrations" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



ALTER TABLE "public"."role_promotions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."submission_periods" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "submission_periods_delete_super_admin" ON "public"."submission_periods" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "submission_periods_insert_super_admin" ON "public"."submission_periods" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "submission_periods_select_authenticated" ON "public"."submission_periods" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "submission_periods_update_super_admin" ON "public"."submission_periods" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."support_ticket_comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "support_ticket_comments_insert_country_admin" ON "public"."support_ticket_comments" FOR INSERT TO "authenticated" WITH CHECK ((("author_id" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND (EXISTS ( SELECT 1
   FROM "public"."support_tickets" "t"
  WHERE (("t"."id" = "support_ticket_comments"."ticket_id") AND ("public"."get_user_country"("t"."created_by") = "public"."get_user_country"("auth"."uid"())))))));



CREATE POLICY "support_ticket_comments_insert_own" ON "public"."support_ticket_comments" FOR INSERT TO "authenticated" WITH CHECK ((("author_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."support_tickets" "t"
  WHERE (("t"."id" = "support_ticket_comments"."ticket_id") AND ("t"."created_by" = "auth"."uid"()))))));



CREATE POLICY "support_ticket_comments_insert_super_admin" ON "public"."support_ticket_comments" FOR INSERT TO "authenticated" WITH CHECK ((("author_id" = "auth"."uid"()) AND "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")));



CREATE POLICY "support_ticket_comments_select_country_admin" ON "public"."support_ticket_comments" FOR SELECT TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND (EXISTS ( SELECT 1
   FROM "public"."support_tickets" "t"
  WHERE (("t"."id" = "support_ticket_comments"."ticket_id") AND ("public"."get_user_country"("t"."created_by") = "public"."get_user_country"("auth"."uid"())))))));



CREATE POLICY "support_ticket_comments_select_own" ON "public"."support_ticket_comments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."support_tickets" "t"
  WHERE (("t"."id" = "support_ticket_comments"."ticket_id") AND ("t"."created_by" = "auth"."uid"())))));



CREATE POLICY "support_ticket_comments_select_super_admin" ON "public"."support_ticket_comments" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."support_tickets" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "support_tickets_delete_super_admin" ON "public"."support_tickets" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "support_tickets_insert_authenticated" ON "public"."support_tickets" FOR INSERT TO "authenticated" WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "support_tickets_select_country_admin" ON "public"."support_tickets" FOR SELECT TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("public"."get_user_country"("created_by") = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "support_tickets_select_own" ON "public"."support_tickets" FOR SELECT TO "authenticated" USING (("created_by" = "auth"."uid"()));



CREATE POLICY "support_tickets_select_super_admin" ON "public"."support_tickets" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "support_tickets_update_country_admin" ON "public"."support_tickets" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("public"."get_user_country"("created_by") = "public"."get_user_country"("auth"."uid"())))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("public"."get_user_country"("created_by") = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "support_tickets_update_own" ON "public"."support_tickets" FOR UPDATE TO "authenticated" USING (("created_by" = "auth"."uid"())) WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "support_tickets_update_super_admin" ON "public"."support_tickets" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "topic_authors_can_mark_solution" ON "public"."forum_posts" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."forum_topics" "t"
  WHERE (("t"."id" = "forum_posts"."topic_id") AND ("t"."created_by" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."forum_topics" "t"
  WHERE (("t"."id" = "forum_posts"."topic_id") AND ("t"."created_by" = "auth"."uid"())))));



CREATE POLICY "training_docs_manage" ON "public"."training_documents" TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "training_docs_select" ON "public"."training_documents" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."training_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."training_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."training_registrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trainings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "trainings_delete_admin" ON "public"."trainings" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "trainings_insert_admin" ON "public"."trainings" FOR INSERT TO "authenticated" WITH CHECK (("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "trainings_select_all" ON "public"."trainings" FOR SELECT USING ((("status" = 'published'::"text") OR "public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



CREATE POLICY "trainings_update_admin" ON "public"."trainings" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role")));



ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_roles_delete_country_admin" ON "public"."user_roles" FOR DELETE TO "authenticated" USING ((("public"."get_user_country"("user_id") IS NOT NULL) AND ("public"."get_user_country"("user_id") = "public"."get_user_country"("auth"."uid"())) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("role" <> ALL (ARRAY['super_admin'::"public"."app_role", 'country_admin'::"public"."app_role"]))));



CREATE POLICY "user_roles_delete_super_admin" ON "public"."user_roles" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "user_roles_insert_country_admin" ON "public"."user_roles" FOR INSERT TO "authenticated" WITH CHECK ((("public"."get_user_country"("user_id") IS NOT NULL) AND ("public"."get_user_country"("user_id") = "public"."get_user_country"("auth"."uid"())) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("role" <> ALL (ARRAY['super_admin'::"public"."app_role", 'country_admin'::"public"."app_role"]))));



CREATE POLICY "user_roles_insert_super_admin" ON "public"."user_roles" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "user_roles_select_country_admin" ON "public"."user_roles" FOR SELECT TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("public"."get_user_country"("user_id") = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "user_roles_select_own" ON "public"."user_roles" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "user_roles_select_super_admin" ON "public"."user_roles" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "user_roles_update_country_admin" ON "public"."user_roles" FOR UPDATE TO "authenticated" USING ((("public"."get_user_country"("user_id") IS NOT NULL) AND ("public"."get_user_country"("user_id") = "public"."get_user_country"("auth"."uid"())) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("role" <> ALL (ARRAY['super_admin'::"public"."app_role", 'country_admin'::"public"."app_role"])))) WITH CHECK ((("public"."get_user_country"("user_id") IS NOT NULL) AND ("public"."get_user_country"("user_id") = "public"."get_user_country"("auth"."uid"())) AND "public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("role" <> ALL (ARRAY['super_admin'::"public"."app_role", 'country_admin'::"public"."app_role"]))));



CREATE POLICY "user_roles_update_super_admin" ON "public"."user_roles" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



ALTER TABLE "public"."validation_workflow_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "validation_workflow_settings_delete_super_admin" ON "public"."validation_workflow_settings" FOR DELETE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "validation_workflow_settings_insert_super_admin" ON "public"."validation_workflow_settings" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "validation_workflow_settings_select_country_admin" ON "public"."validation_workflow_settings" FOR SELECT TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "validation_workflow_settings_select_super_admin" ON "public"."validation_workflow_settings" FOR SELECT TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));



CREATE POLICY "validation_workflow_settings_update_country_admin" ON "public"."validation_workflow_settings" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"())))) WITH CHECK (("public"."has_role"("auth"."uid"(), 'country_admin'::"public"."app_role") AND ("country_id" = "public"."get_user_country"("auth"."uid"()))));



CREATE POLICY "validation_workflow_settings_update_super_admin" ON "public"."validation_workflow_settings" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'super_admin'::"public"."app_role"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."document_comments";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."document_permissions";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."document_versions";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."documents";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."fsu_submissions";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."fsu_validation_actions";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notifications";



REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."accept_invitation"("_token" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."accept_invitation"("_token" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."accept_invitation"("_token" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."assign_default_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."assign_default_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."assign_default_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_document_lock"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_document_lock"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_document_lock"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_old_category_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_old_category_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_old_category_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_article_gallery_bucket"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_article_gallery_bucket"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_article_gallery_bucket"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_article_images_bucket"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_article_images_bucket"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_article_images_bucket"() TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_auto_translate_jsonb"("p_field_value" "jsonb", "p_source_lang" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_auto_translate_jsonb"("p_field_value" "jsonb", "p_source_lang" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_auto_translate_jsonb"("p_field_value" "jsonb", "p_source_lang" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_libretranslate"("p_text" "text", "p_source_lang" "text", "p_target_lang" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_libretranslate"("p_text" "text", "p_source_lang" "text", "p_target_lang" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_libretranslate"("p_text" "text", "p_source_lang" "text", "p_target_lang" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_mfa_code"("_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_mfa_code"("_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_mfa_code"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_country"("_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_country"("_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_country"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_internal_messages_translation"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_internal_messages_translation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_internal_messages_translation"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_internal_messages_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_internal_messages_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_internal_messages_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_news_translation_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_news_translation_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_news_translation_trigger"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_translation_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_translation_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_translation_trigger"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") TO "anon";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_forum_topic_views"("topic_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_forum_topic_views"("topic_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_forum_topic_views"("topic_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."migrate_existing_news_categories"() TO "anon";
GRANT ALL ON FUNCTION "public"."migrate_existing_news_categories"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."migrate_existing_news_categories"() TO "service_role";



GRANT ALL ON FUNCTION "public"."migrate_news_category"() TO "anon";
GRANT ALL ON FUNCTION "public"."migrate_news_category"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."migrate_news_category"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_document_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_document_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_document_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_on_forum_topic"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_on_forum_topic"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_on_forum_topic"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_on_fsu_submitted"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_on_fsu_submitted"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_on_fsu_submitted"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_on_role_promotion"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_on_role_promotion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_on_role_promotion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_on_ticket_comment"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_on_ticket_comment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_on_ticket_comment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_on_ticket_status_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_on_ticket_status_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_on_ticket_status_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."unlock_expired_documents"() TO "anon";
GRANT ALL ON FUNCTION "public"."unlock_expired_documents"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."unlock_expired_documents"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."verify_mfa_code"("_user_id" "uuid", "_code" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."verify_mfa_code"("_user_id" "uuid", "_code" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_mfa_code"("_user_id" "uuid", "_code" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."announcements" TO "anon";
GRANT ALL ON TABLE "public"."announcements" TO "authenticated";
GRANT ALL ON TABLE "public"."announcements" TO "service_role";



GRANT ALL ON TABLE "public"."api_keys" TO "anon";
GRANT ALL ON TABLE "public"."api_keys" TO "authenticated";
GRANT ALL ON TABLE "public"."api_keys" TO "service_role";



GRANT ALL ON TABLE "public"."article_translations" TO "anon";
GRANT ALL ON TABLE "public"."article_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."article_translations" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."cmdt_contributions" TO "anon";
GRANT ALL ON TABLE "public"."cmdt_contributions" TO "authenticated";
GRANT ALL ON TABLE "public"."cmdt_contributions" TO "service_role";



GRANT ALL ON TABLE "public"."countries" TO "anon";
GRANT ALL ON TABLE "public"."countries" TO "authenticated";
GRANT ALL ON TABLE "public"."countries" TO "service_role";



GRANT ALL ON TABLE "public"."document_comments" TO "anon";
GRANT ALL ON TABLE "public"."document_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."document_comments" TO "service_role";



GRANT ALL ON TABLE "public"."document_permissions" TO "anon";
GRANT ALL ON TABLE "public"."document_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."document_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."document_tags" TO "anon";
GRANT ALL ON TABLE "public"."document_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."document_tags" TO "service_role";



GRANT ALL ON TABLE "public"."document_versions" TO "anon";
GRANT ALL ON TABLE "public"."document_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."document_versions" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."event_registrations" TO "anon";
GRANT ALL ON TABLE "public"."event_registrations" TO "authenticated";
GRANT ALL ON TABLE "public"."event_registrations" TO "service_role";



GRANT ALL ON TABLE "public"."event_tags" TO "anon";
GRANT ALL ON TABLE "public"."event_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."event_tags" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."faq_articles" TO "anon";
GRANT ALL ON TABLE "public"."faq_articles" TO "authenticated";
GRANT ALL ON TABLE "public"."faq_articles" TO "service_role";



GRANT ALL ON TABLE "public"."forum_categories" TO "anon";
GRANT ALL ON TABLE "public"."forum_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_categories" TO "service_role";



GRANT ALL ON TABLE "public"."forum_posts" TO "anon";
GRANT ALL ON TABLE "public"."forum_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_posts" TO "service_role";



GRANT ALL ON TABLE "public"."forum_reports" TO "anon";
GRANT ALL ON TABLE "public"."forum_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_reports" TO "service_role";



GRANT ALL ON TABLE "public"."forum_topic_tags" TO "anon";
GRANT ALL ON TABLE "public"."forum_topic_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_topic_tags" TO "service_role";



GRANT ALL ON TABLE "public"."forum_topics" TO "anon";
GRANT ALL ON TABLE "public"."forum_topics" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_topics" TO "service_role";



GRANT ALL ON TABLE "public"."fsu_agencies" TO "anon";
GRANT ALL ON TABLE "public"."fsu_agencies" TO "authenticated";
GRANT ALL ON TABLE "public"."fsu_agencies" TO "service_role";



GRANT ALL ON TABLE "public"."fsu_submission_attachments" TO "anon";
GRANT ALL ON TABLE "public"."fsu_submission_attachments" TO "authenticated";
GRANT ALL ON TABLE "public"."fsu_submission_attachments" TO "service_role";



GRANT ALL ON TABLE "public"."fsu_submission_versions" TO "anon";
GRANT ALL ON TABLE "public"."fsu_submission_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."fsu_submission_versions" TO "service_role";



GRANT ALL ON TABLE "public"."fsu_submissions" TO "anon";
GRANT ALL ON TABLE "public"."fsu_submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."fsu_submissions" TO "service_role";



GRANT ALL ON TABLE "public"."fsu_validation_actions" TO "anon";
GRANT ALL ON TABLE "public"."fsu_validation_actions" TO "authenticated";
GRANT ALL ON TABLE "public"."fsu_validation_actions" TO "service_role";



GRANT ALL ON TABLE "public"."internal_messages" TO "anon";
GRANT ALL ON TABLE "public"."internal_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."internal_messages" TO "service_role";



GRANT ALL ON TABLE "public"."invitations" TO "anon";
GRANT ALL ON TABLE "public"."invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."invitations" TO "service_role";



GRANT ALL ON TABLE "public"."ip_restrictions" TO "anon";
GRANT ALL ON TABLE "public"."ip_restrictions" TO "authenticated";
GRANT ALL ON TABLE "public"."ip_restrictions" TO "service_role";



GRANT ALL ON TABLE "public"."membres_associes" TO "anon";
GRANT ALL ON TABLE "public"."membres_associes" TO "authenticated";
GRANT ALL ON TABLE "public"."membres_associes" TO "service_role";



GRANT ALL ON TABLE "public"."mfa_challenges" TO "anon";
GRANT ALL ON TABLE "public"."mfa_challenges" TO "authenticated";
GRANT ALL ON TABLE "public"."mfa_challenges" TO "service_role";



GRANT ALL ON TABLE "public"."news" TO "anon";
GRANT ALL ON TABLE "public"."news" TO "authenticated";
GRANT ALL ON TABLE "public"."news" TO "service_role";



GRANT ALL ON TABLE "public"."news_categories" TO "anon";
GRANT ALL ON TABLE "public"."news_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."news_categories" TO "service_role";



GRANT ALL ON TABLE "public"."news_gallery_images" TO "anon";
GRANT ALL ON TABLE "public"."news_gallery_images" TO "authenticated";
GRANT ALL ON TABLE "public"."news_gallery_images" TO "service_role";



GRANT ALL ON TABLE "public"."news_tags" TO "anon";
GRANT ALL ON TABLE "public"."news_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."news_tags" TO "service_role";



GRANT ALL ON TABLE "public"."newsletters" TO "anon";
GRANT ALL ON TABLE "public"."newsletters" TO "authenticated";
GRANT ALL ON TABLE "public"."newsletters" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."partenaires" TO "anon";
GRANT ALL ON TABLE "public"."partenaires" TO "authenticated";
GRANT ALL ON TABLE "public"."partenaires" TO "service_role";



GRANT ALL ON TABLE "public"."platform_settings" TO "anon";
GRANT ALL ON TABLE "public"."platform_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."platform_settings" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."project_actors" TO "anon";
GRANT ALL ON TABLE "public"."project_actors" TO "authenticated";
GRANT ALL ON TABLE "public"."project_actors" TO "service_role";



GRANT ALL ON TABLE "public"."project_documents" TO "anon";
GRANT ALL ON TABLE "public"."project_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."project_documents" TO "service_role";



GRANT ALL ON TABLE "public"."project_images" TO "anon";
GRANT ALL ON TABLE "public"."project_images" TO "authenticated";
GRANT ALL ON TABLE "public"."project_images" TO "service_role";



GRANT ALL ON TABLE "public"."project_project_tags" TO "anon";
GRANT ALL ON TABLE "public"."project_project_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."project_project_tags" TO "service_role";



GRANT ALL ON TABLE "public"."project_tags" TO "anon";
GRANT ALL ON TABLE "public"."project_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."project_tags" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."quarterly_reports" TO "anon";
GRANT ALL ON TABLE "public"."quarterly_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."quarterly_reports" TO "service_role";



GRANT ALL ON TABLE "public"."role_promotions" TO "anon";
GRANT ALL ON TABLE "public"."role_promotions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_promotions" TO "service_role";



GRANT ALL ON TABLE "public"."submission_periods" TO "anon";
GRANT ALL ON TABLE "public"."submission_periods" TO "authenticated";
GRANT ALL ON TABLE "public"."submission_periods" TO "service_role";



GRANT ALL ON TABLE "public"."support_ticket_comments" TO "anon";
GRANT ALL ON TABLE "public"."support_ticket_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."support_ticket_comments" TO "service_role";



GRANT ALL ON TABLE "public"."support_tickets" TO "anon";
GRANT ALL ON TABLE "public"."support_tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."support_tickets" TO "service_role";



GRANT ALL ON TABLE "public"."training_documents" TO "anon";
GRANT ALL ON TABLE "public"."training_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."training_documents" TO "service_role";



GRANT ALL ON TABLE "public"."training_events" TO "anon";
GRANT ALL ON TABLE "public"."training_events" TO "authenticated";
GRANT ALL ON TABLE "public"."training_events" TO "service_role";



GRANT ALL ON TABLE "public"."training_registrations" TO "anon";
GRANT ALL ON TABLE "public"."training_registrations" TO "authenticated";
GRANT ALL ON TABLE "public"."training_registrations" TO "service_role";



GRANT ALL ON TABLE "public"."trainings" TO "anon";
GRANT ALL ON TABLE "public"."trainings" TO "authenticated";
GRANT ALL ON TABLE "public"."trainings" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."validation_workflow_settings" TO "anon";
GRANT ALL ON TABLE "public"."validation_workflow_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."validation_workflow_settings" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";




























