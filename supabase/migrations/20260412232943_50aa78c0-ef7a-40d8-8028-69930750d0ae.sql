
-- Assign global_admin role to patrick.somet@ansut.ci
INSERT INTO public.user_roles (user_id, role)
VALUES ('a510d73c-e739-46df-a75b-a0a491508af6', 'global_admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Set country to Côte d'Ivoire
UPDATE public.profiles
SET country_id = 'f8f4393a-e095-483c-8368-1dc515c7603f',
    phone = '+2250709753232'
WHERE id = 'a510d73c-e739-46df-a75b-a0a491508af6';

-- Mark invitation as accepted
UPDATE public.invitations
SET status = 'accepted', accepted_at = now()
WHERE id = '63a4f578-8582-4ada-9a78-aa58ac4a2004';
