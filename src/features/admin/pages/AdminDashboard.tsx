import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
    Settings,
    Globe,
    Newspaper,
    Map,
    FileText,
    Calendar,
    MessageSquare,
    Users,
    Users2,
    BarChart3,
} from "lucide-react"

export default function AdminDashboard() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { hasRole } = useAuth()
    const isGlobalAdmin = hasRole("global_admin")

    const adminSections = [
        {
            id: "users",
            title: t("admin.users", "Utilisateurs"),
            description: t("admin.usersDesc", "Gérer les utilisateurs et leurs droits"),
            icon: Users,
            route: "/admin/users",
            color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            borderColor: "border-blue-500/20",
            available: true,
        },
        {
            id: "invitations",
            title: t("admin.invitations", "Invitations"),
            description: t("admin.invitationsDesc", "Gérer les invitations en cours"),
            icon: Users2,
            route: "/admin/invitations",
            color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
            borderColor: "border-cyan-500/20",
            available: true,
        },
        {
            id: "countries",
            title: t("admin.countries", "Pays"),
            description: t("admin.countriesDesc", "Gérer les pays et leurs représentants"),
            icon: Globe,
            route: "/admin/countries",
            color: "bg-green-500/10 text-green-600 dark:text-green-400",
            borderColor: "border-green-500/20",
            available: isGlobalAdmin,
        },
        {
            id: "news",
            title: t("admin.news", "Actualités"),
            description: t("admin.newsDesc", "Gérer les articles et actualités"),
            icon: Newspaper,
            route: "/admin/news",
            color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            borderColor: "border-amber-500/20",
            available: true,
        },
        {
            id: "projects",
            title: t("admin.projects", "Projets"),
            description: t("admin.projectsDesc", "Gérer les projets FSU"),
            icon: Map,
            route: "/admin/projects",
            color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
            borderColor: "border-purple-500/20",
            available: true,
        },
        {
            id: "documents",
            title: t("admin.documents", "Documents"),
            description: t("admin.documentsDesc", "Gérer la bibliothèque documentaire"),
            icon: FileText,
            route: "/admin/documents",
            color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
            borderColor: "border-orange-500/20",
            available: true,
        },
        {
            id: "events",
            title: t("admin.events", "Événements"),
            description: t("admin.eventsDesc", "Gérer le calendrier des événements"),
            icon: Calendar,
            route: "/admin/events",
            color: "bg-red-500/10 text-red-600 dark:text-red-400",
            borderColor: "border-red-500/20",
            available: true,
        },
        {
            id: "forum",
            title: t("admin.forum", "Forum"),
            description: t("admin.forumDesc", "Gérer les catégories et contenu du forum"),
            icon: MessageSquare,
            route: "/admin/forum",
            color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
            borderColor: "border-indigo-500/20",
            available: isGlobalAdmin,
        },
        {
            id: "newsletters",
            title: t("admin.newsletters", "Bulletins"),
            description: t("admin.newslettersDesc", "Créer et gérer les newsletters"),
            icon: Newspaper,
            route: "/admin/newsletters",
            color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
            borderColor: "border-pink-500/20",
            available: isGlobalAdmin,
        },
        {
            id: "settings",
            title: t("admin.settings", "Paramètres"),
            description: t("admin.settingsDesc", "Configuration de la plateforme"),
            icon: Settings,
            route: "/admin/settings",
            color: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
            borderColor: "border-slate-500/20",
            available: isGlobalAdmin,
        },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHero
                title={t("admin.title", "Administration")}
                description={t(
                    "admin.descAdmin",
                    "Gérez le contenu et les paramètres de la plateforme"
                )}
                icon={<BarChart3 className="h-6 w-6 text-secondary" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminSections
                    .filter((section) => section.available)
                    .map((section) => {
                        const Icon = section.icon
                        return (
                            <Card
                                key={section.id}
                                className={`group hover:shadow-lg transition-all duration-200 cursor-pointer border ${section.borderColor}`}
                                onClick={() => navigate(section.route)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-xl ${section.color} group-hover:scale-110 transition-transform duration-200`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg mt-4">
                                        {section.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {section.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        variant="ghost"
                                        className="w-full group-hover:bg-accent"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigate(section.route)
                                        }}
                                    >
                                        {t("common.access", "Accéder")} →
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
            </div>

            {/* Quick Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs">
                            {t("admin.totalUsers", "Total Utilisateurs")}
                        </CardDescription>
                        <CardTitle className="text-2xl">—</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs">
                            {t("admin.activeProjects", "Projets Actifs")}
                        </CardDescription>
                        <CardTitle className="text-2xl">—</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs">
                            {t("admin.pendingValidations", "Validations en attente")}
                        </CardDescription>
                        <CardTitle className="text-2xl">—</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs">
                            {t("admin.newsArticles", "Articles publiés")}
                        </CardDescription>
                        <CardTitle className="text-2xl">—</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
