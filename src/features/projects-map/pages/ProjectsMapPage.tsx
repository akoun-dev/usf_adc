import { useState, useCallback } from "react"
import { MapPin, FileDown, Share2, Image, Copy, Plus } from "lucide-react"
import { useProjects } from "../hooks/useProjects"
import { ProjectMap } from "../components/ProjectMap"
import { ProjectFilters } from "../components/ProjectFilters"
import { ProjectSidebar } from "../components/ProjectSidebar"
import { ProjectFormDialog } from "../components/ProjectFormDialog"
import { exportMapData, generateShareableMapUrl } from "../utils/export-map"
import type { ProjectFilters as Filters, Project } from "../types"
import {
    PROJECT_STATUS_LABELS,
    PROJECT_STATUS_COLORS,
    type ProjectStatus,
} from "../types"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import PageHero from "@/components/PageHero"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useMemo } from "react"
import { ProjectCard } from "../components/ProjectCard"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function ProjectsMapPage() {
    const [filters, setFilters] = useState<Filters>({})
    const { data: projects = [], isLoading } = useProjects(filters)
    const { t } = useTranslation()
    const { roles } = useAuth()
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null
    )
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12

    const isAdmin =
        roles?.includes("super_admin") || roles?.includes("country_admin")

    const handleProjectSelect = useCallback((project: Project) => {
        setSelectedProjectId(project.id)
    }, [])

    const handleProjectClick = useCallback((project: Project) => {
        setSelectedProjectId(project.id)
    }, [])

    const handleAdd = () => {
        setEditingProject(null)
        setDialogOpen(true)
    }

    const handleEdit = useCallback(
        (project: Project) => {
            if (!isAdmin) return
            setEditingProject(project)
            setDialogOpen(true)
        },
        [isAdmin]
    )

    /* US-063: Share filtered map link */
    const handleShare = () => {
        const url = generateShareableMapUrl({
            status: filters.status || undefined,
            region: filters.region,
            country_id: filters.country_id,
            search: filters.search,
        })
        navigator.clipboard.writeText(url)
        toast.success(
            t("map.linkCopied", "Lien de la carte copié dans le presse-papiers")
        )
    }

    const totalPages = Math.ceil(projects.length / itemsPerPage)
    const paginatedProjects = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return projects.slice(start, start + itemsPerPage)
    }, [projects, currentPage])

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <PageHero
                title={t("map.title")}
                description={t("map.desc")}
                icon={<MapPin className="h-6 w-6 text-secondary" />}
            >
                <div className="flex gap-2">
                    {isAdmin && (
                        <Button size="sm" onClick={handleAdd} className="gap-1">
                            <Plus className="h-4 w-4" />
                            {t("common.add", "Ajouter")}
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <FileDown className="mr-1 h-4 w-4" />
                                {t("map.export", "Exporter")}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => exportMapData(projects, "csv")}
                            >
                                <FileDown className="mr-2 h-4 w-4" />
                                CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => exportMapData(projects, "png")}
                            >
                                <Image className="mr-2 h-4 w-4" />
                                PNG
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Share2 className="mr-1 h-4 w-4" />
                        {t("map.share", "Partager")}
                    </Button>
                </div>
            </PageHero>

            <ProjectFilters filters={filters} onChange={setFilters} />

            <div className="rounded-lg border overflow-hidden min-h-[500px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : (
                    <ProjectMap
                        projects={projects}
                        selectedProjectId={selectedProjectId}
                        onProjectClick={handleProjectClick}
                    />
                )}
            </div>

            <div className="flex items-center gap-6 px-2 py-2">
                {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map(
                    status => {
                        const isActive = filters.status === status
                        return (
                            <button
                                key={status}
                                type="button"
                                className={`flex items-center gap-2 rounded-full px-3 py-1 transition-colors ${
                                    isActive
                                        ? "bg-primary/10 ring-1 ring-primary"
                                        : "hover:bg-muted"
                                }`}
                                onClick={() =>
                                    setFilters(prev => ({
                                        ...prev,
                                        status: isActive ? "" : status,
                                    }))
                                }
                            >
                                <span
                                    className="inline-block h-3 w-3 rounded-full"
                                    style={{
                                        backgroundColor:
                                            PROJECT_STATUS_COLORS[status],
                                    }}
                                />
                                <span
                                    className={`text-sm ${isActive ? "font-medium text-foreground" : "text-muted-foreground"}`}
                                >
                                    {PROJECT_STATUS_LABELS[status]}
                                </span>
                            </button>
                        )
                    }
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {paginatedProjects.map(project => (
                    <Card 
                        key={project.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedProjectId === project.id ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => {
                            handleProjectClick(project)
                            if (isAdmin) handleEdit(project)
                        }}
                    >
                        <CardContent className="p-4">
                            <ProjectCard project={project} />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        isActive={currentPage === i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className="cursor-pointer"
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <ProjectFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                project={editingProject}
            />
        </div>
    )
}
