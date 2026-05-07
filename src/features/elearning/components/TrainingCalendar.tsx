import { useState } from "react"
import { 
    ChevronLeft, 
    ChevronRight, 
    Video, 
    MapPin 
} from "lucide-react"
import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    isSameMonth, 
    isSameDay, 
    eachDayOfInterval, 
    isToday 
} from "date-fns"
import { fr, enUS } from "date-fns/locale"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TrainingEvent } from "../types"

interface TrainingCalendarProps {
    events: TrainingEvent[];
    onEventClick?: (event: TrainingEvent) => void;
}

export function TrainingCalendar({ events, onEventClick }: TrainingCalendarProps) {
    const { i18n } = useTranslation()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const locale = i18n.language === 'fr' ? fr : enUS

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { locale })
    const endDate = endOfWeek(monthEnd, { locale })

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale })}
                </h2>
                <div className="flex gap-1">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 border-b">
                {['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground uppercase">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {days.map((day, idx) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.start_date), day))
                    const isCurrentMonth = isSameMonth(day, monthStart)

                    return (
                        <div 
                            key={idx} 
                            className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                                !isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : ''
                            } ${isToday(day) ? 'bg-primary/5' : ''}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${
                                    isToday(day) ? 'bg-primary text-primary-foreground' : ''
                                }`}>
                                    {format(day, 'd')}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {dayEvents.map(event => (
                                    <div 
                                        key={event.id}
                                        onClick={() => onEventClick?.(event)}
                                        className="text-[10px] p-1 rounded bg-secondary/80 hover:bg-secondary cursor-pointer border border-secondary transition-colors"
                                    >
                                        <div className="font-semibold truncate">{event.title}</div>
                                        <div className="flex items-center gap-1 opacity-70">
                                            {event.type === 'online' ? <Video className="w-2 h-2" /> : <MapPin className="w-2 h-2" />}
                                            {format(new Date(event.start_date), 'HH:mm')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
