import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopics, useCategories } from '../hooks/useTopics';
import { CategoryFilter } from '../components/CategoryFilter';
import { TopicCard } from '../components/TopicCard';
import { ModerationPanel } from '../components/ModerationPanel';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: topics, isLoading } = useTopics(selectedCategory);
  const { user, hasRole } = useAuth();
  const { t } = useTranslation();

  const isAdmin = hasRole('global_admin');

  const canCreate = hasRole('point_focal') || hasRole('country_admin') || hasRole('global_admin');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('forum.title')}
        description={t('forum.description')}
        icon={<MessageSquare className="h-6 w-6 text-secondary" />}
      >
        {canCreate && (
          <Button asChild className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20">
            <Link to="/forum/new"><Plus className="mr-2 h-4 w-4" />{t('forum.newTopic')}</Link>
          </Button>
        )}
      </PageHero>

      {!catLoading && categories && (
        <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : topics && topics.length > 0 ? (
        <div className="space-y-3">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">{t('forum.noTopics')}</p>
          {canCreate && (
            <Button asChild variant="outline" className="mt-4">
              <Link to="/forum/new">{t('forum.createFirst')}</Link>
            </Button>
          )}
        </div>
      )}

      {isAdmin && user && (
        <ModerationPanel userId={user.id} />
      )}
    </div>
  );
}
