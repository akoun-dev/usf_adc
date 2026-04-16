# **Découpage des Modules par Acteur/Utilisateur**

*Plateforme Africaine de Collaboration et d’Innovation pour le Fonds du Service Universel (FSU)*

---

## **1. Module d’Authentification et Gestion des Rôles**

**Accès** : Tous les utilisateurs  
**Fonctionnalités transversales** :


| **Sous-module**                         | **Fonctionnalités**                                                                                                                    | **Redirections**                                                             |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Connexion/Inscription**               | - Formulaire de connexion (email + mot de passe). - Lien "Mot de passe oublié". - Invitation par email pour les nouveaux utilisateurs. | - Redirection vers le tableau de bord correspondant au rôle après connexion. |
| **Gestion des rôles**                   | - Attribution automatique des rôles (Point Focal, Admin Pays, Admin ANSUT/UAT, Public Externe). - Vérification des permissions.        | - Accès refusé si tentative d’accès à un module non autorisé.                |
| **2FA (Authentification à 2 facteurs)** | - Activation obligatoire pour les rôles Admin. - Configuration via SMS/email.                                                          | - Redirection vers la page de configuration du 2FA après première connexion. |
| **Gestion des profils**                 | - Mise à jour des informations personnelles. - Changement de mot de passe. - Préference de notifications.                              | - Sauvegarde automatique et message de confirmation.                         |


---

## **2. Module Points Focaux Nationaux**

**Accès** : Utilisateurs avec le rôle "Point Focal National"

### **2.1. Tableau de Bord Personnalisé**


| **Élement**        | **Fonctionnalités**                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Vue d’ensemble** | - Résumé des indicateurs nationaux (connectivité, financement, projets en cours). - Alertes pour données manquantes. |
| **Accès rapide**   | - Liens vers : Saisie des données, Validation, Rapports, Forum.                                                      |
| **Notifications**  | - Alertes pour : données à valider, nouveaux messages dans le forum, échéances.                                      |


### **2.2. Saisie et Gestion des Données FSU**


| **Sous-module**            | **Fonctionnalités**                                                                                                                             | **Actions**                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Nouvelle saisie**        | - Formulaire de saisie des données (connectivité, qualité, financement). - Champs obligatoires (*). - Upload de justificatifs (PDF/Excel ≤5Mo). | - Sauvegarde en brouillon. - Soumission pour validation.           |
| **Historique des saisies** | - Liste des saisies passées avec statut (brouillon, soumis, approuvé, rejeté). - Filtres par période/thématique.                                | - Modification des brouillons. - Téléchargement des justificatifs. |
| **Modèles de données**     | - Téléchargement de modèles Excel pré-remplis.                                                                                                  | - Lien direct vers les modèles dans la bibliothèque documentaire.  |


### **2.3. Validation et Soumission**


| **Sous-module**           | **Fonctionnalités**                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Prévisualisation**      | - Aperçu des données avant soumission. - Vérification de la cohérence avec les périodes précédentes. |
| **Soumission**            | - Bouton "Soumettre pour validation". - Notification automatique à l’Admin Pays.                     |
| **Suivi des validations** | - Statut en temps réel (En attente/Approuvé/Rejeté). - Commentaires de l’Admin Pays en cas de rejet. |


### **2.4. Rapports et Collaboration**


| **Sous-module**              | **Fonctionnalités**                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Bibliothèque de rapports** | - Accès aux rapports nationaux/régionaux (PDF/Excel). - Filtres par thématique/période.              |
| **Forum de discussion**      | - Création de nouveaux sujets. - Réponses aux messages. - Notifications pour nouvelles interactions. |
| **Groupes thématiques**      | - Adhésion aux groupes (Connectivité, Financement, Réglementation). - Partage de bonnes pratiques.   |


---

## **3. Module Administrateurs Pays**

**Accès** : Utilisateurs avec le rôle "Administrateur Pays"

### **3.1. Tableau de Bord Administratif**


| **Élement**      | **Fonctionnalités**                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------ |
| **Vue globale**  | - Statistiques d’activité (nombre de saisies, taux de validation, participation au forum). |
| **Alertes**      | - Données en attente de validation. - Anomalies signalées par les Points Focaux.           |
| **Accès rapide** | - Liens vers : Gestion d’équipe, Validation des données, Rapports, Configuration.          |


### **3.2. Gestion d’Équipe et des Utilisateurs**


| **Sous-module**               | **Fonctionnalités**                                                                                              | **Actions**                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Invitation d’utilisateurs** | - Formulaire d’invitation (email, rôle, permissions). - Envoi automatique d’un email d’invitation.               | - Réinvitation en cas d’expiration du lien. - Désactivation des comptes inactifs. |
| **Gestion des rôles**         | - Attribution/modification des rôles (Point Focal, Contributeur, Lecteur). - Permissions granulaires par module. | - Audit des changements de rôles.                                                 |
| **Liste des utilisateurs**    | - Tableau filtrable (nom, rôle, statut, dernière connexion). - Export en Excel.                                  | - Désactivation/suppression des comptes.                                          |


