import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Wand2, FileDown, Plus, X, BarChart3, Table2, PieChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';
import { toast } from 'sonner';

const DATA_SOURCES = ['fsu_submissions', 'projects', 'countries', 'profiles'];
const CHART_TYPES = [
  { value: 'bar', label: 'Barres', icon: BarChart3 },
  { value: 'table', label: 'Tableau', icon: Table2 },
  { value: 'pie', label: 'Camembert', icon: PieChart },
];
const METRICS = ['count', 'sum_budget', 'avg_budget', 'approval_rate', 'completion_rate'];

export default function ReportBuilderPage() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('fsu_submissions');
  const [widgets, setWidgets] = useState<{ id: number; type: string; metric: string }[]>([
    { id: 1, type: 'bar', metric: 'count' },
  ]);

  const addWidget = () => {
    setWidgets(prev => [...prev, { id: Date.now(), type: 'table', metric: 'count' }]);
  };

  const removeWidget = (id: number) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const generate = () => {
    toast.success(t('reportBuilder.generated', 'Rapport généré avec succès'));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('reportBuilder.title', 'Générateur de rapports')}
        description={t('reportBuilder.description', 'Créez des rapports personnalisés')}
        icon={<Wand2 className="h-6 w-6 text-secondary" />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">{t('reportBuilder.config', 'Configuration')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>{t('reportBuilder.reportTitle', 'Titre du rapport')}</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Mon rapport..." /></div>
              <div><Label>{t('reportBuilder.dataSource', 'Source de données')}</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DATA_SOURCES.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('reportBuilder.filters', 'Filtres')}</Label>
                <div className="flex items-center space-x-2"><Checkbox id="active" /><label htmlFor="active" className="text-sm">Actifs uniquement</label></div>
                <div className="flex items-center space-x-2"><Checkbox id="period" /><label htmlFor="period" className="text-sm">Période en cours</label></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{t('reportBuilder.widgets', 'Widgets')} ({widgets.length})</h3>
            <Button size="sm" variant="outline" onClick={addWidget}><Plus className="mr-1 h-4 w-4" />{t('reportBuilder.addWidget', 'Ajouter')}</Button>
          </div>

          {widgets.map(w => (
            <Card key={w.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex gap-2">
                  {CHART_TYPES.map(ct => (
                    <Button key={ct.value} size="sm" variant={w.type === ct.value ? 'default' : 'outline'}
                      onClick={() => setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, type: ct.value } : x))}>
                      <ct.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
                <Select value={w.metric} onValueChange={v => setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, metric: v } : x))}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{METRICS.map(m => <SelectItem key={m} value={m}>{m.replace('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
                <div className="flex-1" />
                <Button size="icon" variant="ghost" onClick={() => removeWidget(w.id)}><X className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={generate}><FileDown className="mr-2 h-4 w-4" />{t('reportBuilder.exportPdf', 'Exporter PDF')}</Button>
            <Button onClick={generate}><Wand2 className="mr-2 h-4 w-4" />{t('reportBuilder.generate', 'Générer')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
