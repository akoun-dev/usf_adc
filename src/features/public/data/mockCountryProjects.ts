export interface CountryProject {
  id: string;
  countryCode: string;
  title: string;
  description: string;
  status: 'en_cours' | 'termine' | 'a_venir';
  thematic: string;
  startDate: string;
  endDate: string;
  budget: string;
  beneficiaries: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  progress: number;
  images: string[];
}

export const THEMATIC_LABELS: Record<string, string> = {
  'connectivite': 'Connectivité',
  'education': 'Éducation Numérique',
  'sante': 'E-Santé',
  'agriculture': 'Agriculture Numérique',
  'gouvernement': 'E-Gouvernement',
  'entreprises': 'Accompagnement Entreprises',
  'formation': 'Formation Numérique',
  'inclusion': 'Inclusion Numérique',
};

export const STATUS_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  'en_cours': { label: 'En cours', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20', icon: '🔄' },
  'termine': { label: 'Terminé', color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20', icon: '✅' },
  'a_venir': { label: 'À venir', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20', icon: '📅' },
};

export const mockCountryProjects: CountryProject[] = [
  // CÔTE D'IVOIRE
  {
    id: 'ci-1',
    countryCode: 'CI',
    title: 'Connectivité Rurale Phase 1 - Nord',
    description: 'Déploiement de la connectivité haut débit dans 150 localités du Nord de la Côte d\'Ivoire, avec focus sur les zones frontalières avec le Mali et le Burkina Faso.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2024-01-15',
    endDate: '2025-12-31',
    budget: '8 milliards FCFA',
    beneficiaries: '300 000 personnes',
    location: { lat: 9.5, lng: -5.5, address: 'Korhogo, Région des Savanes' },
    progress: 65,
    images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80']
  },
  {
    id: 'ci-2',
    countryCode: 'CI',
    title: 'Écoles Numériques Côte d\'Ivoire',
    description: 'Équipement de 200 écoles primaires en ordinateurs, connexion internet et formation des enseignants à l\'usage pédagogique du numérique.',
    status: 'en_cours',
    thematic: 'education',
    startDate: '2024-03-01',
    endDate: '2025-08-31',
    budget: '5 milliards FCFA',
    beneficiaries: '50 000 élèves',
    location: { lat: 5.5, lng: -4.0, address: 'Abidjan et intérieur du pays' },
    progress: 40,
    images: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80']
  },
  {
    id: 'ci-3',
    countryCode: 'CI',
    title: 'E-Santé Communautaire',
    description: 'Mise en place de centres de santé connectés dans 80 localités rurales, permettant la télémédecine et la gestion électronique des dossiers patients.',
    status: 'en_cours',
    thematic: 'sante',
    startDate: '2023-09-01',
    endDate: '2025-06-30',
    budget: '6 milliards FCFA',
    beneficiaries: '200 000 personnes',
    location: { lat: 6.5, lng: -5.0, address: 'Bouaké et région' },
    progress: 55,
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80']
  },
  {
    id: 'ci-4',
    countryCode: 'CI',
    title: 'Inclusion Numérique des Femmes',
    description: 'Formation de 5000 femmes à l\'entreprenariat numérique et création de 50 télécentres gérés par des femmes.',
    status: 'en_cours',
    thematic: 'inclusion',
    startDate: '2024-02-01',
    endDate: '2025-12-31',
    budget: '3 milliards FCFA',
    beneficiaries: '5 000 femmes',
    location: { lat: 5.0, lng: -3.5, address: 'Yamoussoukro et environs' },
    progress: 35,
    images: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80']
  },
  {
    id: 'ci-5',
    countryCode: 'CI',
    title: 'Plateforme E-Gouvernement',
    description: 'Développement d\'une plateforme unifiée de services en ligne pour les citoyens ivoiriens.',
    status: 'termine',
    thematic: 'gouvernement',
    startDate: '2022-01-01',
    endDate: '2023-12-31',
    budget: '4 milliards FCFA',
    beneficiaries: '5 millions d\'usagers potentiels',
    location: { lat: 5.35, lng: -4.0, address: 'Abidjan' },
    progress: 100,
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80']
  },

  // SÉNÉGAL
  {
    id: 'sn-1',
    countryCode: 'SN',
    title: 'Sites Solaires Autonomes',
    description: 'Déploiement de 150 sites télécoms alimentés par énergie solaire dans les zones les plus isolées du Sénégal oriental.',
    status: 'termine',
    thematic: 'connectivite',
    startDate: '2022-03-01',
    endDate: '2023-12-31',
    budget: '12 milliards FCFA',
    beneficiaries: '300 000 personnes',
    location: { lat: 14.5, lng: -12.5, address: 'Tambacounda' },
    progress: 100,
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80']
  },
  {
    id: 'sn-2',
    countryCode: 'SN',
    title: 'Sénégal Numérique 2025',
    description: 'Programme global de digitalisation des services publics et de formation aux compétences numériques.',
    status: 'en_cours',
    thematic: 'gouvernement',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    budget: '20 milliards FCFA',
    beneficiaries: '10 millions de Sénégalais',
    location: { lat: 14.7, lng: -17.5, address: 'Dakar' },
    progress: 60,
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80']
  },
  {
    id: 'sn-3',
    countryCode: 'SN',
    title: 'Écoles Connectées Sénégal',
    description: 'Connexion de 300 écoles à internet et formation de 1000 enseignants.',
    status: 'en_cours',
    thematic: 'education',
    startDate: '2023-09-01',
    endDate: '2025-06-30',
    budget: '8 milliards FCFA',
    beneficiaries: '75 000 élèves',
    location: { lat: 14.0, lng: -16.0, address: 'Kaolack, Fatick, etc.' },
    progress: 45,
    images: ['https://images.unsplash.com/photo-1577896339272-a70713bb0bc0?w=800&q=80']
  },
  {
    id: 'sn-4',
    countryCode: 'SN',
    title: 'Agriculture Intelligente Sénégal',
    description: 'Déploiement de capteurs connectés et formation des agriculteurs aux outils numériques.',
    status: 'en_cours',
    thematic: 'agriculture',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    budget: '5 milliards FCFA',
    beneficiaries: '15 000 agriculteurs',
    location: { lat: 13.5, lng: -15.0, address: 'Saint-Louis et vallée du fleuve' },
    progress: 30,
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80']
  },
  {
    id: 'sn-5',
    countryCode: 'SN',
    title: 'Incubateur Numérique Dakar',
    description: 'Création d\'un incubateur pour startups numériques avec accompagnement et financement.',
    status: 'en_cours',
    thematic: 'entreprises',
    startDate: '2023-06-01',
    endDate: '2026-06-30',
    budget: '7 milliards FCFA',
    beneficiaries: '200 startups',
    location: { lat: 14.7, lng: -17.5, address: 'Dakar, Plateau' },
    progress: 50,
    images: ['https://images.unsplash.com/photo-1559136555-17ad3d2a4e02?w=800&q=80']
  },

  // MALI
  {
    id: 'ml-1',
    countryCode: 'ML',
    title: 'Connexion Zones Sahariennes',
    description: 'Déploiement de solutions de connectivité VSAT et fibre dans les régions de Tombouctou, Gao et Kidal.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2024-06-01',
    endDate: '2026-12-31',
    budget: '25 milliards FCFA',
    beneficiaries: '500 000 personnes',
    location: { lat: 17.5, lng: -3.0, address: 'Tombouctou' },
    progress: 25,
    images: ['https://images.unsplash.com/photo-1548685913-fe6678b4d4a5?w=800&q=80']
  },
  {
    id: 'ml-2',
    countryCode: 'ML',
    title: 'E-Santé Nord Mali',
    description: 'Équipement de centres de santé en téléconsultation et gestion électronique.',
    status: 'a_venir',
    thematic: 'sante',
    startDate: '2025-01-01',
    endDate: '2027-12-31',
    budget: '10 milliards FCFA',
    beneficiaries: '300 000 personnes',
    location: { lat: 16.5, lng: -0.0, address: 'Gao' },
    progress: 0,
    images: ['https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80']
  },
  {
    id: 'ml-3',
    countryCode: 'ML',
    title: 'Formation Numérique Jeunes Mali',
    description: 'Formation de 5000 jeunes aux métiers du numérique (développement, design, marketing digital).',
    status: 'en_cours',
    thematic: 'formation',
    startDate: '2024-03-01',
    endDate: '2025-12-31',
    budget: '5 milliards FCFA',
    beneficiaries: '5 000 jeunes',
    location: { lat: 12.5, lng: -8.0, address: 'Bamako' },
    progress: 40,
    images: ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80']
  },

  // BURKINA FASO
  {
    id: 'bf-1',
    countryCode: 'BF',
    title: 'Connectivité Région Est',
    description: 'Connexion des zones frontalières difficiles d\'accès de la région de l\'Est.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2024-01-01',
    endDate: '2026-06-30',
    budget: '8 milliards FCFA',
    beneficiaries: '250 000 personnes',
    location: { lat: 12.0, lng: 0.5, address: 'Fada N\'Gourma' },
    progress: 35,
    images: ['https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80']
  },
  {
    id: 'bf-2',
    countryCode: 'BF',
    title: 'Écoles du Sahel Connectées',
    description: 'Équipement de 100 écoles en matériel informatique et connexion internet.',
    status: 'en_cours',
    thematic: 'education',
    startDate: '2024-02-01',
    endDate: '2025-12-31',
    budget: '4 milliards FCFA',
    beneficiaries: '25 000 élèves',
    location: { lat: 13.0, lng: -2.0, address: 'Ouagadougou et région' },
    progress: 30,
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80']
  },
  {
    id: 'bf-3',
    countryCode: 'BF',
    title: 'Télémédecine Burkina',
    description: 'Mise en place de 50 centres de télémédecine dans les zones rurales.',
    status: 'a_venir',
    thematic: 'sante',
    startDate: '2025-03-01',
    endDate: '2027-12-31',
    budget: '6 milliards FCFA',
    beneficiaries: '150 000 personnes',
    location: { lat: 12.5, lng: -1.5, address: 'Kaya' },
    progress: 0,
    images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80']
  },

  // NIGERIA
  {
    id: 'ng-1',
    countryCode: 'NG',
    title: 'Broadband for All Nigeria',
    description: 'Déploiement du haut débit dans 5000 localités rurales.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2023-01-01',
    endDate: '2027-12-31',
    budget: '50 milliards FCFA',
    beneficiaries: '20 millions de Nigérians',
    location: { lat: 9.0, lng: 7.5, address: 'Abuja' },
    progress: 35,
    images: ['https://images.unsplash.com/photo-1526304640152-d4619684e485?w=800&q=80']
  },
  {
    id: 'ng-2',
    countryCode: 'NG',
    title: 'Digital Skills Nigeria',
    description: 'Formation de 1 million de jeunes aux compétences numériques.',
    status: 'en_cours',
    thematic: 'formation',
    startDate: '2022-06-01',
    endDate: '2026-12-31',
    budget: '30 milliards FCFA',
    beneficiaries: '1 000 000 jeunes',
    location: { lat: 6.5, lng: 3.5, address: 'Lagos' },
    progress: 50,
    images: ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80']
  },
  {
    id: 'ng-3',
    countryCode: 'NG',
    title: 'E-Agriculture Nigeria',
    description: 'Plateforme numérique pour les agriculteurs avec informations météo et marché.',
    status: 'en_cours',
    thematic: 'agriculture',
    startDate: '2023-09-01',
    endDate: '2026-06-30',
    budget: '15 milliards FCFA',
    beneficiaries: '5 millions d\'agriculteurs',
    location: { lat: 10.0, lng: 8.0, address: 'Kano' },
    progress: 40,
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80']
  },

  // CAMEROUN
  {
    id: 'cm-1',
    countryCode: 'CM',
    title: 'Fibre Cameroun Nord',
    description: 'Déploiement de la fibre optique dans les régions du Nord.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    budget: '15 milliards FCFA',
    beneficiaries: '400 000 personnes',
    location: { lat: 10.0, lng: 14.0, address: 'Garoua' },
    progress: 30,
    images: ['https://images.unsplash.com/photo-1554446342-c3e3e7fe8adc?w=800&q=80']
  },
  {
    id: 'cm-2',
    countryCode: 'CM',
    title: 'E-Santé Cameroun',
    description: 'Digitalisation des centres de santé ruraux.',
    status: 'en_cours',
    thematic: 'sante',
    startDate: '2023-06-01',
    endDate: '2025-12-31',
    budget: '10 milliards FCFA',
    beneficiaries: '500 000 personnes',
    location: { lat: 4.0, lng: 9.5, address: 'Douala' },
    progress: 45,
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80']
  },
  {
    id: 'cm-3',
    countryCode: 'CM',
    title: 'Startups Cameroun',
    description: 'Financement et accompagnement de startups numériques.',
    status: 'en_cours',
    thematic: 'entreprises',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    budget: '8 milliards FCFA',
    beneficiaries: '100 startups',
    location: { lat: 3.9, lng: 11.5, address: 'Yaoundé' },
    progress: 55,
    images: ['https://images.unsplash.com/photo-1559136555-17ad3d2a4e02?w=800&q=80']
  },

  // KENYA
  {
    id: 'ke-1',
    countryCode: 'KE',
    title: 'Satellite Internet Kenya',
    description: 'Déploiement de Starlink dans les zones arides du Nord.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    budget: '20 milliards FCFA',
    beneficiaries: '1 million de Kenyans',
    location: { lat: 1.5, lng: 37.5, address: 'Marsabit' },
    progress: 40,
    images: ['https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&q=80']
  },
  {
    id: 'ke-2',
    countryCode: 'KE',
    title: 'Smart Villages Kenya',
    description: 'Création de 100 villages intelligents avec services numériques intégrés.',
    status: 'en_cours',
    thematic: 'gouvernement',
    startDate: '2023-06-01',
    endDate: '2027-12-31',
    budget: '25 milliards FCFA',
    beneficiaries: '500 000 personnes',
    location: { lat: -1.0, lng: 37.0, address: 'Nairobi' },
    progress: 35,
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80']
  },

  // RWANDA
  {
    id: 'rw-1',
    countryCode: 'RW',
    title: 'Fibre Optique Nationwide',
    description: 'Extension du réseau fibre optique à tout le pays.',
    status: 'termine',
    thematic: 'connectivite',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    budget: '15 milliards FCFA',
    beneficiaries: '10 millions de Rwandais',
    location: { lat: -1.9, lng: 30.0, address: 'Kigali' },
    progress: 100,
    images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80']
  },
  {
    id: 'rw-2',
    countryCode: 'RW',
    title: 'Irembo Phase 2',
    description: 'Extension de la plateforme de services en ligne.',
    status: 'en_cours',
    thematic: 'gouvernement',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    budget: '10 milliards FCFA',
    beneficiaries: '5 millions d\'usagers',
    location: { lat: -1.9, lng: 30.0, address: 'Kigali' },
    progress: 50,
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80']
  },

  // AFRIQUE DU SUD
  {
    id: 'za-1',
    countryCode: 'ZA',
    title: 'Townships Connectivity',
    description: 'Connectivité haut débit pour les townships.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2022-06-01',
    endDate: '2027-12-31',
    budget: '30 milliards FCFA',
    beneficiaries: '10 millions de Sud-Africains',
    location: { lat: -26.0, lng: 28.0, address: 'Johannesburg' },
    progress: 45,
    images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80']
  },
  {
    id: 'za-2',
    countryCode: 'ZA',
    title: 'Digital Skills Township',
    description: 'Formation numérique dans les townships.',
    status: 'en_cours',
    thematic: 'formation',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    budget: '20 milliards FCFA',
    beneficiaries: '500 000 jeunes',
    location: { lat: -34.0, lng: 18.5, address: 'Le Cap' },
    progress: 40,
    images: ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80']
  },

  // MAROC
  {
    id: 'ma-1',
    countryCode: 'MA',
    title: '4G+ Rural Maroc',
    description: 'Extension du réseau 4G+ dans les zones rurales du Haut Atlas.',
    status: 'termine',
    thematic: 'connectivite',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    budget: '20 milliards FCFA',
    beneficiaries: '5 millions de Marocains',
    location: { lat: 31.5, lng: -7.5, address: 'Marrakech' },
    progress: 100,
    images: ['https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80']
  },
  {
    id: 'ma-2',
    countryCode: 'MA',
    title: 'Agriculture Intelligente Maroc',
    description: 'Technologies numériques pour l\'agriculture.',
    status: 'en_cours',
    thematic: 'agriculture',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    budget: '15 milliards FCFA',
    beneficiaries: '100 000 agriculteurs',
    location: { lat: 34.0, lng: -5.0, address: 'Meknès' },
    progress: 35,
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80']
  },

  // ÉTHIOPIE
  {
    id: 'et-1',
    countryCode: 'ET',
    title: 'Rural Connectivity Ethiopia',
    description: 'Connexion de 2000 localités rurales.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2023-06-01',
    endDate: '2027-12-31',
    budget: '25 milliards FCFA',
    beneficiaries: '10 millions d\'Éthiopiens',
    location: { lat: 9.0, lng: 39.0, address: 'Addis Abeba' },
    progress: 30,
    images: ['https://images.unsplash.com/photo-1526304640152-d4619684e485?w=800&q=80']
  },
  {
    id: 'et-2',
    countryCode: 'ET',
    title: 'E-Education Ethiopia',
    description: 'Digitalisation des écoles primaires.',
    status: 'en_cours',
    thematic: 'education',
    startDate: '2024-01-01',
    endDate: '2027-06-30',
    budget: '10 milliards FCFA',
    beneficiaries: '2 millions d\'élèves',
    location: { lat: 8.0, lng: 38.0, address: 'Dire Dawa' },
    progress: 25,
    images: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80']
  },

  // BÉNIN
  {
    id: 'bj-1',
    countryCode: 'BJ',
    title: 'Ambassadeurs Numériques',
    description: 'Formation de jeunes leaders numériques dans chaque village.',
    status: 'termine',
    thematic: 'inclusion',
    startDate: '2021-01-01',
    endDate: '2023-12-31',
    budget: '5 milliards FCFA',
    beneficiaries: '500 ambassadeurs, 50 000 villageois',
    location: { lat: 6.5, lng: 2.5, address: 'Cotonou' },
    progress: 100,
    images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80']
  },
  {
    id: 'bj-2',
    countryCode: 'BJ',
    title: 'Télécentres Bénin',
    description: 'Création de 50 télécentres communautaires.',
    status: 'en_cours',
    thematic: 'formation',
    startDate: '2023-06-01',
    endDate: '2026-12-31',
    budget: '8 milliards FCFA',
    beneficiaries: '200 000 personnes',
    location: { lat: 6.5, lng: 2.5, address: 'Porto-Novo' },
    progress: 40,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80']
  },

  // TOGO
  {
    id: 'tg-1',
    countryCode: 'TG',
    title: 'Connectivité Nord Togo',
    description: 'Fibre optique dans les régions du Nord.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2023-09-01',
    endDate: '2026-06-30',
    budget: '7 milliards FCFA',
    beneficiaries: '300 000 Togolais',
    location: { lat: 10.0, lng: 0.5, address: 'Dapaong' },
    progress: 35,
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80']
  },
  {
    id: 'tg-2',
    countryCode: 'TG',
    title: 'E-Santé Togo',
    description: 'Téléconsultation dans les centres de santé ruraux.',
    status: 'a_venir',
    thematic: 'sante',
    startDate: '2025-01-01',
    endDate: '2027-12-31',
    budget: '5 milliards FCFA',
    beneficiaries: '150 000 personnes',
    location: { lat: 7.5, lng: 0.5, address: 'Sokodé' },
    progress: 0,
    images: ['https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80']
  },

  // TUNISIE
  {
    id: 'tn-1',
    countryCode: 'TN',
    title: 'Tunisie Numérique Rurale',
    description: 'Connexion des zones rurales de l\'Ouest.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    budget: '10 milliards FCFA',
    beneficiaries: '500 000 Tunisiens',
    location: { lat: 35.5, lng: 9.0, address: 'Kasserine' },
    progress: 40,
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80']
  },
  {
    id: 'tn-2',
    countryCode: 'TN',
    title: 'E-Éducation Tunisie',
    description: 'Équipement des écoles primaires en matériel numérique.',
    status: 'termine',
    thematic: 'education',
    startDate: '2021-09-01',
    endDate: '2023-12-31',
    budget: '6 milliards FCFA',
    beneficiaries: '100 000 élèves',
    location: { lat: 33.5, lng: 10.0, address: 'Sfax' },
    progress: 100,
    images: ['https://images.unsplash.com/photo-1577896339272-a70713bb0bc0?w=800&q=80']
  },

  // ALGÉRIE
  {
    id: 'dz-1',
    countryCode: 'DZ',
    title: 'Sahara Connecté',
    description: 'Connectivité par satellite VSAT dans le Sahara.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2023-06-01',
    endDate: '2027-12-31',
    budget: '30 milliards FCFA',
    beneficiaries: '1 million d\'Algériens',
    location: { lat: 28.0, lng: 2.0, address: 'Tamanrasset' },
    progress: 30,
    images: ['https://images.unsplash.com/photo-1548685913-fe6678b4d4a5?w=800&q=80']
  },
  {
    id: 'dz-2',
    countryCode: 'DZ',
    title: 'Haut Plateau Numérique',
    description: 'Développement des services numériques dans le Haut Plateau.',
    status: 'en_cours',
    thematic: 'gouvernement',
    startDate: '2024-01-01',
    endDate: '2027-06-30',
    budget: '15 milliards FCFA',
    beneficiaries: '5 millions d\'Algériens',
    location: { lat: 35.0, lng: 5.0, address: 'Constantine' },
    progress: 25,
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80']
  },

  // RDC
  {
    id: 'cd-1',
    countryCode: 'CD',
    title: 'Forêt Connectée RDC',
    description: 'Connectivité dans les zones forestières reculées.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2024-01-01',
    endDate: '2028-12-31',
    budget: '40 milliards FCFA',
    beneficiaries: '5 millions de Congolais',
    location: { lat: 0.5, lng: 25.0, address: 'Mbandaka' },
    progress: 20,
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80']
  },
  {
    id: 'cd-2',
    countryCode: 'CD',
    title: 'E-Santé RDC',
    description: 'Télémédecine pour les zones isolées.',
    status: 'en_cours',
    thematic: 'sante',
    startDate: '2023-06-01',
    endDate: '2027-12-31',
    budget: '20 milliards FCFA',
    beneficiaries: '2 millions de Congolais',
    location: { lat: -4.5, lng: 15.0, address: 'Kinshasa' },
    progress: 30,
    images: ['https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80']
  },

  // OUGANDA
  {
    id: 'ug-1',
    countryCode: 'UG',
    title: 'Northern Uganda Connectivity',
    description: 'Connexion du Nord de l\'Ouganda.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2023-09-01',
    endDate: '2027-06-30',
    budget: '12 milliards FCFA',
    beneficiaries: '500 000 Ougandais',
    location: { lat: 2.5, lng: 32.5, address: 'Gulu' },
    progress: 35,
    images: ['https://images.unsplash.com/photo-1526304640152-d4619684e485?w=800&q=80']
  },
  {
    id: 'ug-2',
    countryCode: 'UG',
    title: 'E-Éducation Ouganda',
    description: 'Digitalisation des écoles du Nord.',
    status: 'en_cours',
    thematic: 'education',
    startDate: '2024-01-01',
    endDate: '2027-12-31',
    budget: '8 milliards FCFA',
    beneficiaries: '200 000 élèves',
    location: { lat: 2.0, lng: 33.0, address: 'Lira' },
    progress: 25,
    images: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80']
  },

  // TANZANIE
  {
    id: 'tz-1',
    countryCode: 'TZ',
    title: 'Rural Broadband Tanzania',
    description: 'Haut débit pour les zones rurales.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2023-06-01',
    endDate: '2028-12-31',
    budget: '18 milliards FCFA',
    beneficiaries: '8 millions de Tanzaniens',
    location: { lat: -6.5, lng: 35.0, address: 'Dodoma' },
    progress: 30,
    images: ['https://images.unsplash.com/photo-1554446342-c3e3e7fe8adc?w=800&q=80']
  },
  {
    id: 'tz-2',
    countryCode: 'TZ',
    title: 'Mobile Money Tanzania',
    description: 'Extension des services mobile money rural.',
    status: 'termine',
    thematic: 'entreprises',
    startDate: '2021-01-01',
    endDate: '2023-12-31',
    budget: '10 milliards FCFA',
    beneficiaries: '5 millions d\'utilisateurs',
    location: { lat: -6.5, lng: 39.0, address: 'Dar es Salaam' },
    progress: 100,
    images: ['https://images.unsplash.com/photo-1559136555-17ad3d2a4e02?w=800&q=80']
  },

  // MOZAMBIQUE
  {
    id: 'mz-1',
    countryCode: 'MZ',
    title: 'Resilient Infrastructure',
    description: 'Infrastructures résilientes aux cyclones.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2023-01-01',
    endDate: '2027-12-31',
    budget: '15 milliards FCFA',
    beneficiaries: '3 millions de Mozambicains',
    location: { lat: -25.0, lng: 33.0, address: 'Beira' },
    progress: 40,
    images: ['https://images.unsplash.com/photo-1526304640152-d4619684e485?w=800&q=80']
  },

  // ZAMBIE
  {
    id: 'zm-1',
    countryCode: 'ZM',
    title: 'Copperbelt Digital',
    description: 'Services numériques pour le Copperbelt.',
    status: 'en_cours',
    thematic: 'gouvernement',
    startDate: '2024-01-01',
    endDate: '2027-06-30',
    budget: '10 milliards FCFA',
    beneficiaries: '2 millions de Zambiens',
    location: { lat: -13.0, lng: 28.0, address: 'Kitwe' },
    progress: 30,
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80']
  },

  // GUINÉE
  {
    id: 'gn-1',
    countryCode: 'GN',
    title: 'Forêt Connectée Guinée',
    description: 'Solutions hybrides fibre/VSAT pour la zone forestière.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2023-09-01',
    endDate: '2027-12-31',
    budget: '10 milliards FCFA',
    beneficiaries: '500 000 Guinéens',
    location: { lat: 8.5, lng: -10.0, address: 'Nzérékoré' },
    progress: 35,
    images: ['https://images.unsplash.com/photo-1548685913-fe6678b4d4a5?w=800&q=80']
  },

  // NIGER
  {
    id: 'ne-1',
    countryCode: 'NE',
    title: 'Sahel Connecté Niger',
    description: 'Connectivité pour les zones sahéliennes.',
    status: 'en_cours',
    thematic: 'connectivite',
    startDate: '2024-01-01',
    endDate: '2028-12-31',
    budget: '10 milliards FCFA',
    beneficiaries: '400 000 Nigériens',
    location: { lat: 17.0, lng: 8.0, address: 'Zinder' },
    progress: 25,
    images: ['https://images.unsplash.com/photo-1526304640152-d4619684e485?w=800&q=80']
  },
];
