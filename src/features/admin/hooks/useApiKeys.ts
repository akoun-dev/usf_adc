import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { ApiKey } from "../../types"
import { toast } from "sonner"

export function useApiKeys() {
    return useQuery({
        queryKey: ["admin-api-keys"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("api_keys")
                .select("*")
                .order("created_at", { ascending: false })
            if (error) throw error
            return data as ApiKey[]
        },
    })
}

export function useCreateApiKey() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ name, key }: { name: string; key: string }) => {
            const { data, error } = await supabase
                .from("api_keys")
                .insert({ name, key })
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-api-keys"] })
        },
    })
}

export function useUpdateApiKey() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            id,
            updates,
        }: {
            id: string
            updates: Partial<ApiKey>
        }) => {
            const { data, error } = await supabase
                .from("api_keys")
                .update(updates)
                .eq("id", id)
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-api-keys"] })
        },
    })
}

export function useDeleteApiKey() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("api_keys")
                .delete()
                .eq("id", id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-api-keys"] })
        },
    })
}
