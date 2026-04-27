import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Building, Video, Users } from 'lucide-react';
import { usePublicEvents } from '../hooks/usePublicEvents';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

export function MiniCalendar() {
  const { t, i18n } = useTranslation();
  const { data: upcomingEvents, isLoading } = usePublicEvents();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // State for popover
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month to align with weekday columns
  const startDayOfWeek = monthStart.getDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // offset to Monday

  const getEventsForDay = (day: Date) => {
    return (upcomingEvents || []).filter(event => {
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8" />
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
  <Card className="h-full flex flex-col overflow-hidden">
    <CardContent className="p-2 sm:p-3 flex-1 flex flex-col min-h-0">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 shrink-0">
          <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={previousMonth}>
            <ChevronLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Button>
          <h3 className="text-xs sm:text-sm md:text-md font-semibold capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: getDateFnsLocale(i18n.language) })}
          </h3>
          <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={nextMonth}>
            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center mb-0.5 sm:mb-1 shrink-0">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-[12px] sm:text-[14px] font-medium text-muted-foreground py-0.5 sm:py-1">
              {t(`public.calendar.weekdays.${day.toLowerCase()}`)}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 flex-1 auto-rows-fr">
          {/* Empty cells for padding before month start */}
          {Array.from({ length: mondayOffset }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}

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
                      p-0.5 text-center rounded-md transition-colors flex flex-col items-center justify-center min-h-0
                      ${!isSameMonth(day, currentMonth) ? 'text-muted-foreground/30' : 'hover:bg-muted'}
                      ${hasEvents ? 'bg-primary/10 hover:bg-primary/20 cursor-pointer' : ''}
                    `}
                  >
                    <span className="text-[12px] sm:text-sm md:text-md leading-none">{format(day, 'd')}</span>
                    {hasEvents && (
                      <div className="flex justify-center mt-0.5 gap-0.5">
                        {events.slice(0, 3).map((_, i) => (
                          <div key={i} className="h-0.5 w-0.5 sm:h-1 sm:w-1 rounded-full bg-primary" />
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[320px] p-0"
                  align="start"
                  sideOffset={4}
                >
                  {events.length > 0 && (
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm flex items-center gap-1.5">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                          {format(day, 'd MMMM yyyy', { locale: getDateFnsLocale(i18n.language) })}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {events.length} événement{events.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
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
                                <CardContent className="p-3">
                                  <div className="flex items-start gap-3">
                                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${getEventTypeColor(event.event_type).split(' ')[0]}`}>
                                      <TypeIcon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <Badge className={`mb-1 text-[10px] ${getEventTypeColor(event.event_type)}`}>
                                        {t(`public.eventTypes.${event.event_type}`)}
                                      </Badge>
                                      <h5 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                        {event.title}
                                      </h5>
                                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                      {event.location && (
                                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                                          <MapPin className="h-3 w-3" />
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
  );
}
