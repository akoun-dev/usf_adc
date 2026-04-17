import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Users, Map, BarChart3, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';
import { useProjects } from '@/features/projects-map/hooks/useProjects';

export default function AdminGlobalDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const activeProjects = projects?.filter(p => p.status === 'in_progress')?.length ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('dashboard.globalAdmin')}
        description={t('dashboard.globalDesc')}
        icon={<Globe className="h-6 w-6 text-secondary" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: t('dashboard.activeCountries'), value: '0', sub: t('dashboard.outOf54'), icon: Globe, color: 'text-primary' },
          { title: t('dashboard.totalUsers'), value: '0', icon: Users, color: 'text-primary' },
          { title: t('dashboard.fsuProjects'), value: String(activeProjects), icon: Map, color: 'text-primary' },
          { title: t('dashboard.platformActivity'), value: '—', icon: Activity, color: 'text-primary' },
        ].map((stat) => (
          <Card key={stat.title} className="group stat-card transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.sub && <p className="text-xs text-muted-foreground">{stat.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* US-017: Mini-carte projets actifs */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/map')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              {t('dashboard.projectMap', 'Cartographie des projets')}
            </CardTitle>
            <CardDescription>{t('dashboard.projectMapDesc', 'Projets actifs par région')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { region: 'CEDEAO', count: projects?.filter(p => p.region === 'CEDEAO')?.length ?? 0 },
                { region: 'SADC', count: projects?.filter(p => p.region === 'SADC')?.length ?? 0 },
                { region: 'EAC', count: projects?.filter(p => p.region === 'EAC')?.length ?? 0 },
                { region: 'CEEAC', count: projects?.filter(p => p.region === 'CEEAC')?.length ?? 0 },
                { region: 'UMA', count: projects?.filter(p => p.region === 'UMA')?.length ?? 0 },
              ].map(r => (
                <div key={r.region} className="flex items-center justify-between rounded-md border p-2">
                  <span className="text-sm font-medium">{r.region}</span>
                  <span className="text-lg font-bold text-primary">{r.count}</span>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-3 p-0 text-sm">
              {t('dashboard.viewMap', 'Voir la carte complète →')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.criticalAlerts')}</CardTitle>
            <CardDescription>{t('dashboard.criticalAlertsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-lg border border-dashed p-6 text-muted-foreground">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">{t('dashboard.noCriticalAlerts')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.supervision')}</CardTitle>
          <CardDescription>{t('dashboard.supervisionDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {[
            { label: t('dashboard.userManagement'), icon: Users, path: '/admin/users' },
            { label: t('dashboard.validationSupervision'), icon: ShieldCheck, path: '/admin/validation' },
            { label: t('dashboard.globalReports'), icon: BarChart3, path: '/admin/reports' },
            { label: t('dashboard.projectMap'), icon: Map, path: '/admin/map' },
          ].map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-3 bg-primary rounded-md border p-3 transition-all hover:bg-primary/5 hover:border-primary/20 cursor-pointer"
              onClick={() => navigate(a.path)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <a.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{a.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
