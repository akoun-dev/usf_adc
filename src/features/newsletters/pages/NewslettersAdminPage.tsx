import { useState } from 'react';
import { useNewsletters } from '../hooks/useNewsletters';
import {
  usePublishNewsletter,
  useUnpublishNewsletter,
  useDeleteNewsletter,
} from '../hooks/useNewsletterMutations';
import { NewsletterFormDialog } from '../components/NewsletterFormDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Eye, EyeOff, Pencil, Trash2, Newspaper, Mail } from 'lucide-react';
import PageHero from '@/components/PageHero';
import type { Newsletter } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { pt } from 'date-fns/locale';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const DATE_LOCALES: Record<string, typeof fr> = { fr, en: enUS, pt };

export default function NewslettersAdminPage() {
  const { t, i18n } = useTranslation();
  const { data: newsletters = [], isLoading } = useNewsletters();
  const publishMutation = usePublishNewsletter();
  const unpublishMutation = useUnpublishNewsletter();
  const deleteMutation = useDeleteNewsletter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Newsletter | null>(null);
  const dateLoc = DATE_LOCALES[i18n.language] || fr;

  const handleEdit = (nl: Newsletter) => {
    setEditing(nl);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleExportForEmail = (nl: Newsletter) => {
    const blob = new Blob(
      [`${t('newsletters.formTitle')}: ${nl.title}\n\n${t('newsletters.formSummary')}: ${nl.summary || ''}\n\n${t('newsletters.formContent')}:\n${nl.content}\n\n${t('newsletters.formTargetRoles')}: ${nl.target_roles.map(r => t(`invitations.roles.${r}`)).join(', ')}`],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulletin-${nl.title.slice(0, 30).replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('newsletters.exportedSuccess'));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHero
          title={t('newsletters.adminTitle')}
          description={t('newsletters.adminDesc')}
          icon={<Newspaper className="h-6 w-6 text-secondary" />}
        />
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" /> {t('newsletters.newNewsletter')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : newsletters.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t('newsletters.noNewslettersAdmin')}</p>
      ) : (
        <div className="space-y-3">
          {newsletters.map((nl) => (
            <Card key={nl.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">{nl.title}</CardTitle>
                    <Badge variant={nl.is_published ? 'default' : 'secondary'}>
                      {nl.is_published ? t('newsletters.published') : t('newsletters.draft')}
                    </Badge>
                    {nl.email_sent && (
                      <Badge variant="outline" className="text-[10px]">
                        <Mail className="h-3 w-3 mr-1" /> {t('newsletters.emailSent')}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(nl)}>
                        <Pencil className="h-4 w-4 mr-2" /> {t('newsletters.edit')}
                      </DropdownMenuItem>
                      {nl.is_published ? (
                        <DropdownMenuItem onClick={() => unpublishMutation.mutate(nl.id)}>
                          <EyeOff className="h-4 w-4 mr-2" /> {t('newsletters.unpublish')}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => publishMutation.mutate(nl.id)}>
                          <Eye className="h-4 w-4 mr-2" /> {t('newsletters.publish')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleExportForEmail(nl)}>
                        <Mail className="h-4 w-4 mr-2" /> {t('newsletters.exportEmail')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(nl.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> {t('common.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {nl.target_roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-[10px]">
                        {t(`invitations.roles.${role}`)}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {nl.published_at
                      ? `${t('newsletters.publishedOn')} ${format(new Date(nl.published_at), 'dd MMM yyyy', { locale: dateLoc })}`
                      : `${t('newsletters.createdOn')} ${format(new Date(nl.created_at), 'dd MMM yyyy', { locale: dateLoc })}`
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewsletterFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        newsletter={editing}
      />
    </div>
  );
}
