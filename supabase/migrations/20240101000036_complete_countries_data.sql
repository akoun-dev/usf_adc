-- =====================================================
-- migration: complete countries missing data
-- =====================================================
-- purpose: fill in missing fields for all countries
-- affected tables: countries
-- =====================================================

-- =====================
-- CEDEAO countries
-- =====================

-- Bénin
UPDATE public.countries SET
  official_name = 'République du Bénin',
  flag_url = 'https://flagcdn.com/w320/bj.png',
  description = 'Le Bénin a lancé son Fonds de Service Universel en 2020 pour étendre la connectivité dans les zones rurales et périurbaines. Le programme met l''accent sur le numérique éducatif et les cybercentres communautaires.',
  population = '13,7 millions',
  capital = 'Porto-Novo',
  fsu_established = '2020',
  fsu_budget = '8 milliards FCFA',
  fsu_coordinator_name = 'M. Cossi Houénou',
  fsu_coordinator_email = 'fsu@benin.gouv',
  fsu_coordinator_phone = '+229 21 00 00 00'
WHERE code_iso = 'bj' AND description IS NULL;

-- Burkina Faso
UPDATE public.countries SET
  official_name = 'Burkina Faso',
  flag_url = 'https://flagcdn.com/w320/bf.png',
  description = 'Le Burkina Faso a établi son FSU en 2019 avec pour ambition de réduire la fracture numérique dans les zones rurales. Le programme finance des projets de connectivité broadband et des centres numériques de proximité.',
  population = '22,1 millions',
  capital = 'Ouagadougou',
  fsu_established = '2019',
  fsu_budget = '12 milliards FCFA',
  fsu_coordinator_name = 'M. Abdoulaye Sawadogo',
  fsu_coordinator_email = 'fsu@burkina.gouv',
  fsu_coordinator_phone = '+226 25 00 00 00'
WHERE code_iso = 'bf' AND description IS NULL;

-- Cap-Vert
UPDATE public.countries SET
  official_name = 'République du Cap-Vert',
  flag_url = 'https://flagcdn.com/w320/cv.png',
  description = 'Le Cap-Vert, pays insulaire, a créé son FSU en 2021 pour garantir l''accès aux télécommunications sur l''ensemble de ses îles. Le programme priorise la connectivité inter-îles et les services numériques maritimes.',
  population = '0,6 millions',
  capital = 'Praia',
  fsu_established = '2021',
  fsu_budget = '3 milliards FCFA',
  fsu_coordinator_name = 'Mme Maria Santos',
  fsu_coordinator_email = 'fsu@caboverde.gov',
  fsu_coordinator_phone = '+238 260 00 00'
WHERE code_iso = 'cv' AND description IS NULL;

-- Gambie
UPDATE public.countries SET
  official_name = 'République de Gambie',
  flag_url = 'https://flagcdn.com/w320/gm.png',
  description = 'La Gambie a initié son FSU en 2022 pour connecter les communautés rurales le long du fleuve Gambie. Le programme cible les écoles, les centres de santé et les marchés ruraux.',
  population = '2,6 millions',
  capital = 'Banjul',
  fsu_established = '2022',
  fsu_budget = '2 milliards FCFA',
  fsu_coordinator_name = 'M. Lamin Jammeh',
  fsu_coordinator_email = 'fsu@gambia.gov',
  fsu_coordinator_phone = '+220 400 0000'
WHERE code_iso = 'gm' AND description IS NULL;

-- Guinée
UPDATE public.countries SET
  official_name = 'République de Guinée',
  flag_url = 'https://flagcdn.com/w320/gn.png',
  description = 'La Guinée a mis en place son FSU en 2020 pour développer la connectivité dans les zones enclavées du pays. Le programme se concentre sur le déploiement de la fibre optique et les centres multimédia communautaires.',
  population = '13,9 millions',
  capital = 'Conakry',
  fsu_established = '2020',
  fsu_budget = '10 milliards FCFA',
  fsu_coordinator_name = 'M. Mamadou Bah',
  fsu_coordinator_email = 'fsu@guinee.gov',
  fsu_coordinator_phone = '+224 620 00 00 00'
WHERE code_iso = 'gn' AND description IS NULL;

-- Guinée-Bissau
UPDATE public.countries SET
  official_name = 'République de Guinée-Bissau',
  flag_url = 'https://flagcdn.com/w320/gw.png',
  description = 'La Guinée-Bissau a lancé son FSU en 2023 avec le soutien de partenaires internationaux. Le programme vise à étendre la couverture mobile et les services numériques de base dans les régions intérieures.',
  population = '2,1 millions',
  capital = 'Bissau',
  fsu_established = '2023',
  fsu_budget = '1,5 milliard FCFA',
  fsu_coordinator_name = 'M. Braima Sanhá',
  fsu_coordinator_email = 'fsu@guinebissau.gov',
  fsu_coordinator_phone = '+245 320 0000'
