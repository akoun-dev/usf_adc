import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export interface IpRule {
    id: string
    name: string
    ip_range: string
    type: "allow" | "deny"
    created_at: string
}

export function useIpRestrictions() {
    return useQuery({
        queryKey: ["admin-ip-restrictions"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("ip_restrictions")
                .select("*")
                .order("created_at", { ascending: false })
            if (error) throw error
            return data as IpRule[]
        },
    })
}

export function useCreateIpRule() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (rule: Omit<IpRule, "id" | "created_at">) => {
            const { data, error } = await supabase
                .from("ip_restrictions")
                .insert(rule)
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-ip-restrictions"],
            })
        },
    })
}

export function useDeleteIpRule() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("ip_restrictions")
                .delete()
                .eq("id", id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-ip-restrictions"],
            })
        },
    })
}

export function useToggleIpFiltering() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (enabled: boolean) => {
            const { error } = await supabase
                .from("platform_settings")
                .update({ value: enabled })
                .eq("key", "ip_filtering_enabled")
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["platform-settings"] })
        },
    })
}
