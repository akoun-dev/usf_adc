import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Search, Lock, Unlock, MessageSquare, Check, X, RefreshCw, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { useTableManagement, useExportToCSV, ColumnConfig } from '../hooks/useTableManagement';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useForumTopics, useUpdateForumTopic, useDeleteForumTopic } from '../hooks/useContentManagement';

interface ForumTopic {
    id: string;
    title: string;
    slug: string;
    status: 'open' | 'closed' | 'locked';
    created_at: string;
    updated_at: string;
    post_count: number;
    view_count: number;
    category: {
        id: string;
        name: string;
        color: string;
    };
    author: {
        id: string;
        name: string;
        avatar_url?: string;
    };
}

const COLUMNS: ColumnConfig<ForumTopic>[] = [
    { key: 'title', label: 'Titre', sortable: true },
    { key: 'category', label: 'Catégorie', sortable: true },
    { key: 'author', label: 'Auteur', sortable: true },
    { key: 'status', label: 'Statut', sortable: true },
    { key: 'post_count', label: 'Posts', sortable: true },
    { key: 'created_at', label: 'Créé le', sortable: true },
];

const TOPIC_STATUSES = [
    { value: 'tous', label: 'Tous les statuts' },
    { value: 'open', label: 'Ouvert' },
    { value: 'closed', label: 'Fermé' },
    { value: 'locked', label: 'Verrouillé' },
];

