-- Migration pour rendre les commentaires de documents multilingues
-- Conversion du champ content de TEXT vers JSONB

DO $$ 
BEGIN
    -- 1. Créer une colonne temporaire
    ALTER TABLE document_comments ADD COLUMN content_jsonb JSONB DEFAULT '{}'::jsonb;

    -- 2. Migrer les données existantes en mettant le texte actuel dans la clé 'fr'
    UPDATE document_comments 
    SET content_jsonb = jsonb_build_object('fr', content);

    -- 3. Supprimer l'ancienne colonne et renommer la nouvelle
    ALTER TABLE document_comments DROP COLUMN content;
    ALTER TABLE document_comments RENAME COLUMN content_jsonb TO content;

    -- 4. Ajouter une contrainte pour s'assurer que c'est un objet JSON
    ALTER TABLE document_comments ADD CONSTRAINT content_is_object CHECK (jsonb_typeof(content) = 'object');
END $$;
