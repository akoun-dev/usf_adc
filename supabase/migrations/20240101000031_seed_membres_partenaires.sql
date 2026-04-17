-- Seed data for associated members
INSERT INTO public.membres_associes (id, nom, nom_complet, pays_id, logo_url, type, secteur, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('a1b2c3d4-5678-90ef-1234-567890abcdef', 'ANSUT', 'Agence Nationale du Service Universel des Telecommunications', 
 (SELECT id FROM public.countries WHERE code_iso = 'CI' LIMIT 1), 
 'https://ansut.ci/logo.png', 'agence', 'Service Universel', '2019', 'https://ansut.ci', 
 'Agence nationale ivoirienne responsable de la mise en oeuvre du Service Universel des Telecommunications', 
 '{"projets": ["Deploiement 4G rural", "Ecoles connectees"]}', 'contact@ansut.ci', '+225 00 00 00 00', 'Abidjan, Cote d''Ivoire', true);

INSERT INTO public.membres_associes (id, nom, nom_complet, pays_id, logo_url, type, secteur, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('b2c3d4e5-6789-0123-4567-890123456789', 'MTN Group', 'MTN Group Limited', 
 (SELECT id FROM public.countries WHERE code_iso = 'ZA' LIMIT 1), 
 'https://www.mtn.com/wp-content/uploads/2021/06/MTN-Logo.png', 'operateur', 'Operateur Mobile', '2019', 'https://www.mtn.com', 
 'Groupe panafricain de telecommunications mobiles, present dans 21 pays africains', 
 '{"projets": ["Connectivite transfrontaliere", "Infrastructure 5G"]}', 'info@mtn.com', '+27 10 000 0000', 'Johannesburg, South Africa', true);

INSERT INTO public.membres_associes (id, nom, nom_complet, pays_id, logo_url, type, secteur, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('c3d4e5f6-7890-1234-5678-901234567890', 'Orange Group', 'Orange Middle East & Africa', 
 (SELECT id FROM public.countries WHERE code_iso = 'FR' LIMIT 1), 
 'https://www.orange.com/assets/images/logo-orange.svg', 'operateur', 'Operateur Telecoms', '2020', 'https://www.orange.com', 
 'Operateur present en 20+ pays d''Afrique de l''Ouest et du Centre', 
 '{"projets": ["Partage d''infrastructure", "Services numeriques"]}', 'contact@orange.com', '+33 1 00 00 00 00', 'Paris, France', true);

INSERT INTO public.membres_associes (id, nom, nom_complet, pays_id, logo_url, type, secteur, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('d4e5f6a7-8901-2345-6789-012345678901', 'Huawei', 'Huawei Technologies Co. Ltd.', 
 (SELECT id FROM public.countries WHERE code_iso = 'CN' LIMIT 1), 
 'https://www.huawei.com/ucmf/groups/public/documents/image/huawei_logo.png', 'operateur', 'Equipements Reseaux', '2019', 'https://www.huawei.com', 
 'Leader mondial des solutions ICT et equipements de telecommunications', 
 '{"projets": ["Infrastructure 5G", "Smart Cities"]}', 'contact@huawei.com', '+86 10 000 0000', 'Shenzhen, China', true);

-- Seed data for partners
INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('e5f6a7b8-9012-3456-7890-123456789012', 'Google', 'Google LLC', 
 (SELECT id FROM public.countries WHERE code_iso = 'US' LIMIT 1), 
 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 'international', 'Technologie & Services Numeriques', '2021', 'https://www.google.com', 
 'Services cloud, connectivite et initiatives de digitalisation en Afrique', 
 '{"projets": ["Google Station WiFi", "Cloud services"]}', 'africa-partnerships@google.com', '+1 650 000 0000', 'Mountain View, CA, USA', true);

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('f6a7b8c9-0123-4567-8901-234567890123', 'Microsoft', 'Microsoft Corporation', 
 (SELECT id FROM public.countries WHERE code_iso = 'US' LIMIT 1), 
 'https://c.s-microsoft.com/en-us/CMSImages/Microsoft_logo_rgb_C-Gray.png?version=5f55f6c7-6b0o-4a2b-8f8f-8f8f8f8f8f8f', 'international', 'Cloud & Solutions Numeriques', '2020', 'https://www.microsoft.com', 
 'Solutions cloud et services numeriques pour les entreprises et administrations', 
 '{"projets": ["Formation digitale", "Cloud computing"]}', 'africa@microsoft.com', '+1 425 000 0000', 'Redmond, WA, USA', true);

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('a7b8c9d0-1234-5678-9012-345678901234', 'Amazon Data Services', 'Amazon Web Services (AWS)', 
 (SELECT id FROM public.countries WHERE code_iso = 'US' LIMIT 1), 
 'https://d1.awsstatic.com/partner-network/logo/AWS-Logo_Positive_1200x630.9f9234e4a31c3f8b0f2a5f5f5f5f5f5f5f5f5f5f.png', 'international', 'Cloud & Infrastructure', '2022', 'https://aws.amazon.com', 
 'Services cloud et infrastructures pour les projets de connectivite', 
 '{"projets": ["Data centers", "Cloud infrastructure"]}', 'africa-partners@amazon.com', '+1 206 000 0000', 'Seattle, WA, USA', true);

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('b8c9d0e1-2345-6789-0123-456789012345', 'Nokia Solutions', 'Nokia Corporation', 
 (SELECT id FROM public.countries WHERE code_iso = 'FI' LIMIT 1), 
 'https://www.nokia.com/sites/default/files/styles/large/public/2021-06/nokia-logo-blue-rgb.png', 'prive', 'Equipements & Solutions Reseaux', '2019', 'https://www.nokia.com', 
 'Equipements reseaux, solutions 5G et services professionnels', 
 '{"projets": ["Reseaux mobiles", "IoT solutions"]}', 'contact@nokia.com', '+358 10 000 0000', 'Espoo, Finland', true);

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('c9d0e1f2-3456-7890-1234-567890123456', 'Vodacom Group', 'Vodacom Group Limited', 
 (SELECT id FROM public.countries WHERE code_iso = 'ZA' LIMIT 1), 
 'https://www.vodacom.com/skin/frontend/vodacom/default/images/logo.svg', 'prive', 'Operateur Mobile', '2020', 'https://www.vodacom.com', 
 'Operateur mobile panafricain, filiale de Vodafone', 
 '{"projets": ["Services mobiles", "Data services"]}', 'info@vodacom.com', '+27 11 000 0000', 'Johannesburg, South Africa', true);

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('d0e1f2a3-4567-8901-2345-678901234567', 'SES Luxembourg', 'SES S.A.', 
 (SELECT id FROM public.countries WHERE code_iso = 'LU' LIMIT 1), 
 'https://www.ses.com/sites/default/files/styles/large/public/2021-06/ses-logo.png', 'international', 'Satellites & Connectivite', '2021', 'https://www.ses.com', 
 'Operateur satellite mondial fournissant une connectivite high-speed', 
 '{"projets": ["Connectivite satellite", "Services broadband"]}', 'contact@ses.com', '+352 00 00 0000', 'Luxembourg City, Luxembourg', true);

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('e1f2a3b4-5678-9012-3456-789012345678', 'SpaceX', 'SpaceX - Starlink', 
 (SELECT id FROM public.countries WHERE code_iso = 'US' LIMIT 1), 
 'https://www.spacex.com/static/images/share/Starlink_Logo_Black.png', 'international', 'Satellites & Connectivite', '2023', 'https://www.starlink.com', 
 'Constellation satellites Starlink pour la connectivite mondiale et rurale', 
 '{"projets": ["Internet satellite", "Zones mal desservies"]}', 'starlink@spacex.com', '+1 000 000 0000', 'Hawthorne, CA, USA', true);

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('f2a3b4c5-6789-0123-4567-890123456789', 'GSMA', 'GSM Association', 
 (SELECT id FROM public.countries WHERE code_iso = 'GB' LIMIT 1), 
 'https://www.gsma.com/wp-content/uploads/2021/06/GSMA-Logo.png', 'ong', 'Association Professionnelle', '2019', 'https://www.gsma.com', 
 'Association representant les operateurs mobiles mondiaux et l''ecosysteme mobile', 
 '{"projets": ["Rapports FSU", "Best practices"]}', 'info@gsma.com', '+44 00 0000 0000', 'London, United Kingdom', true);

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('a3b4c5d6-7890-1234-5678-901234567890', 'Eutelsat', 'Eutelsat Group', 
 (SELECT id FROM public.countries WHERE code_iso = 'FR' LIMIT 1), 
 'https://www.eutelsat.com/wp-content/uploads/2021/06/eutelsat-logo.png', 'international', 'Satellites & Connectivite', '2020', 'https://www.eutelsat.com', 
 'Operateur satellite europeen couvrant l''Afrique avec des services de connectivite', 
 '{"projets": ["Services satellite", "Broadband rural"]}', 'contact@eutelsat.com', '+33 1 00 00 00 00', 'Paris, France', true);

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('b4c5d6e7-8901-2345-6789-012345678901', 'Intelsat', 'Intelsat S.A.', 
 (SELECT id FROM public.countries WHERE code_iso = 'LU' LIMIT 1), 
 'https://www.intelsat.com/wp-content/uploads/2021/06/intelsat-logo.png', 'international', 'Satellites & Connectivite', '2019', 'https://www.intelsat.com', 
 'Operateur satellite fournissant des services de connectivite en Afrique', 
 '{"projets": ["Reseaux cellulaires", "Services IP"]}', 'sales@intelsat.com', '+352 00 000 0000', 'Luxembourg City, Luxembourg', true);

INSERT INTO public.partenaires (id, nom, nom_complet, pays_id, logo_url, type, domaine, depuis, site_web, description, projets, email_contact, telephone_contact, adresse, est_actif) VALUES
('c5d6e7f8-9012-3456-7890-123456789012', 'ZTE', 'ZTE Corporation', 
 (SELECT id FROM public.countries WHERE code_iso = 'CN' LIMIT 1), 
 'https://www.zte.com.cn/global/aboutus/images/logo.png', 'prive', 'Equipements & Solutions Reseaux', '2019', 'https://www.zte.com.cn/global', 
 'Equipementier chinois proposant des solutions reseaux et telecoms', 
 '{"projets": ["Infrastructure 4G/5G", "Solutions broadband"]}', 'global@zte.com.cn', '+86 755 0000 0000', 'Shenzhen, China', true);

-- Add comments for documentation
COMMENT ON TABLE public.membres_associes IS 'Table containing associated members of the organization';
COMMENT ON TABLE public.partenaires IS 'Table containing partners of the organization';
