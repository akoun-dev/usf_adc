import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, Tag as TagIcon } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { mockNews } from '../data/mockNews';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHero from '@/components/PageHero';
import { useTranslation } from 'react-i18next';

export default function NewsDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const article = mockNews.find(n => n.id === id);

  if (!article) {
    return (
      <PublicLayout>
        <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
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
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/actualites" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux actualités
          </Link>
        </Button>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary">{article.category}</Badge>
              <Badge variant="outline">{article.source}</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{article.title}</h1>

            <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>

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
                alt={article.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            {article.content.split('\n').map((paragraph, i) => {
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
            {mockNews
              .filter(n => n.id !== article.id && (n.category === article.category || n.tags?.some(t => article.tags?.includes(t))))
              .slice(0, 2)
              .map((related) => (
                <Link key={related.id} to={`/actualites/${related.id}`} className="group">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {related.image_url && (
                      <img
                        src={related.image_url}
                        alt={related.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardContent className="p-4">
                      <Badge className="mb-2 text-xs">{related.category}</Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{related.excerpt}</p>
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
