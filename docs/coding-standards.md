# Coding Standards — usf-adc.atuuat.africa

## TypeScript

- `strict: true` dans tsconfig
- Aucun `any` — utiliser `unknown` + type guards si nécessaire
- Types explicites pour les retours de fonctions publiques
- Interfaces pour les objets de données, types pour les unions/intersections

## Structure d'un module feature

```
features/my-feature/
  components/        # Composants React spécifiques à la feature
  pages/             # Pages/routes de la feature
  hooks/             # Hooks React (useMyFeature, useMyFeatureQuery)
  services/          # Logique métier pure
  schemas/           # Schémas Zod de validation
  types/             # Types TypeScript du domaine
  index.ts           # Exports publics du module
```

## Conventions de nommage

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Composant | PascalCase | `SubmissionForm.tsx` |
| Hook | camelCase, préfixe `use` | `useSubmissions.ts` |
| Service | camelCase, suffixe `Service` | `submissionService.ts` |
| Repository | camelCase, suffixe `Repository` | `submissionRepository.ts` |
| Schema Zod | camelCase, suffixe `Schema` | `submissionSchema.ts` |
| Type/Interface | PascalCase | `FsuSubmission` |
| Enum/Constante | UPPER_SNAKE_CASE | `SUBMISSION_STATUS` |
| Fichier utilitaire | camelCase | `formatDate.ts` |

## Règles de code

1. **Pas de logique métier dans les composants UI** — déléguer aux hooks/services
2. **Pas d'appels Supabase dans les composants** — passer par les repositories
3. **Pas de magic strings** — utiliser des constantes/enums
4. **Pas de fichier > 200 lignes** — découper
5. **Pas de props drilling > 2 niveaux** — utiliser context ou composition
6. **Validation Zod** pour tous les formulaires
7. **Error boundaries** autour des features critiques
8. **Loading/Empty/Error states** sur chaque écran de données

## Patterns de hooks

```typescript
// Query hook pattern
export function useSubmissions(filters: SubmissionFilters) {
  return useQuery({
    queryKey: ['submissions', filters],
    queryFn: () => submissionRepository.list(filters),
  });
}

// Mutation hook pattern
export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubmissionInput) => 
      submissionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}
```

## Imports

- Utiliser les alias `@/` pour les imports absolus
- Ordre : externes → @/ core → @/ shared → @/ features → relatifs
- Pas d'imports circulaires entre features

## Git (hors Lovable)

- Commits conventionnels : `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Une branche par feature
- PR obligatoire avec review
