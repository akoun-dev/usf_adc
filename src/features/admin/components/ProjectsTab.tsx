import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/useContentManagement';
import { useCountries } from '../hooks/useCountries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus, Search, ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react';
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

interface ProjectFormData {
  title: string;
  description: string;
  country_id: string;
  status: string;
  region: string;
}

const REGIONS = ['Toutes', 'CEDEAO', 'SADC', 'EAC', 'CEEAC', 'UMA', 'COMESA', 'CEMAC', 'IGAD'];
const PROJECT_STATUSES = ['planned', 'in_progress', 'completed', 'suspended'];

const COLUMNS: ColumnConfig<Project>[] = [
    { key: 'title', label: 'Titre', sortable: true },
    { key: 'countries', label: 'Pays', sortable: true },
    { key: 'region', label: 'Région', sortable: true },
    { key: 'status', label: 'Statut', sortable: true },
];

interface Project {
    id: string;
    title: string;
    description: string;
    countries: { name_fr: string };
    region: string;
    status: string;
}

export function ProjectsTab() {
  const { t } = useTranslation();
  const { data: projects = [], isLoading, refetch } = useProjects();
  const { data: countries = [] } = useCountries();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<ProjectFormData>();

  // Search and filter state
  const [selectedRegion, setSelectedRegion] = useState('Toutes');
  const [selectedStatus, setSelectedStatus] = useState('tous');

  // Use the table management hook
  const {
    searchQuery,
    setSearchQuery,
    sortField,
    sortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filteredAndSortedData: filteredAndSortedProjects,
    paginatedData: paginatedProjects,
    totalPages,
    handleSort,
    resetFilters: resetTableFilters,
  } = useTableManagement<Project>({
    data: projects,
    columns: COLUMNS,
    initialSortField: 'title',
    initialSortOrder: 'asc',
    initialItemsPerPage: 10,
  });

  // Additional filtering for region and status
  const finalFilteredProjects = useMemo(() => {
    let filtered = [...filteredAndSortedProjects];

    // Apply region filter
    if (selectedRegion !== 'Toutes') {
      filtered = filtered.filter(p => p.region === selectedRegion);
    }

    // Apply status filter
    if (selectedStatus !== 'tous') {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    return filtered;
  }, [filteredAndSortedProjects, selectedRegion, selectedStatus]);

  // Recalculate pagination with additional filters
  const finalTotalPages = Math.ceil(finalFilteredProjects.length / itemsPerPage);
  const finalPaginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return finalFilteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [finalFilteredProjects, currentPage, itemsPerPage]);

  const { handleExport } = useExportToCSV<Project>(finalFilteredProjects, COLUMNS, 'projets');

  const resetAllFilters = () => {
    setSelectedRegion('Toutes');
    setSelectedStatus('tous');
    resetTableFilters();
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (editingId) {
      await updateProject.mutateAsync({ id: editingId, ...data });
    } else {
      await createProject.mutateAsync(data);
    }
    reset();
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setValue('title', item.title);
    setValue('description', item.description || '');
    setValue('country_id', item.country_id || '');
    setValue('status', item.status || 'planned');
    setValue('region', item.region || '');
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ?'))) {
      await deleteProject.mutateAsync(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      planned: 'secondary',
      in_progress: 'default',
      completed: 'success',
      suspended: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status || '-'}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('admin.projectsManagement', 'Gestion des projets')}</CardTitle>
              <CardDescription>{t('admin.projectsManagementDesc', 'Gérer les projets FSU')}</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">
                {finalFilteredProjects.length} projets {projects.length > finalFilteredProjects.length && `sur ${projects.length}`}
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
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { reset(); setEditingId(null); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('common.add', 'Ajouter')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? t('admin.editProject', 'Modifier un projet') : t('admin.createProject', 'Créer un projet')}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="title">{t('project.title', 'Titre du projet')}</Label>
                      <Input id="title" {...register('title', { required: true })} />
                    </div>
                    <div>
                      <Label htmlFor="description">{t('project.description', 'Description')}</Label>
                      <Textarea id="description" {...register('description')} rows={4} />
                    </div>
                    <div>
                      <Label htmlFor="country_id">{t('project.country', 'Pays')}</Label>
                      <Select onValueChange={(v) => setValue('country_id', v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner un pays" /></SelectTrigger>
                        <SelectContent>
                          {countries?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name_fr}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="region">{t('project.region', 'Région')}</Label>
                        <Select onValueChange={(v) => setValue('region', v)}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            {REGIONS.filter(r => r !== 'Toutes').map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">{t('project.status', 'Statut')}</Label>
                        <Select onValueChange={(v) => setValue('status', v)}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            {PROJECT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                        {t('common.cancel', 'Annuler')}
                      </Button>
                      <Button type="submit" disabled={createProject.isPending || updateProject.isPending}>
                        {t('common.save', 'Enregistrer')}
                      </Button>
                    </div>
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
                placeholder="Rechercher par titre, pays, région ou statut..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par région" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                {PROJECT_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchQuery || selectedRegion !== 'Toutes' || selectedStatus !== 'tous') && (
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
                  <TableHead key={column.key}>
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.key)}
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
                <TableRow><TableCell colSpan={5}>{t('common.loading', 'Chargement...')}</TableCell></TableRow>
              ) : finalPaginatedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    {searchQuery || selectedRegion !== 'Toutes' || selectedStatus !== 'tous'
                      ? "Aucun projet ne correspond aux critères de recherche"
                      : "Aucun projet disponible"}
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
                {Math.min((currentPage - 1) * itemsPerPage + 1, finalFilteredProjects.length)}-{Math.min(currentPage * itemsPerPage, finalFilteredProjects.length)} sur {finalFilteredProjects.length}
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
