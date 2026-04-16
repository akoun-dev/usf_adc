# Product Backlog — usf-adc.atuuat.africa
## BKL-FSU-AFRICA-v1.0 — ANSUT/UAT — Avril 2026

**10 Epics | 85 User Stories | 358 Story Points | 4 Sprints × 2 semaines**

## Légende MoSCoW
- **M** = MUST HAVE — Indispensable pour le lancement
- **S** = SHOULD HAVE — Important mais non bloquant
- **C** = COULD HAVE — Appréciable si vélocité le permet
- **W** = WON'T HAVE (v1) — Reporté à version ultérieure

## Légende Statut
- ✅ = Done

---

## EPIC 1 — Authentification & Gestion des rôles (10 US, 31 SP)

| ID | Rôle | User Story | MoSCoW | SP | Sprint | Statut |
|----|------|-----------|--------|-----|--------|--------|
| US-001 | tout utilisateur | Se connecter avec email/mot de passe | M | 3 | S1 | ✅ |
| US-002 | tout utilisateur | Réinitialiser mot de passe via lien email sécurisé | M | 2 | S1 | ✅ |
| US-003 | nouvel utilisateur | Recevoir email d'invitation avec lien unique 48h | M | 3 | S1 | ✅ |
| US-004 | administrateur | Attribution automatique du rôle correct | M | 5 | S1 | ✅ |
| US-005 | administrateur | Activer 2FA obligatoire pour rôles admin | M | 5 | S1 | ✅ |
| US-006 | administrateur | Configurer 2FA via SMS/email à la 1ère connexion | M | 3 | S1 | ✅ |
| US-007 | tout utilisateur | Mettre à jour profil et préférences notifications | M | 2 | S1 | ✅ |
| US-008 | tout utilisateur | Redirection vers accueil si accès module non autorisé | M | 2 | S1 | ✅ |
| US-009 | tout utilisateur | Expiration session après inactivité | S | 3 | S1 | ✅ |
| US-010 | administrateur | Configurer TOTP (Google Authenticator) pour 2FA | C | 3 | S4 | ✅ |

## EPIC 2 — Tableau de bord par rôle (8 US, 33 SP)

| ID | Rôle | User Story | MoSCoW | SP | Sprint | Statut |
|----|------|-----------|--------|-----|--------|--------|
| US-011 | Point Focal | Résumé indicateurs nationaux (connectivité, financement, projets) | M | 5 | S1 | ✅ |
| US-012 | Point Focal | Alertes données manquantes et échéances | M | 3 | S1 | ✅ |
| US-013 | Point Focal | Accès rapide saisie/validation/rapports/forum | M | 2 | S1 | ✅ |
| US-014 | Admin Pays | Statistiques d'activité équipe (saisies, taux validation) | M | 5 | S2 | ✅ |
| US-015 | Admin Pays | Alertes données en attente et anomalies | M | 3 | S2 | ✅ |
| US-016 | Admin ANSUT/UAT | Synthèse globale activité continentale | M | 5 | S2 | ✅ |
| US-017 | Admin ANSUT/UAT | Cartographie projets actifs par région sur dashboard | S | 5 | S3 | ✅ |
| US-018 | tout utilisateur | Personnaliser widgets du tableau de bord | C | 5 | S4 | ✅ |

## EPIC 3 — Saisie & Gestion des données FSU (12 US, 40 SP)

| ID | Rôle | User Story | MoSCoW | SP | Sprint | Statut |
|----|------|-----------|--------|-----|--------|--------|
| US-019 | Point Focal | Formulaire de saisie structuré (connectivité, financement, qualité) | M | 8 | S2 | ✅ |
| US-020 | Point Focal | Champs obligatoires marqués (*) | M | 2 | S2 | ✅ |
| US-021 | Point Focal | Sauvegarder en brouillon à tout moment | M | 3 | S2 | ✅ |
| US-022 | Point Focal | Upload justificatifs (PDF/Excel, max 5 Mo) | M | 3 | S2 | ✅ |
| US-023 | Point Focal | Historique saisies avec statut | M | 5 | S2 | ✅ |
| US-024 | Point Focal | Filtrer historique par période et thématique | S | 2 | S2 | ✅ |
| US-025 | Point Focal | Télécharger modèles Excel pré-remplis UAT | S | 3 | S2 | ✅ |
| US-026 | Point Focal | Aperçu complet avant soumission | M | 2 | S2 | ✅ |
| US-027 | Point Focal | Avertissement incohérence avec périodes précédentes | S | 5 | S3 | ✅ |
| US-028 | Point Focal | Soumettre en un clic avec notification auto Admin Pays | M | 3 | S2 | ✅ |
| US-029 | Point Focal | Suivre statut en temps réel | M | 3 | S2 | ✅ |
| US-030 | Point Focal | Voir commentaires détaillés en cas de rejet | M | 2 | S2 | ✅ |

## EPIC 4 — Validation & Workflow des données (8 US, 30 SP)

