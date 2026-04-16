import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, Flag, Mail, MapPin, Phone, TrendingUp, Users } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { mockMemberCountries } from '../data/mockCountries';
import { usePublicProjectsByCountry } from '../hooks/usePublicProjects';
import { STATUS_LABELS, type PublicProject } from '../data/mockProjects';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type CountryStatusFilter = 'all' | 'active' | 'completed';

function ProjectCard({ project }: { project: PublicProject }) {
  const statusInfo = STATUS_LABELS[project.status];
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-lg mb-1">{project.title}</h3>
            <p className="text-sm text-muted-foreground">{project.location.region}</p>
          </div>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Budget : {project.budget}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{project.beneficiaries.toLocaleString('fr-FR')} beneficiaires</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {startDate.toLocaleDateString('fr-FR')} - {endDate.toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {project.location.lat.toFixed(4)}, {project.location.lng.toFixed(4)}
            </span>
          </div>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link to="/carte-public">Voir sur la carte</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CountryProjectsPage() {
  const { countryCode } = useParams<{ countryCode: string }>();
  const [selectedStatus, setSelectedStatus] = useState<CountryStatusFilter>('all');
  const [activeTab, setActiveTab] = useState<CountryStatusFilter>('all');

  const country = mockMemberCountries.find((item) => item.code === countryCode);
  const { data: rawProjects = [], isLoading } = usePublicProjectsByCountry(countryCode ?? '');

  const visibleProjects = useMemo(
    () => rawProjects.filter((project) => project.status === 'active' || project.status === 'completed'),
    [rawProjects],
  );

  const projects = useMemo(() => {
    let result = visibleProjects;

    if (selectedStatus !== 'all') {
      result = result.filter((project) => project.status === selectedStatus);
    }

    if (activeTab !== 'all') {
      result = result.filter((project) => project.status === activeTab);
    }

    return result;
  }, [activeTab, selectedStatus, visibleProjects]);

  const stats = useMemo(() => ({
    total: visibleProjects.length,
    enCours: visibleProjects.filter((project) => project.status === 'active').length,
    termines: visibleProjects.filter((project) => project.status === 'completed').length,
  }), [visibleProjects]);

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
              src={country.flagUrl}
              alt={`Drapeau ${country.name}`}
              className="w-32 h-auto rounded-lg shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{country.name}</h1>
                  <p className="text-muted-foreground">{country.officialName}</p>
                </div>
                <Badge className="bg-primary/10 text-primary">{country.region}</Badge>
              </div>

              <p className="text-muted-foreground mb-6 max-w-3xl">
                {country.description}
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Flag className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Capital</span>
                    </div>
                    <p className="font-semibold">{country.capital}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Population</span>
                    </div>
                    <p className="font-semibold">{country.population}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Budget FSU</span>
                    </div>
                    <p className="font-semibold">{country.fsuBudget}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">FSU etabli</span>
                    </div>
                    <p className="font-semibold">{country.fsuEstablished}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Coordonnees FSU {country.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Coordinateur:</span>
                    <span className="font-medium">{country.coordinator}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${country.email}`} className="text-primary hover:underline">
                      {country.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{country.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
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
