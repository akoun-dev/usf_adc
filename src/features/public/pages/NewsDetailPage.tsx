import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Clock, Share2, Tag as TagIcon, Newspaper, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useNewsArticle, usePublicNews } from '../hooks/usePublicNews';
import { MiniCalendar } from '../components/MiniCalendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
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



      <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">
        <Button asChild variant="ghost" className="mb-6 hover:bg-primary/5 transition-colors">
          <Link to="/actualites" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.backToNews', 'Retour aux actualités')}
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article>
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary/10 text-primary border-none">{getLangValue(article.category, i18n.language)}</Badge>
                  <Badge variant="outline" className="border-primary/20">{article.source}</Badge>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight text-foreground">{getLangValue(article.title, i18n.language)}</h1>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed italic border-l-4 border-primary/20 pl-6">{getLangValue(article.excerpt, i18n.language)}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/5 rounded-md">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground/80">{article.author || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/5 rounded-md">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground/80">
                      {article.published_at 
                        ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Date non disponible'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/5 rounded-md">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground/80">
                      {article.read_time ? `${article.read_time} de lecture` : 'Lecture rapide'}
                    </span>
                  </div>
                </div>
              </header>

              {article.image_url && (
                <div className="mb-10 rounded-2xl overflow-hidden shadow-md border border-gray-100 group">
                  <img
                    src={article.image_url}
                    alt={getLangValue(article.title, i18n.language)}
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none mb-12 dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: getLangValue(article.content, i18n.language) }}
              />

              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center gap-3 mb-10 pt-6 border-t border-gray-100">
                  <TagIcon className="h-4 w-4 text-primary" />
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors border-none">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
              <div className="h-1.5 bg-primary w-full" />
              <CardContent className="p-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Partager l'article
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Faites connaître cette actualité à votre réseau et contribuez à la diffusion de l'information.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                    Facebook
                  </Button>
                  <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                    LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 px-1">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Agenda USF
              </h3>
              <MiniCalendar />
            </div>

            <Card className="border-dashed bg-primary/5 border-primary/20 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm transform -rotate-3 group-hover:rotate-0 transition-transform">
                  <Newspaper className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-bold mb-2">Restez informé</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Inscrivez-vous à notre newsletter pour recevoir les dernières actualités.
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90 shadow-md">
                  S'abonner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="mt-24 pt-12 border-t border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">
                {t('public.news.relatedArticles', 'Articles Similaires')}
              </h2>
              <div className="h-1.5 w-24 bg-primary rounded-full" />
            </div>
            <div className="hidden md:flex gap-2">
              {/* Custom Navigation for Carousel could go here, but we use CarouselPrevious/Next */}
            </div>
          </div>

          <div className="relative px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full py-4"
            >
              <CarouselContent className="-ml-6 py-6">
                {allNews
                  .filter(n => n.id !== article.id)
                  .map((newsItem) => (
                    <CarouselItem key={newsItem.id} className="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <NewsCard item={newsItem} locale={i18n.language} />
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="-left-16 bg-white hover:bg-primary hover:text-white border-primary/20 transition-all shadow-md h-12 w-12" />
              <CarouselNext className="-right-16 bg-white hover:bg-primary hover:text-white border-primary/20 transition-all shadow-md h-12 w-12" />
            </Carousel>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

function NewsCard({ item, locale }: { item: any; locale: string }) {
  const { t } = useTranslation();

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-500 overflow-hidden border-none bg-white group flex flex-col rounded-2xl">
      {item.image_url && (
        <div className="relative h-48 overflow-hidden shrink-0">
          <img
            src={item.image_url}
            alt={getLangValue(item.title, locale)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          <Badge className="absolute top-4 right-4 bg-primary text-white border-none shadow-lg">
            {getLangValue(item.category, locale)}
          </Badge>
        </div>
      )}

      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-1 rounded">
            <CalendarIcon className="h-3 w-3" />
            {item.published_at 
              ? new Date(item.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
              : 'N/A'}
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <User className="h-3 w-3" />
            {item.author?.split(' ')[0] || 'Admin'}
          </div>
        </div>

        <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {getLangValue(item.title, locale)}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed flex-1">
          {getLangValue(item.excerpt, locale) || stripHtml(getLangValue(item.content, locale)).substring(0, 120) + '...'}
        </p>

        <div className="pt-4 border-t border-gray-100 mt-auto">
          <Button asChild size="sm" className="w-full bg-gray-50 hover:bg-primary text-primary hover:text-white border-none transition-all duration-300 font-bold text-xs uppercase tracking-widest">
            <Link to={`/actualites/${item.id}`}>
              Lire l'article
              <ArrowLeft className="h-3.5 w-3.5 ml-2 rotate-180" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
