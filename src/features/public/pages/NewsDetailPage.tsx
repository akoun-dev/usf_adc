import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, Tag as TagIcon } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useNewsArticle, usePublicNews } from '../hooks/usePublicNews';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHero from '@/components/PageHero';
import { useTranslation } from 'react-i18next';
import { getLangValue } from '@/types/i18n';
import bgHeader from '@/assets/bg-header.jpg';


export default function NewsDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading } = useNewsArticle(id ?? '');
  const { data: allNews = [] } = usePublicNews();

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="w-full px-4 py-16 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!article) {
    return (
      <PublicLayout>
        <div className="w-full px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <Button asChild>
            <Link to="/actualites">Retour aux actualités</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const publishDate = new Date(article.published_at);

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
              {t('public.news.pageTitle')}
            </h1>
            <p className="text-xl text-base !mt-2">
              {t("public.news.pageDesc")}
            </p>
          </div>
        </div>

      </div>



      <div className="w-full px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/actualites" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.backToNews', 'Retour aux actualités')}
          </Link>
        </Button>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary">{getLangValue(article.category, i18n.language)}</Badge>
              <Badge variant="outline">{article.source}</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{getLangValue(article.title, i18n.language)}</h1>

            <p className="text-xl text-muted-foreground mb-6">{getLangValue(article.excerpt, i18n.language)}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publishDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.read_time} de lecture</span>
              </div>
            </div>
          </header>

          {article.image_url && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={article.image_url}
                alt={getLangValue(article.title, i18n.language)}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            {getLangValue(article.content, i18n.language).split('\n').map((paragraph: string, i: number) => {
              if (paragraph.trim().startsWith('-')) {
                return (
                  <li key={i} className="ml-4">{paragraph.replace(/^-/, '').trim()}</li>
                );
              }
              if (paragraph.trim().startsWith('**')) {
                return (
                  <h3 key={i} className="text-xl font-bold mt-6 mb-3">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              if (paragraph.trim() === '') {
                return <br key={i} />;
              }
              return (
                <p key={i} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-8">
              <TagIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Partager cet article</h3>
                  <p className="text-sm text-muted-foreground">
                    Faire connaître cette actualité
                  </p>
                </div>
                <Button size="sm" variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>

        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {allNews
              .filter(n => n.id !== article.id && (n.category === article.category || n.tags?.some(t => article.tags?.includes(t))))
              .slice(0, 2)
              .map((related) => (
                <Link key={related.id} to={`/actualites/${related.id}`} className="group">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {related.image_url && (
                      <img
                        src={related.image_url}
                        alt={getLangValue(related.title, i18n.language)}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardContent className="p-4">
                      <Badge className="mb-2 text-xs">{getLangValue(related.category, i18n.language)}</Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {getLangValue(related.title, i18n.language)}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{getLangValue(related.excerpt, i18n.language)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
