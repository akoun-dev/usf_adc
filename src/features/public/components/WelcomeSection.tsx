import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Quote, ChevronLeft, ChevronRight, User } from 'lucide-react'
import omoPhoto from '@/assets/Mr-John-Omo-SG-ATU.jpg'
import { supabase } from '@/integrations/supabase/client'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface Speaker {
    id: string
    name: string
    role: string
    message: string
    photo: string
    fsu_name?: string
}

export function WelcomeSection() {
    const { ref, isVisible } = useScrollAnimation()
    const { t, i18n } = useTranslation()
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const [speakers, setSpeakers] = useState<Speaker[]>([])
    const [activeId, setActiveId] = useState<string>('secretaryGeneral')
    const [loading, setLoading] = useState(true)

    const fetchSpeakers = useCallback(async () => {
        try {
            setLoading(true)

            // 1. Initial SG from translations/assets
            const sg: Speaker = {
                id: 'secretaryGeneral',
                name: t('index.welcome.secretaryGeneral.name'),
                role: t('index.welcome.secretaryGeneral.role'),
                message: t('index.welcome.secretaryGeneral.message'),
                photo: omoPhoto
            }

            setSpeakers([sg])

            // 2. Fetch DGs from fsu_agencies table joined with countries
            const { data: agenciesData, error } = await supabase
                .from('fsu_agencies')
                .select(`
                    id, 
                    dg_name, 
                    dg_message, 
                    dg_photo_url, 
                    fsu_name, 
                    countries(name_fr)
                `)
                .not('dg_name', 'is', null)
                .not('dg_message', 'is', null)

            if (error) {
                console.error('Supabase error:', error)
            } else if (agenciesData) {
                const currentLang = (i18n.language || 'fr').split('-')[0]
                const dgs: Speaker[] = agenciesData.map(a => {
                    const messageObj = typeof a.dg_message === 'object' && a.dg_message !== null
                        ? a.dg_message as Record<string, string>
                        : { fr: a.dg_message || "" }
                    
                    return {
                        id: a.id,
                        name: a.dg_name || '',
                        role: `${t('common.directorGeneral', 'Directeur Général')} - ${a.fsu_name || (a.countries as any)?.name_fr}`,
                        message: messageObj[currentLang] || messageObj['en'] || messageObj['fr'] || '',
                        photo: a.dg_photo_url || '',
                        fsu_name: a.fsu_name || ''
                    }
                })

                const hasUAT = dgs.some(d => d.fsu_name?.includes('UAT') || d.fsu_name?.includes('ATU'))
                const finalSpeakers = hasUAT ? dgs : [sg, ...dgs]

                const sortedSpeakers = [...finalSpeakers].sort((a, b) => {
                    if (a.fsu_name?.includes('UAT') || a.fsu_name?.includes('ATU')) return -1
                    if (b.fsu_name?.includes('UAT') || b.fsu_name?.includes('ATU')) return 1
                    return 0
                })

                setSpeakers(sortedSpeakers)

                // Set default active speaker (ensure UAT is active)
                const uatEntry = sortedSpeakers.find(d => d.fsu_name?.includes('UAT') || d.fsu_name?.includes('ATU'))
                if (uatEntry) setActiveId(uatEntry.id)
            }
        } catch (error) {
            console.error('Error fetching speakers:', error)
        } finally {
            setLoading(false)
        }
    }, [t])

    useEffect(() => {
        fetchSpeakers()
    }, [fetchSpeakers])

    const activeSpeaker = speakers.find(s => s.id === activeId) || speakers[0]

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    if (loading || !activeSpeaker) {
        return (
            <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    return (
        <section className="relative bg-white py-16 lg:pt-20 lg:pb-24 overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div ref={ref} className="w-full px-4 sm:px-6 lg:px-12">
                {/* Section Header */}
                <div
                    className={`text-center mb-8 transition-all duration-700 opacity-100 translate-y-0`}
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

                {/* Main Content Area */}
                <div
                    className={`max-w-5xl mx-auto transition-all duration-700 delay-200 opacity-100 translate-y-0`}
                >
                    <div className="bg-background rounded-xl border shadow-xl overflow-hidden h-[320px] xs:h-[600px] sm:h-[600px] md:h-[500px] lg:h-[530px] flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="w-full md:w-2/5 relative h-72 md:h-auto">
                            {activeSpeaker.photo ? (
                                <img
                                    src={activeSpeaker.photo}
                                    alt={activeSpeaker.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <User className="h-20 w-20 text-muted-foreground/30" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                            <div className="absolute bottom-4 left-6 text-white md:hidden">
                                <h3 className="text-xl font-bold">{activeSpeaker.name}</h3>
                                <p className="text-white/80 text-sm">{activeSpeaker.role}</p>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-3/5 p-8 lg:p-8 flex flex-col relative">
                            <Quote className="absolute top-8 right-8 h-16 w-16 text-primary/5 -scale-x-100" />

                            <div className="hidden md:block mb-6">
                                <h3 className="text-2xl font-bold text-foreground mb-1">{activeSpeaker.name}</h3>
                                <p className="text-primary font-medium">{activeSpeaker.role}</p>
                            </div>

                            <div className="relative">
                                <p className="text-lg text-muted-foreground leading-relaxed italic">
                                    "{activeSpeaker.message.length > 450 ? activeSpeaker.message.slice(0, 450) + "..." : activeSpeaker.message}"
                                    {activeSpeaker.message.length > 450 && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="text-primary hover:underline text-sm font-semibold ml-2 inline-flex items-center align-baseline">
                                                    {t('common.readMore', 'Lire la suite')}
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl bg-white border-2">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-bold">{activeSpeaker.name}</DialogTitle>
                                                    <p className="text-primary font-medium">{activeSpeaker.role}</p>
                                                </DialogHeader>
                                                <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
                                                    <p className="text-lg text-muted-foreground leading-relaxed italic">
                                                        "{activeSpeaker.message}"
                                                    </p>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </p>
                            </div>

                            <div className="mt-auto pt-4 border-t">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">
                                        {t('index.welcome.otherMembers')}
                                    </h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => scroll('left')}
                                            className="p-2 rounded-full border hover:bg-muted transition-colors"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => scroll('right')}
                                            className="p-2 rounded-full border hover:bg-muted transition-colors"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div
                                    ref={scrollContainerRef}
                                    className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x"
                                >
                                    {speakers.map((speaker) => (
                                        <button
                                            key={speaker.id}
                                            onClick={() => setActiveId(speaker.id)}
                                            className={`flex-shrink-0 group relative snap-start w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeId === speaker.id
                                                ? 'border-primary ring-4 ring-primary/10'
                                                : 'border-transparent hover:border-muted-foreground/30'
                                                }`}
                                        >
                                            {speaker.photo ? (
                                                <img
                                                    src={speaker.photo}
                                                    alt={speaker.name}
                                                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${activeId === speaker.id ? 'scale-110' : ''
                                                        }`}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                    <User className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className={`absolute inset-0 transition-opacity duration-300 ${activeId === speaker.id ? 'bg-primary/0' : 'bg-black/20 group-hover:bg-black/0'
                                                }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
