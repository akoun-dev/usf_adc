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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Search, Users, Building2, Check, X, RefreshCw, Download, ChevronUp, ChevronDown } from 'lucide-react';
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
import { useAssociatedMembers, useCreateAssociatedMember, useUpdateAssociatedMember, useDeleteAssociatedMember } from '../hooks/useContentManagement';
import { useCountries } from '../hooks/useCountries';
import type { AssociatedMember } from '../services/admin-service';

const MEMBER_TYPES = [
    { value: 'agence', label: 'Agence' },
    { value: 'operateur', label: 'Opérateur' },
    { value: 'institution', label: 'Institution' },
    { value: 'association', label: 'Association' },
];

const COLUMNS: ColumnConfig<AssociatedMember>[] = [
    { key: 'logo_url', label: 'Logo', sortable: false, className: 'w-[60px] p-2' },
    { key: 'nom', label: 'Nom', sortable: true, className: 'min-w-[200px]' },
    { key: 'type', label: 'Type', sortable: true, className: 'w-[120px]' },
    { key: 'countries', label: 'Pays', sortable: true, className: 'w-[150px]' },
    { key: 'secteur', label: 'Secteur', sortable: true, className: 'w-[150px]' },
    { key: 'est_actif', label: 'Statut', sortable: true, className: 'w-[100px] text-center' },
];

