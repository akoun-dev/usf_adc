import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Clock, MessageSquare, Eye, Pin, Lock, CheckCircle } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { mockForumTopics } from '../data/mockForum';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import PageHero from '@/components/PageHero';
import { useTranslation } from 'react-i18next';

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

const getStatusBadge = (status: string) => {
  const badges: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
    'pinned': { label: 'Épinglé', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', icon: Pin },
    'solved': { label: 'Résolu', className: 'bg-green-500/10 text-green-700 dark:text-green-400', icon: CheckCircle },
  };
  return badges[status];
};

export default function ForumTopicDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const topic = mockForumTopics.find(t => t.id === id);

  if (!topic) {
    return (
      <PublicLayout>
        <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Sujet non trouvé</h1>
          <Button asChild>
            <Link to="/forum-public">Retour au forum</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const createdDate = new Date(topic.created_at);
  const updatedDate = new Date(topic.updated_at);

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/forum-public" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au forum
          </Link>
        </Button>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className={getAvatarColor(topic.author?.full_name || 'User')}>
                  {topic.author?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {topic.category && (
                    <Badge className={topic.category.color + ' text-white'}>
                      {topic.category.icon} {topic.category.name}
                    </Badge>
                  )}
                  {topic.is_pinned && (
                    <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      <Pin className="h-3 w-3 mr-1" />
                      Épinglé
                    </Badge>
                  )}
                  {topic.is_locked && (
                    <Badge variant="outline">
                      <Lock className="h-3 w-3 mr-1" />
                      Verrouillé
                    </Badge>
                  )}
                  {topic.status && topic.status !== 'active' && (() => {
                    const statusInfo = getStatusBadge(topic.status);
                    if (!statusInfo) return null;
                    return (
                      <Badge className={statusInfo.className}>
                        <statusInfo.icon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    );
                  })()}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-4">{topic.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{topic.author?.full_name || 'Anonyme'}</span>
                    {topic.author?.country && (
                      <span>({topic.author.country})</span>
                    )}
                    {topic.author?.role && (
                      <Badge variant="outline" className="text-xs ml-2">
                        {topic.author.role.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Posté le {createdDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  {updatedDate.getTime() !== createdDate.getTime() && (
                    <div className="flex items-center gap-2">
                      <span>Modifié le {updatedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>

                {topic.tags && topic.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {topic.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{topic._count?.posts || 0} réponses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{topic.views} vues</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="prose prose-lg max-w-none">
              {topic.content.split('\n').map((paragraph, i) => {
                if (paragraph.trim().startsWith('-')) {
                  return (
                    <li key={i} className="ml-4">{paragraph.replace(/^-/, '').trim()}</li>
                  );
                }
                if (paragraph.trim().startsWith('**')) {
                  return (
                    <h3 key={i} className="text-xl font-bold mt-6 mb-3">
                      {paragraph.replace(/\*\*/g, '')}
                    </h3>
                  );
                }
                if (paragraph.trim().startsWith('*')) {
                  return (
                    <p key={i} className="italic text-muted-foreground mb-4">
                      {paragraph.replace(/^\*/, '').trim()}
                    </p>
                  );
                }
                if (paragraph.trim() === '') {
                  return <br key={i} />;
                }
                return (
                  <p key={i} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Mode Lecture Seule</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Vous naviguez sur le forum public en mode lecture seule. Pour participer aux discussions et répondre à ce sujet, connectez-vous à votre compte.
            </p>
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>

        {topic._count && topic._count.posts > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Réponses ({topic._count.posts})</h2>
            <Card className="bg-muted/30">
              <CardContent className="p-8 text-center text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-50" />
                <p className="font-medium">Connectez-vous pour voir les réponses</p>
                <p className="text-sm mt-1">Les discussions sont réservées aux membres connectés</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
