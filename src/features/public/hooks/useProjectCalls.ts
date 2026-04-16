import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectCall {
  id: string;
  title: string;
  description: string | null;
  objectives: string[] | null;
  eligibility_criteria: string[] | null;
  deadline: string | null;
  contact_email: string | null;
  contact_url: string | null;
  thematic: string | null;
  is_open: boolean;
  created_at: string;
}

export function useProjectCalls() {
  return useQuery<ProjectCall[]>({
    queryKey: ['project-calls'],
    queryFn: async () => {
      // Always return mock data for now
      // TODO: Remove this when database is properly populated
      return getMockProjectCalls();

      /* const { data, error } = await supabase
        .from('project_calls' as any)
        .select('*')
        .eq('is_open', true)
        .order('deadline', { ascending: true, nullsFirst: false });

      if (error) {
        if (error.code === '42P01') {
          return getMockProjectCalls();
        }
        throw error;
      }

      // If table exists but is empty, return mock data
      if (!data || data.length === 0) {
        return getMockProjectCalls();
      }

      return data as ProjectCall[];
      */
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

function getMockProjectCalls(): ProjectCall[] {
  return [
    {
      id: '1',
      title: 'Appel à projets : Connectivité rurale 2026',
      description: 'Cet appel à projets vise à financer des initiatives de connectivité dans les zones rurales et mal desservies d\'Afrique.',
      objectives: [
        'Étendre la couverture réseau dans les zones rurales',
        'Déployer des solutions de connectivité innovantes',
        'Renforcer l\'accès aux services numériques essentiels',
      ],
      eligibility_criteria: [
        'Être basé dans un pays membre de l\'UAT',
        'Justifier d\'une expérience dans les télécommunications',
        'Présenter un plan de financement viable',
      ],
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      contact_email: 'projets@atuuat.africa',
      contact_url: 'https://atuuat.africa/projects/rural-connectivity-2026',
      thematic: 'Infrastructure',
      is_open: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Initiative : Centres numériques communautaires',
      description: 'Financement pour la création de centres numériques polyvalents au service des communautés locales.',
      objectives: [
        'Créer des espaces d\'accès public au numérique',
        'Former les populations aux compétences numériques',
        'Faciliter l\'accès aux services en ligne',
      ],
      eligibility_criteria: [
        'Projet porté par une organisation locale',
        'Disponibilité d\'un local adapté',
        'Engagement de pérennité du projet',
      ],
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      contact_email: 'communautes@atuuat.africa',
      contact_url: 'https://atuuat.africa/projects/digital-centers',
      thematic: 'Inclusion numérique',
      is_open: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Programme : Innovation dans le FSU',
      description: 'Soutien aux projets innovants utilisant des technologies émergentes pour le Service Universel.',
      objectives: [
        'Encourager l\'innovation technologique',
        'Tester des solutions pilotes',
        'Documenter et partager les meilleures pratiques',
      ],
      eligibility_criteria: [
        'Projet innovant à fort potentiel d\'impact',
        'Prototype ou proof-of-concept existant',
        'Capacité de déploiement à plus grande échelle',
      ],
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      contact_email: 'innovation@atuuat.africa',
      contact_url: 'https://atuuat.africa/projects/innovation-fsu',
      thematic: 'Innovation',
      is_open: true,
      created_at: new Date().toISOString(),
    },
  ];
}