WHERE code_iso = 'gw' AND description IS NULL;

-- Libéria
UPDATE public.countries SET
  official_name = 'République du Libéria',
  flag_url = 'https://flagcdn.com/w320/lr.png',
  description = 'Le Libéria a établi son FSU en 2021 dans le cadre de la reconstruction post-conflit. Le programme finance l''extension des réseaux mobiles et la connectivité des établissements publics dans les comtés ruraux.',
  population = '5,4 millions',
  capital = 'Monrovia',
  fsu_established = '2021',
  fsu_budget = '4 milliards FCFA',
  fsu_coordinator_name = 'Mme Grace Freeman',
  fsu_coordinator_email = 'fsu@liberia.gov',
  fsu_coordinator_phone = '+231 880 000 000'
WHERE code_iso = 'lr' AND description IS NULL;

-- Mali
UPDATE public.countries SET
  official_name = 'République du Mali',
  flag_url = 'https://flagcdn.com/w320/ml.png',
  description = 'Le Mali a créé son FSU en 2018 pour lutter contre la fracture numérique dans les vastes zones sahéliennes. Le programme soutient les cybercentres ruraux et la connectivité des services de santé et d''éducation.',
  population = '22,6 millions',
  capital = 'Bamako',
  fsu_established = '2018',
  fsu_budget = '15 milliards FCFA',
  fsu_coordinator_name = 'M. Oumar Traoré',
  fsu_coordinator_email = 'fsu@mali.gov',
  fsu_coordinator_phone = '+223 70 00 00 00'
WHERE code_iso = 'ml' AND description IS NULL;

-- Niger
UPDATE public.countries SET
  official_name = 'République du Niger',
  flag_url = 'https://flagcdn.com/w320/ne.png',
  description = 'Le Niger a mis en place son FSU en 2020 pour connecter les vastes zones sahariennes et sahéliennes du pays. Le programme priorise la couverture mobile rurale et les solutions numériques pour l''éducation et la santé.',
  population = '27,2 millions',
  capital = 'Niamey',
  fsu_established = '2020',
  fsu_budget = '8 milliards FCFA',
  fsu_coordinator_name = 'M. Issaka Abdou',
  fsu_coordinator_email = 'fsu@niger.gov',
  fsu_coordinator_phone = '+227 90 00 00 00'
WHERE code_iso = 'ne' AND description IS NULL;

-- Nigeria
UPDATE public.countries SET
  official_name = 'République Fédérale du Nigeria',
  flag_url = 'https://flagcdn.com/w320/ng.png',
  description = 'Le Nigeria dispose du plus grand FSU d''Afrique de l''Ouest, créé en 2016. Le programme finance le déploiement de la fibre optique, la connectivité broadband et les projets pilotes 5G. Il coute les zones non desservies et sous-desservies du territoire national.',
  population = '223,8 millions',
  capital = 'Abuja',
  fsu_established = '2016',
  fsu_budget = '120 milliards FCFA',
  fsu_coordinator_name = 'M. Chukwu Eze',
  fsu_coordinator_email = 'fsu@nigeria.gov.ng',
  fsu_coordinator_phone = '+234 800 000 0000'
WHERE code_iso = 'ng' AND description IS NULL;

-- Sierra Leone
UPDATE public.countries SET
  official_name = 'République de Sierra Leone',
  flag_url = 'https://flagcdn.com/w320/sl.png',
  description = 'La Sierra Leone a lancé son FSU en 2022 pour accélérer l''inclusion numérique après la période post-Ebola. Le programme finance les télécentres communautaires et la connectivité des établissements scolaires.',
  population = '8,6 millions',
  capital = 'Freetown',
  fsu_established = '2022',
  fsu_budget = '3 milliards FCFA',
  fsu_coordinator_name = 'M. Ibrahim Kamara',
  fsu_coordinator_email = 'fsu@sierraleone.gov',
  fsu_coordinator_phone = '+232 76 000 000'
WHERE code_iso = 'sl' AND description IS NULL;

-- Togo
UPDATE public.countries SET
  official_name = 'République Togolaise',
  flag_url = 'https://flagcdn.com/w320/tg.png',
  description = 'Le Togo a créé son FSU en 2019 avec une vision ambitieuse de transformation numérique. Le programme finance des projets de connectivité rurale, des espaces numériques de coworking et l''e-administration dans les préfectures.',
  population = '8,8 millions',
  capital = 'Lomé',
  fsu_established = '2019',
  fsu_budget = '7 milliards FCFA',
  fsu_coordinator_name = 'Mme Afi Mensah',
  fsu_coordinator_email = 'fsu@togo.gouv',
  fsu_coordinator_phone = '+228 22 00 00 00'
WHERE code_iso = 'tg' AND description IS NULL;

