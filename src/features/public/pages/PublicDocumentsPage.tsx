import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Download, Filter, FolderOpen, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';
import { PublicLayout } from '../components/PublicLayout';
import { usePublicDocuments, DOCUMENT_CATEGORIES, DOCUMENT_TYPES } from '../hooks/usePublicDocuments';
import type { PublicDocument } from '../data/mockDocuments';

const CATEGORIES = [
  { value: 'all', label: 'all' },
  ...Object.entries(DOCUMENT_CATEGORIES).map(([key, val]) => ({
    value: key,
    label: val.label,
    icon: val.icon,
  })),
];

const LANGUAGES = [
  { value: 'all', label: 'all' },
  { value: 'FR', label: 'Français' },
  { value: 'EN', label: 'English' },
];

function formatDocumentDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PublicDocumentsPage() {
  const { t } = useTranslation();
  const { data: documents, isLoading } = usePublicDocuments();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [language, setLanguage] = useState('all');

  const allDocuments = useMemo(() => documents ?? [], [documents]);

  const filteredDocuments = useMemo(() => {
    return allDocuments.filter((document) => {
      const query = search.trim().toLowerCase();
      const matchSearch = !query ||
        document.title.toLowerCase().includes(query) ||
        document.description.toLowerCase().includes(query) ||
        document.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchCategory = category === 'all' || document.category === category;
      const matchLanguage = language === 'all' || document.language === language;

      return matchSearch && matchCategory && matchLanguage;
    });
  }, [allDocuments, category, language, search]);

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHero
          title={t('public.documents.title')}
          description={t('public.documents.description')}
          icon={<FolderOpen className="h-6 w-6 text-secondary" />}
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('public.documents.search')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.value === 'all' ? t('public.documents.allCategories') : item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.value === 'all' ? t('public.documents.allLanguages') : item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="border-primary/20 text-primary h-10 px-4 flex items-center">
            {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item}>
                <CardContent className="p-6">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <FolderOpen className="mx-auto h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">
                {t('public.documents.empty')}
              </p>
              <p className="text-sm">
                {t('public.news.tryOtherFilters')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              {t('public.documents.title')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((document) => (
                <LibraryDocumentCard key={document.id} document={document} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}

function LibraryDocumentCard({ document }: { document: PublicDocument }) {
  const categoryInfo = DOCUMENT_CATEGORIES[document.category as keyof typeof DOCUMENT_CATEGORIES];
  const typeInfo = DOCUMENT_TYPES[document.type as keyof typeof DOCUMENT_TYPES];

  return (
    <Card className="group overflow-hidden border-primary/10 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[var(--shadow-md)] transition-all">
      <CardContent className="p-0">
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/15">
          {document.thumbnail ? (
            <img
              src={document.thumbnail}
              alt={document.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(152,100%,16%)/0.78] via-[hsl(152,100%,18%)/0.20] to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
              {typeInfo.icon} {typeInfo.label}
            </Badge>
            <Badge variant="outline" className="border-white/25 bg-white/10 text-white">
              {document.language}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          {categoryInfo ? (
            <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
              {categoryInfo.icon} {categoryInfo.label}
            </Badge>
          ) : null}

          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{document.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{document.description}</p>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {document.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDocumentDate(document.publishedDate)}
            </span>
            <span>{document.fileSize}</span>
          </div>

          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <a href={document.downloadUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Télécharger le document
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
