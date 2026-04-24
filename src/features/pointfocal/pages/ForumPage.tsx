import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
    MessageSquare, Users, MessageSquareText, Plus, Search, ThumbsUp,
    Lightbulb, HelpCircle, Target, Filter, Eye, Clock, Pin, Flag,
    TrendingUp, BookOpen, Scale, Wallet, GraduationCap, Sparkles, MessageCircle
} from "lucide-react"

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    cmdt25: Target,
    reformes: Scale,
    financement: Wallet,
    suivi: GraduationCap,
    formation: GraduationCap,
    innovation: Sparkles,
    libre: MessageCircle,
}

const CATEGORY_COLORS: Record<string, string> = {
    cmdt25: "text-blue-500",
    reformes: "text-purple-500",
    financement: "text-green-500",
    suivi: "text-orange-500",
    formation: "text-yellow-500",
    innovation: "text-pink-500",
    libre: "text-gray-500",
}

function useForumCategories() {
    return useQuery({
        queryKey: ["forum-categories"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("forum_categories")
                .select("*")
                .order("name")
            if (error) throw error
            return data
        },
    })
}

function useForumTopics(categoryId?: string | null) {
    return useQuery({
        queryKey: ["forum-topics", categoryId],
        queryFn: async () => {
            let query = supabase
                .from("forum_topics")
                .select(`
                    *,
                    category:forum_categories(name)
                `)
                .order("is_pinned", { ascending: false })
                .order("created_at", { ascending: false })
            
            if (categoryId) {
                query = query.eq("category_id", categoryId)
            }
            
            const { data, error } = await query
            if (error) throw error
            return data
        },
    })
}

function useUserTopics() {
    return useQuery({
        queryKey: ["user-topics"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return []
            
            const { data, error } = await supabase
                .from("forum_topics")
                .select(`
                    *,
                    category:forum_categories(name)
                `)
                .eq("created_by", user.id)
                .order("created_at", { ascending: false })
            if (error) throw error
            return data
        },
    })
}

