import { useTranslation } from "react-i18next"
import {
    useEnhancedNews,
    useDeleteNews,
    useUpdateNewsStatus,
} from "@/features/admin/hooks/useContentManagement"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Pencil,
    Trash2,
    Plus,
    Eye,
    EyeOff,
    Send,
    Save,
    CheckCircle2,
    Archive,
    FileText,
    Clock,
    RefreshCw,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { EnhancedNewsArticle, NewsStatus } from "@/features/admin/types"
import { StatusBadge } from "@/features/admin/components/news/StatusBadge"
import { CategoryBadge } from "@/features/admin/components/news/CategoryBadge"
import { getLangValue } from "@/types/i18n"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NewsTab() {
    const { t, i18n } = useTranslation()
    const { data: news, isLoading, refetch } = useEnhancedNews()
    const deleteNews = useDeleteNews()
    const updateNewsStatus = useUpdateNewsStatus()
    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(15)

    const handleDelete = async (id: string) => {
        if (
            confirm(
                t("admin.confirmDelete", "Êtes-vous sûr de vouloir supprimer ?")
            )
        ) {
            try {
                await deleteNews.mutateAsync(id)
            } catch (error) {
                console.error("Error deleting news:", error)
            }
        }
    }

    const handleTogglePublish = async (item: EnhancedNewsArticle) => {
        try {
            await updateNewsStatus.mutateAsync({
                id: item.id,
                status: item.status,
            })
        } catch (error) {
            console.error("Error toggling publish status:", error)
        }
    }

    const handleStatusChange = async (
        item: EnhancedNewsArticle,
        newStatus: NewsStatus
    ) => {
        try {
            await updateNewsStatus.mutateAsync({
                id: item.id,
                status: newStatus,
            })
        } catch (error) {
            console.error("Error updating status:", error)
        }
    }

    const getStatusActions = (item: EnhancedNewsArticle) => {
        const actions: {
            label: string
            status: NewsStatus
            icon: React.ReactNode
        }[] = []

        switch (item.status) {
            case "draft":
                actions.push(
                    {
                        label: t("news.submitForReview"),
                        status: "in_review",
                        icon: <Send className="h-4 w-4" />,
                    },
                    {
                        label: t("news.publish"),
                        status: "published",
                        icon: <CheckCircle2 className="h-4 w-4" />,
                    }
                )
                break
            case "in_review":
                actions.push(
                    {
                        label: t("news.approveAndPublish"),
                        status: "published",
                        icon: <CheckCircle2 className="h-4 w-4" />,
                    },
                    {
                        label: t("news.backToDraft"),
                        status: "draft",
                        icon: <FileText className="h-4 w-4" />,
                    }
                )
                break
            case "published":
                actions.push(
                    {
                        label: t("news.archive"),
                        status: "archived",
                        icon: <Archive className="h-4 w-4" />,
                    },
                    {
                        label: t("news.backToDraft"),
                        status: "draft",
                        icon: <FileText className="h-4 w-4" />,
                    }
                )
                break
            case "archived":
                actions.push({
                    label: t("news.restoreToDraft"),
                    status: "draft",
                    icon: <FileText className="h-4 w-4" />,
                })
                break
        }

        return actions
    }

    const filteredNews = useMemo(() => {
        if (!news) return []
        if (!searchTerm) return news

        const term = searchTerm.toLowerCase()
        return news.filter(item => {
            const title = getLangValue(item.title, i18n.language)?.toLowerCase() || ""
            const category = getLangValue(item.news_categories?.name_fr || "", i18n.language)?.toLowerCase() || ""
            return title.includes(term) || category.includes(term)
        })
    }, [news, searchTerm, i18n.language])

    const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
    const paginatedNews = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredNews.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredNews, currentPage, itemsPerPage])

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <Card className="border-none shadow-none bg-transparent animate-fade-in">
            <CardHeader className="px-0 pt-0 pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            {t("admin.newsManagement", "Gestion des actualités")}
                        </CardTitle>
                        <CardDescription>
                            {t("admin.newsManagementDesc", "Gérer les articles et actualités de la plateforme")}
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            {t("common.refresh", "Actualiser")}
                        </Button>
                        <Button size="sm" onClick={() => navigate("/admin/news/create")}>
                            <Plus className="h-4 w-4 mr-2" />
                            {t("admin.createArticle", "Créer un article")}
                        </Button>
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t("admin.searchNews", "Rechercher une actualité...")}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="pl-10 bg-white"
                        />
                    </div>
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchTerm("")}
                        >
                            {t("common.reset", "Réinitialiser")}
                        </Button>
                    )}
                </div>

                {(searchTerm || (news && filteredNews.length !== news.length)) && (
                    <div className="mt-2 text-sm text-muted-foreground">
                        {t("common.showing", "Affichage de")} {filteredNews.length} {t("nav.news").toLowerCase()} {t("common.of", "sur")} {news?.length || 0}
                    </div>
                )}
            </CardHeader>
            <CardContent className="px-0">
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">N°</TableHead>
                            <TableHead>{t("news.title")}</TableHead>
                            <TableHead>{t("news.category")}</TableHead>
                            <TableHead>{t("news.status")}</TableHead>
                            <TableHead>{t("news.publishedAt")}</TableHead>
                            <TableHead className="text-right">
                                {t("common.actions")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    {t("common.loading", "Chargement...")}
                                </TableCell>
                            </TableRow>
                        ) : filteredNews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    {t("admin.noNews", "Aucune actualité")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedNews.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell className="text-muted-foreground">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[300px] truncate">
                                        <Button
                                            variant="link"
                                            className="p-0 h-auto justify-start text-left"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/news/edit/${item.id}`
                                                )
                                            }
                                        >
                                            {getLangValue(item.title, i18n.language)}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {item.news_categories ? (
                                            <CategoryBadge
                                                category={item.news_categories}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            status={item.status as NewsStatus}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {item.published_at
                                            ? new Date(
                                                  item.published_at
                                              ).toLocaleDateString("fr-FR")
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8"
                                                    >
                                                        <Clock className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-xs">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            {t(
                                                                "news.changeStatus",
                                                                "Changer le statut"
                                                            )}
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-2">
                                                        {getStatusActions(
                                                            item
                                                        ).map(action => (
                                                            <Button
                                                                key={
                                                                    action.status
                                                                }
                                                                variant="ghost"
                                                                className="w-full justify-start gap-2"
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        item,
                                                                        action.status
                                                                    )
                                                                }
                                                            >
                                                                {action.icon}
                                                                {action.label}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleTogglePublish(item)
                                                }
                                                className="h-8 w-8"
                                                title={
                                                    item.is_public
                                                        ? t(
                                                              "news.unpublish",
                                                              "Dépublier"
                                                          )
                                                        : t(
                                                              "news.publish",
                                                              "Publier"
                                                          )
                                                }
                                            >
                                                {item.is_public ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/news/edit/${item.id}`
                                                    )
                                                }
                                                className="h-8 w-8"
                                                title={t(
                                                    "common.edit",
                                                    "Modifier"
                                                )}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="h-8 w-8"
                                                title={t(
                                                    "common.delete",
                                                    "Supprimer"
                                                )}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="whitespace-nowrap">{t("admin.rowsPerPage", "Lignes par page")}:</span>
                                <Select
                                    value={itemsPerPage.toString()}
                                    onValueChange={v => {
                                        setItemsPerPage(parseInt(v))
                                        setCurrentPage(1)
                                    }}
                                >
                                    <SelectTrigger className="w-[70px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="15">15</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <span className="whitespace-nowrap">
                                {Math.min((currentPage - 1) * itemsPerPage + 1, filteredNews.length)}-
                                {Math.min(currentPage * itemsPerPage, filteredNews.length)} {t("admin.of", "sur")} {filteredNews.length}
                            </span>
                        </div>
                        <Pagination className="w-auto m-0">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const page = i + 1
                                    if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    isActive={currentPage === page}
                                                    onClick={() => handlePageChange(page)}
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
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )
                                    }
                                    return null
                                })}

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
            </CardContent>
        </Card>
    )
}