### **3.3. Validation et Workflow des Données**


| **Sous-module**            | **Fonctionnalités**                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Liste des saisies**      | - Filtres par statut (En attente, Approuvé, Rejeté). - Tri par date/Point Focal.                       |
| **Détail d’une saisie**    | - Visualisation des données soumises. - Historique des modifications. - Commentaires et justificatifs. |
| **Validation/Approbation** | - Boutons "Approuver"/"Rejeter". - Champ de commentaire obligatoire en cas de rejet.                   |
| **Suivi des validations**  | - Tableau de bord des temps de traitement. - Export des statistiques de validation.                    |


### **3.4. Rapports et Pilotage**


| **Sous-module**            | **Fonctionnalités**                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| **Générateur de rapports** | - Outil drag & drop pour créer des rapports personnalisés. - Export aux formats Excel/PDF.          |
| **KPIs et indicateurs**    | - Suivi des taux de complétion/qualité des données. - Comparaison avec les moyennes régionales.     |
| **Reporting UAT/ANSUT**    | - Génération automatique des rapports trimestriels. - Envoi par email aux destinataires prédéfinis. |


### **3.5. Configuration et Paramétrage**


| **Sous-module**              | **Fonctionnalités**                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| **Paramètres généraux**      | - Configuration des notifications (fréquence, canaux). - Personnalisation du tableau de bord. |
| **Workflow de validation**   | - Définition des niveaux d’approbation (1 ou 2 niveaux). - Délais de validation par défaut.   |
| **Indicateurs prioritaires** | - Sélection des indicateurs à afficher en priorité dans le tableau de bord.                   |


---

## **4. Module Administrateurs ANSUT/UAT**

**Accès** : Utilisateurs avec le rôle "Administrateur ANSUT/UAT"

### **4.1. Tableau de Bord Global**


| **Élement**           | **Fonctionnalités**                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Vue synthétique**   | - Activité globale (nombre d’utilisateurs, publications, interactions). - Cartographie des projets par région. |
| **Alertes critiques** | - Problèmes techniques. - Contenus signalés comme non conformes.                                               |
| **Accès rapide**      | - Liens vers : Gestion des utilisateurs, Modération, Intégration API, Support technique.                       |


### **4.2. Gestion Globale des Utilisateurs**


| **Sous-module**          | **Fonctionnalités**                                                                                  | **Actions**                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Création de comptes**  | - Création manuelle ou import massif (CSV). - Attribution des rôles (Admin Pays, Point Focal, etc.). | - Envoi des identifiants par email sécurisé.                |
| **Audit des comptes**    | - Journal des connexions et actions. - Détection des comptes inactifs/suspects.                      | - Verrouillage des comptes en cas de suspicion d’intrusion. |
| **Permissions avancées** | - Gestion des accès aux modules sensibles (Back Office, Intégration API).                            | - Restriction par IP pour les rôles critiques.              |


### **4.3. Modération et Conformité**


| **Sous-module**           | **Fonctionnalités**                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Modération des forums** | - Liste des messages signalés. - Outils de blocage/suppression. - Historique des actions de modération. |
| **Gestion des contenus**  | - Validation des publications (actualités, documents). - Archivage des anciennes versions.              |
| **Conformité RGPD**       | - Audit des données personnelles. - Outils de suppression/anonymisation sur demande.                    |


### **4.4. Intégration Technique**


| **Sous-module**             | **Fonctionnalités**                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Gestion des API**         | - Configuration des clés API pour les services externes (cartographie, veille). - Journal des appels API.                         |
| **Connecteurs externes**    | - Intégration avec les systèmes de cartographie (ex : Google Maps, ArcGIS). - Synchronisation avec les bases de données de l’UAT. |
| **Sauvegardes et sécurité** | - Planification des sauvegardes automatiques. - Chiffrement des données sensibles.                                                |


### **4.5. Support Technique et Communication**


| **Sous-module**          | **Fonctionnalités**                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| **Ticketing**            | - Système de tickets pour les demandes d’assistance. - Priorisation et affectation aux techniciens. |
| **FAQ et documentation** | - Base de connaissances searchable. - Guides utilisateurs téléchargeables.                          |
| **Newsletters**          | - Création et envoi de newsletters aux utilisateurs. - Personnalisation par rôle/groupe.            |


---

## **5. Module Public Externe (Opérateurs, Partenaires, etc.)**

**Accès** : Utilisateurs avec le rôle "Public Externe" ou "Invité"

### **5.1. Espace Public**


| **Sous-module**               | **Fonctionnalités**                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| **Accueil et présentation**   | - Accès aux informations publiques (objectifs de la plateforme, actualités).                  |
| **Carte interactive**         | - Visualisation des projets FSU (filtres par région/thématique). - Export des données en PDF. |
| **Bibliothèque documentaire** | - Téléchargement des documents publics (rapports, guides). - Recherche avancée.               |


