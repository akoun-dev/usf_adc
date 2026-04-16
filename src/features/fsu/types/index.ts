import type { Tables } from '@/integrations/supabase/types';
import type { SubmissionStatus } from '@/core/constants/roles';

export type FsuSubmission = Tables<'fsu_submissions'>;
export type FsuAttachment = Tables<'fsu_submission_attachments'>;
export type FsuVersion = Tables<'fsu_submission_versions'>;

export interface ConnectivityData {
  population_covered: number;
  mobile_penetration_rate: number;
  internet_penetration_rate: number;
  num_operators: number;
  mobile_subscribers: number;
  internet_subscribers: number;
}

export interface FinancingData {
  annual_fsu_budget: number;
  contributions_collected: number;
  expenses_incurred: number;
  balance: number;
  num_funded_projects: number;
}

export interface QualityData {
  average_latency_ms: number;
  network_availability_percent: number;
  geographic_coverage_percent: number;
  population_coverage_percent: number;
  avg_download_speed_mbps: number;
}

export interface FsuFormData {
  period_start: string;
  period_end: string;
  connectivity: ConnectivityData;
  financing: FinancingData;
  quality: QualityData;
}

export interface SubmissionFilters {
  status?: SubmissionStatus;
  dateFrom?: string;
  dateTo?: string;
}
