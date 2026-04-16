import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Key, Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  calls: number;
}

const SAMPLE_KEYS: ApiKey[] = [
  { id: '1', name: 'Production API', key: 'sk_live_abc123...xyz789', created: '2026-03-01', lastUsed: '2026-04-12', calls: 15240 },
  { id: '2', name: 'Test API', key: 'sk_test_def456...uvw012', created: '2026-02-15', lastUsed: '2026-04-10', calls: 3420 },
];

export function ApiKeysTab() {
  const { t } = useTranslation();
  const [keys, setKeys] = useState(SAMPLE_KEYS);
  const [showKey, setShowKey] = useState<string | null>(null);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success(t('admin_extra.apiKeys.keyCopied'));
  };

  const deleteKey = (id: string) => {
    setKeys(prev => prev.filter(k => k.id !== id));
    toast.success(t('admin_extra.apiKeys.keyDeleted'));
  };

  const addKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(), name: 'Nouvelle clé', key: `sk_live_${Math.random().toString(36).slice(2, 14)}`,
      created: new Date().toISOString().slice(0, 10), lastUsed: '-', calls: 0,
    };
    setKeys(prev => [newKey, ...prev]);
    toast.success(t('admin_extra.apiKeys.keyCreated'));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('admin_extra.apiKeys.title')}</CardTitle>
            <CardDescription>{t('admin_extra.apiKeys.desc')}</CardDescription>
          </div>
          <Button size="sm" onClick={addKey}><Plus className="mr-1 h-4 w-4" />{t('admin_extra.apiKeys.newKey')}</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {keys.map(k => (
            <div key={k.id} className="flex items-center gap-4 py-3 border-b last:border-0">
              <Key className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{k.name}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {showKey === k.id ? k.key : '••••••••••••••••'}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground hidden sm:block">
                <p>{t('admin_extra.apiKeys.created')} : {k.created}</p>
                <p>{t('admin_extra.apiKeys.lastUsed')} : {k.lastUsed}</p>
              </div>
              <Badge variant="outline">{t('admin_extra.apiKeys.calls', { count: k.calls.toLocaleString() })}</Badge>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setShowKey(showKey === k.id ? null : k.id)}>
                  {showKey === k.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => copyKey(k.key)}><Copy className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => deleteKey(k.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin_extra.apiKeys.apiLog')}</CardTitle>
          <CardDescription>{t('admin_extra.apiKeys.apiLogDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {[
              { time: '12:45:03', method: 'GET', path: '/api/submissions', status: 200, duration: '45ms' },
              { time: '12:44:58', method: 'POST', path: '/api/submissions', status: 201, duration: '120ms' },
              { time: '12:44:30', method: 'GET', path: '/api/countries', status: 200, duration: '30ms' },
              { time: '12:43:15', method: 'GET', path: '/api/reports', status: 200, duration: '85ms' },
              { time: '12:42:00', method: 'PUT', path: '/api/projects/abc123', status: 200, duration: '65ms' },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0 font-mono text-xs">
                <span className="text-muted-foreground">{log.time}</span>
                <Badge variant={log.method === 'GET' ? 'secondary' : 'default'} className="text-xs">{log.method}</Badge>
                <span className="flex-1">{log.path}</span>
                <Badge variant={log.status < 400 ? 'outline' : 'destructive'}>{log.status}</Badge>
                <span className="text-muted-foreground">{log.duration}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
