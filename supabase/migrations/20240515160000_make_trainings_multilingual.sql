-- Migration: Make trainings table multilingual
-- Date: 2024-05-15 16:00:00

-- 1. Create temporary columns to store the data
ALTER TABLE public.trainings ADD COLUMN IF NOT EXISTS title_jsonb jsonb DEFAULT '{}';
ALTER TABLE public.trainings ADD COLUMN IF NOT EXISTS description_jsonb jsonb DEFAULT '{}';

-- 2. Migrate existing data to the new jsonb columns (putting it in 'fr' key)
UPDATE public.trainings 
SET 
    title_jsonb = jsonb_build_object('fr', title),
    description_jsonb = CASE 
        WHEN description IS NOT NULL THEN jsonb_build_object('fr', description)
        ELSE '{}'::jsonb
    END;

-- 3. Drop old columns and rename new ones
ALTER TABLE public.trainings DROP COLUMN title;
ALTER TABLE public.trainings DROP COLUMN description;

ALTER TABLE public.trainings RENAME COLUMN title_jsonb TO title;
ALTER TABLE public.trainings RENAME COLUMN description_jsonb TO description;

-- 4. Set constraints
ALTER TABLE public.trainings ALTER COLUMN title SET NOT NULL;

-- 5. Repeat for training_events if necessary (it also has title/description)
ALTER TABLE public.training_events ADD COLUMN IF NOT EXISTS title_jsonb jsonb DEFAULT '{}';
ALTER TABLE public.training_events ADD COLUMN IF NOT EXISTS description_jsonb jsonb DEFAULT '{}';

UPDATE public.training_events 
SET 
    title_jsonb = jsonb_build_object('fr', title),
    description_jsonb = CASE 
        WHEN description IS NOT NULL THEN jsonb_build_object('fr', description)
        ELSE '{}'::jsonb
    END;

ALTER TABLE public.training_events DROP COLUMN title;
ALTER TABLE public.training_events DROP COLUMN description;

ALTER TABLE public.training_events RENAME COLUMN title_jsonb TO title;
ALTER TABLE public.training_events RENAME COLUMN description_jsonb TO description;

ALTER TABLE public.training_events ALTER COLUMN title SET NOT NULL;
