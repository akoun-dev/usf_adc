import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, Filter, ArrowRight, Flag } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { mockMemberCountries, REGION_NAMES, REGIONS } from '../data/mockCountries';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageHero from '@/components/PageHero';

function CountryCard({ country }: { country: typeof mockMemberCountries[0] }) {
  return (
    <Link to={`/projets-pays/${country.code}`} className="block">
      <Card className="hover:shadow-xl transition-all duration-300 group h-full overflow-hidden">
        <div className="relative h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
          <img
            src={country.flagUrl}
            alt={`Drapeau ${country.name}`}
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={country.flagUrl}
              alt={`Drapeau ${country.name}`}
              className="h-20 w-auto drop-shadow-2xl"
            />
          </div>
          <div className="absolute top-3 right-3">
            <Badge className="bg-background/80 backdrop-blur-sm">
              {country.region}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
            {country.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {country.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{country.projectCount}</span> projets
            </span>
            <span className="text-primary flex items-center gap-1 text-sm font-medium">
              Voir
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function CountriesDirectoryPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'projects' | 'budget'>('name');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  const filteredAndSortedCountries = useMemo(() => {
    let result = [...mockMemberCountries];

    // Filter by region
    if (selectedRegion !== 'all') {
      result = result.filter(c => c.region === selectedRegion);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.officialName.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'fr');
      } else if (sortBy === 'projects') {
        return b.projectCount - a.projectCount;
      } else {
        const parseBudget = (budget: string) => {
          const match = budget.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };
        return parseBudget(b.fsuBudget) - parseBudget(a.fsuBudget);
      }
    });

    return result;
  }, [search, selectedRegion, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCountries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCountries = filteredAndSortedCountries.slice(startIndex, endIndex);

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as 'name' | 'projects' | 'budget');
    setCurrentPage(1);
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      totalCountries: mockMemberCountries.length,
      totalProjects: mockMemberCountries.reduce((sum, c) => sum + c.projectCount, 0),
      totalRegions: REGIONS.length,
    };
  }, []);

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHero
          title="Annuaire des Pays Membres"
          description="Découvrez les 25 pays membres de la plateforme FSU et explorez leurs projets en cours"
          icon={<Globe className="h-6 w-6 text-secondary" />}
        />

        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.totalCountries}</div>
              <div className="text-sm text-muted-foreground">Pays membres</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.totalProjects}</div>
              <div className="text-sm text-muted-foreground">Projets FSU</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.totalRegions}</div>
              <div className="text-sm text-muted-foreground">Régions couvertes</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un pays (ex : Côte d'Ivoire, Sénégal...)"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Region Filter */}
              <Select value={selectedRegion} onValueChange={handleRegionChange}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  {REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom A-Z</SelectItem>
                  <SelectItem value="projects">Nombre de projets</SelectItem>
                  <SelectItem value="budget">Budget FSU</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(search || selectedRegion !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Filtres actifs :</span>
                {search && (
                  <Badge variant="secondary" className="gap-1">
                    "{search}"
                    <button
                      onClick={() => handleSearchChange('')}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedRegion !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedRegion}
                    <button
                      onClick={() => handleRegionChange('all')}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedCountries.length} pays trouvé{filteredAndSortedCountries.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Countries Grid */}
        {paginatedCountries.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedCountries.map((country) => (
              <CountryCard key={country.code} country={country} />
            ))}
          </div>
        ) : (
          <Card className="mb-8">
            <CardContent className="py-16 text-center text-muted-foreground">
              <Globe className="mx-auto h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">Aucun pays trouvé</p>
              <p className="text-sm">Essayez d'autres critères de recherche</p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first, last, current, and adjacent pages
                  return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                })
                .map((page, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    </div>
                  );
                })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        )}

        {/* Regions Overview */}
        {search === '' && selectedRegion === 'all' && (
          <Card className="mt-12">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                Aperçu par Région
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {REGIONS.map((region) => {
                  const countriesInRegion = mockMemberCountries.filter(c => c.region === region);
                  const totalProjects = countriesInRegion.reduce((sum, c) => sum + c.projectCount, 0);
                  return (
                    <div
                      key={region}
                      className="p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => handleRegionChange(region)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {region}
                        </Badge>
                        <span className="text-2xl">🌍</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {REGION_NAMES[region]}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">{countriesInRegion.length}</span> pays
                        </span>
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">{totalProjects}</span> projets
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PublicLayout>
  );
}
