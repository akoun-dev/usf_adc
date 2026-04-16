import { z } from 'zod';

export const connectivitySchema = z.object({
  population_covered: z.coerce.number().min(0, 'Requis'),
  mobile_penetration_rate: z.coerce.number().min(0).max(100, 'Max 100%'),
  internet_penetration_rate: z.coerce.number().min(0).max(100, 'Max 100%'),
  num_operators: z.coerce.number().int().min(0, 'Requis'),
  mobile_subscribers: z.coerce.number().min(0, 'Requis'),
  internet_subscribers: z.coerce.number().min(0, 'Requis'),
});

export const financingSchema = z.object({
  annual_fsu_budget: z.coerce.number().min(0, 'Requis'),
  contributions_collected: z.coerce.number().min(0, 'Requis'),
  expenses_incurred: z.coerce.number().min(0, 'Requis'),
  balance: z.coerce.number(),
  num_funded_projects: z.coerce.number().int().min(0, 'Requis'),
});

export const qualitySchema = z.object({
  average_latency_ms: z.coerce.number().min(0, 'Requis'),
  network_availability_percent: z.coerce.number().min(0).max(100, 'Max 100%'),
  geographic_coverage_percent: z.coerce.number().min(0).max(100, 'Max 100%'),
  population_coverage_percent: z.coerce.number().min(0).max(100, 'Max 100%'),
  avg_download_speed_mbps: z.coerce.number().min(0, 'Requis'),
});

export const fsuFormSchema = z.object({
  period_start: z.string().min(1, 'Date de début requise'),
  period_end: z.string().min(1, 'Date de fin requise'),
  connectivity: connectivitySchema,
  financing: financingSchema,
  quality: qualitySchema,
});

export type FsuFormValues = z.infer<typeof fsuFormSchema>;
