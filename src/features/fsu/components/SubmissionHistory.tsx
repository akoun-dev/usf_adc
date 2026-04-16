import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { useSubmissions } from '../hooks/useSubmissions';
import { SubmissionStatusBadge } from './SubmissionStatusBadge';
import { downloadFsuTemplate } from '../utils/download-template';
import { useTranslation } from 'react-i18next';
import type { SubmissionStatus } from '@/core/constants/roles';
import type { SubmissionFilters } from '../types';

export function SubmissionHistory() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState<SubmissionFilters>({});
  const { data: submissions, isLoading } = useSubmissions(filters);

  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const statusKeys: SubmissionStatus[] = ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'revision_requested'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Select
          value={filters.status ?? 'all'}
          onValueChange={(v) => setFilters((f) => ({ ...f, status: v === 'all' ? undefined : v as SubmissionStatus }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('fsu.history.allStatuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('fsu.history.allStatuses')}</SelectItem>
            {statusKeys.map((k) => (
              <SelectItem key={k} value={k}>{t(`fsu.status.${k}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          placeholder={t('fsu.history.since')}
          className="w-[160px]"
          onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value || undefined }))}
        />
        <Input
          type="date"
          placeholder={t('fsu.history.until')}
          className="w-[160px]"
          onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value || undefined }))}
        />
        {/* US-025: Download template button */}
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => downloadFsuTemplate()}>
            <Download className="mr-1 h-4 w-4" />
            {t('fsu.downloadTemplate', 'Modèle Excel')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !submissions?.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">{t('fsu.history.noSubmissions')}</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('fsu.history.period')}</TableHead>
                <TableHead>{t('fsu.history.status')}</TableHead>
                <TableHead>{t('fsu.history.submittedAt')}</TableHead>
                <TableHead>{t('fsu.history.lastModified')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/fsu/submissions/${s.id}`)}
                >
                  <TableCell className="font-medium">
                    {s.period_start} → {s.period_end}
                  </TableCell>
                  <TableCell>
                    <SubmissionStatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.submitted_at ? new Date(s.submitted_at).toLocaleDateString(locale) : '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(s.updated_at).toLocaleDateString(locale)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