-- =====================
-- CEEAC countries
-- =====================

-- Cameroun
UPDATE public.countries SET
  official_name = 'République du Cameroun',
  flag_url = 'https://flagcdn.com/w320/cm.png',
  description = 'Le Cameroun a établi son FSU en 2017 pour réduire la fracture numérique entre zones urbaines et rurales. Le programme finance le déploiement de la fibre optique et les centres multimédia communautaires dans les régions enclavées.',
  population = '28,6 millions',
  capital = 'Yaoundé',
  fsu_established = '2017',
  fsu_budget = '18 milliards FCFA',
  fsu_coordinator_name = 'M. Paul Nganou',
  fsu_coordinator_email = 'fsu@cameroun.gov',
  fsu_coordinator_phone = '+237 6 00 00 00 00'
WHERE code_iso = 'cm' AND description IS NULL;

-- Centrafrique
UPDATE public.countries SET
  official_name = 'République centrafricaine',
  flag_url = 'https://flagcdn.com/w320/cf.png',
  description = 'La Centrafrique a initié son FSU en 2022 avec l''appui de partenaires internationaux pour reconstruire les infrastructures de télécommunication. Le programme cible la connectivité des zones post-conflit et les services numériques de base.',
  population = '5,7 millions',
  capital = 'Bangui',
  fsu_established = '2022',
  fsu_budget = '2,5 milliards FCFA',
  fsu_coordinator_name = 'M. Jean-Bédel Bango',
  fsu_coordinator_email = 'fsu@centrafrique.gov',
  fsu_coordinator_phone = '+236 70 00 00 00'
WHERE code_iso = 'cf' AND description IS NULL;

-- Tchad
UPDATE public.countries SET
  official_name = 'République du Tchad',
  flag_url = 'https://flagcdn.com/w320/td.png',
  description = 'Le Tchad a créé son FSU en 2021 pour étendre la couverture télécom dans les vastes zones sahariennes et sahéliennes. Le programme priorise la connectivité des services publics et les solutions satellitaires pour les zones isolées.',
  population = '18,3 millions',
  capital = 'N''Djamena',
  fsu_established = '2021',
  fsu_budget = '5 milliards FCFA',
  fsu_coordinator_name = 'M. Hassan Mahamat',
  fsu_coordinator_email = 'fsu@tchad.gov',
  fsu_coordinator_phone = '+235 66 00 00 00'
WHERE code_iso = 'td' AND description IS NULL;

-- Congo
UPDATE public.countries SET
  official_name = 'République du Congo',
  flag_url = 'https://flagcdn.com/w320/cg.png',
  description = 'Le Congo a établi son FSU en 2019 pour développer la connectivité dans les zones forestières et rurales. Le programme finance la fibre optique le long du fleuve Congo et les centres numériques départementaux.',
  population = '5,8 millions',
  capital = 'Brazzaville',
  fsu_established = '2019',
  fsu_budget = '6 milliards FCFA',
  fsu_coordinator_name = 'M. Guy Okemba',
  fsu_coordinator_email = 'fsu@congo.gov',
  fsu_coordinator_phone = '+242 06 000 00 00'
WHERE code_iso = 'cg' AND description IS NULL;

-- Gabon
UPDATE public.countries SET
  official_name = 'République gabonaise',
  flag_url = 'https://flagcdn.com/w320/ga.png',
  description = 'Le Gabon a créé son FSU en 2018 pour accélérer la transformation numérique du pays. Le programme finance la connectivité broadband, les réseaux urbains et les projets d''inclusion numérique dans les provinces.',
  population = '2,4 millions',
  capital = 'Libreville',
  fsu_established = '2018',
  fsu_budget = '10 milliards FCFA',
  fsu_coordinator_name = 'Mme Nadine Ondo',
  fsu_coordinator_email = 'fsu@gabon.gov',
  fsu_coordinator_phone = '+241 01 00 00 00'
WHERE code_iso = 'ga' AND description IS NULL;

-- Guinée équatoriale
UPDATE public.countries SET
  official_name = 'République de Guinée équatoriale',
  flag_url = 'https://flagcdn.com/w320/gq.png',
  description = 'La Guinée équatoriale a lancé son FSU en 2022 pour étendre la connectivité sur l''île de Bioko et dans la région continentale. Le programme finance les infrastructures de télécommunication et les services numériques.',
  population = '1,7 millions',
  capital = 'Malabo',
  fsu_established = '2022',
  fsu_budget = '4 milliards FCFA',
  fsu_coordinator_name = 'M. Teodoro Obiang Jr.',
  fsu_coordinator_email = 'fsu@guineaecuatorial.gov',
  fsu_coordinator_phone = '+240 333 000 000'
WHERE code_iso = 'gq' AND description IS NULL;

