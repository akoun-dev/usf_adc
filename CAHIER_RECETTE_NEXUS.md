# 📋 Cahier de Recette — Plateforme NEXUS (USF-ADC)

Ce document répertorie les scénarios de test pour la validation fonctionnelle de la plateforme NEXUS, en prenant en compte les modules, les profils utilisateurs et les exigences d'audit.

## Tableau des scénarios de test

| Modules (Préconditions) | Étapes de test | Résultat attendu | Critères d'acceptation | Profils autorisés | Priorité | Statut (OK / Non OK) | Commentaire |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **Authentification & Accès** | 1. Accéder à /login<br>2. Saisir email/password<br>3. Valider | Accès au Dashboard correspondant au rôle | Redirection fluide sans erreur de session | Tous les comptes | Critique | OK | |
| **Sécurité (2FA)** | 1. Saisir identifiants<br>2. Saisir code OTP reçu par email | Validation du deuxième facteur | Accès autorisé uniquement après saisie du code correct | Admins, Points Focaux | Critique | OK | |
| **Profil Utilisateur** | 1. Accéder au profil<br>2. Modifier le nom/avatar<br>3. Enregistrer | Mise à jour immédiate des informations | Persistance des données en base (Supabase) | Tous les profils | Haute | OK | |
| **Dashboard Global** | 1. Consulter la vue continentale<br>2. Vérifier les KPIs agrégés | Affichage des statistiques (Budget, Projets) | Données cohérentes avec l'ensemble des pays | Super Admin | Critique | OK | |
| **Création de Projet** | 1. Remplir le formulaire multi-onglets<br>2. Saisir données techniques<br>3. Enregistrer | Création du projet avec statut "Planifié" | Validation Zod respectée, stockage images OK | Point Focal, Country Admin | Haute | OK | |
| **Traduction IA (Projets)** | 1. Saisir titre/desc en FR<br>2. Cliquer sur "Traduire" | Génération auto des versions EN, PT, AR | Traduction fidèle via LibreTranslate | Point Focal, Admins | Moyenne | OK | LibreTranslate intégré |
| **Géolocalisation Projet** | 1. Cliquer sur la carte Leaflet<br>2. Définir marqueur | Coordonnées GPS enregistrées | Précision du positionnement sur la carte | Point Focal, Admins | Haute | OK | |
| **Saisie FSU (Connectivité)** | 1. Saisir taux de pénétration<br>2. Saisir population couverte | Données calculées et affichées | Cohérence des taux (0-100%) | Point Focal | Haute | OK | |
| **Workflow de Validation** | 1. Soumettre une fiche FSU<br>2. Revoir en tant qu'Admin Pays | Statut passe de "Brouillon" à "En attente" | Possibilité d'approuver ou rejeter | Point Focal → Admin Pays | Critique | OK | |
| **Demande de Révision** | 1. En tant qu'Admin Pays, rejeter avec commentaire | Notification envoyée au Point Focal | Statut repasse en "Révision requise" | Admin Pays | Haute | OK | |
| **Cartographie (Clustering)** | 1. Zoomer/Dézoomer sur la carte | Regroupement des projets par zone | Lisibilité préservée même avec 100+ projets | Visiteur, Tous | Moyenne | OK | |
| **Bibliothèque Documents** | 1. Upload d'un rapport PDF<br>2. Définir date de validité | Fichier disponible en téléchargement | Gestion de l'obsolescence (validité date) | Admins, Point Focal | Haute | OK | Audit validé |
| **Co-Rédaction (Tiptap)** | 1. Ouvrir document partagé<br>2. Éditer à plusieurs | Modifications visibles en temps réel | Verrouillage de section (Lock) fonctionnel | Contributeurs, Admins | Moyenne | OK | |
| **Forum (Création Sujet)** | 1. Choisir une catégorie<br>2. Rédiger le sujet | Sujet publié et visible | Modération automatique/IA active | Membres, Admins | Moyenne | OK | |
| **Abonnement Newsletter** | 1. Saisir email sur le portail public<br>2. Valider | Email ajouté à la liste de diffusion | Confirmation visuelle (Toast) de l'inscription | Visiteur | Haute | OK | Finalisé récemment |
| **Gestion des Rôles (RBAC)** | 1. Modifier le rôle d'un utilisateur<br>2. Vérifier accès | Permissions mises à jour dynamiquement | Respect strict du filtrage territorial (RLS) | Super Admin | Critique | OK | |
| **Export de Rapports** | 1. Sélectionner filtres pays<br>2. Cliquer sur Export PDF | Téléchargement du fichier généré | Contenu propre avec graphiques Recharts | Admin Pays, Super Admin | Moyenne | OK | |

---

### 🔑 Légende des Profils
- **Super Admin** : Gestion totale, Dashboard Global, Audit Logs.
- **Country Admin** : Validation nationale, Gestion utilisateurs locaux.
- **Point Focal** : Saisie projets, Indicateurs FSU, Co-rédaction.
- **Visiteur** : Consultation carte, Actualités, Bibliothèque publique.

### 🛡️ Note sur les Préconditions
Toutes les actions de mise à jour (Actualités, Projets, Forum, etc.) nécessitent d'être sur le module correspondant avec les droits d'écriture appropriés. Le système de traduction **LibreTranslate** est transversal à tous les modules de création de contenu.

*Dernière mise à jour : 15 Mai 2026*
