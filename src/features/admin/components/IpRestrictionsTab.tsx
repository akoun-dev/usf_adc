import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface IpRule {
  id: string;
  cidr: string;
  description: string;
  enabled: boolean;
}

const SAMPLE_RULES: IpRule[] = [
  { id: '1', cidr: '192.168.1.0/24', description: 'Réseau bureau ANSUT', enabled: true },
  { id: '2', cidr: '10.0.0.0/8', description: 'VPN interne', enabled: true },
];

export function IpRestrictionsTab() {
  const { t } = useTranslation();
  const [rules, setRules] = useState(SAMPLE_RULES);
  const [enabled, setEnabled] = useState(false);
  const [newCidr, setNewCidr] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const addRule = () => {
    if (!newCidr) return;
    setRules(prev => [...prev, { id: Date.now().toString(), cidr: newCidr, description: newDesc, enabled: true }]);
    setNewCidr('');
    setNewDesc('');
    toast.success(t('admin_extra.ipRestrictions.ruleAdded'));
  };

  const removeRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    toast.success(t('admin_extra.ipRestrictions.ruleDeleted'));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin_extra.ipRestrictions.title')}</CardTitle>
          <CardDescription>{t('admin_extra.ipRestrictions.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="font-medium">{t('admin_extra.ipRestrictions.enable')}</p>
              <p className="text-sm text-muted-foreground">{t('admin_extra.ipRestrictions.enableDesc')}</p>
            </div>
            <Switch checked={enabled} onCheckedChange={v => { setEnabled(v); toast.info(v ? t('admin_extra.ipRestrictions.enabled') : t('admin_extra.ipRestrictions.disabled')); }} />
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t('admin_extra.ipRestrictions.allowedRanges')}</h4>
            {rules.map(r => (
              <div key={r.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{r.cidr}</code>
                <span className="flex-1 text-sm text-muted-foreground">{r.description}</span>
                <Badge variant={r.enabled ? 'default' : 'secondary'}>{r.enabled ? t('admin_extra.ipRestrictions.active') : t('admin_extra.ipRestrictions.inactive')}</Badge>
                <Button size="icon" variant="ghost" onClick={() => removeRule(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input placeholder={t('admin_extra.ipRestrictions.cidrPlaceholder')} value={newCidr} onChange={e => setNewCidr(e.target.value)} className="font-mono" />
            <Input placeholder={t('admin_extra.ipRestrictions.descPlaceholder')} value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <Button onClick={addRule}><Plus className="mr-1 h-4 w-4" />{t('common.add')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
