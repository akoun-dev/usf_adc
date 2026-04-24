import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, FolderOpen, Clock, FileEdit, Archive, Send } from "lucide-react"
import { Link } from "react-router-dom"

type ProjectFilter = "all" | "in-progress" | "drafts" | "archived"

export default function MyProjectsPage() {
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState<ProjectFilter>("all")

    const getFilterFromUrl = () => {
        const path = window.location.pathname
        if (path.includes("/in-progress")) return "in-progress"
        if (path.includes("/drafts")) return "drafts"
        if (path.includes("/archived")) return "archived"
        return "all"
    }

    const handleFilterChange = (newFilter: ProjectFilter) => {
        setFilter(newFilter)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t("nav.myProjects")}</h1>
                    <p className="text-muted-foreground">
                        {t("dashboard.manageProjects", "Gérez vos projets")}
                    </p>
                </div>
                <Button asChild>
                    <Link to="/point-focal/projects/new">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("common.add", "Ajouter")}
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

            <Tabs value={filter} onValueChange={(v) => handleFilterChange(v as ProjectFilter)} className="space-y-4">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="all">
                            <FolderOpen className="mr-2 h-4 w-4" />
                            {t("nav.myProjects")}
                        </TabsTrigger>
                        <TabsTrigger value="in-progress">
                            <Clock className="mr-2 h-4 w-4" />
                            {t("dashboard.inProgress", "En cours")}
                        </TabsTrigger>
                        <TabsTrigger value="drafts">
                            <FileEdit className="mr-2 h-4 w-4" />
                            {t("nav.projectDrafts")}
                        </TabsTrigger>
                        <TabsTrigger value="archived">
                            <Archive className="mr-2 h-4 w-4" />
                            {t("nav.projectsArchived")}
                        </TabsTrigger>
                    </TabsList>
                    <Button variant="outline" asChild>
                        <Link to="/point-focal/projects/submit">
                            <Send className="mr-2 h-4 w-4" />
                            {t("nav.submitProject")}
                        </Link>
                    </Button>
                </div>

                <TabsContent value={filter === "all" ? "all" : "all"}>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                <FolderOpen className="h-12 w-12 mb-4 opacity-50" />
                                <p>{t("common.noData")}</p>
                                <Button variant="outline" className="mt-4" asChild>
                                    <Link to="/point-focal/projects/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t("common.add")}
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="in-progress">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                <Clock className="h-12 w-12 mb-4 opacity-50" />
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

                <TabsContent value="archived">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                <Archive className="h-12 w-12 mb-4 opacity-50" />
                                <p>{t("common.noData")}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}