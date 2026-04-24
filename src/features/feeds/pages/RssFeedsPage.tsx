import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rss, ExternalLink, Globe, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

const FEEDS = [
  { id: '1', source: 'Union Internationale des Télécommunications (UIT)', title: 'Dernières actualités sur le développement numérique en Afrique', date: '2026-04-10', url: 'https://www.itu.int', category: 'Réglementation' },
  { id: '2', source: 'Smart Africa', title: 'Initiative Smart Africa : Transformation digitale du continent', date: '2026-04-08', url: 'https://smartafrica.org', category: 'Innovation' },
  { id: '3', source: 'Union Africaine', title: 'Stratégie de transformation numérique pour l\'Afrique 2020-2030', date: '2026-04-05', url: 'https://au.int', category: 'Politique' },
  { id: '4', source: 'UIT', title: 'Rapport mondial sur la connectivité 2026', date: '2026-04-03', url: 'https://www.itu.int', category: 'Rapports' },
  { id: '5', source: 'Smart Africa', title: 'Forum Smart Africa 2026 — Programme et intervenants', date: '2026-03-28', url: 'https://smartafrica.org', category: 'Événements' },
  { id: '6', source: 'CEDEAO', title: 'Harmonisation des politiques TIC en Afrique de l\'Ouest', date: '2026-03-25', url: 'https://ecowas.int', category: 'Réglementation' },
];

export default function RssFeedsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('feeds.title', 'Veille stratégique')}
        description={t('feeds.description', 'Flux RSS agrégés — UIT, Smart Africa, Union Africaine')}
        icon={<Rss className="h-6 w-6 text-secondary" />}
      />

      <div className="grid gap-4">
        {FEEDS.map(feed => (
          <Card key={feed.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-start gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 shrink-0">
                <Globe className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{feed.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{feed.source} — {feed.date}</p>
              </div>
              <Badge variant="outline">{feed.category}</Badge>
              <Button size="sm" variant="ghost" asChild>
                <a href={feed.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
