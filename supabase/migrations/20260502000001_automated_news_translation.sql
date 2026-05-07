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

-- Trigger and function removed as requested. Translations are now handled in the application code.
