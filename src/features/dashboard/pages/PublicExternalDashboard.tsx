import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePublicNews } from '@/features/public/hooks/usePublicNews';
import { useNewsletters } from '@/features/newsletters/hooks/useNewsletters';
import PageHero from '@/components/PageHero';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen, Map, Bell, BookOpen, LayoutDashboard, ArrowRight, Newspaper, Calendar, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickLinks = [
  { titleKey: 'dashboard.publicDocuments', descKey: 'dashboard.publicDocumentsDesc', icon: FolderOpen, path: '/documents' },
  { titleKey: 'dashboard.projectsMap', descKey: 'dashboard.projectsMapDesc', icon: Map, path: '/map' },
  { titleKey: 'nav.notifications', descKey: 'dashboard.notificationsDesc', icon: Bell, path: '/notifications' },
  { titleKey: 'nav.faq', descKey: 'dashboard.faqDesc', icon: BookOpen, path: '/faq' },
] as const;

export default function PublicExternalDashboard() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { data: news, isLoading: newsLoading } = usePublicNews();
  const { data: newsletters = [], isLoading: nlLoading } = useNewsletters();

  const displayName = profile?.full_name || '';
  const latestNews = (news ?? []).slice(0, 3);
  const latestNewsletters = newsletters.filter(n => n.is_published).slice(0, 3);

  return (
    <>
      <PageHero
        title={t('dashboard.hello', { name: displayName })}
        description={t('dashboard.welcomePublicDesc')}
        icon={<LayoutDashboard className="h-6 w-6 text-white" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ titleKey, descKey, icon: Icon, path }) => (
          <Card
            key={path}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate(path)}
          >
            <CardHeader className="flex flex-row items-start gap-3 space-y-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">{t(titleKey)}</CardTitle>
                <CardDescription className="mt-1 text-xs">{t(descKey)}</CardDescription>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Latest News Widget */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{t('dashboard.latestNews', 'Dernières actualités')}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/news')} className="gap-1">
            {t('dashboard.seeAll', 'Voir tout')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {newsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : latestNews.map((article) => (
                <Card
                  key={article.id}
                  className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
                  onClick={() => navigate(`/news/${article.id}`)}
                >
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="h-32 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <CardContent className="p-3">
                    {article.category && (
                      <Badge variant="secondary" className="mb-1.5 text-xs">
                        {article.category}
                      </Badge>
                    )}
                    <h4 className="line-clamp-2 text-sm font-medium leading-tight">{article.title}</h4>
                    {article.published_at && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.published_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
        </CardContent>
      </Card>

      {/* Latest Newsletters Widget */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{t('dashboard.latestNewsletters', 'Derniers bulletins')}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/newsletters')} className="gap-1">
            {t('dashboard.seeAll', 'Voir tout')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {nlLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : latestNewsletters.length === 0
              ? <p className="col-span-3 text-sm text-muted-foreground py-4 text-center">{t('newsletters.noNewsletters', 'Aucun bulletin disponible')}</p>
              : latestNewsletters.map((nl) => (
                <Card
                  key={nl.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => navigate('/newsletters')}
                >
                  <CardContent className="p-4">
                    <h4 className="line-clamp-2 text-sm font-medium leading-tight">{nl.title}</h4>
                    {nl.summary && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{nl.summary}</p>
                    )}
                    {nl.published_at && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(nl.published_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {nl.target_roles.map((role) => (
                        <Badge key={role} variant="secondary" className="text-[10px]">
                          {t(`invitations.roles.${role}`)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
        </CardContent>
      </Card>
    </>
  );
}
