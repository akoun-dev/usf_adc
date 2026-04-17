import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useUnreadCount } from "@/features/notifications"
import { ROLE_LABELS } from "@/core/constants/roles"
import { Separator } from "@/components/ui/separator"
import { Menu, X } from "lucide-react"
import atuLogo from "@/assets/atu-uat-logo.png"
import { useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/features/shell/components/LanguageSwitcher"
import { UserMenu } from "@/features/shell/components/UserMenu"
import { AdminSidebar } from "@/features/shell/components/AdminSidebar"
import { UserSidebar } from "@/features/shell/components/UserSidebar"

export default function AppLayout() {
    const { user, profile, signOut, highestRole, isLoading } = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { data: unreadCount = 0 } = useUnreadCount()

    const role = highestRole()
    const roleLabel = role ? ROLE_LABELS[role] : ""

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
            case "global_admin":
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
                <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
                    <button
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5 text-foreground" />
                    </button>
                    <div className="flex-1" />
                    <ThemeToggle />
                    <span className="hidden text-xs text-muted-foreground sm:block">
                        {roleLabel}
                    </span>
                </header>
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
