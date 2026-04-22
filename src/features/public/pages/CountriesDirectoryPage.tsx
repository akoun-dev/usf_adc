import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, Filter, ArrowRight } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useCountries, useCountrySearch, type CountryWithProjects } from '../hooks/useCountries';
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

function CountryCard({ country }: { country: CountryWithProjects }) {
  const { t, i18n } = useTranslation();
  const countryCode = country.code_iso.toLowerCase();
  const flagUrl = `https://flagcdn.com/w320/${countryCode}.png`;
  const countryName = i18n.language === 'fr' ? country.name_fr : country.name_en;

  return (
    <Link to={`/projets-pays/${country.code_iso}`} className="block">
      <Card className="hover:shadow-xl transition-all duration-300 group h-full overflow-hidden">
        <div className="relative h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
          <img
            src={flagUrl}
            alt={`Flag ${countryName}`}
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={flagUrl}
              alt={`Flag ${countryName}`}
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
            {countryName}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {country.code_iso.toUpperCase()}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{country.project_count || 0}</span> {t('public.memberCountries.directory.countryCard.projects')}
            </span>
            <span className="text-primary flex items-center gap-1 text-sm font-medium">
              {t('public.memberCountries.directory.countryCard.view')}
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function CountriesDirectoryPage() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'projects'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const itemsPerPage = 12;

  // Fetch countries - use search hook when searching, otherwise use all countries
  const { data: allCountries = [] } = useCountries();
  const { data: searchResults = [] } = useCountrySearch(searchQuery);
  const countries = searchQuery ? searchResults : (allCountries as CountryWithProjects[]);

  const filteredAndSortedCountries = useMemo(() => {
    let result = [...countries];

    // Filter by region
    if (selectedRegion !== 'all') {
      result = result.filter(c => c.region === selectedRegion);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = i18n.language === 'fr' ? a.name_fr : a.name_en;
        const nameB = i18n.language === 'fr' ? b.name_fr : b.name_en;
        return nameA.localeCompare(nameB, i18n.language);
      } else {
        return (b.project_count || 0) - (a.project_count || 0);
      }
    });

    return result;
  }, [countries, selectedRegion, sortBy, i18n.language]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCountries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCountries = filteredAndSortedCountries.slice(startIndex, endIndex);

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as 'name' | 'projects');
    setCurrentPage(1);
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      totalCountries: allCountries.length,
      totalProjects: allCountries.reduce((sum, c) => sum + (c.project_count || 0), 0),
      totalRegions: new Set(allCountries.map(c => c.region)).size,
    };
  }, [allCountries]);

  // Get unique regions from countries
  const regions = useMemo(() => {
    return Array.from(new Set(allCountries.map(c => c.region))).sort();
  }, [allCountries]);

  // Region name mapping
  const regionNames: Record<string, string> = {
    'CEDEAO': 'Communauté Économique des États de l\'Afrique de l\'Ouest',
    'EAC': 'East African Community',
    'SADC': 'Southern African Development Community',
    'UMA': 'Union du Maghreb Arabe',
    'CEEAC': 'Communauté Économique et Monétaire de l\'Afrique Centrale',
    'North Africa': 'Afrique du Nord',
  };

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHero
          title={t('public.memberCountries.directory.title')}
          description={t('public.memberCountries.directory.description', { count: stats.totalCountries })}
          icon={<Globe className="h-6 w-6 text-secondary" />}
        />

        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.totalCountries}</div>
              <div className="text-sm text-muted-foreground">{t('public.memberCountries.directory.stats.memberCountries')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.totalProjects}</div>
              <div className="text-sm text-muted-foreground">{t('public.memberCountries.directory.stats.fsuProjects')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stats.totalRegions}</div>
              <div className="text-sm text-muted-foreground">{t('public.memberCountries.directory.stats.regionsCovered')}</div>
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
                  placeholder={t('public.memberCountries.directory.search.placeholder')}
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Region Filter */}
              <Select value={selectedRegion} onValueChange={handleRegionChange}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t('public.memberCountries.directory.filters.region')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('public.memberCountries.directory.filters.allRegions')}</SelectItem>
                  {regions.map((region) => (
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
                  <SelectItem value="name">{t('public.memberCountries.directory.filters.sortByName')}</SelectItem>
                  <SelectItem value="projects">{t('public.memberCountries.directory.filters.sortByProjects')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(search || selectedRegion !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">{t('public.memberCountries.directory.search.activeFilters')}</span>
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
            {t('public.memberCountries.directory.results.countriesFound', { count: filteredAndSortedCountries.length })}
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
              <p className="text-lg font-medium mb-2">{t('public.memberCountries.directory.results.noCountryFound')}</p>
              <p className="text-sm">{t('public.memberCountries.directory.results.tryOtherFilters')}</p>
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
              {t('public.memberCountries.directory.pagination.previous')}
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
                        <span key={`ellipsis-${prevPage}`} className="px-2 text-muted-foreground">...</span>
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
              {t('public.memberCountries.directory.pagination.next')}
            </Button>
          </div>
        )}

        {/* Regions Overview */}
        {search === '' && selectedRegion === 'all' && (
          <Card className="mt-12">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                {t('public.memberCountries.directory.regionsOverview.title')}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {regions.map((region) => {
                  const countriesInRegion = allCountries.filter(c => c.region === region);
                  const totalProjects = countriesInRegion.reduce((sum, c) => sum + (c.project_count || 0), 0);
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
                        {regionNames[region] || region}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">{countriesInRegion.length}</span> {t('public.memberCountries.directory.regionsOverview.countries')}
                        </span>
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">{totalProjects}</span> {t('public.memberCountries.directory.regionsOverview.projects')}
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
