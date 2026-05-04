import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Building2, Calendar, CalendarRange, DollarSign, Download, FileText, Mail, MapPin, Newspaper, Phone, TrendingUp, User, Users } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useCountryByISO } from '../hooks/useCountries';
import { usePublicProjectsByCountry } from '../hooks/usePublicProjects';
import { useNewsByCountry } from '../hooks/usePublicNews';
import { usePublicDocumentsByCountry } from '../hooks/usePublicDocuments';
import { useEventsByCountry } from '../hooks/usePublicEvents';
import { getLangValue } from '@/types/i18n';
import type { ProjectWithDetails } from '../services/projects.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

type TTranslate = (key: string, options?: Record<string, unknown>) => string;
type CountryStatusFilter = 'all' | 'active' | 'completed';

function getStatusLabels(t: TTranslate): Record<string, { label: string; color: string }> {
  return {
    'planned': { label: t('public.memberCountries.status.planned'), color: 'bg-slate-500/10 text-slate-700 dark:text-slate-400' },
    'in_progress': { label: t('public.memberCountries.status.in_progress'), color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
    'completed': { label: t('public.memberCountries.status.completed'), color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
    'suspended': { label: t('public.memberCountries.status.suspended'), color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  };
}

function ProjectCard({ project, t, locale }: { project: ProjectWithDetails; t: TTranslate; locale: string }) {
  const statusLabels = getStatusLabels(t);
  const statusInfo = statusLabels[project.status] || statusLabels['planned'];
  const startDate = project.start_date ? new Date(project.start_date) : null;
  const endDate = project.end_date ? new Date(project.end_date) : null;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {project.country?.flag_url && (
                <img
                  src={project.country.flag_url}
                  alt={project.country.name_fr}
                  className="h-5 w-auto"
                />
              )}
              <h3 className="font-bold text-lg">{project.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{project.region || project.country?.region || ''}</p>
          </div>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{t('public.memberCountries.project.budget')} {project.budget ? `${project.budget.toLocaleString(locale)} FCFA` : t('public.memberCountries.project.budgetNotAvailable')}</span>
          </div>
          {project.beneficiaries && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{t('public.memberCountries.project.beneficiaries', { count: project.beneficiaries })}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {startDate ? startDate.toLocaleDateString(locale) : '—'} - {endDate ? endDate.toLocaleDateString(locale) : '—'}
            </span>
          </div>
          {project.latitude && project.longitude && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {t('public.memberCountries.project.location', {
                  latitude: project.latitude.toFixed(4),
                  longitude: project.longitude.toFixed(4)
                })}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/carte-public" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {t('public.memberCountries.viewOnMap')}
            </Link>
          </Button>
          <Button asChild size="sm" className="w-full">
            <Link to={`/projets/${project.id}`} className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              {t('common.details', { defaultValue: 'Détails' })}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CountryProjectsPage() {
  const { t, i18n } = useTranslation();
  const { countryCode } = useParams<{ countryCode: string }>();
  const [activeTab, setActiveTab] = useState<CountryStatusFilter>('all');
  const [selectedThematic, setSelectedThematic] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'ar' ? 'ar-SA' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const { data: country, isLoading: countryLoading } = useCountryByISO(countryCode ?? '');
  const { data: rawProjects = [], isLoading } = usePublicProjectsByCountry(countryCode ?? '');
  const { data: news = [], isLoading: isLoadingNews } = useNewsByCountry(country?.id ?? '', 4);
  const { data: documents = [], isLoading: isLoadingDocs } = usePublicDocumentsByCountry(country?.id ?? '');
  const { data: events = [], isLoading: isLoadingEvents } = useEventsByCountry(country?.id ?? '');

  const visibleProjects = useMemo(
    () => rawProjects.filter((project) => project.status === 'in_progress' || project.status === 'completed'),
    [rawProjects],
  );

  const uniqueThematics = useMemo(() => {
    const thematics = visibleProjects
      .map(p => p.thematic)
      .filter((t): t is string => !!t);
    return Array.from(new Set(thematics)).sort();
  }, [visibleProjects]);

  const filteredProjects = useMemo(() => {
    let filtered = visibleProjects;

    if (activeTab === 'active') {
      filtered = filtered.filter((project) => project.status === 'in_progress');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter((project) => project.status === 'completed');
    }

    if (selectedThematic !== 'all') {
      filtered = filtered.filter((project) => project.thematic === selectedThematic);
    }

    return filtered;
  }, [activeTab, selectedThematic, visibleProjects]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedThematic]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const stats = useMemo(() => ({
    total: visibleProjects.length,
    enCours: visibleProjects.filter((project) => project.status === 'in_progress').length,
    termines: visibleProjects.filter((project) => project.status === 'completed').length,
  }), [visibleProjects]);


  if (countryLoading) {
    return (
      <PublicLayout>
        <div className="w-full px-4 py-16 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{t('public.memberCountries.loading')}</p>
        </div>
      </PublicLayout>
    );
  }

  if (!country) {
    return (
      <PublicLayout>
        <div className="w-full px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('public.memberCountries.countryNotFound')}</h1>
          <Button asChild>
            <Link to="/annuaire-pays-membres">{t('public.memberCountries.backToDirectory')}</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const countryName = i18n.language === 'en' ? country.name_en : country.name_fr;
  const countryCodeLower = country.code_iso.toLowerCase();
  const flagUrl = `https://flagcdn.com/w320/${countryCodeLower}.png`;

  return (
    <PublicLayout>







      <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/annuaire-pays-membres" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('public.memberCountries.backToDirectory')}
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src={flagUrl}
              alt={t('public.memberCountries.flag', { country: countryName })}
              className="w-32 h-auto rounded-lg shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{countryName}</h1>

                  {/* Country Details Section */}
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                    {country.capital && (
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Building2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium">
                          {t("public.memberCountries.countryInfo.capital")} :
                        </span>
                        {country.capital}
                      </span>
                    )}

                    {country.population && (
                      <>
                        <span className="text-muted-foreground px-2">|</span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium">
                            {t("public.memberCountries.countryInfo.population")} :
                          </span>
                          {country.population}
                        </span>
                      </>
                    )}

                    {country.fsu_budget != null && (
                      <>
                        <span className="text-muted-foreground px-2">|</span>
                        <span className="inline-flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium">
                            {t("public.memberCountries.countryInfo.fsuBudget")} :
                          </span>
                          {country.fsu_budget.toLocaleString(locale)} FCFA
                        </span>
                      </>
                    )}

                  </div>




                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    {country.fsu_coordinator_name && (
                      <span className="inline-flex items-center gap-1 text-sm">
                        <User className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium">
                          {t("public.memberCountries.countryInfo.coordinatorName")} :
                        </span>
                        {country.fsu_coordinator_name}
                      </span>
                    )}

                    {country.fsu_coordinator_email && (
                      <>
                        <span className="text-muted-foreground px-2">|</span>
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium">
                            {t("public.memberCountries.countryInfo.coordinatorEmail")} :
                          </span>
                          <a href={`mailto:${country.fsu_coordinator_email}`} className="text-primary hover:underline">{country.fsu_coordinator_email}</a>
                        </span>
                      </>
                    )}

                    {country.fsu_coordinator_phone != null && (
                      <>
                        <span className="text-muted-foreground px-2">|</span>
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium">
                            {t("public.memberCountries.countryInfo.coordinatorPhone")} :
                          </span>
                          {country.fsu_coordinator_phone}
                        </span>
                      </>
                    )}

                  </div>







                </div>
                <Badge className="bg-primary/10 text-primary">{country.region}</Badge>
              </div>
            </div>
          </div>



          {country.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">{t('public.memberCountries.countryInfo.description')}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{country.description}</p>
            </div>
          )}

          {country.legal_texts && (
            <Card className="mt-8 bg-primary/5 border-primary/20 overflow-hidden">
              <div className="h-2 bg-primary" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t('public.memberCountries.countryInfo.legalTexts')}</h2>
                    <p className="text-sm text-muted-foreground">{t('public.memberCountries.countryInfo.legalTextsDesc')}</p>
                  </div>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {country.legal_texts}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">{t('public.memberCountries.stats.totalVisible')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.enCours}</div>
              <div className="text-xs text-muted-foreground">{t('public.memberCountries.stats.inProgress')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.termines}</div>
              <div className="text-xs text-muted-foreground">{t('public.memberCountries.stats.completed')}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CountryStatusFilter)} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
              <TabsTrigger value="all">{t('public.memberCountries.tabs.all')} ({stats.total})</TabsTrigger>
              <TabsTrigger value="active">{t('public.memberCountries.tabs.active')} ({stats.enCours})</TabsTrigger>
              <TabsTrigger value="completed">{t('public.memberCountries.tabs.completed')} ({stats.termines})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="w-full sm:w-64">
            <Select value={selectedThematic} onValueChange={setSelectedThematic}>
              <SelectTrigger className="w-full bg-card">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t('public.memberCountries.filters.thematic')} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('public.memberCountries.filters.allThematics')}</SelectItem>
                {uniqueThematics.map((thematic) => (
                  <SelectItem key={thematic} value={thematic}>
                    {thematic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">{t('public.memberCountries.loadingProjects')}</p>
            </CardContent>
          </Card>
        ) : filteredProjects.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} t={t} locale={locale} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    >
                      {t('common.previous')}
                    </PaginationPrevious>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={page === currentPage}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationEllipsis key={page} />
                        );
                      }
                      return null;
                    })}

                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    >
                      {t('common.next')}
                    </PaginationNext>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <MapPin className="mx-auto h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">{t('public.memberCountries.noProjects')}</p>
              <p className="text-sm">{t('public.memberCountries.noProjectsDesc')}</p>
            </CardContent>
          </Card>
        )}

        {/* Local News Section */}
        <div className="mt-16 pt-12 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Newspaper className="h-4 w-4" />
                {t('public.memberCountries.countryInfo.localNews.title')}
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t('public.memberCountries.countryInfo.localNews.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                {t('public.memberCountries.countryInfo.localNews.description', {
                  country: i18n.language.startsWith('fr') ? country.name_fr : country.name_en
                })}
              </p>
            </div>
            {news.length > 0 && (
              <Button variant="outline" asChild className='viewMoreClass bg-primary text-white hover:bg-white hover:text-primary'>
                <Link to="/actualites">
                  {t('public.memberCountries.directory.countryCard.view')}
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Link>
              </Button>
            )}
          </div>

          {isLoadingNews ? (
            <div className="grid sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-6 w-full bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {news.map((article) => (
                <Link key={article.id} to={`/actualites/${article.id}`} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-primary/10">
                    {article.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image_url}
                          alt={getLangValue(article.title, locale)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        {article.published_at && (
                          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.published_at).toLocaleDateString(locale, {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                        {article.category && (
                          <Badge variant="default" className="text-[10px] uppercase tracking-wider font-bold bg-primary/5 text-primary border-primary/10">
                            {getLangValue(article.category, locale)}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {getLangValue(article.title, locale)}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {getLangValue(article.excerpt, locale)}
                      </p>
                      <div className="flex items-center text-primary text-sm font-semibold gap-1 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                        {t('public.memberCountries.countryInfo.localNews.readMore')}
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/30">
              <CardContent className="py-12 text-center text-muted-foreground">
                <Newspaper className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>{t('public.memberCountries.countryInfo.localNews.noNews')}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Local Events (Agenda) Section */}
        <div className="mt-16 pt-12 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <CalendarRange className="h-4 w-4" />
                {t('public.memberCountries.countryInfo.agenda.title')}
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t('public.memberCountries.countryInfo.agenda.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                {t('public.memberCountries.countryInfo.agenda.description', {
                  country: i18n.language.startsWith('fr') ? country.name_fr : country.name_en
                })}
              </p>
            </div>
            {events.length > 0 && (
              <Button variant="outline" asChild className='viewMoreClass text-white bg-primary hover:text-primary hover:bg-white'>
                <Link to="/agenda">
                  {t('public.memberCountries.countryInfo.agenda.viewAll')}
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Link>
              </Button>
            )}
          </div>

          {isLoadingEvents ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse h-40 bg-muted" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <Link key={event.id} to={`/agenda/${event.id}`} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-lg border-primary/10 overflow-hidden">
                    <CardContent className="p-5">
                      <Badge variant="outline" className="mb-3 text-[10px] uppercase font-bold text-primary border-secondary/20">
                        {event.event_type}
                      </Badge>
                      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {getLangValue(event.title, locale)}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.start_date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{getLangValue(event.location, locale)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/30">
              <CardContent className="py-12 text-center text-muted-foreground">
                <CalendarRange className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>{t('public.memberCountries.countryInfo.agenda.noEvents')}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Local Documents Section */}
        <div className="mt-16 pt-12 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600">
                <FileText className="h-4 w-4" />
                {t('public.memberCountries.countryInfo.localDocuments.title')}
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t('public.memberCountries.countryInfo.localDocuments.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                {t('public.memberCountries.countryInfo.localDocuments.description', {
                  country: i18n.language.startsWith('fr') ? country.name_fr : country.name_en
                })}
              </p>
            </div>
            {documents.length > 0 && (
              <Button variant="outline" asChild className='viewMoreClass bg-primary text-white hover:bg-white hover:text-primary'>
                <Link to="/documents-publics">
                  {t('public.memberCountries.countryInfo.localDocuments.viewAll')}
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Link>
              </Button>
            )}
          </div>

          {isLoadingDocs ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : documents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow border-blue-100 group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate" title={doc.title}>{doc.title}</h4>
                      <p className="text-xs text-muted-foreground uppercase">{doc.category}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" asChild>
                      <a href={doc.download_url || '#'} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/30">
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>{t('public.memberCountries.countryInfo.localDocuments.noDocuments')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
