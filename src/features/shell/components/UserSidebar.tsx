import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
    LayoutDashboard,
    User,
    FileText,
    CheckSquare,
    BarChart3,
    Map,
    FolderOpen,
    MessageSquare,
    Users2,
    Rss,
    Bell,
    Settings,
    MessageCircle,
    Newspaper,
    GraduationCap,
    HelpCircle,
    BookOpen,
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
    section: string
}

const navItems: Record<string, NavItem[]> = {
    point_focal: [
        // Data
        {
            section: "nav.sectionData",
            labelKey: "nav.dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.profile",
            path: "/profile",
            icon: User,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.fsu",
            path: "/fsu/submissions",
            icon: FileText,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.reports",
            path: "/reports",
            icon: BarChart3,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.map",
            path: "/map",
            icon: Map,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.documents",
            path: "/documents",
            icon: FolderOpen,
        },
        // Communication
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.forum",
            path: "/forum",
            icon: MessageSquare,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.groups",
            path: "/forum/groups",
            icon: Users2,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.feeds",
            path: "/feeds",
            icon: Rss,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.notifications",
            path: "/notifications",
            icon: Bell,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.notificationsSettings",
            path: "/notifications/settings",
            icon: Settings,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.chat",
            path: "/chat",
            icon: MessageCircle,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.newsletters",
            path: "/newsletters",
            icon: Newspaper,
        },
        // Support
        {
            section: "nav.sectionSupport",
            labelKey: "nav.training",
            path: "/training",
            icon: GraduationCap,
        },
        {
            section: "nav.sectionSupport",
            labelKey: "nav.support",
            path: "/support",
            icon: HelpCircle,
        },
        {
            section: "nav.sectionSupport",
            labelKey: "nav.faq",
            path: "/faq",
            icon: BookOpen,
        },
    ],
    country_admin: [
        // Data
        {
            section: "nav.sectionData",
            labelKey: "nav.dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.profile",
            path: "/profile",
            icon: User,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.fsu",
            path: "/fsu/submissions",
            icon: FileText,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.validation",
            path: "/validation",
            icon: CheckSquare,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.reports",
            path: "/reports",
            icon: BarChart3,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.map",
            path: "/map",
            icon: Map,
        },
        {
            section: "nav.sectionData",
            labelKey: "nav.documents",
            path: "/documents",
            icon: FolderOpen,
        },
        // Communication
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.forum",
            path: "/forum",
            icon: MessageSquare,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.groups",
            path: "/forum/groups",
            icon: Users2,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.feeds",
            path: "/feeds",
            icon: Rss,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.notifications",
            path: "/notifications",
            icon: Bell,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.notificationsSettings",
            path: "/notifications/settings",
            icon: Settings,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.chat",
            path: "/chat",
            icon: MessageCircle,
        },
        {
            section: "nav.sectionCommunication",
            labelKey: "nav.newsletters",
            path: "/newsletters",
            icon: Newspaper,
        },
        // Support
        {
            section: "nav.sectionSupport",
            labelKey: "nav.training",
            path: "/training",
            icon: GraduationCap,
        },
        {
            section: "nav.sectionSupport",
            labelKey: "nav.support",
            path: "/support",
            icon: HelpCircle,
        },
        {
            section: "nav.sectionSupport",
            labelKey: "nav.faq",
            path: "/faq",
            icon: BookOpen,
        },
    ],
}

export function UserSidebar({ role, onNavigate }: UserSidebarProps) {
    const { t } = useTranslation()
    const location = useLocation()

    const items = navItems[role] || []

    // Group items by section
    const sections = Array.from(new Set(items.map(item => item.section))).map(
        section => ({
            titleKey: section,
            items: items.filter(item => item.section === section),
        })
    )

    return (
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
            {sections.map(section => (
                <div key={section.titleKey} className="mb-3">
                    <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                        {t(section.titleKey)}
                    </p>
                    <div className="space-y-0.5">
                        {section.items.map(item => {
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
                </div>
            ))}
        </nav>
    )
}
