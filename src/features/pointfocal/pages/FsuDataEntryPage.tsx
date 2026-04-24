import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Clock, FileEdit, History, Send } from "lucide-react"
import { Link } from "react-router-dom"

export default function FsuDataEntryPage() {
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t("nav.sectionFSU")}</h1>
                    <p className="text-muted-foreground">
                        {t("fsu.desc", "Saisie des données FSU")}
                    </p>
                </div>
                <Button asChild>
                    <Link to="/point-focal/fsu/new">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("nav.newEntry")}
                    </Link>
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t("common.search")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <Tabs defaultValue="history" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="history">
                        <History className="mr-2 h-4 w-4" />
                        {t("nav.entryHistory")}
                    </TabsTrigger>
                    <TabsTrigger value="drafts">
                        <FileEdit className="mr-2 h-4 w-4" />
                        {t("nav.fsudrafts")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="history">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                <History className="h-12 w-12 mb-4 opacity-50" />
                                <p>{t("common.noData")}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="drafts">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                <FileEdit className="h-12 w-12 mb-4 opacity-50" />
                                <p>{t("common.noData")}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}