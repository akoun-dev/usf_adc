import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  Building2,
  Printer,
  Download,
  Clock,
  Target,
  BarChart3,
  Info,
  AlertCircle,
  Mail
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { usePublicProject } from '../hooks/usePublicProjects';
import { getLangValue } from '@/types/i18n';
import { ProjectComments } from '../components/ProjectComments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { data: project, isLoading, error } = usePublicProject(id ?? '');

  const currentLang = i18n.language || 'fr';
  const locale = currentLang.startsWith('en') ? 'en-US' : 'fr-FR';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !project) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h1 className="text-2xl font-bold mb-4">{t('public.memberCountries.projectNotFound', 'Projet non trouvé')}</h1>
          <p className="text-muted-foreground mb-8">Désolé, nous n'avons pas pu trouver les informations de ce projet ou celui-ci n'existe plus.</p>
          <Button asChild>
            <Link to="/carte-public">{t('public.memberCountries.backToMap', 'Retour à la carte')}</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const statusColors: Record<string, string> = {
    planned: 'bg-slate-500/10 text-slate-700 border-slate-200',
    in_progress: 'bg-blue-500/10 text-blue-700 border-blue-200',
    completed: 'bg-green-500/10 text-green-700 border-green-200',
    suspended: 'bg-amber-500/10 text-amber-700 border-amber-200',
  };

  const projectTitle = getLangValue(project.title, currentLang) || t('common.untitled', { defaultValue: 'Projet sans titre' });
  const projectDesc = getLangValue(project.description, currentLang);
  const countryName = project.country ? (currentLang.startsWith('en') ? project.country.name_en : project.country.name_fr) : '';

  return (
    <PublicLayout>
      <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10 print:py-0">

        {/* Navigation & Actions (Hidden on Print) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 print:hidden">
          <Button asChild variant="ghost" className="gap-2 hover:bg-primary/5 transition-colors">
            <Link to={project.country?.code_iso ? `/projets-pays/${project.country.code_iso.toLowerCase()}` : '/annuaire-pays-membres'}>
              <ArrowLeft className="h-4 w-4" />
              {t('common.back', { defaultValue: 'Retour' })}
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 border-primary/20 hover:border-primary/40">
              <Printer className="h-4 w-4 text-primary" />
              {t('common.print', 'Imprimer')}
            </Button>
            <Button size="sm" onClick={handleDownload} className="gap-2 bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4" />
              {t('common.download', 'Télécharger PDF')}
            </Button>
          </div>
        </div>

        {/* Project Header */}
        <div className="mb-10 p-8 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-transparent border border-primary/5">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="outline" className={cn("px-3 py-1", statusColors[project.status] || statusColors.planned)}>
              {t(`public.memberCountries.status.${project.status}`, project.status)}
            </Badge>
            {project.thematic && (
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
                {project.thematic}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
            {projectTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium text-foreground/80">{countryName} {project.region ? `• ${project.region}` : ''}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium text-foreground/80">{project.operator || t('common.n_a', 'Non spécifié')}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  {t('public.memberCountries.project.description', 'Description du Projet')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-blue max-w-none dark:prose-invert">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
                    {projectDesc || t('common.noDescription', 'Aucune description disponible.')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Objectives & Indicators Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t('public.memberCountries.project.objectives', 'Objectifs')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getLangValue(project.objectives, currentLang) || 'Non spécifiés'}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {t('public.memberCountries.project.indicators', 'Indicateurs')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getLangValue(project.indicators, currentLang) || 'Non spécifiés'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  {t('common.gallery', 'Galerie Photos')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.images.map((img, idx) => (
                    <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                      <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Key Info */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/10 shadow-none border rounded-2xl overflow-hidden">
              <div className="h-1.5 bg-primary w-full" />
              <CardHeader>
                <CardTitle className="text-base font-bold">{t('public.memberCountries.project.keyInfo', 'Informations Clés')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Budget */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    {t('public.memberCountries.project.budget')}
                  </div>
                  <div className="text-2xl font-black text-primary tracking-tight">
                    {project.budget ? `${project.budget.toLocaleString(locale)} FCFA` : '—'}
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {t('public.memberCountries.project.progress', 'Progression')}
                    </span>
                    <span className="text-primary">{project.progress || 0}%</span>
                  </div>
                  <Progress value={project.progress || 0} className="h-2.5 bg-primary/10" />
                </div>

                {/* Beneficiaries */}
                <div className="space-y-2 pt-4 border-t border-primary/10">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    {t('public.memberCountries.project.beneficiariesTitle', 'Bénéficiaires')}
                  </div>
                  <div className="font-bold text-foreground/90">
                    {project.beneficiaries || 'Non spécifiés'}
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 pt-4 border-t border-primary/10">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {t('public.memberCountries.project.timeline', 'Calendrier')}
                  </div>
                  <div className="text-sm font-bold text-foreground/90">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString(locale) : '—'}
                    <span className="mx-2 text-muted-foreground">→</span>
                    {project.end_date ? new Date(project.end_date).toLocaleDateString(locale) : '—'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support CTA */}
            <Card className="border-dashed bg-muted/20 border-muted-foreground/20 rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {t('public.memberCountries.project.supportDesc', 'Une question sur ce projet ? Notre équipe est à votre disposition.')}
                </p>
                <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5" asChild>
                  <Link to="/a-propos">{t('common.contact', 'Contactez-nous')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project Comments (Internal) */}
        {project.id && <ProjectComments projectId={project.id} />}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          header, footer, .PublicLayout_header, .PublicLayout_footer { display: none !important; }
          .max-w-6xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .shadow-none, .Card, .shadow-sm { border: 1px solid #eee !important; box-shadow: none !important; }
          .prose { max-width: 100% !important; }
          main { padding-top: 0 !important; }
        }
      `}} />
    </PublicLayout>
  );
}

// Helper for cn (copying logic from lib/utils if needed, but assuming it's available)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
