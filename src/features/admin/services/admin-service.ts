import { supabase } from "@/integrations/supabase/client"
import type {
    PlatformSetting,
    SubmissionPeriod,
    Country,
    AuditLogEntry,
    FaqArticle,
} from "../types"
import type { Json } from "@/integrations/supabase/types"

// File upload function for logos
async function uploadLogoFile(
    file: File,
    entityType: "members" | "partners",
    entityId: string
): Promise<string> {
    try {
        // Validate file exists
        if (!file || !file.name) {
            throw new Error("No file provided for upload")
        }
        
        const validImageExtensions = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.bmp']
        const originalFileName = file.name || ''
        const fileExt = originalFileName.includes('.') ? originalFileName.split('.').pop()?.toLowerCase() || '' : ''
        const hasValidExt = fileExt ? validImageExtensions.includes(`.${fileExt}`) : false
        if (!file.type?.startsWith("image/") && !hasValidExt) {
            throw new Error("Only image files are allowed")
        }

        if (file.size > 5 * 1024 * 1024) {
            // 5MB limit
            throw new Error("File size exceeds 5MB limit")
        }

        const newFileName = `${entityType}/${entityId}/logo.${fileExt}`

        const { data, error } = await supabase.storage
            .from("logos")
            .upload(newFileName, file, {
                cacheControl: "3600",
                upsert: true,
            })

        if (error) throw error

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("logos").getPublicUrl(newFileName)

        return publicUrl
    } catch (error) {
        console.error("Error uploading logo:", error)
        throw error
    }
}

// Platform Settings
export async function getSettings(): Promise<PlatformSetting[]> {
    const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .order("category", { ascending: true })
    if (error) throw error
    return (data ?? []) as PlatformSetting[]
}

