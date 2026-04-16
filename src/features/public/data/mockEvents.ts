export const mockEvents = [
    {
        id: '1',
        title: 'Sommet Africa Tech 2026',
        description: `Le plus grand rassemblement des acteurs du numérique en Afrique. Éditions précédentes : 3000 participants, 50 pays représentés, 200 conférenciers.

Thématiques 2026 :
- Infrastructure 5G et fibre optique
- Financement du Service Universel
- Transformation digitale gouvernementale
- Inclusion numérique et genre

Conférenciers confirmés :
- Ministres des Télécommunications de 15 pays
- DG d'opérateurs télécoms
- Chefs d'entreprise tech africains
- Partenaires internationaux (Banque Mondiale, UIT)

Ateliers pratiques :
- Atelier 1 : Modèles de financement innovants
- Atelier 2 : Gouvernance des FSU
- Atelier 3 : Digitalisation des services publics
- Atelier 4 : Formation et capacity building`,
        start_date: '2026-05-15T09:00:00Z',
        end_date: '2026-05-18T18:00:00Z',
        location: 'Palais des Congrès, Abidjan, Côte d\'Ivoire',
        event_type: 'conference',
        registration_url: 'https://atuuat.africa/events/africa-tech-2025',
        max_participants: 3000,
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630&fit=crop',
        organizer: 'Union Africaine des Télécommunications',
        status: 'upcoming',
        price: 'Gratuit sur invitation',
        tags: ['Conférence', 'Sommet', 'Technologie', 'Innovation']
    },
    {
        id: '2',
        title: 'Webinaire : Stratégies de mobilisation du FSU',
        description: `Découvrez les stratégies efficaces pour mobiliser les ressources du Fonds de Service Universel lors de ce webinaire interactif.

Programme :
- Introduction : Le contexte du financement du FSU en Afrique
- Session 1 : Modèles de taxation des opérateurs
- Session 2 : Partenariats public-privé
- Session 3 : Financement international et aides
- Session 4 : Études de cas : Sénégal, Côte d'Ivoire, Rwanda

Intervenants :
- Dr. Amadou Diallo, Expert en financement télécoms
- Mme Aïcha Koné, Directrice FSU Côte d'Ivoire
- M. Jean-Pierre Mbengue, Conseiller Banque Mondiale

Durée : 3 heures
Langues : Français et anglais`,
        start_date: '2026-05-22T14:00:00Z',
        end_date: '2026-05-22T17:00:00Z',
        location: 'En ligne',
        event_type: 'webinar',
        registration_url: 'https://atuuat.africa/webinars/fsu-financement',
        max_participants: 500,
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=630&fit=crop',
        organizer: 'UAT - Programmes',
        status: 'upcoming',
        price: 'Gratuit',
        tags: ['Webinaire', 'Financement', 'FSU', 'Formation']
    },
    {
        id: '3',
        title: 'Atelier Pratique : Gestion de la plateforme USF-ADC',
        description: `Formation pratique intensive sur l'utilisation de la plateforme USF-ADC pour les Points Focaux et Administrateurs Pays.

Objectifs pédagogiques :
- Maîtriser l'interface de la plateforme
- Savoir saisir et valider les données FSU
- Générer les rapports et statistiques
- Gérer les utilisateurs et permissions
- Suivre les projets et indicateurs

Méthodologie :
- 60% exercices pratiques
- 30% théorie
- 10% études de cas

Prérequis :
- Être désigné Point Focal ou Admin Pays
- Avoir un ordinateur avec connexion internet
- Connaissances de base en informatique

Certification : Attestation de formation délivrée à l'issue`,
        start_date: '2026-06-10T09:00:00Z',
        end_date: '2026-06-12T17:00:00Z',
        location: 'Hôtel Noom, Ouagadougou, Burkina Faso',
        event_type: 'workshop',
        registration_url: 'https://atuuat.africa/training/usf-adc',
        max_participants: 40,
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=1200&h=630&fit=crop',
        organizer: 'UAT - Formation',
        status: 'upcoming',
        price: 'Gratuit (frais de voyage pris en charge)',
        tags: ['Formation', 'Atelier', 'Plateforme', 'Pratique']
    },
    {
        id: '4',
        title: "Conférence Régionale : L'Inclusion Numérique au Sahel",
        description: `Une conférence dédiée aux défis et opportunités de l'inclusion numérique dans la région du Sahel.

Contexte :
Le Sahel reste l'une des régions les moins connectées d'Afrique avec un taux de couverture moyen de 35%.

Thématiques :
- Adaptation des infrastructures aux conditions climatiques extrêmes
- Solutions low-cost pour les zones à faible densité
- Énergie solaire et sites autonomes
- Contenus et services locaux numériques
- Formation des populations rurales

Participants attendus :
- 15 pays du Sahel
- Opérateurs télécoms
- Fournisseurs d'équipements
- ONG et organisations internationales

Résultats attendus :
- Plan d'action régional
- Feuille de route pour le financement
- Accords de partenariat`,
        start_date: '2026-07-08T09:00:00Z',
        end_date: '2026-07-10T17:00:00Z',
        location: 'Centre de Conférences, Niamey, Niger',
        event_type: 'conference',
        registration_url: 'https://atuuat.africa/events/sahel-inclusion',
        max_participants: 300,
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=630&fit=crop',
        organizer: 'UAT - Région Sahel',
        status: 'upcoming',
        price: 'Gratuit',
        tags: ['Conférence', 'Sahel', 'Inclusion', 'Régional']
    },
    {
        id: '5',
        title: 'Session de Certification : Auditeurs du FSU',
        description: `Programme de certification pour devenir auditeur qualifié des Fonds de Service Universel.

Module 1 : Cadre réglementaire et normes
- Directives de l'UAT sur le FSU
- Normes ISO applicables
- Bonnes pratiques internationales

Module 2 : Méthodologie d'audit
- Planification de la mission
- Collecte des preuves
- Analyse des risques
- Rapport d'audit

Module 3 : Indicateurs et KPI
- Taux de couverture
- Utilisation des fonds
- Impact social
- Viabilité des projets

Module 4 : Étude de cas pratique
- Audit simulé d'un FSU
- Présentation des conclusions
- Recommandations

Examen de certification à l'issue de la formation.`,
        start_date: '2026-08-24T09:00:00Z',
        end_date: '2026-08-28T17:00:00Z',
        location: 'Institut Supérieur des Télécommunications, Dakar, Sénégal',
        event_type: 'workshop',
        registration_url: 'https://atuuat.africa/certification/audit',
        max_participants: 25,
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
        organizer: 'UAT - Certification',
        status: 'upcoming',
        price: '500 000 FCFA (hors frais de voyage)',
        tags: ['Certification', 'Audit', 'Formation', 'Qualité']
    },
    {
        id: '6',
        title: 'Forum annuel : Partenariats Public-Privé pour le FSU',
        description: `Le forum annuel de l'UAT sur les partenariats public-privé comme levier de financement du Service Universel.

Objectifs :
- Partager les expériences réussies de PPP
- Identifier les modèles de partenariat innovants
- Faciliter la mise en relation entre parties prenantes
- Élaborer des guides pratiques de PPP

Sessions :
- Session 1 : Le cadre légal des PPP dans le secteur telecom
- Session 2 : Modèles de partage d'infrastructures
- Session 3 : Financement mixte et fonds de garantie
- Session 4 : Gouvernance et transparence des partenariats

Table ronde avec :
- Ministres des Télécommunications
- DG d'opérateurs (Orange, MTN, Airtel, etc.)
- Investisseurs privés
- Banques de développement`,
        start_date: '2026-09-20T09:00:00Z',
        end_date: '2026-09-22T17:00:00Z',
        location: 'Kempinski, Accra, Ghana',
        event_type: 'conference',
        registration_url: 'https://atuuat.africa/events/ppp-forum',
        max_participants: 200,
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=630&fit=crop',
        organizer: 'UAT - Partenariats',
        status: 'upcoming',
        price: '200 000 FCFA (early bird: 150 000 FCFA)',
        tags: ['Conférence', 'PPP', 'Partenariat', 'Financement']
    },
    {
        id: '7',
        title: 'Hackathon : Solutions innovantes pour le FSU',
        description: `48 heures pour imaginer et prototyper des solutions innovantes au service du Fonds de Service Universel.

Thématiques du hackathon :
- Plateformes de suivi des projets FSU
- Applications de cartographie des zones blanches
- Solutions de e-learning pour les formations
- Outils de gestion transparente des fonds
- Applications mobiles pour les bénéficiaires

Déroulement :
- Jour 1 : Lancement, formation, team building
- Jour 2 : Développement des prototypes
- Jour 3 : Présentation et remise des prix

Prix :
- 1er prix : 5 000 000 FCFA + accompagnement
- 2e prix : 3 000 000 FCFA
- 3e prix : 1 500 000 FCFA

Équipement et hébergement fournis.`,
        start_date: '2026-10-25T09:00:00Z',
        end_date: '2026-10-27T18:00:00Z',
        location: 'Technopark, Kigali, Rwanda',
        event_type: 'workshop',
        registration_url: 'https://atuuat.africa/hackathon/fsu',
        max_participants: 150,
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=630&fit=crop',
        organizer: 'UAT - Innovation',
        status: 'upcoming',
        price: 'Gratuit (sur sélection)',
        tags: ['Hackathon', 'Innovation', 'Tech', 'Concours']
    }
]

