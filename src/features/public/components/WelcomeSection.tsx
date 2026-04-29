import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import omoPhoto from '@/assets/equipe/Omo.png'
import gillesBeugrePhoto from '@/assets/Gilles-Beugre-DG-ANSUT.jpg'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel'

const speakers = [
    {
        id: 'secretaryGeneral',
        photo: omoPhoto,
    },
    {
        id: 'director',
        photo: gillesBeugrePhoto,
    },
] as const

export function WelcomeSection() {
    const { ref, isVisible } = useScrollAnimation()
    const { t } = useTranslation()
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    const onSelect = useCallback(() => {
        if (!api) return
        setCurrent(api.selectedScrollSnap())
    }, [api])

    useEffect(() => {
        if (!api) return
        onSelect()
        api.on('select', onSelect)
        return () => {
            api.off('select', onSelect)
        }
    }, [api, onSelect])

    return (
        <section className="relative bg-white py-16 lg:pt-20 lg:pb-20 overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div ref={ref} className="w-full px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div
                    className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                        <Quote className="h-4 w-4" />
                        {t('index.welcome.badge')}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-4 text-primary">
                        {t('index.welcome.title')}
                    </h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                        {t('index.welcome.description')}
                    </p>
                </div>

                {/* Carousel / Slider */}
                <div
                    className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                    style={{ transitionDelay: '200ms' }}
                >
                    <div className="relative max-w-4xl mx-auto">
                        <Carousel
                            setApi={setApi}
                            opts={{ loop: true }}
                            plugins={[
                                Autoplay({
                                    delay: 5000,
                                    stopOnInteraction: true,
                                    stopOnMouseEnter: true,
                                }),
                            ]}
                            className="w-full"
                        >
                            <CarouselContent>
                                {speakers.map((speaker) => (
                                    <CarouselItem key={speaker.id}>
                                        <div
                                            className="bg-background rounded-2xl border shadow-lg p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300
                                            h-[40vh] xs:h-[530px] sm:h-[35vh] md:h-[60vh] lg:h-[43vh] flex flex-col"
                                        >
                                            {/* Photo + Text wrapping */}
                                            <div className="relative flex-1">
                                                {/* Photo - centered on mobile, floated right on larger screens */}
                                                <div className="flex justify-center mb-2 xs:float-right sm:float-right xs:ml-4 sm:ml-6 xs:mb-2 sm:mb-4">
                                                    <img
                                                        src={speaker.photo}
                                                        alt={t(`index.welcome.${speaker.id}.name`)}
                                                        className="w-28 h-40 sm:w-36 sm:h-52 lg:w-56 lg:h-80 rounded-xl object-cover "
                                                    />
                                                </div>
                                                {/* Quote icon */}
                                                <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20 mb-2" />
                                                {/* Welcome text */}
                                                <p className="text-sm xs:text-base sm:text-base md:text-md lg:text-md xl:text-lg text-foreground/90 text-muted-foreground leading-relaxed italic text-justify">
                                                    {t(`index.welcome.${speaker.id}.message`)}
                                                </p>
                                                {/* Clear float */}
                                                <div className="clear-both" />
                                            </div>

                                            {/* Signature */}
                                            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/50">
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                                                        <img
                                                            src={speaker.photo}
                                                            alt={t(`index.welcome.${speaker.id}.name`)}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm sm:text-base text-foreground">
                                                            {t(`index.welcome.${speaker.id}.name`)}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-primary font-medium">
                                                            {t(`index.welcome.${speaker.id}.role`)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                        {/* Navigation arrows */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                onClick={() => api?.scrollPrev()}
                                className="h-10 w-10 rounded-full border border-border bg-background shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-200"
                                aria-label="Slide précédent"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {/* Dot indicators */}
                            <div className="flex items-center gap-2">
                                {speakers.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => api?.scrollTo(index)}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${index === current
                                                ? 'w-8 bg-primary'
                                                : 'w-2.5 bg-primary/30 hover:bg-primary/50'
                                            }`}
                                        aria-label={`Aller au slide ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => api?.scrollNext()}
                                className="h-10 w-10 rounded-full border border-border bg-background shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-200"
                                aria-label="Slide suivant"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
