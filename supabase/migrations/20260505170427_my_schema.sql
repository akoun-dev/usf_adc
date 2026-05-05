alter table "public"."membres_associes" enable row level security;

alter table "public"."partenaires" enable row level security;

alter table "public"."role_promotions" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_internal_messages_translation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
        $function$
;

CREATE OR REPLACE FUNCTION public.handle_internal_messages_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;


