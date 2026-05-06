import { useTranslation } from "react-i18next"
import { ArrowRight, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import adImage from "@/assets/business-geometric-technology-slide-hexagon.png"

export function AdSection() {
    const { ref, isVisible } = useScrollAnimation(0.05)
    const { t } = useTranslation()

    return (
        <section
            ref={ref}
            className={`w-full overflow-hidden transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={adImage}
                    alt="Background"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-850 via-green-900/80 to-transparent opacity-20" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl py-20 px-20 lg:px-12 md:px-10 sm:px-6">
                <div className="flex flex-col lg:flex-row items-center">
                    {/* Text Content */}
                    <div className="relative z-20 flex flex-1 flex-col justify-center">

                        <h2 className="text-4xl font-bold text-primary lg:text-6xl mb-6 leading-tight max-w-2xl">
                            {t("index.ad.title", "Accélérez la Transformation Numérique de Votre Région")}
                        </h2>

                        <p className="text-xl text-black mb-10 max-w-xl leading-relaxed">
                            {t("index.ad.description", "Rejoignez l'initiative USF-ADCA et bénéficiez d'outils de pilotage de pointe pour maximiser l'impact de vos fonds de service universel.")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" variant="default" className="text-primary border-primary bg-white backdrop-blur-sm hover:bg-primary hover:text-white font-bold h-14 px-10 text-lg rounded-xl transition-all hover:scale-105 active:scale-95">
                                <Globe className="mr-2 h-6 w-6" />
                                {t("index.ad.ctaSecondary", "En savoir plus")}
                            </Button>
                        </div>
                    </div>

                    {/* Optional side decoration or empty space to let background show */}
                    <div className="hidden lg:block lg:flex-1" />
                </div>
            </div>

        </section>
    )
}
