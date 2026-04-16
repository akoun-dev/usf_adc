import { supabase } from '@/integrations/supabase/client';

export async function getComments(ticketId: string) {
  const { data, error } = await supabase
    .from('support_ticket_comments')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addComment(ticketId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('support_ticket_comments')
    .insert({ ticket_id: ticketId, author_id: user.id, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}
