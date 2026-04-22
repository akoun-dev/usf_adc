import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/core/constants/roles';

export interface Invitation {
  id: string;
  email: string;
  role: AppRole;
  country_id: string | null;
  token: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invited_by: string;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
  country?: { name_fr: string; code_iso: string } | null;
  inviter?: { full_name: string | null } | null;
}

export async function fetchInvitations(): Promise<Invitation[]> {
  // Fetch invitations with country data
  const { data: invitations, error } = await supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from('invitations' as any)
    .select('*, country:countries(name_fr, code_iso)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invitationsData = (data as any) || [];

  // Fetch inviters profiles separately
  const inviterIds = invitationsData.map((inv: any) => inv.invited_by).filter(Boolean);
  const invitersMap = new Map<string, { full_name: string | null }>();

  if (inviterIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', inviterIds);

    if (profiles) {
      profiles.forEach(profile => {
        invitersMap.set(profile.id, { full_name: profile.full_name });
      });
    }
  }

  // Merge inviter data into invitations
  return invitationsData.map((inv: any) => ({
    ...inv,
    inviter: invitersMap.get(inv.invited_by) || null
  }));
}

export async function createInvitation(params: {
  email: string;
  role: AppRole;
  country_id: string | null;
  invited_by: string;
}): Promise<Invitation> {
  const { data, error } = await supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from('invitations' as any)
    .insert(params)
    .select()
    .single();
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any;
}

export async function cancelInvitation(id: string) {
  const { error } = await supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from('invitations' as any)
    .update({ status: 'cancelled' })
    .eq('id', id);
  if (error) throw error;
}

export async function acceptInvitation(token: string) {
  const { data, error } = await supabase.rpc('accept_invitation', { _token: token });
  if (error) throw error;
  return data as { success: boolean; error?: string; role?: string };
}
