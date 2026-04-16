import { useState } from 'react';
import { useNewsletters } from '../hooks/useNewsletters';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import PageHero from '@/components/PageHero';
import type { Newsletter } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { pt } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DATE_LOCALES: Record<string, typeof fr> = { fr, en: enUS, pt };

export default function NewslettersPage() {
  const { t, i18n } = useTranslation();
  const { data: newsletters = [], isLoading } = useNewsletters();
  const [selected, setSelected] = useState<Newsletter | null>(null);
  const dateLoc = DATE_LOCALES[i18n.language] || fr;

  return (
    <div className="flex flex-col gap-6">
      <PageHero
        title={t('newsletters.title')}
        description={t('newsletters.desc', { count: newsletters.length })}
        icon={<Newspaper className="h-6 w-6 text-secondary" />}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : newsletters.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t('newsletters.noNewsletters')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {newsletters.map((nl) => (
            <Card
              key={nl.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelected(nl)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{nl.title}</CardTitle>
                  {nl.published_at && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {format(new Date(nl.published_at), 'dd MMM yyyy', { locale: dateLoc })}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {nl.summary && <p className="text-sm text-muted-foreground mb-3">{nl.summary}</p>}
                <div className="flex flex-wrap gap-1">
                  {nl.target_roles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-[10px]">
                      {t(`invitations.roles.${role}`)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                {selected.published_at && (
                  <p className="text-sm text-muted-foreground">
                    {t('newsletters.publishedOn')} {format(new Date(selected.published_at), 'dd MMMM yyyy', { locale: dateLoc })}
                  </p>
                )}
              </DialogHeader>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {selected.content}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
