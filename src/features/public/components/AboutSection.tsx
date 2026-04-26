import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Globe, BarChart3, Users, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { imgSiteCollaboration, imgSiteFemaleGraphic, imgSiteInnovation, imgSitePublicService } from '@/assets/images'

/* ------------------------------------------------------------------ */
/*  ABOUT / COLLABORATION                                             */
/* ------------------------------------------------------------------ */

export function AboutSection() {
    const { ref, isVisible } = useScrollAnimation()
    const { t } = useTranslation()
    const [currentIndex, setCurrentIndex] = useState(0)

    const carouselItems = [
        {
            image: imgSitePublicService,
            titleKey: "index.about.carousel.universal.title",
            descKey: "index.about.carousel.universal.desc",
            icon: <Globe className="h-8 w-8" />,
        },
        {
            image: imgSiteFemaleGraphic,
            titleKey: "index.about.carousel.dashboard.title",
            descKey: "index.about.carousel.dashboard.desc",
            icon: <BarChart3 className="h-8 w-8" />,
        },
        {
            image: imgSiteCollaboration,
            titleKey: "index.about.carousel.collaboration.title",
            descKey: "index.about.carousel.collaboration.desc",
            icon: <Users className="h-8 w-8" />,
        },
        {
            image: imgSiteInnovation,
            titleKey: "index.about.carousel.innovation.title",
            descKey: "index.about.carousel.innovation.desc",
            icon: <Zap className="h-8 w-8" />,
        },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % carouselItems.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [carouselItems.length])

    return (
        <section id="about" className="relative overflow-hidden">
            {/* Bottom transition to Roles */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-background" />
            <div
                ref={ref}
                className="w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-20"
            >
                {/* Header */}
                <div
                    className={`text-center mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                        <Globe className="h-4 w-4" />
                        {t("index.about.badge")}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-4">
                        {t("index.about.title")}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t("index.about.description")}
                    </p>
                </div>

                {/* Fade Carousel */}
                <div
                    className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                    <div className="relative">
                        {carouselItems.map((item, index) => (
                            <div
                                key={index}
                                className={`transition-opacity duration-1000 ${index === currentIndex
                                        ? "opacity-100"
                                        : "opacity-0 absolute inset-0 pointer-events-none"
                                    }`}
                            >
                                <Card className="border-0 overflow-hidden shadow-2xl">
                                    <CardContent className="p-0">
                                        <div className="grid lg:grid-cols-2">
                                            {/* Image */}
                                            <div className="relative h-56 lg:h-[500px]">
                                                <img
                                                    src={item.image}
                                                    alt={t(item.titleKey)}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                                            </div>

                                            {/* Text */}
                                            <div className="py-16 px-12 lg:py-16 lg:px-10 flex flex-col justify-center bg-background">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary">
                                                        {item.icon}
                                                    </div>

                                                    <h3 className="text-4xl font-bold text-foreground">
                                                        {t(item.titleKey)}
                                                    </h3>
                                                </div>

                                                <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                                                    {t(item.descKey)}
                                                </p>
                                                <Button
                                                    asChild
                                                    size="lg"
                                                    variant="outline"
                                                    className="w-fit text-lg px-8 py-6"
                                                >
                                                    <Link to="/a-propos">
                                                        {t(
                                                            "index.about.learnMore"
                                                        )}
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}

                        {/* Dots indicators */}
                        <div className="flex justify-center gap-3 mt-8">
                            {carouselItems.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? "w-12 bg-primary"
                                            : "w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