export default function ForumPage() {
    const { t } = useTranslation()
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [newTopicOpen, setNewTopicOpen] = useState(false)
    
    const { data: categories = [], isLoading: categoriesLoading } = useForumCategories()
    const { data: topics = [], isLoading: topicsLoading } = useForumTopics(selectedCategory)
    const { data: userTopics = [], isLoading: userTopicsLoading } = useUserTopics()

    const filteredTopics = (topics || []).filter(topic => {
        if (!search) return true
        const title = topic.title?.toLowerCase() || ""
        return title.includes(search.toLowerCase())
    })

    const getCategoryInfo = (categoryId: string) => {
        const category = categories?.find(c => c.id === categoryId)
        return {
            name: category?.name || "Unknown",
            icon: CATEGORY_ICONS[categoryId] || MessageSquare,
            color: CATEGORY_COLORS[categoryId] || "text-gray-500",
        }
    }

    return (
        <div className="space-y-6 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{t("nav.forum")}</h1>
                    <p className="text-muted-foreground">
                        {t("forum.desc", "Espace d'echange communautaire")}
                    </p>
                </div>
                <Dialog open={newTopicOpen} onOpenChange={setNewTopicOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t("forum.newTopic", "Nouveau sujet")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{t("forum.createTopic", "Creer un nouveau sujet")}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>{t("forum.topicTitle", "Titre")}</Label>
                                <Input placeholder="Titre du sujet..." />
                            </div>
                            <div>
                                <Label>{t("forum.category", "Categorie")}</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {(categories || []).slice(0, 4).map(cat => {
                                        const Icon = CATEGORY_ICONS[cat.id] || MessageSquare
                                        return (
                                            <Card key={cat.id} className="cursor-pointer hover:shadow-md p-3">
                                                <div className="flex items-center gap-2">
                                                    <Icon className={`h-4 w-4 ${CATEGORY_COLORS[cat.id] || "text-gray-500"}`} />
                                                    <span className="text-sm">{cat.name}</span>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                            <div>
                                <Label>{t("forum.description", "Description")}</Label>
                                <Textarea placeholder="Description du sujet..." />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setNewTopicOpen(false)}>
                                    {t("common.cancel", "Annuler")}
                                </Button>
                                <Button onClick={() => setNewTopicOpen(false)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t("forum.publish", "Publier")}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t("common.search", "Rechercher...")}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    {t("forum.filter", "Filtrer")}
                </Button>
            </div>

            <Tabs defaultValue="topics" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="topics">
                        <MessageSquareText className="mr-2 h-4 w-4" />
                        {t("forum.allTopics", "Tous les sujets")}
                    </TabsTrigger>
                    <TabsTrigger value="recent">
                        <Clock className="mr-2 h-4 w-4" />
                        {t("forum.recent", "Recentes")}
                    </TabsTrigger>
                    <TabsTrigger value="my">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {t("nav.myTopics")}
                    </TabsTrigger>
                    <TabsTrigger value="categories">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {t("forum.categories", "Categories")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="topics">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="md:col-span-3 space-y-3">
                            {topicsLoading ? (
                                <Card><CardContent className="py-8 text-center">Loading...</CardContent></Card>
                            ) : filteredTopics.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center text-muted-foreground">
                                        <MessageSquareText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                        <p>{t("common.noData")}</p>
                                    </CardContent>
                                </Card>
                            ) : filteredTopics.map(topic => {
                                const catInfo = getCategoryInfo(topic.category_id)
                                const Icon = catInfo.icon
                                return (
                                    <Card key={topic.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        {topic.is_pinned && <Pin className="h-4 w-4 text-yellow-500" />}
                                                        <CardTitle className="text-base">{topic.title}</CardTitle>
                                                    </div>
                                                    <CardDescription>
                                                        {catInfo.name} • {topic.profiles?.full_name || topic.created_by} • {new Date(topic.created_at).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                                <Button variant="ghost" size="icon">
                                                    <Flag className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {topic.views || 0}
                                                    </span>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <MessageSquare className="mr-1 h-4 w-4" />
                                                    Voir
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">{t("forum.categories", "Categories")}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {categoriesLoading ? (
                                        <p>Loading...</p>
                                    ) : (categories || []).map(cat => {
                                        const Icon = CATEGORY_ICONS[cat.id] || MessageSquare
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                                                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                                                    selectedCategory === cat.id
                                                        ? "bg-primary/10 text-primary"
                                                        : "hover:bg-muted"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Icon className={`h-4 w-4 ${CATEGORY_COLORS[cat.id] || "text-gray-500"}`} />
                                                    <span className="truncate">{cat.name}</span>
                                                </div>
                                                <Badge variant="secondary">{cat.id ? "0" : ""}</Badge>
                                            </button>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="recent">
                    <div className="grid gap-4">
                        {(topicsLoading ? [] : (topics || []).slice(0, 10)).map(topic => {
                            const catInfo = getCategoryInfo(topic.category_id)
                            return (
                                <Card key={topic.id}>
                                    <CardContent className="p-4">
                                        <p className="font-medium">{topic.title}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {catInfo.name} • {new Date(topic.created_at).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="my">
                    <div className="grid gap-4">
                        {userTopicsLoading ? (
                            <Card><CardContent className="py-8 text-center">Loading...</CardContent></Card>
                        ) : (userTopics || []).length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>{t("common.noData")}</p>
                                </CardContent>
                            </Card>
                        ) : (userTopics || []).map(topic => (
                            <Card key={topic.id}>
                                <CardContent className="p-4">
                                    <p className="font-medium">{topic.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(topic.created_at).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="categories">
                    <div className="grid gap-4 md:grid-cols-2">
                        {(categoriesLoading ? [] : categories || []).map(cat => {
                            const Icon = CATEGORY_ICONS[cat.id] || MessageSquare
                            return (
                                <Card key={cat.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                            <Icon className={`h-6 w-6 ${CATEGORY_COLORS[cat.id] || "text-gray-500"}`} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{cat.name}</CardTitle>
                                            <CardDescription>{cat.description || ""}</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}