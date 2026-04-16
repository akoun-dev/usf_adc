import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/core/constants/roles';
import type { UserProfile } from '../types';

export const userService = {
  async getUsers(): Promise<UserProfile[]> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        *,
        country:countries(name_fr, code_iso)
      `)
      .order('full_name');
    if (error) throw error;

    const { data: allRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');
    if (rolesError) throw rolesError;

    const rolesMap: Record<string, AppRole[]> = {};
    (allRoles || []).forEach((r: { user_id: string; role: AppRole }) => {
      if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
      rolesMap[r.user_id].push(r.role);
    });

    return (profiles || []).map((p: Record<string, unknown>) => ({
      ...p,
      country: Array.isArray(p.country) ? p.country[0] : p.country,
      roles: rolesMap[p.id as string] || [],
    })) as UserProfile[];
  },

  async toggleUserActive(userId: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);
    if (error) throw error;
  },

  async addRole(userId: string, role: AppRole): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });
    if (error) throw error;
  },

  async removeRole(userId: string, role: AppRole): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    if (error) throw error;
  },
};
