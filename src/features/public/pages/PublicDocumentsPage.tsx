import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Clock, Download, Filter, FolderOpen, HardDrive, Search, File } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { PublicLayout } from "../components/PublicLayout"
import {
    usePublicDocuments,
    DOCUMENT_CATEGORIES,
    DOCUMENT_TYPES,
    type PublicDocument,
} from "../hooks/usePublicDocuments"
import bgHeader from '@/assets/bg-header.jpg'




const CATEGORIES = [
    ...Object.entries(DOCUMENT_CATEGORIES).map(([key, val]) => ({
        value: key,
        icon: val.icon,
        labelKey: val.label,
    })),
]

const LANGUAGES = [
    { value: "all", label: "all" },
    { value: "FR", label: "Français" },
    { value: "EN", label: "English" },
]

function formatDocumentDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

export default function PublicDocumentsPage() {
    const { t } = useTranslation()
    const { data: documents, isLoading } = usePublicDocuments()
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("all")
    const [language, setLanguage] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    const allDocuments = useMemo(() => documents ?? [], [documents])

    const filteredDocuments = useMemo(() => {
        return allDocuments.filter(document => {
            const query = search.trim().toLowerCase()
            const matchSearch =
                !query ||
                document.title.toLowerCase().includes(query) ||
                document.description.toLowerCase().includes(query) ||
                document.tags.some(tag => tag.toLowerCase().includes(query))
            const matchCategory =
                category === "all" || document.category === category
            const matchLanguage =
                language === "all" || document.language === language

            return matchSearch && matchCategory && matchLanguage
        })
    }, [allDocuments, category, language, search])

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1)
    }, [search, category, language])

    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage)
    const paginatedDocuments = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredDocuments.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredDocuments, currentPage, itemsPerPage])

    return (
        <PublicLayout>

<div className="space-y-12 relative bg-gray-50">

                {/* Hero */}
                <div
                    className="relative bg-cover bg-center bg-no-repeat pb-5 !m-0 border-b"
                    style={{ backgroundImage: `url(${bgHeader})` }}
                >
                    <div className="absolute inset-0" />
                    <div className="relative text-center max-w-4xl mx-auto space-y-6 h-56 flex flex-col items-center justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">
                            {t("public.documents.title")}
                        </h1>
                        <p className="text-xl text-base !mt-2">
                            {t("public.documents.description")}
                        </p>
                    </div>
                </div>

            </div>






            <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">
                
                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t("public.documents.search")}
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-[160px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map(item => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.value === "all"
                                        ? t("public.documents.allCategories")
                                        : `${item.icon} ${t(item.labelKey)}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGES.map(item => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.value === "all"
                                        ? t("public.documents.allLanguages")
                                        : item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Badge
                        variant="outline"
                        className="border-primary/20 text-primary h-10 px-4 flex items-center"
                    >
                        {filteredDocuments.length} document
                        {filteredDocuments.length > 1 ? "s" : ""}
                    </Badge>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {[1, 2, 3, 4, 5, 6].map(item => (
                            <Card key={item}>
                                <CardContent className="p-6">
                                    <Skeleton className="h-48 w-full mb-4" />
                                    <Skeleton className="h-6 w-3/4 mb-3" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center text-muted-foreground">
                            <FolderOpen className="mx-auto h-16 w-16 mb-4 opacity-30" />
                            <p className="text-lg font-medium mb-2">
                                {t("public.documents.empty")}
                            </p>
                            <p className="text-sm">
                                {t("public.news.tryOtherFilters")}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full" />
                            {t("public.documents.title")}
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {paginatedDocuments.map(document => (
                                <LibraryDocumentCard
                                    key={document.id}
                                    document={document}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationPrevious
                                            onClick={() =>
                                                setCurrentPage(p =>
                                                    Math.max(1, p - 1)
                                                )
                                            }
                                            className={
                                                currentPage === 1
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />

                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1
                                        ).map(page => {
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 &&
                                                    page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    page
                                                                )
                                                            }
                                                            isActive={
                                                                page ===
                                                                currentPage
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return (
                                                    <PaginationEllipsis
                                                        key={page}
                                                    />
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
                    </section>
                )}
            </div>
        </PublicLayout>
    )
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function LibraryDocumentCard({ document }: { document: PublicDocument }) {
    const { t } = useTranslation()
    const categoryInfo =
        DOCUMENT_CATEGORIES[
            document.category as keyof typeof DOCUMENT_CATEGORIES
        ]
    const typeInfo =
        DOCUMENT_TYPES[document.type as keyof typeof DOCUMENT_TYPES]

    return (
        <Card className="group overflow-hidden border-primary/10 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[var(--shadow-md)] transition-all h-full">
            <CardContent className="p-0 flex flex-col h-full">
                <div className="relative h-40 shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/15">
                    {document.thumbnail ? (
                        <img
                            src={document.thumbnail}
                            alt={document.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(152,100%,16%)/0.78] via-[hsl(152,100%,18%)/0.20] to-transparent" />
                    <div className="absolute left-4 top-4 flex gap-2">
                        <Badge className="bg-secondary text-gray-900 hover:bg-secondary">
                            {typeInfo?.icon} {typeInfo?.label}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="border-white/25 bg-white/10 text-white"
                        >
                            {document.language}
                        </Badge>
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                    {categoryInfo ? (
                        <Badge
                            variant="outline"
                            className="mb-3 border-primary/20 bg-primary/5 text-primary"
                        >
                            {categoryInfo.icon} {t(categoryInfo.label)}
                        </Badge>
                    ) : null}

                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                        {document.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {document.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                        {document.tags.slice(0, 3).map(tag => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {document.published_at ? formatDocumentDate(document.published_at) : '—'}
                        </span>
                        <span className="flex items-center gap-1">
                            <File className="h-3.5 w-3.5" />
                            {formatFileSize(document.file_size)}
                        </span>
                    </div>

                    <Button
                        asChild
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        <a href={document.download_url || '#'} download>
                            <Download className="mr-2 h-4 w-4" />
                            {t('public.documents.download')}
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
