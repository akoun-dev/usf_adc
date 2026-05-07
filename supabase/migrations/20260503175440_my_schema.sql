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




