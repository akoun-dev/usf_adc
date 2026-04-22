import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, Flag, Mail, MapPin, Phone, TrendingUp, Users } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useCountryByISO, type Country } from '../hooks/useCountries';
import { usePublicProjectsByCountry } from '../hooks/usePublicProjects';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';

type CountryStatusFilter = 'all' | 'active' | 'completed';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  'planned': { label: 'Planifié', color: 'bg-slate-500/10 text-slate-700 dark:text-slate-400' },
  'in_progress': { label: 'En cours', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  'completed': { label: 'Terminé', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  'suspended': { label: 'Suspendu', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
};

function ProjectCard({ project }: { project: ProjectWithDetails }) {
  const statusInfo = STATUS_LABELS[project.status] || STATUS_LABELS['planned'];
  const startDate = new Date(project.created_at);
  const endDate = new Date(project.updated_at);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-lg mb-1">{project.title}</h3>
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
            <span>Budget : {project.budget ? `${project.budget.toLocaleString('fr-FR')} FCFA` : 'N/A'}</span>
          </div>
          {project.beneficiaries && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{project.beneficiaries} bénéficiaires</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {startDate.toLocaleDateString('fr-FR')} - {endDate.toLocaleDateString('fr-FR')}
            </span>
          </div>
          {project.latitude && project.longitude && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {project.latitude.toFixed(4)}, {project.longitude.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link to="/carte-public">Voir sur la carte</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CountryProjectsPage() {
  const { t, i18n } = useTranslation();
  const { countryCode } = useParams<{ countryCode: string }>();
  const [selectedStatus, setSelectedStatus] = useState<CountryStatusFilter>('all');
  const [activeTab, setActiveTab] = useState<CountryStatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data: country, isLoading: countryLoading } = useCountryByISO(countryCode ?? '');
  const { data: rawProjects = [], isLoading } = usePublicProjectsByCountry(countryCode ?? '');

  const visibleProjects = useMemo(
    () => rawProjects.filter((project) => project.status === 'in_progress' || project.status === 'completed'),
    [rawProjects],
  );

  const projects = useMemo(() => {
    let result = visibleProjects;

    if (selectedStatus === 'active') {
      result = result.filter((project) => project.status === 'in_progress');
    } else if (selectedStatus === 'completed') {
      result = result.filter((project) => project.status === 'completed');
    }

    if (activeTab === 'active') {
      result = result.filter((project) => project.status === 'in_progress');
    } else if (activeTab === 'completed') {
      result = result.filter((project) => project.status === 'completed');
    }

    return result;
  }, [activeTab, selectedStatus, visibleProjects]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedStatus, activeTab]);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return projects.slice(startIndex, startIndex + itemsPerPage);
  }, [projects, currentPage, itemsPerPage]);

  const stats = useMemo(() => ({
    total: visibleProjects.length,
    enCours: visibleProjects.filter((project) => project.status === 'in_progress').length,
    termines: visibleProjects.filter((project) => project.status === 'completed').length,
  }), [visibleProjects]);

  if (countryLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!country) {
    return (
      <PublicLayout>
        <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Pays non trouve</h1>
          <Button asChild>
            <Link to="/annuaire-pays-membres">Retour a l'annuaire</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const countryName = i18n.language === 'fr' ? country.name_fr : country.name_en;
  const countryCodeLower = country.code_iso.toLowerCase();
  const flagUrl = `https://flagcdn.com/w320/${countryCodeLower}.png`;

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/annuaire-pays-membres" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour a l'annuaire
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src={flagUrl}
              alt={`Drapeau ${countryName}`}
              className="w-32 h-auto rounded-lg shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{countryName}</h1>
                  <p className="text-muted-foreground">{country.code_iso.toUpperCase()}</p>
                </div>
                <Badge className="bg-primary/10 text-primary">{country.region}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total visible</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.enCours}</div>
              <div className="text-xs text-muted-foreground">En cours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.termines}</div>
              <div className="text-xs text-muted-foreground">Termines</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as CountryStatusFilter)}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les projets visibles</SelectItem>
                  <SelectItem value="active">En cours</SelectItem>
                  <SelectItem value="completed">Termines</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CountryStatusFilter)} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">Tous ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">En cours ({stats.enCours})</TabsTrigger>
            <TabsTrigger value="completed">Termines ({stats.termines})</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Chargement des projets...</p>
            </CardContent>
          </Card>
        ) : projects.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />

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
                    />
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <MapPin className="mx-auto h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">Aucun projet visible</p>
              <p className="text-sm">Seuls les projets realises et en cours sont affiches pour ce pays.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PublicLayout>
  );
}