export function MembersTab() {
    const { t } = useTranslation();
    const { data: members = [], isLoading, refetch } = useAssociatedMembers();
    const { data: countries = [] } = useCountries();
    const createMember = useCreateAssociatedMember();
    const updateMember = useUpdateAssociatedMember();
    const deleteMember = useDeleteAssociatedMember();

    // Dialog state
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { register, handleSubmit, reset, setValue, watch } = useForm<AssociatedMember>();

    // Filter state
    const [selectedType, setSelectedType] = useState('tous');
    const [selectedCountry, setSelectedCountry] = useState('tous');
    const [activeOnly, setActiveOnly] = useState(true);

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
        filteredAndSortedData: filteredMembers,
        paginatedData: paginatedMembers,
        totalPages,
        handleSort,
        resetFilters: resetTableFilters,
    } = useTableManagement<AssociatedMember>({
        data: members,
        columns: COLUMNS,
        initialSortField: 'nom',
        initialSortOrder: 'asc',
        initialItemsPerPage: 10,
    });

    // Additional filtering
    const finalFilteredMembers = useMemo(() => {
        let filtered = [...filteredMembers];

        // Filter by type
        if (selectedType !== 'tous') {
            filtered = filtered.filter(member => member.type === selectedType);
        }

        // Filter by country
        if (selectedCountry !== 'tous') {
            filtered = filtered.filter(member => member.pays_id === selectedCountry);
        }

        // Filter by active status
        if (activeOnly) {
            filtered = filtered.filter(member => member.est_actif);
        }

        return filtered;
    }, [filteredMembers, selectedType, selectedCountry, activeOnly]);

    // Recalculate pagination
    const finalTotalPages = Math.ceil(finalFilteredMembers.length / itemsPerPage);
    const finalPaginatedMembers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return finalFilteredMembers.slice(startIndex, startIndex + itemsPerPage);
    }, [finalFilteredMembers, currentPage, itemsPerPage]);

    const { handleExport } = useExportToCSV<AssociatedMember>(finalFilteredMembers, COLUMNS, 'membres-associes');

    const onSubmit = async (data: AssociatedMember & { logo_file?: File; logo_preview?: string }) => {
        try {
            // Remove logo_preview from submission data as it's only for UI preview
            const { logo_preview, ...submissionData } = data;
            
            // Clean up empty string values that should be null for UUID fields
            if (submissionData.pays_id === '' || submissionData.pays_id === undefined) {
                submissionData.pays_id = null;
            }
            
            // Ensure boolean values are properly set
            submissionData.est_actif = submissionData.est_actif ?? true;
            
            // Handle logo file upload
            if (data.logo_file) {
                submissionData.logo_file = data.logo_file;
            }
            
            console.log('Submitting data:', submissionData);
            
            if (editingId) {
                await updateMember.mutateAsync({ id: editingId, ...submissionData });
            } else {
                await createMember.mutateAsync(submissionData);
            }
            reset();
            setEditingId(null);
            setIsOpen(false);
            refetch();
        } catch (error) {
            console.error('Error saving member:', error);
        }
    };

    const handleEdit = (member: AssociatedMember) => {
        setEditingId(member.id);
        setValue('nom', member.nom);
        setValue('nom_complet', member.nom_complet || '');
        setValue('pays_id', member.pays_id || '');
        setValue('type', member.type);
        setValue('secteur', member.secteur || '');
        setValue('depuis', member.depuis || '');
        setValue('site_web', member.site_web || '');
        setValue('description', member.description || '');
        setValue('email_contact', member.email_contact || '');
        setValue('telephone_contact', member.telephone_contact || '');
        setValue('adresse', member.adresse || '');
        setValue('est_actif', member.est_actif || true);
        setValue('logo_url', member.logo_url || '');
        setIsOpen(true);
    };

    const handleDelete = async (id: string, nom: string) => {
        if (confirm(`Supprimer le membre "${nom}" ? Cette action est irréversible.`)) {
            try {
                await deleteMember.mutateAsync(id);
                refetch();
            } catch (error) {
                console.error('Error deleting member:', error);
            }
        }
    };

    const getStatusBadge = (isActive: boolean) => {
        return (
            <Badge variant={isActive ? 'default' : 'secondary'}>
                {isActive ? 'Actif' : 'Inactif'}
            </Badge>
        );
    };

    const getTypeBadge = (type: string) => {
        const typeLabels: Record<string, string> = {
            agence: 'Agence',
            operateur: 'Opérateur',
            institution: 'Institution',
            association: 'Association',
        };
        return typeLabels[type] || type;
    };

    const resetAllFilters = () => {
        setSelectedType('tous');
        setSelectedCountry('tous');
        setActiveOnly(true);
        resetTableFilters();
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{t('admin.associatedMembers', 'Membres Associés')}</CardTitle>
                            <CardDescription>{t('admin.associatedMembersDesc', 'Gestion des membres associés et organisations partenaires')}</CardDescription>
                            <p className="text-sm text-muted-foreground mt-1">
                                {finalFilteredMembers.length} membres {members.length > finalFilteredMembers.length && `sur ${members.length}`}
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
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingId ? t('admin.editMember', 'Modifier un membre') : t('admin.createMember', 'Créer un membre')}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="nom">{t('member.name', 'Nom')}</Label>
                                                <Input id="nom" {...register('nom', { required: true })} />
                                            </div>
                                            <div>
                                                <Label htmlFor="nom_complet">{t('member.fullName', 'Nom complet')}</Label>
                                                <Input id="nom_complet" {...register('nom_complet')} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="type">{t('member.type', 'Type')}</Label>
                                                <Select onValueChange={(v) => setValue('type', v as any)} value={watch('type')}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {MEMBER_TYPES.map(type => (
                                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="pays_id">{t('member.country', 'Pays')}</Label>
                                                <Select onValueChange={(v) => setValue('pays_id', v)} value={watch('pays_id')}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un pays" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {countries.map(country => (
                                                            <SelectItem key={country.id} value={country.id}>
                                                                <div className="flex items-center gap-2">
                                                                    {country.flag_url && <img src={country.flag_url} alt={country.name_fr} className="h-4 w-auto" />}
                                                                    {country.name_fr}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="secteur">{t('member.sector', 'Secteur')}</Label>
                                                <Input id="secteur" {...register('secteur')} />
                                            </div>
                                            <div>
                                                <Label htmlFor="depuis">{t('member.since', 'Membre depuis')}</Label>
                                                <Input id="depuis" {...register('depuis')} />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="site_web">{t('member.website', 'Site web')}</Label>
                                            <Input id="site_web" {...register('site_web')} placeholder="https://..." />
                                        </div>

                                        <div>
                                            <Label htmlFor="logo_file">{t('member.logo', 'Logo')}</Label>
                                            <Input id="logo_file" type="file" accept="image/*" 
                                                   onChange={(e) => {
                                                       const file = e.target.files?.[0];
                                                       if (file) {
                                                           const reader = new FileReader();
                                                           reader.onload = (event) => {
                                                               setValue('logo_preview', event.target?.result as string);
                                                           };
                                                           reader.readAsDataURL(file);
                                                           setValue('logo_file', file);
                                                       }
                                                   }}
                                            />
                                            {watch('logo_preview') && (
                                                <div className="mt-2">
                                                    <img src={watch('logo_preview')} alt="Logo preview" className="h-16 w-auto max-h-[64px] object-contain border rounded" />
                                                </div>
                                            )}
                                            {watch('logo_url') && !watch('logo_preview') && (
                                                <div className="mt-2">
                                                    <img src={watch('logo_url')} alt="Current logo" className="h-16 w-auto max-h-[64px] object-contain border rounded" />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="description">{t('member.description', 'Description')}</Label>
                                            <Textarea id="description" {...register('description')} rows={4} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="email_contact">{t('member.email', 'Email')}</Label>
                                                <Input id="email_contact" type="email" {...register('email_contact')} />
                                            </div>
                                            <div>
                                                <Label htmlFor="telephone_contact">{t('member.phone', 'Téléphone')}</Label>
                                                <Input id="telephone_contact" {...register('telephone_contact')} />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="adresse">{t('member.address', 'Adresse')}</Label>
                                            <Textarea id="adresse" {...register('adresse')} rows={2} />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                id="est_actif"
                                                type="checkbox"
                                                {...register('est_actif')}
                                                className="h-4 w-4"
                                            />
                                            <Label htmlFor="est_actif" className="cursor-pointer">
                                                {t('member.active', 'Membre actif')}
                                            </Label>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-4 border-t">
                                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                                {t('common.cancel', 'Annuler')}
                                            </Button>
                                            <Button type="submit" disabled={createMember.isPending || updateMember.isPending}>
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
                                placeholder="Rechercher par nom, secteur ou description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filtrer par type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tous">Tous les types</SelectItem>
                                {MEMBER_TYPES.map(type => (
                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filtrer par pays" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tous">Tous les pays</SelectItem>
                                {countries.map(country => (
                                    <SelectItem key={country.id} value={country.id}>
                                        <div className="flex items-center gap-2">
                                            {country.flag_url && <img src={country.flag_url} alt={country.name_fr} className="h-4 w-auto" />}
                                            {country.name_fr}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                            <input
                                id="activeOnly"
                                type="checkbox"
                                checked={activeOnly}
                                onChange={(e) => setActiveOnly(e.target.checked)}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="activeOnly" className="text-sm cursor-pointer">
                                Actifs uniquement
                            </Label>
                        </div>
                        {(searchQuery || selectedType !== 'tous' || selectedCountry !== 'tous' || !activeOnly) && (
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
                <div className="rounded-md border overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                {COLUMNS.map(column => (
                                    <TableHead key={String(column.key)} className={column.className}>
                                        {column.sortable ? (
                                            <button
                                                onClick={() => handleSort(column.key as keyof AssociatedMember)}
                                                className="flex items-center gap-1 hover:text-foreground transition-colors w-full justify-between"
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
                                    <TableCell colSpan={6} className="text-center py-12">
                                        {t('common.loading', 'Chargement...')}
                                    </TableCell>
                                </TableRow>
                            ) : finalPaginatedMembers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        {searchQuery || selectedType !== 'tous' || selectedCountry !== 'tous' || !activeOnly
                                            ? "Aucun membre ne correspond aux critères de recherche"
                                            : "Aucun membre disponible"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                finalPaginatedMembers.map((member) => (
                                    <TableRow key={member.id} className="group hover:bg-muted/50">
                                        <TableCell className="w-16 p-2">
                                            {member.logo_url ? (
                                                <img
                                                    src={member.logo_url}
                                                    alt={`${member.nom} logo`}
                                                    className="h-10 w-auto max-w-[40px] max-h-[40px] object-contain mx-auto"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                                                    <Building2 className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                {member.nom}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {getTypeBadge(member.type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {member.countries ? (
                                                <div className="flex items-center gap-2">
                                                    {member.countries.flag_url && (
                                                        <img
                                                            src={member.countries.flag_url}
                                                            alt={member.countries.name_fr}
                                                            className="h-4 w-auto"
                                                        />
                                                    )}
                                                    {member.countries.name_fr}
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>{member.secteur || '-'}</TableCell>
                                        <TableCell className="text-center">{getStatusBadge(member.est_actif || true)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleEdit(member)}
                                                    title="Modifier"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(member.id, member.nom)}
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
                                {Math.min((currentPage - 1) * itemsPerPage + 1, finalFilteredMembers.length)}-{Math.min(currentPage * itemsPerPage, finalFilteredMembers.length)} sur {finalFilteredMembers.length}
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