-- Sao Tomé-et-Principe
UPDATE public.countries SET
  official_name = 'République démocratique de Sao Tomé-et-Principe',
  flag_url = 'https://flagcdn.com/w320/st.png',
  description = 'Sao Tomé-et-Principe a initié son FSU en 2023 pour garantir l''accès universel aux télécommunications sur les deux îles. Le programme cible la connectivité broadband et les services numériques publics.',
  population = '0,2 millions',
  capital = 'Sao Tomé',
  fsu_established = '2023',
  fsu_budget = '1 milliard FCFA',
  fsu_coordinator_name = 'M. Carlos Neves',
  fsu_coordinator_email = 'fsu@saotome.gov',
  fsu_coordinator_phone = '+239 222 0000'
WHERE code_iso = 'st' AND description IS NULL;

-- =====================
-- EAC countries
-- =====================

-- Burundi
UPDATE public.countries SET
  official_name = 'République du Burundi',
  flag_url = 'https://flagcdn.com/w320/bi.png',
  description = 'Le Burundi a créé son FSU en 2021 pour étendre la connectivité dans les collines et les zones rurales densément peuplées. Le programme finance les cybercentres communautaires et la connectivité des établissements scolaires.',
  population = '13,2 millions',
  capital = 'Gitega',
  fsu_established = '2021',
  fsu_budget = '3 milliards FCFA',
  fsu_coordinator_name = 'M. Pierre Ndayishimiye',
  fsu_coordinator_email = 'fsu@burundi.gov',
  fsu_coordinator_phone = '+257 79 000 000'
WHERE code_iso = 'bi' AND description IS NULL;

-- Comores
UPDATE public.countries SET
  official_name = 'Union des Comores',
  flag_url = 'https://flagcdn.com/w320/km.png',
  description = 'Les Comores ont établi leur FSU en 2022 pour connecter les quatre îles de l''archipel. Le programme priorise la connectivité inter-îles par fibre sous-marine et les services numériques pour les populations isolées.',
  population = '0,9 millions',
  capital = 'Moroni',
  fsu_established = '2022',
  fsu_budget = '1,5 milliard FCFA',
  fsu_coordinator_name = 'M. Ahmed Soilihi',
  fsu_coordinator_email = 'fsu@comores.gov',
  fsu_coordinator_phone = '+269 770 0000'
WHERE code_iso = 'km' AND description IS NULL;

-- Djibouti
UPDATE public.countries SET
  official_name = 'République de Djibouti',
  flag_url = 'https://flagcdn.com/w320/dj.png',
  description = 'Djibouti a lancé son FSU en 2020 pour tirer parti de sa position stratégique de hub de câbles sous-marins. Le programme finance la connectivité des zones intérieures et les services numériques pour les populations nomades.',
  population = '1,1 millions',
  capital = 'Djibouti',
  fsu_established = '2020',
  fsu_budget = '2 milliards FCFA',
  fsu_coordinator_name = 'M. Omar Farah',
  fsu_coordinator_email = 'fsu@djibouti.gov',
  fsu_coordinator_phone = '+253 77 00 00 00'
WHERE code_iso = 'dj' AND description IS NULL;

-- Érythrée
UPDATE public.countries SET
  official_name = 'État d''Érythrée',
  flag_url = 'https://flagcdn.com/w320/er.png',
  description = 'L''Érythrée a initié son FSU en 2023 pour développer les infrastructures de télécommunication dans les zones montagneuses et semi-arides. Le programme vise la connectivité rurale et les services numériques de base.',
  population = '3,7 millions',
  capital = 'Asmara',
  fsu_established = '2023',
  fsu_budget = '1,5 milliard FCFA',
  fsu_coordinator_name = 'M. Yohannes Ghebre',
  fsu_coordinator_email = 'fsu@eritrea.gov',
  fsu_coordinator_phone = '+291 1 00 000'
WHERE code_iso = 'er' AND description IS NULL;

-- Éthiopie
UPDATE public.countries SET
  official_name = 'République fédérale démocratique d''Éthiopie',
  flag_url = 'https://flagcdn.com/w320/et.png',
  description = 'L''Éthiopie a créé son FSU en 2019 pour accompagner l''ouverture du secteur des télécommunications. Le programme finance le déploiement de la fibre optique, la connectivité rurale et les projets de transformation numérique à grande échelle.',
  population = '126,5 millions',
  capital = 'Addis-Abeba',
  fsu_established = '2019',
  fsu_budget = '45 milliards FCFA',
  fsu_coordinator_name = 'M. Dawit Abebe',
  fsu_coordinator_email = 'fsu@ethiopia.gov',
  fsu_coordinator_phone = '+251 11 000 0000'
WHERE code_iso = 'et' AND description IS NULL;

