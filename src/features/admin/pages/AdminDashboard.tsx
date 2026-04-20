import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
    Globe,
    Newspaper,
    Map,
    FileText,
    Calendar,
    MessageSquare,
    Users,
    Users2,
    BarChart3,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    ArrowRight,
    Settings,
} from "lucide-react"
import { useUsers } from "@/features/users/hooks/useUsers"
import { useInvitations } from "@/features/invitations/hooks/useInvitations"
import { useProjects } from "@/features/projects-map/hooks/useProjects"

export default function AdminDashboard() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { hasRole } = useAuth()
    const isGlobalAdmin = hasRole("super_admin")

    // Data hooks
    const { data: users = [] } = useUsers()
    const { data: invitations = [] } = useInvitations()
    const { data: projects = [] } = useProjects()

    // Calculate statistics
    const pendingInvitations =
        invitations?.filter((inv: any) => inv.status === "pending")?.length ?? 0
    const activeProjects =
        projects?.filter((p: any) => p.status === "in_progress")?.length ?? 0

    // Quick links configuration
    const quickLinks = [
        {
            label: t("admin.users", "Utilisateurs"),
            icon: Users,
            path: "/admin/users",
            color: "text-blue-600",
        },
        {
            label: t("admin.invitations", "Invitations"),
            icon: Users2,
            path: "/admin/invitations",
            color: "text-cyan-600",
        },
        ...(isGlobalAdmin
            ? [
                  {
                      label: t("admin.countries", "Pays"),
                      icon: Globe,
                      path: "/admin/countries",
                      color: "text-green-600",
                  },
              ]
            : []),
        {
            label: t("admin.news", "Actualités"),
            icon: Newspaper,
            path: "/admin/news",
            color: "text-amber-600",
        },
        {
            label: t("admin.projects", "Projets"),
            icon: Map,
            path: "/admin/projects",
            color: "text-purple-600",
        },
        {
            label: t("admin.documents", "Documents"),
            icon: FileText,
            path: "/admin/documents",
            color: "text-orange-600",
        },
        {
            label: t("admin.events", "Événements"),
            icon: Calendar,
            path: "/admin/events",
            color: "text-red-600",
        },
        ...(isGlobalAdmin
            ? [
                  {
                      label: t("admin.forum", "Forum"),
                      icon: MessageSquare,
                      path: "/admin/forum",
                      color: "text-indigo-600",
                  },
              ]
            : []),
    ]

    const adminSections = [
        {
            id: "users",
            title: t("admin.users", "Utilisateurs"),
            description: t(
                "admin.usersDesc",
                "Gérer les utilisateurs et leurs droits"
            ),
            icon: Users,
            route: "/admin/users",
            color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            borderColor: "border-blue-500/20",
            available: true,
        },
        {
            id: "invitations",
            title: t("admin.invitations", "Invitations"),
            description: t(
                "admin.invitationsDesc",
                "Gérer les invitations en cours"
            ),
            icon: Users2,
            route: "/admin/invitations",
            color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
            borderColor: "border-cyan-500/20",
            available: true,
        },
        {
            id: "countries",
            title: t("admin.countries", "Pays"),
            description: t(
                "admin.countriesDesc",
                "Gérer les pays et leurs représentants"
            ),
            icon: Globe,
            route: "/admin/countries",
            color: "bg-green-500/10 text-green-600 dark:text-green-400",
            borderColor: "border-green-500/20",
            available: isGlobalAdmin,
        },
        {
            id: "news",
            title: t("admin.news", "Actualités"),
            description: t(
                "admin.newsDesc",
                "Gérer les articles et actualités"
            ),
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
            description: t(
                "admin.documentsDesc",
                "Gérer la bibliothèque documentaire"
            ),
            icon: FileText,
            route: "/admin/documents",
            color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
            borderColor: "border-orange-500/20",
            available: true,
        },
        {
            id: "events",
            title: t("admin.events", "Événements"),
            description: t(
                "admin.eventsDesc",
                "Gérer le calendrier des événements"
            ),
            icon: Calendar,
            route: "/admin/events",
            color: "bg-red-500/10 text-red-600 dark:text-red-400",
            borderColor: "border-red-500/20",
            available: true,
        },
        {
            id: "forum",
            title: t("admin.forum", "Forum"),
            description: t(
                "admin.forumDesc",
                "Gérer les catégories et contenu du forum"
            ),
            icon: MessageSquare,
            route: "/admin/forum",
            color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
            borderColor: "border-indigo-500/20",
            available: isGlobalAdmin,
        },
        {
            id: "newsletters",
            title: t("admin.newsletters", "Bulletins"),
            description: t(
                "admin.newslettersDesc",
                "Créer et gérer les newsletters"
            ),
            icon: Newspaper,
            route: "/admin/newsletters",
            color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
            borderColor: "border-pink-500/20",
            available: isGlobalAdmin,
        },
        {
            id: "settings",
            title: t("admin.settings", "Paramètres"),
            description: t(
                "admin.settingsDesc",
                "Configuration de la plateforme"
            ),
            icon: Settings,
            route: "/admin/settings",
            color: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
            borderColor: "border-slate-500/20",
            available: isGlobalAdmin,
        },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards - Main Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-medium">
                            {t("admin.totalUsers", "Total Utilisateurs")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <CardTitle className="text-3xl font-bold text-blue-600">
                                    {users?.length ?? 0}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t(
                                        "admin.activeAccounts",
                                        "Comptes actifs"
                                    )}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-medium">
                            {t(
                                "admin.pendingInvitations",
                                "Invitations en attente"
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <CardTitle
                                    className={`text-3xl font-bold ${pendingInvitations > 0 ? "text-yellow-600" : "text-green-600"}`}
                                >
                                    {pendingInvitations}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t("admin.toProcess", "À traiter")}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-cyan-500/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-medium">
                            {t("admin.activeProjects", "Projets Actifs")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <CardTitle className="text-3xl font-bold text-purple-600">
                                    {activeProjects}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t("admin.inProgress", "En cours")}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-500/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-medium">
                            {t("admin.publishedContent", "Contenu")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <CardTitle className="text-3xl font-bold text-amber-600">
                                    {invitations?.length ?? 0}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t("admin.total", "Total")}
                                </p>
                            </div>
                            <Eye className="h-8 w-8 text-amber-500/20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Users */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            {t("admin.recentUsers", "Utilisateurs Récents")}
                        </CardTitle>
                        <CardDescription>
                            {t("admin.lastUsers", "5 derniers")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {users && users.length > 0 ? (
                                users
                                    .slice(0, 5)
                                    .map((user: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between text-sm border-b pb-2 last:border-0"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {user.full_name ||
                                                        user.email ||
                                                        "N/A"}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    {t("admin.noData", "Aucune donnée")}
                                </p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => navigate("/admin/users")}
                        >
                            {t("common.viewAll", "Voir tous")}{" "}
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Pending Invitations */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            {pendingInvitations > 0 ? (
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                            ) : (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            {t("admin.pendingInvitations", "Invitations")}
                        </CardTitle>
                        <CardDescription>
                            {pendingInvitations > 0
                                ? t("admin.actionRequired", "Action requise")
                                : t("admin.allResolved", "Tout à jour")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {invitations && invitations.length > 0 ? (
                                invitations
                                    .filter(
                                        (inv: any) => inv.status === "pending"
                                    )
                                    .slice(0, 5)
                                    .map((inv: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between text-sm border-b pb-2 last:border-0"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {inv.email}
                                                </p>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs mt-1 capitalize"
                                                >
                                                    {inv.role || "N/A"}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    {t(
                                        "admin.noInvitations",
                                        "Aucune invitation"
                                    )}
                                </p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => navigate("/admin/invitations")}
                        >
                            {t("common.manage", "Gérer")}{" "}
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Active Projects */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            {t("admin.activeProjects", "Projets Actifs")}
                        </CardTitle>
                        <CardDescription>
                            {t("admin.currentProjects", "En cours")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {projects && projects.length > 0 ? (
                                projects
                                    .filter(
                                        (p: any) => p.status === "in_progress"
                                    )
                                    .slice(0, 5)
                                    .map((project: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between text-sm border-b pb-2 last:border-0"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {project.title || "N/A"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {project.region || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    {t("admin.noProjects", "Aucun projet")}
                                </p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => navigate("/admin/projects")}
                        >
                            {t("common.viewAll", "Voir tous")}{" "}
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>
                        {t("admin.quickAccess", "Accès rapide")}
                    </CardTitle>
                    <CardDescription>
                        {t(
                            "admin.navigate",
                            "Naviguez vers les sections de gestion"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {quickLinks.map((link: any) => {
                            const Icon = link.icon
                            return (
                                <Button
                                    key={link.path}
                                    variant="outline"
                                    className="h-auto flex flex-col items-center justify-center py-4 gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
                                    onClick={() => navigate(link.path)}
                                >
                                    <Icon className={`h-5 w-5 ${link.color}`} />
                                    <span className="text-xs text-center font-medium leading-tight">
                                        {link.label}
                                    </span>
                                </Button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