// Événements passés pour l'historique
export const mockPastEvents = [
    {
        id: 'past-1',
        title: 'Assemblée Générale UAT 2025',
        description: `L'assemblée générale annuelle de l'Union Africaine des Télécommunications`,
        start_date: '2025-11-15T09:00:00Z',
        end_date: '2025-11-16T17:00:00Z',
        location: 'Caire, Égypte',
        event_type: 'conference',
        image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=630&fit=crop',
        organizer: 'UAT',
        status: 'completed',
        tags: ['Assemblée', 'UAT', 'Gouvernance']
    },
    {
        id: 'past-2',
        title: 'Webinaire : Introduction à la plateforme USF-ADC',
        description: 'Présentation générale de la plateforme et de ses fonctionnalités',
        start_date: '2026-02-20T14:00:00Z',
        end_date: '2026-02-20T16:00:00Z',
        location: 'En ligne',
        event_type: 'webinar',
        image_url: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1200&h=630&fit=crop',
        organizer: 'UAT - Formation',
        status: 'completed',
        tags: ['Webinaire', 'Formation', 'Plateforme']
    },
    {
        id: 'past-3',
        title: 'Atelier Points Focaux - Dakar',
        description: 'Formation des Points Focaux d\'Afrique de l\'Ouest',
        start_date: '2026-03-10T09:00:00Z',
        end_date: '2026-03-12T17:00:00Z',
        location: 'Dakar, Sénégal',
        event_type: 'workshop',
        image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=630&fit=crop',
        organizer: 'UAT - Formation',
        status: 'completed',
        tags: ['Formation', 'Atelier', 'Points Focaux']
    }
]