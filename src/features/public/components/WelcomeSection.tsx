import { useTranslation } from 'react-i18next'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Quote } from 'lucide-react'
import omoPhoto from '@/assets/equipe/Omo.png'
import gillesBeugrePhoto from '@/assets/Gilles-Beugre-DG-ANSUT.jpg'

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

    return (
        <section className="relative bg-white py-16 lg:py-24 overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div ref={ref} className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div
                    className={`text-center mb-14 transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                        <Quote className="h-4 w-4" />
                        {t('index.welcome.badge')}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-4">
                        {t('index.welcome.title')}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t('index.welcome.description')}
                    </p>
                </div>

                {/* Two columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {speakers.map((speaker, index) => (
                        <div
                            key={speaker.id}
                            className={`transition-all duration-700 ${
                                isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-10'
                            }`}
                            style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                        >
                            <div className="bg-background rounded-2xl border shadow-lg p-8 lg:p-10 hover:shadow-xl transition-shadow duration-300">
                                {/* Photo + Text wrapping */}
                                <div className="relative">
                                    <img
                                        src={speaker.photo}
                                        alt={t(`index.welcome.${speaker.id}.name`)}
                                        className="w-28 h-28 lg:w-36 lg:h-36 rounded-xl object-cover shadow-md float-left mr-6 mb-4 border-4 border-primary/10"
                                    />
                                    {/* Quote icon */}
                                    <Quote className="h-8 w-8 text-primary/20 mb-2" />
                                    {/* Welcome text */}
                                    <p className="text-foreground/90 leading-relaxed text-sm lg:text-base">
                                        {t(`index.welcome.${speaker.id}.message`)}
                                    </p>
                                    {/* Clear float */}
                                    <div className="clear-both" />
                                </div>

                                {/* Signature */}
                                <div className="mt-6 pt-6 border-t border-border/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                                            <img
                                                src={speaker.photo}
                                                alt={t(`index.welcome.${speaker.id}.name`)}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">
                                                {t(`index.welcome.${speaker.id}.name`)}
                                            </p>
                                            <p className="text-sm text-primary font-medium">
                                                {t(`index.welcome.${speaker.id}.role`)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
