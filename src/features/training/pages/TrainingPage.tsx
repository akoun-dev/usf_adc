import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Play, CheckCircle2, BookOpen, Video, Trophy, Calendar, ExternalLink } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'quiz' | 'simulation';
  completed: boolean;
}

const PF_MODULES: Module[] = [
  { id: '1', title: 'Introduction à la plateforme USF-ADC', description: 'Découverte de l\'interface et navigation', duration: '10 min', type: 'video', completed: false },
  { id: '2', title: 'Saisie des données FSU', description: 'Remplir le formulaire structuré étape par étape', duration: '15 min', type: 'simulation', completed: false },
  { id: '3', title: 'Upload de justificatifs', description: 'Joindre des fichiers PDF/Excel à une soumission', duration: '5 min', type: 'video', completed: false },
  { id: '4', title: 'Suivi de soumission', description: 'Comprendre les statuts et les notifications', duration: '8 min', type: 'video', completed: false },
  { id: '5', title: 'Quiz — Saisie des données', description: 'Testez vos connaissances sur la saisie FSU', duration: '10 min', type: 'quiz', completed: false },
  { id: '6', title: 'Simulation guidée', description: 'Créer et soumettre une saisie complète avec feedback', duration: '20 min', type: 'simulation', completed: false },
];

const ADMIN_MODULES: Module[] = [
  { id: 'a1', title: 'Gestion des utilisateurs', description: 'Inviter, modifier les rôles, désactiver des comptes', duration: '12 min', type: 'video', completed: false },
  { id: 'a2', title: 'Workflow de validation', description: 'Configurer le processus d\'approbation à 1 ou 2 niveaux', duration: '10 min', type: 'video', completed: false },
  { id: 'a3', title: 'Rapports et KPIs', description: 'Générer et exporter des rapports de synthèse', duration: '15 min', type: 'simulation', completed: false },
  { id: 'a4', title: 'Administration avancée', description: 'Paramètres plateforme, audit, sécurité', duration: '12 min', type: 'video', completed: false },
  { id: 'a5', title: 'Quiz — Administration', description: 'Testez vos connaissances administrateur', duration: '10 min', type: 'quiz', completed: false },
];

const WEBINARS = [
  { id: 'w1', title: 'Webinaire d\'introduction — USF-ADC', date: '2026-05-15', time: '10:00 UTC', status: 'upcoming' as const },
  { id: 'w2', title: 'Bonnes pratiques de saisie FSU', date: '2026-05-22', time: '14:00 UTC', status: 'upcoming' as const },
  { id: 'w3', title: 'Validation et workflow — Session Q&A', date: '2026-06-05', time: '10:00 UTC', status: 'upcoming' as const },
  { id: 'w4', title: 'Cartographie des projets — Démonstration', date: '2026-04-01', time: '10:00 UTC', status: 'past' as const },
];

const typeIcons = { video: Video, quiz: Trophy, simulation: Play };
const typeColors = { video: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', quiz: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300', simulation: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' };

export default function TrainingPage() {
  const { hasRole } = useAuth();
  const { t } = useTranslation();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const isAdmin = hasRole('country_admin') || hasRole('global_admin');

  const modules = isAdmin ? [...PF_MODULES, ...ADMIN_MODULES] : PF_MODULES;
  const totalModules = modules.length;
  const completedCount = completedIds.size;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const toggleComplete = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('training.title', 'Formation & Onboarding')}
        description={t('training.description', 'Parcours de formation interactif pour maîtriser la plateforme')}
        icon={<GraduationCap className="h-6 w-6 text-secondary" />}
      />

      {/* Progress card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{t('training.progress', 'Progression')}</span>
            <span className="text-sm text-muted-foreground">{completedCount}/{totalModules} ({progressPercent}%)</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses"><BookOpen className="mr-2 h-4 w-4" />{t('training.courses', 'Cours')}</TabsTrigger>
          <TabsTrigger value="webinars"><Video className="mr-2 h-4 w-4" />{t('training.webinars', 'Webinaires')}</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4 mt-4">
          {isAdmin && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t('training.pfCourse', 'Parcours Point Focal')}</h3>
              <div className="grid gap-3">
                {PF_MODULES.map(m => {
                  const Icon = typeIcons[m.type];
                  const done = completedIds.has(m.id);
                  return (
                    <Card key={m.id} className={`transition-all ${done ? 'opacity-60' : ''}`}>
                      <CardContent className="flex items-center gap-4 py-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeColors[m.type]}`}>
                          {done ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Icon className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{m.title}</p>
                          <p className="text-sm text-muted-foreground">{m.description}</p>
                        </div>
                        <Badge variant="outline">{m.duration}</Badge>
                        <Button size="sm" variant={done ? 'outline' : 'default'} onClick={() => toggleComplete(m.id)}>
                          {done ? t('training.redo', 'Refaire') : t('training.start', 'Commencer')}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <h3 className="text-lg font-semibold mt-6">{t('training.adminCourse', 'Parcours Administrateur')}</h3>
            </div>
          )}
          <div className="grid gap-3">
            {(isAdmin ? ADMIN_MODULES : PF_MODULES).map(m => {
              const Icon = typeIcons[m.type];
              const done = completedIds.has(m.id);
              return (
                <Card key={m.id} className={`transition-all ${done ? 'opacity-60' : ''}`}>
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeColors[m.type]}`}>
                      {done ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{m.title}</p>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                    </div>
                    <Badge variant="outline">{m.duration}</Badge>
                    <Button size="sm" variant={done ? 'outline' : 'default'} onClick={() => toggleComplete(m.id)}>
                      {done ? t('training.redo', 'Refaire') : t('training.start', 'Commencer')}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="webinars" className="space-y-4 mt-4">
          <div className="grid gap-3">
            {WEBINARS.map(w => (
              <Card key={w.id}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{w.title}</p>
                    <p className="text-sm text-muted-foreground">{w.date} — {w.time}</p>
                  </div>
                  <Badge variant={w.status === 'upcoming' ? 'default' : 'secondary'}>
                    {w.status === 'upcoming' ? t('training.upcoming', 'À venir') : t('training.past', 'Passé')}
                  </Badge>
                  {w.status === 'upcoming' && (
                    <Button size="sm" variant="outline">
                      <ExternalLink className="mr-1 h-3 w-3" />{t('training.join', 'Rejoindre')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
