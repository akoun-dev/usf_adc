import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface QuarterlyReport {
    id: string
    title: string
    quarter: string
    year: number
    summary: string
    file_url: string | null
    created_at: string
    is_published: boolean
}

export function useQuarterlyReports() {
    return useQuery({
        queryKey: ["admin-quarterly-reports"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("quarterly_reports")
                .select("*")
                .order("year", { ascending: false })
                .order("quarter", { ascending: false })
            if (error) throw error
            return data as QuarterlyReport[]
        },
    })
}

export function useCreateQuarterlyReport() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (
            report: Omit<QuarterlyReport, "id" | "created_at">
        ) => {
            const { data, error } = await supabase
                .from("quarterly_reports")
                .insert(report)
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-quarterly-reports"],
            })
        },
    })
}

export function useUpdateQuarterlyReport() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            id,
            updates,
        }: {
            id: string
            updates: Partial<QuarterlyReport>
        }) => {
            const { data, error } = await supabase
                .from("quarterly_reports")
                .update(updates)
                .eq("id", id)
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-quarterly-reports"],
            })
        },
    })
}

export function useDeleteQuarterlyReport() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("quarterly_reports")
                .delete()
                .eq("id", id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-quarterly-reports"],
            })
        },
    })
}
