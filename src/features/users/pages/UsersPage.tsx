import { useMemo, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Users, Mail, Download, RefreshCw, ChevronUp, ChevronDown } from "lucide-react"
import { exportUsersToExcel } from "../utils/export-users-excel"
import { CsvImportDialog } from "../components/CsvImportDialog"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useUsers } from "../hooks/useUsers"
import { RoleManager } from "../components/RoleManager"
import { UserStatusToggle } from "../components/UserStatusToggle"
import { InviteUserForm } from "@/features/invitations/components/InviteUserForm"
import type { AppRole } from "@/core/constants/roles"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function UsersPage() {
    const { hasRole } = useAuth()
    const { data: users, isLoading, refetch } = useUsers()
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortField, setSortField] = useState<string>("full_name")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const { t } = useTranslation()

    const isGlobalAdmin = hasRole("super_admin")
    const allowedRoles: AppRole[] = isGlobalAdmin
        ? ["point_focal", "country_admin", "super_admin"]
        : ["point_focal"]

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

    const filteredAndSorted = useMemo(() => {
        if (!users) return []
        
        let result = users.filter(u =>
            (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
            (u.email || "").toLowerCase().includes(search.toLowerCase())
        )

        result.sort((a, b) => {
            let aValue: any = a[sortField as keyof typeof a] || ""
            let bValue: any = b[sortField as keyof typeof b] || ""
            
            if (sortField === "country") {
                aValue = a.country?.name_fr || ""
                bValue = b.country?.name_fr || ""
            }

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })

        return result
    }, [users, search, sortField, sortOrder])

    const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage)
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredAndSorted.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredAndSorted, currentPage, itemsPerPage])

    const stats = useMemo(() => ({
        total: users?.length || 0,
        filtered: filteredAndSorted.length
    }), [users, filteredAndSorted])

    return (
        <Card className="border-none shadow-none bg-transparent animate-fade-in">
            <CardHeader className="px-0 pt-0 pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary" />
                            {t("users.title")}
                        </CardTitle>
                        <CardDescription>
                            {stats.total} {t("nav.users").toLowerCase()} au total
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
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link to="/admin/invitations">
                                <Mail className="h-4 w-4 mr-2" />
                                {t("invitations.title")}
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => users && exportUsersToExcel(users)}
                            disabled={!users?.length}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {t("common.export", "Exporter")}
                        </Button>
                        {isGlobalAdmin && <CsvImportDialog />}
                        <InviteUserForm />
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t("users.searchPlaceholder")}
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="pl-10 bg-white"
                        />
                    </div>
                    {search && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearch("")}
                        >
                            {t("common.reset", "Réinitialiser")}
                        </Button>
                    )}
                </div>

                {stats.filtered !== stats.total && (
                    <div className="mt-2 text-sm text-muted-foreground">
                        {t("common.showing", "Affichage de")} {stats.filtered} {t("nav.users").toLowerCase()} {t("common.of", "sur")} {stats.total}
                    </div>
                )}
            </CardHeader>

            <CardContent className="px-0">
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="w-[300px]">
                                    <button
                                        onClick={() => handleSort("full_name")}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                                    >
                                        {t("users.user")}
                                        {sortField === "full_name" && (
                                            sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                        )}
                                    </button>
                                </TableHead>
                                <TableHead>
                                    <button
                                        onClick={() => handleSort("country")}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                                    >
                                        {t("users.country")}
                                        {sortField === "country" && (
                                            sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                        )}
                                    </button>
                                </TableHead>
                                <TableHead>{t("users.roles")}</TableHead>
                                <TableHead className="w-[150px]">{t("users.status")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : paginatedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                        {t("users.noUsers")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedUsers.map(user => {
                                    const initials = (user.full_name || "?")
                                        .split(" ")
                                        .map(w => w[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()

                                    return (
                                        <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border">
                                                        <AvatarFallback className="text-xs font-bold bg-slate-100 text-slate-600">
                                                            {initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-sm text-foreground">
                                                            {user.full_name || t("users.noName")}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground font-medium">
                                                            {user.email} • {user.language?.toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {user.country ? (
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="font-bold text-[10px] px-1.5 py-0">
                                                            {user.country.code_iso}
                                                        </Badge>
                                                        <span className="text-sm font-medium text-slate-600">
                                                            {user.country.name_fr}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <RoleManager
                                                    userId={user.id}
                                                    currentRoles={user.roles}
                                                    allowedRoles={allowedRoles}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <UserStatusToggle
                                                    userId={user.id}
                                                    isActive={user.is_active}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
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
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <span className="whitespace-nowrap">
                                {Math.min((currentPage - 1) * itemsPerPage + 1, stats.filtered)}-
                                {Math.min(currentPage * itemsPerPage, stats.filtered)} {t("admin.of", "sur")} {stats.filtered}
                            </span>
                        </div>
                        <Pagination className="w-auto m-0">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                
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

                                <PaginationItem>
                                    <PaginationNext 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