-- Kenya
UPDATE public.countries SET
  official_name = 'République du Kenya',
  flag_url = 'https://flagcdn.com/w320/ke.png',
  description = 'Le Kenya dispose d''un FSU mature depuis 2015, pionnier de l''innovation numérique en Afrique de l''Est. Le programme finance la connectivité broadband, les hubs numériques ruraux et les projets de mobile banking dans les zones non bancarisées.',
  population = '55,1 millions',
  capital = 'Nairobi',
  fsu_established = '2015',
  fsu_budget = '50 milliards FCFA',
  fsu_coordinator_name = 'M. James Ochieng',
  fsu_coordinator_email = 'fsu@kenya.go.ke',
  fsu_coordinator_phone = '+254 700 000 000'
WHERE code_iso = 'ke' AND description IS NULL;

-- Malawi
UPDATE public.countries SET
  official_name = 'République du Malawi',
  flag_url = 'https://flagcdn.com/w320/mw.png',
  description = 'Le Malawi a établi son FSU en 2020 pour étendre la connectivité dans les zones rurales et lacustres. Le programme finance les télécentres communautaires et la connectivité des services de santé et d''éducation.',
  population = '20,4 millions',
  capital = 'Lilongwe',
  fsu_established = '2020',
  fsu_budget = '4 milliards FCFA',
  fsu_coordinator_name = 'M. Chimwemwe Banda',
  fsu_coordinator_email = 'fsu@malawi.gov',
  fsu_coordinator_phone = '+265 888 000 000'
WHERE code_iso = 'mw' AND description IS NULL;

-- Maurice
UPDATE public.countries SET
  official_name = 'République de Maurice',
  flag_url = 'https://flagcdn.com/w320/mu.png',
  description = 'L''île Maurice dispose d''un FSU avancé depuis 2014, modèle de connectivité insulaire en Afrique. Le programme finance la fibre jusqu''au foyer, les smart cities et l''inclusion numérique des communautés vulnérables.',
  population = '1,3 millions',
  capital = 'Port-Louis',
  fsu_established = '2014',
  fsu_budget = '5 milliards FCFA',
  fsu_coordinator_name = 'Mme Priya Ramgoolam',
  fsu_coordinator_email = 'fsu@mauritius.gov',
  fsu_coordinator_phone = '+230 200 0000'
WHERE code_iso = 'mu' AND description IS NULL;

-- Ouganda
UPDATE public.countries SET
  official_name = 'République de l''Ouganda',
  flag_url = 'https://flagcdn.com/w320/ug.png',
  description = 'L''Ouganda a créé son FSU en 2017 pour étendre la connectivité dans les zones rurales et les districts frontaliers. Le programme finance le déploiement de la fibre optique nationale et les centres d''innovation numérique.',
  population = '48,6 millions',
  capital = 'Kampala',
  fsu_established = '2017',
  fsu_budget = '20 milliards FCFA',
  fsu_coordinator_name = 'M. Robert Mugisha',
  fsu_coordinator_email = 'fsu@uganda.go.ug',
  fsu_coordinator_phone = '+256 700 000 000'
WHERE code_iso = 'ug' AND description IS NULL;

-- RD Congo
UPDATE public.countries SET
  official_name = 'République démocratique du Congo',
  flag_url = 'https://flagcdn.com/w320/cd.png',
  description = 'La RD Congo a établi son FSU en 2019 pour relever le défi de la connectivité dans le plus grand pays d''Afrique subsaharienne. Le programme finance la fibre optique, la couverture mobile des zones rurales et les centres numériques provinciaux.',
  population = '102,3 millions',
  capital = 'Kinshasa',
  fsu_established = '2019',
  fsu_budget = '35 milliards FCFA',
  fsu_coordinator_name = 'M. Félix Kabongo',
  fsu_coordinator_email = 'fsu@rdcongo.gov',
  fsu_coordinator_phone = '+243 810 000 000'
WHERE code_iso = 'cd' AND description IS NULL;

-- Rwanda
UPDATE public.countries SET
  official_name = 'République du Rwanda',
  flag_url = 'https://flagcdn.com/w320/rw.png',
  description = 'Le Rwanda dispose d''un FSU performant depuis 2016, reconnu pour son approche innovante de la transformation numérique. Le programme finance la fibre optique nationale, les smart villages et l''e-gouvernement à l''échelle locale.',
  population = '14,1 millions',
  capital = 'Kigali',
  fsu_established = '2016',
  fsu_budget = '15 milliards FCFA',
  fsu_coordinator_name = 'Mme Claire Uwimana',
  fsu_coordinator_email = 'fsu@rwanda.gov',
  fsu_coordinator_phone = '+250 780 000 000'
WHERE code_iso = 'rw' AND description IS NULL;

