import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Globe, CalendarClock, ScrollText, GitBranch, BookOpen, Shield, Key, ShieldAlert, Database } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PlatformSettingsTab } from '../components/PlatformSettingsTab';
import { CountriesTab } from '../components/CountriesTab';
import { FsuSettingsTab } from '../components/FsuSettingsTab';
import { AuditLogsTab } from '../components/AuditLogsTab';
import { BackupsTab } from '../components/BackupsTab';
import { ApiKeysTab } from '../components/ApiKeysTab';
import { IpRestrictionsTab } from '../components/IpRestrictionsTab';
import { QuarterlyReportsTab } from '../components/QuarterlyReportsTab';
import { WorkflowSettingsPanel } from '@/features/validation/components/WorkflowSettingsPanel';
import { FaqManagementPanel } from '@/features/support/components/FaqManagementPanel';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

export default function AdminPage() {
  const { hasRole, profile } = useAuth();
  const isGlobalAdmin = hasRole('global_admin');
  const isCountryAdmin = hasRole('country_admin');
  const { t } = useTranslation();
  const countryId = profile?.country_id as string | undefined;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('admin.title')}
        description={isGlobalAdmin ? t('admin.descAdmin') : t('admin.descView')}
        icon={<Settings className="h-6 w-6 text-secondary" />}
      />

      <Tabs defaultValue={isGlobalAdmin ? 'settings' : 'countries'}>
        <TabsList className="flex-wrap">
          {isGlobalAdmin && <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />{t('admin.settings')}</TabsTrigger>}
          <TabsTrigger value="countries"><Globe className="mr-2 h-4 w-4" />{t('admin.countries')}</TabsTrigger>
          <TabsTrigger value="fsu"><CalendarClock className="mr-2 h-4 w-4" />{t('admin.fsuSubmissions')}</TabsTrigger>
          {(isGlobalAdmin || isCountryAdmin) && countryId && (
            <TabsTrigger value="workflow"><GitBranch className="mr-2 h-4 w-4" />Workflow</TabsTrigger>
          )}
          <TabsTrigger value="audit"><ScrollText className="mr-2 h-4 w-4" />{t('admin.auditLog')}</TabsTrigger>
          {isGlobalAdmin && <TabsTrigger value="faq"><BookOpen className="mr-2 h-4 w-4" />FAQ</TabsTrigger>}
          {isGlobalAdmin && <TabsTrigger value="backups"><Database className="mr-2 h-4 w-4" />{t('admin.backups', 'Sauvegardes')}</TabsTrigger>}
          {isGlobalAdmin && <TabsTrigger value="apikeys"><Key className="mr-2 h-4 w-4" />{t('admin.apiKeys', 'Clés API')}</TabsTrigger>}
          {isGlobalAdmin && <TabsTrigger value="ip"><ShieldAlert className="mr-2 h-4 w-4" />{t('admin.ipRestrictions', 'IP')}</TabsTrigger>}
          {isGlobalAdmin && <TabsTrigger value="quarterly"><CalendarClock className="mr-2 h-4 w-4" />{t('admin.quarterlyReports', 'Rapports auto')}</TabsTrigger>}
        </TabsList>

        {isGlobalAdmin && <TabsContent value="settings"><PlatformSettingsTab /></TabsContent>}
        <TabsContent value="countries"><CountriesTab /></TabsContent>
        <TabsContent value="fsu"><FsuSettingsTab /></TabsContent>
        {(isGlobalAdmin || isCountryAdmin) && countryId && (
          <TabsContent value="workflow"><WorkflowSettingsPanel countryId={countryId} /></TabsContent>
        )}
        <TabsContent value="audit"><AuditLogsTab /></TabsContent>
        {isGlobalAdmin && <TabsContent value="faq"><FaqManagementPanel /></TabsContent>}
        {isGlobalAdmin && <TabsContent value="backups"><BackupsTab /></TabsContent>}
        {isGlobalAdmin && <TabsContent value="apikeys"><ApiKeysTab /></TabsContent>}
        {isGlobalAdmin && <TabsContent value="ip"><IpRestrictionsTab /></TabsContent>}
        {isGlobalAdmin && <TabsContent value="quarterly"><QuarterlyReportsTab /></TabsContent>}
      </Tabs>
    </div>
  );
}
