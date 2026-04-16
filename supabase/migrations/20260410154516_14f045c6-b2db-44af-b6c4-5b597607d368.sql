
-- Create project_status enum
CREATE TYPE project_status AS ENUM ('planned', 'in_progress', 'completed', 'suspended');

-- Create projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid NOT NULL REFERENCES public.countries(id),
  title text NOT NULL,
  description text,
  status project_status NOT NULL DEFAULT 'planned',
  budget numeric(15,2),
  latitude double precision,
  longitude double precision,
  region text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- SELECT: all authenticated users
CREATE POLICY "Authenticated users can view all projects"
ON public.projects FOR SELECT TO authenticated
USING (true);

-- INSERT: country_admin for own country, global_admin for all
CREATE POLICY "Country admins can insert projects for their country"
ON public.projects FOR INSERT TO authenticated
WITH CHECK (
  (has_role(auth.uid(), 'country_admin'::app_role) AND country_id = get_user_country(auth.uid()))
  OR has_role(auth.uid(), 'global_admin'::app_role)
);

-- UPDATE: country_admin for own country, global_admin for all
CREATE POLICY "Country admins can update projects for their country"
ON public.projects FOR UPDATE TO authenticated
USING (
  (has_role(auth.uid(), 'country_admin'::app_role) AND country_id = get_user_country(auth.uid()))
  OR has_role(auth.uid(), 'global_admin'::app_role)
)
WITH CHECK (
  (has_role(auth.uid(), 'country_admin'::app_role) AND country_id = get_user_country(auth.uid()))
  OR has_role(auth.uid(), 'global_admin'::app_role)
);

-- DELETE: global_admin only
CREATE POLICY "Global admins can delete projects"
ON public.projects FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'global_admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demo projects using country IDs from countries table
INSERT INTO public.projects (country_id, title, description, status, budget, latitude, longitude, region) VALUES
((SELECT id FROM countries WHERE code_iso = 'NG'), 'Réseau fibre optique Lagos-Abuja', 'Déploiement de 900 km de fibre optique reliant Lagos à Abuja', 'in_progress', 45000000.00, 7.4951, 3.3947, 'CEDEAO'),
((SELECT id FROM countries WHERE code_iso = 'SN'), 'Hub numérique de Dakar', 'Centre de données et incubateur technologique', 'planned', 12000000.00, 14.7167, -17.4677, 'CEDEAO'),
((SELECT id FROM countries WHERE code_iso = 'KE'), 'Connectivité rurale Rift Valley', 'Extension du réseau mobile 4G dans la vallée du Rift', 'in_progress', 8500000.00, -0.0236, 37.9062, 'EAC'),
((SELECT id FROM countries WHERE code_iso = 'ZA'), 'Smart Grid Cape Town', 'Réseau électrique intelligent pour la région du Cap', 'completed', 32000000.00, -33.9249, 18.4241, 'SADC'),
((SELECT id FROM countries WHERE code_iso = 'MA'), 'Plateforme e-gouvernement Rabat', 'Digitalisation des services administratifs', 'in_progress', 15000000.00, 34.0209, -6.8416, 'UMA'),
((SELECT id FROM countries WHERE code_iso = 'GH'), 'Formation digitale Accra', 'Programme de formation aux compétences numériques', 'planned', 3500000.00, 5.6037, -0.1870, 'CEDEAO'),
((SELECT id FROM countries WHERE code_iso = 'ET'), 'Cloud souverain Addis-Abeba', 'Infrastructure cloud nationale', 'planned', 28000000.00, 9.0250, 38.7469, 'EAC'),
((SELECT id FROM countries WHERE code_iso = 'TZ'), 'Câble sous-marin Dar es Salaam', 'Point d''atterrissage du câble sous-marin East Africa', 'completed', 18000000.00, -6.7924, 39.2083, 'EAC'),
((SELECT id FROM countries WHERE code_iso = 'CM'), 'Backbone fibre Douala-Yaoundé', 'Liaison fibre optique entre les deux capitales', 'in_progress', 22000000.00, 4.0511, 9.7679, 'CEEAC'),
((SELECT id FROM countries WHERE code_iso = 'CI'), 'Wifi public Abidjan', 'Déploiement de hotspots wifi dans les espaces publics', 'suspended', 5000000.00, 5.3600, -4.0083, 'CEDEAO'),
((SELECT id FROM countries WHERE code_iso = 'EG'), 'Data Center Caire', 'Centre de données Tier 4 au Caire', 'in_progress', 55000000.00, 30.0444, 31.2357, 'UMA'),
((SELECT id FROM countries WHERE code_iso = 'RW'), 'Smart Kigali Initiative', 'Ville intelligente et IoT urbain', 'completed', 9500000.00, -1.9403, 29.8739, 'EAC');
