# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web application for USF-ADC (University Staff Forum - Africa Diaspora Consortium), a platform for managing African telecommunications unions content. The app features role-based access control, multi-language support, and public/authenticated content separation.

## Development Commands

```bash
# Start development server (runs on port 8080)
npm run dev

# Production build
npm run build

# Development build
npm run build:dev

# Lint code
npm run lint

# Run tests
npm run test

# Watch mode for tests
npm run test:watch

# Preview production build
npm run preview
```

## Technology Stack

- **React 18.3.1** with TypeScript, built with **Vite** and **SWC** compilation
- **React Router DOM** for routing with lazy-loaded routes
- **TanStack React Query** for server state management and caching
- **Supabase** for database and authentication (auto-generated TypeScript types)
- **i18next** for internationalization (French, English, Portuguese)
- **Shadcn/ui** + **Radix UI** for accessible component primitives
- **Tailwind CSS** with custom ATU brand colors (#00833d green, #ffe700 yellow)
- **Leaflet** for interactive maps

## Architecture

### Feature-Based Organization

```
src/
├── app/router/          # Route definitions with lazy loading
├── components/ui/       # Shadcn/ui components (Radix-based)
├── core/                # Shared types, constants, error boundaries
├── features/            # Feature modules (auth, dashboard, fsu, public, etc.)
├── integrations/        # External services (Supabase client)
├── i18n/                # Translation files and i18n config
└── pages/               # Top-level page components
```

Each feature follows the pattern:
```
features/[feature]/
├── components/      # Feature-specific components
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── services/       # API calls
└── types/          # TypeScript types
```

### Routing Architecture

Routes are defined in `src/app/router/routes.ts`:

- **Public routes**: Accessible without authentication (home, news, events, map, etc.)
- **Auth routes**: Login, password reset, invitation acceptance
- **Authenticated routes**: Protected by `AuthGuard` component
  - Some routes further protected by `RoleGuard` for role-based access

### Role Hierarchy (lowest to highest)

1. `public_external` - Read-only access to authenticated content
2. `point_focal` - National focal point, can submit FSU content
3. `country_admin` - Country administrator, can validate content
4. `global_admin` - Full system access

### State Management Patterns

- **Server state**: React Query with custom hooks (e.g., `usePublicEvents`, `usePastEvents`)
- **Auth state**: React Context (`useAuth` hook)
- **Local state**: useState/useReducer for component-specific state
- **Global state**: Minimized, prefer React Query cache

## Key Patterns

### Date-fns v3 Locale Imports

Due to a Vite alias resolution issue, date-fns locales must be imported directly:
```typescript
import fr from 'date-fns/locale/fr';
import enUS from 'date-fns/locale/en-US';  // Note: no generic 'en' in v3
import pt from 'date-fns/locale/pt';
```

### Component Development

- Use Shadcn/ui components from `@/components/ui/` as base
- Follow existing patterns for feature-specific components
- Use class-variance-authority (CVA) for variant styling
- Use `cn()` utility from `@/lib/utils` for conditional className merging

### API Integration

- Services are in `features/[feature]/services/`
- Use Supabase client from `@/integrations/supabase/`
- Types are auto-generated from Supabase schema

### Internationalization

- Translation keys follow pattern: `feature.section.item`
- Default language is French
- Keys are in `src/i18n/locales/{en,fr,pt}.json`

## Important Notes

### Vite Configuration

- Path alias: `@/` maps to `/src`
- Dev server runs on port 8080
- HMR overlay is disabled
- date-fns locale aliases are defined in vite.config.ts

### DOM Attributes

React requires lowercase DOM attributes. Use `fetchpriority` not `fetchPriority`.

### Role Guards

When adding protected routes, wrap with appropriate guards:
```tsx
<AuthGuard>
  <RoleGuard allowedRoles={['point_focal', 'country_admin', 'global_admin']}>
    {/* Content */}
  </RoleGuard>
</AuthGuard>
```

### Environment Variables

Required in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