-- Seychelles
UPDATE public.countries SET
  official_name = 'République des Seychelles',
  flag_url = 'https://flagcdn.com/w320/sc.png',
  description = 'Les Seychelles ont créé leur FSU en 2018 pour garantir une connectivité optimale sur l''ensemble de l''archipel. Le programme finance la fibre sous-marine inter-îles et les services numériques pour les îles extérieures.',
  population = '0,1 millions',
  capital = 'Victoria',
  fsu_established = '2018',
  fsu_budget = '1 milliard FCFA',
  fsu_coordinator_name = 'M. Jean-Paul Adam',
  fsu_coordinator_email = 'fsu@seychelles.gov',
  fsu_coordinator_phone = '+248 400 0000'
WHERE code_iso = 'sc' AND description IS NULL;

-- Somalie
UPDATE public.countries SET
  official_name = 'République fédérale de Somalie',
  flag_url = 'https://flagcdn.com/w320/so.png',
  description = 'La Somalie a initié son FSU en 2023 pour reconstruire les infrastructures de télécommunication après des décennies de conflit. Le programme finance la connectivité mobile et les services numériques dans les régions stabilisées.',
  population = '18,1 millions',
  capital = 'Mogadiscio',
  fsu_established = '2023',
  fsu_budget = '2 milliards FCFA',
  fsu_coordinator_name = 'M. Hassan Mohamud',
  fsu_coordinator_email = 'fsu@somalia.gov',
  fsu_coordinator_phone = '+252 61 000 0000'
WHERE code_iso = 'so' AND description IS NULL;

-- Soudan du Sud
UPDATE public.countries SET
  official_name = 'République du Soudan du Sud',
  flag_url = 'https://flagcdn.com/w320/ss.png',
  description = 'Le Soudan du Sud a lancé son FSU en 2023 pour développer les télécommunications dans le plus jeune pays d''Afrique. Le programme cible la couverture mobile des zones rurales et la connectivité des services essentiels.',
  population = '11,6 millions',
  capital = 'Djouba',
  fsu_established = '2023',
  fsu_budget = '1,5 milliard FCFA',
  fsu_coordinator_name = 'M. John Garang Jr.',
  fsu_coordinator_email = 'fsu@southsudan.gov',
  fsu_coordinator_phone = '+211 920 000 000'
WHERE code_iso = 'ss' AND description IS NULL;

-- Tanzanie
UPDATE public.countries SET
  official_name = 'République unie de Tanzanie',
  flag_url = 'https://flagcdn.com/w320/tz.png',
  description = 'La Tanzanie a créé son FSU en 2017 pour connecter les zones rurales et les îles de Zanzibar. Le programme finance le déploiement de la fibre optique nationale et les centres numériques de district.',
  population = '65,5 millions',
  capital = 'Dodoma',
  fsu_established = '2017',
  fsu_budget = '25 milliards FCFA',
  fsu_coordinator_name = 'M. Joseph Mwambe',
  fsu_coordinator_email = 'fsu@tanzania.go.tz',
  fsu_coordinator_phone = '+255 760 000 000'
WHERE code_iso = 'tz' AND description IS NULL;

-- Zambie
UPDATE public.countries SET
  official_name = 'République de Zambie',
  flag_url = 'https://flagcdn.com/w320/zm.png',
  description = 'La Zambie a établi son FSU en 2018 pour étendre la connectivité dans les zones rurales et minières. Le programme finance les tours de télécommunication, la fibre optique et les centres numériques communautaires.',
  population = '20,0 millions',
  capital = 'Lusaka',
  fsu_established = '2018',
  fsu_budget = '12 milliards FCFA',
  fsu_coordinator_name = 'M. Chanda Bwalya',
  fsu_coordinator_email = 'fsu@zambia.gov',
  fsu_coordinator_phone = '+260 970 000 000'
WHERE code_iso = 'zm' AND description IS NULL;

-- =====================
-- SADC countries
-- =====================

-- Angola
UPDATE public.countries SET
  official_name = 'République d''Angola',
  flag_url = 'https://flagcdn.com/w320/ao.png',
  description = 'L''Angola a créé son FSU en 2019 pour diversifier l''économie au-delà du pétrole via le numérique. Le programme finance la fibre optique nationale, la connectivité des provinces intérieures et les centres numériques communautaires.',
  population = '36,7 millions',
  capital = 'Luanda',
  fsu_established = '2019',
  fsu_budget = '25 milliards FCFA',
  fsu_coordinator_name = 'M. António Domingos',
  fsu_coordinator_email = 'fsu@angola.gov',
  fsu_coordinator_phone = '+244 920 000 000'
WHERE code_iso = 'ao' AND description IS NULL;

-- Botswana
UPDATE public.countries SET
  official_name = 'République du Botswana',
  flag_url = 'https://flagcdn.com/w320/bw.png',
  description = 'Le Botswana a établi son FSU en 2017 pour connecter les communautés rurales du désert du Kalahari. Le programme finance la fibre optique, les réseaux mobiles et les smart villages dans les districts reculés.',
  population = '2,6 millions',
  capital = 'Gaborone',
  fsu_established = '2017',
  fsu_budget = '8 milliards FCFA',
  fsu_coordinator_name = 'M. Tshiamo Phiri',
  fsu_coordinator_email = 'fsu@botswana.gov',
  fsu_coordinator_phone = '+267 390 0000'
