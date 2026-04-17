# Matrice Rôles & Permissions — usf-adc.atuuat.africa

## Rôles

| Code | Libellé | Périmètre |
| ---- | ------- | --------- |

| `point_focal` | Point Focal National | Son pays, ses saisies |
| `country_admin` | Admin Pays | Toutes données de son pays |
| `global_admin` | Admin Global ANSUT/UAT | Toutes données, tous pays |

## Matrice de permissions

| Ressource / Action             | Point Focal    | Admin Pays        | Admin Global |
| ------------------------------ | -------------- | ----------------- | ------------ |
| **Dashboard**                  | Perso          | Pays              | Global       |
| **Carte projets (publique)**   | ✓              | ✓                 | ✓            |
| **Fiche projet détaillée**     | Toutes pays    | Toutes pays       | Toutes       |
| **FSU — Créer soumission**     | ✓              | ✗                 | ✗            |
| **FSU — Modifier brouillon**   | Ses brouillons | ✗                 | ✗            |
| **FSU — Soumettre**            | ✓              | ✗                 | ✗            |
| **FSU — Voir soumissions**     | Siennes        | Pays              | Toutes       |
| **FSU — Valider/Rejeter**      | ✗              | Pays              | Toutes       |
| **Utilisateurs — Inviter**     | ✗              | Pays              | Tous         |
| **Utilisateurs — Gérer rôles** | ✗              | Pays (sauf admin) | Tous         |
| **Utilisateurs — Désactiver**  | ✗              | Pays              | Tous         |
| **Rapports — Consulter**       | Pays           | Pays              | Tous         |
| **Rapports — Exporter**        | ✗              | Pays              | Tous         |
| **KPIs**                       | Basiques       | Pays              | Globaux      |
| **Forum — Lire**               | ✓              | ✓                 | ✓            |
| **Forum — Poster**             | ✓              | ✓                 | ✓            |
| **Forum — Modérer**            | ✗              | ✗                 | ✓            |
| **Support — Créer ticket**     | ✓              | ✓                 | ✓            |
| **Support — Gérer tickets**    | ✗              | ✗                 | ✓            |
| **Audit log**                  | ✗              | Pays              | Tous         |
| **Config système**             | ✗              | ✗                 | ✓            |
| **Notifications**              | Perso          | Perso + pays      | Toutes       |

## Règles RLS résumées

- `point_focal` : CRUD sur ses propres soumissions, SELECT pays
- `country_admin` : SELECT/UPDATE sur données pays, validation
- `global_admin` : ALL sur toutes les tables
- Fonction `has_role(user_id, role)` en SECURITY DEFINER pour éviter récursion RLS
