// Core constants — Single source of truth derived from database enums
// Import types from the auto-generated Supabase types
import type { Enums } from '@/integrations/supabase/types';

export type AppRole = Enums<'app_role'>;
export type SubmissionStatus = Enums<'submission_status'>;
export type TicketStatus = Enums<'ticket_status'>;
export type NotificationType = Enums<'notification_type'>;
export type ValidationActionType = Enums<'validation_action_type'>;

export const APP_ROLES = {
  PUBLIC_EXTERNAL: 'public_external' as const,
  POINT_FOCAL: 'point_focal' as const,
  COUNTRY_ADMIN: 'country_admin' as const,
  GLOBAL_ADMIN: 'global_admin' as const,
};

export const SUBMISSION_STATUS = {
  DRAFT: 'draft' as const,
  SUBMITTED: 'submitted' as const,
  UNDER_REVIEW: 'under_review' as const,
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const,
  REVISION_REQUESTED: 'revision_requested' as const,
};

export const TICKET_STATUS = {
  OPEN: 'open' as const,
  IN_PROGRESS: 'in_progress' as const,
  RESOLVED: 'resolved' as const,
  CLOSED: 'closed' as const,
};

export const ROLE_LABELS: Record<AppRole, string> = {
  public_external: 'Public Externe',
  point_focal: 'Point Focal National',
  country_admin: 'Administrateur Pays',
  global_admin: 'Administrateur Global ANSUT/UAT',
};

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  draft: 'Brouillon',
  submitted: 'Soumis',
  under_review: 'En revue',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  revision_requested: 'Révision demandée',
};

// Role hierarchy (higher index = more privileges)
export const ROLE_HIERARCHY: AppRole[] = [
  'public_external',
  'point_focal',
  'country_admin',
  'global_admin',
];

// Default redirect paths per role
export const ROLE_DASHBOARD_PATHS: Record<AppRole, string> = {
  public_external: '/dashboard/public',
  point_focal: '/dashboard/point-focal',
  country_admin: '/dashboard/admin-pays',
  global_admin: '/dashboard/admin-global',
};
