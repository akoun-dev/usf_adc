
-- Force update for migration sync

-- Ensure admin user exists in auth.users for foreign key constraints
DO $$
DECLARE
    admin_uid uuid := '25d550fb-d861-468e-ab5b-523af4cc2b7c';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = admin_uid) THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, recovery_sent_at, last_sign_in_at, 
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
            confirmation_token, email_change, email_change_token_new, recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', admin_uid, 'authenticated', 'authenticated', 
            'admin@test.local', crypt('password123', gen_salt('bf')), 
            now(), now(), now(), 
            '{"provider":"email","providers":["email"]}', '{}', now(), now(), 
            '', '', '', ''
        );

        -- Also need a profile if not exists (though 20240101000100 might handle it, let's be safe)
        INSERT INTO public.profiles (id, full_name, is_active, language)
        VALUES (admin_uid, 'Administrator', true, 'fr')
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

INSERT INTO public.documents (
    id, title, description, content, category, 
    status_workflow, is_public, created_by, last_edited_by, 
    closed_by, closed_at, updated_at, created_at,
    file_name, file_path, mime_type
) VALUES (
    '7e1f0222-5eda-45b8-963c-bdc6a7e1c892', 
    'Charte de la Transformation Digitale en Afrique', 
    'Document collaboratif définissant les axes stratégiques de la transformation numérique.', 
    '<h1>Charte de la Transformation Digitale en Afrique</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Document collaboratif définissant les axes stratégiques de la transformation numérique.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p>', 
    'policy', 
    'closed', 
    true, 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '2026-04-12T04:27:33.243673', 
    '2026-04-13T20:27:33.243673', 
    '2026-04-03T20:27:33.243673',
    'doc_collaboration_0.pdf',
    '/co-redaction/docs/doc_collaboration_0.pdf',
    'application/pdf'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    'dd322dc0-82d7-4296-be5e-e2ec7bd00829',
    '7e1f0222-5eda-45b8-963c-bdc6a7e1c892',
    1,
    '<h1>Charte de la Transformation Digitale en Afrique</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Document collaboratif définissant les axes stratégiques de la transformation numérique.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 1',
    'Révision de la section 1',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-12T20:27:33.243673'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    'f3c3cf86-f5da-48ed-874c-b4fc74e14248',
    '7e1f0222-5eda-45b8-963c-bdc6a7e1c892',
    2,
    '<h1>Charte de la Transformation Digitale en Afrique</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Document collaboratif définissant les axes stratégiques de la transformation numérique.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 2',
    'Révision de la section 2',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-11T20:27:33.243673'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '9589f0a6-c776-48c6-a794-02030417eeb8',
    '7e1f0222-5eda-45b8-963c-bdc6a7e1c892',
    3,
    '<h1>Charte de la Transformation Digitale en Afrique</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Document collaboratif définissant les axes stratégiques de la transformation numérique.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 3',
    'Révision de la section 3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-10T20:27:33.243673'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    'f18b3096-6264-4aa9-b999-6dd70313b118',
    '7e1f0222-5eda-45b8-963c-bdc6a7e1c892',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 1',
    '2026-04-13T19:27:33.243673'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '33b6e433-8ce5-4945-928f-c8e3dadf3b1d',
    '7e1f0222-5eda-45b8-963c-bdc6a7e1c892',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 2',
    '2026-04-13T18:27:33.243673'
);

INSERT INTO public.documents (
    id, title, description, content, category, 
    status_workflow, is_public, created_by, last_edited_by, 
    closed_by, closed_at, updated_at, created_at,
    file_name, file_path, mime_type
) VALUES (
    'e17532b0-7756-48c6-a861-34930570027c', 
    'Guide de Cyber-résilience pour les administrations publiques', 
    'Un guide pratique pour renforcer la sécurité des infrastructures critiques.', 
    '<h1>Guide de Cyber-résilience pour les administrations publiques</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Un guide pratique pour renforcer la sécurité des infrastructures critiques.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p>', 
    'technical', 
    'closed', 
    true, 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '2026-04-06T13:27:33.243753', 
    '2026-04-07T20:27:33.243753', 
    '2026-03-28T20:27:33.243753',
    'doc_collaboration_1.pdf',
    '/co-redaction/docs/doc_collaboration_1.pdf',
    'application/pdf'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    'dc9dbb31-dfcd-4112-8eaa-8cba42466bdd',
    'e17532b0-7756-48c6-a861-34930570027c',
    1,
    '<h1>Guide de Cyber-résilience pour les administrations publiques</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Un guide pratique pour renforcer la sécurité des infrastructures critiques.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 1',
    'Révision de la section 1',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-06T20:27:33.243753'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '3ac0bac9-0d32-4701-958b-eaea116d6563',
    'e17532b0-7756-48c6-a861-34930570027c',
    2,
    '<h1>Guide de Cyber-résilience pour les administrations publiques</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Un guide pratique pour renforcer la sécurité des infrastructures critiques.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 2',
    'Révision de la section 2',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-05T20:27:33.243753'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '6ba1ee3b-3c6b-434a-bcff-26c2644558b3',
    'e17532b0-7756-48c6-a861-34930570027c',
    3,
    '<h1>Guide de Cyber-résilience pour les administrations publiques</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Un guide pratique pour renforcer la sécurité des infrastructures critiques.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 3',
    'Révision de la section 3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-04T20:27:33.243753'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '41accf0b-f7f4-469f-b1dc-2542c73cfbd4',
    'e17532b0-7756-48c6-a861-34930570027c',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 1',
    '2026-04-07T19:27:33.243753'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '696be65e-9272-41f9-86f4-9b15aa079c94',
    'e17532b0-7756-48c6-a861-34930570027c',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 2',
    '2026-04-07T18:27:33.243753'
);

INSERT INTO public.documents (
    id, title, description, content, category, 
    status_workflow, is_public, created_by, last_edited_by, 
    closed_by, closed_at, updated_at, created_at,
    file_name, file_path, mime_type
) VALUES (
    '94ddedfb-cac8-43e7-8774-7881ac75f691', 
    'Rapport de Prospective : L''IA au service du développement durable', 
    'Analyse approfondie des opportunités de l''IA pour le continent africain.', 
    '<h1>Rapport de Prospective : L''IA au service du développement durable</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Analyse approfondie des opportunités de l''IA pour le continent africain.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p>', 
    'policy', 
    'closed', 
    true, 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '2026-04-06T05:27:33.243788', 
    '2026-04-07T20:27:33.243788', 
    '2026-03-28T20:27:33.243788',
    'doc_collaboration_2.pdf',
    '/co-redaction/docs/doc_collaboration_2.pdf',
    'application/pdf'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '9521f7bd-7b75-4b77-96e9-5c1622e476a7',
    '94ddedfb-cac8-43e7-8774-7881ac75f691',
    1,
    '<h1>Rapport de Prospective : L''IA au service du développement durable</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Analyse approfondie des opportunités de l''IA pour le continent africain.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 1',
    'Révision de la section 1',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-06T20:27:33.243788'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '20c50277-6d5f-4fd2-a66b-38b777d41af5',
    '94ddedfb-cac8-43e7-8774-7881ac75f691',
    2,
    '<h1>Rapport de Prospective : L''IA au service du développement durable</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Analyse approfondie des opportunités de l''IA pour le continent africain.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 2',
    'Révision de la section 2',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-05T20:27:33.243788'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '0c9c2c55-1d37-4d22-9aa4-23c0662fa8d9',
    '94ddedfb-cac8-43e7-8774-7881ac75f691',
    3,
    '<h1>Rapport de Prospective : L''IA au service du développement durable</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Analyse approfondie des opportunités de l''IA pour le continent africain.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 3',
    'Révision de la section 3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-04T20:27:33.243788'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '87142c09-e1e5-432f-8deb-ab84092a44a4',
    '94ddedfb-cac8-43e7-8774-7881ac75f691',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 1',
    '2026-04-07T19:27:33.243788'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    'f1dd4781-535c-4526-841c-2d6f6d245eaf',
    '94ddedfb-cac8-43e7-8774-7881ac75f691',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 2',
    '2026-04-07T18:27:33.243788'
);

INSERT INTO public.documents (
    id, title, description, content, category, 
    status_workflow, is_public, created_by, last_edited_by, 
    closed_by, closed_at, updated_at, created_at,
    file_name, file_path, mime_type
) VALUES (
    'd9e2ade4-0c18-4235-ae3e-0d01869e88c7', 
    'Modèle de Convention Inter-étatique sur les données', 
    'Un modèle standardisé pour faciliter les accords de partage de données entre pays.', 
    '<h1>Modèle de Convention Inter-étatique sur les données</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Un modèle standardisé pour faciliter les accords de partage de données entre pays.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p>', 
    'legal', 
    'closed', 
    true, 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '2026-04-20T04:27:33.243820', 
    '2026-04-21T20:27:33.243820', 
    '2026-04-11T20:27:33.243820',
    'doc_collaboration_3.pdf',
    '/co-redaction/docs/doc_collaboration_3.pdf',
    'application/pdf'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    'e088baf4-7b53-46f0-a1c8-e62b8a2e70f8',
    'd9e2ade4-0c18-4235-ae3e-0d01869e88c7',
    1,
    '<h1>Modèle de Convention Inter-étatique sur les données</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Un modèle standardisé pour faciliter les accords de partage de données entre pays.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 1',
    'Révision de la section 1',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-20T20:27:33.243820'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    'cb517f1b-d05f-4d41-bf62-154157107ee5',
    'd9e2ade4-0c18-4235-ae3e-0d01869e88c7',
    2,
    '<h1>Modèle de Convention Inter-étatique sur les données</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Un modèle standardisé pour faciliter les accords de partage de données entre pays.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 2',
    'Révision de la section 2',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-19T20:27:33.243820'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '1353d879-d718-42fd-8eda-618eb5ef21bc',
    'd9e2ade4-0c18-4235-ae3e-0d01869e88c7',
    3,
    '<h1>Modèle de Convention Inter-étatique sur les données</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Un modèle standardisé pour faciliter les accords de partage de données entre pays.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 3',
    'Révision de la section 3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-18T20:27:33.243820'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '3f4aa7c1-7b1a-4c72-b702-0f14616cbf1d',
    'd9e2ade4-0c18-4235-ae3e-0d01869e88c7',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 1',
    '2026-04-21T19:27:33.243820'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '973a7a48-b3d5-4d6c-ad73-ba7c15e2614b',
    'd9e2ade4-0c18-4235-ae3e-0d01869e88c7',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 2',
    '2026-04-21T18:27:33.243820'
);

INSERT INTO public.documents (
    id, title, description, content, category, 
    status_workflow, is_public, created_by, last_edited_by, 
    closed_by, closed_at, updated_at, created_at,
    file_name, file_path, mime_type
) VALUES (
    '27a5b017-1fb5-47b8-bc0f-137e8af8c9c3', 
    'Politique Harmonisée de Protection de la Vie Privée', 
    'Politique globale visant à assurer la conformité et la protection des citoyens.', 
    '<h1>Politique Harmonisée de Protection de la Vie Privée</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Politique globale visant à assurer la conformité et la protection des citoyens.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p>', 
    'policy', 
    'closed', 
    true, 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '2026-04-21T14:27:33.243851', 
    '2026-04-22T20:27:33.243851', 
    '2026-04-12T20:27:33.243851',
    'doc_collaboration_4.pdf',
    '/co-redaction/docs/doc_collaboration_4.pdf',
    'application/pdf'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '648838a7-5229-445e-bcda-b4c3fd6f6ac2',
    '27a5b017-1fb5-47b8-bc0f-137e8af8c9c3',
    1,
    '<h1>Politique Harmonisée de Protection de la Vie Privée</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Politique globale visant à assurer la conformité et la protection des citoyens.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 1',
    'Révision de la section 1',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-21T20:27:33.243851'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    'c3639630-5c0f-4738-b165-b0498bd1d96b',
    '27a5b017-1fb5-47b8-bc0f-137e8af8c9c3',
    2,
    '<h1>Politique Harmonisée de Protection de la Vie Privée</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Politique globale visant à assurer la conformité et la protection des citoyens.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 2',
    'Révision de la section 2',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-20T20:27:33.243851'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '5de2e2e6-360f-42db-be6c-681efa0b77f3',
    '27a5b017-1fb5-47b8-bc0f-137e8af8c9c3',
    3,
    '<h1>Politique Harmonisée de Protection de la Vie Privée</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Politique globale visant à assurer la conformité et la protection des citoyens.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 3',
    'Révision de la section 3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-19T20:27:33.243851'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '5c43f93e-875b-40a7-bed8-d05cb338ec6a',
    '27a5b017-1fb5-47b8-bc0f-137e8af8c9c3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 1',
    '2026-04-22T19:27:33.243851'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '165045a3-c29a-40b1-aabd-a57498da9b50',
    '27a5b017-1fb5-47b8-bc0f-137e8af8c9c3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 2',
    '2026-04-22T18:27:33.243851'
);

INSERT INTO public.documents (
    id, title, description, content, category, 
    status_workflow, is_public, created_by, last_edited_by, 
    closed_by, closed_at, updated_at, created_at,
    file_name, file_path, mime_type
) VALUES (
    '0fe08d6b-d959-4362-a213-bae7cef04b28', 
    'Standard de Connectivité Transfrontalière 2025', 
    'Spécifications techniques pour l''interconnexion des réseaux régionaux.', 
    '<h1>Standard de Connectivité Transfrontalière 2025</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Spécifications techniques pour l''interconnexion des réseaux régionaux.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p>', 
    'general', 
    'closed', 
    true, 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '2026-04-22T13:27:33.243883', 
    '2026-04-22T20:27:33.243883', 
    '2026-04-12T20:27:33.243883',
    'doc_collaboration_5.pdf',
    '/co-redaction/docs/doc_collaboration_5.pdf',
    'application/pdf'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '7c483fb4-3d1b-4694-b1b8-915847d7e5c6',
    '0fe08d6b-d959-4362-a213-bae7cef04b28',
    1,
    '<h1>Standard de Connectivité Transfrontalière 2025</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Spécifications techniques pour l''interconnexion des réseaux régionaux.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 1',
    'Révision de la section 1',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-21T20:27:33.243883'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    'e50c80a9-eb9f-4716-984c-fd970d3a4a1b',
    '0fe08d6b-d959-4362-a213-bae7cef04b28',
    2,
    '<h1>Standard de Connectivité Transfrontalière 2025</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Spécifications techniques pour l''interconnexion des réseaux régionaux.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 2',
    'Révision de la section 2',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-20T20:27:33.243883'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '032b942a-6fcd-436a-bb61-40257bfb2dad',
    '0fe08d6b-d959-4362-a213-bae7cef04b28',
    3,
    '<h1>Standard de Connectivité Transfrontalière 2025</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Spécifications techniques pour l''interconnexion des réseaux régionaux.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 3',
    'Révision de la section 3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-19T20:27:33.243883'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '571f5dcc-8f83-480c-9887-be6ff4ed53e3',
    '0fe08d6b-d959-4362-a213-bae7cef04b28',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 1',
    '2026-04-22T19:27:33.243883'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '00499060-b9e1-4a48-ab02-1e0669282d14',
    '0fe08d6b-d959-4362-a213-bae7cef04b28',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 2',
    '2026-04-22T18:27:33.243883'
);

INSERT INTO public.documents (
    id, title, description, content, category, 
    status_workflow, is_public, created_by, last_edited_by, 
    closed_by, closed_at, updated_at, created_at,
    file_name, file_path, mime_type
) VALUES (
    'a50ca8bd-4bac-4313-aae8-77d9bfc518e3', 
    'Protocole d''Échange de Données Santé en Afrique de l''Ouest', 
    'Standards d''interopérabilité pour les systèmes d''information hospitaliers.', 
    '<h1>Protocole d''Échange de Données Santé en Afrique de l''Ouest</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Standards d''interopérabilité pour les systèmes d''information hospitaliers.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p>', 
    'technical', 
    'closed', 
    true, 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '2026-04-25T16:27:33.243912', 
    '2026-04-25T20:27:33.243912', 
    '2026-04-15T20:27:33.243912',
    'doc_collaboration_6.pdf',
    '/co-redaction/docs/doc_collaboration_6.pdf',
    'application/pdf'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '5ce9ac26-e7c4-40c7-9007-8a5c82ad830c',
    'a50ca8bd-4bac-4313-aae8-77d9bfc518e3',
    1,
    '<h1>Protocole d''Échange de Données Santé en Afrique de l''Ouest</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Standards d''interopérabilité pour les systèmes d''information hospitaliers.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 1',
    'Révision de la section 1',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-24T20:27:33.243912'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '4240d6d7-e80f-4af7-9685-918866a7d039',
    'a50ca8bd-4bac-4313-aae8-77d9bfc518e3',
    2,
    '<h1>Protocole d''Échange de Données Santé en Afrique de l''Ouest</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Standards d''interopérabilité pour les systèmes d''information hospitaliers.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 2',
    'Révision de la section 2',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-23T20:27:33.243912'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '6058ab3b-73a9-45b6-829e-de46a3837cf2',
    'a50ca8bd-4bac-4313-aae8-77d9bfc518e3',
    3,
    '<h1>Protocole d''Échange de Données Santé en Afrique de l''Ouest</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Standards d''interopérabilité pour les systèmes d''information hospitaliers.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 3',
    'Révision de la section 3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-22T20:27:33.243912'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    'adf3eda3-1b8b-4d91-b283-a800053645fd',
    'a50ca8bd-4bac-4313-aae8-77d9bfc518e3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 1',
    '2026-04-25T19:27:33.243912'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    'fbce222d-324f-48cf-b1fe-93330f035984',
    'a50ca8bd-4bac-4313-aae8-77d9bfc518e3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 2',
    '2026-04-25T18:27:33.243912'
);

INSERT INTO public.documents (
    id, title, description, content, category, 
    status_workflow, is_public, created_by, last_edited_by, 
    closed_by, closed_at, updated_at, created_at,
    file_name, file_path, mime_type
) VALUES (
    'ab1ce658-641b-48d4-86d0-01ba31ba02ab', 
    'Cadre de Gouvernance Cloud Souverain', 
    'Recommandations pour la mise en place d''infrastructures cloud nationales.', 
    '<h1>Cadre de Gouvernance Cloud Souverain</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Recommandations pour la mise en place d''infrastructures cloud nationales.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p>', 
    'reports', 
    'closed', 
    true, 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '2026-04-08T16:27:33.243943', 
    '2026-04-08T20:27:33.243943', 
    '2026-03-29T20:27:33.243943',
    'doc_collaboration_7.pdf',
    '/co-redaction/docs/doc_collaboration_7.pdf',
    'application/pdf'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '395e5477-10a2-4886-97a1-7d46e50810f7',
    'ab1ce658-641b-48d4-86d0-01ba31ba02ab',
    1,
    '<h1>Cadre de Gouvernance Cloud Souverain</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Recommandations pour la mise en place d''infrastructures cloud nationales.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 1',
    'Révision de la section 1',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-07T20:27:33.243943'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '490ce22e-7371-4e3e-b79a-22266a1c5740',
    'ab1ce658-641b-48d4-86d0-01ba31ba02ab',
    2,
    '<h1>Cadre de Gouvernance Cloud Souverain</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Recommandations pour la mise en place d''infrastructures cloud nationales.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 2',
    'Révision de la section 2',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-06T20:27:33.243943'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '11cabb34-aaa6-474f-9612-3e694f89199c',
    'ab1ce658-641b-48d4-86d0-01ba31ba02ab',
    3,
    '<h1>Cadre de Gouvernance Cloud Souverain</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Recommandations pour la mise en place d''infrastructures cloud nationales.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 3',
    'Révision de la section 3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-05T20:27:33.243943'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '6aa82a35-34d0-4d17-99d0-eb067a8b670c',
    'ab1ce658-641b-48d4-86d0-01ba31ba02ab',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 1',
    '2026-04-08T19:27:33.243943'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    'b38796bf-9a42-43d1-a805-2d673f73ca15',
    'ab1ce658-641b-48d4-86d0-01ba31ba02ab',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 2',
    '2026-04-08T18:27:33.243943'
);

INSERT INTO public.documents (
    id, title, description, content, category, 
    status_workflow, is_public, created_by, last_edited_by, 
    closed_by, closed_at, updated_at, created_at,
    file_name, file_path, mime_type
) VALUES (
    '86765ab8-c468-4a44-adf8-a09b34ec8e5f', 
    'Livre Blanc sur la Blockchain Citoyenne', 
    'Exploration des cas d''usage de la blockchain pour les services publics.', 
    '<h1>Livre Blanc sur la Blockchain Citoyenne</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Exploration des cas d''usage de la blockchain pour les services publics.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p>', 
    'reports', 
    'closed', 
    true, 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '2026-04-29T10:27:33.243977', 
    '2026-04-30T20:27:33.243977', 
    '2026-04-20T20:27:33.243977',
    'doc_collaboration_8.pdf',
    '/co-redaction/docs/doc_collaboration_8.pdf',
    'application/pdf'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '15b9a888-f712-4227-9bbd-1c73a3394f6c',
    '86765ab8-c468-4a44-adf8-a09b34ec8e5f',
    1,
    '<h1>Livre Blanc sur la Blockchain Citoyenne</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Exploration des cas d''usage de la blockchain pour les services publics.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 1',
    'Révision de la section 1',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-29T20:27:33.243977'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    'b2eb356d-917d-463a-bbfb-44e12c4adca1',
    '86765ab8-c468-4a44-adf8-a09b34ec8e5f',
    2,
    '<h1>Livre Blanc sur la Blockchain Citoyenne</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Exploration des cas d''usage de la blockchain pour les services publics.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 2',
    'Révision de la section 2',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-28T20:27:33.243977'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '19a0539a-cef8-4cf7-bd66-23a9787a5972',
    '86765ab8-c468-4a44-adf8-a09b34ec8e5f',
    3,
    '<h1>Livre Blanc sur la Blockchain Citoyenne</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Exploration des cas d''usage de la blockchain pour les services publics.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 3',
    'Révision de la section 3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-27T20:27:33.243977'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '639c50dd-889b-4592-b629-76c7d81c6c4b',
    '86765ab8-c468-4a44-adf8-a09b34ec8e5f',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 1',
    '2026-04-30T19:27:33.243977'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '4b690069-8c3e-4a8e-be1f-5a27015254a8',
    '86765ab8-c468-4a44-adf8-a09b34ec8e5f',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 2',
    '2026-04-30T18:27:33.243977'
);

INSERT INTO public.documents (
    id, title, description, content, category, 
    status_workflow, is_public, created_by, last_edited_by, 
    closed_by, closed_at, updated_at, created_at,
    file_name, file_path, mime_type
) VALUES (
    '92e64816-f815-4494-8502-2af7a8c17876', 
    'Stratégie Continentale de Cybersécurité', 
    'Plan d''action pour une réponse coordonnée aux cybermenaces.', 
    '<h1>Stratégie Continentale de Cybersécurité</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Plan d''action pour une réponse coordonnée aux cybermenaces.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p>', 
    'templates', 
    'closed', 
    true, 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '25d550fb-d861-468e-ab5b-523af4cc2b7c', 
    '2026-04-19T02:27:33.244009', 
    '2026-04-20T20:27:33.244009', 
    '2026-04-10T20:27:33.244009',
    'doc_collaboration_9.pdf',
    '/co-redaction/docs/doc_collaboration_9.pdf',
    'application/pdf'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    'daf28022-67b7-484a-b81a-5acde60ca3d5',
    '92e64816-f815-4494-8502-2af7a8c17876',
    1,
    '<h1>Stratégie Continentale de Cybersécurité</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Plan d''action pour une réponse coordonnée aux cybermenaces.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 1',
    'Révision de la section 1',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-19T20:27:33.244009'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    'e702b682-052a-4db5-a63e-873e8f89b5c4',
    '92e64816-f815-4494-8502-2af7a8c17876',
    2,
    '<h1>Stratégie Continentale de Cybersécurité</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Plan d''action pour une réponse coordonnée aux cybermenaces.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 2',
    'Révision de la section 2',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-18T20:27:33.244009'
);

INSERT INTO public.document_versions (
    id, document_id, version_number, content, change_summary, created_by, created_at
) VALUES (
    '8262f836-e6a0-4cc5-94ea-bb128deeb7bc',
    '92e64816-f815-4494-8502-2af7a8c17876',
    3,
    '<h1>Stratégie Continentale de Cybersécurité</h1><p>Ce document est le résultat d''une collaboration entre experts de l''UAT.</p><p>Plan d''action pour une réponse coordonnée aux cybermenaces.</p><h2>1. Introduction</h2><p>L''importance de ce sujet n''est plus à démontrer dans le contexte actuel de numérisation accélérée.</p> - Version 3',
    'Révision de la section 3',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    '2026-04-17T20:27:33.244009'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '52d6972b-5ca0-4a3d-8aff-6f0d1a6f2463',
    '92e64816-f815-4494-8502-2af7a8c17876',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 1',
    '2026-04-20T19:27:33.244009'
);

INSERT INTO public.document_comments (
    id, document_id, user_id, author_name, content, created_at
) VALUES (
    '2258761d-23dd-454d-b8e4-2b7c019dcca1',
    '92e64816-f815-4494-8502-2af7a8c17876',
    '25d550fb-d861-468e-ab5b-523af4cc2b7c',
    'Expert UAT',
    'Commentaire constructif sur la version 2',
    '2026-04-20T18:27:33.244009'
);