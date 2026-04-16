import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { useTranslation } from 'react-i18next';

export function AuditLogsTab() {
  const { data: logs, isLoading } = useAuditLogs();
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.auditLogTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        {(!logs || logs.length === 0) ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t('admin.noAuditLogs')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.auditDate')}</TableHead>
                <TableHead>{t('admin.auditAction')}</TableHead>
                <TableHead>{t('admin.auditTable')}</TableHead>
                <TableHead>{t('admin.auditDetails')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {new Date(log.created_at).toLocaleString(locale)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t(`admin.auditActions.${log.action}`, log.action)}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.target_table ?? '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {log.metadata ? JSON.stringify(log.metadata).slice(0, 80) : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}