export function ForumTopicsTab() {
    const { t } = useTranslation();
    const { data: topics = [], isLoading, refetch } = useForumTopics();
    const updateTopic = useUpdateForumTopic();
    const deleteTopic = useDeleteForumTopic();

    // Filter state
    const [selectedStatus, setSelectedStatus] = useState('tous');
    const [selectedCategory, setSelectedCategory] = useState('toutes');

    // Use table management hook
    const {
        searchQuery,
        setSearchQuery,
        sortField,
        sortOrder,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        filteredAndSortedData: filteredTopics,
        paginatedData: paginatedTopics,
        totalPages,
        handleSort,
        resetFilters: resetTableFilters,
    } = useTableManagement<ForumTopic>({
        data: topics,
        columns: COLUMNS,
        initialSortField: 'created_at',
        initialSortOrder: 'desc',
        initialItemsPerPage: 10,
    });

    // Additional filtering
    const finalFilteredTopics = useMemo(() => {
        let filtered = [...filteredTopics];

        // Filter by status
        if (selectedStatus !== 'tous') {
            filtered = filtered.filter(topic => topic.status === selectedStatus);
        }

        // Filter by category
        if (selectedCategory !== 'toutes') {
            filtered = filtered.filter(topic => topic.category.id === selectedCategory);
        }

        return filtered;
    }, [filteredTopics, selectedStatus, selectedCategory]);

    // Recalculate pagination
    const finalTotalPages = Math.ceil(finalFilteredTopics.length / itemsPerPage);
    const finalPaginatedTopics = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return finalFilteredTopics.slice(startIndex, startIndex + itemsPerPage);
    }, [finalFilteredTopics, currentPage, itemsPerPage]);

    const { handleExport } = useExportToCSV<ForumTopic>(finalFilteredTopics, COLUMNS, 'forum-topics');

    const handleToggleLock = async (topic: ForumTopic) => {
        const newStatus = topic.status === 'locked' ? 'open' : 'locked';
        await updateTopic.mutateAsync({
            id: topic.id,
            status: newStatus
        });
        refetch();
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Supprimer le topic "${title}" ? Cette action est irréversible.`)) {
            await deleteTopic.mutateAsync(id);
            refetch();
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            open: { variant: 'default' as const, label: 'Ouvert' },
            closed: { variant: 'secondary' as const, label: 'Fermé' },
            locked: { variant: 'destructive' as const, label: 'Verrouillé' },
        };
        return <Badge variant={variants[status]?.variant || 'outline'}>
            {variants[status]?.label || status}
        </Badge>;
    };

    const resetAllFilters = () => {
        setSelectedStatus('tous');
        setSelectedCategory('toutes');
        resetTableFilters();
    };

    // Extract unique categories for filter
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Map(topics.map(topic => [topic.category.id, topic.category])).values());
        return [{ id: 'toutes', name: 'Toutes les catégories' }, ...uniqueCategories];
    }, [topics]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{t('admin.forumTopicsManagement', 'Gestion des Topics')}</CardTitle>
                            <CardDescription>{t('admin.forumTopicsManagementDesc', 'Gérer les discussions du forum')}</CardDescription>
                            <p className="text-sm text-muted-foreground mt-1">
                                {finalFilteredTopics.length} topics {topics.length > finalFilteredTopics.length && `sur ${topics.length}`}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Actualiser
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Exporter
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par titre, auteur ou contenu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filtrer par catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category.id} value={category.id}>
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.id !== 'toutes' ? category.color : '#ccc' }} />
                                            {category.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                {TOPIC_STATUSES.map(status => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(searchQuery || selectedCategory !== 'toutes' || selectedStatus !== 'tous') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetAllFilters}
                            >
                                Réinitialiser
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {COLUMNS.map(column => (
                                    <TableHead key={String(column.key)}>
                                        {column.sortable ? (
                                            <button
                                                onClick={() => handleSort(column.key as keyof ForumTopic)}
                                                className="flex items-center gap-1 hover:text-foreground transition-colors"
                                            >
                                                {column.label}
                                                {sortField === column.key && (
                                                    sortOrder === 'asc' ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )
                                                )}
                                            </button>
                                        ) : (
                                            column.label
                                        )}
                                    </TableHead>
                                ))}
                                <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12">
                                        {t('common.loading', 'Chargement...')}
                                    </TableCell>
                                </TableRow>
                            ) : finalPaginatedTopics.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        {searchQuery || selectedCategory !== 'toutes' || selectedStatus !== 'tous'
                                            ? "Aucun topic ne correspond aux critères de recherche"
                                            : "Aucun topic disponible"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                finalPaginatedTopics.map((topic) => (
                                    <TableRow key={topic.id} className="group hover:bg-muted/50">
                                        <TableCell className="font-medium max-w-[300px]">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate">{topic.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: topic.category.color }} />
                                                {topic.category.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {topic.author.avatar_url && (
                                                    <img
                                                        src={topic.author.avatar_url}
                                                        alt={topic.author.name}
                                                        className="h-6 w-6 rounded-full"
                                                    />
                                                )}
                                                <span>{topic.author.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(topic.status)}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {topic.post_count} {topic.post_count > 1 ? 'posts' : 'post'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(topic.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleToggleLock(topic)}
                                                    title={topic.status === 'locked' ? 'Déverrouiller' : 'Verrouiller'}
                                                >
                                                    {topic.status === 'locked' ? (
                                                        <Unlock className="h-4 w-4" />
                                                    ) : (
                                                        <Lock className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(topic.id, topic.title)}
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
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
                {finalTotalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Lignes par page:</span>
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(v) => setItemsPerPage(parseInt(v))}
                            >
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <span>
                                {Math.min((currentPage - 1) * itemsPerPage + 1, finalFilteredTopics.length)}-{Math.min(currentPage * itemsPerPage, finalFilteredTopics.length)} sur {finalFilteredTopics.length}
                            </span>
                        </div>

                        <Pagination>
                            <PaginationContent>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />

                                {Array.from({ length: Math.min(5, finalTotalPages) }, (_, i) => {
                                    let pageNum;
                                    if (finalTotalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= finalTotalPages - 2) {
                                        pageNum = finalTotalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(pageNum)}
                                                isActive={currentPage === pageNum}
                                                className="cursor-pointer"
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                {finalTotalPages > 5 && currentPage < finalTotalPages - 2 && (
                                    <PaginationEllipsis />
                                )}

                                <PaginationNext
                                    onClick={() => setCurrentPage(p => Math.min(finalTotalPages, p + 1))}
                                    className={currentPage === finalTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
