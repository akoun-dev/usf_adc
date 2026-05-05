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
import { Pencil, Trash2, Plus, Search, Handshake, Building2, Check, X, RefreshCw, Download, ChevronUp, ChevronDown } from 'lucide-react';
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
import { usePartners, useCreatePartner, useUpdatePartner, useDeletePartner } from '../hooks/useContentManagement';
import { useCountries } from '../hooks/useCountries';
import type { Partner } from '../services/admin-service';

const PARTNER_TYPES = [
    { value: 'institutionnel', label: 'Institutionnel' },
    { value: 'prive', label: 'Privé' },
    { value: 'ong', label: 'ONG' },
    { value: 'international', label: 'International' },
];

const COLUMNS: ColumnConfig<Partner>[] = [
    { key: 'logo_url', label: 'Logo', sortable: false, className: 'w-[60px] p-2' },
    { key: 'nom', label: 'Nom', sortable: true, className: 'min-w-[200px]' },
    { key: 'type', label: 'Type', sortable: true, className: 'w-[120px]' },
    { key: 'countries', label: 'Pays', sortable: true, className: 'w-[150px]' },
    { key: 'domaine', label: 'Domaine', sortable: true, className: 'w-[150px]' },
    { key: 'est_actif', label: 'Statut', sortable: true, className: 'w-[100px] text-center' },
];

