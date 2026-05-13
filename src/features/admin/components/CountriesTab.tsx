import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    ChevronDown,
    ChevronUp,
    Download,
    RefreshCw,
} from "lucide-react"
import {
    useCountries,
    useDeleteCountry,
} from "../hooks/useCountries"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { Country } from "../types"

type SortField =
    | "name_fr"
    | "region"
    | "capital"
    | "fsu_established"
    | "population"
type SortOrder = "asc" | "desc"

interface ColumnConfig {
    key: SortField
    labelKey: string
    defaultLabel: string
    sortable: boolean
}

const COLUMNS: ColumnConfig[] = [
    { key: "name_fr", labelKey: "admin.country", defaultLabel: "Pays", sortable: true },
    { key: "region", labelKey: "admin.region", defaultLabel: "Région", sortable: true },
    { key: "capital", labelKey: "admin.capital", defaultLabel: "Capitale", sortable: true },
    { key: "fsu_established", labelKey: "admin.fsu", defaultLabel: "FSU", sortable: true },
    { key: "population", labelKey: "admin.population", defaultLabel: "Population", sortable: true },
]

const REGIONS = [
    "CEDEAO",
    "CEEAC",
    "SADC",
    "EAC",
    "UMA",
    "IGAD",
    "CEN-SAD",
    "COMESA",
    "CEMAC",
]

