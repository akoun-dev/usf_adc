import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertTriangle, LayoutDashboard, GripVertical, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';
import { useState, useCallback } from 'react';

interface Widget {
  id: string;
  title: string;
  visible: boolean;
}

export default function PointFocalDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const fullName = profile?.full_name ?? 'Point Focal';
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'stats', title: t('dashboard.totalEntries'), visible: true },
    { id: 'pending', title: t('dashboard.pending'), visible: true },
    { id: 'approved', title: t('dashboard.approved'), visible: true },
    { id: 'alerts', title: t('dashboard.alerts'), visible: true },
  ]);

  const toggleWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.map((w) => w.id === id ? { ...w, visible: !w.visible } : w));
  }, []);

  const moveWidget = useCallback((id: string, direction: 'up' | 'down') => {
    setWidgets((prev) => {
      const idx = prev.findIndex((w) => w.id === id);
      if (idx < 0) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  }, []);

  const statWidgets = [
    { id: 'stats', title: t('dashboard.totalEntries'), value: '0', sub: t('dashboard.noEntries'), icon: FileText, color: 'text-muted-foreground' },
    { id: 'pending', title: t('dashboard.pending'), value: '0', sub: t('dashboard.pendingDesc'), icon: Clock, color: 'text-primary' },
    { id: 'approved', title: t('dashboard.approved'), value: '0', sub: t('dashboard.approvedDesc'), icon: CheckCircle, color: 'text-primary' },
    { id: 'alerts', title: t('dashboard.alerts'), value: '0', sub: t('dashboard.alertsDesc'), icon: AlertTriangle, color: 'text-destructive' },
  ];

  const orderedStats = widgets
    .filter((w) => w.visible)
    .map((w) => statWidgets.find((s) => s.id === w.id))
    .filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('dashboard.hello', { name: fullName })}
        description={t('dashboard.pfDesc')}
        icon={<LayoutDashboard className="h-6 w-6 text-secondary" />}
      >
        {/* US-018: Widget customization toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditMode(!editMode)}
          className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20"
        >
          <Settings2 className="mr-1 h-4 w-4" />
          {editMode ? t('dashboard.doneCustomize', 'Terminé') : t('dashboard.customize', 'Personnaliser')}
        </Button>
      </PageHero>

      {/* US-018: Widget configuration panel */}
      {editMode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t('dashboard.widgetConfig', 'Configuration des widgets')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {widgets.map((w, idx) => (
              <div key={w.id} className="flex items-center gap-3 rounded-md border p-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">{w.title}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => moveWidget(w.id, 'up')} disabled={idx === 0}>↑</Button>
                  <Button size="sm" variant="ghost" onClick={() => moveWidget(w.id, 'down')} disabled={idx === widgets.length - 1}>↓</Button>
                </div>
                <Button size="sm" variant={w.visible ? 'default' : 'outline'} onClick={() => toggleWidget(w.id)}>
                  {w.visible ? t('common.yes') : t('common.no')}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {orderedStats.map((stat) => stat && (
          <Card key={stat.id} className="group stat-card transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
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

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          <CardDescription>{t('dashboard.quickActionsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t('dashboard.newEntry'), desc: t('dashboard.newEntryDesc'), icon: FileText, path: '/fsu/submissions/new' },
              { label: t('dashboard.myDrafts'), desc: t('dashboard.myDraftsDesc'), icon: Clock, path: '/fsu/submissions' },
              { label: t('dashboard.history'), desc: t('dashboard.historyDesc'), icon: CheckCircle, path: '/fsu/submissions' },
              { label: t('dashboard.viewReports'), desc: t('dashboard.viewReportsDesc'), icon: AlertTriangle, path: '/reports' },
            ].map((action) => (
              <div
                key={action.label}
                className="group/action flex items-start gap-3 rounded-xl border p-4 transition-all hover:bg-primary/5 hover:border-primary/20 hover:-translate-y-0.5 cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover/action:bg-primary/15">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
