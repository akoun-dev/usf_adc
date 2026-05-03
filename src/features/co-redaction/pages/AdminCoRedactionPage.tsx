import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Clock,
  User,
  MoreVertical,
  Edit,
  Trash,
  CheckCircle,
  Eye,
  Lock,
  Globe,
  FileCode,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  Sparkles,
  Loader2,
  Shield,
  RotateCcw,
  Unlock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { DocumentStatusBadge } from '../components/DocumentStatusBadge';
import { 
  useDocuments, 
  useDeleteDocument, 
  useCreateDocument, 
  useForceUnlockDocument, 
  useChangeWorkflowStatus,
  useDocumentsRealtime
} from '../hooks/useCoRedaction';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DocumentPermissionsDialog } from '../components/DocumentPermissionsDialog';

const CATEGORIES = [
  { value: 'general', label: 'Général' },
  { value: 'legal', label: 'Juridique' },
  { value: 'technical', label: 'Technique' },
  { value: 'reports', label: 'Rapports' },
  { value: 'templates', label: 'Modèles' },
  { value: 'policy', label: 'Politiques' },
];

export default function AdminCoRedactionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', description: '', category: 'general' });

  // Realtime
  useDocumentsRealtime();

  const { data: documents, isLoading } = useDocuments({ 
    search: search || undefined,
    status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  });

  const deleteDoc = useDeleteDocument();
  const createDoc = useCreateDocument();
  const forceUnlock = useForceUnlockDocument();
  const changeStatus = useChangeWorkflowStatus();

  const handleCreate = async () => {
    if (!newDoc.title) return;
    try {
      const doc = await createDoc.mutateAsync(newDoc);
      setIsCreateDialogOpen(false);
      setNewDoc({ title: '', description: '', category: 'general' });
      navigate(`/admin/co-redaction/${doc.id}/edit`);
    } catch {
      // Handled by hook
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-tighter text-sm uppercase">
            <Sparkles className="h-4 w-4" />
            <span>Workspace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Co-Rédaction
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Gérez vos documents collaboratifs avec une expérience fluide et sécurisée.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full px-6 h-12 shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-105 active:scale-95">
                <Plus className="h-5 w-5" />
                {t('coRedaction.newDoc', 'Nouveau document')}
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl sm:max-w-[425px] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
              <DialogHeader className="pt-4">
                <DialogTitle className="text-2xl font-bold tracking-tight">Nouveau Document</DialogTitle>
                <DialogDescription>
                  Commencez un nouveau projet de rédaction collaborative.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Titre du document</Label>
                  <Input
                    id="title"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    placeholder="ex: Rapport d'activité 2024"
                    className="h-12 rounded-xl bg-accent/20 border-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Catégorie</Label>
                  <Select value={newDoc.category} onValueChange={(v) => setNewDoc({ ...newDoc, category: v })}>
                    <SelectTrigger className="h-12 rounded-xl bg-accent/20 border-none focus:ring-2 focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description (optionnel)</Label>
                  <Textarea
                    id="description"
                    value={newDoc.description}
                    onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                    placeholder="Bref résumé du contenu..."
                    className="rounded-xl bg-accent/20 border-none min-h-[100px] focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="rounded-full">Annuler</Button>
                <Button onClick={handleCreate} disabled={!newDoc.title || createDoc.isPending} className="rounded-full px-8 shadow-md">
                  {createDoc.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Créer le document'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 bg-white/50 dark:bg-card/50 backdrop-blur-md p-2 rounded-2xl border border-slate-200/50 dark:border-border/50 shadow-sm">
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('coRedaction.searchPlaceholder', 'Rechercher...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-transparent border-none focus-visible:ring-0 text-sm"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-11 rounded-xl bg-transparent border-slate-200 text-xs">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="editing">En édition</SelectItem>
              <SelectItem value="submitted">Soumis</SelectItem>
              <SelectItem value="closed">Clôturé</SelectItem>
              <SelectItem value="reopened">Réouvert</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-11 rounded-xl bg-transparent border-slate-200 text-xs">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Toutes catégories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="hidden lg:block h-8 mx-1" />

          <div className="flex items-center bg-accent/50 p-1 rounded-xl">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="icon" 
              onClick={() => setViewMode('grid')}
              className={cn("h-9 w-9 rounded-lg transition-all", viewMode === 'grid' && "bg-white dark:bg-background shadow-sm")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="icon" 
              onClick={() => setViewMode('list')}
              className={cn("h-9 w-9 rounded-lg transition-all", viewMode === 'list' && "bg-white dark:bg-background shadow-sm")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Documents Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[240px] rounded-3xl" />
          ))}
        </div>
      ) : documents?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white/30 rounded-3xl border-2 border-dashed border-slate-200/50">
          <div className="h-20 w-20 bg-accent/50 rounded-full flex items-center justify-center mb-6">
            <FileCode className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Aucun document trouvé</h3>
          <p className="text-muted-foreground max-w-sm">
            Commencez par créer votre premier document pour collaborer avec votre équipe.
          </p>
          <Button variant="link" className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
            Créer un document maintenant
          </Button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {documents?.map((doc) => (
                <motion.div key={doc.id} variants={item}>
                  <Card 
                    className="group relative h-full bg-white dark:bg-card border-none shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => navigate(`/admin/co-redaction/${doc.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" /> Modifier l'édition
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/co-redaction/${doc.id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> Consulter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>
                             <DocumentPermissionsDialog 
                               documentId={doc.id} 
                               trigger={<div className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Permissions</div>}
                             />
                          </DropdownMenuItem>
                          {doc.locked_by && (
                            <DropdownMenuItem onClick={() => forceUnlock.mutate(doc.id)}>
                              <Unlock className="mr-2 h-4 w-4" /> Déverrouiller de force
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {['draft', 'editing', 'submitted', 'reopened'].includes(doc.status_workflow) && (
                            <DropdownMenuItem onClick={() => changeStatus.mutate({ id: doc.id, status: 'closed' })}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Clôturer
                            </DropdownMenuItem>
                          )}
                          {doc.status_workflow === 'closed' && (
                            <DropdownMenuItem onClick={() => changeStatus.mutate({ id: doc.id, status: 'reopened' })}>
                              <RotateCcw className="mr-2 h-4 w-4" /> Réouvrir
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              if (confirm('Supprimer ce document ?')) deleteDoc.mutate(doc.id);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <CardHeader className="p-8 pb-4">
                      <div className="mb-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-500">
                          <FileText className="h-6 w-6" />
                        </div>
                        <DocumentStatusBadge status={doc.status_workflow} />
                      </div>
                      <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2 min-h-[2.5rem]">
                        {doc.description || 'Aucune description fournie.'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="px-8 py-0">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground bg-accent/20 p-4 rounded-2xl">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs overflow-hidden">
                          {doc.created_by_profile?.avatar_url ? (
                            <img src={doc.created_by_profile.avatar_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            doc.created_by_profile?.full_name?.[0] || 'U'
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                            {doc.created_by_profile?.full_name || 'Inconnu'}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-tighter opacity-60">Créateur</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-8 pt-6 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true, locale: fr })}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {doc.locked_by && (
                          <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <Lock className="h-3 w-3" />
                          </div>
                        )}
                        {doc.is_public && (
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Globe className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </CardFooter>
                    
                    {/* Hover Effect Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-card rounded-[2rem] overflow-hidden shadow-md border border-slate-200/50"
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents?.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="group flex items-center gap-6 p-6 hover:bg-slate-50 dark:hover:bg-accent/10 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/co-redaction/${doc.id}`)}
                  >
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <FileText className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{doc.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <DocumentStatusBadge status={doc.status_workflow} />
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                          {CATEGORIES.find(c => c.value === doc.category)?.label || doc.category}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" /> {doc.created_by_profile?.full_name || 'Inconnu'}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true, locale: fr })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-4">
                       {doc.locked_by && <Lock className="h-4 w-4 text-orange-500" />}
                       {doc.is_public && <Globe className="h-4 w-4 text-green-500" />}
                       <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
