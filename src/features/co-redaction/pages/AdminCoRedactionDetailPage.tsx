/**
 * Page de détail d'un document (admin)
 * Affiche le contenu, les métadonnées, les versions et les actions
 */
import { useCallback, useState } from 'react';
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
  Edit,
  CheckCircle,
  RotateCcw,
  Send,
  Lock,
  Unlock,
  Download,
  History,
  Shield,
  FileText,
  Calendar,
  User,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import PageHero from '@/components/PageHero';
import { DocumentStatusBadge } from '../components/DocumentStatusBadge';
import { LockIndicator } from '../components/LockIndicator';
import { VersionHistory } from '../components/VersionHistory';
import { DocumentPermissionsDialog } from '../components/DocumentPermissionsDialog';
import { DocumentComments } from '../components/DocumentComments';
import {
  useDocument,
  useChangeWorkflowStatus,
  useForceUnlockDocument,
  useDocumentRealtime,
} from '../hooks/useCoRedaction';

export default function AdminCoRedactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('content');

  const { data: doc, isLoading } = useDocument(id);
  const changeStatus = useChangeWorkflowStatus();
  const forceUnlock = useForceUnlockDocument();

  // Realtime updates
  useDocumentRealtime({ documentId: id });

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return format(new Date(date), 'PPp', { locale: fr });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4" />
          <p>{t('coRedaction.docNotFound', 'Document non trouvé')}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/co-redaction')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('coRedaction.back', 'Retour')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title={doc.title}
        subtitle={doc.description || ''}
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Barre d'actions */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => navigate('/admin/co-redaction')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('coRedaction.back', 'Retour')}
          </Button>

          <div className="flex-1" />

          <DocumentStatusBadge status={doc.status_workflow} />
          <LockIndicator
            lockedBy={doc.locked_by}
            lockedAt={doc.locked_at}
            lockedByName={doc.locked_by_profile?.full_name}
            currentUserId={user?.id}
          />

          <Separator orientation="vertical" className="h-6" />

          <Button
            onClick={() => navigate(`/admin/co-redaction/${doc.id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            {t('coRedaction.edit', 'Éditer')}
          </Button>

          {doc.locked_by && doc.locked_by !== user?.id && (
            <Button
              variant="outline"
              onClick={() => forceUnlock.mutate(doc.id)}
              className="gap-2"
            >
              <Unlock className="h-4 w-4" />
              {t('coRedaction.forceUnlock', 'Déverrouiller')}
            </Button>
          )}

          {['draft', 'editing', 'submitted', 'reopened'].includes(doc.status_workflow) && (
            <Button
              variant="outline"
              onClick={() => changeStatus.mutate({ id: doc.id, status: 'closed' })}
              className="gap-2 text-green-600"
            >
              <CheckCircle className="h-4 w-4" />
              {t('coRedaction.close', 'Clôturer')}
            </Button>
          )}

          {doc.status_workflow === 'closed' && (
            <Button
              variant="outline"
              onClick={() => changeStatus.mutate({ id: doc.id, status: 'reopened' })}
              className="gap-2 text-orange-600"
            >
              <RotateCcw className="h-4 w-4" />
              {t('coRedaction.reopen', 'Réouvrir')}
            </Button>
          )}

          <DocumentPermissionsDialog documentId={doc.id} />
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
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">{t('coRedaction.lastEditedBy', 'Dernière édition')}</p>
                  <p className="font-medium">{doc.last_edited_by_profile?.full_name || '—'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contenu avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="content">
              <FileText className="mr-2 h-4 w-4" />
              {t('coRedaction.content', 'Contenu')}
            </TabsTrigger>
            <TabsTrigger value="versions">
              <History className="mr-2 h-4 w-4" />
              {t('coRedaction.versions', 'Versions')}
            </TabsTrigger>
            <TabsTrigger value="comments">
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
                    <p>{t('coRedaction.noContent', 'Aucun contenu')}</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate(`/admin/co-redaction/${doc.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {t('coRedaction.startEditing', 'Commencer l\'édition')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="versions" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <VersionHistory documentId={doc.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <DocumentComments documentId={doc.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
