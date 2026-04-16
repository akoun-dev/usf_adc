export interface PublicProject {
  id: string;
  countryCode: string;
  countryName: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  thematic: string;
  startDate: string;
  endDate: string;
  budget: string;
  progress: number;
  beneficiaries: number;
  location: {
    lat: number;
    lng: number;
    region: string;
  };
  operator: string;
  images: string[];
  tags: string[];
}

export const THEMATIC_LABELS: Record<string, string> = {
  'connectivity': 'Connectivité',
  'education': 'Éducation Numérique',
  'health': 'E-Santé',
  'agriculture': 'Agriculture Numérique',
  'government': 'E-Gouvernement',
  'business': 'Développement des Entreprises',
  'training': 'Formation Numérique',
  'inclusion': 'Inclusion Numérique',
};

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  'planning': { label: 'Planification', color: 'bg-slate-500/10 text-slate-700 dark:text-slate-400' },
  'active': { label: 'En cours', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  'completed': { label: 'Terminé', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  'on_hold': { label: 'En pause', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
};

export const mockProjects: PublicProject[] = [
  // CÔTE D'IVOIRE
  {
    id: 'prj-1',
    countryCode: 'CI',
    countryName: 'Côte d\'Ivoire',
    title: 'Connectivité Rurale Phase 1 - Nord',
    description: 'Déploiement de la connectivité haut débit dans 150 localités du Nord de la Côte d\'Ivoire. Ce projet vise à réduire la fracture numérique dans les zones rurales en installant des infrastructures modernes de télécommunications.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2024-01-15',
    endDate: '2025-12-31',
    budget: '8 milliards FCFA',
    progress: 65,
    beneficiaries: 300000,
    location: { lat: 9.5, lng: -5.5, region: 'Korhogo, Région des Savanes' },
    operator: 'Orange CI',
    images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80'],
    tags: ['fibre', 'rural', '5G', 'CEDEAO']
  },
  {
    id: 'prj-2',
    countryCode: 'CI',
    countryName: 'Côte d\'Ivoire',
    title: 'Écoles Numériques Côte d\'Ivoire',
    description: 'Équipement de 200 écoles primaires en ordinateurs, connexion internet et formation des enseignants à l\'usage pédagogique du numérique.',
    status: 'active',
    thematic: 'education',
    startDate: '2024-03-01',
    endDate: '2025-08-31',
    budget: '5 milliards FCFA',
    progress: 40,
    beneficiaries: 50000,
    location: { lat: 5.5, lng: -4.0, region: 'Abidjan et intérieur du pays' },
    operator: 'MTN CI',
    images: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80'],
    tags: ['éducation', 'formation', 'digitalisation']
  },
  {
    id: 'prj-3',
    countryCode: 'CI',
    countryName: 'Côte d\'Ivoire',
    title: 'E-Santé Communautaire',
    description: 'Mise en place de centres de santé connectés dans 80 localités rurales avec équipement de télémédecine et gestion électronique des dossiers patients.',
    status: 'active',
    thematic: 'health',
    startDate: '2023-09-01',
    endDate: '2025-06-30',
    budget: '6 milliards FCFA',
    progress: 55,
    beneficiaries: 200000,
    location: { lat: 6.5, lng: -5.0, region: 'Bouaké et région' },
    operator: 'Moov CI',
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'],
    tags: ['santé', 'télémédecine', 'rural']
  },
  {
    id: 'prj-4',
    countryCode: 'CI',
    countryName: 'Côte d\'Ivoire',
    title: 'Inclusion Numérique des Femmes',
    description: 'Formation de 5000 femmes à l\'entreprenariat numérique et création de 50 télécentres gérés par des femmes.',
    status: 'active',
    thematic: 'inclusion',
    startDate: '2024-02-01',
    endDate: '2025-12-31',
    budget: '3 milliards FCFA',
    progress: 35,
    beneficiaries: 5000,
    location: { lat: 5.0, lng: -3.5, region: 'Yamoussoukro et environs' },
    operator: 'Orange CI',
    images: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'],
    tags: ['inclusion', 'femmes', 'entrepreneuriat']
  },

  // SÉNÉGAL
  {
    id: 'prj-5',
    countryCode: 'SN',
    countryName: 'Sénégal',
    title: 'Sites Solaires Autonomes',
    description: 'Déploiement de 150 sites télécoms alimentés par énergie solaire dans les zones les plus isolées du Sénégal oriental.',
    status: 'completed',
    thematic: 'connectivity',
    startDate: '2022-03-01',
    endDate: '2023-12-31',
    budget: '12 milliards FCFA',
    progress: 100,
    beneficiaries: 300000,
    location: { lat: 14.5, lng: -12.5, region: 'Tambacounda' },
    operator: 'Orange Sénégal',
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'],
    tags: ['solaire', 'énergie-verte', 'off-grid']
  },
  {
    id: 'prj-6',
    countryCode: 'SN',
    countryName: 'Sénégal',
    title: 'Sénégal Numérique 2025',
    description: "Programme global de digitalisation des services publics avec plateformes en ligne, centres d'appels et formation citoyenne.",
    status: 'active',
    thematic: 'government',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    budget: '20 milliards FCFA',
    progress: 60,
    beneficiaries: 10000000,
    location: { lat: 14.7, lng: -17.5, region: 'Dakar' },
    operator: 'Free Sénégal',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'],
    tags: ['gouvernement', 'digitalisation', 'e-gov']
  },
  {
    id: 'prj-7',
    countryCode: 'SN',
    countryName: 'Sénégal',
    title: 'Écoles Connectées Sénégal',
    description: 'Connexion de 300 écoles à internet et formation de 1000 enseignants aux outils numériques pédagogiques.',
    status: 'active',
    thematic: 'education',
    startDate: '2023-09-01',
    endDate: '2025-06-30',
    budget: '8 milliards FCFA',
    progress: 45,
    beneficiaries: 75000,
    location: { lat: 14.0, lng: -16.0, region: 'Kaolack, Fatick' },
    operator: 'Expresso Sénégal',
    images: ['https://images.unsplash.com/photo-1577896339272-a70713bb0bc0?w=800&q=80'],
    tags: ['éducation', 'formation-enseignants']
  },

  // MALI
  {
    id: 'prj-8',
    countryCode: 'ML',
    countryName: 'Mali',
    title: 'Connexion Zones Sahariennes',
    description: 'Déploiement de solutions de connectivité VSAT et fibre dans les régions de Tombouctou, Gao et Kidal.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2024-06-01',
    endDate: '2026-12-31',
    budget: '25 milliards FCFA',
    progress: 25,
    beneficiaries: 500000,
    location: { lat: 17.5, lng: -3.0, region: 'Tombouctou' },
    operator: 'Malitel',
    images: ['https://images.unsplash.com/photo-1548685913-fe6678b4d4a5?w=800&q=80'],
    tags: ['VSAT', 'sahel', 'fibre', 'rural']
  },
  {
    id: 'prj-9',
    countryCode: 'ML',
    countryName: 'Mali',
    title: 'Formation Numérique Jeunes Mali',
    description: 'Formation de 5000 jeunes aux métiers du numérique : développement web, design, marketing digital et support technique.',
    status: 'active',
    thematic: 'training',
    startDate: '2024-03-01',
    endDate: '2025-12-31',
    budget: '5 milliards FCFA',
    progress: 40,
    beneficiaries: 5000,
    location: { lat: 12.5, lng: -8.0, region: 'Bamako' },
    operator: 'Orange Mali',
    images: ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80'],
    tags: ['formation', 'jeunes', 'compétences']
  },

  // BURKINA FASO
  {
    id: 'prj-10',
    countryCode: 'BF',
    countryName: 'Burkina Faso',
    title: 'Connectivité Région Est',
    description: 'Connexion des zones frontalières difficiles d\'accès de la région de l\'Est avec infrastructure résiliente.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2024-01-01',
    endDate: '2026-06-30',
    budget: '8 milliards FCFA',
    progress: 35,
    beneficiaries: 250000,
    location: { lat: 12.0, lng: 0.5, region: 'Fada N\'Gourma' },
    operator: 'Telmob',
    images: ['https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80'],
    tags: ['frontalier', 'résilient', '4G']
  },

  // NIGERIA
  {
    id: 'prj-11',
    countryCode: 'NG',
    countryName: 'Nigeria',
    title: 'Broadband for All Nigeria',
    description: 'Déploiement du haut débit dans 5000 localités rurales avec fibre optique et réseaux mobiles 4G/5G.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2023-01-01',
    endDate: '2027-12-31',
    budget: '50 milliards FCFA',
    progress: 35,
    beneficiaries: 20000000,
    location: { lat: 9.0, lng: 7.5, region: 'Abuja' },
    operator: 'MTN Nigeria',
    images: ['https://images.unsplash.com/photo-1526304640152-d4619684e485?w=800&q=80'],
    tags: ['broadband', '5G', 'national']
  },
  {
    id: 'prj-12',
    countryCode: 'NG',
    countryName: 'Nigeria',
    title: 'Digital Skills Nigeria',
    description: "Formation de 1 million de jeunes aux compétences numériques pour l'emploi et l'entrepreneuriat.",
    status: 'active',
    thematic: 'training',
    startDate: '2022-06-01',
    endDate: '2026-12-31',
    budget: '30 milliards FCFA',
    progress: 50,
    beneficiaries: 1000000,
    location: { lat: 6.5, lng: 3.5, region: 'Lagos' },
    operator: 'Glo',
    images: ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80'],
    tags: ['formation', 'emploi', 'jeunes']
  },

  // CAMEROUN
  {
    id: 'prj-13',
    countryCode: 'CM',
    countryName: 'Cameroun',
    title: 'Fibre Cameroun Nord',
    description: 'Déploiement de la fibre optique dans les régions du Nord pour connecter les zones rurales.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    budget: '15 milliards FCFA',
    progress: 30,
    beneficiaries: 400000,
    location: { lat: 10.0, lng: 14.0, region: 'Garoua' },
    operator: 'MTN Cameroon',
    images: ['https://images.unsplash.com/photo-1554446342-c3e3e7fe8adc?w=800&q=80'],
    tags: ['fibre', 'nord', 'rural']
  },

  // KENYA
  {
    id: 'prj-14',
    countryCode: 'KE',
    countryName: 'Kenya',
    title: 'Satellite Internet Kenya',
    description: 'Déploiement de Starlink et solutions satellite dans les zones arides du Nord pour une connectivité universelle.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    budget: '20 milliards FCFA',
    progress: 40,
    beneficiaries: 1000000,
    location: { lat: 1.5, lng: 37.5, region: 'Marsabit' },
    operator: 'Safaricom',
    images: ['https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&q=80'],
    tags: ['satellite', 'starlink', 'arid']
  },
  {
    id: 'prj-15',
    countryCode: 'KE',
    countryName: 'Kenya',
    title: 'Smart Villages Kenya',
    description: 'Création de 100 villages intelligents avec services numériques intégrés : e-santé, e-éducation, e-agriculture.',
    status: 'active',
    thematic: 'government',
    startDate: '2023-06-01',
    endDate: '2027-12-31',
    budget: '25 milliards FCFA',
    progress: 35,
    beneficiaries: 500000,
    location: { lat: -1.0, lng: 37.0, region: 'Nairobi' },
    operator: 'Telkom Kenya',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'],
    tags: ['smart-village', 'intégré', 'digital']
  },

  // RWANDA
  {
    id: 'prj-16',
    countryCode: 'RW',
    countryName: 'Rwanda',
    title: 'Fibre Optique Nationwide',
    description: 'Extension du réseau fibre optique à tout le pays pour une couverture nationale 100%.',
    status: 'completed',
    thematic: 'connectivity',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    budget: '15 milliards FCFA',
    progress: 100,
    beneficiaries: 10000000,
    location: { lat: -1.9, lng: 30.0, region: 'Kigali' },
    operator: 'MTN Rwanda',
    images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80'],
    tags: ['fibre', 'national', '100%']
  },

  // AFRIQUE DU SUD
  {
    id: 'prj-17',
    countryCode: 'ZA',
    countryName: 'Afrique du Sud',
    title: 'Townships Connectivity',
    description: 'Connectivité haut débit pour les townships avec WiFi public et centres numériques communautaires.',
    status: 'active',
    thematic: 'inclusion',
    startDate: '2022-06-01',
    endDate: '2027-12-31',
    budget: '30 milliards FCFA',
    progress: 45,
    beneficiaries: 10000000,
    location: { lat: -26.0, lng: 28.0, region: 'Johannesburg' },
    operator: 'Vodacom',
    images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80'],
    tags: ['township', 'inclusion', 'WiFi']
  },

  // MAROC
  {
    id: 'prj-18',
    countryCode: 'MA',
    countryName: 'Maroc',
    title: '4G+ Rural Maroc',
    description: 'Extension du réseau 4G+ dans les zones rurales du Haut Atlas et zones montagneuses.',
    status: 'completed',
    thematic: 'connectivity',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    budget: '20 milliards FCFA',
    progress: 100,
    beneficiaries: 5000000,
    location: { lat: 31.5, lng: -7.5, region: 'Marrakech' },
    operator: 'Maroc Telecom',
    images: ['https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80'],
    tags: ['4G+', 'montagne', 'rural']
  },
  {
    id: 'prj-19',
    countryCode: 'MA',
    countryName: 'Maroc',
    title: 'Agriculture Intelligente Maroc',
    description: "Technologies numériques pour l'agriculture : IoT, capteurs, analyse de données pour les agriculteurs.",
    status: 'active',
    thematic: 'agriculture',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    budget: '15 milliards FCFA',
    progress: 35,
    beneficiaries: 100000,
    location: { lat: 34.0, lng: -5.0, region: 'Meknès' },
    operator: 'Inwi',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80'],
    tags: ['IoT', 'agriculture', 'capteurs']
  },

  // ÉTHIOPIE
  {
    id: 'prj-20',
    countryCode: 'ET',
    countryName: 'Éthiopie',
    title: 'Rural Connectivity Ethiopia',
    description: 'Connexion de 2000 localités rurales avec mix fibre, VSAT et mobile broadband.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2023-06-01',
    endDate: '2027-12-31',
    budget: '25 milliards FCFA',
    progress: 30,
    beneficiaries: 10000000,
    location: { lat: 9.0, lng: 39.0, region: 'Addis Abeba' },
    operator: 'Ethio Telecom',
    images: ['https://images.unsplash.com/photo-1526304640152-d4619684e485?w=800&q=80'],
    tags: ['mixte', 'rural', 'broadband']
  },

  // BÉNIN
  {
    id: 'prj-21',
    countryCode: 'BJ',
    countryName: 'Bénin',
    title: 'Ambassadeurs Numériques',
    description: 'Formation de jeunes leaders numériques dans chaque village avec accompagnement et micro-crédits.',
    status: 'completed',
    thematic: 'inclusion',
    startDate: '2021-01-01',
    endDate: '2023-12-31',
    budget: '5 milliards FCFA',
    progress: 100,
    beneficiaries: 50000,
    location: { lat: 6.5, lng: 2.5, region: 'Cotonou' },
    operator: 'MTN Bénin',
    images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'],
    tags: ['ambassadeurs', 'micro-crédit', 'leadership']
  },

  // TUNISIE
  {
    id: 'prj-22',
    countryCode: 'TN',
    countryName: 'Tunisie',
    title: 'Tunisie Numérique Rurale',
    description: "Connexion des zones rurales de l'Ouest avec 4G+ et centres numériques.",
    status: 'active',
    thematic: 'connectivity',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    budget: '10 milliards FCFA',
    progress: 40,
    beneficiaries: 500000,
    location: { lat: 35.5, lng: 9.0, region: 'Kasserine' },
    operator: 'Ooredoo Tunisie',
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80'],
    tags: ['4G+', 'ouest', 'rural']
  },

  // ALGÉRIE
  {
    id: 'prj-23',
    countryCode: 'DZ',
    countryName: 'Algérie',
    title: 'Sahara Connecté',
    description: 'Connectivité par satellite VSAT dans le Sahara avec focus sur les sites pétroliers et gaziers.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2023-06-01',
    endDate: '2027-12-31',
    budget: '30 milliards FCFA',
    progress: 30,
    beneficiaries: 1000000,
    location: { lat: 28.0, lng: 2.0, region: 'Tamanrasset' },
    operator: 'Algérie Télécom',
    images: ['https://images.unsplash.com/photo-1548685913-fe6678b4d4a5?w=800&q=80'],
    tags: ['VSAT', 'sahara', 'pétrole']
  },

  // RDC
  {
    id: 'prj-24',
    countryCode: 'CD',
    countryName: 'République Démocratique du Congo',
    title: 'Forêt Connectée RDC',
    description: 'Connectivité dans les zones forestières reculées avec solutions hybrides.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2024-01-01',
    endDate: '2028-12-31',
    budget: '40 milliards FCFA',
    progress: 20,
    beneficiaries: 5000000,
    location: { lat: 0.5, lng: 25.0, region: 'Mbandaka' },
    operator: 'Vodacom RDC',
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80'],
    tags: ['forêt', 'hybride', 'rural']
  },

  // OUGANDA
  {
    id: 'prj-25',
    countryCode: 'UG',
    countryName: 'Ouganda',
    title: 'Northern Uganda Connectivity',
    description: "Connexion du Nord de l'Ouganda avec fibre et solutions mobiles.",
    status: 'active',
    thematic: 'connectivity',
    startDate: '2023-09-01',
    endDate: '2027-06-30',
    budget: '12 milliards FCFA',
    progress: 35,
    beneficiaries: 500000,
    location: { lat: 2.5, lng: 32.5, region: 'Gulu' },
    operator: 'MTN Uganda',
    images: ['https://images.unsplash.com/photo-1526304640152-d4619684e485?w=800&q=80'],
    tags: ['nord', 'fibre', 'mobile']
  },

  // TANZANIE
  {
    id: 'prj-26',
    countryCode: 'TZ',
    countryName: 'Tanzanie',
    title: 'Rural Broadband Tanzania',
    description: 'Haut débit pour les zones rurales avec mix de technologies.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2023-06-01',
    endDate: '2028-12-31',
    budget: '18 milliards FCFA',
    progress: 30,
    beneficiaries: 8000000,
    location: { lat: -6.5, lng: 35.0, region: 'Dodoma' },
    operator: 'Vodacom Tanzania',
    images: ['https://images.unsplash.com/photo-1554446342-c3e3e7fe8adc?w=800&q=80'],
    tags: ['broadband', 'mixte', 'rural']
  },
  {
    id: 'prj-27',
    countryCode: 'TZ',
    countryName: 'Tanzanie',
    title: 'Mobile Money Tanzania',
    description: 'Extension des services mobile money en zone rurale avec agents et formation.',
    status: 'completed',
    thematic: 'business',
    startDate: '2021-01-01',
    endDate: '2023-12-31',
    budget: '10 milliards FCFA',
    progress: 100,
    beneficiaries: 5000000,
    location: { lat: -6.5, lng: 39.0, region: 'Dar es Salaam' },
    operator: 'M-Pesa',
    images: ['https://images.unsplash.com/photo-1559136555-17ad3d2a4e02?w=800&q=80'],
    tags: ['mobile-money', 'financier', 'rural']
  },

  // GHANA
  {
    id: 'prj-28',
    countryCode: 'GH',
    countryName: 'Ghana',
    title: 'Ghana Digital Acceleration',
    description: 'Accélération de la transformation numérique avec écoles connectées et télécentres.',
    status: 'active',
    thematic: 'education',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    budget: '20 milliards FCFA',
    progress: 55,
    beneficiaries: 2000000,
    location: { lat: 5.5, lng: -0.2, region: 'Accra' },
    operator: 'MTN Ghana',
    images: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80'],
    tags: ['éducation', 'télécentres', 'transformation']
  },

  // TOGO
  {
    id: 'prj-29',
    countryCode: 'TG',
    countryName: 'Togo',
    title: 'Connectivité Nord Togo',
    description: 'Fibre optique dans les régions du Nord avec télécentres communautaires.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2023-09-01',
    endDate: '2026-06-30',
    budget: '7 milliards FCFA',
    progress: 35,
    beneficiaries: 300000,
    location: { lat: 10.0, lng: 0.5, region: 'Dapaong' },
    operator: 'Togo Com',
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'],
    tags: ['fibre', 'nord', 'télécentres']
  },

  // MOZAMBIQUE
  {
    id: 'prj-30',
    countryCode: 'MZ',
    countryName: 'Mozambique',
    title: 'Resilient Infrastructure',
    description: 'Infrastructures résilientes aux cyclones dans les zones côtières.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2023-01-01',
    endDate: '2027-12-31',
    budget: '15 milliards FCFA',
    progress: 40,
    beneficiaries: 3000000,
    location: { lat: -25.0, lng: 33.0, region: 'Beira' },
    operator: 'Vodacom Mozambique',
    images: ['https://images.unsplash.com/photo-1526304640152-d4619684e485?w=800&q=80'],
    tags: ['résilient', 'cyclone', 'côtière']
  },

  // ZAMBIE
  {
    id: 'prj-31',
    countryCode: 'ZM',
    countryName: 'Zambie',
    title: 'Copperbelt Digital',
    description: 'Services numériques pour le Copperbelt avec focus sur les mines et communautés.',
    status: 'active',
    thematic: 'government',
    startDate: '2024-01-01',
    endDate: '2027-06-30',
    budget: '10 milliards FCFA',
    progress: 30,
    beneficiaries: 2000000,
    location: { lat: -13.0, lng: 28.0, region: 'Kitwe' },
    operator: 'MTN Zambia',
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80'],
    tags: ['copperbelt', 'mines', 'digital']
  },

  // GUINÉE
  {
    id: 'prj-32',
    countryCode: 'GN',
    countryName: 'Guinée',
    title: 'Forêt Connectée Guinée',
    description: 'Solutions hybrides fibre/VSAT pour la zone forestière avec centres numériques.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2023-09-01',
    endDate: '2027-12-31',
    budget: '10 milliards FCFA',
    progress: 35,
    beneficiaries: 500000,
    location: { lat: 8.5, lng: -10.0, region: 'Nzérékoré' },
    operator: 'Orange Guinée',
    images: ['https://images.unsplash.com/photo-1548685913-fe6678b4d4a5?w=800&q=80'],
    tags: ['forêt', 'hybride', 'VSAT']
  },

  // NIGER
  {
    id: 'prj-33',
    countryCode: 'NE',
    countryName: 'Niger',
    title: 'Sahel Connecté Niger',
    description: 'Connectivité pour les zones sahéliennes avec solutions adaptées au climat.',
    status: 'active',
    thematic: 'connectivity',
    startDate: '2024-01-01',
    endDate: '2028-12-31',
    budget: '10 milliards FCFA',
    progress: 25,
    beneficiaries: 400000,
    location: { lat: 17.0, lng: 8.0, region: 'Zinder' },
    operator: 'Orange Niger',
    images: ['https://images.unsplash.com/photo-1526304640152-d4619684e485?w=800&q=80'],
    tags: ['sahel', 'climat', 'adapté']
  },
];
