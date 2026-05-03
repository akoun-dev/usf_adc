import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { NewsCategory } from '@/features/admin/types';

interface CategoryBadgeProps {
  category: NewsCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  
  const displayName = (category as any)[`name_${currentLang}`] || 
                    category.name_fr || 
                    category.name_en || 
                    category.slug;

  return (
    <Badge
      className={className}
      style={{ 
        backgroundColor: category.color || undefined,
        color: category.color ? getContrastColor(category.color) : undefined
      }}
    >
      {displayName}
    </Badge>
  );
}

function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white depending on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}