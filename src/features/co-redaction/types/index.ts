/** Types pour le module Co-Rédaction */

export type DocumentWorkflowStatus = 'draft' | 'editing' | 'submitted' | 'closed' | 'reopened';
export type DocumentPermissionRole = 'editor' | 'reviewer' | 'admin';

export interface CoDocument {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category: string;
  country_id: string | null;
  file_url: string | null;
  status_workflow: DocumentWorkflowStatus;
  is_public: boolean;
  locked_by: string | null;
  locked_at: string | null;
  last_edited_by: string | null;
  closed_at: string | null;
  closed_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  locked_by_profile?: UserProfileBrief | null;
  last_edited_by_profile?: UserProfileBrief | null;
  created_by_profile?: UserProfileBrief | null;
  country?: CountryBrief | null;
}

export interface UserProfileBrief {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface CountryBrief {
  id: string;
  name: string;
  code: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  content: string;
  change_summary: string | null;
  created_by: string | null;
  created_at: string;
  // Joined
  created_by_profile?: UserProfileBrief | null;
}

export interface DocumentPermission {
  id: string;
  document_id: string;
  user_id: string;
  role: DocumentPermissionRole;
  created_at: string;
  // Joined
  user_profile?: UserProfileBrief | null;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentInput {
  title: string;
  description?: string;
  content?: string;
  category?: string;
  country_id?: string;
  file_url?: string;
}

export interface UpdateDocumentInput {
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  country_id?: string;
  file_url?: string;
  status_workflow?: DocumentWorkflowStatus;
  is_public?: boolean;
}

export const WORKFLOW_STATUS_LABELS: Record<DocumentWorkflowStatus, string> = {
  draft: 'Brouillon',
  editing: 'En cours d\'édition',
  submitted: 'Soumis',
  closed: 'Clôturé',
  reopened: 'Réouvert',
};

export const WORKFLOW_STATUS_COLORS: Record<DocumentWorkflowStatus, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  editing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  closed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  reopened: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};

export const LOCK_TIMEOUT_MINUTES = 30;
