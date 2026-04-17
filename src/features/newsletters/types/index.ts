import type { Database } from "@/integrations/supabase/types"

type AppRole = Database["public"]["Enums"]["app_role"]

export interface Newsletter {
    id: string
    title: string
    summary: string | null
    content: string
    target_roles: AppRole[]
    is_published: boolean
    published_at: string | null
    email_sent: boolean
    created_by: string
    created_at: string
    updated_at: string
}

export interface NewsletterInput {
    title: string
    summary?: string | null
    content: string
    target_roles: AppRole[]
}

export const ROLE_LABELS_FR: Record<AppRole, string> = {
    point_focal: "Point focal",
    country_admin: "Admin pays",
    super_admin: "Admin global",
}
