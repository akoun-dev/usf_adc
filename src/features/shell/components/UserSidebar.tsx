import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
    LayoutDashboard,
    FolderOpen,
    ListChecks,
    FileText,
    CheckSquare,
    BarChart3,
    GraduationCap,
    User,
    Calendar,
    CalendarClock,
    Bell,
    AlertTriangle,
    Users,
    MessageSquare,
    LifeBuoy,
    Clock,
    Download,
    Settings,
    Globe,
    BookOpen,
    FileEdit,
    Contact,
    MapPin,
} from "lucide-react"
import { Link } from "react-router-dom"

interface UserSidebarProps {
    role: "point_focal" | "country_admin"
    onNavigate?: () => void
}

interface NavItem {
    labelKey: string
    path: string
    icon: React.ElementType
}

const navItems: Record<string, NavItem[]> = {
    point_focal: [
        { labelKey: "nav.home", path: "/point-focal", icon: LayoutDashboard },
        { labelKey: "nav.myProjects", path: "/point-focal/projects", icon: FolderOpen },
        { labelKey: "nav.map", path: "/point-focal/map", icon: MapPin },
        { labelKey: "nav.myTasks", path: "/point-focal/tasks", icon: ListChecks },
        { labelKey: "nav.fsuDataEntry", path: "/point-focal/fsu", icon: FileText },
        { labelKey: "nav.validation", path: "/point-focal/validation", icon: CheckSquare },
        { labelKey: "nav.reports", path: "/point-focal/reports", icon: BarChart3 },
        { labelKey: "nav.calendar", path: "/point-focal/calendar", icon: Calendar },
        { labelKey: "nav.forum", path: "/point-focal/forum", icon: MessageSquare },
        { labelKey: "nav.cmdt25", path: "/point-focal/cmdt25", icon: FileEdit },
        { labelKey: "nav.directory", path: "/point-focal/directory", icon: Contact },
        { labelKey: "nav.training", path: "/point-focal/training", icon: GraduationCap },
        { labelKey: "nav.strategicWatch", path: "/point-focal/feeds", icon: Globe },
        { labelKey: "nav.docLibrary", path: "/point-focal/documents", icon: BookOpen },
        { labelKey: "nav.myAccount", path: "/point-focal/account", icon: User },
    ],
    country_admin: [
        { labelKey: "nav.overview", path: "/country-admin", icon: LayoutDashboard },
        { labelKey: "nav.alerts", path: "/country-admin/alerts", icon: AlertTriangle },
        { labelKey: "nav.allProjects", path: "/country-admin/projects", icon: FolderOpen },
        { labelKey: "nav.map", path: "/country-admin/map", icon: MapPin },
        { labelKey: "nav.validateProjects", path: "/country-admin/projects/pending", icon: CheckSquare },
        { labelKey: "nav.pendingEntries", path: "/country-admin/fsu/pending", icon: Clock },
        { labelKey: "nav.users", path: "/country-admin/users", icon: Users },
        { labelKey: "nav.reports", path: "/country-admin/reports", icon: BarChart3 },
        { labelKey: "nav.calendar", path: "/country-admin/calendar", icon: Calendar },
        { labelKey: "nav.forum", path: "/country-admin/forum/moderation", icon: MessageSquare },
        { labelKey: "nav.support", path: "/country-admin/support", icon: LifeBuoy },
        { labelKey: "nav.settings", path: "/country-admin/settings", icon: Settings },
        { labelKey: "nav.adminProfile", path: "/country-admin/profile", icon: User },
    ],
}

export function UserSidebar({ role, onNavigate }: UserSidebarProps) {
    const { t } = useTranslation()
    const location = useLocation()

    const items = navItems[role] || []

    return (
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
            <div className="space-y-0.5">
                {items.map(item => {
                    const isActive =
                        location.pathname === item.path ||
                        (item.path !== "/forum/groups" &&
                            item.path !== "/notifications" &&
                            location.pathname.startsWith(item.path) &&
                            item.path !== "/")
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-white/15 text-sidebar-foreground"
                                    : "text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground"
                            }`}
                        >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                                {t(item.labelKey)}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