export function PartnersTab() {
    const { t } = useTranslation();
    const { data: partners = [], isLoading, refetch } = usePartners();
    const { data: countries = [] } = useCountries();
    const createPartner = useCreatePartner();
    const updatePartner = useUpdatePartner();
    const deletePartner = useDeletePartner();

    // Dialog state
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { register, handleSubmit, reset, setValue, watch } = useForm<Partner>();

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
        filteredAndSortedData: filteredPartners,
        paginatedData: paginatedPartners,
        totalPages,
        handleSort,
        resetFilters: resetTableFilters,
    } = useTableManagement<Partner>({
        data: partners,
        columns: COLUMNS,
        initialSortField: 'nom',
        initialSortOrder: 'asc',
        initialItemsPerPage: 10,
    });

    // Additional filtering
    const finalFilteredPartners = useMemo(() => {
        let filtered = [...filteredPartners];

        // Filter by type
        if (selectedType !== 'tous') {
            filtered = filtered.filter(partner => partner.type === selectedType);
        }

        // Filter by country
        if (selectedCountry !== 'tous') {
            filtered = filtered.filter(partner => partner.pays_id === selectedCountry);
        }

        // Filter by active status
        if (activeOnly) {
            filtered = filtered.filter(partner => partner.est_actif);
        }

        return filtered;
    }, [filteredPartners, selectedType, selectedCountry, activeOnly]);

    // Recalculate pagination
    const finalTotalPages = Math.ceil(finalFilteredPartners.length / itemsPerPage);
    const finalPaginatedPartners = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return finalFilteredPartners.slice(startIndex, startIndex + itemsPerPage);
    }, [finalFilteredPartners, currentPage, itemsPerPage]);

    const { handleExport } = useExportToCSV<Partner>(finalFilteredPartners, COLUMNS, 'partenaires');

    const onSubmit = async (data: Partner & { logo_file?: File; logo_preview?: string }) => {
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
            
            console.log('Submitting partner data:', submissionData);
            
            if (editingId) {
                await updatePartner.mutateAsync({ id: editingId, ...submissionData });
            } else {
                await createPartner.mutateAsync(submissionData);
            }
            reset();
            setEditingId(null);
            setIsOpen(false);
            refetch();
        } catch (error) {
            console.error('Error saving partner:', error);
        }
    };

    const handleEdit = (partner: Partner) => {
        setEditingId(partner.id);
        setValue('nom', partner.nom);
        setValue('nom_complet', partner.nom_complet || '');
        setValue('pays_id', partner.pays_id || '');
        setValue('type', partner.type);
        setValue('domaine', partner.domaine || '');
        setValue('depuis', partner.depuis || '');
        setValue('site_web', partner.site_web || '');
        setValue('description', partner.description || '');
        setValue('email_contact', partner.email_contact || '');
        setValue('telephone_contact', partner.telephone_contact || '');
        setValue('adresse', partner.adresse || '');
        setValue('est_actif', partner.est_actif || true);
        setValue('logo_url', partner.logo_url || '');
        setIsOpen(true);
    };

    const handleDelete = async (id: string, nom: string) => {
        if (confirm(`Supprimer le partenaire "${nom}" ? Cette action est irréversible.`)) {
            try {
                await deletePartner.mutateAsync(id);
                refetch();
            } catch (error) {
                console.error('Error deleting partner:', error);
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
            institutionnel: 'Institutionnel',
            prive: 'Privé',
            ong: 'ONG',
            international: 'International',
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
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0 pb-6">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{t('admin.partners', 'Partenaires')}</CardTitle>
                            <CardDescription>{t('admin.partnersDesc', 'Gestion des organisations partenaires')}</CardDescription>
                            <p className="text-sm text-muted-foreground mt-1">
                                {finalFilteredPartners.length} partenaires {partners.length > finalFilteredPartners.length && `sur ${partners.length}`}
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
                                            {editingId ? t('admin.editPartner', 'Modifier un partenaire') : t('admin.createPartner', 'Créer un partenaire')}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="nom">{t('partner.name', 'Nom')}</Label>
                                                <Input id="nom" {...register('nom', { required: true })} />
                                            </div>
                                            <div>
                                                <Label htmlFor="nom_complet">{t('partner.fullName', 'Nom complet')}</Label>
                                                <Input id="nom_complet" {...register('nom_complet')} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="type">{t('partner.type', 'Type')}</Label>
                                                <Select onValueChange={(v) => setValue('type', v as any)} value={watch('type')}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {PARTNER_TYPES.map(type => (
                                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="pays_id">{t('partner.country', 'Pays')}</Label>
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
                                                <Label htmlFor="domaine">{t('partner.domain', 'Domaine')}</Label>
                                                <Input id="domaine" {...register('domaine')} />
                                            </div>
                                            <div>
                                                <Label htmlFor="depuis">{t('partner.since', 'Partenaire depuis')}</Label>
                                                <Input id="depuis" {...register('depuis')} />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="site_web">{t('partner.website', 'Site web')}</Label>
                                            <Input id="site_web" {...register('site_web')} placeholder="https://..." />
                                        </div>

                                        <div>
                                            <Label htmlFor="logo_file">{t('partner.logo', 'Logo')}</Label>
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
                                            <Label htmlFor="description">{t('partner.description', 'Description')}</Label>
                                            <Textarea id="description" {...register('description')} rows={4} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="email_contact">{t('partner.email', 'Email')}</Label>
                                                <Input id="email_contact" type="email" {...register('email_contact')} />
                                            </div>
                                            <div>
                                                <Label htmlFor="telephone_contact">{t('partner.phone', 'Téléphone')}</Label>
                                                <Input id="telephone_contact" {...register('telephone_contact')} />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="adresse">{t('partner.address', 'Adresse')}</Label>
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
                                                {t('partner.active', 'Partenaire actif')}
                                            </Label>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-4 border-t">
                                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                                {t('common.cancel', 'Annuler')}
                                            </Button>
                                            <Button type="submit" disabled={createPartner.isPending || updatePartner.isPending}>
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
                                placeholder="Rechercher par nom, domaine ou description..."
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
                                {PARTNER_TYPES.map(type => (
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
            <CardContent className="px-0">
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                {COLUMNS.map(column => (
                                    <TableHead key={String(column.key)} className={column.className}>
                                        {column.sortable ? (
                                            <button
                                                onClick={() => handleSort(column.key as keyof Partner)}
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
                            ) : finalPaginatedPartners.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        {searchQuery || selectedType !== 'tous' || selectedCountry !== 'tous' || !activeOnly
                                            ? "Aucun partenaire ne correspond aux critères de recherche"
                                            : "Aucun partenaire disponible"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                finalPaginatedPartners.map((partner) => (
                                    <TableRow key={partner.id} className="group hover:bg-muted/50">
                                        <TableCell className="w-16 p-2">
                                            {partner.logo_url ? (
                                                <img
                                                    src={partner.logo_url}
                                                    alt={`${partner.nom} logo`}
                                                    className="h-10 w-auto max-w-[40px] max-h-[40px] object-contain mx-auto"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                                                    <Handshake className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Handshake className="h-4 w-4 text-muted-foreground" />
                                                {partner.nom}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {getTypeBadge(partner.type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {partner.countries ? (
                                                <div className="flex items-center gap-2">
                                                    {partner.countries.flag_url && (
                                                        <img
                                                            src={partner.countries.flag_url}
                                                            alt={partner.countries.name_fr}
                                                            className="h-4 w-auto"
                                                        />
                                                    )}
                                                    {partner.countries.name_fr}
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>{partner.domaine || '-'}</TableCell>
                                        <TableCell className="text-center">{getStatusBadge(partner.est_actif || true)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleEdit(partner)}
                                                    title="Modifier"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(partner.id, partner.nom)}
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
                                {Math.min((currentPage - 1) * itemsPerPage + 1, finalFilteredPartners.length)}-{Math.min(currentPage * itemsPerPage, finalFilteredPartners.length)} sur {finalFilteredPartners.length}
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
