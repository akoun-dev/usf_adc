# Feature Map — usf-adc.atuuat.africa

## 1. Module d'Authentification et Gestion des Rôles

**Accès :** Tous les utilisateurs

### Connexion/Inscription

- Formulaire de connexion (email + mot de passe)
- Lien "Mot de passe oublié"
- Invitation par email pour les nouveaux utilisateurs (lien unique 48h)
- Redirection vers le tableau de bord correspondant au rôle

### Gestion des rôles

- Attribution automatique des rôles (Point Focal, Admin Pays, Admin ANSUT/UAT, Public Externe)
- Vérification des permissions
- Accès refusé avec message clair si module non autorisé

### 2FA

- Activation obligatoire pour les rôles Admin
- Configuration via SMS/email à la première connexion
- TOTP (Google Authenticator) en option (v1.1)

### Gestion des profils

- Mise à jour des informations personnelles
- Changement de mot de passe
- Préférences de notifications
- Expiration de session après inactivité

---

## 2. Module Points Focaux Nationaux

**Accès :** Rôle "Point Focal National"

### Tableau de Bord Personnalisé

- Vue d'ensemble : indicateurs nationaux (connectivité, financement, projets)
- Alertes : données manquantes, échéances imminentes
- Accès rapide : Saisie, Validation, Rapports, Forum
- Notifications : données à valider, nouveaux messages forum

### Saisie et Gestion des Données FSU

- Formulaire structuré (connectivité, qualité, financement)
- Champs obligatoires (\*)
- Upload justificatifs (PDF/Excel ≤5 Mo)
- Sauvegarde en brouillon
- Historique des saisies avec statuts et filtres
- Téléchargement modèles Excel pré-remplis UAT

### Validation et Soumission

- Prévisualisation avant soumission
- Vérification cohérence avec périodes précédentes
- Soumission en un clic avec notification auto Admin Pays
- Suivi statut en temps réel (En attente/Approuvé/Rejeté)
- Commentaires Admin Pays en cas de rejet

### Rapports et Collaboration

- Bibliothèque rapports nationaux/régionaux (PDF/Excel)
- Filtres par thématique/période
- Forum : création sujets, réponses, notifications
- Groupes thématiques (Connectivité, Financement, Réglementation)

---

## 3. Module Administrateurs Pays

**Accès :** Rôle "Administrateur Pays"

### Tableau de Bord Administratif

- Statistiques d'activité (saisies, taux validation, participation forum)
- Alertes : données en attente, anomalies signalées
- Accès rapide : Gestion d'équipe, Validation, Rapports, Configuration

### Gestion d'Équipe et Utilisateurs

- Invitation par email (formulaire : email, rôle, permissions)
- Réinvitation si lien expiré
- Attribution/modification des rôles
- Liste utilisateurs filtrable (nom, rôle, statut, dernière connexion)
- Export liste utilisateurs en Excel
- Désactivation/suppression comptes

### Validation et Workflow des Données

- Liste saisies filtrées par statut, triées par date/Point Focal
- Détail saisie : données, historique, commentaires, justificatifs
- Boutons Approuver/Rejeter (commentaire obligatoire si rejet)
- Dashboard temps de traitement
- Export statistiques validation

### Rapports et Pilotage

- Générateur rapports drag & drop
- Export Excel/PDF
- KPIs : taux complétion, qualité données
- Comparaison avec moyennes régionales
- Rapports trimestriels auto + envoi email

### Configuration et Paramétrage

- Configuration notifications (fréquence, canaux)
- Personnalisation tableau de bord
- Workflow de validation : 1 ou 2 niveaux d'approbation
- Délais de validation par défaut
- Sélection indicateurs prioritaires

---

## 4. Module Administrateurs ANSUT/UAT

**Accès :** Rôle "Administrateur ANSUT/UAT"

### Tableau de Bord Global

- Synthèse activité globale (utilisateurs, publications, interactions)
- Cartographie projets par région
- Alertes critiques : problèmes techniques, contenus non conformes
- Accès rapide : Gestion utilisateurs, Modération, API, Support

### Gestion Globale des Utilisateurs

- Création manuelle ou import massif (CSV)
- Attribution des rôles
- Journal des connexions et actions (audit)
- Détection comptes inactifs/suspects
- Verrouillage comptes
- Restriction accès par IP (v1.1)

### Modération et Conformité

- Messages signalés : blocage, suppression, historique
- Validation publications (actualités, documents)
- Archivage anciennes versions
- Conformité RGPD : audit données personnelles, anonymisation

### Intégration Technique

- Configuration clés API services externes
- Journal des appels API
- Connecteurs (cartographie, bases UAT)
- Sauvegardes automatiques planifiées
- Chiffrement données sensibles

### Support Technique et Communication

- Ticketing : priorisation, affectation techniciens
- FAQ et documentation : base de connaissances searchable
- Newsletters par rôle/groupe

---

## 5. Module Public Externe

**Accès :** Rôle "Public Externe" ou "Invité"

### Espace Public

- Accueil : objectifs plateforme, actualités
- Carte interactive : projets FSU avec filtres région/thématique
- Bibliothèque documentaire : rapports, guides, recherche avancée

### Participation Limitée

- Forum : lecture sujets publics, questions avec modération a priori
- Veille : flux RSS et alertes publiques (pas accès données sensibles)
- Projets : consultation, soumission via formulaire externe

---

## 6. Cartographie Interactive (Transversal)

**Accès :** Tous (niveau détail variable par rôle)

- Carte principale : projets FSU par région (CEDEAO, SADC, EAC, CEEAC, UMA)
- Filtres dynamiques : région, thématique, acteur, budget, statut
- Fiches projets : objectifs, budget, statut, indicateurs
- Édition fiches : Admin uniquement
- Export : PDF, PNG
- Partage : lien public/privé

---

## 7. Formation et Onboarding (Transversal)

**Accès :** Points Focaux et Administrateurs

- Webinaires : calendrier, inscription, rappels automatiques
- E-learning : modules interactifs (vidéos, quiz), suivi progression
- Exercices pratiques : simulations guidées, feedback automatique
- FAQ contextuelle et chatbot

---

## 8. Veille Stratégique et Alertes (Transversal)

**Accès :** Tous (personnalisable)

- Flux RSS agrégés (UIT, Smart Africa, UA) par thématique
- Alertes personnalisées email/SMS (Projets, échéances, publications)
- Newsletter mensuelle (résumé personnalisé par rôle)
