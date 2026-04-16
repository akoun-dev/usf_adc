import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Clock, Search, Lock, Mail, Pin, Flame, CheckCircle, Tag as TagIcon, TrendingUp, Award, Sparkles, ArrowRight, Eye, Reply } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHero from '@/components/PageHero';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockForumCategories, mockForumTopics } from '../data/mockForum';

const getStatusBadge = (status: string) => {
  const badges: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
    'pinned': { label: 'Épinglé', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20', icon: Pin },
    'solved': { label: 'Résolu', className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20', icon: CheckCircle },
    'active': { label: 'Actif', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20', icon: Flame },
  };
  return badges[status] || badges['active'];
};

function getAvatarColor(name: string) {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Enhanced Topic Card with better visual hierarchy
function TopicCard({ topic, showCategory = true }: { topic: any; showCategory?: boolean }) {
  const { t } = useTranslation();
  const statusBadge = getStatusBadge(topic.status || 'active');
  const StatusIcon = statusBadge.icon;
  const startDate = new Date(topic.created_at);

  return (
    <Link to={`/forum-public/${topic.id}`} className="block group">
      <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full border-2 hover:border-primary/30 overflow-hidden">
        <CardContent className="p-0">
          {/* Header with gradient accent */}
          <div className={`h-1.5 bg-gradient-to-r ${topic.category?.color || 'from-blue-500 to-purple-500'}`} />

          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Author Avatar with ring */}
              <div className="relative">
                <Avatar className="h-12 w-12 shrink-0 ring-2 ring-primary/20 ring-offset-2">
                  <AvatarFallback className={getAvatarColor(topic.author?.full_name || 'User')}>
                    {topic.author?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {topic.is_pinned && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1">
                    <Pin className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Status badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {topic.is_pinned && (
                    <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs">
                      <Pin className="h-3 w-3 mr-1" />
                      Épinglé
                    </Badge>
                  )}
                  {topic.is_locked && (
                    <Badge variant="outline" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      Verrouillé
                    </Badge>
                  )}
                  {topic.status === 'solved' && (
                    <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Résolu
                    </Badge>
                  )}
                </div>

                <h3 className="font-bold text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  {topic.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {topic.content?.substring(0, 150) + '...'}
                </p>

                {/* Tags */}
                {topic.tags && topic.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {topic.tags.slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted/50 hover:bg-muted transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta information */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium">
                      {topic.author?.full_name || 'Anonyme'}
                      {topic.author?.country && (
                        <span className="text-muted-foreground">({topic.author.country})</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Reply className="h-3 w-3" />
                      {topic._count?.posts || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {topic.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Category Card Component
function CategoryCard({ category, topicCount, onClick, isSelected }: {
  category: any;
  topicCount: number;
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 group ${
        isSelected
          ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 shadow-lg scale-[1.02]'
          : 'hover:bg-muted/50 border-2 border-transparent hover:border-muted-foreground/20'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`text-3xl p-3 rounded-xl ${category.color}/20 group-hover:scale-110 transition-transform`}>
            {category.icon}
          </div>
          <div>
            <h4 className="font-semibold text-sm">{category.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{category.description}</p>
          </div>
        </div>
        <Badge variant={isSelected ? "default" : "secondary"} className="shrink-0">
          {topicCount}
        </Badge>
      </div>
    </button>
  );
}

// Top Contributor Card
function ContributorCard({ contributor }: { contributor: any }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
        <AvatarFallback className={getAvatarColor(contributor.name)}>
          {contributor.name?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{contributor.name}</p>
        <p className="text-xs text-muted-foreground">{contributor.role}</p>
      </div>
      <Badge variant="outline" className="text-xs">
        {contributor.posts} posts
      </Badge>
    </div>
  );
}

// Benefit Card
function BenefitCard({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 hover:border-primary/20 transition-colors">
      <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function PublicForumPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTopics = mockForumTopics.filter((topic) => {
    const matchCategory = selectedCategory === 'all' || topic.category_id === selectedCategory;
    const matchSearch = !search ||
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.content.toLowerCase().includes(search.toLowerCase()) ||
      (topic.tags && topic.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase())));

    let matchTab = true;
    if (activeTab === 'pinned') matchTab = topic.is_pinned;
    else if (activeTab === 'recent') matchTab = !topic.is_pinned;

    return matchCategory && matchSearch && matchTab;
  });

  const pinnedTopics = filteredTopics.filter(t => t.is_pinned);
  const regularTopics = filteredTopics.filter(t => !t.is_pinned);

  const categoryStats = mockForumCategories.map(cat => ({
    ...cat,
    topicCount: mockForumTopics.filter(t => t.category_id === cat.id).length,
  }));

  // Mock top contributors
  const topContributors = [
    { name: 'Amadou Diallo', role: 'Point Focal', country: 'Sénégal', posts: 24 },
    { name: 'Fatou Bensouda', role: 'Admin Pays', country: 'Côte d\'Ivoire', posts: 18 },
    { name: 'Ousmane Traoré', role: 'Point Focal', country: 'Mali', posts: 15 },
    { name: 'Aissa Moussa', role: 'Admin Pays', country: 'Bénin', posts: 12 },
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHero
          title="Forum Public"
          description="Discussions et échanges sur le Service Universel"
          icon={<MessageSquare className="h-6 w-6 text-secondary" />}
        />

        {/* Info Banner */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Lock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Mode Lecture Seule</p>
              <p className="text-muted-foreground mt-1">
                Vous naviguez sur le forum public en mode lecture seule. Pour participer aux discussions, connectez-vous à votre compte.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, title: 'Réseau Expert', description: 'Échangez avec des experts de 23 pays africains' },
            { icon: Sparkles, title: 'Bonnes Pratiques', description: 'Découvrez des solutions éprouvées par vos pairs' },
            { icon: TrendingUp, title: 'Veille', description: 'Restez informé des dernières actualités du FSU' },
            { icon: Award, title: 'Support', description: 'Bénéficiez de l\'aide de la communauté' },
          ].map((benefit, i) => (
            <BenefitCard key={i} {...benefit} />
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un sujet, un tag..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] h-12 rounded-xl">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {mockForumCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full max-w-md grid-cols-3 h-12 rounded-xl bg-muted/50 p-1">
                <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-background shadow-sm">
                  Tous <Badge variant="secondary" className="ml-2">{filteredTopics.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pinned" className="rounded-lg data-[state=active]:bg-background shadow-sm">
                  Épinglés <Badge variant="secondary" className="ml-2">{pinnedTopics.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="recent" className="rounded-lg data-[state=active]:bg-background shadow-sm">
                  Récents <Badge variant="secondary" className="ml-2">{regularTopics.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {/* Pinned Topics */}
                {pinnedTopics.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 w-fit px-4 py-2 rounded-full">
                      <Pin className="h-4 w-4" />
                      Sujets épinglés
                    </div>
                    {pinnedTopics.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} />
                    ))}
                  </div>
                )}

                {/* Regular Topics */}
                {regularTopics.length > 0 && (
                  <div className="space-y-4">
                    {pinnedTopics.length > 0 && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-muted/50 w-fit px-4 py-2 rounded-full">
                        <MessageSquare className="h-4 w-4" />
                        Discussions récentes
                      </div>
                    )}
                    {regularTopics.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} />
                    ))}
                  </div>
                )}

                {filteredTopics.length === 0 && (
                  <Card>
                    <CardContent className="py-16 text-center text-muted-foreground">
                      <MessageSquare className="mx-auto h-16 w-16 mb-4 opacity-50 rounded-2xl bg-muted p-4" />
                      <p className="font-semibold text-lg mb-2">Aucun sujet trouvé</p>
                      <p className="text-sm">Essayez d'autres critères de recherche</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card className="border-2">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Catégories
                </h3>
                <div className="space-y-2">
                  {categoryStats.map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      topicCount={cat.topicCount}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                      isSelected={selectedCategory === cat.id}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card className="border-2">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Top Contributeurs
                </h3>
                <div className="space-y-2">
                  {topContributors.map((contributor, i) => (
                    <ContributorCard key={i} contributor={contributor} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="border-2">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TagIcon className="h-5 w-5 text-primary" />
                  Tags populaires
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['FSU', 'Formation', 'Sénégal', 'Règlementation', 'Technique', 'Innovation', 'Partenariat', 'Bonnes pratiques', 'Subvention', 'Solaire'].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                      onClick={() => setSearch(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter CTA */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
              <CardContent className="p-5">
                <div className="text-center mb-4">
                  <Mail className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-bold text-lg mb-2">Restez informé</h3>
                  <p className="text-sm text-muted-foreground">
                    Recevez les dernières discussions par email
                  </p>
                </div>
                <Input placeholder="Votre email" className="mb-3" />
                <Button className="w-full" variant="outline">
                  S'abonner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
