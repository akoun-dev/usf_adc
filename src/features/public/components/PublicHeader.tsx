import { Link, useLocation } from "react-router-dom"
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react"
import { useState } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/features/shell/components/LanguageSwitcher"
import atuLogo from "@/assets/atu-uat-logo.png"
import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
    { href: "/", labelKey: "public.nav.home" },
    { href: "/carte-public", labelKey: "public.nav.map" },
    { href: "/documents-publics", labelKey: "public.nav.documents" },
    { href: "/actualites", labelKey: "public.nav.news" },
    { href: "/forum-public", labelKey: "public.nav.forum" },
    { href: "/projets", labelKey: "public.nav.calls" },
    { href: "/calendrier", labelKey: "public.nav.calendar" },
    { href: "/sutel", labelKey: "public.nav.sutel" },
    { href: "/a-propos", labelKey: "public.nav.about" },
    { href: "/faq-public", labelKey: "public.nav.faq" },

]

interface PublicHeaderProps {
    variant?: "default" | "transparent"
}

export function PublicHeader({ variant = "default" }: PublicHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()
    const { t } = useTranslation()

    const isTransparent = variant === "transparent"

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isTransparent ? "border-transparent bg-transparent" : ""}`}
        >
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 sm:h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 sm:gap-3">
                        <img
                            src={atuLogo}
                            alt="ATU/UAT"
                            className="h-8 w-8 rounded-lg sm:h-10 sm:w-10"
                        />
                        <div className="flex flex-col">
                            <span className="text-base sm:text-lg font-bold">
                                USF-ADC
                            </span>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                                {isTransparent ? "text-white/70" : ""}ATU / UAT
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - show on md and above */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link, index) => {
                            // Insert Membership dropdown after Carte (index 1)
                            if (index === 1 && link.href === "/carte-public") {
                                return (
                                    <React.Fragment key={link.href}>
                                        <Link
                                            to={link.href}
                                            className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                                                location.pathname === link.href
                                                    ? "bg-primary text-primary-foreground"
                                                    : isTransparent
                                                      ? "text-white/80 hover:text-white hover:bg-white/10"
                                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            }`}
                                        >
                                            {t(link.labelKey)}
                                        </Link>

                                        {/* Membership Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                                                    isTransparent
                                                        ? "text-white/80 hover:text-white hover:bg-white/10"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                }`}
                                            >
                                                {t("public.nav.membership")}
                                                <ChevronDown className="h-3 w-3" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        to="/annuaire-pays-membres"
                                                        className={`cursor-pointer ${
                                                            location.pathname === "/annuaire-pays-membres"
                                                                ? "bg-accent"
                                                                : ""
                                                        }`}
                                                    >
                                                        {t("public.nav.memberStates")}
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        to="/membres-associes"
                                                        className={`cursor-pointer ${
                                                            location.pathname === "/membres-associes"
                                                                ? "bg-accent"
                                                                : ""
                                                        }`}
                                                    >
                                                        {t("public.nav.associatedMembers")}
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </React.Fragment>
                                )
                            }

                            // Convert About link to dropdown
                            if (link.href === "/a-propos") {
                                return (
                                    <DropdownMenu key={link.href}>
                                        <DropdownMenuTrigger
                                            className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                                                location.pathname === link.href || location.pathname.startsWith("/notre-histoire") || location.pathname.startsWith("/equipe-direction")
                                                    ? "bg-primary text-primary-foreground"
                                                    : isTransparent
                                                        ? "text-white/80 hover:text-white hover:bg-white/10"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            }`}
                                        >
                                            {t("public.nav.about")}
                                            <ChevronDown className="h-3 w-3" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    to="/notre-histoire"
                                                    className={`cursor-pointer ${
                                                        location.pathname === "/notre-histoire"
                                                            ? "bg-accent"
                                                            : ""
                                                    }`}
                                                >
                                                    {t("public.nav.ourHistory")}
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    to="/equipe-direction"
                                                    className={`cursor-pointer ${
                                                        location.pathname === "/equipe-direction"
                                                            ? "bg-accent"
                                                            : ""
                                                    }`}
                                                >
                                                    {t("public.nav.leadership")}
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }

                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                                        location.pathname === link.href
                                            ? "bg-primary text-primary-foreground"
                                            : isTransparent
                                              ? "text-white/80 hover:text-white hover:bg-white/10"
                                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                >
                                    {t(link.labelKey)}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Actions - hide on mobile, show on md and above */}
                    <div className="hidden md:flex items-center gap-1 sm:gap-2">
                        <ThemeToggle variant="ghost" size="icon" />
                        <LanguageSwitcher />
                        <Link to="/login">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={
                                    isTransparent
                                        ? "text-white/80 hover:text-white hover:bg-white/10"
                                        : ""
                                }
                            >
                                {t("public.header.login")}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button - only on mobile */}
                    <div className="flex md:hidden items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle
                            variant="ghost"
                            size="icon"
                            className={
                                isTransparent
                                    ? "text-white/80 hover:text-white hover:bg-white/10"
                                    : ""
                            }
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className={
                                isTransparent
                                    ? "text-white hover:bg-white/10"
                                    : ""
                            }
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
                    <div className="md:hidden mt-2 bg-background/95 backdrop-blur-md rounded-xl border shadow-lg overflow-hidden">
                        <nav className="p-2">
                            <div className="grid gap-1">
                                {navLinks.map((link, index) => {
                                    // Insert Membership dropdown after Carte (index 1)
                                    if (index === 1 && link.href === "/carte-public") {
                                        return (
                                            <React.Fragment key={link.href}>
                                                <Link
                                                    to={link.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                        location.pathname === link.href
                                                            ? "bg-primary text-primary-foreground"
                                                            : "hover:bg-muted"
                                                    }`}
                                                >
                                                    {t(link.labelKey)}
                                                </Link>

                                                {/* Membership Dropdown in Mobile */}
                                                <div className="space-y-1">
                                                    <button
                                                        className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left flex items-center justify-between ${
                                                            isTransparent
                                                                ? "text-white/80"
                                                                : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {t("public.nav.membership")}
                                                        <ChevronDown className="h-4 w-4" />
                                                    </button>
                                                    <div className="ml-4 space-y-1">
                                                        <Link
                                                            to="/annuaire-pays-membres"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                                location.pathname === "/annuaire-pays-membres"
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "hover:bg-muted"
                                                            }`}
                                                        >
                                                            {t("public.nav.memberStates")}
                                                        </Link>
                                                        <Link
                                                            to="/membres-associes"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                                location.pathname === "/membres-associes"
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "hover:bg-muted"
                                                            }`}
                                                        >
                                                            {t("public.nav.associatedMembers")}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        )
                                    }

                                    // Convert About link to dropdown
                                    if (link.href === "/a-propos") {
                                        return (
                                            <div key={link.href} className="space-y-1">
                                                <button
                                                    className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left flex items-center justify-between ${
                                                        location.pathname === link.href || location.pathname.startsWith("/notre-histoire") || location.pathname.startsWith("/equipe-direction") || location.pathname.startsWith("/elections-cpl-2026") || location.pathname.startsWith("/candidats-atu-sg")
                                                            ? "bg-primary text-primary-foreground"
                                                            : isTransparent
                                                                ? "text-white/80"
                                                                : "text-muted-foreground"
                                                    }`}
                                                >
                                                    {t("public.nav.about")}
                                                    <ChevronDown className="h-4 w-4" />
                                                </button>
                                                <div className="ml-4 space-y-1">
                                                    <Link
                                                        to="/notre-histoire"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            location.pathname === "/notre-histoire"
                                                                ? "bg-primary text-primary-foreground"
                                                                : "hover:bg-muted"
                                                        }`}
                                                    >
                                                        {t("public.nav.ourHistory")}
                                                    </Link>
                                                    <Link
                                                        to="/equipe-direction"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            location.pathname === "/equipe-direction"
                                                                ? "bg-primary text-primary-foreground"
                                                                : "hover:bg-muted"
                                                        }`}
                                                    >
                                                        {t("public.nav.leadership")}
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    }

                                    return (
                                        <Link
                                            key={link.href}
                                            to={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                location.pathname === link.href
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                            }`}
                                        >
                                            {t(link.labelKey)}
                                        </Link>
                                    )
                                })}

                                <div className="border-t my-2 pt-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 bg-primary py-3 text-sm font-medium hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        {t("public.header.login")}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