| ID | Rôle | User Story | MoSCoW | SP | Sprint | Statut |
|----|------|-----------|--------|-----|--------|--------|
| US-031 | Admin Pays | Liste saisies en attente filtrées par statut/date | M | 5 | S2 | ✅ |
| US-032 | Admin Pays | Détail complet saisie (données, historique, justificatifs) | M | 3 | S2 | ✅ |
| US-033 | Admin Pays | Approuver en un clic avec notification auto | M | 3 | S2 | ✅ |
| US-034 | Admin Pays | Rejeter avec commentaire obligatoire | M | 3 | S2 | ✅ |
| US-035 | Admin Pays | Configurer workflow 1 ou 2 niveaux d'approbation | S | 5 | S3 | ✅ |
| US-036 | Admin Pays | Délais de validation avec alertes dépassement | S | 3 | S3 | ✅ |
| US-037 | Admin Pays | Exporter statistiques validation en Excel | S | 3 | S3 | ✅ |
| US-038 | Admin ANSUT/UAT | Valider données de tous les pays en mode superviseur | M | 5 | S3 | ✅ |

## EPIC 5 — Gestion des utilisateurs & équipes (10 US, 33 SP)

| ID | Rôle | User Story | MoSCoW | SP | Sprint | Statut |
|----|------|-----------|--------|-----|--------|--------|
| US-039 | Admin Pays | Inviter utilisateurs par email avec rôle prédéfini | M | 3 | S1 | ✅ |
| US-040 | Admin Pays | Réinviter si lien expiré | S | 2 | S2 | ✅ |
| US-041 | Admin Pays | Modifier rôles et permissions d'un utilisateur | M | 3 | S2 | ✅ |
| US-042 | Admin Pays | Liste filtrée utilisateurs (nom, rôle, statut, dernière connexion) | M | 3 | S2 | ✅ |
| US-043 | Admin Pays | Désactiver/supprimer compte inactif | M | 2 | S2 | ✅ |
| US-044 | Admin Pays | Exporter liste utilisateurs en Excel | S | 2 | S3 | ✅ |
| US-045 | Admin ANSUT/UAT | Créer comptes en masse via CSV | S | 5 | S3 | ✅ |
| US-046 | Admin ANSUT/UAT | Journal d'audit connexions et actions | M | 5 | S3 | ✅ |
| US-047 | Admin ANSUT/UAT | Verrouiller compte en cas de suspicion | M | 3 | S3 | ✅ |
| US-048 | Admin ANSUT/UAT | Restreindre accès par plage IP | C | 5 | S4 | ✅ |

## EPIC 6 — Rapports, KPIs & Pilotage (8 US, 34 SP)

| ID | Rôle | User Story | MoSCoW | SP | Sprint | Statut |
|----|------|-----------|--------|-----|--------|--------|
| US-049 | Point Focal | Bibliothèque rapports nationaux/régionaux | M | 3 | S2 | ✅ |
| US-050 | Point Focal | Filtrer rapports par thématique/période | S | 2 | S2 | ✅ |
| US-051 | Admin Pays | Générateur rapports drag & drop | S | 8 | S3 | ✅ |
| US-052 | Admin Pays | Exporter rapports Excel/PDF | M | 3 | S3 | ✅ |
| US-053 | Admin Pays | KPIs pays (taux complétion, qualité données) | M | 5 | S3 | ✅ |
| US-054 | Admin Pays | Comparer KPIs avec moyennes régionales | S | 5 | S3 | ✅ |
| US-055 | Admin Pays | Rapports trimestriels auto + envoi email | S | 5 | S4 | ✅ |
| US-056 | Admin ANSUT/UAT | Dashboard analytique global | M | 5 | S3 | ✅ |

## EPIC 7 — Cartographie interactive & Projets FSU (7 US, 32 SP)

| ID | Rôle | User Story | MoSCoW | SP | Sprint | Statut |
|----|------|-----------|--------|-----|--------|--------|
| US-057 | tout utilisateur | Carte projets FSU par région (CEDEAO, SADC, EAC, CEEAC, UMA) | M | 8 | S2 | ✅ |
| US-058 | tout utilisateur | Filtrer par région, thématique, acteur, budget, statut | M | 5 | S2 | ✅ |
| US-059 | tout utilisateur | Fiche détaillée projet (objectifs, budget, statut, indicateurs) | M | 5 | S2 | ✅ |
| US-060 | administrateur | Créer/éditer fiches projets depuis la carte | M | 5 | S3 | ✅ |
| US-061 | tout utilisateur | Exporter carte en PDF/PNG | S | 3 | S3 | ✅ |
| US-062 | Public Externe | Vue globale carte sans authentification | M | 3 | S2 | ✅ |
| US-063 | Admin ANSUT/UAT | Partager lien public/privé vers vue filtrée | C | 3 | S4 | ✅ |

## EPIC 8 — Forum, Collaboration & Veille stratégique (9 US, 30 SP)

