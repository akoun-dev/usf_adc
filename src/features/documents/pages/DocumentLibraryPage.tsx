import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen, Upload, Download, FileText, Search, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

const CATEGORIES = ['general', 'legal', 'technical', 'reports', 'templates'];

function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('documents' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data as any[];
    },
  });
}

export default function DocumentLibraryPage() {
  const { t } = useTranslation();
  const { hasRole, user } = useAuth();
  const isAdmin = hasRole('global_admin') || hasRole('country_admin');
  const qc = useQueryClient();
  const { data: documents, isLoading } = useDocuments();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const deleteMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (doc: any) => {
      await supabase.storage.from('documents').remove([doc.file_path]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from('documents' as any).delete().eq('id', doc.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['documents'] }); toast.success('Document supprimé'); },
  });

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const desc = formData.get('description') as string;
    const cat = formData.get('category') as string;
    if (!file || !title) return;

    setUploading(true);
    try {
      const path = `${Date.now()}_${file.name}`;
      const { error: upErr } = await supabase.storage.from('documents').upload(path, file);
      if (upErr) throw upErr;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from('documents' as any).insert({
        title, description: desc || null, category: cat || 'general',
        file_name: file.name, file_path: path, file_size: file.size,
        mime_type: file.type, uploaded_by: user?.id,
      });
      if (error) throw error;

      qc.invalidateQueries({ queryKey: ['documents'] });
      setDialogOpen(false);
      toast.success('Document ajouté');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDownload = async (doc: any) => {
    const { data } = supabase.storage.from('documents').getPublicUrl(doc.file_path);
    window.open(data.publicUrl, '_blank');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = (documents || []).filter((d: any) => {
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || d.category === category;
    return matchSearch && matchCat;
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('documents.title', 'Bibliothèque documentaire')}
        description={t('documents.description', 'Documents et ressources partagés')}
        icon={<FolderOpen className="h-6 w-6 text-secondary" />}
      >
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20">
                <Upload className="mr-2 h-4 w-4" />{t('documents.upload', 'Ajouter')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('documents.uploadTitle', 'Ajouter un document')}</DialogTitle></DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div><Label>{t('documents.docTitle', 'Titre')}</Label><Input name="title" required /></div>
                <div><Label>{t('documents.desc', 'Description')}</Label><Input name="description" /></div>
                <div><Label>{t('documents.category', 'Catégorie')}</Label>
                  <select name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><Label>{t('documents.file', 'Fichier')}</Label><Input name="file" type="file" required /></div>
                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? t('common.loading', 'Chargement...') : t('documents.upload', 'Ajouter')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </PageHero>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('documents.search', 'Rechercher...')} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('documents.allCategories', 'Toutes catégories')}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>
      ) : !filtered.length ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <FolderOpen className="mx-auto h-12 w-12 mb-3 opacity-50" />
          {t('documents.empty', 'Aucun document trouvé')}
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {filtered.map((doc: any) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{doc.description || doc.file_name}</p>
                </div>
                <Badge variant="outline">{doc.category}</Badge>
                <span className="text-xs text-muted-foreground">{formatSize(doc.file_size)}</span>
                <Button size="icon" variant="ghost" onClick={() => handleDownload(doc)}><Download className="h-4 w-4" /></Button>
                {hasRole('global_admin') && (
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(doc)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
