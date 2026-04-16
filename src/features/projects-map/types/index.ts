export interface Project {
  id: string;
  country_id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  budget: number | null;
  beneficiaire: number | null;
  latitude: number | null;
  longitude: number | null;
  region: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  countries?: {
    name_fr: string;
    name_en: string;
    code_iso: string;
  };
}


export type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'suspended';

export interface ProjectFilters {
  status?: ProjectStatus | '';
  region?: string;
  country_id?: string;
  search?: string;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: 'Planifié',
  in_progress: 'En cours',
  completed: 'Terminé',
  suspended: 'Suspendu',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  planned: '#3b82f6',
  in_progress: '#f59e0b',
  completed: '#22c55e',
  suspended: '#ef4444',
};

export const REGIONS = ['CEDEAO', 'SADC', 'EAC', 'CEEAC', 'UMA'] as const;
