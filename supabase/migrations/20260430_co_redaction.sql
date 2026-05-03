-- ============================================================
-- Migration: Co-Rédaction de documents
-- Description: Tables pour la co-rédaction collaborative
-- ============================================================

-- 1. Ajouter les colonnes manquantes à la table documents existante
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS locked_by UUID NULL,
  ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS status_workflow TEXT DEFAULT 'draft'
    CHECK (status_workflow IN ('draft', 'editing', 'submitted', 'closed', 'reopened')),
  ADD COLUMN IF NOT EXISTS last_edited_by UUID NULL,
  ADD COLUMN IF NOT EXISTS country_id UUID NULL,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS file_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS closed_by UUID NULL;

-- FK pour locked_by vers profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'documents_locked_by_fkey'
  ) THEN
    ALTER TABLE public.documents
      ADD CONSTRAINT documents_locked_by_fkey
      FOREIGN KEY (locked_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- FK pour last_edited_by vers profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'documents_last_edited_by_fkey'
  ) THEN
    ALTER TABLE public.documents
      ADD CONSTRAINT documents_last_edited_by_fkey
      FOREIGN KEY (last_edited_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- FK pour closed_by vers profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'documents_closed_by_fkey'
  ) THEN
    ALTER TABLE public.documents
      ADD CONSTRAINT documents_closed_by_fkey
      FOREIGN KEY (closed_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 2. Table document_versions
CREATE TABLE IF NOT EXISTS public.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  content TEXT DEFAULT '',
  change_summary TEXT NULL,
  created_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- S'assurer que les colonnes de la co-rédaction existent si la table existait déjà
ALTER TABLE public.document_versions
  ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS change_summary TEXT NULL;

-- Rendre les colonnes de fichiers optionnelles pour supporter la co-rédaction (texte pur)
ALTER TABLE public.document_versions 
  ALTER COLUMN file_path DROP NOT NULL,
  ALTER COLUMN file_name DROP NOT NULL;

-- Index pour document_versions
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_created_at ON public.document_versions(created_at DESC);

-- 3. Table document_permissions
CREATE TABLE IF NOT EXISTS public.document_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('editor', 'reviewer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(document_id, user_id)
);

-- Index pour document_permissions
CREATE INDEX IF NOT EXISTS idx_document_permissions_document_id ON public.document_permissions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_permissions_user_id ON public.document_permissions(user_id);

-- 4. Table document_comments (commentaires publics sur les documents clôturés)
CREATE TABLE IF NOT EXISTS public.document_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonyme',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour document_comments
CREATE INDEX IF NOT EXISTS idx_document_comments_document_id ON public.document_comments(document_id);
CREATE INDEX IF NOT EXISTS idx_document_comments_created_at ON public.document_comments(created_at DESC);

-- 5. Activer RLS sur les nouvelles tables
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_comments ENABLE ROW LEVEL SECURITY;

-- 6. Politiques RLS pour document_versions
CREATE POLICY "document_versions_select_authenticated" ON public.document_versions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "document_versions_insert_authenticated" ON public.document_versions
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.documents WHERE id = document_id
  ));

CREATE POLICY "document_versions_select_public" ON public.document_versions
  FOR SELECT TO anon USING (
    EXISTS (
      SELECT 1 FROM public.documents WHERE id = document_id AND is_public = true
    )
  );

-- 7. Politiques RLS pour document_permissions
CREATE POLICY "document_permissions_select_authenticated" ON public.document_permissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "document_permissions_insert_admin" ON public.document_permissions
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'country_admin')
    )
  );

CREATE POLICY "document_permissions_update_admin" ON public.document_permissions
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'country_admin')
    )
  );

CREATE POLICY "document_permissions_delete_admin" ON public.document_permissions
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'country_admin')
    )
  );

-- 8. Politiques RLS pour document_comments
CREATE POLICY "document_comments_select_all" ON public.document_comments
  FOR SELECT USING (true);

CREATE POLICY "document_comments_insert_authenticated" ON public.document_comments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "document_comments_update_own" ON public.document_comments
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "document_comments_delete_own" ON public.document_comments
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 9. Politiques RLS supplémentaires pour documents (co-rédaction)
-- Mise à jour: les utilisateurs avec permission ou admins peuvent modifier
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents_update_authenticated" ON public.documents
               FOR UPDATE TO authenticated
               USING (
                 -- Vérifier si l'utilisateur a des permissions sur le document
                 EXISTS (
                   SELECT 1 FROM public.document_permissions
                   WHERE document_id = id AND user_id = auth.uid() AND role IN ('editor', 'admin')
                 )
                 -- Ou un admin
                 OR EXISTS (
                   SELECT 1 FROM public.profiles WHERE id = auth.uid() AND public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin')
                 )
                 -- Ou un point focal
                 OR EXISTS (
                   SELECT 1 FROM public.profiles WHERE id = auth.uid() AND public.has_role(auth.uid(), 'point_focal')
                 )
               );

-- 10. Fonction pour auto-déverrouiller les documents après 30 minutes
CREATE OR REPLACE FUNCTION public.unlock_expired_documents()
RETURNS void AS $$
BEGIN
  UPDATE public.documents
  SET locked_by = NULL, locked_at = NULL
  WHERE locked_by IS NOT NULL
    AND locked_at < now() - interval '30 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Trigger pour auto-déverrouillage
CREATE OR REPLACE FUNCTION public.check_document_lock()
RETURNS TRIGGER AS $$
BEGIN
  -- Déverrouiller si le lock a expiré
  IF OLD.locked_by IS NOT NULL AND OLD.locked_at < now() - interval '30 minutes' THEN
    NEW.locked_by = NULL;
    NEW.locked_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_check_document_lock ON public.documents;
CREATE TRIGGER trigger_check_document_lock
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.check_document_lock();

-- 12. Fonction pour créer une notification de document
CREATE OR REPLACE FUNCTION public.notify_document_change()
RETURNS TRIGGER AS $$
DECLARE
  doc_title TEXT;
  doc_id UUID;
BEGIN
  doc_id := COALESCE(NEW.id, OLD.id);
  doc_title := COALESCE(NEW.title, OLD.title, 'Sans titre');

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

DROP TRIGGER IF EXISTS trigger_notify_document_change ON public.documents;
CREATE TRIGGER trigger_notify_document_change
  AFTER UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_document_change();

-- 13. Activer Realtime pour les tables de co-rédaction
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.document_versions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.document_permissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.document_comments;
