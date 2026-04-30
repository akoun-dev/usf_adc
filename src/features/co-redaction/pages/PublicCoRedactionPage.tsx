/**
 * Page publique de co-rédaction
 * Affiche les documents clôturés/publics
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  User,
  MessageSquare,
  Edit,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PublicLayout } from '@/features/public/components/PublicLayout';
import {
  usePublicDocuments,
  useDocumentsRealtime,
} from '../hooks/useCoRedaction';

const CATEGORIES = [
  { value: 'general', label: 'Général' },
  { value: 'legal', label: 'Juridique' },
  { value: 'technical', label: 'Technique' },
  { value: 'reports', label: 'Rapports' },
  { value: 'templates', label: 'Modèles' },
  { value: 'policy', label: 'Politiques' },
];

export default function PublicCoRedactionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, highestRole } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Realtime
  useDocumentsRealtime();

  const { data: documents, isLoading } = usePublicDocuments({
    search: search || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  });

  const role = highestRole?.();
  const canEdit = role === 'super_admin' || role === 'country_admin' || role === 'point_focal';

  const formatDate = (date: string) => {
    return format(new Date(date), 'PP', { locale: fr });
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('coRedaction.publicTitle', 'Co-Rédaction')}
          </h1>
          <p className="text-muted-foreground">
            {t('coRedaction.publicSubtitle', 'Documents collaboratifs publiés')}
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('coRedaction.searchPublic', 'Rechercher un document...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('coRedaction.filterCategory', 'Catégorie')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('coRedaction.allCategories', 'Toutes catégories')}</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grille de documents */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => navigate(`/co-redaction/${doc.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {CATEGORIES.find(c => c.value === doc.category)?.label || doc.category}
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="px-5 py-3 border-t bg-muted/20">
                  <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{doc.created_by_profile?.full_name || '—'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(doc.updated_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{t('coRedaction.view', 'Voir')}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">{t('coRedaction.noPublicDocs', 'Aucun document public')}</p>
            <p className="text-sm">{t('coRedaction.noPublicDocsDesc', 'Les documents clôturés apparaîtront ici')}</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
