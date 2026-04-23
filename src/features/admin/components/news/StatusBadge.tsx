import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NewsStatus } from '../../types';
import { Clock, CheckCircle2, Archive, FileText } from 'lucide-react';

interface StatusBadgeProps {
  status: NewsStatus;
  className?: string;
}

const statusConfig: Record<NewsStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ReactNode;
}> = {
  draft: {
    label: 'Draft',
    variant: 'outline',
    icon: <FileText className="h-3 w-3" />,
  },
  in_review: {
    label: 'In Review',
    variant: 'secondary',
    icon: <Clock className="h-3 w-3" />,
  },
  published: {
    label: 'Published',
    variant: 'default',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  archived: {
    label: 'Archived',
    variant: 'destructive',
    icon: <Archive className="h-3 w-3" />,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;
  
  return (
    <Badge variant={config.variant} className={className}>
      <span className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </span>
    </Badge>
  );
}