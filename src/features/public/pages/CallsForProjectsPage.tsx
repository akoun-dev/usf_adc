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
import type { ProjectWithDetails } from "../services/projects.service"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import PageHero from "@/components/PageHero"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import bgHeader from '@/assets/bg-header.jpg'




const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    'planned': { label: 'Planifié', color: 'bg-slate-500/10 text-slate-700 dark:text-slate-400' },
    'in_progress': { label: 'En cours', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
    'completed': { label: 'Terminé', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
    'suspended': { label: 'Suspendu', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

function ProjectCard({ project }: { project: ProjectWithDetails }) {
    const statusInfo = STATUS_LABELS[project.status] || STATUS_LABELS['planned']

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        {project.country?.flag_url && (
                            <img
                                src={project.country.flag_url}
                                alt={project.country.name_fr}
                                className="h-5 w-auto mr-2"
                            />
                        )}
                        {project.country && (
                            <Badge variant="outline">{project.country.name_fr}</Badge>
                        )}
                        {project.thematic && (
                            <Badge variant="outline">{project.thematic}</Badge>
                        )}
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
                        <span>Cloture le {formatDate(project.updated_at)}</span>
                    </div>
                    {project.budget && (
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>Budget : {project.budget.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                    )}
                    {project.beneficiaries && (
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{project.beneficiaries} bénéficiaires</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{project.region || project.country?.region || "N/A"}</span>
                    </div>
                    {project.operator && (
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>Operateur : {project.operator}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button asChild size="sm" variant="outline" className="text-xs px-2">
                        <Link to="/carte-public">Sur la carte</Link>
                    </Button>
                    <Button asChild size="sm" className="text-xs px-2">
                        <Link to={`/projets/${project.id}`}>Détails</Link>
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
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const completedProjects = useMemo(
        () => (projects || []).filter(project => project.status === "completed"),
        [projects]
    )

    const thematicOptions = useMemo(() => {
        const values = Array.from(
            new Set(completedProjects.map(project => project.thematic))
        ).filter((thematic): thematic is string => thematic !== null)
        return values.sort((a, b) =>
            (a || '').localeCompare((b || ''))
        )
    }, [completedProjects])

    const filteredProjects = useMemo(() => {
        return completedProjects.filter(project => {
            const matchThematic = thematic === "all" || project.thematic === thematic
            const searchLower = search.toLowerCase()
            const matchSearch = !search ||
                project.title.toLowerCase().includes(searchLower) ||
                (project.description || '').toLowerCase().includes(searchLower) ||
                project.country?.name_fr?.toLowerCase().includes(searchLower) ||
                (project.operator || '').toLowerCase().includes(searchLower) ||
                (project.region || project.country?.region || '').toLowerCase().includes(searchLower)

            return matchThematic && matchSearch
        })
    }, [completedProjects, thematic, search])

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1)
    }, [search, thematic])

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
    const paginatedProjects = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredProjects.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredProjects, currentPage, itemsPerPage])

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
                            {t("public.calls.title")}
                        </h1>
                        <p className="text-xl text-base !mt-2">
                            {t("public.calls.description")}
                        </p>
                    </div>
                </div>

            </div>




            <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">

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
                                    {value || 'Sans thématique'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                ) : filteredProjects.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <Briefcase className="mx-auto h-12 w-12 mb-3 opacity-50" />
                            {t("public.calls.noCalls")}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {paginatedProjects.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        >
                                            {t('common.previous')}
                                        </PaginationPrevious>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            onClick={() => setCurrentPage(page)}
                                                            isActive={page === currentPage}
                                                            className="cursor-pointer"
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return <PaginationEllipsis key={page} />
                                            }
                                            return null
                                        })}

                                        <PaginationNext
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        >
                                            {t('common.next')}
                                        </PaginationNext>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PublicLayout>
    )
}
