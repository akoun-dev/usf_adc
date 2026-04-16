import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const BACKUPS = [
  { id: '1', date: '2026-04-12 03:00', size: '245 MB', status: 'success' },
  { id: '2', date: '2026-04-11 03:00', size: '243 MB', status: 'success' },
  { id: '3', date: '2026-04-10 03:00', size: '240 MB', status: 'success' },
  { id: '4', date: '2026-04-09 03:00', size: '238 MB', status: 'success' },
  { id: '5', date: '2026-04-08 03:00', size: '236 MB', status: 'success' },
];

export function BackupsTab() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin_extra.backups.title')}</CardTitle>
          <CardDescription>{t('admin_extra.backups.desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">{t('admin_extra.backups.active')}</p>
              <p className="text-sm text-green-600 dark:text-green-400">{t('admin_extra.backups.lastSuccess', { date: BACKUPS[0].date })}</p>
            </div>
          </div>
          <div className="space-y-2">
            {BACKUPS.map(b => (
              <div key={b.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{b.date} UTC</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{b.size}</span>
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />{t('admin_extra.backups.success')}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => toast.info(t('admin_extra.backups.restoreInfo'))}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
