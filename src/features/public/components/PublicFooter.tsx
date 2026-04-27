import { Link } from "react-router-dom"
import atuLogo from "@/assets/atu-uat-logo.png"
import atuLogoWhite from "@/assets/atuuat-logo-blc.png"
import { useTranslation } from "react-i18next"
import { Facebook, Twitter, Linkedin, Mail, Github } from "lucide-react"

const footerSections = [
    {
        titleKey: "public.footer.platform",
        links: [
            { href: "/", labelKey: "public.nav.home" },
            { href: "/carte-public", labelKey: "public.nav.map" },
            { href: "/documents-publics", labelKey: "public.nav.documents" },
            { href: "/actualites", labelKey: "public.nav.news" },
        ],
    },
    {
        titleKey: "public.footer.community",
        links: [
            { href: "/forum-public", labelKey: "public.nav.forum" },
            { href: "/projets", labelKey: "public.nav.calls" },
            { href: "/calendrier", labelKey: "public.nav.calendar" },
            { href: "/a-propos", labelKey: "public.nav.about" },
        ],
    },
    {
        titleKey: "public.footer.support",
        links: [
            { href: "/faq-public", labelKey: "public.nav.faq" },
            { href: "/login", labelKey: "public.nav.login" },
        ],
    },
]

const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Email", href: "mailto:contact@atuuat.africa", icon: Mail },
]

interface PublicFooterProps {
    variant?: "default" | "minimal"
}

export function PublicFooter({ variant = "default" }: PublicFooterProps) {
    const { t } = useTranslation()

    if (variant === "minimal") {
        return (
            <footer className="border-t bg-muted/30">
                <div className="w-full py-6 px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex items-center gap-2">
                            <img
                                src={atuLogoWhite}
                                alt="ATU/UAT"
                                className="h-12 w-12"
                            />
                            <span className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} ANSUT/UAT
                            </span>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <Link
                                to="/a-propos"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {t("public.footer.about")}
                            </Link>
                            <Link
                                to="/faq-public"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {t("public.nav.faq")}
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }

    return (
        <footer className="border-t bg-primary">
            <div className="w-full py-10 sm:py-12 px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <img
                                src={atuLogoWhite}
                                alt="ATU/UAT"
                                className="h-16 w-16 rounded-xl p-1"
                            />
                            <div>
                                <span className="text-lg font-bold text-white">
                                    USF-ADC
                                </span>
                                <p className="text-xs text-white/80">
                                    African Telecommunications Union
                                </p>
                            </div>
                        </Link>
                        <p className="text-sm text-white/80 mb-4 max-w-xs">
                            {t("public.footer.description")}
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map(social => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-white/80 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                                    aria-label={social.name}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Sections */}
                    {footerSections.map(section => (
                        <div key={section.titleKey}>
                            <h3 className="font-normal mb-3 sm:mb-4 text-sm text-white uppercase">
                                {t(section.titleKey)}
                            </h3>
                            <ul className="space-y-1 sm:space-y-2">
                                {section.links.map(link => (
                                    <li key={link.href}>
                                        <Link
                                            to={link.href}
                                            className="text-xs sm:text-sm text-white/80 transition-colors hover:text-secondary"
                                        >
                                            {t(link.labelKey)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 sm:mt-12 border-t pt-6 sm:pt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3 sm:gap-4 text-center sm:text-left">

                        <p className="text-xs sm:text-sm text-white/80">
                            © {new Date().getFullYear()}{" "}
                            {t("public.footer.rights")}
                        </p>

                        <div className="flex justify-center sm:justify-end gap-3 sm:gap-4 text-xs sm:text-sm">
                            <Link
                                to="/a-propos"
                                className="text-white/80 hover:text-secondary"
                            >
                                {t("public.footer.legal")}
                            </Link>
                            <Link
                                to="/a-propos"
                                className="text-white/80 hover:text-secondary"
                            >
                                {t("public.footer.privacy")}
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    )
}
