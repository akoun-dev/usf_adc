import { useMemo, useState } from "react"
import {
    Briefcase,
    Calendar,
    Filter,
    Globe,
    MapPin,
    Search,
    TrendingUp,
    Users,
} from "lucide-react"
import { Link } from "react-router-dom"
import { PublicLayout } from "../components/PublicLayout"
import { usePublicProjects } from "../hooks/usePublicProjects"
import { STATUS_LABELS, THEMATIC_LABELS, type PublicProject } from "../data/mockProjects"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import PageHero from "@/components/PageHero"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

function ProjectCard({ project }: { project: PublicProject }) {
    const statusInfo = STATUS_LABELS[project.status]

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{project.countryName}</Badge>
                        <Badge variant="outline">
                            {THEMATIC_LABELS[project.thematic] ?? project.thematic}
                        </Badge>
                    </div>
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </div>

                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                </p>

                <div className="grid gap-2 text-sm text-muted-foreground mb-5">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Cloture le {formatDate(project.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Budget : {project.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                            {project.beneficiaries.toLocaleString("fr-FR")} beneficiaires
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location.region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Operateur : {project.operator}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                        <Link to="/carte-public">Voir sur la carte</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                        <Link to={`/projets-pays/${project.countryCode}`}>Pays</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default function CallsForProjectsPage() {
    const { t } = useTranslation()
    const { data: projects, isLoading } = usePublicProjects()
    const [thematic, setThematic] = useState("all")
    const [search, setSearch] = useState("")

    const completedProjects = useMemo(
        () => (projects || []).filter(project => project.status === "completed"),
        [projects]
    )

    const thematicOptions = useMemo(() => {
        const values = Array.from(
            new Set(completedProjects.map(project => project.thematic))
        )
        return values.sort((a, b) =>
            (THEMATIC_LABELS[a] ?? a).localeCompare(THEMATIC_LABELS[b] ?? b)
        )
    }, [completedProjects])

    const filteredProjects = useMemo(() => {
        return completedProjects.filter(project => {
            const matchThematic = thematic === "all" || project.thematic === thematic
            const searchLower = search.toLowerCase()
            const matchSearch = !search ||
                project.title.toLowerCase().includes(searchLower) ||
                project.description.toLowerCase().includes(searchLower) ||
                project.countryName.toLowerCase().includes(searchLower) ||
                project.operator.toLowerCase().includes(searchLower) ||
                project.location.region.toLowerCase().includes(searchLower)

            return matchThematic && matchSearch
        })
    }, [completedProjects, thematic, search])

    return (
        <PublicLayout>
            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHero
                    title={t("public.calls.title")}
                    description={t("public.calls.description")}
                    icon={<Briefcase className="h-6 w-6 text-secondary" />}
                />

                <Card className="mb-6 bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">
                                    {t("public.calls.about.title")}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {t("public.calls.about.description")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un projet, un pays, un opérateur..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 h-12 rounded-xl"
                        />
                    </div>
                    <Select value={thematic} onValueChange={setThematic}>
                        <SelectTrigger className="w-[240px] h-12 rounded-xl">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t("public.calls.allThematics")}
                            </SelectItem>
                            {thematicOptions.map(value => (
                                <SelectItem key={value} value={value}>
                                    {THEMATIC_LABELS[value] ?? value}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {[1, 2, 3, 4].map(i => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <Skeleton className="h-4 w-3/4 mb-3" />
                                    <Skeleton className="h-3 w-full mb-2" />
                                    <Skeleton className="h-3 w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <Briefcase className="mx-auto h-12 w-12 mb-3 opacity-50" />
                            {t("public.calls.noCalls")}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {filteredProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    )
}
