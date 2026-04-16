import { Mail } from 'lucide-react';
import { InviteUserForm } from '../components/InviteUserForm';
import { InvitationList } from '../components/InvitationList';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

export default function InvitationsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('invitations.title')}
        description={t('invitations.desc')}
        icon={<Mail className="h-6 w-6 text-secondary" />}
      >
        <InviteUserForm />
      </PageHero>
      <InvitationList />
    </div>
  );
}
