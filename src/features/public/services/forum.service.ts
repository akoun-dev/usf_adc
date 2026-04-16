import { supabase } from "@/integrations/supabase/client"

export interface ForumCategory {
    id: string
    name: string
    description: string | null
    slug: string
    sort_order: number
    icon: string | null
    color: string | null
    created_at: string
}

export interface ForumTopic {
    id: string
    title: string
    content: string
    category_id: string | null
    created_by: string
    is_pinned: boolean
    is_locked: boolean
    is_public: boolean
    views: number
    status: string | null
    tags: string[] | null
    created_at: string
    updated_at: string
    // Joined data
    category?: ForumCategory | null
    author?: {
        full_name: string | null
        country?: string | null
    } | null
    _count?: {
        posts: number
        replies: number
    }
}

export async function getPublicForumCategories(): Promise<ForumCategory[]> {
    const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("sort_order", { ascending: true })

    if (error) throw error
    return data || []
}

export async function getPublicForumTopics(): Promise<ForumTopic[]> {
    const { data, error } = await supabase
        .from("forum_topics")
        .select("*")
        .eq("is_public", true)
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false })

    if (error) throw error

    // Get categories separately
    const { data: categories } = await supabase
        .from("forum_categories")
        .select("*")

    // Create a map of categories
    const categoryMap = new Map(categories?.map(c => [c.id, c]) || [])

    // Get author IDs from topics
    const authorIds = [...new Set(data?.map(t => t.created_by) || [])]

    // Fetch authors from profiles (this may fail for anon users, so we handle it gracefully)
    let authorMap = new Map()
    try {
        // Only fetch if there are author IDs
        if (authorIds.length > 0) {
            const { data: authors, error: authorError } = await supabase
                .from("profiles")
                .select("id, full_name, country")
                .in("id", authorIds)

            if (!authorError && authors) {
                authorMap = new Map(authors.map(a => [a.id, a]))
            }
        }
    } catch (e) {
        // If we can't fetch authors (e.g., anon users), that's okay
        // Topics will just show null for author
        console.warn("Could not fetch authors:", e)
    }

    // Get post counts for each topic
    const topics = data || []
    const topicIds = topics.map(t => t.id)

    // Get all posts counts in one query - skip if no topics
    let posts: any[] = []
    if (topicIds.length > 0) {
        const result = await supabase.from("forum_posts").select("topic_id")
        posts = result.data || []
    }

    // Count posts per topic
    const postCounts = new Map<string, number>()
    ;(posts || []).forEach(post => {
        postCounts.set(post.topic_id, (postCounts.get(post.topic_id) || 0) + 1)
    })

    // Combine all data
    const topicsWithCounts = topics.map(topic => ({
        ...topic,
        category: topic.category_id
            ? categoryMap.get(topic.category_id) || null
            : null,
        author: authorMap.get(topic.created_by) || null,
        _count: {
            posts: postCounts.get(topic.id) || 0,
            replies: (postCounts.get(topic.id) || 0) - 1,
        },
    }))

    return topicsWithCounts
}

export async function getPublicForumTopicById(
    topicId: string
): Promise<ForumTopic | null> {
    const { data, error } = await supabase
        .from("forum_topics")
        .select("*")
        .eq("id", topicId)
        .eq("is_public", true)
        .single()

    if (error) {
        if (error.code === "PGRST116") return null // Not found
        throw error
    }

    if (!data) return null

    // Get category if exists
    let category: ForumCategory | null = null
    if (data.category_id) {
        const { data: cat } = await supabase
            .from("forum_categories")
            .select("*")
            .eq("id", data.category_id)
            .single()
        category = cat
    }

    // Get author (may fail for anon users)
    let author: { full_name: string | null; country?: string | null } | null =
        null
    try {
        const { data: authorData, error: authorError } = await supabase
            .from("profiles")
            .select("full_name, country")
            .eq("id", data.created_by)
            .single()

        if (!authorError && authorData) {
            author = authorData
        }
    } catch (e) {
        // If we can't fetch author, that's okay
        console.warn("Could not fetch author:", e)
    }

    // Get post count
    const { count } = await supabase
        .from("forum_posts")
        .select("*", { count: "exact", head: true })
        .eq("topic_id", topicId)

    return {
        ...data,
        category,
        author: author || null,
        _count: {
            posts: count || 0,
            replies: (count || 0) - 1,
        },
    }
}

export async function incrementTopicViews(topicId: string): Promise<void> {
    await supabase.rpc("increment_forum_topic_views", { topic_id: topicId })
}

// Get popular tags
export async function getPopularTags(): Promise<string[]> {
    const { data, error } = await supabase
        .from("forum_topic_tags")
        .select("tag")
        .limit(20)

    if (error) throw error

    // Count tag occurrences
    const tagCounts = new Map<string, number>()
    ;(data || []).forEach(({ tag }) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })

    // Sort by count and return top tags
    return Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag]) => tag)
}
