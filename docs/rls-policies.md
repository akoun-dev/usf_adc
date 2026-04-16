# Politiques RLS — usf-adc.atuuat.africa

## Fonction utilitaire (SECURITY DEFINER)

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_country(_user_id uuid)
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT country_id FROM public.profiles
  WHERE id = _user_id
$$;
```

## Politiques par table

### profiles
- SELECT : authentifié → son profil OU admin global OU même pays si admin pays
- UPDATE : son propre profil uniquement

### fsu_submissions
- INSERT : point_focal uniquement, `submitted_by = auth.uid()`
- SELECT : point_focal → ses soumissions | admin pays → pays | admin global → tout
- UPDATE : point_focal → brouillons uniquement | admin pays/global → validation
- DELETE : point_focal → brouillons uniquement

### fsu_validation_actions
- INSERT : admin pays (son pays) ou admin global
- SELECT : comme fsu_submissions

### projects
- SELECT public : `status = 'published'`
- SELECT authentifié : selon rôle/pays
- INSERT/UPDATE : admin pays ou admin global

### audit_logs
- INSERT : via fonction serveur uniquement
- SELECT : admin pays (son pays) ou admin global

### forum_topics / forum_posts
- SELECT : tous authentifiés
- INSERT : tous authentifiés
- UPDATE/DELETE : auteur ou admin global

### support_tickets
- INSERT : tous authentifiés
- SELECT : auteur ou admin global
- UPDATE : admin global

### notifications
- SELECT : `user_id = auth.uid()`
- UPDATE : `user_id = auth.uid()` (marquer lu)

## Principes

1. RLS activé sur TOUTES les tables ci-dessus
2. Jamais de requête récursive dans les policies → utiliser `has_role()` et `get_user_country()`
3. Double vérification : frontend (guards) + backend (RLS)
4. Les opérations admin critiques passent par des Edge Functions avec vérification serveur
