import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { coRedactionService } from '../services/co-redaction-service';
import type {
  DocumentWorkflowStatus,
  DocumentPermissionRole,
  CreateDocumentInput,
  UpdateDocumentInput,
} from '../types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// ================================
// DOCUMENTS
// ================================

export function useDocuments(filters?: {
  status?: DocumentWorkflowStatus;
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ['co-redaction-documents', filters],
    queryFn: () => coRedactionService.getDocuments(filters),
  });
}

export function usePublicDocuments(filters?: {
  category?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['co-redaction-public-documents', filters],
    queryFn: () => coRedactionService.getPublicDocuments(filters),
  });
}

export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: ['co-redaction-document', id],
    queryFn: () => coRedactionService.getDocument(id!),
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (input: CreateDocumentInput) => coRedactionService.createDocument(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-documents'] });
      toast.success(t('coRedaction.docCreated', 'Document créé avec succès'));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDocumentInput }) =>
      coRedactionService.updateDocument(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-documents'] });
      queryClient.invalidateQueries({ queryKey: ['co-redaction-document', variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => coRedactionService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-documents'] });
      toast.success(t('coRedaction.docDeleted', 'Document supprimé'));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ================================
// LOCKING
// ================================

export function useLockDocument() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => coRedactionService.lockDocument(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-document', id] });
      queryClient.invalidateQueries({ queryKey: ['co-redaction-documents'] });
    },
    onError: (error: Error) => {
      toast.error(t('coRedaction.lockFailed', 'Impossible de verrouiller: {{error}}', { error: error.message }));
    },
  });
}

export function useUnlockDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coRedactionService.unlockDocument(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-document', id] });
      queryClient.invalidateQueries({ queryKey: ['co-redaction-documents'] });
    },
  });
}

export function useForceUnlockDocument() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => coRedactionService.forceUnlockDocument(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-document', id] });
      queryClient.invalidateQueries({ queryKey: ['co-redaction-documents'] });
      toast.success(t('coRedaction.forceUnlocked', 'Document déverrouillé de force'));
    },
  });
}

// ================================
// WORKFLOW
// ================================

export function useChangeWorkflowStatus() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, status, changeSummary }: { id: string; status: DocumentWorkflowStatus; changeSummary?: string }) =>
      coRedactionService.changeWorkflowStatus(id, status, changeSummary),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-documents'] });
      queryClient.invalidateQueries({ queryKey: ['co-redaction-document', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['co-redaction-public-documents'] });

      const statusMessages: Record<string, string> = {
        closed: t('coRedaction.docClosed', 'Document clôturé et publié'),
        reopened: t('coRedaction.docReopened', 'Document réouvert pour édition'),
        submitted: t('coRedaction.docSubmitted', 'Document soumis'),
        draft: t('coRedaction.docDraft', 'Document remis en brouillon'),
      };
      toast.success(statusMessages[variables.status] || t('coRedaction.statusChanged', 'Statut modifié'));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ================================
// VERSIONS
// ================================

export function useDocumentVersions(documentId: string | undefined) {
  return useQuery({
    queryKey: ['co-redaction-versions', documentId],
    queryFn: () => coRedactionService.getVersions(documentId!),
    enabled: !!documentId,
  });
}

export function useSaveVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, content, changeSummary }: { documentId: string; content: string; changeSummary?: string }) =>
      coRedactionService.saveVersion(documentId, content, changeSummary),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-versions', variables.documentId] });
    },
  });
}

// ================================
// PERMISSIONS
// ================================

export function useDocumentPermissions(documentId: string | undefined) {
  return useQuery({
    queryKey: ['co-redaction-permissions', documentId],
    queryFn: () => coRedactionService.getPermissions(documentId!),
    enabled: !!documentId,
  });
}

export function useAddPermission() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ documentId, userId, role }: { documentId: string; userId: string; role: DocumentPermissionRole }) =>
      coRedactionService.addPermission(documentId, userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-permissions', variables.documentId] });
      toast.success(t('coRedaction.permissionAdded', 'Permission ajoutée'));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ permissionId, role }: { permissionId: string; role: DocumentPermissionRole }) =>
      coRedactionService.updatePermission(permissionId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-permissions'] });
    },
  });
}

export function useRemovePermission() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (permissionId: string) => coRedactionService.removePermission(permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-permissions'] });
      toast.success(t('coRedaction.permissionRemoved', 'Permission supprimée'));
    },
  });
}

// ================================
// COMMENTS
// ================================

export function useDocumentComments(documentId: string | undefined) {
  return useQuery({
    queryKey: ['co-redaction-comments', documentId],
    queryFn: () => coRedactionService.getComments(documentId!),
    enabled: !!documentId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, content, authorName }: { documentId: string; content: string; authorName?: string }) =>
      coRedactionService.addComment(documentId, content, authorName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-comments', variables.documentId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, documentId }: { commentId: string; documentId: string }) =>
      coRedactionService.deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['co-redaction-comments', variables.documentId] });
    },
  });
}

// ================================
// FILE UPLOAD
// ================================

export function useUploadFile() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ file, documentId }: { file: File; documentId: string }) =>
      coRedactionService.uploadFile(file, documentId),
    onError: (error: Error) => {
      toast.error(t('coRedaction.uploadFailed', 'Erreur lors de l\'upload: {{error}}', { error: error.message }));
    },
  });
}

// ================================
// REALTIME
// ================================

interface UseDocumentRealtimeOptions {
  documentId?: string;
  enabled?: boolean;
}

export function useDocumentRealtime({ documentId, enabled = true }: UseDocumentRealtimeOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !documentId) return;

    const channel = supabase
      .channel(`document-${documentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `id=eq.${documentId}`,
        },
        (payload) => {
          // Mettre à jour le cache avec les nouvelles données
          queryClient.invalidateQueries({ queryKey: ['co-redaction-document', documentId] });
          queryClient.invalidateQueries({ queryKey: ['co-redaction-documents'] });

          // Si le document a été verrouillé par quelqu'un d'autre
          if (payload.new.locked_by && payload.old.locked_by !== payload.new.locked_by) {
            queryClient.invalidateQueries({ queryKey: ['co-redaction-document', documentId] });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'document_versions',
          filter: `document_id=eq.${documentId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['co-redaction-versions', documentId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'document_comments',
          filter: `document_id=eq.${documentId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['co-redaction-comments', documentId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, enabled, queryClient]);
}

export function useDocumentsRealtime(enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel('documents-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['co-redaction-documents'] });
          queryClient.invalidateQueries({ queryKey: ['co-redaction-public-documents'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, queryClient]);
}
