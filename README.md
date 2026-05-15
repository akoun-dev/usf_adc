# NEXUS — Plateforme Africaine USF-ADCA

![NEXUS Header](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

**NEXUS** est la plateforme stratégique de suivi du Fonds de Service Universel (FSU) pour l'Union Africaine des Télécommunications (UAT), développée en partenariat avec l'ANSUT. Elle permet une collaboration continentale sans précédent pour connecter l'Afrique au monde numérique.

## ✨ Fonctionnalités Clés

### 🌍 Pilotage Continental & National
*   **Dashboards Multi-Rôles** : Vues adaptées pour le Super Admin (UAT), les Admins Nationaux et les Points Focaux.
*   **Cartographie Interactive** : Visualisation géographique des projets à l'échelle de l'Afrique avec clustering et filtres thématiques.
*   **Gestion de Projets** : Suivi complet du cycle de vie des initiatives FSU (Budget, Bénéficiaires, Indicateurs).

### 📈 Suivi FSU & Conformité
*   **Collecte de Données** : Saisie structurée des indicateurs de connectivité, financement et qualité de service (QoS).
*   **Workflow de Validation** : Système robuste de soumission, revue et approbation des données nationales.

### 🤝 Collaboration & Ressources
*   **Co-Rédaction** : Éditeur collaboratif temps réel pour la production de rapports stratégiques.
*   **E-Learning** : Catalogue de formations et ressources documentaires pour les membres.
*   **Communauté** : Forum de discussion, messagerie interne et chat en direct.
*   **Support** : Système intégré de gestion des tickets d'assistance.

### 🌐 Internationalisation & IA
*   **Multilingue (FR, EN, PT, AR)** : Support complet des quatre langues officielles.
*   **LibreTranslate AI** : Traduction automatique des contenus (projets, actualités, forum) intégrée au workflow d'administration.
*   **Sécurité** : Authentification forte avec Double Facteur (2FA).

---

## 🛠️ Stack Technique

*   **Frontend** : [React 18](https://reactjs.org/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **UI/UX** : [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
*   **Backend & DB** : [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, Edge Functions)
*   **Cartographie** : [Leaflet](https://leafletjs.com/)
*   **Traduction** : [LibreTranslate](https://libretranslate.com/), [i18next](https://www.i18next.com/)
*   **Gestion d'État** : [TanStack Query](https://tanstack.com/query/latest)

---

## 📁 Structure du Projet

```text
src/
├── core/               # Types globaux, constantes et utilitaires
├── components/         # Composants UI partagés (Shadcn)
├── features/           # Modules métier (Architecture par domaine)
│   ├── admin/          # Gestion globale du contenu
│   ├── co-redaction/   # Éditeur collaboratif
│   ├── fsu/            # Saisie des indicateurs
│   ├── projects-map/   # Cartographie interactive
│   ├── validation/     # Workflow d'approbation
│   └── ...             # Training, Forum, News, etc.
├── hooks/              # Hooks React transversaux
├── i18n/               # Locales et configuration multilingue
├── integrations/       # Clients Supabase et API tierces
└── lib/                # Fonctions utilitaires génériques
```

---

## 🚀 Installation & Démarrage

### Prérequis
*   Node.js 18+
*   Compte Supabase actif

### Installation
1.  Cloner le dépôt
2.  Installer les dépendances :
    ```bash
    npm install
    ```
3.  Configurer les variables d'environnement dans un fichier `.env` :
    ```env
    VITE_SUPABASE_URL=votre_url
    VITE_SUPABASE_ANON_KEY=votre_cle_anon
    ```

### Démarrage
```bash
npm run dev
```

---

## 📄 Documentation
Pour plus de détails, consultez :
*   [Rapport d'Audit de Conformité](RAPPORT_AUDIT_CONFORMITE_NEXUS.md)
*   [Listing des Fonctionnalités](LISTING_FONCTIONNALITES_ET_SERVICES.md)

---
*© 2026 NEXUS — USF-ADCA / ANSUT. Tous droits réservés.*
