import { useTranslation } from "react-i18next"
import { PublicLayout } from "../components/PublicLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Target, Globe, Award, TrendingUp, Building2, ArrowRight, Map as MapIcon, Briefcase } from "lucide-react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import React, { useMemo } from "react"

// Assets
import hero1 from "@/assets/history/hero1.png"
import hero2 from "@/assets/history/hero2.png"
import hero3 from "@/assets/history/hero3.png"
import aboutPhoto from "@/assets/history/about_n.jpg"
import adBanner from "@/assets/history/ad_banner.png"
import sgPhoto from "@/assets/history/sg_atu_john.jpg"

export default function OurHistoryPage() {
    const { t } = useTranslation('public')
    const navigate = useNavigate()
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    const slides = useMemo(() => [
        {
            image: hero1,
            title: t('ourHistory.hero.slides.0.title'),
            subtitle: t('ourHistory.hero.slides.0.subtitle'),
            description: t('ourHistory.hero.slides.0.description')
        },
        {
            image: hero2,
            title: t('ourHistory.hero.slides.1.title'),
            subtitle: t('ourHistory.hero.slides.1.subtitle'),
            description: t('ourHistory.hero.slides.1.description')
        },
        {
            image: hero3,
            title: t('ourHistory.hero.slides.2.title'),
            subtitle: t('ourHistory.hero.slides.2.subtitle'),
            description: t('ourHistory.hero.slides.2.description')
        }
    ], [t])

    const keyFigures = useMemo(() => [
        {
            icon: Users,
            value: t('ourHistory.impact.keyFigures.memberStates.value'),
            label: t('ourHistory.impact.keyFigures.memberStates.label'),
            description: t('ourHistory.impact.keyFigures.memberStates.description')
        },
        {
            icon: Building2,
            value: t('ourHistory.impact.keyFigures.associateMembers.value'),
            label: t('ourHistory.impact.keyFigures.associateMembers.label'),
            description: t('ourHistory.impact.keyFigures.associateMembers.description')
        },
        {
            icon: Globe,
            value: t('ourHistory.impact.keyFigures.founded.value'),
            label: t('ourHistory.impact.keyFigures.founded.label'),
            description: t('ourHistory.impact.keyFigures.founded.description')
        },
        {
            icon: TrendingUp,
            value: t('ourHistory.impact.keyFigures.engagement.value'),
            label: t('ourHistory.impact.keyFigures.engagement.label'),
            description: t('ourHistory.impact.keyFigures.engagement.description')
        }
    ], [t])

    const timelineEvents = useMemo(() => [
        {
            year: "1977",
            icon: Calendar,
            color: "from-blue-500 to-cyan-500",
            title: t('ourHistory.timeline.events.foundation.title'),
            description: t('ourHistory.timeline.events.foundation.description')
        },
        {
            year: "1999",
            icon: Target,
            color: "from-green-500 to-emerald-500",
            title: t('ourHistory.timeline.events.transformation.title'),
            description: t('ourHistory.timeline.events.transformation.description')
        },
        {
            year: t('common.today'),
            icon: Users,
            color: "from-purple-500 to-pink-500",
            title: t('ourHistory.timeline.events.leadership.title'),
            description: t('ourHistory.timeline.events.leadership.description')
        }
    ], [t])

    const objectives = t('ourHistory.strategic.objectives.list', { returnObjects: true }) as string[]

    return (
        <PublicLayout>
            <div className="flex flex-col w-full animate-fade-in overflow-x-hidden">
                {/* Hero Slideshow */}
                <section className="relative w-full h-[600px] md:h-[700px]">
                    <Carousel
                        plugins={[plugin.current]}
                        className="w-full h-full"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent className="h-[600px] md:h-[700px]">
                            {slides.map((slide, index) => (
                                <CarouselItem key={index} className="relative h-full">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 scale-105"
                                        style={{ backgroundImage: `url(${slide.image})` }}
                                    >
                                        <div className="absolute inset-0 bg-black/50" />
                                    </div>
                                    <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto space-y-6">
                                        <Badge className="bg-primary/20 text-white border-primary/50 backdrop-blur-sm px-4 py-1 text-sm mb-2">
                                            {slide.subtitle}
                                        </Badge>
                                        <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                                            {slide.title}
                                        </h1>
                                        <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light">
                                            {slide.description}
                                        </p>
                                        <div className="flex gap-4 pt-8">
                                            <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-xl" onClick={() => navigate('/projets')}>
                                                {t('ourHistory.hero.ctaProjects')}
                                            </Button>
                                            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-semibold bg-white/10 text-white border-white/30 backdrop-blur-md hover:bg-white/20" onClick={() => {
                                                document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                                            }}>
                                                {t('ourHistory.hero.ctaLearnMore')}
                                            </Button>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="hidden md:block">
                            <CarouselPrevious className="left-8 bg-white/10 text-white border-white/20 hover:bg-white/20 h-12 w-12" />
                            <CarouselNext className="right-8 bg-white/10 text-white border-white/20 hover:bg-white/20 h-12 w-12" />
                        </div>
                    </Carousel>
                </section>

                {/* Presentation Text + Photo */}
                <section id="about-section" className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="relative">
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                                    <img src={aboutPhoto} alt="Présentation de l'UAT" className="w-full h-[500px] object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                        <Award className="text-white h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('ourHistory.presentation.floatingBadge.expertise')}</p>
                                        <p className="font-bold text-lg">{t('ourHistory.presentation.floatingBadge.leader')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-primary font-semibold tracking-wider uppercase text-sm">{t('ourHistory.presentation.badge')}</h3>
                                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                                        {t('ourHistory.presentation.title')}
                                    </h2>
                                </div>
                                <p className="text-lg text-slate-600 leading-relaxed font-light">
                                    {t('ourHistory.presentation.description1')}
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed font-light">
                                    {t('ourHistory.presentation.description2')}
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg text-slate-700">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span>{t('ourHistory.presentation.features.policies')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg text-slate-700">
                                        <div className="w-2 h-2 rounded-full bg-secondary" />
                                        <span>{t('ourHistory.presentation.features.infra')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg text-slate-700">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span>{t('ourHistory.presentation.features.inclusion')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Alternating Sections - Key Figures (Soft Gray) */}
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t('ourHistory.impact.title')}</h2>
                            <p className="text-slate-600 font-light text-lg">{t('ourHistory.impact.subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {keyFigures.map((figure, index) => {
                                const Icon = figure.icon
                                return (
                                    <Card key={index} className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group overflow-hidden">
                                        <CardContent className="p-8 text-center relative">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500" />
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                                                <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                                            </div>
                                            <h4 className="text-4xl font-black text-slate-900 mb-2">{figure.value}</h4>
                                            <p className="font-bold text-slate-800 mb-2">{figure.label}</p>
                                            <p className="text-sm text-slate-500 font-light">{figure.description}</p>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Strategic Section: Objectives, SG, Vision & Mission */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-3 gap-12 items-start">

                            {/* Left: Organisational Objectives */}
                            <div className="space-y-8 animate-slide-in-left">
                                <div className="text-center md:text-left space-y-2">
                                    <h2 className="text-2xl font-bold text-slate-900 border-b-2 border-primary/20 pb-2 inline-block">
                                        {t('ourHistory.strategic.objectives.title')}
                                    </h2>
                                    <div className="flex justify-center md:justify-start">
                                        <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                                    </div>
                                </div>
                                <div className="space-y-6 relative">
                                    {/* Dotted line */}
                                    <div className="absolute left-[15px] top-4 bottom-4 w-px border-l-2 border-dashed border-slate-200 -z-10" />

                                    {Array.isArray(objectives) && objectives.map((obj, i) => (
                                        <div key={i} className="flex gap-4 items-start group">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                                <div className="w-4 h-4 text-white">
                                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 font-light leading-snug pt-1 group-hover:text-slate-900 transition-colors">
                                                {obj}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500 italic pt-4">
                                    {t('ourHistory.strategic.objectives.footer')}
                                </p>
                            </div>

                            {/* Center: SG Photo */}
                            <div className="relative group animate-fade-in order-first lg:order-none">
                                <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-colors" />
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[3/4]">
                                    <img
                                        src={sgPhoto}
                                        alt="Secretary General of ATU"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                                        <p className="font-bold text-xl">John OMO</p>
                                        <p className="text-white/80 text-sm">Secrétaire Général de l'UAT</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Vision & Mission */}
                            <div className="space-y-16 animate-slide-in-right">
                                {/* Vision */}
                                <div className="space-y-6">
                                    <div className="text-center md:text-left space-y-2">
                                        <h2 className="text-2xl font-bold text-slate-900 border-b-2 border-secondary/20 pb-2 inline-block">
                                            {t('ourHistory.strategic.vision.title')}
                                        </h2>
                                        <div className="flex justify-center md:justify-start">
                                            <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg">
                                            <div className="w-5 h-5 text-white">
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-slate-700 text-lg leading-relaxed font-medium">
                                            {t('ourHistory.strategic.vision.text')}
                                        </p>
                                    </div>
                                </div>

                                {/* Mission */}
                                <div className="space-y-6">
                                    <div className="text-center md:text-left space-y-2">
                                        <h2 className="text-2xl font-bold text-slate-900 border-b-2 border-primary/20 pb-2 inline-block">
                                            {t('ourHistory.strategic.mission.title')}
                                        </h2>
                                        <div className="flex justify-center md:justify-start">
                                            <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg">
                                            <div className="w-5 h-5 text-white">
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-slate-700 text-lg leading-relaxed">
                                                {t('ourHistory.strategic.mission.intro')}
                                            </p>
                                            <p className="text-slate-700 text-lg leading-relaxed font-bold">
                                                {t('ourHistory.strategic.mission.text')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Advertising Full-Width Space */}
                <section className="relative w-full py-32 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-fixed bg-center scale-105"
                        style={{ backgroundImage: `url(${adBanner})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80 backdrop-blur-[2px]" />
                    </div>
                    <div className="relative container mx-auto px-4 text-center text-white space-y-8">
                        <div className="max-w-4xl mx-auto space-y-6">
                            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-widest leading-tight">
                                {t('ourHistory.ad.title')}
                            </h2>
                            <p className="text-xl md:text-2xl font-light text-white/80 max-w-2xl mx-auto">
                                {t('ourHistory.ad.subtitle')}
                            </p>
                            <div className="pt-6">
                                <Button size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-full px-12 h-14 text-lg font-bold shadow-2xl">
                                    {t('ourHistory.ad.button')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Alternating Sections - Links to Projects & Map (Soft Blue) */}
                <section className="py-24 bg-blue-50/50">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="group relative bg-white p-12 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer" onClick={() => navigate('/projets')}>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125" />
                                <div className="relative space-y-6">
                                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:-rotate-12 transition-transform">
                                        <Briefcase className="text-white h-8 w-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">{t('ourHistory.links.projects.title')}</h3>
                                    <p className="text-slate-600 text-lg font-light leading-relaxed">{t('ourHistory.links.projects.description')}</p>
                                    <div className="flex items-center text-primary font-bold pt-4">
                                        {t('ourHistory.links.projects.button')} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-3 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="group relative bg-white p-12 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer" onClick={() => navigate('/cartographie')}>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125" />
                                <div className="relative space-y-6">
                                    <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                        <MapIcon className="text-white h-8 w-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">{t('ourHistory.links.map.title')}</h3>
                                    <p className="text-slate-600 text-lg font-light leading-relaxed">{t('ourHistory.links.map.description')}</p>
                                    <div className="flex items-center text-secondary font-bold pt-4">
                                        {t('ourHistory.links.map.button')} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-3 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline Section (White) */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">{t('ourHistory.timeline.title')}</h2>
                            <p className="text-slate-600 font-light text-lg">{t('ourHistory.timeline.subtitle')}</p>
                        </div>

                        <div className="relative">
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 transform -translate-x-1/2"></div>

                            <div className="space-y-16">
                                {timelineEvents.map((event, index) => {
                                    const Icon = event.icon
                                    const isLeft = index % 2 === 0

                                    return (
                                        <div
                                            key={index}
                                            className={`relative flex flex-col md:flex-row items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-8`}
                                        >
                                            {/* Content */}
                                            <div className={`flex-1 w-full ${isLeft ? "md:text-right" : "md:text-left"}`}>
                                                <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:border-primary/30 hover:shadow-xl transition-all duration-500 group">
                                                    <Badge className={`mb-4 text-sm px-4 py-1 bg-gradient-to-r ${event.color} text-white border-0`}>
                                                        {event.year}
                                                    </Badge>
                                                    <h3 className="text-2xl font-bold mb-4 text-slate-900">{event.title}</h3>
                                                    <p className="text-slate-600 leading-relaxed font-light text-lg">{event.description}</p>
                                                </div>
                                            </div>

                                            {/* Icon */}
                                            <div className="hidden md:flex w-20 h-20 rounded-full bg-white border-4 border-slate-50 items-center justify-center shadow-xl z-10 hover:scale-110 transition-transform duration-300 ring-8 ring-slate-100/30">
                                                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center">
                                                    <Icon className="h-7 w-7 text-white" />
                                                </div>
                                            </div>

                                            {/* Empty spacer */}
                                            <div className="hidden md:flex-1 md:block"></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    )
}
