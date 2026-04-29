import React from "react"
import { useTranslation } from "react-i18next"
import { usePublicPartners } from "@/features/public/hooks/usePublicPartners"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { Handshake } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Partners Logo Scroller Section                                     */
/* ------------------------------------------------------------------ */

export const PartnersLogoScroller = () => {
    const { ref, isVisible } = useScrollAnimation()
    const { t } = useTranslation()
    const { data: partners, isLoading } = usePublicPartners()

    // Ne rien afficher si chargement ou pas de partenaires
    if (isLoading) {
        return (
            <section className="relative px-6 py-12 bg-muted/20 overflow-hidden">
                <div className="w-full">
                    <div className="text-center mb-8">
                        <div className="h-6 w-48 bg-muted rounded animate-pulse mx-auto" />
                    </div>
                    <div className="flex gap-8 justify-center">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div
                                key={i}
                                className="h-16 w-28 rounded-lg bg-muted animate-pulse shrink-0"
                            />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!partners || partners.length === 0) {
        return null
    }

    // On duplique la liste pour l'effet de boucle infinie
    const duplicatedPartners = [...partners, ...partners]

    return (
        <section className="relative py-12 bg-white overflow-hidden px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 xs:px-4 py-10">
            <div
                ref={ref}
                className={`w-full transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-100"}`}
            >
                {/* Titre de section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                        <Handshake className="h-4 w-4" />
                        {t("index.partners.badge")}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground lg:text-3xl mb-4 text-primary">
                        {t("index.partners.title")}
                    </h2>
                </div>

                {/* Gradient masks + scrolling container */}
                <div className="relative group">
                    {/* Dégradé gauche */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/20 to-transparent z-10 pointer-events-none" />
                    {/* Dégradé droit */}
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/20 to-transparent z-10 pointer-events-none" />

                    <div className="overflow-hidden">
                        <div className="flex animate-scroll-partners w-max">
                            {duplicatedPartners.map((partner, index) => (
                                <div
                                    key={`${partner.id}-${index}`}
                                    className="shrink-0 mx-4 flex items-center justify-center"
                                >
                                    {partner.site_web ? (
                                        <a
                                            href={partner.site_web}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                            title={partner.nom_complet || partner.nom}
                                        >
                                            {partner.logo_url ? (
                                                <div className="flex items-center justify-center h-20 w-36 rounded-xl bg-card border border-border/50 p-3 transition-all duration-300 hover:-translate-y-0.5">
                                                    <img
                                                        src={partner.logo_url}
                                                        alt={partner.nom_complet || partner.nom}
                                                        className="max-h-full max-w-full object-contain"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-20 w-36 rounded-xl bg-card border border-border/50 p-3 transition-all duration-300 hover:-translate-y-0.5">
                                                    <span className="text-sm font-semibold text-muted-foreground text-center leading-tight">
                                                        {partner.nom_complet || partner.nom}
                                                    </span>
                                                </div>
                                            )}
                                        </a>
                                    ) : (
                                        <div title={partner.nom_complet || partner.nom}>
                                            {partner.logo_url ? (
                                                <div className="flex items-center justify-center h-20 w-36 rounded-xl bg-card border border-border/50 p-3 transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
                                                    <img
                                                        src={partner.logo_url}
                                                        alt={partner.nom_complet || partner.nom}
                                                        className="max-h-full max-w-full object-contain"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-20 w-36 rounded-xl bg-card border border-border/50 p-3 transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
                                                    <span className="text-sm font-semibold text-muted-foreground text-center leading-tight">
                                                        {partner.nom_complet || partner.nom}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
