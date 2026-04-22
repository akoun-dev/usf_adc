// Core constants — Single source of truth derived from database enums
// Import types from the auto-generated Supabase types
import type { Enums } from "@/integrations/supabase/types"

export type AppRole = Enums<"app_role">
export type SubmissionStatus = Enums<"submission_status">
export type TicketStatus = Enums<"ticket_status">
export type NotificationType = Enums<"notification_type">
export type ValidationActionType = Enums<"validation_action_type">

export const APP_ROLES = {
    POINT_FOCAL: "point_focal" as const,
    COUNTRY_ADMIN: "country_admin" as const,
    super_admin: "super_admin" as const,
}

export const SUBMISSION_STATUS = {
    DRAFT: "draft" as const,
    SUBMITTED: "submitted" as const,
    UNDER_REVIEW: "under_review" as const,
    APPROVED: "approved" as const,
    REJECTED: "rejected" as const,
    REVISION_REQUESTED: "revision_requested" as const,
}

export const TICKET_STATUS = {
    OPEN: "open" as const,
    IN_PROGRESS: "in_progress" as const,
    RESOLVED: "resolved" as const,
    CLOSED: "closed" as const,
}

/**
 * @deprecated Use getRoleLabel(role, t) from utils/roles instead for i18n support
 * This will be removed in a future version
 */
export const ROLE_LABELS: Record<AppRole, string> = {
    point_focal: "Point Focal National",
    country_admin: "Administrateur Pays",
    super_admin: "Super Admin",
}

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
    draft: "Brouillon",
    submitted: "Soumis",
    under_review: "En revue",
    approved: "Approuvé",
    rejected: "Rejeté",
    revision_requested: "Révision demandée",
}

// Role hierarchy (higher index = more privileges)
export const ROLE_HIERARCHY: AppRole[] = [
    "point_focal",
    "country_admin",
    "super_admin",
]

// Default redirect paths per role
export const ROLE_DASHBOARD_PATHS: Record<AppRole, string> = {
    point_focal: "/dashboard/point-focal",
    country_admin: "/dashboard/admin-pays",
    super_admin: "/admin",
}
