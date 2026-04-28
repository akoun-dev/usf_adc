import { useTranslation } from "react-i18next"
import { PublicLayout } from "../components/PublicLayout"
import PageHero from "@/components/PageHero"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCog, Users } from "lucide-react"
import atuLogo from "@/assets/atu-uat-logo.png"
import omoPhoto from "@/assets/equipe/Omo.png"
import mwalePhoto from "@/assets/equipe/Mwale.png"
import slimaniPhoto from "@/assets/equipe/Slimani.png"
import boatengPhoto from "@/assets/equipe/Boateng.png"
import balloPhoto from "@/assets/equipe/Ballo.png"
import bgHeader from '@/assets/bg-header.jpg'





// Directors data from original AboutPage
const directors = [
    { id: 'mwale', photo: mwalePhoto },
    { id: 'slimani', photo: slimaniPhoto },
    { id: 'boateng', photo: boatengPhoto },
    { id: 'ballo', photo: balloPhoto },
] as const;

export default function LeadershipTeamPage() {
    const { t } = useTranslation('public')

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
                            {t("about.title")}
                        </h1>
                        <p className="text-xl text-base !mt-2">
                            {t("about.description")}
                        </p>
                    </div>
                </div>

            </div>







            <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">
                
                {/* Secretary General - Omo */}
                <div className="mb-12">
                    <Card className="bg-gradient-to-br from-primary to-secondary text-white dark:from-primary/80 dark:to-secondary/80 border-0">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-32 h-32 rounded-xl bg-white/20 dark:bg-black/20 flex items-center justify-center shrink-0">
                                    <img
                                        src={omoPhoto}
                                        alt={t("about.leadership.secretaryGeneral.name")}
                                        className="w-28 h-28 rounded-xl object-cover shadow-lg border-4 border-white/50 dark:border-white/30"
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <Badge className="mb-3 bg-white/20 text-white border-white/30 dark:bg-white/10 dark:border-white/20">
                                        {t("about.leadership.secretaryGeneral.title")}
                                    </Badge>
                                    <h2 className="text-3xl font-bold mb-2">{t("about.leadership.secretaryGeneral.name")}</h2>
                                    <p className="text-white/80 dark:text-white/70 text-sm mb-3">
                                        {t("about.leadership.secretaryGeneral.since")}
                                    </p>
                                    <p className="text-white/90 dark:text-white/80">
                                        {t("about.leadership.secretaryGeneral.description")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Regional Directors */}
                <div className="mb-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-foreground">
                            <UserCog className="h-5 w-5 text-primary" />
                            {t("about.leadership.directors.title")}
                        </h2>
                        <p className="text-muted-foreground">{t("about.leadership.description")}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {directors.map((director) => (
                            <Card key={director.id} className="hover:shadow-lg transition-all duration-300 border-2 bg-card dark:bg-card/95">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 overflow-hidden">
                                            <img
                                                src={director.photo}
                                                alt={t(`about.leadership.directors.${director.id}.name`)}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Badge variant="outline" className="mb-2">
                                                {t(`about.leadership.directors.${director.id}.role`)}
                                            </Badge>
                                            <h3 className="font-bold text-lg mb-2 text-foreground">
                                                {t(`about.leadership.directors.${director.id}.name`)}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {t(`about.leadership.directors.${director.id}.description`)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Organization Overview */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-br from-muted to-muted/50 dark:from-muted/20 dark:to-muted/10 border-2 bg-card dark:bg-card/80">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-20 h-20 rounded-xl bg-white dark:bg-card flex items-center justify-center shrink-0 shadow-lg">
                                    <img
                                        src={atuLogo}
                                        alt="ATU-UAT Logo"
                                        className="w-16 h-16"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{t("leadership.organizationalStructure.title")}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t("leadership.organizationalStructure.description")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    )
}
