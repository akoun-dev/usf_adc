# Spécifications de la Plateforme NEXUS (USF-ADCA)

Ce document répertorie les fonctionnalités, les solutions technologiques et les services tiers utilisés pour le développement de la plateforme NEXUS.

## 🚀 1. Liste des Fonctionnalités

### 👤 Gestion des Utilisateurs & Accès
*   **Authentification Sécurisée** : Connexion via Supabase Auth.
*   **Double Authentification (2FA)** : Sécurisation accrue via email/OTP.
*   **Traduction Automatique (LibreTranslate)** : Service de traduction IA intégré pour la génération automatique des versions multilingues (FR, EN, PT, AR) avant insertion en base de données. Utilisé dans l'administration pour les modules : **Projets, Actualités, Documents, E-learning et Forum**.
*   **Gestion des Rôles (RBAC)** :
    *   **Super Administrateur (UAT/ANSUT)** : Gestion globale.
    *   **Administrateur Pays** : Gestion au niveau national.
    *   **Point Focal** : Saisie et gestion locale des projets.
    *   **Contributeur / Éditeur** : Participation aux documents collaboratifs.
    *   **Visiteur** : Consultation des données publiques.

### 📊 Tableaux de Bord (Dashboards)
*   **Dashboard Global** : Vue d'ensemble continentale des indicateurs FSU.
*   **Dashboard Pays** : Pilotage spécifique à une nation.
*   **Dashboard Opérationnel** : Suivi des tâches en attente et des soumissions.

### 🏗️ Gestion de Projets
*   **Cycle de vie complet** : Création, édition, et suivi des statuts (Planifié, En cours, Terminé, Suspendu).
*   **Données Projets** : Budget, bénéficiaires (hommes/femmes), thématiques, objectifs et indicateurs.
*   **Géolocalisation** : Assignation de coordonnées GPS aux projets.

### 🗺️ Cartographie Interactive
*   **Visualisation Géographique** : Carte Leaflet affichant les projets par pays/région.
*   **Clustering** : Regroupement intelligent des marqueurs pour la lisibilité.
*   **Filtres Avancés** : Filtrage par statut, thématique et zone géographique.

### 📈 Saisie & Suivi FSU (Fonds de Service Universel)
*   **Indicateurs de Connectivité** : Taux de pénétration (mobile/internet), population couverte.
*   **Données Financières** : Collecte des contributions, dépenses engagées, budgets annuels.
*   **Qualité de Service (QoS)** : Latence, disponibilité réseau, débit moyen.

### 🛡️ Workflow de Validation
*   **Soumission de Données** : Envoi des fiches FSU pour revue.
*   **Module de Revue** : Interface permettant d'approuver, rejeter ou demander des révisions avec commentaires.
*   **Historique de Validation** : Traçabilité complète des actions effectuées sur une soumission.

### 📄 Gestion Documentaire & Co-Rédaction
*   **Bibliothèque Numérique** : Stockage et catégorisation des documents officiels.
*   **Gestion des Versions** : Historique complet des modifications.
*   **Co-Rédaction Collaborative** : Éditeur de texte en temps réel pour le travail en groupe sur des rapports.

### 💬 Communauté & Support
*   **Forum de Discussion** : Catégories thématiques, fils de discussion et modération.
*   **Système de Support (Tickets)** : Ouverture et suivi de tickets d'assistance technique.
*   **Veille Stratégique** : Flux d'actualités et revues de presse sectorielles.

### 🌍 Internationalisation (i18n)
*   **Multilingue natif** : Support complet du Français (FR), Anglais (EN), Portugais (PT) et Arabe (AR).
*   **Détection automatique** : Langue basée sur les préférences navigateur.

---

## 🛠️ 2. Solutions & Stack Technique

### Frontend (Interface Utilisateur)
*   **Framework** : [React 18](https://reactjs.org/) avec [TypeScript](https://www.typescriptlang.org/).
*   **Build Tool** : [Vite](https://vitejs.dev/).
*   **Styling** : [Tailwind CSS](https://tailwindcss.com/) pour un design moderne et responsive.
*   **Composants UI** : [Shadcn/UI](https://ui.shadcn.com/) (basé sur [Radix UI](https://www.radix-ui.com/)).
*   **Animations** : [Framer Motion](https://www.framer.com/motion/).
*   **Icônes** : [Lucide React](https://lucide.dev/).

### Backend & Services (Infrastructure)
*   **Backend-as-a-Service** : [Supabase](https://supabase.com/).
    *   **Base de données** : PostgreSQL avec extensions spatiales.
    *   **Authentification** : Gestion des sessions et 2FA.
    *   **Storage** : Stockage des documents et médias (S3-compatible).
*   **Data Fetching** : [TanStack Query (React Query)](https://tanstack.com/query/latest).

### Bibliothèques Spécialisées
*   **Traduction IA** : [LibreTranslate](https://libretranslate.com/) (auto-hébergé ou via API) pour la traduction automatique des contenus dynamiques avec pivot en anglais pour optimiser la précision.
*   **Cartographie** : [Leaflet](https://leafletjs.com/) et [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster).
*   **Graphiques** : [Recharts](https://recharts.org/) pour les visualisations de données.
*   **Formulaires** : [React Hook Form](https://react-hook-form.com/) avec validation [Zod](https://zod.dev/).
*   **Éditeur de texte** : [Tiptap](https://tiptap.dev/) et [CKEditor 5](https://ckeditor.com/ckeditor-5/).
*   **Gestion PDF** : [jsPDF](https://github.com/parallax/jsPDF) pour l'exportation des rapports.
*   **Gestion i18n** : [i18next](https://www.i18next.com/).

---

## ☁️ 3. Services Cloud & Déploiement
*   **Hébergement Frontend** : Déploiement via CI/CD sur infrastructure Cloud.
*   **Hébergement Backend** : Supabase Cloud (AWS/GCP).
*   **Sécurité** : Chiffrement SSL/TLS, isolation des données par pays (RLS - Row Level Security).

---
*Dernière mise à jour : 15 Mai 2026*
