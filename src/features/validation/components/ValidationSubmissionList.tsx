import { useNavigate } from 'react-router-dom';
import { Loader2, FileDown, AlertTriangle } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubmissionStatusBadge } from '@/features/fsu/components/SubmissionStatusBadge';
import { useValidationSubmissions } from '../hooks/useValidationSubmissions';
import { exportValidationExcel } from '../utils/export-validation-excel';
import { useTranslation } from 'react-i18next';
import type { SubmissionStatus } from '@/core/constants/roles';

const DEFAULT_DEADLINE_DAYS = 14;

function getDaysRemaining(submittedAt: string | null): number | null {
  if (!submittedAt) return null;
  const deadline = new Date(submittedAt);
  deadline.setDate(deadline.getDate() + DEFAULT_DEADLINE_DAYS);
  const now = new Date();
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function ValidationSubmissionList() {
  const { data: submissions, isLoading } = useValidationSubmissions();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        {t('validation.noPending')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* US-037: Export button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => exportValidationExcel(submissions)}>
          <FileDown className="mr-1 h-4 w-4" />
          {t('validation.exportExcel', 'Exporter Excel')}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('validation.period')}</TableHead>
            <TableHead>{t('validation.status')}</TableHead>
            <TableHead>{t('validation.submittedAt')}</TableHead>
            <TableHead>{t('validation.deadline', 'Délai')}</TableHead>
            <TableHead className="text-right">{t('validation.action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((s) => {
            const daysLeft = getDaysRemaining(s.submitted_at);
            const isOverdue = daysLeft !== null && daysLeft < 0;
            const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

            return (
              <TableRow key={s.id}>
                <TableCell className="font-medium">
                  {s.period_start} → {s.period_end}
                </TableCell>
                <TableCell>
                  <SubmissionStatusBadge status={s.status as SubmissionStatus} />
                </TableCell>
                <TableCell>
                  {s.submitted_at
                    ? new Date(s.submitted_at).toLocaleDateString(locale)
                    : '—'}
                </TableCell>
                {/* US-036: Deadline column */}
                <TableCell>
                  {daysLeft !== null && (
                    <Badge
                      variant={isOverdue ? 'destructive' : isUrgent ? 'default' : 'outline'}
                      className="gap-1"
                    >
                      {isOverdue && <AlertTriangle className="h-3 w-3" />}
                      {isOverdue
                        ? t('validation.overdue', 'Dépassé de {{days}}j', { days: Math.abs(daysLeft) })
                        : t('validation.daysLeft', '{{days}}j restants', { days: daysLeft })}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/validation/${s.id}`)}
                  >
                    {t('validation.review')}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
