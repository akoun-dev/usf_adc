import type { TicketStatus } from '@/core/constants/roles';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: string;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  creator?: { full_name: string | null } | null;
  assignee?: { full_name: string | null } | null;
}
