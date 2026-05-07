import type { AppRole } from "@/core/constants/roles"

/**
 * Get the translated label for a role
 * @param role - The role to get the label for
 * @param t - The translation function from useTranslation()
 * @returns The translated role label
 */
export function getRoleLabel(role: AppRole, t: (key: string) => string): string {
    return t(`roles.${role}`)
}

/**
 * Get all role labels as a record
 * @param t - The translation function from useTranslation()
 * @returns A record mapping roles to their translated labels
 */
export function getRoleLabels(t: (key: string) => string): Record<AppRole, string> {
    return {
        point_focal: t("roles.point_focal"),
        country_admin: t("roles.country_admin"),
        super_admin: t("roles.super_admin"),
        contributor: t("roles.contributor"),
        editor: t("roles.editor"),
        participant: t("roles.participant"),
    }
}
