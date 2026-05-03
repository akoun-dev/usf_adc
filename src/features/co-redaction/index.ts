export { RichTextEditor } from './components/RichTextEditor';
export { DocumentStatusBadge } from './components/DocumentStatusBadge';
export { LockIndicator } from './components/LockIndicator';
export { VersionHistory } from './components/VersionHistory';
export { DocumentPermissionsDialog } from './components/DocumentPermissionsDialog';
export { DocumentComments } from './components/DocumentComments';

export {
  useDocuments,
  usePublicDocuments,
  useDocument,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useLockDocument,
  useUnlockDocument,
  useForceUnlockDocument,
  useChangeWorkflowStatus,
  useDocumentVersions,
  useSaveVersion,
  useDocumentPermissions,
  useAddPermission,
  useUpdatePermission,
  useRemovePermission,
  useDocumentComments,
  useAddComment,
  useDeleteComment,
  useUploadFile,
  useDocumentRealtime,
  useDocumentsRealtime,
} from './hooks/useCoRedaction';

export { useAutosave } from './hooks/useAutosave';

export { coRedactionService } from './services/co-redaction-service';

export type {
  CoDocument,
  DocumentVersion,
  DocumentPermission,
  DocumentComment,
  DocumentWorkflowStatus,
  DocumentPermissionRole,
  CreateDocumentInput,
  UpdateDocumentInput,
} from './types';
