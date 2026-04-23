import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search, Filter, ArrowRight, Tag as TagIcon, Video, Building, Ticket, X } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { usePublicEvents, usePastEvents } from '../hooks/usePublicEvents';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import PageHero from '@/components/PageHero';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
// @ts-expect-error - date-fns v3 locale import
import fr from 'date-fns/locale/fr';
// @ts-expect-error - date-fns v3 locale import
import enUS from 'date-fns/locale/en-US';
// @ts-expect-error - date-fns v3 locale import
import pt from 'date-fns/locale/pt';

// Available locales
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const locales: Record<string, any> = { fr, en: enUS, pt };

const getEventTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'conference': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    'webinar': 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    'workshop': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    'meeting': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  };
  return colors[type] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
};

const getEventTypeIcon = (type: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    'conference': Building,
    'webinar': Video,
    'workshop': Users,
    'meeting': CalendarIcon,
  };
  return icons[type] || CalendarIcon;
};

const getDateFnsLocale = (lang: string) => {
  return locales[lang] || fr;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EventCard({ event, past = false }: { event: any; past?: boolean }) {
  const { t } = useTranslation();
  const TypeIcon = getEventTypeIcon(event.event_type);
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;

  const isMultiDay = endDate && endDate.getDate() !== startDate.getDate();

  const downloadICS = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//USF-ADC//Events//FR',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate || startDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      event.location ? `LOCATION:${event.location}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Link to={`/calendrier/${event.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
      {event.image_url && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 right-3">
            <Badge className={getEventTypeColor(event.event_type)}>
              <TypeIcon className="h-3 w-3 mr-1" />
              {event.event_type}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-white/90 backdrop-blur-sm text-foreground">
                <span className="text-xs font-medium uppercase">{startDate.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                <span className="text-lg font-bold">{startDate.getDate()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <CardContent className="p-5">
        {!event.image_url && (
          <div className="flex items-center gap-3 mb-3">
            <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary">
              <span className="text-xs font-medium uppercase">{startDate.toLocaleDateString('fr-FR', { month: 'short' })}</span>
              <span className="text-2xl font-bold">{startDate.getDate()}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                {event.location ? (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location.length > 30 ? event.location.substring(0, 30) + '...' : event.location}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    {t('public.calendar.online')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {event.image_url && (
          <>
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              {event.location ? (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location.length > 40 ? event.location.substring(0, 40) + '...' : event.location}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  {t('public.calendar.online')}
                </span>
              )}
              {isMultiDay && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.ceil((endDate!.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} {t('public.calendar.days')}
                </span>
              )}
            </div>
          </>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags && event.tags.slice(0, 3).map((tag: string, i: number) => (
            <Badge key={i} variant="outline" className="text-xs">
              <TagIcon className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t text-sm">
          <div className="flex items-center gap-4">
            {event.max_participants && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                {event.max_participants} places
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {event.price && (
              <Badge variant="outline" className="text-xs">
                <Ticket className="h-3 w-3 mr-1" />
                {event.price}
              </Badge>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={downloadICS}
              title="Exporter au format .ics"
            >
              📅
            </Button>
          </div>
        </div>

        {event.registration_url && !past && (
          <Button
            className="w-full mt-4"
            variant={event.price === 'Gratuit' ? 'default' : 'outline'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(event.registration_url, '_blank', 'noopener,noreferrer');
            }}
          >
            {event.price === 'Gratuit' ? "S'inscrire gratuitement" : 'S\'inscrire'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
    </Link>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UpcomingEventsSnapList({ events, isLoading, t }: { events: any[]; isLoading: boolean; t: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isHoveredRef = useRef(false);
  const activeIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Scroll to a specific index using real DOM positions
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const clampedIndex = Math.max(0, Math.min(index, events.length - 1));
    const container = scrollRef.current;
    const items = container.querySelectorAll('[data-snap-item]');
    if (items[clampedIndex]) {
      const targetItem = items[clampedIndex] as HTMLElement;
      const containerTop = container.getBoundingClientRect().top;
      const itemTop = targetItem.getBoundingClientRect().top;
      const offset = itemTop - containerTop + container.scrollTop;
      container.scrollTo({ top: offset, behavior: 'smooth' });
    }
    setActiveIndex(clampedIndex);
  }, [events.length]);

  // Auto-scroll with 4-second interval, pauses on hover
  useEffect(() => {
    if (events.length <= 1) return;

    intervalRef.current = setInterval(() => {
      if (isHoveredRef.current) return;

      const currentIndex = activeIndexRef.current;
      const nextIndex = (currentIndex + 1) % events.length;

      if (scrollRef.current) {
        const container = scrollRef.current;
        const items = container.querySelectorAll('[data-snap-item]');
        if (items[nextIndex]) {
          const targetItem = items[nextIndex] as HTMLElement;
          const containerTop = container.getBoundingClientRect().top;
          const itemTop = targetItem.getBoundingClientRect().top;
          const offset = itemTop - containerTop + container.scrollTop;
          container.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }
      setActiveIndex(nextIndex);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [events.length]);

  // Detect active item on manual scroll using real DOM positions
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const items = container.querySelectorAll('[data-snap-item]');

    let closestIndex = 0;
    let minDistance = Infinity;
    items.forEach((item, index) => {
      const el = item as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const itemRect = el.getBoundingClientRect();
      const relativeTop = itemRect.top - containerRect.top;
      const distance = Math.abs(relativeTop);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    setActiveIndex(prev => prev !== closestIndex ? closestIndex : prev);
  }, []);

  const goUp = () => scrollToIndex(activeIndex - 1);
  const goDown = () => scrollToIndex(activeIndex + 1);

  return (
    <div
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          {t('public.calendar.upcoming')}
          {!isLoading && events.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeIndex + 1}/{events.length}
            </Badge>
          )}
        </h3>
        {!isLoading && events.length > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={goUp}
              disabled={activeIndex <= 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={goDown}
              disabled={activeIndex >= events.length - 1}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            {t('public.calendar.noEvents')}
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Fade top indicator */}
          {/*activeIndex > 0 && (
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          )*/}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent"
            style={{
              maxHeight: '580px',
              scrollSnapType: 'y mandatory',
            }}
          >
            <div className="space-y-3 pb-4">
              {events.map((event) => {
                const TypeIcon = getEventTypeIcon(event.event_type);
                const startDate = new Date(event.start_date);
                return (
                  <div key={event.id} data-snap-item style={{ scrollSnapAlign: 'start' }}>
                    <Link
                      to={`/calendrier/${event.id}`}
                      className="block"
                    >
                      <Card className="hover:shadow-md transition-all duration-300 group min-h-[180px] flex flex-col">
                        <CardContent className="p-4 flex flex-col justify-between flex-1">
                          {/* Top row: Badge + Title on left, Date on extreme right */}
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <Badge className={`mb-1.5 text-[10px] ${getEventTypeColor(event.event_type)}`}>
                                <TypeIcon className="h-3 w-3 mr-1" />
                                {t(`public.eventTypes.${event.event_type}`)}
                              </Badge>
                              <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                {event.title}
                              </h4>
                            </div>
                            <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary shrink-0">
                              <span className="text-[10px] font-medium uppercase leading-tight">
                                {startDate.toLocaleDateString('fr-FR', { month: 'short' })}
                              </span>
                              <span className="text-lg font-bold leading-tight">{startDate.getDate()}</span>
                            </div>
                          </div>
                          {/* Bottom section: Location + Register button */}
                          <div className="mt-3 space-y-1">
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="line-clamp-1">
                                    {event.location.length > 30 ? event.location.substring(0, 30) + '...' : event.location}
                                  </span>
                                </div>
                              )}
                            </div>
                            {event.registration_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs h-6"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.open(event.registration_url, '_blank', 'noopener,noreferrer');
                                }}
                              >
                                {t('public.calendar.register')}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Fade bottom indicator */}
          {activeIndex < events.length - 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
          )}
        </div>
      )}
    </div>
  );
}

export default function EventsCalendarPage() {
  const { t, i18n } = useTranslation();
  const { data: upcomingEvents, isLoading: upcomingLoading } = usePublicEvents();
  const { data: pastEvents, isLoading: pastLoading } = usePastEvents();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedType, setSelectedType] = useState('all');
  const [search, setSearch] = useState('');
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const itemsPerPage = 9;
  const [mainTab, setMainTab] = useState('calendar');
  const [listSubTab, setListSubTab] = useState('upcoming');

  // State for popover
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const EVENT_TYPES = [
    { value: 'all', label: t('public.calendar.allTypes'), icon: CalendarIcon },
    { value: 'conference', label: t('public.eventTypes.conference'), icon: Building },
    { value: 'webinar', label: t('public.eventTypes.webinar'), icon: Video },
    { value: 'workshop', label: t('public.eventTypes.workshop'), icon: Users },
  ];

  const filteredEvents = useMemo(() => {
    return (upcomingEvents || []).filter((event) => {
      const matchType = selectedType === 'all' || event.event_type === selectedType;
      const matchSearch = !search ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(search.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(search.toLowerCase())) ||
        (event.tags && event.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase())));
      return matchType && matchSearch;
    });
  }, [upcomingEvents, selectedType, search]);

  const filteredPast = useMemo(() => {
    return (pastEvents || []).filter((event) => {
      return !search ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(search.toLowerCase()));
    });
  }, [pastEvents, search]);

  // Reset pages when filters change
  useEffect(() => {
    setUpcomingPage(1);
    setPastPage(1);
  }, [search, selectedType]);

  const upcomingTotalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const pastTotalPages = Math.ceil(filteredPast.length / itemsPerPage);

  const paginatedUpcoming = useMemo(() => {
    const startIndex = (upcomingPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, upcomingPage, itemsPerPage]);

  const paginatedPast = useMemo(() => {
    const startIndex = (pastPage - 1) * itemsPerPage;
    return filteredPast.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPast, pastPage, itemsPerPage]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const hasEventOnDay = (day: Date) => {
    return filteredEvents.some(event => {
      const eventDate = parseISO(event.start_date);
      return isSameDay(eventDate, day);
    });
  };

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = parseISO(event.start_date);
      return isSameDay(eventDate, day);
    });
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const upcomingConference = filteredEvents.filter(e => e.event_type === 'conference');
  const upcomingWebinars = filteredEvents.filter(e => e.event_type === 'webinar');
  const upcomingWorkshops = filteredEvents.filter(e => e.event_type === 'workshop');

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHero
          title={t('public.calendar.title')}
          description={t('public.calendar.description')}
          icon={<CalendarIcon className="h-6 w-6 text-secondary" />}
        />

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingConference.length}</p>
                  <p className="text-sm text-muted-foreground">{t('public.calendar.conferencesUpcoming')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingWebinars.length}</p>
                  <p className="text-sm text-muted-foreground">{t('public.calendar.webinarsScheduled')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingWorkshops.length}</p>
                  <p className="text-sm text-muted-foreground">{t('public.calendar.workshopsTraining')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('public.calendar.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((et) => {
                const Icon = et.icon;
                return (
                  <SelectItem key={et.value} value={et.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {et.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-6">
          <div className="flex items-center justify-between w-full">
            <TabsList className="grid max-w-md grid-cols-2">
              <TabsTrigger value="calendar">{t('public.calendar.calendarTab')}</TabsTrigger>
              <TabsTrigger value="list">{t('public.calendar.listTab')}</TabsTrigger>
            </TabsList>
            {mainTab === 'list' && (
              <div className="flex items-center gap-2">
                <Button
                  variant={listSubTab === 'upcoming' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setListSubTab('upcoming')}
                >
                  {t('public.calendar.upcoming')} ({filteredEvents.length})
                </Button>
                <Button
                  variant={listSubTab === 'past' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setListSubTab('past')}
                >
                  {t('public.calendar.past')} ({filteredPast.length})
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendar View */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <Button variant="outline" size="icon" onClick={previousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h3 className="text-lg font-semibold capitalize">
                        {format(currentMonth, 'MMMM yyyy', { locale: getDateFnsLocale(i18n.language) })}
                      </h3>
                      <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                          {t(`public.calendar.weekdays.${day.toLowerCase()}`)}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {daysInMonth.map((day) => {
                        const events = getEventsForDay(day);
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const hasEvents = events.length > 0;
                        return (
                          <Popover
                            key={day.toISOString()}
                            open={popoverOpen && selectedDateKey === dateKey}
                            onOpenChange={(open) => {
                              setPopoverOpen(open);
                              if (open) {
                                setSelectedDateKey(dateKey);
                              } else {
                                setSelectedDateKey(null);
                              }
                            }}
                          >
                            <PopoverTrigger asChild>
                              <div
                                className={`
                                  aspect-square p-1 text-center rounded-md transition-colors
                                  ${!isSameMonth(day, currentMonth) ? 'text-muted-foreground/30' : 'hover:bg-muted'}
                                  ${hasEvents ? 'bg-primary/10 hover:bg-primary/20 cursor-pointer' : ''}
                                `}
                              >
                                <span className="text-sm">{format(day, 'd')}</span>
                                {hasEvents && (
                                  <div className="flex justify-center mt-1 gap-0.5">
                                    {events.slice(0, 3).map((_, i) => (
                                      <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[450px] p-0"
                              align="start"
                              sideOffset={4}
                            >
                              {events.length > 0 && (
                                <div className="p-5">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-base flex items-center gap-2">
                                      <CalendarIcon className="h-5 w-5 text-primary" />
                                      {format(day, 'd MMMM yyyy', { locale: getDateFnsLocale(i18n.language) })}
                                    </h4>
                                    <Badge variant="secondary" className="text-sm">
                                      {events.length} événement{events.length > 1 ? 's' : ''}
                                    </Badge>
                                  </div>
                                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                                    {events.map((event) => {
                                      const TypeIcon = getEventTypeIcon(event.event_type);
                                      const startDate = new Date(event.start_date);
                                      return (
                                        <Link
                                          key={event.id}
                                          to={`/calendrier/${event.id}`}
                                          className="block group"
                                          onClick={() => setPopoverOpen(false)}
                                        >
                                          <Card className="hover:shadow-md transition-shadow border-primary/10">
                                            <CardContent className="p-4">
                                              <div className="flex items-start gap-4">
                                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${getEventTypeColor(event.event_type).split(' ')[0]}`}>
                                                  <TypeIcon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <Badge className={`mb-2 ${getEventTypeColor(event.event_type)}`}>
                                                    {t(`public.eventTypes.${event.event_type}`)}
                                                  </Badge>
                                                  <h5 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                                    {event.title}
                                                  </h5>
                                                  {event.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                      {event.description}
                                                    </p>
                                                  )}
                                                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                  </div>
                                                  {event.location && (
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                      <MapPin className="h-4 w-4" />
                                                      <span className="line-clamp-1">{event.location}</span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </PopoverContent>
                          </Popover>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Events List - Vertical Snap Scroll */}
              <UpcomingEventsSnapList
                events={filteredEvents}
                isLoading={upcomingLoading}
                t={t}
              />
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            {listSubTab === 'upcoming' && (
              <div className="space-y-4">
                {upcomingLoading ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-5">
                          <Skeleton className="h-40 w-full mb-4" />
                          <Skeleton className="h-6 w-3/4 mb-3" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : paginatedUpcoming.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center text-muted-foreground">
                      <CalendarIcon className="mx-auto h-16 w-16 mb-4 opacity-30" />
                      <p className="text-lg font-medium mb-2">
                        {t('public.calendar.noEvents')}
                      </p>
                      <p className="text-sm">
                        {t('public.calendar.comingSoon')}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {paginatedUpcoming.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>

                    {upcomingTotalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationPrevious
                              onClick={() => setUpcomingPage(p => Math.max(1, p - 1))}
                              className={upcomingPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />

                            {Array.from({ length: upcomingTotalPages }, (_, i) => i + 1).map((page) => {
                              if (
                                page === 1 ||
                                page === upcomingTotalPages ||
                                (page >= upcomingPage - 1 && page <= upcomingPage + 1)
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      onClick={() => setUpcomingPage(page)}
                                      isActive={page === upcomingPage}
                                      className="cursor-pointer"
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              } else if (
                                page === upcomingPage - 2 ||
                                page === upcomingPage + 2
                              ) {
                                return (
                                  <PaginationEllipsis key={page} />
                                );
                              }
                              return null;
                            })}

                            <PaginationNext
                              onClick={() => setUpcomingPage(p => Math.min(upcomingTotalPages, p + 1))}
                              className={upcomingPage === upcomingTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {listSubTab === 'past' && (
              <div className="space-y-4">
                {pastLoading ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-5">
                          <Skeleton className="h-40 w-full mb-4" />
                          <Skeleton className="h-6 w-3/4 mb-3" />
                          <Skeleton className="h-4 w-full mb-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : paginatedPast.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center text-muted-foreground">
                      <CalendarIcon className="mx-auto h-16 w-16 mb-4 opacity-30" />
                      <p className="text-lg font-medium">
                        {t('public.calendar.noPastEvents')}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {paginatedPast.map((event) => (
                        <EventCard key={event.id} event={event} past />
                      ))}
                    </div>

                    {pastTotalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationPrevious
                              onClick={() => setPastPage(p => Math.max(1, p - 1))}
                              className={pastPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />

                            {Array.from({ length: pastTotalPages }, (_, i) => i + 1).map((page) => {
                              if (
                                page === 1 ||
                                page === pastTotalPages ||
                                (page >= pastPage - 1 && page <= pastPage + 1)
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      onClick={() => setPastPage(page)}
                                      isActive={page === pastPage}
                                      className="cursor-pointer"
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              } else if (
                                page === pastPage - 2 ||
                                page === pastPage + 2
                              ) {
                                return (
                                  <PaginationEllipsis key={page} />
                                );
                              }
                              return null;
                            })}

                            <PaginationNext
                              onClick={() => setPastPage(p => Math.min(pastTotalPages, p + 1))}
                              className={pastPage === pastTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PublicLayout>
  );
}