export async function updateSetting(id: string, value: Json) {
    const { data, error } = await supabase
        .from("platform_settings")
        .update({ value })
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

// Submission Periods
export async function getSubmissionPeriods(): Promise<SubmissionPeriod[]> {
    const { data, error } = await supabase
        .from("submission_periods")
        .select("*")
        .order("start_date", { ascending: false })
    if (error) throw error
    return (data ?? []) as SubmissionPeriod[]
}

export async function createSubmissionPeriod(
    input: Omit<SubmissionPeriod, "id" | "created_at" | "updated_at">
) {
    const { data, error } = await supabase
        .from("submission_periods")
        .insert(input)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateSubmissionPeriod(
    id: string,
    input: Partial<SubmissionPeriod>
) {
    const { data, error } = await supabase
        .from("submission_periods")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteSubmissionPeriod(id: string) {
    const { error } = await supabase
        .from("submission_periods")
        .delete()
        .eq("id", id)
    if (error) throw error
}

// Countries
export async function getCountries(): Promise<Country[]> {
    const { data, error } = await supabase
        .from("countries")
        .select("*")
        .order("name_fr", { ascending: true })
    if (error) throw error
    return (data ?? []) as Country[]
}

export async function createCountry(input: {
    name_fr: string
    name_en: string
    code_iso: string
    region: string
    flag_url?: string
}) {
    const { data, error } = await supabase
        .from("countries")
        .insert(input)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateCountry(id: string, input: Partial<Country>) {
    const { data, error } = await supabase
        .from("countries")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteCountry(id: string) {
    const { error } = await supabase.from("countries").delete().eq("id", id)
    if (error) throw error
}

// Audit Logs
export async function getAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
    const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit)
    if (error) throw error
    return (data ?? []) as AuditLogEntry[]
}

// News / Actualités
export async function getNews() {
    const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false })
    if (error) throw error
    return data ?? []
}

export async function getEnhancedNews() {
    try {
        const { data, error } = await supabase
            .from("news")
            .select("*, news_categories(*)")
            .order("published_at", { ascending: false })
        
        if (error) throw error
        return data ?? []
    } catch (error) {
        console.error('Error fetching enhanced news:', error)
        // Fallback to basic news if enhanced query fails
        return getNews()
    }
}

export async function getNewsById(id: string) {
    if (!id) {
        return null
    }
    const { data, error } = await supabase
        .from("news")
        .select("*, news_categories(*), news_gallery_images(*), article_translations(*)")
        .eq("id", id)
        .single()
    if (error) throw error
    return data
}

export async function createNews(input: {
    title: string
    content?: string
    excerpt?: string
    category?: string
    source?: string
    image_url?: string
    featured_image?: string
    status?: string
    meta_description?: string
    meta_keywords?: string
    slug?: string
    sort_order?: number
    is_featured?: boolean
    allow_comments?: boolean
    language?: string
}) {
    const { data, error } = await supabase
        .from("news")
        .insert(input)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateNews(
    id: string,
    input: Partial<{
        title: string
        content: string
        excerpt: string
        category: string
        source: string
        image_url: string
        featured_image: string
        published_at: string
        is_public: boolean
        author: string
        read_time: string
        language: string
        status: string
        meta_description: string
        meta_keywords: string
        slug: string
        sort_order: number
        is_featured: boolean
        allow_comments: boolean
    }>
) {
    const { data, error } = await supabase
        .from("news")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateNewsStatus(id: string, status: string) {
    const { data, error } = await supabase
        .from("news")
        .update({ status })
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteNews(id: string) {
    const { error } = await supabase.from("news").delete().eq("id", id)
    if (error) throw error
}

// News Categories
export async function getNewsCategories() {
    const { data, error } = await supabase
        .from("news_categories")
        .select("*")
        .order("sort_order", { ascending: true })
    if (error) throw error
    return data ?? []
}

export async function getNewsCategoryById(id: string) {
    const { data, error } = await supabase
        .from("news_categories")
        .select("*")
        .eq("id", id)
        .single()
    if (error) throw error
    return data
}

export async function createNewsCategory(input: {
    name_fr: string
    name_en: string
    name_pt: string
    slug: string
    color?: string
    icon?: string
    sort_order?: number
    is_active?: boolean
}) {
    const { data, error } = await supabase
        .from("news_categories")
        .insert(input)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateNewsCategory(
    id: string,
    input: Partial<{
        name_fr: string
        name_en: string
        name_pt: string
        slug: string
        color: string
        icon: string
        sort_order: number
        is_active: boolean
    }>
) {
    const { data, error } = await supabase
        .from("news_categories")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteNewsCategory(id: string) {
    const { error } = await supabase.from("news_categories").delete().eq("id", id)
    if (error) throw error
}

// News Gallery Images
export async function getNewsGalleryImages(newsId: string) {
    const { data, error } = await supabase
        .from("news_gallery_images")
        .select("*")
        .eq("news_id", newsId)
        .order("sort_order", { ascending: true })
    if (error) throw error
    return data ?? []
}

export async function addNewsGalleryImage(input: {
    news_id: string
    image_url: string
    caption?: string
    alt_text?: string
    sort_order?: number
}) {
    const { data, error } = await supabase
        .from("news_gallery_images")
        .insert(input)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateNewsGalleryImage(
    id: string,
    input: Partial<{
        caption: string
        alt_text: string
        sort_order: number
    }>
) {
    const { data, error } = await supabase
        .from("news_gallery_images")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteNewsGalleryImage(id: string) {
    const { error } = await supabase.from("news_gallery_images").delete().eq("id", id)
    if (error) throw error
}

export async function reorderNewsGalleryImages(images: { id: string; sort_order: number }[]) {
    const { data, error } = await supabase
        .from("news_gallery_images")
        .upsert(images)
        .select()
    if (error) throw error
    return data
}

// Article Translations
export async function getArticleTranslations(newsId: string) {
    const { data, error } = await supabase
        .from("article_translations")
        .select("*")
        .eq("news_id", newsId)
    if (error) throw error
    return data ?? []
}

export async function getArticleTranslation(newsId: string, language: string) {
    const { data, error } = await supabase
        .from("article_translations")
        .select("*")
        .eq("news_id", newsId)
        .eq("language", language)
        .single()
    if (error) throw error
    return data
}

export async function createArticleTranslation(input: {
    news_id: string
    language: string
    title: string
    content?: string
    excerpt?: string
}) {
    const { data, error } = await supabase
        .from("article_translations")
        .insert(input)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateArticleTranslation(
    id: string,
    input: Partial<{
        title: string
        content: string
        excerpt: string
    }>
) {
    const { data, error } = await supabase
        .from("article_translations")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteArticleTranslation(id: string) {
    const { error } = await supabase.from("article_translations").delete().eq("id", id)
    if (error) throw error
}

// News Image Upload
export async function uploadNewsImage({
    file,
    bucketName,
    newsId,
}: {
    file: File
    bucketName: "article-images" | "article-gallery"
    newsId: string
}): Promise<{
    filePath: string
    fileName: string
    fileSize: number
    mimeType: string
    url: string
}> {
    try {
        console.log('Received file in uploadNewsImage:', file); // Debug log
        if (!file) {
            throw new Error("No file provided to uploadNewsImage")
        }
        // Validate file type and size - check both MIME type and extension
        const validImageExtensions = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.bmp']
        const originalFileName = file.name || ''
        const fileExt = originalFileName.includes('.') ? originalFileName.split('.').pop()?.toLowerCase() || '' : ''
        const hasValidExt = fileExt ? validImageExtensions.includes(`.${fileExt}`) : false
        if (!file.type?.startsWith("image/") && !hasValidExt) {
            throw new Error("Only image files are allowed")
        }

        if (file.size > 5 * 1024 * 1024) {
            // 5MB limit
            throw new Error("File size exceeds 5MB limit")
        }

        // Generate unique file name
        const newFileName = `${newsId}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `${bucketName}/${newFileName}`

        // Upload file to Supabase storage
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            })

        if (error) throw error

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from(bucketName).getPublicUrl(filePath)

        return {
            filePath,
            fileName: newFileName,
            fileSize: file.size,
            mimeType: file.type,
            url: publicUrl,
        }
    } catch (error) {
        console.error("Error uploading news image:", error)
        throw error
    }
}

export async function deleteNewsImage(bucketName: string, filePath: string) {
    try {
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath])
        if (error) throw error
    } catch (error) {
        console.error("Error deleting news image:", error)
        throw error
    }
}

// Projects
export async function getProjects() {
    const { data, error } = await supabase
        .from("projects")
        .select("*, countries(name_fr)")
        .order("created_at", { ascending: false })
    if (error) throw error
    return data ?? []
}

export async function getProjectById(id: string) {
    const { data, error } = await supabase
        .from("projects")
        .select("*, countries(name_fr)")
        .eq("id", id)
        .single()
    if (error) throw error
    return data
}

export async function createProject(input: {
    title: string
    description?: string
    country_id: string
    status?: string
    region?: string
    budget?: number
    start_date?: string
    end_date?: string
    objectives?: string
    indicators?: string
    latitude?: number
    longitude?: number
}) {
    const { data, error } = await supabase
        .from("projects")
        .insert(input)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateProject(
    id: string,
    input: Partial<{
        title: string
        description: string
        country_id: string
        status: string
        region: string
    }>
) {
    const { data, error } = await supabase
        .from("projects")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteProject(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) throw error
}

export async function getProjectHistory(projectId: string) {
    const { data, error } = await supabase
        .from("project_history")
        .select("*, user:user_id(full_name)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
    if (error) throw error
    return data ?? []
}

export async function uploadDocumentFile(file: File): Promise<{
    filePath: string
    fileName: string
    fileSize: number
    mimeType: string
    url: string
}> {
    try {
        // Validate file type
        const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ]

        if (!validTypes.includes(file.type)) {
            throw new Error(
                "Invalid file type. Only PDF, DOCX, XLSX, PPTX files are allowed."
            )
        }

        // Validate file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            throw new Error("File size exceeds 50MB limit")
        }

        // Generate unique file name
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `documents/${fileName}`

        // Upload file to Supabase storage
        const { data, error } = await supabase.storage
            .from("documents")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            })

        if (error) throw error

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("documents").getPublicUrl(filePath)

        return {
            filePath,
            fileName,
            fileSize: file.size,
            mimeType: file.type,
            url: publicUrl,
        }
    } catch (error) {
        console.error("Error uploading document:", error)
        throw error
    }
}

// Documents
export async function getDocuments() {
    const { data, error } = await supabase
        .from("documents")
        .select("*, document_tags(tag)")
        .order("created_at", { ascending: false })
    if (error) throw error

    return (data ?? []).map(doc => ({
        ...doc,
        tags: doc.document_tags?.map((dt: { tag: string }) => dt.tag) || [],
    }))
}

export async function createDocument(input: {
    title: string
    description?: string
    category: string
    file_name: string
    file_path: string
    file_size: number
    mime_type: string
    type?: string
    language?: string
    is_public?: boolean
    tags?: string[]
}) {
    const { data: document, error: docError } = await supabase
        .from("documents")
        .insert({
            title: input.title,
            description: input.description,
            category: input.category,
            file_name: input.file_name,
            file_path: input.file_path,
            file_size: input.file_size,
            mime_type: input.mime_type,
            type: input.type,
            language: input.language || "fr",
            is_public: input.is_public || false,
        })
        .select()
        .single()

    if (docError) throw docError

    // Add tags if provided
    const tagsArray = Array.isArray(input.tags) ? input.tags : [];
    if (tagsArray.length > 0) {
        const tagInserts = tagsArray.map(tag => ({
            document_id: document.id,
            tag: tag.trim(),
        }))

        const { error: tagError } = await supabase
            .from("document_tags")
            .insert(tagInserts)

        if (tagError) {
            console.error("Error adding tags:", tagError)
            // Don't fail the whole operation if tags fail
        }
    }

    return document
}

export async function updateDocument(
    id: string,
    input: Partial<{
        title: string
        description: string
        category: string
        is_public: boolean
        tags?: string[]
    }>
) {
    const { data: document, error: docError } = await supabase
        .from("documents")
        .update({
            title: input.title,
            description: input.description,
            category: input.category,
            is_public: input.is_public,
        })
        .eq("id", id)
        .select()
        .single()

    if (docError) throw docError

    // Update tags if provided
    if (input.tags !== undefined) {
        // Delete existing tags
        const { error: deleteError } = await supabase
            .from("document_tags")
            .delete()
            .eq("document_id", id)

        if (deleteError) {
            console.error("Error deleting tags:", deleteError)
        }

        // Add new tags
        const tagsArray = Array.isArray(input.tags) ? input.tags : [];
        if (tagsArray.length > 0) {
            const tagInserts = tagsArray.map(tag => ({
                document_id: id,
                tag: tag.trim(),
            }))

            const { error: tagError } = await supabase
                .from("document_tags")
                .insert(tagInserts)

            if (tagError) {
                console.error("Error adding tags:", tagError)
            }
        }
    }

    return document
}

export async function deleteDocument(id: string) {
    // First delete from storage
    const { data: document } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", id)
        .single()

    if (document?.file_path) {
        const { error: storageError } = await supabase.storage
            .from("documents")
            .remove([document.file_path])

        if (storageError) {
            console.error("Error deleting file from storage:", storageError)
        }
    }

    // Then delete from database (tags will cascade)
    const { error } = await supabase.from("documents").delete().eq("id", id)
    if (error) throw error
}

interface SearchDocumentsParams {
    searchTerm?: string
    categories?: string[]
    tags?: string[]
    status?: string[]
    dateFrom?: string
    dateTo?: string
    page?: number
    pageSize?: number
}

export async function searchDocuments({
    searchTerm = "",
    categories = [],
    tags = [],
    status = [],
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 20,
}: SearchDocumentsParams) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase.from("documents").select("*, document_tags(tag)", { count: 'exact' })

    // Apply search term filter
    if (searchTerm) {
        query = query.or(
            `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        )
    }

    // Apply category filter
    if (categories.length > 0) {
        query = query.in("category", categories)
    }

    // Apply status filter
    if (status.length > 0) {
        query = query.in("status", status)
    }

    // Apply date range filters
    if (dateFrom) {
        query = query.gte("created_at", dateFrom)
    }
    if (dateTo) {
        query = query.lte("created_at", dateTo)
    }

    // Apply tags filter via join
    if (tags.length > 0) {
        // Get document IDs that have matching tags
        const { data: matchingDocs } = await supabase
            .from("document_tags")
            .select("document_id")
            .in("tag", tags)
        
        if (matchingDocs && matchingDocs.length > 0) {
            const docIds = matchingDocs.map(d => d.document_id)
            query = query.in("id", docIds)
        } else {
            return { documents: [], total: 0 }
        }
    }

    // Apply pagination
    query = query.range(from, to).order("created_at", { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
        documents: (data ?? []).map(doc => ({
            ...doc,
            tags: doc.document_tags?.map((dt: { tag: string }) => dt.tag) || [],
        })),
        total: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
    }
}

export async function getDocumentTags() {
    const { data, error } = await supabase
        .from("document_tags")
        .select("tag")
        .order("tag")

    if (error) throw error

    return (data ?? []).map(d => d.tag)
}

interface Document {
    id: string
    title: string
    description?: string
    category: string
    file_name: string
    file_path: string
    file_size?: number
    mime_type?: string
    status?: string
    is_public?: boolean
    created_at: string
    tags?: string[]
}

export function exportDocumentsToCSV(documents: Document[]) {
    const headers = ['Title', 'Category', 'Status', 'File Name', 'Size', 'Created At', 'Tags']
    const rows = documents.map(doc => [
        doc.title,
        doc.category,
        doc.status || 'active',
        doc.file_name,
        doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : '',
        new Date(doc.created_at).toLocaleDateString(),
        (doc.tags || []).join(', ')
    ])

    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')

    return csvContent
}

export function downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
}

// =====================================================
// Document Versions
// =====================================================

export interface DocumentVersion {
    id: string
    document_id: string
    version_number: number
    file_path: string
    file_name: string
    file_size?: number
    mime_type?: string
    changelog?: string
    created_by?: string
    created_at: string
}

export async function getDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
    const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false })

    if (error) throw error
    return data ?? []
}

export async function createDocumentVersion(input: {
    document_id: string
    file_path: string
    file_name: string
    file_size?: number
    mime_type?: string
    changelog?: string
}): Promise<DocumentVersion> {
    // Get current max version number
    const { data: versions } = await supabase
        .from('document_versions')
        .select('version_number')
        .eq('document_id', input.document_id)
        .order('version_number', { ascending: false })
        .limit(1)
    
    const newVersion = (versions?.[0]?.version_number ?? 0) + 1

    const { data, error } = await supabase
        .from('document_versions')
        .insert({
            ...input,
            version_number: newVersion,
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function restoreDocumentVersion(versionId: string): Promise<DocumentVersion> {
    // Get the version to restore
    const { data: version, error: fetchError } = await supabase
        .from('document_versions')
        .select('*')
        .eq('id', versionId)
        .single()

    if (fetchError) throw fetchError

    // Update the main document with the version's file info
    const { error: updateError } = await supabase
        .from('documents')
        .update({
            file_path: version.file_path,
            file_name: version.file_name,
            file_size: version.file_size,
            mime_type: version.mime_type,
            updated_at: new Date().toISOString(),
        })
        .eq('id', version.document_id)

    if (updateError) throw updateError

    return version
}

// Events
export async function getEvents() {
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: false })
    if (error) throw error
    return data ?? []
}

export async function getEventById(id: string) {
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single()
    if (error) throw error
    return data
}

export async function createEvent(input: {
    title: string
    description?: string
    start_date: string
    end_date?: string
    location?: string
    event_type?: string
    status?: string
}) {
    const { data, error } = await supabase
        .from("events")
        .insert(input)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateEvent(
    id: string,
    input: Partial<{
        title: string
        description: string
        start_date: string
        end_date: string
        location: string
        event_type: string
        status: string
    }>
) {
    const { data, error } = await supabase
        .from("events")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id)
    if (error) throw error
}

// Forum Categories
export async function getForumCategories() {
    const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("name", { ascending: true })
    if (error) throw error
    return data ?? []
}

export async function createForumCategory(input: {
    name: string
    description?: string
    color?: string
}) {
    const { data, error } = await supabase
        .from("forum_categories")
        .insert(input)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateForumCategory(
    id: string,
    input: Partial<{ name: string; description: string; color: string }>
) {
    const { data, error } = await supabase
        .from("forum_categories")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteForumCategory(id: string) {
    const { error } = await supabase
        .from("forum_categories")
        .delete()
        .eq("id", id)
    if (error) throw error
}

// Forum Topics Management
export async function getForumTopics() {
    const { data, error } = await supabase
        .from("forum_topics")
        .select("*, forum_categories (*)")
        .order("created_at", { ascending: false })

    if (error) throw error

    // Fetch authors separately
    const authorIds =
        data
            ?.map(topic => topic.author_id)
            .filter((id): id is string => !!id) ?? []
    const { data: authors } = await supabase
        .from("profiles")
        .select("*")
        .in("id", authorIds)

    return (
        data?.map(topic => ({
            ...topic,
            category: topic.forum_categories,
            author: authors?.find(a => a.id === topic.author_id) || {
                id: topic.author_id,
                name: "Utilisateur supprimé",
                avatar_url: null,
            },
        })) ?? []
    )
}

export async function updateForumTopic(
    id: string,
    input: Partial<{ status: string; title: string }>
) {
    const { data, error } = await supabase
        .from("forum_topics")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteForumTopic(id: string) {
    const { error } = await supabase.from("forum_topics").delete().eq("id", id)
    if (error) throw error
}

// Associated Members Management
export async function getAssociatedMembers() {
    const { data, error } = await supabase
        .from("membres_associes")
        .select("*, countries (id, name_fr, name_en, flag_url)")
        .order("nom", { ascending: true })
    if (error) throw error
    return data || []
}

export async function createAssociatedMember(
    input: Omit<
        AssociatedMember,
        "id" | "date_creation" | "date_mise_a_jour"
    > & { logo_file?: File }
) {
    // Separate the logo_file from the database input
    const { logo_file, ...dbInput } = input

    if (logo_file) {
        // First create the member to get the ID
        const { data: newMember, error: createError } = await supabase
            .from("membres_associes")
            .insert({ ...dbInput, logo_url: null })
            .select()
            .single()

        if (createError) throw createError

        // Upload the logo file
        const logoUrl = await uploadLogoFile(logo_file, "members", newMember.id)

        // Update the member with the logo URL
        const { data, error: updateError } = await supabase
            .from("membres_associes")
            .update({ logo_url: logoUrl })
            .eq("id", newMember.id)
            .select()
            .single()

        if (updateError) throw updateError
        return data
    } else {
        // Regular creation without file upload
        const { data, error } = await supabase
            .from("membres_associes")
            .insert(dbInput)
            .select()
            .single()
        if (error) throw error
        return data
    }
}

export async function updateAssociatedMember(
    id: string,
    input: Partial<AssociatedMember> & { logo_file?: File }
) {
    // Separate the logo_file from the database input
    const { logo_file, ...dbInput } = input

    let logoUrl = dbInput.logo_url

    if (logo_file) {
        // Upload the logo file
        logoUrl = await uploadLogoFile(logo_file, "members", id)
    }

    // Update the member
    const { data, error } = await supabase
        .from("membres_associes")
        .update({ ...dbInput, logo_url: logoUrl })
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteAssociatedMember(id: string) {
    const { error } = await supabase
        .from("membres_associes")
        .delete()
        .eq("id", id)
    if (error) throw error
}

// Partners Management
export async function getPartners() {
    const { data, error } = await supabase
        .from("partenaires")
        .select("*, countries (id, name_fr, name_en, flag_url)")
        .order("nom", { ascending: true })
    if (error) throw error
    return data || []
}

export async function createPartner(
    input: Omit<Partner, "id" | "date_creation" | "date_mise_a_jour"> & {
        logo_file?: File
    }
) {
    // Separate the logo_file from the database input
    const { logo_file, ...dbInput } = input

    if (logo_file) {
        // First create the partner to get the ID
        const { data: newPartner, error: createError } = await supabase
            .from("partenaires")
            .insert({ ...dbInput, logo_url: null })
            .select()
            .single()

        if (createError) throw createError

        // Upload the logo file
        const logoUrl = await uploadLogoFile(
            logo_file,
            "partners",
            newPartner.id
        )

        // Update the partner with the logo URL
        const { data, error: updateError } = await supabase
            .from("partenaires")
            .update({ logo_url: logoUrl })
            .eq("id", newPartner.id)
            .select()
            .single()

        if (updateError) throw updateError
        return data
    } else {
        // Regular creation without file upload
        const { data, error } = await supabase
            .from("partenaires")
            .insert(dbInput)
            .select()
            .single()
        if (error) throw error
        return data
    }
}

export async function updatePartner(
    id: string,
    input: Partial<Partner> & { logo_file?: File }
) {
    // Separate the logo_file from the database input
    const { logo_file, ...dbInput } = input

    let logoUrl = dbInput.logo_url

    if (logo_file) {
        // Upload the logo file
        logoUrl = await uploadLogoFile(logo_file, "partners", id)
    }

    // Update the partner
    const { data, error } = await supabase
        .from("partenaires")
        .update({ ...dbInput, logo_url: logoUrl })
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deletePartner(id: string) {
    const { error } = await supabase.from("partenaires").delete().eq("id", id)
    if (error) throw error
}

export async function getProjectActors(projectId: string) {
    const { data, error } = await supabase
        .from("project_actors")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true })
    if (error) throw error
    return data || []
}

export async function addProjectActor(projectId: string, actor: any) {
    const { data, error } = await supabase
        .from("project_actors")
        .insert({
            project_id: projectId,
            name: actor.name,
            type: actor.type,
            role: actor.role,
            organization: actor.organization,
            contact: actor.contact,
        })
        .select()
        .single()
    if (error) throw error
    return data
}

export async function removeProjectActor(actorId: string) {
    const { error } = await supabase
        .from("project_actors")
        .delete()
        .eq("id", actorId)
    if (error) throw error
}

// FAQ Articles
export async function getFaqArticles(): Promise<FaqArticle[]> {
    const { data, error } = await supabase
        .from("faq_articles")
        .select("*")
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true })
    if (error) throw error
    return (data ?? []) as FaqArticle[]
}

export async function createFaqArticle(
    input: Omit<FaqArticle, "id" | "created_at" | "updated_at">
) {
    const { data, error } = await supabase
        .from("faq_articles")
        .insert(input)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateFaqArticle(
    id: string,
    input: Partial<Omit<FaqArticle, "id" | "created_at" | "updated_at">>
) {
    const { data, error } = await supabase
        .from("faq_articles")
        .update(input)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteFaqArticle(id: string) {
    const { error } = await supabase.from("faq_articles").delete().eq("id", id)
    if (error) throw error
}

// Type definitions
export interface AssociatedMember {
    id: string
    nom: string
    nom_complet?: string
    pays_id?: string
    logo_url?: string
    type: "agence" | "operateur" | "institution" | "association"
    secteur?: string
    depuis?: string
    site_web?: string
    description?: string
    projets?: string[]
    email_contact?: string
    telephone_contact?: string
    adresse?: string
    est_actif?: boolean
    date_creation?: string
    date_mise_a_jour?: string
    countries?: {
        id: string
        name_fr: string
        name_en: string
        flag_url?: string
    }
}

export interface Partner {
    id: string
    nom: string
    nom_complet?: string
    pays_id?: string
    logo_url?: string
    type: "institutionnel" | "prive" | "ong" | "international"
    domaine?: string
    depuis?: string
    site_web?: string
    description?: string
    projets?: string[]
    email_contact?: string
    telephone_contact?: string
    adresse?: string
    est_actif?: boolean
    date_creation?: string
    date_mise_a_jour?: string
    countries?: {
        id: string
        name_fr: string
        name_en: string
        flag_url?: string
    }
}
