/**
 * Hook d'autosave pour l'éditeur de documents
 * Sauvegarde automatiquement le contenu toutes les 30 secondes
 * Et crée une version automatique toutes les 5 minutes si modifications
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { coRedactionService } from '../services/co-redaction-service';

interface UseAutosaveOptions {
  documentId: string;
  content: string;
  enabled?: boolean;
  intervalMs?: number;
  versionIntervalMs?: number; // Nouveau: Intervalle pour les versions auto
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
  versionIntervalMs = 300000, // 5 minutes par défaut
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
  const lastVersionContentRef = useRef(content);
  const lastVersionAtRef = useRef(Date.now());
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
      // Sauvegarde du contenu principal
      await coRedactionService.updateDocument(documentId, {
        content: currentContent,
      });

      // Sauvegarde d'une version automatique si intervalle écoulé
      const now = Date.now();
      if (
        now - lastVersionAtRef.current >= versionIntervalMs && 
        currentContent !== lastVersionContentRef.current
      ) {
        await coRedactionService.saveVersion(
          documentId, 
          currentContent, 
          'Sauvegarde automatique'
        );
        lastVersionAtRef.current = now;
        lastVersionContentRef.current = currentContent;
      }

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
  }, [documentId, onSave, onError, versionIntervalMs]);

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