### **5.2. Participation Limitée**


| **Sous-module**         | **Fonctionnalités**                                                                       | **Restrictions**                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Forum de discussion** | - Lecture des sujets publics. - Possibilité de poser des questions (modération a priori). | - Impossible de créer de nouveaux sujets sans validation.                       |
| **Veille stratégique**  | - Accès aux flux RSS et alertes publiques.                                                | - Pas d’accès aux alertes internes ou données sensibles.                        |
| **Appels à projets**    | - Consultation des appels à projets et opportunités de partenariat.                       | - Soumission de propositions via formulaire externe (lien vers site UAT/ANSUT). |


---

## **6. Module Transversal : Cartographie Interactive**

**Accès** : Tous les utilisateurs (niveau de détail variable selon le rôle)


| **Sous-module**       | **Fonctionnalités**                                                                    | **Droits par rôle**                                                                           |
| --------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Carte principale**  | - Visualisation des projets FSU par région (CEDEAO, SADC, etc.). - Filtres dynamiques. | - **Public Externe** : Vue globale. - **Points Focaux/Admin** : Détails et données sensibles. |
| **Fiches projets**    | - Cliquer sur un projet pour afficher sa fiche détaillée (objectifs, budget, statut).  | - **Admin** : Édition des fiches. - **Autres** : Lecture seule.                               |
| **Export et partage** | - Export des données cartographiques (PDF, PNG). - Partage via lien public/privée.     | - **Admin** : Accès aux données brutes. - **Public** : Export limité.                         |


---

## **7. Module Transversal : Formation et Onboarding**

**Accès** : Points Focaux et Administrateurs


| **Sous-module**         | **Fonctionnalités**                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------- |
| **Webinaires**          | - Calendrier des sessions en direct. - Inscription et rappels automatiques.         |
| **Contenus e-learning** | - Modules interactifs (vidéos, quiz). - Suivi de la progression.                    |
| **Exercices pratiques** | - Simulations guidées (ex : saisie de données, validation). - Feedback automatique. |
| **FAQ et support**      | - Base de connaissances contextuelle. - Chatbot pour les questions fréquentes.      |


---

## **8. Module Transversal : Veille Stratégique et Alertes**

**Accès** : Tous les utilisateurs (personnalisable)


| **Sous-module**            | **Fonctionnalités**                                                                      | **Personnalisation**                              |
| -------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Flux RSS**               | - Agrégation des flux (UIT, Smart Africa, UA). - Catégorisation par thématique.          | - Abonnement aux flux par centre d’intérêt.       |
| **Alertes personnalisées** | - Notifications par email/SMS pour : nouveaux appels à projets, échéances, publications. | - Fréquence et canaux de notification ajustables. |
| **Newsletter**             | - Résumé mensuel des actualités et opportunités.                                         | - Désabonnement en un clic.                       |


---

## **9. Module Transversal : Support et Assistance Technique**

**Accès** : Tous les utilisateurs


| **Sous-module**         | **Fonctionnalités**                                                  |
| ----------------------- | -------------------------------------------------------------------- |
| **Centre d’aide**       | - FAQ searchable. - Guides PDF téléchargeables.                      |
| **Contact support**     | - Formulaire de contact. - Chat en direct (heures ouvrables).        |
| **Signalement de bugs** | - Outil de capture d’écran intégré. - Suivi du statut de résolution. |


---

## **10. Résumé des Droits d’Accès par Rôle**


| **Rôle**                     | **Modules principaux**                                                            | **Restrictions**                                                  |
| ---------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Point Focal National**     | Saisie des données, Validation, Rapports, Forum, Formation.                       | Pas d’accès à la gestion des utilisateurs ou à l’admin global.    |
| **Administrateur Pays**      | Gestion d’équipe, Validation des données, Rapports, Configuration.                | Pas d’accès à la modération globale ou à l’intégration technique. |
| **Administrateur ANSUT/UAT** | Gestion globale des utilisateurs, Modération, Intégration API, Support technique. | Accès complet à tous les modules.                                 |
| **Public Externe**           | Carte interactive, Bibliothèque documentaire, Forum (lecture), Veille.            | Pas d’accès aux données sensibles ou aux outils d’admin.          |


---

## **11. Schéma de Navigation et Redirections**

- **Après connexion** : Redirection vers le tableau de bord correspondant au rôle.
- **Tentative d’accès non autorisé** : Message d’erreur + redirection vers la page d’accueil.
- **Première connexion** : Redirection vers la configuration du profil et du 2FA.
- **Invitation par email** : Lien unique valide 48h, redirige vers la création de mot de passe.

---

*Document structuré pour une implémentation technique claire. Pour chaque module, les fonctionnalités, actions et restrictions sont détaillées pour guider le développement et la configuration des droits d’accès.*  
*Besoin d’ajuster ou d’approfondir un module en particulier ?* 😊