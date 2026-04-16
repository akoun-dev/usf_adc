import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, CheckCircle2, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import PageHero from '@/components/PageHero';

const GROUPS = [
  { id: '1', name: 'Connectivité & Infrastructure', description: 'Discussion sur les projets de connectivité réseau', members: 24, joined: false },
  { id: '2', name: 'Financement FSU', description: 'Échanges sur le financement du service universel', members: 18, joined: true },
  { id: '3', name: 'Qualité de Service', description: 'Bonnes pratiques et indicateurs qualité', members: 15, joined: false },
  { id: '4', name: 'Réglementation', description: 'Cadre juridique et réglementaire des télécommunications', members: 21, joined: false },
  { id: '5', name: 'Innovation Numérique', description: 'Technologies émergentes et transformation digitale', members: 12, joined: true },
  { id: '6', name: 'Formation & Renforcement', description: 'Partage de ressources et bonnes pratiques de formation', members: 9, joined: false },
];

export default function ForumGroupsPage() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState(GROUPS);

  const toggleJoin = (id: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== id) return g;
      const joined = !g.joined;
      toast.success(joined ? t('groups.joined', 'Groupe rejoint') : t('groups.left', 'Groupe quitté'));
      return { ...g, joined, members: g.members + (joined ? 1 : -1) };
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('groups.title', 'Groupes thématiques')}
        description={t('groups.description', 'Rejoignez des groupes de discussion par thème')}
        icon={<Users className="h-6 w-6 text-secondary" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(g => (
          <Card key={g.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{g.name}</h3>
                {g.joined && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground">{g.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />{g.members} {t('groups.members', 'membres')}
                </Badge>
                <Button size="sm" variant={g.joined ? 'outline' : 'default'} onClick={() => toggleJoin(g.id)}>
                  {g.joined ? t('groups.leave', 'Quitter') : <><UserPlus className="mr-1 h-3 w-3" />{t('groups.join', 'Rejoindre')}</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
