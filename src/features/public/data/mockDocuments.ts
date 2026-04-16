export interface PublicDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'pdf' | 'doc' | 'xls' | 'ppt' | 'video' | 'guide';
  language: string;
  publishedDate: string;
  fileSize: string;
  downloadUrl: string;
  thumbnail?: string;
  tags: string[];
  featured: boolean;
}

export const DOCUMENT_CATEGORIES: Record<string, { label: string; icon: string; color: string }> = {
  'rapports': { label: 'Rapports Annuels', icon: '📊', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  'guides': { label: 'Guides Pratiques', icon: '📖', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  'politiques': { label: 'Politiques & Cadres', icon: '⚖️', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400' },
  'etudes': { label: 'Etudes & Recherches', icon: '🔬', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  'newsletters': { label: 'Bulletins', icon: '📰', color: 'bg-red-500/10 text-red-700 dark:text-red-400' },
  'presentations': { label: 'Presentations', icon: '📽️', color: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' },
  'formulaires': { label: 'Formulaires', icon: '📝', color: 'bg-pink-500/10 text-pink-700 dark:text-pink-400' },
  'tutoriels': { label: 'Tutoriels', icon: '🎓', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' },
};

export const DOCUMENT_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  'pdf': { label: 'PDF', icon: '📄', color: 'bg-red-100 text-red-700' },
  'doc': { label: 'DOC', icon: '📝', color: 'bg-blue-100 text-blue-700' },
  'xls': { label: 'XLS', icon: '📊', color: 'bg-green-100 text-green-700' },
  'ppt': { label: 'PPT', icon: '📽️', color: 'bg-orange-100 text-orange-700' },
  'video': { label: 'VIDEO', icon: '🎥', color: 'bg-purple-100 text-purple-700' },
  'guide': { label: 'GUIDE', icon: '📖', color: 'bg-amber-100 text-amber-700' },
};

export const mockDocuments: PublicDocument[] = [
  // RAPPORTS ANNUELS
  {
    id: 'doc-1',
    title: 'Rapport Annuel 2024 - Etat du Service Universel en Afrique',
    description: 'Ce rapport presente l\'etat des lieux du Service Universel dans les 54 pays membres de l\'UAT, les investissements realises, les projets en cours et les recommandations pour 2025.',
    category: 'rapports',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2024-12-15',
    fileSize: '8.5 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    tags: ['2024', 'annuel', 'panafricain', 'statistiques'],
    featured: true
  },
  {
    id: 'doc-2',
    title: 'Annual Report 2024 - Universal Service Fund in Africa',
    description: 'This report presents the state of Universal Service in the 54 UAT member countries, investments made, ongoing projects and recommendations for 2025.',
    category: 'rapports',
    type: 'pdf',
    language: 'EN',
    publishedDate: '2024-12-15',
    fileSize: '8.2 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    tags: ['2024', 'annual', 'pan-african', 'statistics'],
    featured: true
  },
  {
    id: 'doc-3',
    title: 'Rapport Annuel 2023 - Synthese Regionale',
    description: 'Synthese des activites 2023 par region : CEDEAO, CEMAC, SADC, EAC et UMA avec focus sur les collaborations transfrontalieres.',
    category: 'rapports',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2024-01-20',
    fileSize: '6.3 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
    tags: ['2023', 'regional', 'synthese', 'CEDEAO'],
    featured: false
  },
  {
    id: 'doc-4',
    title: 'Rapport Annuel 2022 - Focus sur l\'Inclusion Numerique',
    description: 'Edition 2022 avec focus particulier sur les initiatives d\'inclusion numerique pour les femmes et les jeunes ruraux.',
    category: 'rapports',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2023-02-10',
    fileSize: '5.8 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80',
    tags: ['2022', 'inclusion', 'femmes', 'jeunes'],
    featured: false
  },

  // GUIDES PRATIQUES
  {
    id: 'doc-5',
    title: 'Guide de Gestion du Fonds de Service Universel',
    description: 'Guide complet a destination des Points Focaux et Administrateurs Pays : cadre reglementaire, procedures de collecte, validation et suivi des projets.',
    category: 'guides',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2024-06-01',
    fileSize: '4.2 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    tags: ['gestion', 'FSU', 'procedure', 'admin'],
    featured: true
  },
  {
    id: 'doc-6',
    title: 'USF Management Guide - Best Practices',
    description: 'Comprehensive guide for Focal Points and Country Administrators: regulatory framework, collection procedures, validation and project monitoring.',
    category: 'guides',
    type: 'pdf',
    language: 'EN',
    publishedDate: '2024-06-01',
    fileSize: '4.0 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    tags: ['management', 'USF', 'procedure', 'admin'],
    featured: true
  },
  {
    id: 'doc-7',
    title: 'Guide de Soumission de Donnees FSU',
    description: 'Guide pratique pour les Points Focaux : comment soumettre des donnees, completer les formulaires, gerer les brouillons et repondre aux demandes de validation.',
    category: 'guides',
    type: 'doc',
    language: 'FR',
    publishedDate: '2024-03-15',
    fileSize: '2.1 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6956b3a9ac1c?w=400&q=80',
    tags: ['soumission', 'donnees', 'formulaire', 'tutorial'],
    featured: false
  },
  {
    id: 'doc-8',
    title: 'Guide de Validation des Projets FSU',
    description: 'Guide a destination des Administrateurs Pays : criteres de validation, checklist, procedures de retour et suivi des corrections.',
    category: 'guides',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2024-04-10',
    fileSize: '3.5 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
    tags: ['validation', 'projets', 'admin', 'checklist'],
    featured: false
  },

  // POLITIQUES & CADRES
  {
    id: 'doc-9',
    title: 'Cadre Reglementaire Harmonise du FSU - UAT 2024',
    description: 'Document de reference definissant les principes reglementaires harmonises pour les Fonds de Service Universel dans les 54 pays membres de l\'UAT.',
    category: 'politiques',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2024-02-01',
    fileSize: '5.0 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
    tags: ['reglementation', 'UAT', 'harmonisation', 'cadre'],
    featured: true
  },
  {
    id: 'doc-10',
    title: 'Directive UAT sur le Financement du Service Universel',
    description: 'Directive etablissant les principes directeurs pour le financement durable des Fonds de Service Universel : mecanismes de taxation, allocation des ressources et rapports.',
    category: 'politiques',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2023-11-15',
    fileSize: '3.8 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    tags: ['directive', 'financement', 'UAT', 'taxation'],
    featured: true
  },

  // ETUDES & RECHERCHES
  {
    id: 'doc-13',
    title: 'Etude sur les Meilleures Pratiques de Financement du FSU',
    description: 'Analyse comparative des modeles de financement du FSU dans 15 pays pionniers : Senegal, Cote d\'Ivoire, Ghana, Kenya, Afrique du Sud, Maroc, etc.',
    category: 'etudes',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2024-05-15',
    fileSize: '7.2 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-89563c59575c?w=400&q=80',
    tags: ['financement', 'comparatif', 'best-practices', 'etude'],
    featured: true
  },
  {
    id: 'doc-14',
    title: 'Impact du FSU sur le Developpement Rural - Etude 2024',
    description: 'Etude mesurant l\'impact socio-economique des projets FSU dans 50 localites rurales : education, sante, agriculture et inclusion numerique.',
    category: 'etudes',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2024-08-20',
    fileSize: '6.8 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1593863842408-aa9d8ea72b2b?w=400&q=80',
    tags: ['impact', 'rural', 'socio-economique', 'evaluation'],
    featured: false
  },

  // BULLETINS
  {
    id: 'doc-17',
    title: 'Bulletin FSU-Afrique - Decembre 2024',
    description: 'Actualites du mois : lancement du FSU au Mali, certification ISO du Senegal, nouveau partenariat UAT-Smart Africa.',
    category: 'newsletters',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2024-12-01',
    fileSize: '2.5 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80',
    tags: ['decembre 2024', 'actualites', 'Mali', 'Senegal'],
    featured: false
  },
  {
    id: 'doc-18',
    title: 'Bulletin FSU-Afrique - Novembre 2024',
    description: 'Focus sur le Hackathon Solutions Innovantes et le Forum Annuel PPP pour le FSU.',
    category: 'newsletters',
    type: 'pdf',
    language: 'FR',
    publishedDate: '2024-11-01',
    fileSize: '2.3 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80',
    tags: ['novembre 2024', 'hackathon', 'PPP'],
    featured: false
  },

  // PRESENTATIONS
  {
    id: 'doc-20',
    title: 'Presentation Plateforme USF-ADC - Octobre 2024',
    description: 'Presentation complete de la plateforme USF-ADC : fonctionnalites, architecture, roadmap et avantages pour les pays membres.',
    category: 'presentations',
    type: 'ppt',
    language: 'FR',
    publishedDate: '2024-10-15',
    fileSize: '12.5 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80',
    tags: ['plateforme', 'presentation', 'USF-ADC', 'roadmap'],
    featured: true
  },
  {
    id: 'doc-21',
    title: 'USF-ADC Platform Overview - October 2024',
    description: 'Complete overview of the USF-ADC platform: features, architecture, roadmap and benefits for member countries.',
    category: 'presentations',
    type: 'ppt',
    language: 'EN',
    publishedDate: '2024-10-15',
    fileSize: '12.2 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80',
    tags: ['platform', 'overview', 'USF-ADC', 'roadmap'],
    featured: true
  },

  // FORMULAIRES
  {
    id: 'doc-24',
    title: 'Formulaire de Collecte de Donnees FSU - V2024',
    description: 'Formulaire officiel de collecte des donnees du Fonds de Service Universel pour l\'annee 2024.',
    category: 'formulaires',
    type: 'xls',
    language: 'FR',
    publishedDate: '2024-01-15',
    fileSize: '1.2 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6956b3a9ac1c?w=400&q=80',
    tags: ['formulaire', 'collecte', '2024', 'officiel'],
    featured: false
  },

  // TUTORIELS
  {
    id: 'doc-28',
    title: 'Tutoriel : Premiere connexion a USF-ADC',
    description: 'Guide video pour votre premiere connexion a la plateforme : creation du compte, configuration du profil, premiere navigation.',
    category: 'tutoriels',
    type: 'video',
    language: 'FR',
    publishedDate: '2024-01-20',
    fileSize: '45.2 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    tags: ['tutoriel', 'connexion', 'premiere', 'video'],
    featured: true
  },
  {
    id: 'doc-29',
    title: 'Tutoriel : Soumettre vos donnees FSU',
    description: 'Guide video complet : acceder au formulaire, remplir les sections, gerer les brouillons, soumettre et suivre la validation.',
    category: 'tutoriels',
    type: 'video',
    language: 'FR',
    publishedDate: '2024-02-15',
    fileSize: '68.5 MB',
    downloadUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    tags: ['tutoriel', 'soumission', 'donnees', 'video'],
    featured: true
  },
];
