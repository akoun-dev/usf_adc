import { useCallback, useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUploadAttachment, useDeleteAttachment } from '../hooks/useUploadAttachment';
import { useQuery } from '@tanstack/react-query';
import { fsuService } from '../services/fsu-service';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { FsuAttachment } from '../types';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

interface Props {
  submissionId: string;
  userId: string;
  readOnly?: boolean;
}

export function AttachmentUploader({ submissionId, userId, readOnly }: Props) {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);
  const upload = useUploadAttachment();
  const remove = useDeleteAttachment();

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['fsu-attachments', submissionId],
    queryFn: () => fsuService.getAttachments(submissionId),
  });

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast({ title: t('fsu.attachments.typeError'), description: t('fsu.attachments.typeErrorDesc', { name: file.name }), variant: 'destructive' });
        return;
      }
      if (file.size > MAX_SIZE) {
        toast({ title: t('fsu.attachments.sizeError'), description: t('fsu.attachments.sizeErrorDesc', { name: file.name }), variant: 'destructive' });
        return;
      }
      upload.mutate(
        { submissionId, userId, file },
        {
          onSuccess: () => toast({ title: t('fsu.attachments.uploaded'), description: file.name }),
          onError: () => toast({ title: t('fsu.attachments.uploadError'), description: file.name, variant: 'destructive' }),
        }
      );
    });
  }, [submissionId, userId, upload, t]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleRemove = (att: FsuAttachment) => {
    remove.mutate(
      { attachmentId: att.id, filePath: att.file_path, submissionId },
      { onSuccess: () => toast({ title: t('fsu.attachments.deleted') }) }
    );
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-foreground">{t('fsu.attachments.title')}</h4>

      {!readOnly && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t('fsu.attachments.dropHere')}{' '}
            <label className="cursor-pointer text-primary underline">
              {t('fsu.attachments.browse')}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.xlsx,.xls"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t('fsu.attachments.hint')}</p>
        </div>
      )}

      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

      {attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map((att) => (
            <li key={att.id} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate">{att.file_name}</span>
              <span className="text-xs text-muted-foreground">{(att.file_size / 1024).toFixed(0)} Ko</span>
              {!readOnly && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemove(att)}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}