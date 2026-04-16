import { useState, useEffect } from 'react';
import { Settings2, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowSettingsService } from '../services/workflow-settings-service';
import { toast } from 'sonner';

interface Props {
  countryId: string;
}

export function WorkflowSettingsPanel({ countryId }: Props) {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['workflow-settings', countryId],
    queryFn: () => workflowSettingsService.getForCountry(countryId),
    enabled: !!countryId,
  });

  const [levels, setLevels] = useState(1);
  const [deadline, setDeadline] = useState(14);

  useEffect(() => {
    if (settings) {
      setLevels(settings.approval_levels);
      setDeadline(settings.default_deadline_days);
    }
  }, [settings]);

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => workflowSettingsService.upsert(countryId, {
      approval_levels: levels,
      default_deadline_days: deadline,
    }),
    onSuccess: () => {
      toast.success('Paramètres du workflow sauvegardés');
      qc.invalidateQueries({ queryKey: ['workflow-settings', countryId] });
    },
    onError: () => toast.error('Erreur lors de la sauvegarde'),
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 className="h-5 w-5" />
          Workflow de validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Niveaux d'approbation</Label>
          <Select value={String(levels)} onValueChange={(v) => setLevels(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 niveau — Admin Pays approuve directement</SelectItem>
              <SelectItem value="2">2 niveaux — Admin Pays puis Admin Global</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {levels === 1
              ? "L'Admin Pays peut approuver directement les soumissions."
              : "L'Admin Pays effectue une pré-validation, puis l'Admin Global confirme l'approbation finale."}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Délai de validation par défaut (jours)</Label>
          <Input
            type="number"
            min={1}
            max={90}
            value={deadline}
            onChange={(e) => setDeadline(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Nombre de jours avant alerte de dépassement du délai de validation.
          </p>
        </div>

        <Button onClick={() => save()} disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Sauvegarder
        </Button>
      </CardContent>
    </Card>
  );
}
