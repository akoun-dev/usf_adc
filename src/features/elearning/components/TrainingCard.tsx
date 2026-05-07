import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Calendar, 
    MapPin, 
    Video, 
    Users, 
    ChevronRight 
} from "lucide-react"
import { useTranslation } from "react-i18next"
import type { Training } from "../types"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"

interface TrainingCardProps {
    training: Training;
    onViewDetails?: (id: string) => void;
}

export function TrainingCard({ training, onViewDetails }: TrainingCardProps) {
    const { t, i18n } = useTranslation()
    const locale = i18n.language === 'fr' ? fr : enUS

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
            {training.image_url ? (
                <div className="h-48 overflow-hidden">
                    <img 
                        src={training.image_url} 
                        alt={training.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
            ) : (
                <div className="h-48 bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                </div>
            )}
            
            <CardHeader className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant={training.type === 'online' ? "secondary" : "default"}>
                        {training.type === 'online' ? (
                            <Video className="w-3 h-3 mr-1 inline" />
                        ) : (
                            <MapPin className="w-3 h-3 mr-1 inline" />
                        )}
                        {t(`elearning.${training.type}`)}
                    </Badge>
                    {training.capacity && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Users className="w-3 h-3 mr-1" />
                            {training.capacity}
                        </div>
                    )}
                </div>
                <CardTitle className="line-clamp-2 leading-tight">
                    {training.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                    {training.description}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                    {training.start_date && (
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {format(new Date(training.start_date), 'PPP', { locale })}
                        </div>
                    )}
                    {training.location && (
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {training.location}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter>
                <Button 
                    className="w-full group" 
                    onClick={() => onViewDetails?.(training.id)}
                >
                    {t('elearning.details')}
                    <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
            </CardFooter>
        </Card>
    );
}
