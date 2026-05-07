import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useUnreadCount } from "@/features/notifications"
import { Separator } from "@/components/ui/separator"
import { Menu, X, Settings, Newspaper, FileText, Calendar, MessageSquare, Globe, LayoutDashboard, FolderOpen, CheckSquare, GraduationCap, User, Shield, Users, AlertTriangle, Clock, BarChart3, Download, Key, LifeBuoy, BookOpen, FileBarChart, Bell, Flag, PenLine, Users2, Mail } from "lucide-react"
import atuLogo from "@/assets/atu-uat-logo.png"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageToggle } from "@/components/LanguageToggle"
import { LanguageSwitcher } from "@/features/shell/components/LanguageSwitcher"
import { UserMenu } from "@/features/shell/components/UserMenu"
import { AdminSidebar } from "@/features/shell/components/AdminSidebar"
import { UserSidebar } from "@/features/shell/components/UserSidebar"
import { useTranslation } from "react-i18next"
import { MailIcon } from "@/features/messaging/components/MailIcon"

export default function AppLayout() {
    const { user, profile, signOut, highestRole, isLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { data: unreadCount = 0 } = useUnreadCount()
    const { t } = useTranslation()

    const role = highestRole()
    const roleLabel = role ? t(`roles.${role}`) : ""

    // Management of the scroll on the html/body tag
    useEffect(() => {
        document.documentElement.classList.add('no-scroll-root')
        document.body.classList.add('no-scroll-root')

        return () => {
            document.documentElement.classList.remove('no-scroll-root')
            document.body.classList.remove('no-scroll-root')
        }
    }, [])

    // Extract current page information from route
    const getPageInfo = () => {
        const pathname = location.pathname
        
        // Admin routes
        if (pathname.startsWith('/admin')) {
            const pathParts = pathname.split('/')
            const currentPath = pathParts[2] || 'admin' // Get the part after '/admin'
            
            const pageConfig: Record<string, { 
                title: string; 
                description: string; 
                icon: React.ReactNode; 
            }> = {
                'admin': { 
                    title: t('admin.title', 'Administration'), 
                    description: t('admin.descAdmin', 'Gérez le contenu et les paramètres de la plateforme'),
                    icon: <Settings className="h-4 w-4" /> 
                },
                'news': { 
                    title: t('admin.newsTitle', 'Actualités'), 
                    description: t('admin.newsDesc', 'Gestion des actualités et annonces'),
                    icon: <Newspaper className="h-4 w-4" /> 
                },
                'projects': { 
                    title: t('admin.projectsTitle', 'Projets'), 
                    description: t('admin.projectsDesc', 'Gestion des projets et initiatives'),
                    icon: <FileText className="h-4 w-4" /> 
                },
                'documents': { 
                    title: t('admin.documentsTitle', 'Documents'), 
                    description: t('admin.documentsDesc', 'Gestion des documents et ressources'),
                    icon: <FileText className="h-4 w-4" /> 
                },
                'events': { 
                    title: t('admin.eventsTitle', 'Événements'), 
                    description: t('admin.eventsDesc', 'Gestion des événements et calendriers'),
                    icon: <Calendar className="h-4 w-4" /> 
                },
                'forum': { 
                    title: t('admin.forumTitle', 'Forum'), 
                    description: t('admin.forumDesc', 'Gestion des discussions et forums'),
                    icon: <MessageSquare className="h-4 w-4" /> 
                },
                'settings': { 
                    title: t('admin.settings', 'Paramètres'), 
                    description: t('admin.descAdmin', 'Gérez le contenu et les paramètres de la plateforme'),
                    icon: <Settings className="h-4 w-4" /> 
                },
                'countries': { 
                    title: t('admin.countries', 'Pays'), 
                    description: t('admin.descAdmin', 'Gestion des pays et régions'),
                    icon: <Globe className="h-4 w-4" /> 
                },
                'co-redaction': { 
                    title: t('nav.coRedaction', 'Co-Rédaction'), 
                    description: t('admin.coRedactionDesc', 'Édition collaborative de documents'),
                    icon: <PenLine className="h-4 w-4" /> 
                },
                'membres-associes': { 
                    title: t('nav.members', 'Membres Associés'), 
                    description: t('admin.membersDesc', 'Gestion des membres associés'),
                    icon: <Users className="h-4 w-4" /> 
                },
                'news': { 
                    title: t('nav.news', 'Actualités'), 
                    description: t('admin.newsDesc', 'Gestion des actualités et articles'),
                    icon: <Newspaper className="h-4 w-4" /> 
                },
                'users': { 
                    title: t('nav.users', 'Utilisateurs'), 
                    description: t('admin.usersDesc', 'Gestion des utilisateurs de la plateforme'),
                    icon: <Users className="h-4 w-4" /> 
                },
                'invitations': { 
                    title: t('nav.invitations', 'Invitations'), 
                    description: t('admin.invitationsDesc', 'Gérer les invitations en attente'),
                    icon: <Users2 className="h-4 w-4" /> 
                },
                'messaging': { 
                    title: t('nav.messaging', 'Messagerie'), 
                    description: t('admin.messagingDesc', 'Communication interne'),
                    icon: <Mail className="h-4 w-4" /> 
                },
                'newsletters': { 
                    title: t('nav.newslettersAdmin', 'Newsletters'), 
                    description: t('admin.newslettersDesc', 'Gestion des campagnes newsletters'),
                    icon: <Newspaper className="h-4 w-4" /> 
                },
                'elearning': { 
                    title: t('nav.elearning', 'E-Learning'), 
                    description: t('admin.eventsManagementDesc', 'Gestion des formations'),
                    icon: <GraduationCap className="h-4 w-4" /> 
                }
            }
            
            return pageConfig[currentPath] || pageConfig['admin']
        }
        
        // Point Focal routes
            if (pathname.startsWith('/point-focal')) {
                const pathParts = pathname.split('/').filter(Boolean)
                const currentPath = pathParts.slice(1).join('/') || 'dashboard'

                const pageConfig: Record<string, {
                    title: string;
                    description: string;
                    icon: React.ReactNode;
                }> = {
                    'dashboard': {
                        title: t('nav.home', 'Accueil'),
                        description: t('pointfocal.desc', 'Tableau de bord du Point Focal'),
                        icon: <LayoutDashboard className="h-4 w-4" />
                    },
                    'projects': {
                        title: t('nav.myProjects', 'Mes Projets'),
                        description: t('pointfocal.projectsDesc', 'Gérez vos projets'),
                        icon: <FolderOpen className="h-4 w-4" />
                    },
                    'projects/new': {
                        title: t('nav.newProject', 'Nouveau Projet'),
                        description: t('pointfocal.newProjectDesc', 'Créer un nouveau projet'),
                        icon: <FolderOpen className="h-4 w-4" />
                    },
                    'tasks': {
                        title: t('nav.myTasks', 'Mes Tâches'),
                        description: t('pointfocal.tasksDesc', 'Vos tâches en cours'),
                        icon: <CheckSquare className="h-4 w-4" />
                    },
                    'fsu': {
                        title: t('nav.fsuDataEntry', 'Saisie des Données FSU'),
                        description: t('pointfocal.fsuDesc', 'Saisie et suivi des données FSU'),
                        icon: <FileText className="h-4 w-4" />
                    },
                    'fsu/new': {
                        title: t('pointfocal.newFsu', 'Nouvelle Saisie FSU'),
                        description: t('pointfocal.newFsuDesc', 'Créer une nouvelle saisie FSU'),
                        icon: <FileText className="h-4 w-4" />
                    },
                    'validation': {
                        title: t('nav.validation', 'Validation et Soumission'),
                        description: t('pointfocal.validationDesc', 'Validation des données'),
                        icon: <CheckSquare className="h-4 w-4" />
                    },
                    'training': {
                        title: t('nav.training', 'Formation et Ressources'),
                        description: t('pointfocal.trainingDesc', 'Webinaires et e-learning'),
                        icon: <GraduationCap className="h-4 w-4" />
                    },
                    'account': {
                        title: t('nav.myAccount', 'Mon Compte'),
                        description: t('pointfocal.accountDesc', 'Gérez votre compte'),
                        icon: <User className="h-4 w-4" />
                    },
                    'profile': {
                        title: t('nav.profile', 'Mon Profil'),
                        description: t('pointfocal.profileDesc', 'Informations personnelles'),
                        icon: <User className="h-4 w-4" />
                    },
                    'profile/preferences': {
                        title: t('nav.preferences', 'Préférences'),
                        description: t('pointfocal.preferencesDesc', 'Gérez vos préférences'),
                        icon: <Settings className="h-4 w-4" />
                    },
                    'profile/security': {
                        title: t('nav.security', 'Sécurité'),
                        description: t('pointfocal.securityDesc', 'Sécurité du compte'),
                        icon: <Shield className="h-4 w-4" />
                    },
                    'forum': {
                        title: t('nav.forum', 'Forum'),
                        description: t('pointfocal.forumDesc', 'Discussions et échanges'),
                        icon: <MessageSquare className="h-4 w-4" />
                    },
                    'reports': {
                        title: t('reports.title', 'Rapports & KPIs'),
                        description: t('reports.desc', 'Tableaux de bord en temps réel'),
                        icon: <FileText className="h-4 w-4" />
                    },
                }

                return pageConfig[currentPath] || pageConfig['dashboard']
            }

            // Country Admin routes
            if (pathname.startsWith('/country-admin')) {
                const pathParts = pathname.split('/').filter(Boolean)
                const currentPath = pathParts.slice(1).join('/') || 'dashboard'

                const pageConfig: Record<string, {
                    title: string;
                    description: string;
                    icon: React.ReactNode;
                }> = {
                    'dashboard': {
                        title: t('nav.overview', 'Vue d\'Ensemble'),
                        description: t('countryAdmin.overviewDesc', 'Statistiques globales'),
                        icon: <LayoutDashboard className="h-4 w-4" />
                    },
                    'alerts': {
                        title: t('nav.alerts', 'Alertes'),
                        description: t('countryAdmin.alertsDesc', 'Notifications et alertes'),
                        icon: <AlertTriangle className="h-4 w-4" />
                    },
                    'projects': {
                        title: t('nav.allProjects', 'Tous les Projets'),
                        description: t('countryAdmin.projectsDesc', 'Projets du pays'),
                        icon: <FolderOpen className="h-4 w-4" />
                    },
                    'projects/pending': {
                        title: t('nav.validateProjects', 'Valider les Projets'),
                        description: t('countryAdmin.validateProjectsDesc', 'Projets en attente'),
                        icon: <CheckSquare className="h-4 w-4" />
                    },
                    'projects/reports': {
                        title: t('nav.projectReports', 'Rapports de Projets'),
                        description: t('countryAdmin.projectReportsDesc', 'KPIs et avancement'),
                        icon: <FileBarChart className="h-4 w-4" />
                    },
                    'fsu/pending': {
                        title: t('nav.pendingEntries', 'Saisies en Attente'),
                        description: t('countryAdmin.pendingEntriesDesc', 'FSU à valider'),
                        icon: <Clock className="h-4 w-4" />
                    },
                    'fsu/history': {
                        title: t('nav.fsuHistory', 'Historique des Saisies'),
                        description: t('countryAdmin.fsuHistoryDesc', 'Filtres et historique'),
                        icon: <FileText className="h-4 w-4" />
                    },
                    'fsu/export': {
                        title: t('nav.exportData', 'Exporter les Données'),
                        description: t('countryAdmin.exportDesc', 'Excel/PDF'),
                        icon: <Download className="h-4 w-4" />
                    },
                    'users': {
                        title: t('nav.usersList', 'Liste des Utilisateurs'),
                        description: t('countryAdmin.usersDesc', 'Équipe nationale'),
                        icon: <Users className="h-4 w-4" />
                    },
                    'users/invite': {
                        title: t('nav.inviteUser', 'Inviter un Utilisateur'),
                        description: t('countryAdmin.inviteUserDesc', 'Nouveaux Point Focaux'),
                        icon: <User className="h-4 w-4" />
                    },
                    'users/roles': {
                        title: t('nav.roles', 'Rôles et Permissions'),
                        description: t('countryAdmin.rolesDesc', 'Gérer les rôles'),
                        icon: <Key className="h-4 w-4" />
                    },
                    'users/activity': {
                        title: t('nav.activity', 'Activité des Utilisateurs'),
                        description: t('countryAdmin.activityDesc', 'Journal des connexions'),
                        icon: <Clock className="h-4 w-4" />
                    },
                    'reports': {
                        title: t('nav.reports', 'Rapports'),
                        description: t('countryAdmin.reportsDesc', 'Rapports et pilotage'),
                        icon: <BarChart3 className="h-4 w-4" />
                    },
                    'reports/generator': {
                        title: t('nav.reportGenerator', 'Générateur de Rapports'),
                        description: t('countryAdmin.reportGeneratorDesc', 'Rapports personnalisés'),
                        icon: <BarChart3 className="h-4 w-4" />
                    },
                    'reports/kpis': {
                        title: t('nav.kpis', 'KPIs et Indicateurs'),
                        description: t('countryAdmin.kpisDesc', 'Indicateurs clés'),
                        icon: <Flag className="h-4 w-4" />
                    },
                    'reports/uat': {
                        title: t('nav.reportingUat', 'Reporting UAT/ANSUT'),
                        description: t('countryAdmin.reportingUatDesc', 'Rapports standardisés'),
                        icon: <Globe className="h-4 w-4" />
                    },
                    'settings': {
                        title: t('nav.countrySettings', 'Paramètres du Pays'),
                        description: t('countryAdmin.settingsDesc', 'Configuration'),
                        icon: <Settings className="h-4 w-4" />
                    },
                    'forum/moderation': {
                        title: t('nav.moderation', 'Modération'),
                        description: t('countryAdmin.moderationDesc', 'Sujets signalés'),
                        icon: <MessageSquare className="h-4 w-4" />
                    },
                    'forum/stats': {
                        title: t('nav.forumStats', 'Statistiques du Forum'),
                        description: t('countryAdmin.forumStatsDesc', 'Activité du forum'),
                        icon: <BarChart3 className="h-4 w-4" />
                    },
                    'support': {
                        title: t('nav.supportTickets', 'Tickets de Support'),
                        description: t('countryAdmin.supportDesc', 'Support et assistance'),
                        icon: <LifeBuoy className="h-4 w-4" />
                    },
                    'faq': {
                        title: t('nav.faq', 'FAQ et Ressources'),
                        description: t('countryAdmin.faqDesc', 'Base de connaissances'),
                        icon: <BookOpen className="h-4 w-4" />
                    },
                    'profile': {
                        title: t('nav.adminProfile', 'Profil Administrateur'),
                        description: t('countryAdmin.profileDesc', 'Informations personnelles'),
                        icon: <User className="h-4 w-4" />
                    },
                    'audit': {
                        title: t('nav.auditLog', 'Journal d\'Audit'),
                        description: t('countryAdmin.auditDesc', 'Historique des actions'),
                        icon: <Shield className="h-4 w-4" />
                    },
                }

                return pageConfig[currentPath] || pageConfig['dashboard']
            }

            // Default for other routes
            return {
                title: '',
                description: '',
                icon: null
            }
        }

    const { title: pageTitle, description: pageDescription, icon: pageIcon } = getPageInfo()

    // Show loading skeleton while roles are being fetched
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <span className="text-sm text-muted-foreground">
                        Chargement...
                    </span>
                </div>
            </div>
        )
    }

    const handleSignOut = async () => {
        await signOut()
        navigate("/login", { replace: true })
    }

    // Render appropriate sidebar based on role
    const renderSidebar = () => {
        switch (role) {
            case "super_admin":
                return <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
            case "country_admin":
                return (
                    <UserSidebar
                        role="country_admin"
                        onNavigate={() => setSidebarOpen(false)}
                    />
                )
            case "point_focal":
                return (
                    <UserSidebar
                        role="point_focal"
                        onNavigate={() => setSidebarOpen(false)}
                    />
                )
            case "participant":
            case "contributor":
            case "editor":
                return (
                    <UserSidebar
                        role="participant"
                        onNavigate={() => setSidebarOpen(false)}
                    />
                )
            default:
                return (
                    <UserSidebar
                        role="country_admin"
                        onNavigate={() => setSidebarOpen(false)}
                    />
                )
        }
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col gradient-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex h-16 items-center gap-2 px-4">
                    <img
                        src={atuLogo}
                        alt="ATU/UAT"
                        className="h-9 w-9 rounded-md"
                    />
                    <span className="text-lg font-bold text-sidebar-foreground">
                        USF-ADC
                    </span>
                    <button
                        className="ml-auto lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <Separator className="bg-sidebar-border" />

                {renderSidebar()}

                <div className="mt-auto border-t border-sidebar-border">
                    <LanguageSwitcher />

                    <UserMenu
                        profile={profile}
                        email={user?.email}
                        roleLabel={roleLabel}
                        onSignOut={handleSignOut}
                    />
                </div>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-14 items-center gap-3 border-b bg-background px-4 lg:px-6">
                    <button
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    {pageTitle && (
                        <div className="flex flex-1 items-center gap-3">
                            {pageIcon && (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    {pageIcon}
                                </div>
                            )}
                            <div>
                                <h1 className="text-sm font-semibold md:text-base">
                                    {pageTitle}
                                </h1>
                                {pageDescription && (
                                    <p className="text-xs text-muted-foreground">
                                        {pageDescription}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-1 items-center justify-end gap-2">
                        <MailIcon />
                        <LanguageToggle />
                        <ThemeToggle />
                        <span className="hidden text-xs text-muted-foreground sm:block">
                            {roleLabel}
                        </span>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-0 w-full">
                    <div className="w-full animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
