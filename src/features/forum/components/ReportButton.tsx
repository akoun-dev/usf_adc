import { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { useReportContent } from '../hooks/useReportContent';
import { useTranslation } from 'react-i18next';

interface Props {
  targetType: 'post' | 'topic';
  targetId: string;
  reporterId: string;
}

export function ReportButton({ targetType, targetId, reporterId }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { mutate, isPending } = useReportContent();

  const handleSubmit = () => {
    if (!reason.trim()) return;
    mutate(
      { reporter_id: reporterId, target_type: targetType, target_id: targetId, reason: reason.trim() },
      { onSuccess: () => { setOpen(false); setReason(''); } },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-7 px-2">
          <Flag className="h-3.5 w-3.5 mr-1" />
          {t('forum.report.button')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('forum.report.title')}</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder={t('forum.report.placeholder')}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{t('forum.report.cancel')}</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={isPending || !reason.trim()}>
            {t('forum.report.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
