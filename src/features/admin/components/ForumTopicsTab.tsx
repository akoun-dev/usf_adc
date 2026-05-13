import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Pencil, Trash2, Search, Lock, Unlock, MessageSquare, 
    Check, X, RefreshCw, Download, ChevronUp, ChevronDown, 
    Plus, Sparkles, Loader2, Languages 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
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
import { useForumTopics, useUpdateForumTopic, useDeleteForumTopic, useForumCategories, useCreateForumTopic } from '../hooks/useContentManagement';
import { getLangValue } from '@/types/i18n';
import { translateToFourLang } from '../services/translate.service';
import { useToast } from '@/hooks/use-toast';

interface ForumTopic {
    id: string;
    title: any;
    content: any;
    slug: any;
    status: 'open' | 'closed' | 'locked';
    created_at: string;
    updated_at: string;
    post_count: number;
    view_count: number;
    category: {
        id: string;
        name: any;
        color: string;
    };
    author: {
        id: string;
        name: string;
        avatar_url?: string;
    };
}

interface ForumTopicFormData {
    title: string | Record<string, string>;
    content: string | Record<string, string>;
    category_id: string;
    status: 'open' | 'closed' | 'locked';
}

const COLUMNS: ColumnConfig<ForumTopic>[] = [
    { key: 'title', label: 'admin.forum.title', sortable: true },
    { key: 'category', label: 'admin.forum.category', sortable: true },
    { key: 'author', label: 'admin.forum.author', sortable: true },
    { key: 'status', label: 'admin.forum.status', sortable: true },
    { key: 'post_count', label: 'admin.forum.posts', sortable: true },
    { key: 'created_at', label: 'admin.forum.createdAt', sortable: true },
];

const TOPIC_STATUSES = [
    { value: 'tous', label: 'admin.forum.statusAll' },
    { value: 'open', label: 'admin.forum.statusOpen' },
    { value: 'closed', label: 'admin.forum.statusClosed' },
    { value: 'locked', label: 'admin.forum.statusLocked' },
];

