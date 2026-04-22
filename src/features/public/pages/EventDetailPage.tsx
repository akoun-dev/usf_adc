import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink, Share2 } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useEvent } from '../hooks/usePublicEvents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHero from '@/components/PageHero';
import { useTranslation } from 'react-i18next';

const getEventTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'conference': 'Conférence',
    'webinar': 'Webinaire',
    'workshop': 'Atelier',
    'training': 'Formation',
    'meeting': 'Réunion',
    'other': 'Autre',
  };
  return labels[type] || type;
};

const getEventTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'conference': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    'webinar': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    'workshop': 'bg-green-500/10 text-green-700 dark:text-green-400',
    'training': 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    'meeting': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    'other': 'bg-gray-500/10 text-gray-700',
  };
  return colors[type] || 'bg-gray-500/10 text-gray-700';
};

export default function EventDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(id ?? '');

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Événement non trouvé</h1>
          <Button asChild>
            <Link to="/calendrier">Retour au calendrier</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/calendrier" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au calendrier
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {event.image_url && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-[300px] object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Badge className={getEventTypeColor(event.event_type)}>
                {getEventTypeLabel(event.event_type)}
              </Badge>
              {event.status === 'upcoming' && (
                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">À venir</Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{event.title}</h1>

            {event.description && (
              <div className="prose prose-lg max-w-none mb-6">
                {event.description.split('\n').map((paragraph, i) => {
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
            )}

            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {endDate && endDate.getTime() !== startDate.getTime() && (
                      <p className="text-sm text-muted-foreground">
                        au {endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Lieu</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>

                {event.organizer && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Organisateur</p>
                      <p className="font-medium">{event.organizer}</p>
                    </div>
                  </div>
                )}

                {event.max_participants && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Places</p>
                      <p className="font-medium">{event.max_participants} participants max</p>
                    </div>
                  </div>
                )}

                {event.price && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Tarif</p>
                    <p className="text-lg font-bold text-primary">{event.price}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {event.registration_url && (
              <Button asChild className="w-full" size="lg">
                <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                  S'inscrire à l'événement
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}

            <Button variant="outline" className="w-full gap-2">
              <Share2 className="h-4 w-4" />
              Partager
            </Button>

            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <Button asChild variant="ghost" className="w-full gap-2" size="sm">
                  <a href={`data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
${endDate ? `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z` : ''}
SUMMARY:${event.title}
LOCATION:${event.location}
DESCRIPTION:${event.description?.replace(/\n/g, '\\n') || ''}
END:VEVENT
END:VCALENDAR`}
                    download="event.ics"
                  >
                    <Calendar className="h-4 w-4" />
                    Ajouter au calendrier
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
