import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { MapPin, FileDown, Globe, Map, Search, Maximize2, Minimize2, Filter, Layers, TrendingUp, Users, DollarSign, Building2, Wifi, Satellite, Map as MapIcon, X } from 'lucide-react';
import { ProjectMap } from '@/features/projects-map/components/ProjectMap';
import { exportMapData } from '@/features/projects-map/utils/export-map';
import type { Project } from '@/features/projects-map/types';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/features/projects-map/types';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import PageHero from '@/components/PageHero';
import { PublicLayout } from '../components/PublicLayout';
import { mockMemberCountries, REGIONS } from '../data/mockCountries';
import { usePublicProjects } from '../hooks/usePublicProjects';
import type { PublicProject } from '../data/mockProjects';
import { Card, CardContent } from '@/components/ui/card';
import { CountriesMap } from '../components/CountriesMap';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type MapView = 'projects' | 'countries';
type MapMode = 'carte' | 'satellite';
type PublicProjectFilterStatus = 'all' | 'active' | 'completed';
type ProjectTheme = 'all' | 'connectivity' | 'health' | 'education' | 'energy' | 'agriculture';

const PUBLIC_VISIBLE_PROJECT_STATUSES = ['in_progress', 'completed'] as const;

// Project themes with icons and colors
const PROJECT_THEMES: Record<ProjectTheme, { icon: string; color: string; labelKey: string }> = {
  all: { icon: '🗂️', color: '#6366f1', labelKey: 'public.map.themes.project' },
  connectivity: { icon: '📡', color: '#3b82f6', labelKey: 'public.map.themes.connectivity' },
  health: { icon: '🏥', color: '#ef4444', labelKey: 'public.map.themes.health' },
  education: { icon: '🎓', color: '#f59e0b', labelKey: 'public.map.themes.education' },
  energy: { icon: '⚡', color: '#10b981', labelKey: 'public.map.themes.energy' },
  agriculture: { icon: '🌾', color: '#84cc16', labelKey: 'public.map.themes.agriculture' },
};

// Detect project theme from title/description
function detectProjectTheme(project: PublicProject): ProjectTheme {
  const text = `${project.title} ${project.description}`.toLowerCase();

  if (text.match(/santé|health|médical|hôpital|clinique|soins/)) return 'health';
  if (text.match(/éducation|education|école|écol|school|université|formation|teacher/)) return 'education';
  if (text.match(/énergie|energy|solaire|electric|électr|power/)) return 'energy';
  if (text.match(/agricultur|pêche|ferm|rural|crop|livestock/)) return 'agriculture';
  return 'connectivity';
}

function parseBudgetToNumber(budget: string): number | null {
  const match = budget.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;

  const value = Number(match[1].replace(',', '.'));
  if (Number.isNaN(value)) return null;

  if (/milliard/i.test(budget)) return value * 1_000_000_000;
  if (/million/i.test(budget)) return value * 1_000_000;

  return value;
}

function mapPublicProjectToProject(project: PublicProject): Project {
  return {
    id: project.id,
    country_id: project.countryCode,
    title: project.title,
    description: project.description,
    status: project.status === 'completed' ? 'completed' : 'in_progress',
    budget: parseBudgetToNumber(project.budget),
    latitude: project.location.lat,
    longitude: project.location.lng,
    region: project.location.region,
    created_by: null,
    created_at: project.startDate,
    updated_at: project.endDate,
    countries: {
      name_fr: project.countryName,
      name_en: project.countryName,
      code_iso: project.countryCode,
    },
  };
}

// Animated counter component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count.toLocaleString('fr-FR')}</span>;
}

