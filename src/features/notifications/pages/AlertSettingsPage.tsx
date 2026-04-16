import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BellRing, Mail, Smartphone, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import PageHero from '@/components/PageHero';

interface AlertSetting {
  key: string;
  label: string;
  description: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

const DEFAULT_SETTINGS: AlertSetting[] = [
  { key: 'submission_status', label: 'Changement de statut de soumission', description: 'Notification quand une soumission est approuvée/rejetée', email: true, sms: false, inApp: true },
  { key: 'new_comment', label: 'Nouveau commentaire', description: 'Un commentaire est ajouté sur votre ticket ou soumission', email: true, sms: false, inApp: true },
  { key: 'deadline_reminder', label: 'Rappel d\'échéance', description: 'Alerte avant la date limite de soumission', email: true, sms: true, inApp: true },
  { key: 'forum_reply', label: 'Réponse sur le forum', description: 'Quelqu\'un a répondu à votre sujet', email: false, sms: false, inApp: true },
  { key: 'newsletter', label: 'Nouveau bulletin', description: 'Un bulletin a été publié pour votre rôle', email: true, sms: false, inApp: true },
  { key: 'system', label: 'Annonces système', description: 'Maintenance, mises à jour de la plateforme', email: true, sms: false, inApp: true },
];

export default function AlertSettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const toggle = (key: string, channel: 'email' | 'sms' | 'inApp') => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, [channel]: !s[channel] } : s));
  };

  const save = () => {
    toast.success(t('alerts.saved', 'Préférences de notification enregistrées'));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <PageHero
        title={t('alerts.title', 'Alertes personnalisées')}
        description={t('alerts.description', 'Configurez vos préférences de notification par canal')}
        icon={<BellRing className="h-6 w-6 text-secondary" />}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('alerts.channels', 'Canaux de notification')}</CardTitle>
          <CardDescription>{t('alerts.channelsDesc', 'Choisissez comment recevoir chaque type d\'alerte')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center mb-4 text-sm font-medium text-muted-foreground">
            <span></span>
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />Email</span>
            <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" />SMS</span>
            <span className="flex items-center gap-1"><BellRing className="h-3 w-3" />In-app</span>
          </div>
          <div className="space-y-4">
            {settings.map(s => (
              <div key={s.key} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </div>
                <Switch checked={s.email} onCheckedChange={() => toggle(s.key, 'email')} />
                <Switch checked={s.sms} onCheckedChange={() => toggle(s.key, 'sms')} />
                <Switch checked={s.inApp} onCheckedChange={() => toggle(s.key, 'inApp')} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save}><Save className="mr-2 h-4 w-4" />{t('alerts.save', 'Enregistrer')}</Button>
      </div>
    </div>
  );
}