WHERE code_iso = 'bw' AND description IS NULL;

-- Eswatini
UPDATE public.countries SET
  official_name = 'Royaume d''Eswatini',
  flag_url = 'https://flagcdn.com/w320/sz.png',
  description = 'Eswatini a créé son FSU en 2019 pour étendre la connectivité dans les zones rurales du royaume. Le programme finance les cybercentres communautaires et les projets de numérique éducatif.',
  population = '1,2 millions',
  capital = 'Mbabane',
  fsu_established = '2019',
  fsu_budget = '2 milliards FCFA',
  fsu_coordinator_name = 'M. Sibusiso Dlamini',
  fsu_coordinator_email = 'fsu@eswatini.gov',
  fsu_coordinator_phone = '+268 2404 0000'
WHERE code_iso = 'sz' AND description IS NULL;

-- Lesotho
UPDATE public.countries SET
  official_name = 'Royaume du Lesotho',
  flag_url = 'https://flagcdn.com/w320/ls.png',
  description = 'Le Lesotho a établi son FSU en 2020 pour connecter les communautés de montagne difficiles d''accès. Le programme finance les solutions sans fil et les centres numériques dans les districts montagneux.',
  population = '2,3 millions',
  capital = 'Maseru',
  fsu_established = '2020',
  fsu_budget = '2,5 milliards FCFA',
  fsu_coordinator_name = 'Mme Limakatso Mosisili',
  fsu_coordinator_email = 'fsu@lesotho.gov',
  fsu_coordinator_phone = '+266 2200 0000'
WHERE code_iso = 'ls' AND description IS NULL;

-- Madagascar
UPDATE public.countries SET
  official_name = 'République de Madagascar',
  flag_url = 'https://flagcdn.com/w320/mg.png',
  description = 'Madagascar a créé son FSU en 2020 pour étendre la connectivité dans les vastes zones rurales de l''île. Le programme finance les infrastructures résilientes aux cyclones et les centres numériques communautaires.',
  population = '30,3 millions',
  capital = 'Antananarivo',
  fsu_established = '2020',
  fsu_budget = '10 milliards FCFA',
  fsu_coordinator_name = 'M. Hery Rakotomanana',
  fsu_coordinator_email = 'fsu@madagascar.gov',
  fsu_coordinator_phone = '+261 32 00 000 00'
WHERE code_iso = 'mg' AND description IS NULL;

-- Namibie
UPDATE public.countries SET
  official_name = 'République de Namibie',
  flag_url = 'https://flagcdn.com/w320/na.png',
  description = 'La Namibie a établi son FSU en 2018 pour connecter les vastes zones arides et peu peuplées du pays. Le programme finance les solutions sans fil à longue portée et les centres numériques régionaux.',
  population = '2,6 millions',
  capital = 'Windhoek',
  fsu_established = '2018',
  fsu_budget = '5 milliards FCFA',
  fsu_coordinator_name = 'M. Gideon Shikongo',
  fsu_coordinator_email = 'fsu@namibia.gov',
  fsu_coordinator_phone = '+264 61 000 000'
WHERE code_iso = 'na' AND description IS NULL;

-- Zimbabwe
UPDATE public.countries SET
  official_name = 'République du Zimbabwe',
  flag_url = 'https://flagcdn.com/w320/zw.png',
  description = 'Le Zimbabwe a créé son FSU en 2019 pour développer la connectivité dans les zones rurales et les communautés agricoles. Le programme finance les tours de télécommunication et les centres d''innovation numérique.',
  population = '16,7 millions',
  capital = 'Harare',
  fsu_established = '2019',
  fsu_budget = '8 milliards FCFA',
  fsu_coordinator_name = 'M. Tendai Moyo',
  fsu_coordinator_email = 'fsu@zimbabwe.gov',
  fsu_coordinator_phone = '+263 770 000 000'
WHERE code_iso = 'zw' AND description IS NULL;

-- =====================
-- UMA countries
-- =====================

-- Algérie
UPDATE public.countries SET
  official_name = 'République algérienne démocratique et populaire',
  flag_url = 'https://flagcdn.com/w320/dz.png',
  description = 'L''Algérie a établi son FSU en 2017 pour accélérer la transformation numérique du pays. Le programme finance le déploiement de la fibre optique à grande échelle, la connectivité du Sahara et les services numériques publics.',
  population = '45,6 millions',
  capital = 'Alger',
  fsu_established = '2017',
  fsu_budget = '80 milliards FCFA',
  fsu_coordinator_name = 'M. Karim Benali',
  fsu_coordinator_email = 'fsu@algeria.gov.dz',
  fsu_coordinator_phone = '+213 21 00 00 00'
