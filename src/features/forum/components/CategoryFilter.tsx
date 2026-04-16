import { Badge } from '@/components/ui/badge';
import type { ForumCategory } from '../types';

interface CategoryFilterProps {
  categories: ForumCategory[];
  selected: string | undefined;
  onSelect: (id: string | undefined) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={!selected ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => onSelect(undefined)}
      >
        Tous
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