| ID | Rôle | User Story | MoSCoW | SP | Sprint | Statut |
|----|------|-----------|--------|-----|--------|--------|
| US-064 | Point Focal/Admin | Créer sujets dans le forum | M | 3 | S2 | ✅ |
| US-065 | tout utilisateur connecté | Répondre aux sujets + notifications | M | 3 | S2 | ✅ |
| US-066 | tout utilisateur connecté | Rejoindre groupes thématiques | S | 3 | S3 | ✅ |
| US-067 | Public Externe | Lire sujets publics et poser questions (modération a priori) | M | 3 | S2 | ✅ |
| US-068 | Admin ANSUT/UAT | Modérer messages signalés | M | 5 | S3 | ✅ |
| US-069 | tout utilisateur | Flux RSS agrégés (UIT, Smart Africa, UA) | S | 5 | S4 | ✅ |
| US-070 | tout utilisateur | Alertes personnalisées email/SMS | S | 5 | S4 | ✅ |
| US-071 | tout utilisateur | Newsletter mensuelle | C | 3 | S4 | ✅ |
| US-072 | tout utilisateur | Bibliothèque documentaire publique | M | 3 | S2 | ✅ |

## EPIC 9 — Formation, Onboarding & Support technique (10 US, 51 SP)

| ID | Rôle | User Story | MoSCoW | SP | Sprint | Statut |
|----|------|-----------|--------|-----|--------|--------|
| US-073 | Point Focal | Parcours formation dédié (vidéos, quiz, simulations) | M | 8 | S4 | ✅ |
| US-074 | Admin Pays | Parcours formation administrateur | M | 5 | S4 | ✅ |
| US-075 | tout utilisateur | Simulations guidées avec feedback | S | 5 | S4 | ✅ |
| US-076 | tout utilisateur | Webinaires en direct avec rappels | S | 5 | S4 | ✅ |
| US-077 | tout utilisateur | Base de connaissances searchable / FAQ | M | 5 | S4 | ✅ |
| US-078 | tout utilisateur | Ticket support avec capture d'écran + suivi | M | 5 | S3 | ✅ |
| US-079 | tout utilisateur | Chat en direct heures ouvrables | S | 5 | S4 | ✅ |
| US-080 | Admin ANSUT/UAT | Sauvegardes automatiques quotidiennes | M | 5 | S3 | ✅ |
| US-081 | Admin ANSUT/UAT | Co-rédaction documentaire avec versioning | C | 8 | S4 | ✅ |
| US-082 | Admin ANSUT/UAT | Gestion clés API et journaux d'appels | M | 5 | S3 | ✅ |

## EPIC 10 — Internationalisation FR/EN/PT (3 US, 24 SP) — NOUVEAU

| ID | Rôle | User Story | MoSCoW | SP | Sprint | Statut |
|----|------|-----------|--------|-----|--------|--------|
| US-083 | tout utilisateur | Intégrer react-i18next avec fichiers de traduction FR/EN/PT | M | 8 | S3 | ✅ |
| US-084 | tout utilisateur | Basculer la langue depuis le profil ou la sidebar | M | 3 | S3 | ✅ |
| US-085 | tout utilisateur | Traduire tous les modules existants en EN et PT | M | 13 | S3 | ✅ |

---

## Récapitulatif

### Par Epic
| Epic | Intitulé | US | SP | Must | Sprint | Avancement |
|------|----------|----|----|------|--------|------------|
| EPIC 1 | Authentification & Gestion des rôles | 10 | 31 | 8 | S1 | 10/10 ✅ |
| EPIC 2 | Tableau de bord par rôle | 8 | 33 | 6 | S1–S3 | 8/8 ✅ |
| EPIC 3 | Saisie & Gestion des données FSU | 12 | 40 | 9 | S2 | 12/12 ✅ |
| EPIC 4 | Validation & Workflow | 8 | 30 | 6 | S2–S3 | 8/8 ✅ |
| EPIC 5 | Gestion utilisateurs & équipes | 10 | 33 | 7 | S1–S3 | 10/10 ✅ |
| EPIC 6 | Rapports, KPIs & Pilotage | 8 | 34 | 5 | S2–S4 | 8/8 ✅ |
| EPIC 7 | Cartographie & Projets FSU | 7 | 32 | 5 | S2–S4 | 7/7 ✅ |
| EPIC 8 | Forum, Collaboration & Veille | 9 | 30 | 5 | S2–S4 | 9/9 ✅ |
| EPIC 9 | Formation, Onboarding & Support | 10 | 51 | 5 | S3–S4 | 10/10 ✅ |
| EPIC 10 | Internationalisation FR/EN/PT | 3 | 24 | 3 | S3 | 3/3 ✅ |
| **TOTAL** | **10 Epics** | **85** | **358** | **59** | S1→S4 | **85/85 ✅** |

### Par priorité MoSCoW
| Priorité | US | SP | % SP |
|----------|----|----|------|
| MUST HAVE | 59 | ~220 | 61% |
| SHOULD HAVE | 17 | ~88 | 25% |
| COULD HAVE | 9 | ~50 | 14% |
| **TOTAL** | **85** | **~358** | 100% |
