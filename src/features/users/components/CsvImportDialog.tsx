import { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CsvRow {
  email: string;
  full_name: string;
  role: string;
  country_code: string;
}

interface ImportResult {
  row: number;
  email: string;
  status: 'created' | 'error';
  error?: string;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const sep = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(sep).map((h) => h.trim().toLowerCase().replace(/["\s]/g, ''));

  const emailIdx = headers.findIndex((h) => h.includes('email'));
  const nameIdx = headers.findIndex((h) => h.includes('nom') || h.includes('name') || h.includes('full_name'));
  const roleIdx = headers.findIndex((h) => h.includes('role') || h.includes('rôle'));
  const countryIdx = headers.findIndex((h) => h.includes('pays') || h.includes('country') || h.includes('code_iso'));

  if (emailIdx === -1) return [];

  return lines.slice(1).map((line) => {
    const cols = line.split(sep).map((c) => c.trim().replace(/^"|"$/g, ''));
    return {
      email: cols[emailIdx] || '',
      full_name: nameIdx >= 0 ? cols[nameIdx] || '' : '',
      role: roleIdx >= 0 ? cols[roleIdx] || 'point_focal' : 'point_focal',
      country_code: countryIdx >= 0 ? cols[countryIdx] || '' : '',
    };
  }).filter((r) => r.email);
}

export function CsvImportDialog() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResults(null);

    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsv(reader.result as string);
      setRows(parsed);
      if (!parsed.length) toast.error('Fichier CSV vide ou format incorrect');
    };
    reader.readAsText(file, 'UTF-8');
  }, []);

  const handleImport = async () => {
    if (!rows.length) return;
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-users-csv', {
        body: { rows },
      });
      if (error) throw error;
      setResults(data.results);
      toast.success(`${data.created} utilisateur(s) créé(s), ${data.errors} erreur(s)`);
      qc.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      toast.error('Erreur lors de l\'import');
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const bom = '\uFEFF';
    const csv = 'email;full_name;role;country_code\nexample@email.com;Jean Dupont;point_focal;CI';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modele_import_utilisateurs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setRows([]);
    setFileName('');
    setResults(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20">
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import massif d'utilisateurs
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={handleDownloadTemplate}>
            <Download className="h-3 w-3 mr-1" />
            Télécharger le modèle CSV
          </Button>

          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleFile}
            />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              {fileName || 'Choisir un fichier CSV'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Colonnes requises : email, full_name, role, country_code (max 200 lignes)
            </p>
          </div>

          {rows.length > 0 && !results && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">{rows.length} utilisateur(s) détecté(s)</p>
              <p className="text-xs text-muted-foreground mt-1">
                Rôles : {[...new Set(rows.map(r => r.role))].join(', ')}
              </p>
            </div>
          )}

          {results && (
            <ScrollArea className="max-h-60">
              <div className="space-y-1.5">
                {results.map((r) => (
                  <div key={r.row} className="flex items-center gap-2 text-sm">
                    {r.status === 'created' ? (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    <span className="truncate flex-1">{r.email}</span>
                    {r.status === 'error' && (
                      <Badge variant="destructive" className="text-xs shrink-0">{r.error}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Fermer</Button>
          {!results && (
            <Button onClick={handleImport} disabled={!rows.length || importing}>
              {importing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Importer {rows.length} utilisateur(s)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
