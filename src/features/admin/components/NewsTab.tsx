import { useTranslation } from "react-i18next"
import {
    useEnhancedNews,
    useDeleteNews,
    useUpdateNewsStatus,
} from "../hooks/useContentManagement"
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
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { EnhancedNewsArticle, NewsStatus } from "../types"
import { StatusBadge } from "./news/StatusBadge"
import { CategoryBadge } from "./news/CategoryBadge"

export function NewsTab() {
    const { t } = useTranslation()
    const { data: news, isLoading } = useEnhancedNews()
    const deleteNews = useDeleteNews()
    const updateNewsStatus = useUpdateNewsStatus()
    const navigate = useNavigate()

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

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>
                            {t(
                                "admin.newsManagement",
                                "Gestion des actualités"
                            )}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                "admin.newsManagementDesc",
                                "Créer et gérer les actualités de la plateforme"
                            )}
                        </CardDescription>
                    </div>
                    <Button onClick={() => navigate("/admin/news/create")}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("admin.createArticle", "Créer un article")}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
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
                                <TableCell colSpan={5}>
                                    {t("common.loading", "Chargement...")}
                                </TableCell>
                            </TableRow>
                        ) : news?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    {t("admin.noNews", "Aucune actualité")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            news?.map(item => (
                                <TableRow key={item.id}>
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
                                            {item.title}
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
                                            {/* Status actions dropdown */}
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
            </CardContent>
        </Card>
    )
}
