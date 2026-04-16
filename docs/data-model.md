# Modèle de données — usf-adc.atuuat.africa

## Conventions

- UUID v4 pour toutes les clés primaires
- `created_at`, `updated_at` (timestamptz) sur toutes les tables
- `created_by`, `updated_by` (uuid, FK → auth.users) sur les tables métier
- Soft delete via `deleted_at` si nécessaire
- Statuts normalisés via enums PostgreSQL
- Versioning pour les soumissions sensibles

## Enums PostgreSQL

```sql
CREATE TYPE app_role AS ENUM ('public_external', 'point_focal', 'country_admin', 'global_admin');
CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'revision_requested');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'action_required', 'system');
CREATE TYPE validation_action_type AS ENUM ('approve', 'reject', 'request_revision', 'comment');
```

## Tables

### Identité & Accès

| Table | Description | Champs clés |
|-------|-------------|-------------|
| `countries` | Référentiel 54 pays africains | code_iso, name_fr, name_en, region |
| `profiles` | Profil utilisateur étendu (1:1 auth.users) | full_name, avatar_url, country_id, language, phone |
| `user_roles` | Association user ↔ rôle | user_id, role (app_role) |

### FSU — Cœur métier

| Table | Description | Champs clés |
|-------|-------------|-------------|
| `fsu_submissions` | Soumissions FSU (brouillon → soumis → validé/rejeté) | country_id, submitted_by, status, period_start, period_end, data (jsonb) |
| `fsu_submission_attachments` | Pièces jointes (PDF/Excel, max 5 Mo) | submission_id, file_name, file_path, file_size, mime_type |
| `fsu_submission_versions` | Historique des versions | submission_id, version_number, data, changed_by |
| `fsu_validation_actions` | Actions de validation (approuver/rejeter + commentaire) | submission_id, action_type, acted_by, comment |

### Projets & Cartographie

| Table | Description | Champs clés |
|-------|-------------|-------------|
| `projects` | Projets FSU avec géolocalisation | country_id, title, description, status, budget, latitude, longitude, region |
| `project_documents` | Documents publics liés à un projet | project_id, file_name, file_path |

### Collaboration

| Table | Description | Champs clés |
|-------|-------------|-------------|
| `forum_topics` | Sujets de discussion | title, category, created_by, is_public |
| `forum_posts` | Messages dans les topics | topic_id, content, author_id |

### Pilotage

| Table | Description | Champs clés |
|-------|-------------|-------------|
| `reports` | Rapports générés ou templates | title, type, country_id, file_path, created_by |
| `notifications` | Notifications in-app | user_id, type, title, message, read_at |
| `support_tickets` | Tickets de support | title, description, status, priority, created_by, assigned_to |
| `audit_logs` | Journal d'audit | user_id, action, target_table, target_id, metadata (jsonb), ip_address |

## Relations clés

- `profiles.id` → `auth.users.id` (1:1, ON DELETE CASCADE)
- `user_roles.user_id` → `auth.users.id` (N:1)
- `profiles.country_id` → `countries.id`
- `fsu_submissions.country_id` → `countries.id`
- `fsu_submissions.submitted_by` → `auth.users.id`
- `fsu_submission_attachments.submission_id` → `fsu_submissions.id`
- `fsu_validation_actions.submission_id` → `fsu_submissions.id`
- `fsu_validation_actions.acted_by` → `auth.users.id`
- `projects.country_id` → `countries.id`
- `audit_logs.user_id` → `auth.users.id`

## Fonctions SECURITY DEFINER

```sql
-- Vérifier si un utilisateur a un rôle donné (sans récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Récupérer le country_id d'un utilisateur (sans récursion RLS)
CREATE OR REPLACE FUNCTION public.get_user_country(_user_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT country_id FROM public.profiles WHERE id = _user_id
$$;
```
