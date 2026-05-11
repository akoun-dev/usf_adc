# Rapport d'Audit de Conformité — Plateforme NEXUS (USF-ADCA)

**Date :** 11 Mai 2026  
**Objet :** Analyse de l'adéquation entre les développements actuels et les exigences UAT (User Acceptance Tests).

## 1. Résumé Exécutif
L'audit de la plateforme NEXUS révèle une base technique solide alignée sur les besoins métier fondamentaux (Gestion de projet, Cartographie, Rôles). Cependant, des écarts significatifs subsistent concernant les restrictions d'accès territoriales, la nomenclature des rôles, et le zonage géographique selon les standards de l'Union Africaine des Télécommunications (UAT).

---

## 2. Analyse Détaillée par Thématique

### 👤 Profils et Droits d'Accès
| Exigence UAT | État dans le Code | Statut | Commentaire |
| :--- | :--- | :---: | :--- |
| Nomenclature : Lecteur → Visiteur | `participant` utilisé dans `roles.ts` | ⚠️ | Le label affiché est "Participant", doit être renommé en "Visiteur". |
| Restriction Territoriale (Admin Pays/PF) | Pas de verrouillage automatique | ❌ | Un Admin Pays peut techniquement sélectionner un autre pays dans `CreateProjectPage.tsx`. |
| Droits Super Admin (Toutes autorisations) | Implémenté via `super_admin` | ✅ | Contrôles présents dans les services et UI. |

### 📄 Gestion Documentaire
| Exigence UAT | État dans le Code | Statut | Commentaire |
| :--- | :--- | :---: | :--- |
| Processus de Validation (Feedback) | `ValidationPanel.tsx` avec commentaires | ✅ | Système de validation avec Approbation/Rejet/Révision fonctionnel. |
| Archives avec délai de validité (1 an) | Absent de la table `documents` | ❌ | Aucun champ `expiration_date` ou logique de purge automatique trouvée. |
| Co-rédaction des documents | Module `coRedaction` présent | ✅ | Fonctionnalité avancée de collaboration implémentée. |

### 🎨 Identité Visuelle et Messages Officiels
| Exigence UAT | État dans le Code | Statut | Commentaire |
| :--- | :--- | :---: | :--- |
| Message du Secrétaire Général (UAT) | Présent dans `fr.json` (M. John Omo) | ✅ | Section dédiée sur la page d'accueil publique. |
| Message du Directeur Général (Pays) | Présent (M. Gilles Beugré) | ✅ | Intégré à la section "Bienvenue" de la Home. |

### 🗺️ Cartographie et Zonage
| Exigence UAT | État dans le Code | Statut | Commentaire |
| :--- | :--- | :---: | :--- |
| 5 Zones Géographiques UAT | Actuellement 8+ RECs (CEDEAO, SADC...) | ❌ | Le code utilise les Communautés Économiques au lieu des 5 zones AU. |
| Carte de Référence UAT | Carte Leaflet standard | ⚠️ | Pas de couche GeoJSON spécifique UAT identifiée comme "référence officielle". |

### 📊 Indicateurs et Gestion de Projet
| Exigence UAT | État dans le Code | Statut | Commentaire |
| :--- | :--- | :---: | :--- |
| Statuts : En cours, Futur, Réalisé | `planned`, `in_progress`, `completed` | ✅ | Correspondance parfaite avec les exigences. |
| Modèle de fiche projet | `ProjectFormData` (21 champs) | ✅ | Couvre Titre, Budget, Objectifs, Indicateurs, Géo. |

---

## 3. Synthèse des Écarts Critiques (Gaps)

1.  **Gouvernance des Données (Sécurité) :** Absence de filtrage strict de la liste des pays en fonction du profil de l'utilisateur connecté (Admin Pays/Point Focal).
2.  **Standardisation AU :** Le système de filtrage géographique doit passer d'une logique REC (Regional Economic Communities) à une logique de Zones AU (5 zones).
3.  **Cycle de vie Documentaire :** Manque de gestion de l'obsolescence des documents (date de validité).

---

## 4. Plan d'Action Recommandé

### Priorité Haute (Correction Immédiate)
*   **[Rôles]** : Renommer `participant` en `visiteur` dans `src/core/constants/roles.ts` et les fichiers de traduction.
*   **[Sécurité]** : Modifier `CreateProjectPage.tsx` pour que le champ "Pays" soit pré-rempli et désactivé pour les `country_admin` et `point_focal`.

### Priorité Moyenne (Évolution Fonctionnelle)
*   **[Zones]** : Mettre à jour la table `countries` et les énumérations pour refléter les 5 zones UAT au lieu des RECs.
*   **[Archives]** : Ajouter un champ `validity_end_date` à la table `documents` et implémenter un filtre "Archivé" automatique.

### Priorité Basse (Optimisation)
*   **[Cartographie]** : Intégrer une couche GeoJSON délimitant officiellement les 5 zones UAT sur la `ProjectsMapPage`.

---
*Rapport généré par Antigravity — Audit de Conformité NEXUS v1.0*
