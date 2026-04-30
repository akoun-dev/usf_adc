/**
 * Dialogue de gestion des permissions d'un document
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, UserPlus, Trash2, User, Loader2 } from 'lucide-react';
import {
  useDocumentPermissions,
  useAddPermission,
  useRemovePermission,
} from '../hooks/useCoRedaction';
import type { DocumentPermissionRole } from '../types';

interface DocumentPermissionsDialogProps {
  documentId: string;
  trigger?: React.ReactNode;
}

export function DocumentPermissionsDialog({
  documentId,
  trigger,
}: DocumentPermissionsDialogProps) {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<DocumentPermissionRole>('editor');
  const [open, setOpen] = useState(false);

  const { data: permissions, isLoading } = useDocumentPermissions(
    open ? documentId : undefined
  );
  const addPermission = useAddPermission();
  const removePermission = useRemovePermission();

  const handleAdd = async () => {
    if (!userId.trim()) return;
    await addPermission.mutateAsync({
      documentId,
      userId: userId.trim(),
      role,
    });
    setUserId('');
    setRole('editor');
  };

  const roleLabels: Record<DocumentPermissionRole, string> = {
    editor: t('coRedaction.roleEditor', 'Éditeur'),
    reviewer: t('coRedaction.roleReviewer', 'Réviseur'),
    admin: t('coRedaction.roleAdmin', 'Admin'),
  };

  const roleColors: Record<DocumentPermissionRole, string> = {
    editor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    reviewer: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Shield className="h-4 w-4" />
            {t('coRedaction.permissions', 'Permissions')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('coRedaction.managePermissions', 'Gérer les permissions')}
          </DialogTitle>
        </DialogHeader>

        {/* Formulaire d'ajout */}
        <div className="flex gap-2">
          <Input
            placeholder={t('coRedaction.userIdPlaceholder', 'ID utilisateur')}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex-1"
          />
          <Select value={role} onValueChange={(v) => setRole(v as DocumentPermissionRole)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="editor">{roleLabels.editor}</SelectItem>
              <SelectItem value="reviewer">{roleLabels.reviewer}</SelectItem>
              <SelectItem value="admin">{roleLabels.admin}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleAdd}
            disabled={!userId.trim() || addPermission.isPending}
            size="icon"
          >
            {addPermission.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Liste des permissions */}
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : permissions && permissions.length > 0 ? (
            <div className="space-y-2">
              {permissions.map((perm) => (
                <div
                  key={perm.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {perm.user_profile?.full_name || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-muted-foreground">{perm.user_id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={roleColors[perm.role]}>
                      {roleLabels[perm.role]}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removePermission.mutate(perm.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <User className="h-8 w-8 mb-2" />
              <p className="text-sm">{t('coRedaction.noPermissions', 'Aucune permission')}</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
