-- 1. Add new columns to fsu_agencies
ALTER TABLE public.fsu_agencies 
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC,
ADD COLUMN IF NOT EXISTS headquarters TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- 2. Remove the unique constraint on country_id to allow multiple agencies per country (e.g., ANSUT and ARTCI in CI)
ALTER TABLE public.fsu_agencies DROP CONSTRAINT IF EXISTS fsu_agencies_country_id_key;

-- 3. Seed data for FSU Agencies

-- ANSUT (Côte d'Ivoire)
INSERT INTO public.fsu_agencies (country_id, fsu_name, dg_name, dg_message, dg_photo_url, agency_type, latitude, longitude, headquarters, contact_phone, contact_email)
VALUES (
    (SELECT id FROM public.countries WHERE code_iso = 'ci'), 
    'ANSUT', 
    'M. Gilles Thierry Beugré', 
    '{"fr": "Bienvenue sur la plateforme USF-ADCA, fruit d''un travail collaboratif exemplaire entre nos États membres et nos partenaires techniques. En tant que directeur en charge des radiocommunications, je suis convaincu que la gestion optimale du spectre et le déploiement des infrastructures sont les clés pour atteindre nos objectifs de connectivité universelle.", "en": "Welcome to the USF-ADCA platform, the fruit of exemplary collaborative work between our Member States and our technical partners. As director in charge of radiocommunications, I am convinced that optimal spectrum management and infrastructure deployment are keys to achieving our universal connectivity goals.", "pt": "Bem-vindo à plataforma USF-ADCA, fruto de um trabalho colaborativo exemplar entre os nossos Estados-Membros e os nosos parceiros técnicos.", "ar": "مرحباً بكم في منصة USF-ADCA، وهي ثمرة عمل تعاوني نموذجي بين دولنا الأعضاء وشركائنا التقنيين."}',
    'https://digitalmag.ci/wp-content/uploads/2025/03/Gilles-Beugre-DG-de-lANSUT-LIA-nous-aide-a-determiner-les-investissements-strategiques-dans-la-couverture-telecoms-en-Cote-dIvoire-.jpg',
    'agency',
    5.3484, -4.0305,
    'Abidjan, Cocody Riviera',
    '+225 27 22 41 41 41',
    'info@ansut.ci'
) ON CONFLICT DO NOTHING;

-- ARTCI (Côte d'Ivoire)
INSERT INTO public.fsu_agencies (country_id, fsu_name, dg_name, dg_message, dg_photo_url, agency_type, latitude, longitude, headquarters, contact_phone, contact_email)
VALUES (
    (SELECT id FROM public.countries WHERE code_iso = 'ci'), 
    'ARTCI', 
    'M. Lakoun Ouattara', 
    '{"fr": "La régulation est au cœur du développement de l''économie numérique. À l''ARTCI, nous veillons à ce que les infrastructures de télécommunications soient accessibles à tous, tout en garantissant une saine concurrence pour le bénéfice des populations.", "en": "Regulation is at the heart of the digital economy''s development. At ARTCI, we ensure that telecommunications infrastructure is accessible to all, while guaranteeing healthy competition for the benefit of populations.", "pt": "A regulação está no centro do desenvolvimento da economia digital.", "ar": "التنظيم هو في قلب تطوير الاقتصاد الرقمي."}',
    'https://www.artci.ci/images/stories/articles/IMG_0046.JPG',
    'regulator',
    5.3324, -4.0194,
    'Abidjan, Marcory Anoumabo',
    '+225 27 20 34 43 00',
    'artci@artci.ci'
) ON CONFLICT DO NOTHING;

-- UAT (Union Africaine des Télécommunications - Associated with Kenya for HQ)
INSERT INTO public.fsu_agencies (country_id, fsu_name, dg_name, dg_message, dg_photo_url, agency_type, latitude, longitude, headquarters, contact_phone, contact_email)
VALUES (
    (SELECT id FROM public.countries WHERE code_iso = 'ke'), 
    'UAT (ATU)', 
    'M. John Omo', 
    '{"fr": "L''Union Africaine des Télécommunications est fière de soutenir cette initiative. L''harmonisation des politiques de service universel à travers le continent est cruciale pour faire de l''Afrique une société numérique prospère.", "en": "The African Telecommunications Union is proud to support this initiative. The harmonization of universal service policies across the continent is crucial to making Africa a prosperous digital society.", "pt": "A União Africana de Telecomunicações orgulha-se de apoiar esta iniciativa.", "ar": "الاتحاد الأفريقي للاتصالات فخور بدعم هذه المبادرة."}',
    'https://cdn.asp.events/CLIENT_Delinian_88510B86_A1E4_E5AE_E5572932A0001A1B/sites/itw-africa-2026/media/libraries/speakers/John-Omo.jpg',
    'institution',
    -1.2921, 36.8219,
    'Nairobi, Kenya',
    '+254 20 232 2120',
    'sg@atu-uat.africa'
) ON CONFLICT DO NOTHING;

-- FSU Sénégal
INSERT INTO public.fsu_agencies (country_id, fsu_name, dg_name, dg_message, dg_photo_url, agency_type, latitude, longitude, headquarters, contact_phone, contact_email)
VALUES (
    (SELECT id FROM public.countries WHERE code_iso = 'sn'), 
    'FSU Sénégal', 
    'Mme Fatou Diallo', 
    '{"fr": "Le Sénégal s''engage résolument dans la transformation numérique inclusive. Notre Fonds de Service Universel œuvre chaque jour pour que chaque citoyen puisse bénéficier des opportunités offertes par le numérique.", "en": "Senegal is resolutely committed to inclusive digital transformation. Our Universal Service Fund works every day so that every citizen can benefit from the opportunities offered by digital technology.", "pt": "O Senegal está resolutamente empenhado na transformação digital inclusiva.", "ar": "تلتزم السنغال بحزم بالتحول الرقمي الشامل."}',
    'https://www.au-senegal.com/IMG/jpg/fatou1.jpg',
    'agency',
    14.7167, -17.4677,
    'Dakar, Sénégal',
    '+221 33 869 03 69',
    'contact@fsu.sn'
) ON CONFLICT DO NOTHING;

-- GIFEC Ghana
INSERT INTO public.fsu_agencies (country_id, fsu_name, dg_name, dg_message, dg_photo_url, agency_type, latitude, longitude, headquarters, contact_phone, contact_email)
VALUES (
    (SELECT id FROM public.countries WHERE code_iso = 'gh'), 
    'GIFEC Ghana', 
    'M. Kwame Mensah', 
    '{"fr": "Grâce au service universel, nous comblons le fossé et autonomisons les communautés. Notre plateforme témoigne du pouvoir de la collaboration et d''une vision partagée pour une Afrique numériquement inclusive.", "en": "Through universal service, we are bridging the gap and empowering communities. Our platform is a testament to the power of collaboration and shared vision for a digitally inclusive Africa.", "pt": "Através do serviço universal, estamos a colmatar a lacuna e a capacitar as comunidades.", "ar": "من خلال الخدمة الشاملة، نقوم بسد الفجوة وتمكين المجتمعات."}',
    'https://macdanenergy.com/professional-african-engineer-portrait.jpg',
    'agency',
    5.6037, -0.1870,
    'Accra, Ghana',
    '+233 30 266 1111',
    'info@gifec.gov.gh'
) ON CONFLICT DO NOTHING;
