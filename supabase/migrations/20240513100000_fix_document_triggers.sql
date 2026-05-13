-- ============================================================
-- Migration: Fix document triggers for JSONB support
-- Description: Updates notify_document_change to handle jsonb titles
-- ============================================================

CREATE OR REPLACE FUNCTION public.notify_document_change()
RETURNS TRIGGER AS $$
DECLARE
  doc_title TEXT;
  doc_id UUID;
BEGIN
  doc_id := COALESCE(NEW.id, OLD.id);
  
  -- Extract title from JSONB (try French first, then English, then raw string, then default)
  IF jsonb_typeof(COALESCE(NEW.title, OLD.title)) = 'object' THEN
    doc_title := COALESCE(
      (COALESCE(NEW.title, OLD.title))->>'fr', 
      (COALESCE(NEW.title, OLD.title))->>'en',
      'Sans titre'
    );
  ELSE
    doc_title := COALESCE((COALESCE(NEW.title, OLD.title))::text, 'Sans titre');
  END IF;

  -- Notification de clôture
  IF (TG_OP = 'UPDATE' AND NEW.status_workflow = 'closed' AND OLD.status_workflow != 'closed') THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    SELECT
      dp.user_id,
      'info',
      'Document clôturé',
      'Le document "' || doc_title || '" a été clôturé et est maintenant public.',
      '/co-redaction/' || doc_id
    FROM public.document_permissions dp
    WHERE dp.document_id = doc_id AND dp.user_id != auth.uid();
    RETURN NEW;
  END IF;

  -- Notification de réouverture
  IF (TG_OP = 'UPDATE' AND NEW.status_workflow = 'reopened' AND OLD.status_workflow != 'reopened') THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    SELECT
      dp.user_id,
      'info',
      'Document réouvert',
      'Le document "' || doc_title || '" est de nouveau ouvert à la modification.',
      '/co-redaction/' || doc_id
    FROM public.document_permissions dp
    WHERE dp.document_id = doc_id AND dp.user_id != auth.uid();
    RETURN NEW;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
