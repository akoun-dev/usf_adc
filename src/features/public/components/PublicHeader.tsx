import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, ArrowRight, ChevronDown, LogOut, User } from "lucide-react"
import { useState, useMemo } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/features/shell/components/LanguageSwitcher"
import atuLogo from "@/assets/atu-uat-logo.png"
import atuLogoWhite from "@/assets/atuuat-logo-blc.png"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavGroup {
    label?: string
    labelKey: string
    href?: string
    items?: NavItem[]
}

interface NavItem {
    href: string
    labelKey: string
}

interface PublicHeaderProps {
    variant?: "default" | "transparent"
}

export function PublicHeader({ variant = "default" }: PublicHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const { isAuthenticated, signOut, user } = useAuth()

    const isTransparent = variant === "transparent"

    const navGroups: NavGroup[] = useMemo(
        () => [
            {
                labelKey: "home",
                href: "/",
            },
            {
                labelKey: "usfAdc",
                items: [
                    { href: "/annuaire-pays-membres", labelKey: "memberStates" },
                    { href: "/membres-associes", labelKey: "associatedMembers" },
                ],
            },
            {
                labelKey: "projects",
                items: [
                    { href: "/carte-public", labelKey: "map" },
                    { href: "/projets", labelKey: "calls" },
                    { href: "/calendrier", labelKey: "calendar" },
                ],
            },
            {
                labelKey: "resources",
                items: [
                    { href: "/strategies-politiques", labelKey: "strategies" },
                    { href: "/documents-publics", labelKey: "documents" },
                    { href: "/forum-public", labelKey: "forum" },
                ],
            },
            {
                labelKey: "coRedaction",
                href: "/co-redaction",
            },
            {
                labelKey: "news",
                href: "/actualites",
            },
            {
                labelKey: "about",
                items: [
                    { href: "/notre-histoire", labelKey: "ourHistory" },
                    { href: "/equipe-direction", labelKey: "leadership" },
                    { href: "/faq-public", labelKey: "faq" },
                ],
            },
            {
                labelKey: "sutel",
                href: "/sutel",
            },
        ],
        []
    )

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isTransparent ? "border-transparent bg-transparent" : ""}`}
        >
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 lg:px-12 bg-primary backdrop-blur-xl border-b border-primary/80 shadow-lg dark:bg-background/95 dark:border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={atuLogoWhite}
                            alt="ATU/UAT"
                            className="h-12 w-12 sm:h-10 sm:w-10 rounded-xl p-1"
                        />
                        <span className="text-base sm:text-lg font-bold text-white">
                            USF-ADCA
                        </span>
                        <span className="hidden text-xs text-white/70 sm:block">
                            ATU / UAT
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex items-center gap-1">
                        {navGroups.map((group, index) => {
                            // Simple link without dropdown (e.g., Sutel)
                            if (group.href) {
                                return (
                                    <Link
                                        key={group.href}
                                        to={group.href}
                                        className="px-4 py-2 text-sm font-medium text-white/90 dark:text-white/80 hover:text-white hover:bg-white/15 hover:bg-accent/5 rounded-md transition-colors"
                                    >
                                        {t(`index.nav.group.${group.labelKey}`).toUpperCase()}
                                    </Link>
                                )
                            }

                            // Group with items (dropdown menu)
                            return (
                                <DropdownMenu key={`group-${index}`}>
                                    <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium text-white/90 dark:text-white/80 hover:text-white hover:bg-white/15 hover:bg-accent/5 rounded-md transition-colors flex items-center gap-1">
                                        {t(`index.nav.group.${group.labelKey}`).toUpperCase()}
                                        <ChevronDown className="h-3 w-3" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-popover/95 dark:bg-popover/100 border border-border/50 dark:border-border">
                                        {group.items?.map((item) => (
                                            <DropdownMenuItem asChild key={item.href}>
                                                <Link
                                                    to={item.href}
                                                    className="cursor-pointer"
                                                >
                                                    {t(`public.nav.${item.labelKey}`).toUpperCase()}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        })}
                    </div>

                    {/* Actions - hide on mobile */}
                    <div className="hidden xl:flex items-center gap-2">
                        <ThemeToggle variant="ghost-white" />
                        <LanguageSwitcher />
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon"
                                        className="bg-white text-primary hover:bg-white/90 backdrop-blur-sm border border-white/30 shadow-sm font-semibold"
                                    >
                                        <User className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link
                                            to="/dashboard"
                                            className="cursor-pointer"
                                        >
                                            {t("public.header.dashboard")}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            to="/profil"
                                            className="cursor-pointer"
                                        >
                                            {t("public.header.profile")}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={async () => {
                                            await signOut()
                                            navigate("/")
                                        }}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        {t("public.header.logout")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                asChild
                                size="sm"
                                className="bg-white text-primary hover:bg-white/90 backdrop-blur-sm border border-white/30 shadow-sm font-semibold"
                            >
                                <Link to="/login">{t("public.nav.login")}</Link>
                            </Button>
                        )}
                    </div>

                    {/* Mobile menu button - only on mobile/tablet */}
                    <div className="flex xl:hidden items-center gap-2">
                        <ThemeToggle variant="ghost-white" />
                        <LanguageSwitcher />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/15"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation - full screen dropdown */}
                {mobileMenuOpen && (
                    <div className="xl:hidden mt-4 bg-primary/95 dark:bg-background/95 backdrop-blur-md rounded-xl border border-white/20 dark:border-border overflow-hidden shadow-xl">
                        <nav className="p-2">
                            <div className="grid gap-1 max-h-[70vh] overflow-y-auto">
                                {navGroups.map((group, index) => {
                                    // Simple link without dropdown (e.g., Sutel)
                                    if (group.href) {
                                        return (
                                            <Link
                                                key={group.href}
                                                to={group.href}
                                                onClick={() => {
                                                    setMobileMenuOpen(false)
                                                    setOpenDropdown(null)
                                                }}
                                                className="px-4 py-3 text-sm font-medium text-white dark:text-foreground hover:bg-white/15 hover:bg-accent/5 rounded-lg transition-colors"
                                            >
                                                {t(`index.nav.group.${group.labelKey}`).toUpperCase()}
                                            </Link>
                                        )
                                    }

                                    // Group with items (expandable dropdown)
                                    const groupKey = `group-${index}`
                                    return (
                                        <div key={groupKey} className="space-y-1">
                                            <button
                                                onClick={() =>
                                                    setOpenDropdown(
                                                        openDropdown === groupKey
                                                            ? null
                                                            : groupKey
                                                    )
                                                }
                                                className="w-full px-4 py-3 text-sm font-medium text-white dark:text-foreground hover:bg-white/15 hover:bg-accent/5 rounded-lg transition-colors text-left flex items-center justify-between"
                                            >
                                                {t(`index.nav.group.${group.labelKey}`).toUpperCase()}
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${
                                                        openDropdown === groupKey
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                            <div
                                                className={`${
                                                    openDropdown === groupKey
                                                        ? "block"
                                                        : "hidden"
                                                } ml-4 space-y-1`}
                                            >
                                                {group.items?.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        to={item.href}
                                                        onClick={() => {
                                                            setMobileMenuOpen(
                                                                false
                                                            )
                                                            setOpenDropdown(
                                                                null
                                                            )
                                                        }}
                                                        className="block px-4 py-2 text-sm font-medium text-white dark:text-foreground hover:bg-white/15 hover:bg-accent/5 rounded-lg transition-colors"
                                                    >
                                                        {t(
                                                            `public.nav.${item.labelKey}`
                                                        ).toUpperCase()}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="border-t border-white/20 dark:border-border my-2 pt-2">
                                    {isAuthenticated && user ? (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="px-4 py-3 text-sm font-medium text-white dark:text-foreground hover:bg-white/15 hover:bg-accent/5 rounded-lg transition-colors flex items-center gap-2 mb-2"
                                            >
                                                <User className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    await signOut()
                                                    setMobileMenuOpen(false)
                                                    navigate("/")
                                                }}
                                                className="w-full px-4 py-3 text-sm font-medium text-white dark:text-foreground hover:bg-white/15 hover:bg-accent/5 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {t("public.header.logout")}
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="px-4 py-3 text-sm font-medium text-white dark:text-foreground hover:bg-white/15 hover:bg-accent/5 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            {t("public.nav.login")}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </nav>
                    </div>
                )}
            </nav>
        </header>
    )
}
