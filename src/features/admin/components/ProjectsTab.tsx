import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useProjects, useDeleteProject } from '../hooks/useContentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus, Search, ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react';
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

const REGIONS = ['Toutes', 'CEDEAO', 'SADC', 'EAC', 'CEEAC', 'UMA', 'COMESA', 'CEMAC', 'IGAD'];

interface Project {
    id: string;
    title: string;
    description: string;
    country_id: string;
    countries: { name_fr: string };
    region: string;
    status: string;
}

const COLUMNS: ColumnConfig<Project>[] = [
    { key: 'title', label: '', sortable: true },
    { key: 'countries', label: '', sortable: true },
    { key: 'region', label: '', sortable: true },
    { key: 'status', label: '', sortable: true },
];

const PROJECT_STATUSES = ['planned', 'in_progress', 'completed', 'suspended'];

const STATUS_LABELS: Record<string, string> = {
    planned: 'Planifié',
    in_progress: 'En cours',
    completed: 'Terminé',
    suspended: 'Suspendu',
};

export function ProjectsTab() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: projects = [], isLoading, refetch } = useProjects();
    const deleteProject = useDeleteProject();

    const [selectedRegion, setSelectedRegion] = useState('Toutes');
    const [selectedStatus, setSelectedStatus] = useState('tous');

    const {
        searchQuery,
        setSearchQuery,
        sortField,
        sortOrder,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        filteredAndSortedData,
        handleSort,
        resetFilters,
    } = useTableManagement<Project>({
        data: projects,
        columns: COLUMNS,
        initialSortField: 'title',
        initialSortOrder: 'asc',
        initialItemsPerPage: 10,
    });

    const finalFilteredProjects = useMemo(() => {
        let filtered = [...filteredAndSortedData];
        if (selectedRegion !== 'Toutes') {
            filtered = filtered.filter(p => p.region === selectedRegion);
        }
        if (selectedStatus !== 'tous') {
            filtered = filtered.filter(p => p.status === selectedStatus);
        }
        return filtered;
    }, [filteredAndSortedData, selectedRegion, selectedStatus]);

    const finalTotalPages = Math.ceil(finalFilteredProjects.length / itemsPerPage);
    const finalPaginatedProjects = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return finalFilteredProjects.slice(startIndex, startIndex + itemsPerPage);
    }, [finalFilteredProjects, currentPage, itemsPerPage]);

    const { handleExport } = useExportToCSV(finalFilteredProjects, COLUMNS, 'projets');

    const resetAllFilters = () => {
        setSelectedRegion('Toutes');
        setSelectedStatus('tous');
        resetFilters();
    };

    const handleEdit = (item: Project) => {
        navigate(`/admin/projects/${item.id}`);
    };

    const handleDelete = async (id: string) => {
        if (confirm(t('admin.confirmDelete'))) {
            await deleteProject.mutateAsync(id);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'secondary' | 'default' | 'success' | 'destructive'> = {
            planned: 'secondary',
            in_progress: 'default',
            completed: 'success',
            suspended: 'destructive',
        };
        return <Badge variant={variants[status] || 'outline'}>{t(STATUS_LABELS[status] || status)}</Badge>;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{t('admin.projectsManagement')}</CardTitle>
                            <CardDescription>{t('admin.projectsManagementDesc')}</CardDescription>
                            <p className="text-sm text-muted-foreground mt-1">
                                {t('admin.project.count', { count: finalFilteredProjects.length })}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {t('admin.project.refresh')}
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExport}>
                                <Download className="h-4 w-4 mr-2" />
                                {t('admin.project.export')}
                            </Button>
                            <Button onClick={() => navigate('/admin/project/new')} className="gap-2">
                                <Plus className="mr-2 h-4 w-4" />
                                {t('admin.project.add')}
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('admin.project.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder={t('admin.project.filterRegion')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Toutes">{t('admin.project.allRegions')}</SelectItem>
                                {REGIONS.filter(r => r !== 'Toutes').map(region => (
                                    <SelectItem key={region} value={region}>{region}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder={t('admin.project.filterStatus')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tous">{t('admin.project.allStatuses')}</SelectItem>
                                {PROJECT_STATUSES.map(status => (
                                    <SelectItem key={status} value={status}>{t(STATUS_LABELS[status])}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(searchQuery || selectedRegion !== 'Toutes' || selectedStatus !== 'tous') && (
                            <Button variant="ghost" size="sm" onClick={resetAllFilters}>
                                {t('admin.project.resetFilters')}
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
                                <TableHead>{t('admin.project.title')}</TableHead>
                                <TableHead>{t('admin.project.country')}</TableHead>
                                <TableHead>{t('admin.project.region')}</TableHead>
                                <TableHead>{t('admin.project.status')}</TableHead>
                                <TableHead className="text-right">{t('admin.project.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">{t('common.loading')}</TableCell>
                                </TableRow>
                            ) : finalPaginatedProjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        {t('admin.project.noProjects')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                finalPaginatedProjects.map((item) => (
                                    <TableRow key={item.id} className="group hover:bg-muted/50">
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.countries?.name_fr || '-'}</TableCell>
                                        <TableCell>{item.region || '-'}</TableCell>
                                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
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

                {finalTotalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{t('admin.project.rowsPerPage')}:</span>
                            <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(parseInt(v))}>
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                </SelectContent>
                            </Select>
                            <span>
                                {Math.min((currentPage - 1) * itemsPerPage + 1, finalFilteredProjects.length)}-{Math.min(currentPage * itemsPerPage, finalFilteredProjects.length)} {t('admin.project.of')} {finalFilteredProjects.length}
                            </span>
                        </div>
                        <Pagination>
                            <PaginationContent>
                                <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} />
                                {Array.from({ length: Math.min(5, finalTotalPages) }, (_, i) => {
                                    let pageNum = currentPage <= 3 ? i + 1 : currentPage >= finalTotalPages - 2 ? finalTotalPages - 4 + i : currentPage - 2 + i;
                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum} className="cursor-pointer">
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                                <PaginationNext onClick={() => setCurrentPage(p => Math.min(finalTotalPages, p + 1))} />
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}