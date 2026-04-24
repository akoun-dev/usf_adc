import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Clock, FileText, Send, MessageSquareText } from "lucide-react"
import { Link } from "react-router-dom"

export default function ForumPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t("nav.sectionForum")}</h1>
                    <p className="text-muted-foreground">
                        {t("forum.desc", "Forum de discussion")}
                    </p>
                </div>
                <Button asChild>
                    <Link to="/forum/new">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {t("forum.newTopic", "Nouveau sujet")}
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("nav.recentTopics")}</CardTitle>
                        <MessageSquareText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("nav.myTopics")}</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("nav.thematicGroups")}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("nav.codraft")}</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("nav.recentTopics")}</CardTitle>
                        <CardDescription>{t("forum.recentTopicsDesc", "Derniers sujets de discussion")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                            <MessageSquareText className="h-12 w-12 mb-4 opacity-50" />
                            <p>{t("common.noData")}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("nav.thematicGroups")}</CardTitle>
                        <CardDescription>{t("forum.groupsDesc", "Groupes thématiques")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                            <Users className="h-12 w-12 mb-4 opacity-50" />
                            <p>{t("common.noData")}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}