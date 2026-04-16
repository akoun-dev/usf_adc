export const mockForumCategories = [
    { id: 'cat-1', name: 'Annonces', description: 'Communications officielles de l\'UAT', icon: '📢', color: 'bg-blue-500', sort_order: 1, topics_count: 12 },
    { id: 'cat-2', name: 'Présentations', description: 'Présentez-vous et votre pays', icon: '👋', color: 'bg-green-500', sort_order: 2, topics_count: 45 },
    { id: 'cat-3', name: 'Aide et Support', description: 'Questions sur la plateforme USF-ADC', icon: '❓', color: 'bg-amber-500', sort_order: 3, topics_count: 89 },
    { id: 'cat-4', name: 'Bonnes Pratiques', description: 'Partage d\'expériences réussies', icon: '💡', color: 'bg-purple-500', sort_order: 4, topics_count: 34 },
    { id: 'cat-5', name: 'Règlementation', description: 'Discussions sur les cadres réglementaires', icon: '⚖️', color: 'bg-red-500', sort_order: 5, topics_count: 21 },
    { id: 'cat-6', name: 'Technique', description: 'Aspects techniques du déploiement', icon: '🔧', color: 'bg-slate-500', sort_order: 6, topics_count: 56 },
]

export const mockForumTopics = [
    {
        id: 'topic-1',
        title: '📢 [Annonce] Bienvenue sur le Forum USF-ADC',
        content: `Bienvenue à tous sur le forum officiel de la plateforme USF-ADC !

Ce forum est un espace de collaboration et d'échange entre :
- Points Focaux des 54 pays membres
- Administrateurs Pays
- Experts et consultants
- Équipes techniques de l'UAT

**Règles du forum :**
1. Soyez respectueux et professionnel
2. Partagez vos connaissances et expériences
3. Posiez des questions claires et précises
4. Utilisez les catégories appropriées
5. Respectez la confidentialité des données sensibles

**Compte support technique :**
- Email: support@atuuat.africa
- Téléphone: +225 XX XX XX XX XX

Nous vous souhaitons d'excellents échanges !

L'équipe modératrice`,
        category_id: 'cat-1',
        category: { id: 'cat-1', name: 'Annonces', icon: '📢', color: 'bg-blue-500' },
        author_id: 'admin-1',
        author: { full_name: 'Administration UAT', role: 'global_admin', avatar: null },
        is_pinned: true,
        is_locked: true,
        is_public: true,
        created_at: '2024-11-01T08:00:00Z',
        updated_at: '2024-11-01T08:00:00Z',
        views: 1245,
        _count: { posts: 3, replies: 2 },
        tags: ['Annonce', 'Important', 'Règlement'],
        status: 'pinned'
    },
    {
        id: 'topic-2',
        title: 'Présentation du Sénégal - Point Focal FSU',
        content: `Bonjour à tous,

Je me présente : Amadou Diallo, Point Focal FSU pour le Sénégal.

**Contexte de notre FSU :**
- Création : 2018
- Budget annuel : 15 milliards FCFA
- Objectif : Connecter 1000 villages d'ici 2026
- Équipe : 5 personnes

**Défis actuels :**
- Accès aux zones les plus reculées (région de Tambacounda)
- Viabilité économique des projets ruraux
- Formation des populations à l'utilisation des services

**Succès :**
- 500 villages connectés à ce jour
- 50 centres numériques communautaires créés
- Formation de 2000 jeunes

Je suis ravi d'échanger avec vous sur nos expériences respectives !

Cordialement,
Amadou`,
        category_id: 'cat-2',
        category: { id: 'cat-2', name: 'Présentations', icon: '👋', color: 'bg-green-500' },
        author_id: 'user-senegal',
        author: { full_name: 'Amadou Diallo', role: 'point_focal', country: 'Sénégal', avatar: null },
        is_pinned: false,
        is_locked: false,
        is_public: true,
        created_at: '2024-11-05T10:30:00Z',
        updated_at: '2024-11-06T14:20:00Z',
        views: 234,
        _count: { posts: 8, replies: 7 },
        tags: ['Présentation', 'Sénégal', 'FSU'],
        status: 'active'
    },
    {
        id: 'topic-3',
        title: 'Comment gérer les rejets de validation ?',
        content: `Bonjour,

Je suis nouveau sur la plateforme et je rencontre un souci. J'ai soumis des données FSU mais elles ont été rejetées par l'admin pays.

Le message indique "Données incomplètes" mais j'ai rempli tous les champs obligatoires.

Quelqu'un peut-il m'aider à comprendre ?

Merci d'avance`,
        category_id: 'cat-3',
        category: { id: 'cat-3', name: 'Aide et Support', icon: '❓', color: 'bg-amber-500' },
        author_id: 'user-mali',
        author: { full_name: 'Ousmane Traoré', role: 'point_focal', country: 'Mali', avatar: null },
        is_pinned: false,
        is_locked: false,
        is_public: true,
        created_at: '2024-11-08T09:15:00Z',
        updated_at: '2024-11-08T16:45:00Z',
        views: 156,
        _count: { posts: 5, replies: 4 },
        tags: ['Question', 'Validation', 'Aide'],
        status: 'solved'
    },
    {
        id: 'topic-4',
        title: '💡 Modèle de calcul de la subvention - Partage Sénégal',
        content: `Bonjour à tous,

Je partage le modèle que nous utilisons au Sénégal pour calculer les subventions du FSU. Cela pourrait aider d'autres pays.

**Formule de base :**
Subvention = Coût Total d'Investissement - Apport Opérateur - Autres Financements

**Paramètres considérés :**
1. Coût d'investissement : Infrastructure, équipements, installation
2. Apport opérateur : Minimum 30% du coût total
3. Viabilité : Taux de rentabilité interne > 8%
4. Impact social : Nombre de bénéficiaires potentiels

**Fichier Excel joint** avec le calcul détaillé

N'hésitez pas si vous avez des questions !

Cordialement,
Amadou (Sénégal)`,
        category_id: 'cat-4',
        category: { id: 'cat-4', name: 'Bonnes Pratiques', icon: '💡', color: 'bg-purple-500' },
        author_id: 'user-senegal',
        author: { full_name: 'Amadou Diallo', role: 'point_focal', country: 'Sénégal', avatar: null },
        is_pinned: true,
        is_locked: false,
        is_public: true,
        created_at: '2024-10-20T14:00:00Z',
        updated_at: '2024-11-10T11:30:00Z',
        views: 567,
        _count: { posts: 15, replies: 14 },
        tags: ['Bonnes pratiques', 'Subvention', 'Calcul', 'Sénégal'],
        status: 'active'
    },
    {
        id: 'topic-5',
        title: 'Cadre réglementaire FSU - Comparaison pays ouest-africains',
        content: `Bonjour,

Je mène une étude sur les cadres réglementaires des FSU en Afrique de l'Ouest. Pourriez-vous partager vos expériences ?

**Pays étudiés :**
- Sénégal : Loi 2018-XX, Décret 2019-YY
- Côte d'Ivoire : Loi 2019-XX
- Mali : Projet de loi en cours
- Burkina Faso : Textes réglementaires 2020
- Guinée : Cadre en développement

**Axes de comparaison :**
1. Base légale (loi vs décret)
2. Mécanisme de taxation des opérateurs
3. Gouvernance du fonds
4. Transparence et contrôle
5. Utilisation des fonds

Je prépare un document de synthèse que je partagerai avec vous.

Merci pour vos contributions !`,
        category_id: 'cat-5',
        category: { id: 'cat-5', name: 'Règlementation', icon: '⚖️', color: 'bg-red-500' },
        author_id: 'user-civ',
        author: { full_name: 'Fatou Bensouda', role: 'country_admin', country: 'Côte d\'Ivoire', avatar: null },
        is_pinned: false,
        is_locked: false,
        is_public: true,
        created_at: '2024-11-12T10:00:00Z',
        updated_at: '2024-11-13T15:20:00Z',
        views: 189,
        _count: { posts: 6, replies: 5 },
        tags: ['Règlementation', 'Comparaison', 'Étude'],
        status: 'active'
    },
    {
        id: 'topic-6',
        title: 'Solutions solaires pour sites isolés - Feedback Mali',
        content: `Bonjour le forum,

Je souhaite partager notre expérience au Mali avec les sites solaires autonomes.

**Contexte :**
- Zone nord de Tombouctou (très isolée)
- Pas de réseau électrique national
- Contraintes climatiques extrêmes

**Solution déployée :**
- Panneaux solaires : 15 kWc
- Batteries lithium : 80 kWh
- Générateur diesel de secours
- Autonomie : 72h sans soleil

**Bilan après 18 mois :**
✅ Taux de disponibilité : 99.2%
✅ Économie carburant : 95%
✅ Maintenance : minimale
❌ Coût initial élevé
❌ Sensible aux températures extrêmes

**Recommandations :**
- Surdimensionner les batteries de 20%
- Installer un système de monitoring à distance
- Prévoir une maintenance tous les 6 mois

Questions bienvenues !`,
        category_id: 'cat-6',
        category: { id: 'cat-6', name: 'Technique', icon: '🔧', color: 'bg-slate-500' },
        author_id: 'user-mali',
        author: { full_name: 'Ousmane Traoré', role: 'point_focal', country: 'Mali', avatar: null },
        is_pinned: true,
        is_locked: false,
        is_public: true,
        created_at: '2024-10-15T09:00:00Z',
        updated_at: '2024-11-14T10:30:00Z',
        views: 423,
        _count: { posts: 12, replies: 11 },
        tags: ['Technique', 'Solaire', 'Isolé', 'Mali'],
        status: 'active'
    },
    {
        id: 'topic-7',
        title: 'Présentation Burkina Faso - Nouveau Point Focal',
        content: `Bonjour à tous,

Je suis nouveau Point Focal pour le Burkina Faso.

**Quelques infos sur notre contexte :**
- FSU créé en 2020
- Premiers projets en cours de déploiement
- Priorité : Région de l'Est (frontalière avec les pays voisins)
- Défis majeurs : Insécurité, accès difficile

**Nos projets 2025 :**
- 150 villages à connecter
- 30 écoles à équiper
- 10 centres de santé

J'apprends beaucoup des expériences partagées sur ce forum.

Merci à tous !

Sawaba,
Abdoulaye`,
        category_id: 'cat-2',
        category: { id: 'cat-2', name: 'Présentations', icon: '👋', color: 'bg-green-500' },
        author_id: 'user-bf',
        author: { full_name: 'Abdoulaye Ouedraogo', role: 'point_focal', country: 'Burkina Faso', avatar: null },
        is_pinned: false,
        is_locked: false,
        is_public: true,
        created_at: '2024-11-11T08:30:00Z',
        updated_at: '2024-11-11T08:30:00Z',
        views: 98,
        _count: { posts: 1, replies: 0 },
        tags: ['Présentation', 'Burkina Faso', 'Nouveau'],
        status: 'active'
    },
    {
        id: 'topic-8',
        title: '[Annonce] Nouvelle fonctionnalité - Module de rapports automatisés',
        content: `Chers utilisateurs,

Nous avons le plaisir de vous annoncer le déploiement d'une nouvelle fonctionnalité sur la plateforme USF-ADC :

**Module de Rapports Automatisés**

Cette fonctionnalité permet de :
1. Générer automatiquement des rapports périodiques (mensuels, trimestriels, annuels)
2. Exporter en PDF, Excel et Word
3. Personnaliser les indicateurs à inclure
4. Programmer l'envoi automatique par email

**Comment l'utiliser :**
- Allez dans l'onglet "Rapports"
- Cliquez sur "Nouveau rapport"
- Sélectionnez la période et les indicateurs
- Cliquez sur "Générer"

**Tutoriel vidéo disponible :**
https://atuuat.africa/tutoriaux/rapports

Pour toute question : support@atuuat.africa

L'équipe USF-ADC`,
        category_id: 'cat-1',
        category: { id: 'cat-1', name: 'Annonces', icon: '📢', color: 'bg-blue-500' },
        author_id: 'admin-1',
        author: { full_name: 'Équipe Technique USF-ADC', role: 'global_admin', avatar: null },
        is_pinned: true,
        is_locked: false,
        is_public: true,
        created_at: '2024-11-10T09:00:00Z',
        updated_at: '2024-11-10T09:00:00Z',
        views: 876,
        _count: { posts: 1, replies: 0 },
        tags: ['Annonce', 'Nouvelle fonctionnalité', 'Rapports'],
        status: 'pinned'
    },
    {
        id: 'topic-9',
        title: 'Problème d\'authentification - Erreur 403',
        content: `Bonjour,

Depuis ce matin, j'essaie de me connecter à la plateforme mais j'obtiens une erreur 403 Forbidden.

J'ai vérifié :
- Mon identifiant est correct
- Mon mot de passe fonctionne sur d'autres sites
- J'ai essayé sur un autre navigateur

Est-ce qu'il y a un problème technique actuellement ?

Merci pour votre aide`,
        category_id: 'cat-3',
        category: { id: 'cat-3', name: 'Aide et Support', icon: '❓', color: 'bg-amber-500' },
        author_id: 'user-togo',
        author: { full_name: 'Kofi Mensah', role: 'point_focal', country: 'Togo', avatar: null },
        is_pinned: false,
        is_locked: false,
        is_public: true,
        created_at: '2024-11-14T07:45:00Z',
        updated_at: '2024-11-14T12:30:00Z',
        views: 67,
        _count: { posts: 4, replies: 3 },
        tags: ['Question', 'Erreur', 'Authentification'],
        status: 'solved'
    },
    {
        id: 'topic-10',
        title: 'Stratégies de formation des populations rurales',
        content: `Bonjour à tous,

Je voudrais échanger sur les stratégies de formation des populations rurales à l'utilisation des services numériques.

**Notre approche au Bénin :**
1. Formation d'ambassadeurs numériques locaux
2. Sessions pratiques dans les centres communautaires
3. Contenus audio et vidéo (langues locales)
4. Accompagnement personnalisé pendant 3 mois

**Résultats :**
- Taux d'adoption : 65% après 3 mois
- Services les plus utilisés : Appels, Mobile Money, Information agricole

**Défis :**
- Faible niveau d'alphabétisation
- Résistance au changement chez les seniors
- Coût de la formation

Quelles sont vos expériences ?

Cordialement,
Aisha`,
        category_id: 'cat-4',
        category: { id: 'cat-4', name: 'Bonnes Pratiques', icon: '💡', color: 'bg-purple-500' },
        author_id: 'user-benin',
        author: { full_name: 'Aissa Moussa', role: 'country_admin', country: 'Bénin', avatar: null },
        is_pinned: false,
        is_locked: false,
        is_public: true,
        created_at: '2024-11-07T14:20:00Z',
        updated_at: '2024-11-13T09:15:00Z',
        views: 312,
        _count: { posts: 9, replies: 8 },
        tags: ['Bonnes pratiques', 'Formation', 'Rural', 'Adoption'],
        status: 'active'
    },
    {
        id: 'topic-11',
        title: 'Partage d\'infrastructures - Cadre légal Côte d\'Ivoire',
        content: `Bonjour,

Je partage le cadre légal ivoirien sur le partage d'infrastructures, suite aux demandes de plusieurs collègues.

**Décret 2021-345 du 15 juillet 2021**

**Points clés :**
1. Obligation de partage pour les新建 infrastructure
2. Mécanisme de calcul des redevances
3. Délais de réponse aux demandes : 30 jours
4. Commission de médiation en cas de désaccord

**Taux de partage actuel :**
- Pylônes : 45%
- Tuyaux : 30%
- Espaces techniques : 60%

**Impact sur le FSU :**
- Réduction des coûts de déploiement : 25-30%
- Accélération des déploiements : +40%
- Meilleure couverture avec budget équivalent

Document complet disponible sur demande.

Fatou`,
        category_id: 'cat-5',
        category: { id: 'cat-5', name: 'Règlementation', icon: '⚖️', color: 'bg-red-500' },
        author_id: 'user-civ',
        author: { full_name: 'Fatou Bensouda', role: 'country_admin', country: 'Côte d\'Ivoire', avatar: null },
        is_pinned: true,
        is_locked: false,
        is_public: true,
        created_at: '2024-10-25T11:00:00Z',
        updated_at: '2024-11-12T16:45:00Z',
        views: 445,
        _count: { posts: 11, replies: 10 },
        tags: ['Règlementation', 'Partage', 'Côte d\'Ivoire', 'Infrastructure'],
        status: 'active'
    },
    {
        id: 'topic-12',
        title: 'Fibre optique vs VSAT - Choix pour zones isolées',
        content: `Bonjour le forum,

Je cherche des conseils sur le choix entre fibre optique et VSAT pour les zones très isolées.

**Contexte :**
- Région forestière guinéenne
- Villages à 50-100 km du réseau fibre existant
- Contraintes : Accès difficile, saison des pluies

**Option 1 - Fibre :**
✅ Bande passante élevée
✅ Latence faible
❌ Coût élevé (100k€/km)
❌ Construction difficile

**Option 2 - VSAT :**
✅ Déploiement rapide
✅ Coût modéré
❌ Coût mensuel élevé
❌ Latence importante
❌ Débit limité

**Option 3 - Hybride ?**

Vos retours d'expérience sont les bienvenus !

Merci d'avance`,
        category_id: 'cat-6',
        category: { id: 'cat-6', name: 'Technique', icon: '🔧', color: 'bg-slate-500' },
        author_id: 'user-guinee',
        author: { full_name: 'Sekou Touré', role: 'point_focal', country: 'Guinée', avatar: null },
        is_pinned: false,
        is_locked: false,
        is_public: true,
        created_at: '2024-11-09T13:45:00Z',
        updated_at: '2024-11-13T11:20:00Z',
        views: 278,
        _count: { posts: 7, replies: 6 },
        tags: ['Technique', 'Fibre', 'VSAT', 'Choix'],
        status: 'active'
    }
]
