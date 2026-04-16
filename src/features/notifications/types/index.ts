export interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'warning' | 'action_required' | 'system';
  title: string;
  message: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}
