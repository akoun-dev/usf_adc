import { Mail, RefreshCw } from 'lucide-react';
import { InviteUserForm } from '../components/InviteUserForm';
import { InvitationList } from '../components/InvitationList';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function InvitationsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['invitations'] });
  };

  return (
    <Card className="border-none shadow-none bg-transparent animate-fade-in">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              {t('invitations.title')}
            </CardTitle>
            <CardDescription>
              {t('invitations.desc')}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.refresh', 'Actualiser')}
            </Button>
            <InviteUserForm />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-0">
        <InvitationList />
      </CardContent>
    </Card>
  );
}