export function CountriesTab() {
    const { data: countries = [], isLoading, refetch } = useCountries()
    const { hasRole } = useAuth()
    const isGlobalAdmin = hasRole("super_admin")
    const deleteCountry = useDeleteCountry()
    const { toast } = useToast()
    const { t } = useTranslation()
    const navigate = useNavigate()

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRegion, setSelectedRegion] = useState("all")
    const [sortField, setSortField] = useState<SortField>("name_fr")
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Filter and sort countries
    const filteredAndSortedCountries = useMemo(() => {
        let filtered = countries

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                c =>
                    c.name_fr?.toLowerCase().includes(query) ||
                    c.name_en?.toLowerCase().includes(query) ||
                    c.official_name?.toLowerCase().includes(query) ||
                    c.capital?.toLowerCase().includes(query) ||
                    c.code_iso?.toLowerCase().includes(query)
            )
        }

        // Apply region filter
        if (selectedRegion !== "all") {
            filtered = filtered.filter(c => c.region === selectedRegion)
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            const aValue = (a[sortField] || "").toString()
            const bValue = (b[sortField] || "").toString()

            if (sortOrder === "asc") {
                return aValue.localeCompare(bValue)
            } else {
                return bValue.localeCompare(aValue)
            }
        })

        return filtered
    }, [countries, searchQuery, selectedRegion, sortField, sortOrder])

    // Pagination
    const totalPages = Math.ceil(
        filteredAndSortedCountries.length / itemsPerPage
    )
    const paginatedCountries = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredAndSortedCountries.slice(
            startIndex,
            startIndex + itemsPerPage
        )
    }, [filteredAndSortedCountries, currentPage, itemsPerPage])

    // Stats
    const stats = useMemo(
        () => ({
            total: countries.length,
            filtered: filteredAndSortedCountries.length,
            withFsu: countries.filter(c => c.fsu_established).length,
            withCoordinator: countries.filter(c => c.fsu_coordinator_name)
                .length,
        }),
        [countries, filteredAndSortedCountries.length]
    )

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

    const openNew = () => {
        navigate('/admin/countries/new')
    }

    const openEdit = (c: Country) => {
        navigate(`/admin/countries/edit/${c.id}`)
    }

    const handleDelete = (id: string, name: string) => {
        if (!confirm(t('admin.deleteCountryConfirm', `Supprimer le pays "${name}" ?`))) return
        deleteCountry.mutate(id, {
            onSuccess: () => {
                toast({ title: t('admin.countryDeleted', "Pays supprimé avec succès") })
                refetch()
            },
            onError: () =>
                toast({
                    title: t("admin.deleteCountryError"),
                    variant: "destructive",
                }),
        })
    }

    const handleExport = () => {
        const csvContent = [
            [
                "Code ISO",
                "Nom FR",
                "Nom EN",
                "Nom Officiel",
                "Région",
                "Capital",
                "Population",
                "FSU Établi",
                "Budget FSU",
                "Coordinateur",
                "Email",
                "Téléphone",
            ].join(","),
            ...filteredAndSortedCountries.map(c =>
                [
                    c.code_iso,
                    `"${c.name_fr}"`,
                    `"${c.name_en}"`,
                    `"${c.official_name || ""}"`,
                    c.region,
                    `"${c.capital || ""}"`,
                    `"${c.population || ""}"`,
                    c.fsu_established || "",
                    `"${c.fsu_budget || ""}"`,
                    `"${c.fsu_coordinator_name || ""}"`,
                    c.fsu_coordinator_email || "",
                    `"${c.fsu_coordinator_phone || ""}"`,
                ].join(",")
            ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `pays-${new Date().toISOString().split("T")[0]}.csv`
        link.click()
    }

    const resetFilters = () => {
        setSearchQuery("")
        setSelectedRegion("all")
        setCurrentPage(1)
    }

    // Reset pagination when filters change
    useMemo(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedRegion, itemsPerPage])

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-slate-800">
                                {t('admin.countriesManagement', 'Gestion des Pays')}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {stats.total} {t('admin.totalCountries', 'pays au total')} • {stats.withFsu}{" "}
                                {t('admin.withFsu', 'avec FSU')} • {stats.withCoordinator} {t('admin.withCoordinator', 'avec coordinateur')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                className="bg-white"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {t('common.refresh', 'Actualiser')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                                className="bg-white"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                {t('common.export', 'Exporter')}
                            </Button>
                            {isGlobalAdmin && (
                                <Button size="sm" onClick={openNew} className="shadow-sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('admin.newCountry', 'Nouveau Pays')}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder={t('admin.searchCountriesPlaceholder', 'Rechercher par nom, capitale, code ISO...')}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white border-slate-200"
                            />
                        </div>
                        <Select
                            value={selectedRegion}
                            onValueChange={setSelectedRegion}
                        >
                            <SelectTrigger className="w-full sm:w-[200px] bg-white border-slate-200">
                                <SelectValue placeholder={t('admin.filterByRegion', 'Filtrer par région')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('common.all', 'Toutes')}</SelectItem>
                                {REGIONS.map(region => (
                                    <SelectItem key={region} value={region}>
                                        {region}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(searchQuery || selectedRegion !== "all") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                {t('common.reset', 'Réinitialiser')}
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="w-[60px]"></TableHead>
                                {COLUMNS.map(column => (
                                    <TableHead key={column.key} className="text-slate-600 font-semibold">
                                        {column.sortable ? (
                                            <button
                                                onClick={() =>
                                                    handleSort(column.key)
                                                }
                                                className="flex items-center gap-1 hover:text-primary transition-colors"
                                            >
                                                {t(column.labelKey, column.defaultLabel)}
                                                {sortField === column.key &&
                                                    (sortOrder === "asc" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ))}
                                            </button>
                                        ) : (
                                            t(column.labelKey, column.defaultLabel)
                                        )}
                                    </TableHead>
                                ))}
                                <TableHead className="w-[100px] text-right text-slate-600 font-semibold px-6">
                                    {t('common.actions', 'Actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCountries.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={COLUMNS.length + 2}
                                        className="text-center py-20 text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-10 w-10 text-slate-200" />
                                            <p>
                                                {searchQuery || selectedRegion !== "all"
                                                    ? t('admin.noCountriesFound', 'Aucun pays ne correspond aux critères de recherche')
                                                    : t('admin.noCountries', 'Aucun pays disponible')}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedCountries.map(c => (
                                    <TableRow
                                        key={c.id}
                                        className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                                        onClick={() => openEdit(c)}
                                    >
                                        <TableCell className="pl-6">
                                            {c.flag_url ? (
                                                <img
                                                    src={c.flag_url}
                                                    alt={c.name_fr}
                                                    className="w-10 h-7 object-cover rounded shadow-sm border border-slate-100"
                                                />
                                            ) : (
                                                <div className="w-10 h-7 bg-slate-100 rounded border border-slate-100 flex items-center justify-center">
                                                    <Globe className="h-4 w-4 text-slate-300" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700">
                                                    {t('common.language', 'fr') === 'en' ? c.name_en : c.name_fr}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider truncate max-w-[180px]">
                                                    {c.official_name || c.name_en}
                                                </span>
                                                <div className="mt-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] h-4 px-1.5 font-bold bg-slate-50 text-slate-500 border-slate-200"
                                                    >
                                                        {c.code_iso?.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-medium">
                                                {c.region}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">
                                            {c.capital || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {c.fsu_established ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700">
                                                        {c.fsu_established}
                                                    </span>
                                                    {c.fsu_budget && (
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {c.fsu_budget}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">
                                                    {t('common.notAvailable', 'Non défini')}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-medium text-slate-700">
                                                    {c.population || "-"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEdit(c)}
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                {isGlobalAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDelete(
                                                                c.id,
                                                                c.name_fr
                                                            )
                                                        }
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
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
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t pt-6">
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
                                    <SelectTrigger className="w-[70px] bg-white border-slate-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <span className="whitespace-nowrap">
                                {Math.min(
                                    (currentPage - 1) * itemsPerPage + 1,
                                    stats.filtered
                                )}
                                -
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    stats.filtered
                                )}{" "}
                                {t("common.of", "sur")} {stats.filtered}
                            </span>
                        </div>

                        <Pagination className="w-auto m-0">
                            <PaginationContent>
                                <PaginationPrevious
                                    onClick={() =>
                                        setCurrentPage(p => Math.max(1, p - 1))
                                    }
                                    className={
                                        currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                                
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const pageNum = i + 1
                                    if (
                                        pageNum === 1 ||
                                        pageNum === totalPages ||
                                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                    ) {
                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    isActive={currentPage === pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className="cursor-pointer"
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    } else if (
                                        pageNum === currentPage - 2 ||
                                        pageNum === currentPage + 2
                                    ) {
                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )
                                    }
                                    return null
                                })}

                                <PaginationNext
                                    onClick={() =>
                                        setCurrentPage(p =>
                                            Math.min(totalPages, p + 1)
                                        )
                                    }
                                    className={
                                        currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
