import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, HelpCircle } from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import { TicketList } from '../components/TicketList';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

export default function SupportPage() {
  const { data: tickets, isLoading } = useTickets();
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('support.title')}
        description={t('support.desc')}
        icon={<HelpCircle className="h-6 w-6 text-secondary" />}
      >
        <Button asChild className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20">
          <Link to="/support/new"><Plus className="mr-2 h-4 w-4" />{t('support.newTicket')}</Link>
        </Button>
      </PageHero>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <TicketList tickets={(tickets as any) ?? []} />
      )}
    </div>
  );
}
