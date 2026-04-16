import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Settings2, ShieldPlus } from 'lucide-react';
import { useManageRole } from '../hooks/useManageRole';
import { ROLE_LABELS, type AppRole } from '@/core/constants/roles';
import { useTranslation } from 'react-i18next';

const ALL_ROLES: AppRole[] = ['public_external', 'point_focal', 'country_admin', 'global_admin'];

interface RoleManagerProps {
  userId: string;
  currentRoles: AppRole[];
  allowedRoles: AppRole[];
}

export function RoleManager({ userId, currentRoles, allowedRoles }: RoleManagerProps) {
  const { addRole, removeRole } = useManageRole();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleToggleRole = (role: AppRole, hasRole: boolean) => {
    if (hasRole) {
      removeRole.mutate({ userId, role });
    } else {
      addRole.mutate({ userId, role });
    }
  };

  const isOnlyPublicExternal =
    currentRoles.length === 1 && currentRoles[0] === 'public_external';
  const canPromote = isOnlyPublicExternal && allowedRoles.includes('point_focal');

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {currentRoles.length > 0 ? (
        currentRoles.map((role) => (
          <Badge key={role} variant="secondary" className="text-xs">
            {ROLE_LABELS[role]}
          </Badge>
        ))
      ) : (
        <span className="text-xs text-muted-foreground">Aucun rôle</span>
      )}

      {canPromote && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs border-primary/30 text-primary hover:bg-primary/10"
              disabled={addRole.isPending}
            >
              <ShieldPlus className="h-3.5 w-3.5" />
              {t('users.promote')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('users.promoteConfirm')}</AlertDialogTitle>
              <AlertDialogDescription>{t('users.promoteDesc')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('users.promoteCancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  addRole.mutate({ userId, role: 'point_focal' }, {
                    onSuccess: () => {
                      supabase.functions.invoke('notify-role-promotion', {
                        body: { user_id: userId },
                      }).catch(console.error);
                    },
                  });
                }}
              >
                {t('users.promote')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Settings2 className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <p className="text-sm font-medium mb-3">Gérer les rôles</p>
          <div className="space-y-2">
            {ALL_ROLES.map((role) => {
              const hasRole = currentRoles.includes(role);
              const canManage = allowedRoles.includes(role);
              return (
                <label
                  key={role}
                  className={`flex items-center gap-2 text-sm ${!canManage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Checkbox
                    checked={hasRole}
                    disabled={!canManage || addRole.isPending || removeRole.isPending}
                    onCheckedChange={() => handleToggleRole(role, hasRole)}
                  />
                  {ROLE_LABELS[role]}
                </label>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
