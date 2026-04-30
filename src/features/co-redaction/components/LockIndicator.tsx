/**
 * Indicateur de verrouillage d'un document
 */
import { Lock, Unlock, Clock, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LockIndicatorProps {
  lockedBy: string | null;
  lockedAt: string | null;
  lockedByName?: string | null;
  currentUserId?: string;
  className?: string;
  compact?: boolean;
}

export function LockIndicator({
  lockedBy,
  lockedAt,
  lockedByName,
  currentUserId,
  className,
  compact = false,
}: LockIndicatorProps) {
  const { t } = useTranslation();

  const isLockedByMe = lockedBy === currentUserId;
  const isLocked = !!lockedBy;

  // Vérifier si le lock a expiré (30 min)
  const isExpired = lockedAt
    ? new Date(lockedAt).getTime() < Date.now() - 30 * 60 * 1000
    : false;

  if (!isLocked || isExpired) {
    if (compact) return null;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={cn('gap-1 text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950', className)}>
              <Unlock className="h-3 w-3" />
              <span className="text-xs">{t('coRedaction.available', 'Disponible')}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {t('coRedaction.availableForEdit', 'Document disponible pour édition')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const lockedTime = lockedAt
    ? formatDistanceToNow(new Date(lockedAt), { addSuffix: true, locale: fr })
    : '';

  if (isLockedByMe) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={cn('gap-1 text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-950', className)}>
              <Lock className="h-3 w-3" />
              {!compact && <span className="text-xs">{t('coRedaction.lockedByYou', 'Verrouillé par vous')}</span>}
              {compact && <Clock className="h-3 w-3 ml-1" />}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {t('coRedaction.youAreEditing', 'Vous êtes en train d\'éditer ce document')} · {lockedTime}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={cn('gap-1 text-orange-600 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:bg-orange-950', className)}>
            <Lock className="h-3 w-3" />
            {!compact && (
              <span className="text-xs">
                {lockedByName
                  ? t('coRedaction.lockedBy', 'Verrouillé par {{name}}', { name: lockedByName })
                  : t('coRedaction.locked', 'Verrouillé')}
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{lockedByName || t('coRedaction.unknownUser', 'Utilisateur inconnu')}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{lockedTime}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
