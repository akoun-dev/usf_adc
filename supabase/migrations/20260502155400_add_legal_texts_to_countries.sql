-- Add legal_texts column to public.countries
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS legal_texts text;

-- Seed sample data for South Africa (za)
UPDATE public.countries 
SET legal_texts = 'Le cadre juridique du Service Universel en Afrique du Sud repose sur la loi sur les communications électroniques (Electronic Communications Act) de 2005. Elle définit le Fonds de Service Universel et d''Accès (USAASA) comme l''organe chargé de gérer les contributions des opérateurs (0,2% du chiffre d''affaires annuel) pour financer le déploiement des infrastructures dans les zones sous-desservies.'
WHERE code_iso = 'za';

-- Seed sample data for Côte d''Ivoire (ci)
UPDATE public.countries 
SET legal_texts = 'Le cadre juridique du Service Universel en Côte d''Ivoire est régi par l''ordonnance n°2012-293 relative aux Télécommunications et aux Technologies de l''Information et de la Communication. L''ANSUT est chargée de la mise en œuvre des programmes de service universel, financés par une contribution de 2% du chiffre d''affaires des opérateurs titulaires de licences.'
WHERE code_iso = 'ci';