export function ForumTopicsTab() {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language.split('-')[0];
    const { data: topics = [], isLoading, refetch } = useForumTopics();
    const { data: allCategories = [] } = useForumCategories();
    const createTopic = useCreateForumTopic();
    const updateTopic = useUpdateForumTopic();
    const deleteTopic = useDeleteForumTopic();
    const { toast } = useToast();

    // Form state
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('fr');
    const [isTranslating, setIsTranslating] = useState(false);
    const [extraTranslations, setExtraTranslations] = useState<Record<string, { title: string, content: string }>>({
        en: { title: '', content: '' },
        pt: { title: '', content: '' },
        ar: { title: '', content: '' },
    });

    const { register, handleSubmit, reset, setValue, watch } = useForm<ForumTopicFormData>();

    // Filter state
    const [selectedStatus, setSelectedStatus] = useState('tous');
    const [selectedCategory, setSelectedCategory] = useState('toutes');

    const onSubmit = async (data: ForumTopicFormData) => {
        try {
            const frTitle = (watch('title') as string) || '';
            const frContent = (watch('content') as string) || '';
            
            const finalData = {
                ...data,
                title: { fr: frTitle, ...Object.fromEntries(Object.entries(extraTranslations).map(([l, v]) => [l, v.title])) },
                content: { fr: frContent, ...Object.fromEntries(Object.entries(extraTranslations).map(([l, v]) => [l, v.content])) },
            };

            if (editingId) {
                await updateTopic.mutateAsync({ id: editingId, ...finalData });
            } else {
                await createTopic.mutateAsync(finalData as any);
            }
            
            toast({ title: t('common.success') });
            reset();
            setEditingId(null);
            setIsOpen(false);
            setExtraTranslations({
                en: { title: '', content: '' },
                pt: { title: '', content: '' },
                ar: { title: '', content: '' },
            });
            refetch();
        } catch (error) {
            toast({ title: t('common.error'), variant: 'destructive' });
        }
    };

    const handleEdit = (item: ForumTopic) => {
        const getVal = (field: any, lang: string) => {
            if (!field) return '';
            if (typeof field === 'object') return field[lang] || '';
            return lang === 'fr' ? field : '';
        };

        setEditingId(item.id);
        setValue('title', getVal(item.title, currentLang));
        setValue('content', getVal(item.content, currentLang));
        setValue('category_id', item.category.id);
        setValue('status', item.status);
        
        const extra: any = {};
        ['en', 'pt', 'ar'].forEach(l => {
            extra[l] = {
                title: getVal(item.title, l),
                content: getVal(item.content, l),
            };
        });
        setExtraTranslations(extra);
        
        setIsOpen(true);
    };

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
        columns: COLUMNS.map(c => ({ ...c, label: t(c.label, c.label) })),
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

    const { handleExport } = useExportToCSV<ForumTopic>(finalFilteredTopics, COLUMNS.map(c => ({ ...c, label: t(c.label, c.label) })), 'forum-topics');

    const handleToggleLock = async (topic: ForumTopic) => {
        const newStatus = topic.status === 'locked' ? 'open' : 'locked';
        await updateTopic.mutateAsync({
            id: topic.id,
            status: newStatus
        });
        refetch();
    };

    const handleDelete = async (id: string, title: any) => {
        const displayTitle = getLangValue(title, i18n.language);
        if (confirm(t('admin.forum.confirmDelete', { title: displayTitle }, `Supprimer le topic "${displayTitle}" ? Cette action est irréversible.`))) {
            await deleteTopic.mutateAsync(id);
            refetch();
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            open: { variant: 'default' as const, label: t('admin.forum.statusOpen', 'Ouvert') },
            closed: { variant: 'secondary' as const, label: t('admin.forum.statusClosed', 'Fermé') },
            locked: { variant: 'destructive' as const, label: t('admin.forum.statusLocked', 'Verrouillé') },
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
    const categoriesForFilter = useMemo(() => {
        const validTopics = topics.filter(t => t.category);
        const uniqueCategories = Array.from(new Map(validTopics.map(topic => [topic.category.id, topic.category])).values());
        return [{ id: 'toutes', name: t('admin.forum.categoryAll', 'Toutes les catégories') }, ...uniqueCategories];
    }, [topics, t]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{t('admin.forum.topicsManagement', 'Gestion des Topics')}</CardTitle>
                            <CardDescription>{t('admin.forum.topicsManagementDesc', 'Gérer les discussions du forum')}</CardDescription>
                            <p className="text-sm text-muted-foreground mt-1">
                                {finalFilteredTopics.length} {t('admin.forum.topicsCount', 'topics')} {topics.length > finalFilteredTopics.length && `${t('admin.of', 'sur')} ${topics.length}`}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {t('common.refresh', 'Actualiser')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                {t('common.export', 'Exporter')}
                            </Button>
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" onClick={() => {
                                        setEditingId(null);
                                        reset({
                                            title: '',
                                            content: '',
                                            category_id: '',
                                            status: 'open'
                                        });
                                        setExtraTranslations({
                                            en: { title: '', content: '' },
                                            pt: { title: '', content: '' },
                                            ar: { title: '', content: '' },
                                        });
                                    }}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('admin.forum.newTopic', 'Nouveau Topic')}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingId ? t('admin.forum.editTopic', 'Modifier le Topic') : t('admin.forum.newTopic', 'Nouveau Topic')}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="category_id">{t('admin.forum.category', 'Catégorie')}</Label>
                                                <Select 
                                                    value={watch('category_id')} 
                                                    onValueChange={(v) => setValue('category_id', v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('admin.forum.chooseCategory', 'Choisir une catégorie')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {allCategories.map(cat => (
                                                            <SelectItem key={cat.id} value={cat.id}>
                                                                {getLangValue(cat.name, i18n.language)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="status">{t('admin.forum.status', 'Statut')}</Label>
                                                <Select 
                                                    value={watch('status')} 
                                                    onValueChange={(v: any) => setValue('status', v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="open">{t('admin.forum.statusOpen', 'Ouvert')}</SelectItem>
                                                        <SelectItem value="closed">{t('admin.forum.statusClosed', 'Fermé')}</SelectItem>
                                                        <SelectItem value="locked">{t('admin.forum.statusLocked', 'Verrouillé')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                            <TabsList className="grid grid-cols-4 w-full mb-4">
                                                <TabsTrigger value="fr">{t('common.french', 'Français')}</TabsTrigger>
                                                <TabsTrigger value="en">{t('common.english', 'English')}</TabsTrigger>
                                                <TabsTrigger value="pt">{t('common.portuguese', 'Português')}</TabsTrigger>
                                                <TabsTrigger value="ar">{t('common.arabic', 'العربية')}</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="fr" className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Label htmlFor="title">{t('admin.forum.title', 'Titre')}</Label>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={isTranslating}
                                                        className="gap-2 text-xs h-7"
                                                        onClick={async () => {
                                                            setIsTranslating(true);
                                                            try {
                                                                const titleVal = watch('title') as string;
                                                                if (titleVal) {
                                                                    const trans = await translateToFourLang('fr', titleVal);
                                                                    setExtraTranslations(prev => ({
                                                                        en: { ...prev.en, title: trans.en },
                                                                        pt: { ...prev.pt, title: trans.pt },
                                                                        ar: { ...prev.ar, title: trans.ar },
                                                                    }));
                                                                }
                                                                const contentVal = watch('content') as string;
                                                                if (contentVal) {
                                                                    const trans = await translateToFourLang('fr', contentVal);
                                                                    setExtraTranslations(prev => ({
                                                                        en: { ...prev.en, content: trans.en },
                                                                        pt: { ...prev.pt, content: trans.pt },
                                                                        ar: { ...prev.ar, content: trans.ar },
                                                                    }));
                                                                }
                                                                toast({ title: t('common.success') });
                                                            } catch (err) {
                                                                toast({ title: t('common.error'), variant: 'destructive' });
                                                            } finally {
                                                                setIsTranslating(false);
                                                            }
                                                        }}
                                                    >
                                                        {isTranslating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                                        {t('admin.autoTranslate', 'Traduire via IA')}
                                                    </Button>
                                                </div>
                                                <Input id="title" {...register('title', { required: true })} />
                                                
                                                <div className="space-y-2">
                                                    <Label htmlFor="content">{t('admin.forum.content', 'Contenu')}</Label>
                                                    <Textarea id="content" {...register('content', { required: true })} rows={5} />
                                                </div>
                                            </TabsContent>

                                            {['en', 'pt', 'ar'].map((lang) => (
                                                <TabsContent key={lang} value={lang} className="space-y-4">
                                                    <Label htmlFor={`trans-title-${lang}`}>{t('admin.forum.title', 'Titre')} ({lang.toUpperCase()})</Label>
                                                    <Input 
                                                        id={`trans-title-${lang}`} 
                                                        value={extraTranslations[lang]?.title || ''}
                                                        onChange={(e) => setExtraTranslations(prev => ({
                                                            ...prev,
                                                            [lang]: { ...prev[lang], title: e.target.value }
                                                        }))}
                                                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                                    />
                                                    
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`trans-content-${lang}`}>{t('admin.forum.content', 'Contenu')} ({lang.toUpperCase()})</Label>
                                                        <Textarea 
                                                            id={`trans-content-${lang}`} 
                                                            value={extraTranslations[lang]?.content || ''}
                                                            onChange={(e) => setExtraTranslations(prev => ({
                                                                ...prev,
                                                                [lang]: { ...prev[lang], content: e.target.value }
                                                            }))}
                                                            rows={5}
                                                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                                        />
                                                    </div>
                                                </TabsContent>
                                            ))}
                                        </Tabs>

                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                                {t('common.cancel')}
                                            </Button>
                                            <Button type="submit">
                                                {t('common.save')}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('admin.forum.searchPlaceholder', 'Rechercher par titre, auteur ou contenu...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder={t('admin.forum.filterByCategory', 'Filtrer par catégorie')} />
                            </SelectTrigger>
                            <SelectContent>
                                {categoriesForFilter.map(category => (
                                    <SelectItem key={category.id} value={category.id}>
                                        <div className="flex items-center gap-2">
                                            {category.id !== 'toutes' && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />}
                                            {category.id === 'toutes' ? category.name : getLangValue(category.name, i18n.language)}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder={t('admin.forum.filterByStatus', 'Filtrer par statut')} />
                            </SelectTrigger>
                            <SelectContent>
                                {TOPIC_STATUSES.map(status => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {t(status.label, status.label)}
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
                                {t('common.reset', 'Réinitialiser')}
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
                                                {t(column.label, column.label)}
                                                {sortField === column.key && (
                                                    sortOrder === 'asc' ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )
                                                )}
                                            </button>
                                        ) : (
                                            t(column.label, column.label)
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
                                            ? t('admin.forum.noResults', 'Aucun topic ne correspond aux critères de recherche')
                                            : t('admin.forum.noTopics', 'Aucun topic disponible')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                finalPaginatedTopics.map((topic) => (
                                    <TableRow key={topic.id} className="group hover:bg-muted/50">
                                        <TableCell className="font-medium max-w-[300px]">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate">{getLangValue(topic.title, i18n.language)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: topic.category?.color || '#ccc' }} />
                                                {getLangValue(topic.category?.name, i18n.language)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {topic.author?.avatar_url && (
                                                    <img
                                                        src={topic.author.avatar_url}
                                                        alt={topic.author.name}
                                                        className="h-6 w-6 rounded-full"
                                                    />
                                                )}
                                                <span>{topic.author?.name || t('admin.forum.systemUser', 'Système')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(topic.status)}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {topic.post_count} {topic.post_count > 1 ? t('admin.forum.posts', 'posts') : t('admin.forum.post', 'post')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(topic.created_at).toLocaleDateString(i18n.language, {
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
                                                    onClick={() => handleEdit(topic)}
                                                    title={t('common.edit', 'Modifier')}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleToggleLock(topic)}
                                                    title={topic.status === 'locked' ? t('admin.forum.unlock', 'Déverrouiller') : t('admin.forum.lock', 'Verrouiller')}
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
                                                    title={t('common.delete', 'Supprimer')}
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
                            <span>{t('admin.rowsPerPage', 'Lignes par page')}:</span>
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
                                {Math.min((currentPage - 1) * itemsPerPage + 1, finalFilteredTopics.length)}-{Math.min(currentPage * itemsPerPage, finalFilteredTopics.length)} {t('admin.of', 'sur')} {finalFilteredTopics.length}
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
