/**
 * Hook Realtime pour surveiller les changements sur un document
 * Utilise Supabase Realtime pour les mises à jour en temps réel
 */
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

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

/**
 * Hook Realtime pour surveiller tous les documents (liste)
 */
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
