-- Migration: Remove translation triggers from news and events tables
-- Date: 2026-05-03

-- 1. Drop triggers on news table
DROP TRIGGER IF EXISTS on_news_translation_needed ON public.news;

-- 2. Drop triggers on events table
DROP TRIGGER IF EXISTS on_events_translation_needed ON public.events;

-- 3. Note: We keep the functions fn_libretranslate, fn_auto_translate_jsonb, and handle_translation_trigger
-- for reference or manual use, but they are no longer automatically called.
