/**
 * Hook d'autosave pour l'éditeur de documents
 * Sauvegarde automatiquement le contenu toutes les 30 secondes
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { coRedactionService } from '../services/co-redaction-service';

interface UseAutosaveOptions {
  documentId: string;
  content: string;
  enabled?: boolean;
  intervalMs?: number;
  onSave?: () => void;
  onError?: (error: Error) => void;
}

interface AutosaveState {
  isSaving: boolean;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
}

export function useAutosave({
  documentId,
  content,
  enabled = true,
  intervalMs = 30000,
  onSave,
  onError,
}: UseAutosaveOptions) {
  const [state, setState] = useState<AutosaveState>({
    isSaving: false,
    lastSavedAt: null,
    hasUnsavedChanges: false,
  });

  const contentRef = useRef(content);
  const lastSavedContentRef = useRef(content);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mettre à jour la ref du contenu
  useEffect(() => {
    contentRef.current = content;
    if (content !== lastSavedContentRef.current) {
      setState(prev => ({ ...prev, hasUnsavedChanges: true }));
    }
  }, [content]);

  const save = useCallback(async () => {
    const currentContent = contentRef.current;
    if (currentContent === lastSavedContentRef.current) return;

    setState(prev => ({ ...prev, isSaving: true }));
    try {
      await coRedactionService.updateDocument(documentId, {
        content: currentContent,
      });
      lastSavedContentRef.current = currentContent;
      setState({
        isSaving: false,
        lastSavedAt: new Date(),
        hasUnsavedChanges: false,
      });
      onSave?.();
    } catch (error) {
      setState(prev => ({ ...prev, isSaving: false }));
      onError?.(error as Error);
    }
  }, [documentId, onSave, onError]);

  // Auto-save interval
  useEffect(() => {
    if (!enabled) return;

    timerRef.current = setInterval(() => {
      save();
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, intervalMs, save]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (contentRef.current !== lastSavedContentRef.current) {
        coRedactionService.updateDocument(documentId, {
          content: contentRef.current,
        }).catch(() => {
          // Silently fail on unmount
        });
      }
    };
  }, [documentId]);

  return {
    ...state,
    saveNow: save,
  };
}
