import type { Tables } from '@/integrations/supabase/types';
import type { ValidationActionType } from '@/core/constants/roles';

export type ValidationAction = Tables<'fsu_validation_actions'>;

export interface ValidationActionWithProfile extends ValidationAction {
  profiles?: { full_name: string | null } | null;
}

export const ACTION_LABELS: Record<ValidationActionType, string> = {
  approve: 'Approuvé',
  reject: 'Rejeté',
  request_revision: 'Révision demandée',
  comment: 'Commentaire',
};

export const ACTION_COLORS: Record<ValidationActionType, string> = {
  approve: 'text-success',
  reject: 'text-destructive',
  request_revision: 'text-warning-foreground',
  comment: 'text-muted-foreground',
};
