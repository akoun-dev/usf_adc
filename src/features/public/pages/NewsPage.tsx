import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Search, Calendar, Filter, Mail, Share2, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { usePublicNews, NewsArticle } from '../hooks/usePublicNews';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import PageHero from '@/components/PageHero';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SOURCES = ['all', 'UAT', 'ANSUT', 'UIT', 'Smart Africa'];
const CATEGORIES = ['all', 'Financement', 'Partenariat', 'Événement', 'Certification', 'Appel à projets', 'Rapport', 'Formation', 'Innovation'];

const getCategoryColor = (category: string | null) => {
  const colors: Record<string, string> = {
    'Financement': 'bg-green-500/10 text-green-700 dark:text-green-400',
    'Partenariat': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    'Événement': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    'Certification': 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    'Appel à projets': 'bg-red-500/10 text-red-700 dark:text-red-400',
    'Rapport': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
    'Formation': 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
    'Innovation': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
    'Annonce': 'bg-slate-500/10 text-slate-700 dark:text-slate-400',
  };
  return colors[category || ''] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
};

const getSourceColor = (source: string | null) => {
  const colors: Record<string, string> = {
    'UAT': 'bg-primary text-primary-foreground',
    'ANSUT': 'bg-secondary text-secondary-foreground',
    'UIT': 'bg-accent text-accent-foreground',
    'Smart Africa': 'bg-muted text-muted-foreground',
  };
  return colors[source || ''] || 'bg-muted text-muted-foreground';
};

function NewsCard({ article, featured = false }: { article: NewsArticle; featured?: boolean }) {
  const { t } = useTranslation();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          url: window.location.origin + `/actualites/${article.id}`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  if (featured) {
    return (
      <Link to={`/actualites/${article.id}`} className="block">
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
        <div className="relative h-64 sm:h-80 overflow-hidden">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
              <Newspaper className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={getSourceColor(article.source)}>{article.source}</Badge>
            {article.category && (
              <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
            )}
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            {article.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
            {article.read_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.read_time}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {article.excerpt || article.content.substring(0, 200) + '...'}
          </p>
          {article.author && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
          )}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 4).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <Button variant="link" className="px-0 h-auto">
              {t('public.news.readMore')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      </Link>
    );
  }

  return (
    <Link to={`/actualites/${article.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      {article.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`${getSourceColor(article.source)} text-xs`}>{article.source}</Badge>
          </div>
        </div>
      )}
      <CardContent className={`p-5 flex-1 flex flex-col ${!article.image_url ? 'pt-5' : ''}`}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {article.category && (
            <Badge className={`${getCategoryColor(article.category)} text-xs`}>{article.category}</Badge>
          )}
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
          {article.excerpt || article.content.substring(0, 120) + '...'}
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {article.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
            )}
            {article.read_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.read_time}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between pt-3 border-t">
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-xs text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handleShare}
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}

export default function NewsPage() {
  const { t } = useTranslation();
  const { data: news, isLoading } = usePublicNews();
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('all');
  const [category, setCategory] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filtered = (news || []).filter((article) => {
    const matchSearch = !search ||
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(search.toLowerCase())) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())));
    const matchSource = source === 'all' || article.source === source;
    const matchCategory = category === 'all' || article.category === category;
    return matchSearch && matchSource && matchCategory;
  });

  const featured = filtered.slice(0, 3);
  const regular = filtered.slice(3);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHero
          title={t('public.news.pageTitle')}
          description={t('public.news.pageDesc')}
          icon={<Newspaper className="h-6 w-6 text-secondary" />}
        />

        {/* Newsletter Subscription */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {t('public.news.subscribeTitle')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('public.news.subscribeDesc')}
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <Input
                  type="email"
                  placeholder={t('public.news.emailPlaceholder')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 md:w-72"
                  required
                />
                <Button type="submit" disabled={subscribed} className="whitespace-nowrap">
                  {subscribed ? '✓ ' + t('public.news.subscribed') : t('public.news.subscribe')}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('public.news.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOURCES.map(s => (
                <SelectItem key={s} value={s}>
                  {s === 'all' ? t('public.news.allSources') : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>
                  {c === 'all' ? t('public.news.allCategories') : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <Newspaper className="mx-auto h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">
                {t('public.news.noNews')}
              </p>
              <p className="text-sm">
                {t('public.news.tryOtherFilters')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Featured Articles */}
            {featured.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full" />
                  {t('public.news.featured')}
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featured.map((article) => (
                    <NewsCard key={article.id} article={article} featured />
                  ))}
                </div>
              </section>
            )}

            {/* Regular Articles */}
            {regular.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-secondary rounded-full" />
                  {t('public.news.moreNews')}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {regular.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
