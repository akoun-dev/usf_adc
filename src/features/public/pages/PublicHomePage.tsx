import {
  MapPin, FileText, Newspaper, Users, ArrowRight, Calendar,
  BookOpen, MessageSquare, Briefcase, TrendingUp, Shield, Globe, Clock, GraduationCap, Bell,
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { usePublicNews } from '../hooks/usePublicNews';
import { usePublicEvents } from '../hooks/usePublicEvents';
import { useAnnouncements } from '@/features/elearning/hooks/useAnnouncements';
import { useTranslation } from 'react-i18next';
import { getLangValue } from '@/types/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import atuLogo from '@/assets/atu-uat-logo.png';

const features = [
  {
    icon: MapPin,
    titleKey: 'public.features.map.title',
    descKey: 'public.features.map.desc',
    href: '/carte-public',
  },
  {
    icon: FileText,
    titleKey: 'public.features.documents.title',
    descKey: 'public.features.documents.desc',
    href: '/documents-publics',
  },
  {
    icon: Newspaper,
    titleKey: 'public.features.news.title',
    descKey: 'public.features.news.desc',
    href: '/actualites',
  },
  {
    icon: MessageSquare,
    titleKey: 'public.features.forum.title',
    descKey: 'public.features.forum.desc',
    href: '/forum-public',
  },
  {
    icon: Briefcase,
    titleKey: 'public.features.calls.title',
    descKey: 'public.features.calls.desc',
    href: '/projets',
  },
  {
    icon: Calendar,
    titleKey: 'public.features.calendar.title',
    descKey: 'public.features.calendar.desc',
    href: '/calendrier',
  },
];

const stats = [
  { value: '54', labelKey: 'public.stats.countries', icon: Globe },
  { value: '2FA', labelKey: 'public.stats.security', icon: Shield },
  { value: '24/7', labelKey: 'public.stats.availability', icon: TrendingUp },
  { value: '100%', labelKey: 'public.stats.traceability', icon: Users },
];

export default function PublicHomePage() {
  const { t, i18n } = useTranslation();
  const { data: news, isLoading: newsLoading } = usePublicNews();
  const { data: events, isLoading: eventsLoading } = usePublicEvents();
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-muted/30 border-b">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{t('public.hero.badge')}</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {t('public.hero.title')}
              <br />
              <span className="text-primary">{t('public.hero.subtitle')}</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
              {t('public.hero.description')}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/carte-public">
                  {t('public.hero.viewMap')}
                  <MapPin className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.labelKey} className="rounded-xl bg-background p-5 text-center border">
                <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{t(s.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="w-full px-6 lg:px-12">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">{t('public.features.badge')}</Badge>
            <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
              {t('public.features.title')}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('public.features.description')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Link key={f.href} to={f.href}>
                <Card className="h-full hover:-translate-y-1 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{t(f.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(f.descKey)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="secondary" className="mb-4">{t('public.news.badge')}</Badge>
              <h2 className="text-3xl font-bold">{t('public.news.title')}</h2>
            </div>
            <Link
              to="/actualites"
              className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors"
            >
              {t('public.news.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {newsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-3" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : news && news.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: false,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: true,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {news.map((article) => (
                  <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                    <Link
                      to={`/actualites/${article.id}`}
                      className="block h-full pointer-events-auto"
                      onPointerDown={e => e.stopPropagation()}
                    >
                      <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                        {article.image_url && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={article.image_url}
                              alt={getLangValue(article.title, i18n.language)}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            {article.source && (
                              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                                {article.source}
                              </Badge>
                            )}
                          </div>
                        )}
                        <CardContent className="p-6">
                          {article.category && (
                            <Badge variant="secondary" className="mb-3">{getLangValue(article.category, i18n.language)}</Badge>
                          )}
                          <h3 className="mb-2 font-semibold text-foreground line-clamp-2">{getLangValue(article.title, i18n.language)}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {getLangValue(article.excerpt, i18n.language) || getLangValue(article.content, i18n.language)}
                          </p>
                          <span className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                            {t('public.news.readMore')}
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('public.news.noNews')}
            </div>
          )}
        </div>
      </section>

      {/* Events Preview Section */}
      <section className="py-20 bg-background">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="secondary" className="mb-4">{t('public.events.badge')}</Badge>
              <h2 className="text-3xl font-bold">{t('public.events.title')}</h2>
            </div>
            <Link
              to="/calendrier"
              className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors"
            >
              {t('public.events.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {eventsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: false,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: true,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {events.map((event) => (
                  <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                    <Link
                      to={`/calendrier/${event.id}`}
                      className="block h-full pointer-events-auto"
                      onPointerDown={e => e.stopPropagation()}
                    >
                      <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                        {event.image_url && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={event.image_url}
                              alt={getLangValue(event.title, i18n.language)}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            {event.event_type && (
                              <Badge className="absolute top-3 left-3 bg-secondary text-gray-900 text-xs">
                                {t(`public.eventTypes.${event.event_type}`)}
                              </Badge>
                            )}
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-primary/10 text-primary">{t(`public.eventTypes.${event.event_type}`)}</Badge>
                          </div>
                          <h3 className="mb-2 font-semibold text-foreground line-clamp-1">{getLangValue(event.title, i18n.language)}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {new Date(event.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {getLangValue(event.location, i18n.language)}
                              </span>
                            )}
                            {event.start_date && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(event.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('public.events.noEvents')}
            </div>
          )}
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-20 bg-muted/30">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{t('elearning.announcements')}</h2>
              <p className="text-muted-foreground">{t('elearning.announcementsDesc', 'Dernières nouvelles et opportunités de formation')}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcementsLoading ? (
              [1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : announcements?.slice(0, 3).map(announcement => (
              <Card key={announcement.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                      {announcement.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(announcement.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {announcement.content}
                  </p>
                  {announcement.training_id && (
                    <Button variant="link" asChild className="p-0 h-auto text-primary">
                      <Link to={`/elearning/training/${announcement.training_id}`} className="flex items-center gap-1">
                        {t('elearning.viewTraining', 'Voir la formation')}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            {(!announcements || announcements.length === 0) && !announcementsLoading && (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-background rounded-xl border border-dashed">
                <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>{t('elearning.noAnnouncements', 'Aucune annonce pour le moment')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Authority Message Section */}
      <section className="py-20 bg-muted/30">
        <div className="w-full px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* DG Message */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t('public.authorities.dgName')}</h3>
                    <p className="text-sm text-muted-foreground">{t('public.authorities.dgTitle')}</p>
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic">
                  "{t('public.authorities.dgMessage')}"
                </blockquote>
              </CardContent>
            </Card>

            {/* SG Message */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t('public.authorities.sgName')}</h3>
                    <p className="text-sm text-muted-foreground">{t('public.authorities.sgTitle')}</p>
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic">
                  "{t('public.authorities.sgMessage')}"
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="w-full px-6 text-center lg:px-12">
          <h2 className="text-3xl font-bold lg:text-4xl mb-6">
            {t('public.cta.title')}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {t('public.cta.description')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="outline" className="h-13 px-8 text-base bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
              <a href="mailto:contact@atuuat.africa">
                {t('public.cta.contact')}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
