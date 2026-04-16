import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import NotificationList from '../components/NotificationList';
import { useMarkAsRead } from '../hooks/useMarkAsRead';
import type { Notification } from '../types';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const markAsRead = useMarkAsRead();
  const { t } = useTranslation();

  const handleClick = (n: Notification) => {
    if (!n.read_at) {
      markAsRead.mutate(n.id);
    }
    if (n.link) {
      navigate(n.link);
    }
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <PageHero
        title={t('notifications.title')}
        description={t('notifications.desc')}
        icon={<Bell className="h-6 w-6 text-secondary" />}
      />
      <NotificationList onNotificationClick={handleClick} />
    </div>
  );
}
