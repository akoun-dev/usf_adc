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
  Layout,
  ExternalLink,
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
import { motion, AnimatePresence } from 'framer-motion';

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
      if (doc.locked_by === user?.id) {
        setIsLocked(true);
        return;
      }
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
  }, [doc, id, isLoading, user?.id, isLocked]);

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

  const handleExit = useCallback(async () => {
    if (!id) return;
    setIsExiting(true);
    try {
      if (hasUnsavedChanges) {
        await saveNow();
      }
      await unlockDoc.mutateAsync(id);
      navigate(`/admin/co-redaction/${id}`);
    } catch {
      navigate(`/admin/co-redaction/${id}`);
    } finally {
      setIsExiting(false);
    }
  }, [id, hasUnsavedChanges, saveNow, unlockDoc, navigate]);

  const handleSubmit = useCallback(async () => {
    if (!id) return;
    try {
      await saveVersion.mutateAsync({
        documentId: id,
        content,
        changeSummary: t('coRedaction.submission', 'Soumission des modifications'),
      });
      await changeStatus.mutateAsync({ id, status: 'submitted' });
      await unlockDoc.mutateAsync(id);
      navigate(`/admin/co-redaction/${id}`);
    } catch (error) {
      toast.error(t('coRedaction.submitFailed', 'Échec de la soumission'));
    }
  }, [id, content, saveVersion, changeStatus, unlockDoc, navigate, t]);

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    if (!id) return '';
    return uploadFile.mutateAsync({ file, documentId: id });
  }, [id, uploadFile]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-[700px] w-full rounded-xl shadow-lg" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-accent/20 rounded-3xl border border-dashed">
          <Layout className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-xl font-medium">{t('coRedaction.docNotFound', 'Document non trouvé')}</p>
          <Button variant="outline" className="mt-6 rounded-full" onClick={() => navigate('/admin/co-redaction')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('coRedaction.back', 'Retour')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f8fafc] dark:bg-background"
    >
      {/* Barre d'outils supérieure avec Glassmorphism */}
      <div className="sticky top-0 z-50 border-b bg-white/70 dark:bg-background/70 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExit}
              disabled={isExiting}
              className="rounded-full hover:bg-accent/50"
            >
              {isExiting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowLeft className="h-5 w-5" />
              )}
            </Button>

            <div className="flex flex-col flex-1 min-w-0">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  if (title !== doc.title) {
                    updateDoc.mutate({ id: doc.id, input: { title } });
                  }
                }}
                className="bg-transparent border-none text-lg font-semibold focus:outline-none focus:ring-0 p-0 truncate placeholder:opacity-50"
                placeholder={t('coRedaction.untitled', 'Sans titre')}
              />
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                <DocumentStatusBadge status={doc.status_workflow} />
                <span>•</span>
                <span>{doc.category || 'General'}</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {/* Indicateur de sauvegarde */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={isSaving ? 'saving' : hasUnsavedChanges ? 'unsaved' : 'saved'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-accent/30"
                >
                  {isSaving ? (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  ) : hasUnsavedChanges ? (
                    <CloudOff className="h-3 w-3 text-orange-500" />
                  ) : (
                    <Cloud className="h-3 w-3 text-green-500" />
                  )}
                  <span className="text-muted-foreground">
                    {isSaving ? t('coRedaction.saving', 'Sauvegarde...') : 
                     hasUnsavedChanges ? t('coRedaction.unsaved', 'Non sauvegardé') : 
                     t('coRedaction.saved', 'Sauvegardé')}
                  </span>
                </motion.div>
              </AnimatePresence>

              <Separator orientation="vertical" className="h-8 mx-1" />

              <div className="flex items-center gap-1">
                <LockIndicator
                  lockedBy={doc.locked_by}
                  lockedAt={doc.locked_at}
                  lockedByName={doc.locked_by_profile?.full_name}
                  currentUserId={user?.id}
                />
                
                <VersionHistory documentId={doc.id} currentContent={content} />
                
                <DocumentPermissionsDialog documentId={doc.id} />
              </div>

              <Separator orientation="vertical" className="h-8 mx-1" />

              <div className="flex items-center gap-2">
                <Button 
                  onClick={saveNow} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full gap-2 border-primary/20 hover:border-primary/50"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden lg:inline">{t('coRedaction.save', 'Sauvegarder')}</span>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" className="rounded-full gap-2 shadow-lg shadow-primary/20">
                      <Send className="h-4 w-4" />
                      {t('coRedaction.submit', 'Soumettre')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('coRedaction.confirmSubmit', 'Confirmer la soumission')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('coRedaction.confirmSubmitDesc', 'Une version sera sauvegardée et le document sera marqué comme soumis.')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full">{t('coRedaction.cancel', 'Annuler')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit} className="rounded-full shadow-lg">
                        {t('coRedaction.submit', 'Soumettre')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de l'éditeur */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-card rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-200 dark:border-border"
        >
          <RichTextEditor
            content={content}
            onChange={setContent}
            editable={isLocked}
            placeholder={t('coRedaction.editorPlaceholder', 'Commencez à écrire votre document...')}
            onImageUpload={handleImageUpload}
          />
        </motion.div>
        
        {/* Footer info */}
        <div className="mt-6 flex justify-between items-center text-[11px] text-muted-foreground uppercase tracking-widest font-semibold px-4">
          <div className="flex gap-4">
            <span>Words: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}</span>
            <span>Characters: {content.replace(/<[^>]*>/g, '').length}</span>
          </div>
          {lastSavedAt && (
            <span>Last saved: {new Date(lastSavedAt).toLocaleTimeString()}</span>
          )}
        </div>
      </main>
    </motion.div>
  );
}
