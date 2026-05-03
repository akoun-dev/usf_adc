import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NewsStatus, EventStatus } from '@/features/admin/types';
import { Clock, CheckCircle2, Archive, FileText, AlertCircle, PlayCircle, CheckCircle, Calendar } from 'lucide-react';

interface StatusBadgeProps {
  status: NewsStatus | EventStatus;
  className?: string;
}

const statusConfig: Record<string, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ReactNode;
}> = {
  draft: {
    label: 'Brouillon',
    variant: 'outline',
    icon: <FileText className="h-3 w-3" />,
  },
  in_review: {
    label: 'En révision',
    variant: 'secondary',
    icon: <Clock className="h-3 w-3" />,
  },
  published: {
    label: 'Publié',
    variant: 'default',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  archived: {
    label: 'Archivé',
    variant: 'destructive',
    icon: <Archive className="h-3 w-3" />,
  },
  upcoming: {
    label: 'À venir',
    variant: 'secondary',
    icon: <Calendar className="h-3 w-3" />,
  },
  ongoing: {
    label: 'En cours',
    variant: 'default',
    icon: <PlayCircle className="h-3 w-3" />,
  },
  completed: {
    label: 'Terminé',
    variant: 'secondary',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  cancelled: {
    label: 'Annulé',
    variant: 'destructive',
    icon: <AlertCircle className="h-3 w-3" />,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as string] || statusConfig.draft;
  
  return (
    <Badge variant={config.variant} className={className}>
      <span className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </span>
    </Badge>
  );
}