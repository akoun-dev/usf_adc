import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import type { ForumCategory } from '../types';

interface CategoryFilterProps {
  categories: ForumCategory[];
  selected: string | undefined;
  onSelect: (id: string | undefined) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={!selected ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => onSelect(undefined)}
      >
        {t('forum.all')}
      </Badge>
      {categories.map((cat) => (
        <Badge
          key={cat.id}
          variant={selected === cat.id ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </Badge>
      ))}
    </div>
  );
}
