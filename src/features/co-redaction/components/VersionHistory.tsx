/**
 * Historique des versions d'un document
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { History, Eye, User, Clock, FileText } from 'lucide-react';
import { useDocumentVersions } from '../hooks/useCoRedaction';
import { RichTextEditor } from './RichTextEditor';
import type { DocumentVersion } from '../types';

interface VersionHistoryProps {
  documentId: string;
  currentContent?: string;
  onRestore?: (content: string) => void;
  trigger?: React.ReactNode;
}

export function VersionHistory({
  documentId,
  currentContent,
  onRestore,
  trigger,
}: VersionHistoryProps) {
  const { t } = useTranslation();
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const { data: versions, isLoading } = useDocumentVersions(documentId);

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPpp', { locale: fr });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            {t('coRedaction.versionHistory', 'Historique des versions')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t('coRedaction.versionHistory', 'Historique des versions')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-4 min-h-[400px]">
          {/* Liste des versions */}
          <div className="col-span-2 border rounded-lg">
            <ScrollArea className="h-[500px]">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : versions && versions.length > 0 ? (
                <div className="p-2">
                  {versions.map((version, idx) => (
                    <button
                      key={version.id}
                      onClick={() => {
                        setSelectedVersion(version);
                        setShowDiff(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                        selectedVersion?.id === version.id
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          v{version.version_number}
                        </Badge>
                        {idx === 0 && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                            {t('coRedaction.latest', 'Récent')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <User className="h-3 w-3" />
                        <span>{version.created_by_profile?.full_name || 'Inconnu'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(version.created_at)}</span>
                      </div>
                      {version.change_summary && (
                        <p className="text-xs mt-1 text-muted-foreground line-clamp-1">
                          {version.change_summary}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-muted-foreground">
                  <FileText className="h-8 w-8 mb-2" />
                  <p className="text-sm">{t('coRedaction.noVersions', 'Aucune version')}</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Aperçu de la version */}
          <div className="col-span-3 border rounded-lg">
            {selectedVersion ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-3 border-b">
                  <div>
                    <span className="font-medium">v{selectedVersion.version_number}</span>
                    {selectedVersion.change_summary && (
                      <span className="text-sm text-muted-foreground ml-2">
                        — {selectedVersion.change_summary}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {onRestore && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRestore(selectedVersion.content)}
                      >
                        {t('coRedaction.restore', 'Restaurer')}
                      </Button>
                    )}
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none p-4"
                    dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
                  />
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Eye className="h-8 w-8 mb-2" />
                <p className="text-sm">{t('coRedaction.selectVersion', 'Sélectionnez une version')}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
