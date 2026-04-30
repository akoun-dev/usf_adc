/**
 * Service pour la co-rédaction de documents
 * Gère CRUD, verrouillage, versioning, permissions et commentaires
 */
import { supabase } from '@/integrations/supabase/client';
import type {
  CoDocument,
  DocumentVersion,
  DocumentPermission,
  DocumentComment,
  CreateDocumentInput,
  UpdateDocumentInput,
  DocumentWorkflowStatus,
  DocumentPermissionRole,
} from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TABLES = {
  documents: 'documents' as any,
  document_versions: 'document_versions' as any,
  document_permissions: 'document_permissions' as any,
  document_comments: 'document_comments' as any,
};

export const coRedactionService = {
  // ================================
  // DOCUMENTS
  // ================================

  async getDocuments(filters?: {
    status?: DocumentWorkflowStatus;
    category?: string;
    search?: string;
  }): Promise<CoDocument[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from(TABLES.documents)
      .select(`*, locked_by_profile:profiles!documents_locked_by_fkey(id, full_name, avatar_url),
        last_edited_by_profile:profiles!documents_last_edited_by_fkey(id, full_name, avatar_url),
        created_by_profile:profiles!documents_created_by_fkey(id, full_name, avatar_url)`)
      .order('updated_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status_workflow', filters.status);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as CoDocument[];
  },

  async getPublicDocuments(filters?: {
    category?: string;
    search?: string;
  }): Promise<CoDocument[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from(TABLES.documents)
      .select(`*, locked_by_profile:profiles!documents_locked_by_fkey(id, full_name, avatar_url),
        last_edited_by_profile:profiles!documents_last_edited_by_fkey(id, full_name, avatar_url),
        created_by_profile:profiles!documents_created_by_fkey(id, full_name, avatar_url)`)
      .eq('is_public', true)
      .eq('status_workflow', 'closed')
      .order('updated_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as CoDocument[];
  },

  async getDocument(id: string): Promise<CoDocument | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.documents)
      .select(`*, locked_by_profile:profiles!documents_locked_by_fkey(id, full_name, avatar_url),
        last_edited_by_profile:profiles!documents_last_edited_by_fkey(id, full_name, avatar_url),
        created_by_profile:profiles!documents_created_by_fkey(id, full_name, avatar_url)`)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as CoDocument;
  },

  async createDocument(input: CreateDocumentInput): Promise<CoDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.documents)
      .insert({
        title: input.title,
        description: input.description || null,
        content: input.content || '',
        category: input.category || 'general',
        country_id: input.country_id || null,
        file_url: input.file_url || null,
        status_workflow: 'draft',
        is_public: false,
        created_by: user.id,
      })
      .select(`*, locked_by_profile:profiles!documents_locked_by_fkey(id, full_name, avatar_url),
        last_edited_by_profile:profiles!documents_last_edited_by_fkey(id, full_name, avatar_url),
        created_by_profile:profiles!documents_created_by_fkey(id, full_name, avatar_url)`)
      .single();

    if (error) throw error;

    // Ajouter le créateur comme admin du document
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from(TABLES.document_permissions)
      .insert({
        document_id: data.id,
        user_id: user.id,
        role: 'admin',
      });

    return data as CoDocument;
  },

  async updateDocument(id: string, input: UpdateDocumentInput): Promise<CoDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const updateData: Record<string, unknown> = {
      ...input,
      last_edited_by: user.id,
      updated_at: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.documents)
      .update(updateData)
      .eq('id', id)
      .select(`*, locked_by_profile:profiles!documents_locked_by_fkey(id, full_name, avatar_url),
        last_edited_by_profile:profiles!documents_last_edited_by_fkey(id, full_name, avatar_url),
        created_by_profile:profiles!documents_created_by_fkey(id, full_name, avatar_url)`)
      .single();

    if (error) throw error;
    return data as CoDocument;
  },

  async deleteDocument(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from(TABLES.documents)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ================================
  // VERROUILLAGE (Pessimistic Locking)
  // ================================

  async lockDocument(id: string): Promise<CoDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Vérifier si le document n'est pas déjà verrouillé
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: doc } = await (supabase as any)
      .from(TABLES.documents)
      .select('locked_by, locked_at')
      .eq('id', id)
      .single();

    if (doc) {
      if (doc.locked_by && doc.locked_by !== user.id) {
        const lockedAt = new Date(doc.locked_at);
        const now = new Date();
        const diffMinutes = (now.getTime() - lockedAt.getTime()) / (1000 * 60);
        if (diffMinutes < 30) {
          throw new Error('Document verrouillé par un autre utilisateur');
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.documents)
      .update({
        locked_by: user.id,
        locked_at: new Date().toISOString(),
        status_workflow: 'editing',
        last_edited_by: user.id,
      })
      .eq('id', id)
      .select(`*, locked_by_profile:profiles!documents_locked_by_fkey(id, full_name, avatar_url),
        last_edited_by_profile:profiles!documents_last_edited_by_fkey(id, full_name, avatar_url),
        created_by_profile:profiles!documents_created_by_fkey(id, full_name, avatar_url)`)
      .single();

    if (error) throw error;
    return data as CoDocument;
  },

  async unlockDocument(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from(TABLES.documents)
      .update({
        locked_by: null,
        locked_at: null,
      })
      .eq('id', id)
      .eq('locked_by', user.id);

    if (error) throw error;
  },

  async forceUnlockDocument(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from(TABLES.documents)
      .update({
        locked_by: null,
        locked_at: null,
      })
      .eq('id', id);

    if (error) throw error;
  },

  // ================================
  // WORKFLOW
  // ================================

  async changeWorkflowStatus(
    id: string,
    status: DocumentWorkflowStatus,
    changeSummary?: string
  ): Promise<CoDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const updateData: Record<string, unknown> = {
      status_workflow: status,
      last_edited_by: user.id,
      updated_at: new Date().toISOString(),
    };

    if (status === 'closed') {
      updateData.is_public = true;
      updateData.closed_at = new Date().toISOString();
      updateData.closed_by = user.id;
      updateData.locked_by = null;
      updateData.locked_at = null;
    }

    if (status === 'reopened') {
      updateData.is_public = false;
      updateData.closed_at = null;
      updateData.closed_by = null;
    }

    // Sauvegarder une version avant le changement
    if (['submitted', 'closed'].includes(status)) {
      const doc = await this.getDocument(id);
      if (doc) {
        await this.saveVersion(id, doc.content, changeSummary || `Statut changé en: ${status}`);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.documents)
      .update(updateData)
      .eq('id', id)
      .select(`*, locked_by_profile:profiles!documents_locked_by_fkey(id, full_name, avatar_url),
        last_edited_by_profile:profiles!documents_last_edited_by_fkey(id, full_name, avatar_url),
        created_by_profile:profiles!documents_created_by_fkey(id, full_name, avatar_url)`)
      .single();

    if (error) throw error;
    return data as CoDocument;
  },

  // ================================
  // VERSIONING
  // ================================

  async saveVersion(
    documentId: string,
    content: string,
    changeSummary?: string
  ): Promise<DocumentVersion> {
    const { data: { user } } = await supabase.auth.getUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: versions } = await (supabase as any)
      .from(TABLES.document_versions)
      .select('version_number')
      .eq('document_id', documentId)
      .order('version_number', { ascending: false })
      .limit(1);

    const nextVersion = (versions?.[0]?.version_number ?? 0) + 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.document_versions)
      .insert({
        document_id: documentId,
        version_number: nextVersion,
        content,
        change_summary: changeSummary || null,
        created_by: user?.id || null,
      })
      .select(`*, created_by_profile:profiles!document_versions_created_by_fkey(id, full_name, avatar_url)`)
      .single();

    if (error) throw error;
    return data as DocumentVersion;
  },

  async getVersions(documentId: string): Promise<DocumentVersion[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.document_versions)
      .select(`*, created_by_profile:profiles!document_versions_created_by_fkey(id, full_name, avatar_url)`)
      .eq('document_id', documentId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return (data ?? []) as DocumentVersion[];
  },

  async getVersion(versionId: string): Promise<DocumentVersion | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.document_versions)
      .select(`*, created_by_profile:profiles!document_versions_created_by_fkey(id, full_name, avatar_url)`)
      .eq('id', versionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as DocumentVersion;
  },

  // ================================
  // PERMISSIONS
  // ================================

  async getPermissions(documentId: string): Promise<DocumentPermission[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.document_permissions)
      .select(`*, user_profile:profiles!document_permissions_user_id_fkey(id, full_name, avatar_url)`)
      .eq('document_id', documentId);

    if (error) throw error;
    return (data ?? []) as DocumentPermission[];
  },

  async addPermission(
    documentId: string,
    userId: string,
    role: DocumentPermissionRole
  ): Promise<DocumentPermission> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.document_permissions)
      .insert({
        document_id: documentId,
        user_id: userId,
        role,
      })
      .select(`*, user_profile:profiles!document_permissions_user_id_fkey(id, full_name, avatar_url)`)
      .single();

    if (error) throw error;
    return data as DocumentPermission;
  },

  async updatePermission(
    permissionId: string,
    role: DocumentPermissionRole
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from(TABLES.document_permissions)
      .update({ role })
      .eq('id', permissionId);

    if (error) throw error;
  },

  async removePermission(permissionId: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from(TABLES.document_permissions)
      .delete()
      .eq('id', permissionId);

    if (error) throw error;
  },

  async canEdit(documentId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'super_admin' || profile?.role === 'country_admin') {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: perm } = await (supabase as any)
      .from(TABLES.document_permissions)
      .select('role')
      .eq('document_id', documentId)
      .eq('user_id', user.id)
      .single();

    return perm?.role === 'editor' || perm?.role === 'admin';
  },

  // ================================
  // COMMENTAIRES
  // ================================

  async getComments(documentId: string): Promise<DocumentComment[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.document_comments)
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []) as DocumentComment[];
  },

  async addComment(
    documentId: string,
    content: string,
    authorName?: string
  ): Promise<DocumentComment> {
    const { data: { user } } = await supabase.auth.getUser();

    let name = authorName || 'Anonyme';
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      name = profile?.full_name || name;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLES.document_comments)
      .insert({
        document_id: documentId,
        user_id: user?.id || null,
        author_name: name,
        content,
      })
      .select('*')
      .single();

    if (error) throw error;
    return data as DocumentComment;
  },

  async deleteComment(commentId: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from(TABLES.document_comments)
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  },

  // ================================
  // UPLOAD DE FICHIERS
  // ================================

  async uploadFile(file: File, documentId: string): Promise<string> {
    const filePath = `co-redaction/${documentId}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadTempFile(file: File): Promise<string> {
    const filePath = `co-redaction/temp/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  },
};