WHERE code_iso = 'dz' AND description IS NULL;

-- Libye
UPDATE public.countries SET
  official_name = 'État de Libye',
  flag_url = 'https://flagcdn.com/w320/ly.png',
  description = 'La Libye a initié son FSU en 2023 pour reconstruire les infrastructures de télécommunication après les conflits. Le programme finance la connectivité des zones stabilisées et les services numériques essentiels.',
  population = '7,2 millions',
  capital = 'Tripoli',
  fsu_established = '2023',
  fsu_budget = '5 milliards FCFA',
  fsu_coordinator_name = 'M. Omar El-Mabrouk',
  fsu_coordinator_email = 'fsu@libya.gov',
  fsu_coordinator_phone = '+218 21 000 0000'
WHERE code_iso = 'ly' AND description IS NULL;

-- Maroc
UPDATE public.countries SET
  official_name = 'Royaume du Maroc',
  flag_url = 'https://flagcdn.com/w320/ma.png',
  description = 'Le Maroc dispose d''un FSU mature depuis 2015, reconnu pour son programme ambitieux de généralisation du broadband. Le programme finance la fibre optique, les réseaux 4G/5G et les projets d''inclusion numérique dans les zones montagneuses et rurales.',
  population = '37,8 millions',
  capital = 'Rabat',
  fsu_established = '2015',
  fsu_budget = '70 milliards FCFA',
  fsu_coordinator_name = 'Mme Fatima-Zahra El Amrani',
  fsu_coordinator_email = 'fsu@maroc.gov.ma',
  fsu_coordinator_phone = '+212 5 00 00 00 00'
WHERE code_iso = 'ma' AND description IS NULL;

-- Mauritanie
UPDATE public.countries SET
  official_name = 'République islamique de Mauritanie',
  flag_url = 'https://flagcdn.com/w320/mr.png',
  description = 'La Mauritanie a créé son FSU en 2020 pour connecter les vastes zones sahariennes et les communautés nomades. Le programme finance les solutions satellitaires et les centres numériques dans les wilayas intérieures.',
  population = '4,9 millions',
  capital = 'Nouakchott',
  fsu_established = '2020',
  fsu_budget = '4 milliards FCFA',
  fsu_coordinator_name = 'M. Mohamed Ould Ahmed',
  fsu_coordinator_email = 'fsu@mauritanie.gov',
  fsu_coordinator_phone = '+222 2000 0000'
WHERE code_iso = 'mr' AND description IS NULL;

-- Sahara occidental
UPDATE public.countries SET
  official_name = 'République arabe sahraouie démocratique',
  flag_url = 'https://flagcdn.com/w320/eh.png',
  description = 'Territoire en cours de stabilisation, des initiatives de connectivité sont en cours avec le soutien de partenaires régionaux pour fournir l''accès aux télécommunications de base aux populations locales.',
  population = '0,6 millions',
  capital = 'Laâyoune',
  fsu_established = NULL,
  fsu_budget = NULL,
  fsu_coordinator_name = NULL,
  fsu_coordinator_email = NULL,
  fsu_coordinator_phone = NULL
WHERE code_iso = 'eh' AND description IS NULL;

-- Tunisie
UPDATE public.countries SET
  official_name = 'République tunisienne',
  flag_url = 'https://flagcdn.com/w320/tn.png',
  description = 'La Tunisie a établi son FSU en 2016 pour accélérer la transformation numérique post-révolution. Le programme finance la fibre optique, les smart cities et les projets d''inclusion numérique dans les régions intérieures.',
  population = '12,5 millions',
  capital = 'Tunis',
  fsu_established = '2016',
  fsu_budget = '20 milliards FCFA',
  fsu_coordinator_name = 'M. Amine Boukadida',
  fsu_coordinator_email = 'fsu@tunisie.gov.tn',
  fsu_coordinator_phone = '+216 71 000 000'
WHERE code_iso = 'tn' AND description IS NULL;

-- =====================
-- North Africa
-- =====================

-- Égypte
UPDATE public.countries SET
  official_name = 'République arabe d''Égypte',
  flag_url = 'https://flagcdn.com/w320/eg.png',
  description = 'L''Égypte dispose d''un FSU mature depuis 2014, l''un des plus anciens d''Afrique. Le programme finance le déploiement de la fibre optique, les réseaux 4G/5G et les projets de digitalisation des services publics à l''échelle nationale.',
  population = '109,3 millions',
  capital = 'Le Caire',
  fsu_established = '2014',
  fsu_budget = '100 milliards FCFA',
  fsu_coordinator_name = 'M. Hassan El-Sayed',
  fsu_coordinator_email = 'fsu@egypt.gov.eg',
  fsu_coordinator_phone = '+20 2 000 0000'
WHERE code_iso = 'eg' AND description IS NULL;
