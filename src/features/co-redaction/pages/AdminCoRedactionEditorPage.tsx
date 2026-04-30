/**
 * Page d'édition d'un document avec TipTap
 * Gère le verrouillage, l'autosave et la soumission
 */
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Save,
  Send,
  CheckCircle,
  Lock,
  Unlock,
  Loader2,
  Clock,
  Cloud,
  CloudOff,
  History,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';
import { RichTextEditor } from '../components/RichTextEditor';
import { LockIndicator } from '../components/LockIndicator';
import { DocumentStatusBadge } from '../components/DocumentStatusBadge';
import { VersionHistory } from '../components/VersionHistory';
import { DocumentPermissionsDialog } from '../components/DocumentPermissionsDialog';
import {
  useDocument,
  useLockDocument,
  useUnlockDocument,
  useUpdateDocument,
  useSaveVersion,
  useChangeWorkflowStatus,
  useUploadFile,
  useDocumentRealtime,
} from '../hooks/useCoRedaction';
import { useAutosave } from '../hooks/useAutosave';

export default function AdminCoRedactionEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: doc, isLoading } = useDocument(id);
  const lockDoc = useLockDocument();
  const unlockDoc = useUnlockDocument();
  const updateDoc = useUpdateDocument();
  const saveVersion = useSaveVersion();
  const changeStatus = useChangeWorkflowStatus();
  const uploadFile = useUploadFile();

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Realtime
  useDocumentRealtime({ documentId: id });

  // Charger le contenu du document
  useEffect(() => {
    if (doc) {
      setContent(doc.content || '');
      setTitle(doc.title || '');
    }
  }, [doc]);

  // Verrouiller le document au chargement
  useEffect(() => {
    if (doc && id && !isLocked && !isLoading) {
      // Vérifier si déjà verrouillé par l'utilisateur courant
      if (doc.locked_by === user?.id) {
        setIsLocked(true);
        return;
      }
      // Verrouiller
      lockDoc.mutate(id, {
        onSuccess: () => {
          setIsLocked(true);
        },
        onError: (error) => {
          toast.error(t('coRedaction.cannotLock', 'Impossible de verrouiller: {{error}}', { error: error.message }));
          navigate(`/admin/co-redaction/${id}`);
        },
      });
    }
  }, [doc, id, isLoading]);

  // Autosave
  const { isSaving, lastSavedAt, hasUnsavedChanges, saveNow } = useAutosave({
    documentId: id || '',
    content,
    enabled: isLocked,
    intervalMs: 30000,
    onError: () => {
      toast.error(t('coRedaction.autosaveFailed', 'Échec de la sauvegarde automatique'));
    },
  });

  // Déverrouiller en quittant
  const handleExit = useCallback(async () => {
    if (!id) return;
    setIsExiting(true);
    try {
      // Sauvegarder d'abord
      if (hasUnsavedChanges) {
        await saveNow();
      }
      // Déverrouiller
      await unlockDoc.mutateAsync(id);
      navigate(`/admin/co-redaction/${id}`);
    } catch {
      navigate(`/admin/co-redaction/${id}`);
    } finally {
      setIsExiting(false);
    }
  }, [id, hasUnsavedChanges, saveNow, unlockDoc, navigate]);

  // Soumettre les modifications
  const handleSubmit = useCallback(async () => {
    if (!id) return;
    try {
      // Sauvegarder une version
      await saveVersion.mutateAsync({
        documentId: id,
        content,
        changeSummary: t('coRedaction.submission', 'Soumission des modifications'),
      });
      // Changer le statut
      await changeStatus.mutateAsync({ id, status: 'submitted' });
      // Déverrouiller
      await unlockDoc.mutateAsync(id);
      navigate(`/admin/co-redaction/${id}`);
    } catch (error) {
      toast.error(t('coRedaction.submitFailed', 'Échec de la soumission'));
    }
  }, [id, content, saveVersion, changeStatus, unlockDoc, navigate, t]);

  // Upload d'image dans l'éditeur
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    if (!id) return '';
    return uploadFile.mutateAsync({ file, documentId: id });
  }, [id, uploadFile]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
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
    <div className="min-h-screen bg-background">
      {/* Barre d'outils supérieure */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 h-14">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              disabled={isExiting}
            >
              {isExiting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowLeft className="mr-2 h-4 w-4" />
              )}
              {t('coRedaction.back', 'Retour')}
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                if (title !== doc.title) {
                  updateDoc.mutate({ id: doc.id, input: { title } });
                }
              }}
              className="h-8 max-w-sm border-0 text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent"
            />

            <div className="flex-1" />

            {/* Indicateur de sauvegarde */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('coRedaction.saving', 'Sauvegarde...')}</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <CloudOff className="h-4 w-4 text-orange-500" />
                  <span>{t('coRedaction.unsaved', 'Non sauvegardé')}</span>
                </>
              ) : (
                <>
                  <Cloud className="h-4 w-4 text-green-500" />
                  <span>{t('coRedaction.saved', 'Sauvegardé')}</span>
                </>
              )}
            </div>

            <Separator orientation="vertical" className="h-6" />

            <DocumentStatusBadge status={doc.status_workflow} />

            <LockIndicator
              lockedBy={doc.locked_by}
              lockedAt={doc.locked_at}
              lockedByName={doc.locked_by_profile?.full_name}
              currentUserId={user?.id}
              compact
            />

            <Separator orientation="vertical" className="h-6" />

            <VersionHistory documentId={doc.id} currentContent={content} />

            <DocumentPermissionsDialog documentId={doc.id} />

            <Button onClick={saveNow} variant="outline" size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              {t('coRedaction.save', 'Sauvegarder')}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Send className="h-4 w-4" />
                  {t('coRedaction.submit', 'Soumettre')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('coRedaction.confirmSubmit', 'Confirmer la soumission')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('coRedaction.confirmSubmitDesc', 'Une version sera sauvegardée et le document sera marqué comme soumis.')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('coRedaction.cancel', 'Annuler')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>
                    {t('coRedaction.submit', 'Soumettre')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Éditeur */}
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <RichTextEditor
          content={content}
          onChange={setContent}
          editable={isLocked}
          placeholder={t('coRedaction.editorPlaceholder', 'Commencez à écrire votre document...')}
          onImageUpload={handleImageUpload}
        />
      </div>
    </div>
  );
}
