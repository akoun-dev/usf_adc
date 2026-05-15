-- =============================================================
-- Migration : Correction de la structure JSONB doublement imbriquée
-- dans la table `documents`
-- Date : 15 Mai 2026
-- 
-- Problème : Les champs title, description, category, content
-- ont une structure {fr: {fr: "...", en: "...", pt: "...", ar: "..."}, ...}
-- au lieu de {fr: "...", en: "...", pt: "...", ar: "..."}
-- 
-- Solution : Aplatir la structure en extrayant la valeur de la
-- langue correspondante depuis le sous-objet.
-- =============================================================

-- Fonction utilitaire pour aplatir un champ JSONB doublement imbriqué
-- Si le champ est de la forme {fr: {fr: "...", en: "..."}, en: {...}, ...}
-- il sera converti en {fr: "...", en: "...", pt: "...", ar: "..."}
CREATE OR REPLACE FUNCTION flatten_jsonb_i18n(field JSONB)
RETURNS JSONB AS $$
DECLARE
    result JSONB := '{}'::JSONB;
    key TEXT;
    value JSONB;
    inner_value TEXT;
BEGIN
    -- Si le champ est null, retourner null
    IF field IS NULL THEN
        RETURN NULL;
    END IF;

    -- Si c'est déjà une chaîne simple, la retourner telle quelle
    IF jsonb_typeof(field) = 'string' THEN
        RETURN field;
    END IF;

    -- Parcourir chaque clé du champ
    FOR key, value IN SELECT * FROM jsonb_each(field)
    LOOP
        -- Si la valeur est un objet (structure doublement imbriquée)
        IF jsonb_typeof(value) = 'object' THEN
            -- Extraire la valeur dans la même langue que la clé
            inner_value := value->>key;
            -- Si la valeur interne est null, essayer 'fr' comme fallback
            IF inner_value IS NULL THEN
                inner_value := value->>'fr';
            END IF;
            -- Si toujours null, prendre la première valeur disponible
            IF inner_value IS NULL THEN
                SELECT v INTO inner_value FROM jsonb_array_elements_text(jsonb_array(value)) AS v LIMIT 1;
            END IF;
            result := result || jsonb_build_object(key, inner_value);
        ELSIF jsonb_typeof(value) = 'string' THEN
            -- Structure correcte, garder tel quel
            result := result || jsonb_build_object(key, value);
        END IF;
    END LOOP;

    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Corriger les champs title, description, category, content dans la table documents
UPDATE documents
SET
    title = flatten_jsonb_i18n(title::JSONB),
    description = flatten_jsonb_i18n(description::JSONB),
    category = flatten_jsonb_i18n(category::JSONB),
    content = flatten_jsonb_i18n(content::JSONB)
WHERE
    -- Ne corriger que les lignes qui ont un problème (valeur est un objet imbriqué)
    (title::JSONB IS NOT NULL AND jsonb_typeof(title::JSONB) = 'object'
     AND EXISTS (SELECT 1 FROM jsonb_each(title::JSONB) WHERE jsonb_typeof(value) = 'object'))
    OR
    (description::JSONB IS NOT NULL AND jsonb_typeof(description::JSONB) = 'object'
     AND EXISTS (SELECT 1 FROM jsonb_each(description::JSONB) WHERE jsonb_typeof(value) = 'object'))
    OR
    (category::JSONB IS NOT NULL AND jsonb_typeof(category::JSONB) = 'object'
     AND EXISTS (SELECT 1 FROM jsonb_each(category::JSONB) WHERE jsonb_typeof(value) = 'object'))
    OR
    (content::JSONB IS NOT NULL AND jsonb_typeof(content::JSONB) = 'object'
     AND EXISTS (SELECT 1 FROM jsonb_each(content::JSONB) WHERE jsonb_typeof(value) = 'object'));

-- Corriger les champs title, content dans la table forum_topics
UPDATE forum_topics
SET
    title = flatten_jsonb_i18n(title::JSONB),
    content = flatten_jsonb_i18n(content::JSONB)
WHERE
    (title::JSONB IS NOT NULL AND jsonb_typeof(title::JSONB) = 'object'
     AND EXISTS (SELECT 1 FROM jsonb_each(title::JSONB) WHERE jsonb_typeof(value) = 'object'))
    OR
    (content::JSONB IS NOT NULL AND jsonb_typeof(content::JSONB) = 'object'
     AND EXISTS (SELECT 1 FROM jsonb_each(content::JSONB) WHERE jsonb_typeof(value) = 'object'));

-- Corriger les champs name, description dans la table forum_categories
UPDATE forum_categories
SET
    name = flatten_jsonb_i18n(name::JSONB),
    description = flatten_jsonb_i18n(description::JSONB)
WHERE
    (name::JSONB IS NOT NULL AND jsonb_typeof(name::JSONB) = 'object'
     AND EXISTS (SELECT 1 FROM jsonb_each(name::JSONB) WHERE jsonb_typeof(value) = 'object'))
    OR
    (description::JSONB IS NOT NULL AND jsonb_typeof(description::JSONB) = 'object'
     AND EXISTS (SELECT 1 FROM jsonb_each(description::JSONB) WHERE jsonb_typeof(value) = 'object'));

-- Corriger les champs content dans la table forum_posts
UPDATE forum_posts
SET
    content = flatten_jsonb_i18n(content::JSONB)
WHERE
    (content::JSONB IS NOT NULL AND jsonb_typeof(content::JSONB) = 'object'
     AND EXISTS (SELECT 1 FROM jsonb_each(content::JSONB) WHERE jsonb_typeof(value) = 'object'));

-- Nettoyage : supprimer la fonction utilitaire (optionnel, peut être conservée)
-- DROP FUNCTION IF EXISTS flatten_jsonb_i18n(JSONB);

-- Vérification : afficher quelques lignes pour confirmer la correction
-- SELECT id, title, description, category FROM documents LIMIT 5;
