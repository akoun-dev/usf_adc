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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
    useCreateCountry,
    useUpdateCountry,
    useDeleteCountry,
} from "../hooks/useCountries"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { CountryLogoUpload } from "./CountryLogoUpload"
import type { Country } from "../types"

const REGIONS = [
    "Toutes",
    "CEDEAO",
    "CEEAC",
    "SADC",
    "EAC",
    "UMA",
    "IGAD",
    "CEN-SAD",
    "COMESA",
]

type SortField =
    | "name_fr"
    | "region"
    | "capital"
    | "fsu_established"
    | "population"
type SortOrder = "asc" | "desc"

interface ColumnConfig {
    key: SortField
    label: string
    sortable: boolean
}

const COLUMNS: ColumnConfig[] = [
    { key: "name_fr", label: "Pays", sortable: true },
    { key: "region", label: "Région", sortable: true },
    { key: "capital", label: "Capital", sortable: true },
    { key: "fsu_established", label: "FSU", sortable: true },
    { key: "population", label: "Population", sortable: true },
]

export function CountriesTab() {
    const { data: countries = [], isLoading, refetch } = useCountries()
    const { hasRole } = useAuth()
    const isGlobalAdmin = hasRole("super_admin")
    const createCountry = useCreateCountry()
    const updateCountry = useUpdateCountry()
    const deleteCountry = useDeleteCountry()
    const { toast } = useToast()
    const { t } = useTranslation()

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRegion, setSelectedRegion] = useState("Toutes")
    const [sortField, setSortField] = useState<SortField>("name_fr")
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Dialog state
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<Country | null>(null)
    const [form, setForm] = useState({
        name_fr: "",
        name_en: "",
        code_iso: "",
        region: "",
        official_name: "",
        flag_url: "",
        description: "",
        population: "",
        capital: "",
        fsu_established: "",
        fsu_budget: "",
        fsu_coordinator_name: "",
        fsu_coordinator_email: "",
        fsu_coordinator_phone: "",
        logo_path: "",
    })

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
        if (selectedRegion !== "Toutes") {
            filtered = filtered.filter(c => c.region === selectedRegion)
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            const aValue = a[sortField] || ""
            const bValue = b[sortField] || ""

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
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
        setEditing(null)
        setForm({
            name_fr: "",
            name_en: "",
            code_iso: "",
            region: "",
            official_name: "",
            flag_url: "",
            description: "",
            population: "",
            capital: "",
            fsu_established: "",
            fsu_budget: "",
            fsu_coordinator_name: "",
            fsu_coordinator_email: "",
            fsu_coordinator_phone: "",
            logo_path: "",
        })
        setOpen(true)
    }

    const openEdit = (c: Country) => {
        setEditing(c)
        setForm({
            name_fr: c.name_fr || "",
            name_en: c.name_en || "",
            code_iso: c.code_iso || "",
            region: c.region || "",
            official_name: c.official_name || "",
            flag_url: c.flag_url || "",
            description: c.description || "",
            population: c.population || "",
            capital: c.capital || "",
            fsu_established: c.fsu_established || "",
            fsu_budget: c.fsu_budget || "",
            fsu_coordinator_name: c.fsu_coordinator_name || "",
            fsu_coordinator_email: c.fsu_coordinator_email || "",
            fsu_coordinator_phone: c.fsu_coordinator_phone || "",
            logo_path: c.logo_path || "",
        })
        setOpen(true)
    }

    const handleSubmit = () => {
        const payload = {
            ...form,
            code_iso: form.code_iso.toUpperCase().slice(0, 2),
        }
        if (editing) {
            updateCountry.mutate(
                { id: editing.id, ...payload },
                {
                    onSuccess: () => {
                        setOpen(false)
                        toast({ title: t("admin.countryUpdated") })
                        refetch()
                    },
                    onError: () =>
                        toast({
                            title: t("common.error"),
                            variant: "destructive",
                        }),
                }
            )
        } else {
            createCountry.mutate(payload, {
                onSuccess: () => {
                    setOpen(false)
                    toast({ title: t("admin.countryAdded") })
                    refetch()
                },
                onError: () =>
                    toast({ title: t("common.error"), variant: "destructive" }),
            })
        }
    }

    const handleDelete = (id: string, name: string) => {
        if (!confirm(`Supprimer le pays "${name}" ?`)) return
        deleteCountry.mutate(id, {
            onSuccess: () => {
                toast({ title: "Pays supprimé avec succès" })
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
        setSelectedRegion("Toutes")
        setCurrentPage(1)
    }

    // Reset pagination when filters change
    useMemo(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedRegion, itemsPerPage])

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">
                                Gestion des Pays
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {stats.total} pays au total • {stats.withFsu}{" "}
                                avec FSU • {stats.withCoordinator} avec
                                coordinateur
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
                            {isGlobalAdmin && (
                                <Button size="sm" onClick={openNew}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nouveau Pays
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom, capital, code ISO..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={selectedRegion}
                            onValueChange={setSelectedRegion}
                        >
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
                        {(searchQuery || selectedRegion !== "Toutes") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                            >
                                Réinitialiser
                            </Button>
                        )}
                    </div>

                    {/* Results info */}
                    {stats.filtered !== stats.total && (
                        <div className="text-sm text-muted-foreground">
                            Affichage de {stats.filtered} pays sur {stats.total}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                {COLUMNS.map(column => (
                                    <TableHead key={column.key}>
                                        {column.sortable ? (
                                            <button
                                                onClick={() =>
                                                    handleSort(column.key)
                                                }
                                                className="flex items-center gap-1 hover:text-foreground transition-colors"
                                            >
                                                {column.label}
                                                {sortField === column.key &&
                                                    (sortOrder === "asc" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ))}
                                            </button>
                                        ) : (
                                            column.label
                                        )}
                                    </TableHead>
                                ))}
                                {isGlobalAdmin && (
                                    <TableHead className="w-[100px] text-right">
                                        Actions
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCountries.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            COLUMNS.length +
                                            (isGlobalAdmin ? 2 : 1)
                                        }
                                        className="text-center py-12 text-muted-foreground"
                                    >
                                        {searchQuery ||
                                        selectedRegion !== "Toutes"
                                            ? "Aucun pays ne correspond aux critères de recherche"
                                            : "Aucun pays disponible"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedCountries.map(c => (
                                    <TableRow
                                        key={c.id}
                                        className="group hover:bg-muted/50"
                                    >
                                        <TableCell>
                                            {c.flag_url && (
                                                <img
                                                    src={c.flag_url}
                                                    alt={c.name_fr}
                                                    className="w-8 h-auto rounded shadow-sm"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {c.name_fr}
                                                </div>
                                                {c.official_name && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {c.official_name}
                                                    </div>
                                                )}
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs mt-1"
                                                >
                                                    {c.code_iso?.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {c.region}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {c.capital || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {c.fsu_established ? (
                                                <div className="text-sm">
                                                    <span className="font-medium">
                                                        Depuis{" "}
                                                        {c.fsu_established}
                                                    </span>
                                                    {c.fsu_budget && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {c.fsu_budget}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">
                                                    Non défini
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {c.fsu_coordinator_name ? (
                                                <div className="text-sm">
                                                    <div className="font-medium">
                                                        {c.fsu_coordinator_name}
                                                    </div>
                                                    {c.fsu_coordinator_email && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {
                                                                c.fsu_coordinator_email
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">
                                                    Non défini
                                                </span>
                                            )}
                                        </TableCell>
                                        {isGlobalAdmin && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openEdit(c)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDelete(
                                                                c.id,
                                                                c.name_fr
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Lignes par page:</span>
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={v =>
                                    setItemsPerPage(parseInt(v))
                                }
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
                                {Math.min(
                                    (currentPage - 1) * itemsPerPage + 1,
                                    stats.filtered
                                )}
                                -
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    stats.filtered
                                )}{" "}
                                sur {stats.filtered}
                            </span>
                        </div>

                        <Pagination>
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

                                {Array.from(
                                    { length: Math.min(5, totalPages) },
                                    (_, i) => {
                                        let pageNum
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1
                                        } else if (
                                            currentPage >=
                                            totalPages - 2
                                        ) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = currentPage - 2 + i
                                        }

                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    onClick={() =>
                                                        setCurrentPage(pageNum)
                                                    }
                                                    isActive={
                                                        currentPage === pageNum
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    }
                                )}

                                {totalPages > 5 &&
                                    currentPage < totalPages - 2 && (
                                        <PaginationEllipsis />
                                    )}

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

            {/* Edit/Create Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editing
                                ? `Modifier: ${editing.name_fr}`
                                : "Ajouter un nouveau pays"}
                        </DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="basic" className="pt-2">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="basic">
                                Informations de base
                            </TabsTrigger>
                            <TabsTrigger value="fsu">FSU</TabsTrigger>
                            <TabsTrigger value="contact">Contact</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Nom français *</Label>
                                    <Input
                                        value={form.name_fr}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                name_fr: e.target.value,
                                            })
                                        }
                                        placeholder="ex: Afrique du Sud"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Nom anglais *</Label>
                                    <Input
                                        value={form.name_en}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                name_en: e.target.value,
                                            })
                                        }
                                        placeholder="ex: South Africa"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label>Nom officiel</Label>
                                <Input
                                    value={form.official_name}
                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            official_name: e.target.value,
                                        })
                                    }
                                    placeholder="ex: République d'Afrique du Sud"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label>Code ISO *</Label>
                                    <Input
                                        value={form.code_iso}
                                        maxLength={2}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                code_iso: e.target.value,
                                            })
                                        }
                                        placeholder="ZA"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Région *</Label>
                                    <Input
                                        value={form.region}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                region: e.target.value,
                                            })
                                        }
                                        list="regions"
                                        placeholder="SADC"
                                    />
                                    <datalist id="regions">
                                        {REGIONS.filter(
                                            r => r !== "Toutes"
                                        ).map(r => (
                                            <option key={r} value={r} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="space-y-1">
                                    <Label>Capital</Label>
                                    <Input
                                        value={form.capital}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                capital: e.target.value,
                                            })
                                        }
                                        placeholder="Pretoria"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Population</Label>
                                    <Input
                                        value={form.population}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                population: e.target.value,
                                            })
                                        }
                                        placeholder="60,0 millions"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <CountryLogoUpload
                                        label="Drapeau"
                                        value={form.flag_url}
                                        onChange={url =>
                                            setForm({ ...form, flag_url: url })
                                        }
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="fsu" className="space-y-4 mt-4">
                            <div className="space-y-1">
                                <Label>Description du FSU</Label>
                                <Textarea
                                    value={form.description}
                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Décrivez les activités du FSU dans ce pays..."
                                    rows={4}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Histoire, objectifs, projets principaux du
                                    FSU
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Année d'établissement</Label>
                                    <Input
                                        value={form.fsu_established}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                fsu_established: e.target.value,
                                            })
                                        }
                                        placeholder="2016"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Budget FSU</Label>
                                    <Input
                                        value={form.fsu_budget}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                fsu_budget: e.target.value,
                                            })
                                        }
                                        placeholder="60 milliards FCFA"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-4 mt-4">
                            <div className="space-y-1">
                                <Label>Coordinateur FSU</Label>
                                <Input
                                    value={form.fsu_coordinator_name}
                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            fsu_coordinator_name:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Mme Thandi Mbeki"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Email coordinateur</Label>
                                    <Input
                                        type="email"
                                        value={form.fsu_coordinator_email}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                fsu_coordinator_email:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="fsu@southafrica.gov.za"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Téléphone</Label>
                                    <Input
                                        value={form.fsu_coordinator_phone}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                fsu_coordinator_phone:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="+27 10 000 0000"
                                    />
                                </div>
                            </div>

                            <CountryLogoUpload
                                value={form.logo_path}
                                onChange={path =>
                                    setForm({ ...form, logo_path: path })
                                }
                                countryCode={form.code_iso}
                            />
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                !form.name_fr ||
                                !form.name_en ||
                                !form.code_iso ||
                                !form.region
                            }
                        >
                            {editing ? "Mettre à jour" : "Créer"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
