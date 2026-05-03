/**
 * Page publique de détail d'un document
 * Affiche le contenu, les versions (pour les autorisés) et les commentaires
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  FileText,
  Download,
  Edit,
  Calendar,
  User,
  Clock,
  History,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PublicLayout } from '@/features/public/components/PublicLayout';
import { DocumentStatusBadge } from '../components/DocumentStatusBadge';
import { VersionHistory } from '../components/VersionHistory';
import { DocumentComments } from '../components/DocumentComments';
import {
  useDocument,
  useDocumentRealtime,
} from '../hooks/useCoRedaction';
import bgHeader from '@/assets/bg-header.jpg';




export default function PublicCoRedactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { highestRole } = useAuth();
  const [activeTab, setActiveTab] = useState('content');

  const { data: doc, isLoading } = useDocument(id);

  // Realtime
  useDocumentRealtime({ documentId: id });

  const role = highestRole?.();
  const canEdit = role === 'super_admin' || role === 'country_admin' || role === 'point_focal';
  const canSeeVersions = canEdit;

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return format(new Date(date), 'PPp', { locale: fr });
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </PublicLayout>
    );
  }

  if (!doc) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4" />
            <p>{t('coRedaction.docNotFound', 'Document non trouvé')}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/co-redaction')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('coRedaction.back', 'Retour')}
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
<div className="space-y-12 relative bg-gray-50">

        {/* Hero */}
        <div
          className="relative bg-cover bg-center bg-no-repeat pb-5 !m-0 border-b"
          style={{ backgroundImage: `url(${bgHeader})` }}
        >
          <div className="absolute inset-0" />
          <div className="relative text-center max-w-4xl mx-auto space-y-6 h-56 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              {t('public.about.title')}
            </h1>
            <p className="text-xl text-base !mt-2">
              {t('public.about.description')}
            </p>
          </div>
        </div>

      </div>



      <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">
        {/* Barre d'actions */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => navigate('/co-redaction')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('coRedaction.back', 'Retour')}
          </Button>

          <div className="flex-1" />

          <DocumentStatusBadge status={doc.status_workflow} />

          {canEdit && (
            <Button
              onClick={() => navigate(`/admin/co-redaction/${doc.id}/edit`)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {t('coRedaction.edit', 'Éditer')}
            </Button>
          )}

          {doc.file_url && (
            <Button variant="outline" asChild>
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                {t('coRedaction.download', 'Télécharger')}
              </a>
            </Button>
          )}
        </div>

        {/* En-tête du document */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
          {doc.description && (
            <p className="text-muted-foreground">{doc.description}</p>
          )}
        </div>

        {/* Métadonnées */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">{t('coRedaction.createdBy', 'Créé par')}</p>
                  <p className="font-medium">{doc.created_by_profile?.full_name || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">{t('coRedaction.createdAt', 'Créé le')}</p>
                  <p className="font-medium">{formatDate(doc.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">{t('coRedaction.updatedAt', 'Mis à jour')}</p>
                  <p className="font-medium">{formatDate(doc.updated_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {doc.category}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="content">
              <FileText className="mr-2 h-4 w-4" />
              {t('coRedaction.content', 'Contenu')}
            </TabsTrigger>
            {canSeeVersions && (
              <TabsTrigger value="versions">
                <History className="mr-2 h-4 w-4" />
                {t('coRedaction.versions', 'Versions')}
              </TabsTrigger>
            )}
            <TabsTrigger value="comments">
              <MessageSquare className="mr-2 h-4 w-4" />
              {t('coRedaction.comments', 'Commentaires')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4">
            <Card>
              <CardContent className="p-6">
                {doc.content ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: doc.content }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4" />
                    <p>{t('coRedaction.noContent', 'Aucun contenu disponible')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {canSeeVersions && (
            <TabsContent value="versions" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <VersionHistory documentId={doc.id} />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="comments" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <DocumentComments documentId={doc.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PublicLayout>
  );
}
