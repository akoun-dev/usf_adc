import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
    LayoutDashboard,
    Users,
    Users2,
    Globe,
    Newspaper,
    Map,
    Settings,
    MessageSquare,
    Calendar,
    FileText as DocIcon,
} from "lucide-react"
import { Link } from "react-router-dom"

interface AdminSidebarProps {
    onNavigate?: () => void
}

const adminItems = [
    { labelKey: "nav.adminDashboard", path: "/admin", icon: LayoutDashboard },
    { labelKey: "nav.users", path: "/admin/users", icon: Users },
    { labelKey: "nav.invitations", path: "/admin/invitations", icon: Users2 },
    { labelKey: "nav.countries", path: "/admin/countries", icon: Globe },
    { labelKey: "nav.news", path: "/admin/news", icon: Newspaper },
    { labelKey: "nav.projects", path: "/admin/projects", icon: Map },
    { labelKey: "nav.adminDocuments", path: "/admin/documents", icon: DocIcon },
    { labelKey: "nav.events", path: "/admin/events", icon: Calendar },
    { labelKey: "nav.forumCategories", path: "/admin/forum", icon: MessageSquare },
    { labelKey: "nav.newslettersAdmin", path: "/admin/newsletters", icon: Newspaper },
    { labelKey: "nav.settings", path: "/admin/settings", icon: Settings },
]

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
    const { t } = useTranslation()
    const location = useLocation()

    return (
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
            <div className="mb-3">
                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                    {t("nav.sectionAdmin")}
                </p>
                <div className="space-y-0.5">
                    {adminItems.map(item => {
                        const isActive =
                            location.pathname === item.path ||
                            (item.path !== "/admin" &&
                                location.pathname.startsWith(item.path))
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
            </div>
        </nav>
    )
}
