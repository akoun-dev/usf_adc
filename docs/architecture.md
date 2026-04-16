# Architecture — usf-adc.atuuat.africa

## Vue d'ensemble

Plateforme Africaine de Collaboration et d'Innovation pour le Fonds du Service Universel (FSU).
Architecture modulaire orientée domaine (feature-based), avec séparation stricte UI / logique applicative / domaine / accès données.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18, TypeScript strict, Vite 5, Tailwind CSS v3 |
| UI Components | shadcn/ui (personnalisés) |
| State Management | TanStack Query (server state), Zustand (client state minimal) |
| Routing | React Router v6 |
| Validation | Zod |
| Backend | Lovable Cloud (Supabase) |
| Auth | Supabase Auth |
| Database | PostgreSQL via Supabase |
| Storage | Supabase Storage |
| Edge Functions | Deno (Supabase Edge Functions) |
| Maps | Leaflet / MapLibre |
| Charts | Recharts |
| i18n | react-i18next (structure prête) |

## Architecture des dossiers

```
src/
  app/                          # Configuration applicative
    router/                     # Routes, guards, layout routing
    providers/                  # QueryClient, Auth, Theme, i18n
    layouts/                    # MainLayout, AuthLayout, PublicLayout
  core/                         # Noyau partagé cross-feature
    config/                     # Variables d'environnement, feature flags
    constants/                  # Enums: rôles, statuts, permissions
    types/                      # Types globaux (User, Role, etc.)
    utils/                      # Helpers purs (formatDate, slugify...)
    permissions/                # Matrice de permissions, guards
    errors/                     # Classes d'erreurs, error boundaries
  features/                     # Modules métier (1 feature = 1 dossier)
    auth/
    profiles/
    dashboard/
    fsu-data/
    validation-workflow/
    users/
    reports/
    projects-map/
    forum/
    notifications/
    support/
    onboarding/
  integrations/                 # Couche d'accès externe
    supabase/
      client/                   # Instance Supabase singleton
      repositories/             # Accès données par domaine
      mappers/                  # DTO → Domain mapping
    storage/                    # Helpers upload/download
    maps/                       # Config cartographique
  shared/                       # Composants UI réutilisables
    components/
    forms/
    tables/
    modals/
    ui/                         # shadcn customisés
```

## Principes fondamentaux

1. **Feature-based modules** : chaque feature est autonome avec ses types, schemas, services, hooks et UI
2. **Pas de Supabase dans les composants UI** : tout passe par `integrations/supabase/repositories/`
3. **Logique métier centralisée** dans les services de chaque feature
4. **Permissions déclaratives** : matrice rôle/action dans `core/permissions/`
5. **Validation Zod** pour tous les formulaires et payloads
6. **RLS + guards frontend** : double contrôle d'accès
7. **Audit trail** : chaque mutation critique est journalisée
8. **TypeScript strict** : pas de `any`, pas d'implicit any

## Flux de données

```
UI Component
  → Hook (useQuery/useMutation)
    → Service (logique métier)
      → Repository (accès Supabase)
        → Supabase Client
```

## Sécurité

- RLS activé sur toutes les tables sensibles
- Policies par rôle (Public, Point Focal, Admin Pays, Admin Global)
- Buckets storage séparés (public / privé)
- 2FA pour les admins
- Audit log sur toutes les actions critiques
- Aucune clé sensible côté client
