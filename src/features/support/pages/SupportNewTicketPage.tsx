import { NewTicketForm } from '../components/NewTicketForm';
import { useTranslation } from 'react-i18next';

export default function SupportNewTicketPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('support.newTicketTitle')}</h1>
        <p className="text-muted-foreground">{t('support.newTicketDesc')}</p>
      </div>
      <NewTicketForm />
    </div>
  );
}