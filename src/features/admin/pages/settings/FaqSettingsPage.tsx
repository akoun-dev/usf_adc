import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, BookOpen, Plus, Edit, Trash2, Eye, EyeOff, Search } from "lucide-react"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import { useFaqArticles } from "../../hooks/useFaqArticles"
import { useCreateFaqArticle, useUpdateFaqArticle, useDeleteFaqArticle } from "../../hooks/useFaqMutations"
import type { FaqArticle } from "../../types"

const getCategories = (t: (key: string, fallback?: string) => string) => [
  { value: 'general', label: t('admin.categoryGeneral', 'General'), color: 'bg-[#00833d]/20 text-[#00833d] border-[#00833d]/50' },
  { value: 'account', label: t('admin.categoryAccount', 'Account'), color: 'bg-[#00833d]/20 text-[#00833d] border-[#00833d]/50' },
  { value: 'fsu', label: t('admin.categoryFsu', 'FSU'), color: 'bg-[#ffe700]/30 text-[#00833d] border-[#00833d]/50' },
  { value: 'events', label: t('admin.categoryEvents', 'Events'), color: 'bg-[#ffe700]/30 text-[#00833d] border-[#00833d]/50' },
  { value: 'documents', label: t('admin.categoryDocuments', 'Documents'), color: 'bg-[#00833d]/20 text-[#00833d] border-[#00833d]/50' },
]

export default function FaqSettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const categories = useMemo(() => getCategories(t), [t])
  const { data: articles = [], isLoading } = useFaqArticles()
  const createMutation = useCreateFaqArticle()
  const updateMutation = useUpdateFaqArticle()
  const deleteMutation = useDeleteFaqArticle()

  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<FaqArticle, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    content: '',
    category: 'general',
    sort_order: 0,
    is_published: true,
  })

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startEdit = (article: FaqArticle) => {
    setEditingId(article.id)
    setForm({
      title: article.title,
      content: article.content,
      category: article.category,
      sort_order: article.sort_order,
      is_published: article.is_published,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ title: '', content: '', category: 'general', sort_order: 0, is_published: true })
  }

  const saveArticle = () => {
    if (editingId) {
      updateMutation.mutate(
        { id: editingId, input: form },
        {
          onSuccess: () => {
            toast({ title: t('admin.articleUpdated', 'Article mis à jour') })
            cancelEdit()
          },
          onError: () => {
            toast({ title: t('admin.error', 'Erreur lors de la mise à jour'), variant: 'destructive' })
          },
        }
      )
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          toast({ title: t('admin.articleCreated', 'Article créé') })
          cancelEdit()
        },
        onError: () => {
          toast({ title: t('admin.error', 'Erreur lors de la création'), variant: 'destructive' })
        },
      })
    }
  }

  const deleteArticle = (id: string) => {
    if (!confirm(t('admin.deleteArticleConfirm', 'Êtes-vous sûr de vouloir supprimer cet article ?'))) return
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: t('admin.articleDeleted', 'Article supprimé') })
      },
      onError: () => {
        toast({ title: t('admin.error', 'Erreur lors de la suppression'), variant: 'destructive' })
      },
    })
  }

  const togglePublished = (article: FaqArticle) => {
    updateMutation.mutate(
      { id: article.id, input: { is_published: !article.is_published } },
      {
        onSuccess: () => {
          toast({
            title: article.is_published
              ? t('admin.articleUnpublished', 'Article dépublié')
              : t('admin.articlePublished', 'Article publié'),
          })
        },
        onError: () => {
          toast({ title: t('admin.error', 'Erreur lors de la mise à jour'), variant: 'destructive' })
        },
      }
    )
  }

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0]
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00833d] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/settings')}
          className="hover:bg-[#00833d]/10 hover:text-[#00833d]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#00833d]">
            {t('admin.faqManagement', 'Gestion de la FAQ')}
          </h1>
          <p className="text-muted-foreground">
            {t('admin.faqManagementDesc', 'Gérez les articles de la Foire Aux Questions')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.totalArticles', 'Total des articles')}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">
              {articles.filter(a => a.is_published).length} {t('admin.published', 'publiés')}
            </p>
          </CardContent>
        </Card>

        {categories.slice(0, 3).map(cat => (
          <Card key={cat.value}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{cat.label}</CardTitle>
              <Badge variant="outline" className={cat.color}>
                {articles.filter(a => a.category === cat.value).length}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.filter(a => a.category === cat.value && a.is_published).length}
              </div>
              <p className="text-xs text-muted-foreground">{t('admin.published', 'publiés')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? t('admin.editArticle', "Modifier l'article") : t('admin.createArticle', 'Créer un article')}
          </CardTitle>
          <CardDescription>
            {editingId
              ? t('admin.editArticleDesc', 'Modifiez les détails de l\'article FAQ')
              : t('admin.createArticleDesc', 'Créez un nouvel article FAQ')
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('admin.title', 'Titre')}</Label>
              <Input
                placeholder={t('admin.articleTitlePlaceholder', 'Ex: Comment créer un compte ?')}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.category', 'Catégorie')}</Label>
              <div className="flex gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat.value}
                    type="button"
                    variant={form.category === cat.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setForm({ ...form, category: cat.value })}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('admin.content', 'Contenu')}</Label>
            <Textarea
              placeholder={t('admin.articleContentPlaceholder', 'Rédigez la réponse détaillée...')}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_published}
                onCheckedChange={(checked) => setForm({ ...form, is_published: checked })}
              />
              <Label>{t('admin.publishArticle', 'Publier l\'article')}</Label>
            </div>
            <div className="flex gap-2">
              {editingId && (
                <Button variant="outline" onClick={cancelEdit}>
                  {t('admin.cancel', 'Annuler')}
                </Button>
              )}
              <Button
                onClick={saveArticle}
                disabled={!form.title || !form.content || createMutation.isPending || updateMutation.isPending}
              >
                {editingId ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    {t('admin.update', 'Mettre à jour')}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.create', 'Créer')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and List */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.searchArticlesPlaceholder', 'Rechercher un article...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.articlesList', 'Liste des articles')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{article.title}</h3>
                      <Badge variant="outline" className={getCategoryInfo(article.category).color}>
                        {getCategoryInfo(article.category).label}
                      </Badge>
                      {article.is_published ? (
                        <Badge variant="default" className="bg-green-500/20 text-green-500 border-green-500/50">
                          <Eye className="h-3 w-3 mr-1" />
                          {t('admin.published', 'Publié')}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 mr-1" />
                          {t('admin.draft', 'Brouillon')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => togglePublished(article)}
                      disabled={updateMutation.isPending}
                    >
                      {article.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => startEdit(article)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteArticle(article.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredArticles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {t('admin.noArticlesFound', 'Aucun article trouvé')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
