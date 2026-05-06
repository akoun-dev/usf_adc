import { useState } from "react"
import { useTranslation } from "react-i18next"
import { PublicLayout } from "../components/PublicLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserCog, ArrowRight, Quote, History } from "lucide-react"
import { Link } from "react-router-dom"
import { ProfileDialog } from "../components/ProfileDialog"

import omoPhoto from "@/assets/equipe/Omo.png"
import mwalePhoto from "@/assets/equipe/Mwale.png"
import slimaniPhoto from "@/assets/equipe/Slimani.png"
import boatengPhoto from "@/assets/equipe/Boateng.png"
import balloPhoto from "@/assets/equipe/Ballo.png"
import bgHeader from '@/assets/bg-header.jpg'

export default function LeadershipTeamPage() {
    const { t } = useTranslation('public')
    const [selectedProfile, setSelectedProfile] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const directors = [
        { id: 'mwale', photo: mwalePhoto },
        { id: 'slimani', photo: slimaniPhoto },
        { id: 'boateng', photo: boatengPhoto },
        { id: 'ballo', photo: balloPhoto },
    ] as const;

    const openProfile = (profileData: any) => {
        setSelectedProfile(profileData)
        setIsDialogOpen(true)
    }

    return (
        <PublicLayout>

            <div className="space-y-12 relative bg-gray-50">

                {/* Hero */}
                <div
                    className="relative bg-cover bg-center bg-no-repeat pb-5 !m-0 border-b"
                    style={{ backgroundImage: `url(${bgHeader})` }}
                >
                    <div className="absolute inset-0" />
                    <div className="relative text-center max-w-4xl mx-auto space-y-6 h-56 flex flex-col items-center justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">
                            {t("about.leadership.title")}
                        </h1>
                        <p className="text-xl text-base !mt-2">
                            {t("about.leadership.description")}
                        </p>
                    </div>
                </div>

            </div>



            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">


                <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10 space-y-24">
                    {/* Mission Section */}
                    <Card className="mb-6 bg-primary/5 border-primary/20">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Quote className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">
                                        Notre Mission
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t("about.mission")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>





                    {/* Hierarchy - Secretary General */}
                    <section className="space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Haute Direction</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                                Sous la direction visionnaire du Secrétaire Général, notre équipe s'engage pour l'avenir numérique de l'Afrique.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto">
                            <Card className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-2/5 relative overflow-hidden">
                                        <img
                                            src={omoPhoto}
                                            alt={t("about.leadership.secretaryGeneral.name")}
                                            className="w-full h-full object-cover aspect-[4/5] md:aspect-auto group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:hidden" />
                                        <div className="absolute bottom-6 left-6 md:hidden text-white">
                                            <p className="text-sm font-bold uppercase tracking-widest text-primary-foreground/80 mb-1">
                                                {t("about.leadership.secretaryGeneral.title")}
                                            </p>
                                            <h3 className="text-2xl font-bold">{t("about.leadership.secretaryGeneral.name")}</h3>
                                        </div>
                                    </div>
                                    <div className="md:w-3/5 p-8 md:p-12 space-y-6 flex flex-col justify-center">
                                        <div className="hidden md:block space-y-1">
                                            <Badge className="bg-primary/10 text-primary border-none text-sm font-bold px-4 py-1">
                                                {t("about.leadership.secretaryGeneral.title")}
                                            </Badge>
                                            <h3 className="text-4xl font-black text-slate-900 dark:text-white">
                                                {t("about.leadership.secretaryGeneral.name")}
                                            </h3>
                                            <p className="text-primary font-semibold">{t("about.leadership.secretaryGeneral.since")}</p>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-lg line-clamp-4 md:line-clamp-6 leading-relaxed">
                                            {t("about.leadership.secretaryGeneral.description")}
                                        </p>
                                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                            <Button
                                                size="lg"
                                                className="rounded-full px-8 font-bold text-lg"
                                                onClick={() => openProfile({
                                                    name: t("about.leadership.secretaryGeneral.name"),
                                                    role: t("about.leadership.secretaryGeneral.title"),
                                                    image: omoPhoto,
                                                    description: t("about.leadership.secretaryGeneral.description"),
                                                    since: t("about.leadership.secretaryGeneral.since")
                                                })}
                                            >
                                                {t("about.leadership.viewProfile")}
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>

                    {/* Regional Directors Grid */}
                    <section className="space-y-16">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-primary">
                                    <UserCog className="w-6 h-6" />
                                    <span className="font-bold uppercase tracking-widest text-sm">Expertise Sectorielle</span>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Conseil de Direction</h2>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {directors.map((director) => (
                                <Card key={director.id} className="group border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 overflow-hidden">
                                    <div className="flex items-stretch h-full">
                                        <div className="w-1/3 relative overflow-hidden shrink-0">
                                            <img
                                                src={director.photo}
                                                alt={t(`about.leadership.directors.${director.id}.name`)}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="w-2/3 p-6 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-primary uppercase tracking-tighter line-clamp-1">
                                                        {t(`about.leadership.directors.${director.id}.role`)}
                                                    </p>
                                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                                                        {t(`about.leadership.directors.${director.id}.name`)}
                                                    </h4>
                                                </div>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                                                    {t(`about.leadership.directors.${director.id}.description`)}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="mt-4 p-0 h-auto self-start text-primary hover:text-primary/80 hover:bg-transparent font-bold flex items-center gap-2 group/btn"
                                                onClick={() => openProfile({
                                                    name: t(`about.leadership.directors.${director.id}.name`),
                                                    role: t(`about.leadership.directors.${director.id}.role`),
                                                    image: director.photo,
                                                    description: t(`about.leadership.directors.${director.id}.description`)
                                                })}
                                            >
                                                {t("about.leadership.viewProfile")}
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* History CTA */}
                    <Card className="relative overflow-hidden bg-slate-900 text-white border-none shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />

                        <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-sm font-medium">
                                    <History className="w-4 h-4" />
                                    Patrimoine
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black leading-tight">
                                    {t("about.leadership.historyCTA.title")}
                                </h2>
                                <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                                    {t("about.leadership.historyCTA.description")}
                                </p>
                            </div>
                            <Button asChild size="lg" className="rounded-full px-10 h-16 text-lg font-bold shadow-2xl shadow-primary/40 hover:scale-105 transition-transform shrink-0">
                                <Link to="/notre-histoire" className="flex items-center gap-3">
                                    {t("about.leadership.historyCTA.button")}
                                    <ArrowRight className="w-6 h-6" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            <ProfileDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                profile={selectedProfile}
            />
        </PublicLayout >
    )
}