export default function PublicMapPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PublicProjectFilterStatus>('all');
  const [themeFilter, setThemeFilter] = useState<ProjectTheme>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapView, setMapView] = useState<MapView>('projects');
  const [mapMode, setMapMode] = useState<MapMode>('carte');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { data: publicProjects = [], isLoading } = usePublicProjects();
  const { t } = useTranslation();

  const activeProjects = useMemo(() => {
    return publicProjects
      .filter((project) => project.status === 'active' || project.status === 'completed')
      .filter((project) => {
        if (statusFilter === 'all') return true;
        return project.status === statusFilter;
      })
      .filter((project) => {
        if (themeFilter === 'all') return true;
        return detectProjectTheme(project) === themeFilter;
      })
      .filter((project) => {
        if (regionFilter === 'all') return true;
        const country = mockMemberCountries.find(c => c.code === project.countryCode);
        return country?.region === regionFilter;
      })
      .filter((project) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;

        return [
          project.title,
          project.description,
          project.countryName,
          project.location.region,
        ].some((value) => value.toLowerCase().includes(query));
      })
      .map(mapPublicProjectToProject);
  }, [publicProjects, search, statusFilter, themeFilter, regionFilter]);

  const projectsByCountry = useMemo(() => {
    return activeProjects.reduce((acc, project) => {
      const countryCode = project.countries?.code_iso;
      if (countryCode) {
        if (!acc[countryCode]) {
          acc[countryCode] = [];
        }
        acc[countryCode].push(project);
      }
      return acc;
    }, {} as Record<string, Project[]>);
  }, [activeProjects]);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProjectId(project.id);
  }, []);

  const handleExport = (format: 'csv' | 'png') => {
    const publicProjects = activeProjects.map(p => ({
      title: p.title,
      country_id: p.country_id,
      status: p.status,
      region: p.region,
      description: p.description,
    }));
    exportMapData(publicProjects as Project[], format);
    toast.success(t('public.map.exportSuccess'));
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProjects = activeProjects.length;
    const inProgress = activeProjects.filter(p => p.status === 'in_progress').length;
    const completed = activeProjects.filter(p => p.status === 'completed').length;
    const countriesWithProjects = Object.keys(projectsByCountry).length;
    const totalBudget = activeProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

    return { totalProjects, inProgress, completed, countriesWithProjects, totalBudget };
  }, [activeProjects, projectsByCountry]);

  // Calculate counts for filters
  const themeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: activeProjects.length };
    Object.entries(PROJECT_THEMES).forEach(([key]) => {
      if (key !== 'all') {
        counts[key] = activeProjects.filter(p => {
          const projectTheme = detectProjectTheme(publicProjects.find(proj => proj.id === p.id) || publicProjects[0]);
          return projectTheme === key;
        }).length;
      }
    });
    return counts;
  }, [activeProjects, publicProjects]);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { all: activeProjects.length };
    REGIONS.forEach(region => {
      counts[region] = activeProjects.filter(p => {
        const country = mockMemberCountries.find(c => c.code === p.country_id);
        return country?.region === region;
      }).length;
    });
    return counts;
  }, [activeProjects]);

  const activeFiltersCount = useMemo(() => {
    return [
      statusFilter !== 'all' ? 1 : 0,
      themeFilter !== 'all' ? 1 : 0,
      regionFilter !== 'all' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
  }, [statusFilter, themeFilter, regionFilter]);

  return (
    <PublicLayout>
      <div
        ref={mapContainerRef}
        className={cn(
          "min-h-screen bg-gradient-to-b from-background to-muted/20",
          isFullscreen && "fixed inset-0 z-50 bg-background p-6 overflow-auto"
        )}
      >
        <div className={cn("container mx-auto max-w-[1800px] px-4 py-6", isFullscreen && "max-w-full h-full")}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                {t('public.map.title')}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('public.map.description')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="gap-2"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                {isFullscreen ? t('public.map.exitFullscreen') : t('public.map.fullscreen')}
              </Button>

              {mapView === 'projects' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileDown className="h-4 w-4" />
                      {t('public.map.export')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      <FileDown className="mr-2 h-4 w-4" />{t('public.map.exportCSV')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('png')}>
                      <FileDown className="mr-2 h-4 w-4" />{t('public.map.exportPNG')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Floating Controls Bar */}
          <Card className="mb-4 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* View & Mode Selectors */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-background rounded-lg p-1 border">
                    <button
                      onClick={() => setMapView('projects')}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                        mapView === 'projects'
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted"
                      )}
                    >
                      <Map className="h-4 w-4" />
                      {t('public.map.projects')}
                    </button>
                    <button
                      onClick={() => setMapView('countries')}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                        mapView === 'countries'
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted"
                      )}
                    >
                      <Globe className="h-4 w-4" />
                      {t('public.map.countries')}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-background rounded-lg p-1 border">
                    <button
                      onClick={() => setMapMode('carte')}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                        mapMode === 'carte'
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted"
                      )}
                    >
                      <MapIcon className="h-4 w-4" />
                      {t('public.map.map')}
                    </button>
                    <button
                      onClick={() => setMapMode('satellite')}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                        mapMode === 'satellite'
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted"
                      )}
                    >
                      <Satellite className="h-4 w-4" />
                      {t('public.map.satellite')}
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t('public.map.searchPlaceholder')}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Active Filters */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('public.map.filters')}:</span>
                  {activeFiltersCount > 0 ? (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {activeFiltersCount} {activeFiltersCount > 1 ? t('public.map.active') : t('public.map.activeOne')}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      {t('public.map.none')}
                    </Badge>
                  )}
                  {(activeFiltersCount > 0 || statusFilter !== 'all' || themeFilter !== 'all' || regionFilter !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        setStatusFilter('all');
                        setThemeFilter('all');
                        setRegionFilter('all');
                      }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      {t('public.map.reset')}
                    </Button>
                  )}
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    {t('public.map.filtersButton')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Stats */}
          <Card className="mb-4 border-2 border-primary/10 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-semibold">{t('public.map.dashboard.title')}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-background rounded-xl p-4 border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        <AnimatedCounter value={stats.totalProjects} />
                      </p>
                      <p className="text-xs text-muted-foreground">{t('public.map.dashboard.projects')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-4 border-2 border-amber-500/10 hover:border-amber-500/30 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-amber-600">
                        <AnimatedCounter value={stats.inProgress} />
                      </p>
                      <p className="text-xs text-muted-foreground">{t('public.map.dashboard.inProgress')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-4 border-2 border-green-500/10 hover:border-green-500/30 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">
                        <AnimatedCounter value={stats.completed} />
                      </p>
                      <p className="text-xs text-muted-foreground">{t('public.map.dashboard.completed')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-4 border-2 border-secondary/10 hover:border-secondary/30 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-secondary">
                        <AnimatedCounter value={stats.countriesWithProjects} />
                      </p>
                      <p className="text-xs text-muted-foreground">{t('public.map.dashboard.countries')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-4 border-2 border-green-600/10 hover:border-green-600/30 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-green-600/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">
                        {stats.totalBudget > 0 ? (
                          <AnimatedCounter value={Math.round(stats.totalBudget / 1_000_000)} />
                        ) : (
                          '—'
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{t('public.map.dashboard.millions')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Filters Panel */}
            <Card className={cn("lg:col-span-1 transition-all", showFilters ? "" : "max-h-20 overflow-hidden")}>
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer mb-4"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Filter className="h-4 w-4 text-primary" />
                    {t('public.map.filters')}
                  </div>
                  <span className="text-muted-foreground">{showFilters ? '▲' : '▼'}</span>
                </div>

                {showFilters && (
                  <div className="space-y-6">
                    {/* Status Filter */}
                    <div>
                      <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        {t('public.map.status.label')}
                      </label>
                      <div className="space-y-2">
                        <button
                          onClick={() => setStatusFilter('all')}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                            statusFilter === 'all'
                              ? "bg-primary/10 border-2 border-primary"
                              : "hover:bg-muted border-2 border-transparent"
                          )}
                        >
                          <span className="text-sm font-medium">{t('public.map.allProjects')}</span>
                          <Badge variant={statusFilter === 'all' ? "default" : "secondary"}>
                            {activeProjects.length}
                          </Badge>
                        </button>
                        <button
                          onClick={() => setStatusFilter('active')}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                            statusFilter === 'active'
                              ? "bg-amber-500/10 border-2 border-amber-500"
                              : "hover:bg-muted border-2 border-transparent"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />
                            <span className="text-sm font-medium">{t('public.map.status.in_progress')}</span>
                          </div>
                          <Badge variant={statusFilter === 'active' ? "default" : "secondary"}>
                            {stats.inProgress}
                          </Badge>
                        </button>
                        <button
                          onClick={() => setStatusFilter('completed')}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                            statusFilter === 'completed'
                              ? "bg-green-500/10 border-2 border-green-500"
                              : "hover:bg-muted border-2 border-transparent"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
                            <span className="text-sm font-medium">{t('public.map.status.completed')}</span>
                          </div>
                          <Badge variant={statusFilter === 'completed' ? "default" : "secondary"}>
                            {stats.completed}
                          </Badge>
                        </button>
                      </div>
                    </div>

                    {/* Theme Filter */}
                    <div>
                      <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-muted-foreground" />
                        {t('public.map.themesLabel')}
                      </label>
                      <div className="space-y-2">
                        {Object.entries(PROJECT_THEMES).map(([key, { labelKey, icon, color }]) => {
                          const count = key === 'all' ? activeProjects.length : themeCounts[key] || 0;
                          const isActive = themeFilter === key;

                          return (
                            <button
                              key={key}
                              onClick={() => setThemeFilter(key as ProjectTheme)}
                              className={cn(
                                "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                                isActive && key !== 'all'
                                  ? "border-2"
                                  : "hover:bg-muted border-2 border-transparent"
                              )}
                              style={isActive && key !== 'all' ? { borderColor: color, backgroundColor: `${color}10` } : {}}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{icon}</span>
                                <span className="text-sm font-medium">{t(labelKey)}</span>
                              </div>
                              <Badge variant={isActive ? "default" : "secondary"}>
                                {count}
                              </Badge>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Region Filter */}
                    <div>
                      <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        {t('public.map.region')}
                      </label>
                      <div className="space-y-2">
                        <button
                          onClick={() => setRegionFilter('all')}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                            regionFilter === 'all'
                              ? "bg-primary/10 border-2 border-primary"
                              : "hover:bg-muted border-2 border-transparent"
                          )}
                        >
                          <span className="text-sm font-medium">{t('public.map.allRegions')}</span>
                          <Badge variant={regionFilter === 'all' ? "default" : "secondary"}>
                            {activeProjects.length}
                          </Badge>
                        </button>
                        {REGIONS.map(region => {
                          const count = regionCounts[region] || 0;
                          const isActive = regionFilter === region;

                          return (
                            <button
                              key={region}
                              onClick={() => setRegionFilter(isActive ? 'all' : region)}
                              className={cn(
                                "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                                isActive
                                  ? "bg-primary/10 border-2 border-primary"
                                  : count > 0 ? "hover:bg-muted border-2 border-transparent" : "opacity-50"
                              )}
                              disabled={count === 0}
                            >
                              <span className="text-sm font-medium">{region}</span>
                              <Badge variant={isActive ? "default" : "secondary"}>
                                {count}
                              </Badge>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="lg:col-span-3">
              <CardContent className="p-0">
                <div className="relative" style={{ minHeight: '600px' }}>
                  {/* Map View Indicator */}
                  <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 border-2 border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      {mapView === 'projects' ? (
                        <>
                          <Map className="h-4 w-4 text-primary" />
                          <span className="font-bold text-sm">{t('public.map.projectsView')}</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 text-primary" />
                          <span className="font-bold text-sm">{t('public.map.countriesView')}</span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activeProjects.length} {t('public.map.project')}{activeProjects.length > 1 ? 's' : ''} {t('public.map.displayed')}
                    </div>
                  </div>

                  {/* Map */}
                  <div className="w-full" style={{ height: '600px' }}>
                    {mapView === 'projects' ? (
                      isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                      ) : activeProjects.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <MapPin className="h-20 w-20 mx-auto mb-4 text-muted-foreground/20" />
                            <p className="text-xl font-bold mb-2">{t('public.map.noProjectFound')}</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              {t('public.map.tryFilters')}
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setStatusFilter('all');
                                setThemeFilter('all');
                                setRegionFilter('all');
                              }}
                            >
                              {t('public.map.resetFilters')}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <ProjectMap
                          projects={activeProjects}
                          selectedProjectId={selectedProjectId}
                          onProjectClick={handleProjectClick}
                          mapMode={mapMode}
                        />
                      )
                    ) : (
                      <CountriesMap
                        projectsByCountry={projectsByCountry}
                        onCountryClick={(code) => setSelectedCountryCode(code)}
                        selectedCountryCode={selectedCountryCode}
                        mapMode={mapMode}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legend */}
          <Card className="mt-4 border-2 border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="h-5 w-5 text-primary" />
                <span className="font-semibold">{t('public.map.legend')}</span>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Status Legend */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">{t('public.map.status.label').toUpperCase()}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-4 w-4 rounded-full bg-amber-500" />
                      <span className="text-sm">{t('public.map.status.in_progress')} ({stats.inProgress})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-4 w-4 rounded-full bg-green-500" />
                      <span className="text-sm">{t('public.map.status.completed')} ({stats.completed})</span>
                    </div>
                  </div>
                </div>

                {/* Theme Legend */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">{t('public.map.themesLabel').toUpperCase()}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(PROJECT_THEMES).filter(([key]) => key !== 'all').map(([key, { icon, labelKey }]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-base">{icon}</span>
                        <span className="text-sm">{t(labelKey)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Region Legend */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">{t('public.map.region').toUpperCase()}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {REGIONS.map(region => (
                      <div key={region} className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span>{region} ({regionCounts[region] || 0})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Item Detail Panel */}
          {((mapView === 'projects' && selectedProjectId) || (mapView === 'countries' && selectedCountryCode)) && (
            <Card className="mt-4 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                {mapView === 'projects' && selectedProjectId ? (
                  (() => {
                    const project = activeProjects.find(p => p.id === selectedProjectId);
                    if (!project) return null;
                    const originalProject = publicProjects.find(p => p.id === project.id);
                    const theme = originalProject ? detectProjectTheme(originalProject) : 'connectivity';
                    const themeInfo = PROJECT_THEMES[theme];

                    return (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <span className="text-4xl">{themeInfo.icon}</span>
                            <div>
                              <h3 className="text-xl font-bold">{project.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {project.countries?.name_fr} · {project.region}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProjectId(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border-2" style={{ borderColor: PROJECT_STATUS_COLORS[project.status] }}>
                            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: PROJECT_STATUS_COLORS[project.status] }} />
                            <span className="text-sm font-medium">{t(`public.map.status.${project.status}`)}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border-2" style={{ borderColor: themeInfo.color }}>
                            <span className="text-base">{themeInfo.icon}</span>
                            <span className="text-sm font-medium">{t(themeInfo.labelKey)}</span>
                          </div>
                        </div>

                        {project.description && (
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {project.budget && (
                            <div className="bg-background p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">{t('public.map.budget')}</div>
                              <div className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(project.budget)}</div>
                            </div>
                          )}
                          {project.region && (
                            <div className="bg-background p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">{t('public.map.region')}</div>
                              <div className="font-bold text-sm">{project.region}</div>
                            </div>
                          )}
                          {project.countries && (
                            <div className="bg-background p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">{t('public.map.country')}</div>
                              <div className="font-bold text-sm">{project.countries.name_fr}</div>
                            </div>
                          )}
                          {originalProject && (
                            <div className="bg-background p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">{t('public.map.beneficiaries')}</div>
                              <div className="font-bold">{originalProject.beneficiaries?.toLocaleString('fr-FR') || '—'}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : mapView === 'countries' && selectedCountryCode ? (
                  (() => {
                    const country = mockMemberCountries.find((c) => c.code === selectedCountryCode);
                    if (!country) return null;
                    const countryProjects = projectsByCountry[selectedCountryCode] || [];

                    return (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <img src={country.flagUrl} alt={`Drapeau ${country.name}`} className="w-16 h-auto rounded-lg shadow-lg" />
                            <div>
                              <h3 className="text-xl font-bold">{country.name}</h3>
                              <p className="text-sm text-muted-foreground">{country.region}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCountryCode(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-1 bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-xl text-center">
                            <div className="text-4xl font-bold text-primary">{countryProjects.length}</div>
                            <div className="text-sm text-primary/80">{t('public.map.project')}{countryProjects.length > 1 ? 's' : ''} FSU</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-background p-3 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">{t('public.map.fsuBudget')}</div>
                            <div className="font-bold text-sm">{country.fsuBudget}</div>
                          </div>
                          <div className="bg-background p-3 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">{t('public.map.population')}</div>
                            <div className="font-bold text-sm">{country.population}</div>
                          </div>
                          <div className="bg-background p-3 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">{t('public.map.established')}</div>
                            <div className="font-bold text-sm">{country.fsuEstablished}</div>
                          </div>
                          <div className="bg-background p-3 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">{t('public.map.coordinator')}</div>
                            <div className="font-bold text-sm">{country.coordinator.split(' ')[0]}</div>
                          </div>
                        </div>

                        <Button asChild className="w-full">
                          <a href={`/projets-pays/${selectedCountryCode}`}>{t('public.map.viewAllProjects')} →</a>
                        </Button>
                      </div>
                    );
                  })()
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
