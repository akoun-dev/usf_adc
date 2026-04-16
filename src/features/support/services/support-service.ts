import { supabase } from '@/integrations/supabase/client';

export async function getTickets() {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTicket(id: string) {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*, assignee:profiles!assigned_to(full_name)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createTicket(input: { title: string; description: string; priority: string }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      title: input.title,
      description: input.description,
      priority: input.priority,
      created_by: user.id,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTicketStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('support_tickets')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update({ status: status as any })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function assignTicket(id: string, assignedTo: string | null) {
  const { data, error } = await supabase
    .from('support_tickets')
    .update({ assigned_to: assignedTo })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
