import { useNavigate } from "react-router-dom"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Settings,
    Key,
    ShieldAlert,
    Database,
    ScrollText,
    BookOpen,
    CalendarClock,
    Bot,
    FileText,
    Search,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useState } from "react"

export default function AdminSettingsPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")

    const settingsSections = [
        {
            value: "fsu",
            title: t("admin.fsuSettings", "Paramètres FSU"),
            description: t(
                "admin.fsuSettingsDesc",
                "Configurez les périodes de soumission et paramètres FSU"
            ),
            icon: FileText,
            color: "bg-[#00833d]/20 text-[#00833d]",
            path: "/admin/settings/fsu",
        },
        {
            value: "apikeys",
            title: t("admin.apiKeys", "Clés API"),
            description: t(
                "admin.apiKeysDesc",
                "Gérez les clés API pour accéder à la plateforme"
            ),
            icon: Key,
            color: "bg-[#00833d]/20 text-[#00833d]",
            path: "/admin/settings/apikeys",
        },
        {
            value: "ip",
            title: t("admin.ipRestrictions", "Restrictions IP"),
            description: t(
                "admin.ipRestrictionsDesc",
                "Configurez les règles d'accès par adresse IP"
            ),
            icon: ShieldAlert,
            color: "bg-[#00833d]/20 text-[#00833d]",
            path: "/admin/settings/ip",
        },
        {
            value: "backups",
            title: t("admin.backups", "Sauvegardes"),
            description: t(
                "admin.backupsDesc",
                "Gérez les sauvegardes de votre base de données"
            ),
            icon: Database,
            color: "bg-[#00833d]/20 text-[#00833d]",
            path: "/admin/settings/backups",
        },
        {
            value: "audit",
            title: t("admin.auditLogs", "Logs d'audit"),
            description: t(
                "admin.auditLogsDesc",
                "Consultez l'historique des actions effectuées"
            ),
            icon: ScrollText,
            color: "bg-[#00833d]/20 text-[#00833d]",
            path: "/admin/settings/audit",
        },
        {
            value: "faq",
            title: t("admin.faqManagement", "Gestion de la FAQ"),
            description: t(
                "admin.faqManagementDesc",
                "Gérez les articles de la Foire Aux Questions"
            ),
            icon: BookOpen,
            color: "bg-[#00833d]/20 text-[#00833d]",
            path: "/admin/settings/faq",
        },
        {
            value: "quarterly",
            title: t("admin.quarterlyReports", "Rapports trimestriels"),
            description: t(
                "admin.quarterlyReportsDesc",
                "Gérez les rapports d'activité trimestriels"
            ),
            icon: CalendarClock,
            color: "bg-[#00833d]/20 text-[#00833d]",
            path: "/admin/settings/quarterly",
        },
        {
            value: "ai",
            title: t("admin.aiSettings", "Assistant IA"),
            description: t(
                "admin.aiSettingsDesc",
                "Configurez le modèle de langage pour l'assistant IA"
            ),
            icon: Bot,
            color: "bg-[#00833d]/20 text-[#00833d]",
            path: "/admin/settings/ai",
        },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-[#00833d]">
                    {t("admin.settings", "Paramètres")}
                </h1>
                <p className="text-muted-foreground">
                    {t(
                        "admin.settingsDesc",
                        "Gestion globale, sécurité et maintenance de la plateforme"
                    )}
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t(
                        "admin.searchSections",
                        "Rechercher une section de paramètres..."
                    )}
                    className="pl-9"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Settings Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {settingsSections
                    .filter(
                        section =>
                            section.title
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            section.description
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                    )
                    .map(section => {
                        const Icon = section.icon
                        return (
                            <Card
                                key={section.value}
                                className="group cursor-pointer hover:shadow-lg hover:border-[#00833d] transition-all duration-200"
                                onClick={() => navigate(section.path)}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-full ${section.color}`}
                                        >
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity border-[#00833d] text-[#00833d]"
                                        >
                                            →
                                        </Badge>
                                    </div>
                                    <CardTitle className="mt-4 group-hover:text-[#00833d] transition-colors">
                                        {section.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {section.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-6" />
                            </Card>
                        )
                    })}
            </div>
        </div>
    )
}
