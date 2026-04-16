import { Loader2, CheckCircle, XCircle, RotateCcw, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useValidationActions } from '../hooks/useValidationActions';
import { ACTION_COLORS } from '../types';
import { useTranslation } from 'react-i18next';
import type { ValidationActionType } from '@/core/constants/roles';

const ACTION_ICONS: Record<ValidationActionType, typeof CheckCircle> = {
  approve: CheckCircle,
  reject: XCircle,
  request_revision: RotateCcw,
  comment: MessageSquare,
};

interface Props {
  submissionId: string;
}

export function ValidationHistory({ submissionId }: Props) {
  const { data: actions, isLoading } = useValidationActions(submissionId);
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('validation.historyTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('validation.noActions')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('validation.historyTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {actions.map((action, index) => {
            const Icon = ACTION_ICONS[action.action as ValidationActionType];
            const colorClass = ACTION_COLORS[action.action as ValidationActionType];
            const profileName =
              (action as Record<string, unknown>).profiles &&
              typeof (action as Record<string, unknown>).profiles === 'object'
                ? ((action as Record<string, unknown>).profiles as { full_name?: string })?.full_name
                : null;

            return (
              <div key={action.id} className="relative flex gap-4 pb-6">
                {index < actions.length - 1 && (
                  <div className="absolute left-[15px] top-8 h-full w-px bg-border" />
                )}
                <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background border ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${colorClass}`}>
                      {t(`validation.actionLabels.${action.action}`)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t('validation.by')} {profileName ?? t('validation.user')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(action.created_at).toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {action.comment && (
                    <p className="mt-1 rounded-md bg-muted p-2 text-sm text-foreground">
                      {action.comment}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}