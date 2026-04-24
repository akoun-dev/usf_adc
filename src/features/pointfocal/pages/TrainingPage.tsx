import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, BookMarked, Award } from "lucide-react"

export default function TrainingPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.sectionTraining")}</h1>
                <p className="text-muted-foreground">
                    {t("training.desc", "Formation et ressources")}
                </p>
            </div>

            <Tabs defaultValue="webinars" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="webinars">
                        <Video className="mr-2 h-4 w-4" />
                        {t("nav.webinars", "Webinaires")}
                    </TabsTrigger>
                    <TabsTrigger value="elearning">
                        <BookMarked className="mr-2 h-4 w-4" />
                        {t("nav.elearning", "E-Learning")}
                    </TabsTrigger>
                    <TabsTrigger value="certifications">
                        <Award className="mr-2 h-4 w-4" />
                        {t("nav.myCertifications", "Mes Certifications")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="webinars">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="h-5 w-5" />
                                {t("nav.webinars")}
                            </CardTitle>
                            <CardDescription>
                                {t("training.webinarsDesc", "Webinaires en direct et enregistrés")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="elearning">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookMarked className="h-5 w-5" />
                                {t("nav.elearning")}
                            </CardTitle>
                            <CardDescription>
                                {t("training.elearningDesc", "Cours en ligne et ressources pédagogiques")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="certifications">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                {t("nav.myCertifications")}
                            </CardTitle>
                            <CardDescription>
                                {t("training.certificationsDesc", "Suivi des formations complétées")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}