import { Switch } from '@/components/ui/switch';
import { useToggleUserActive } from '../hooks/useToggleUserActive';

interface UserStatusToggleProps {
  userId: string;
  isActive: boolean;
}

export function UserStatusToggle({ userId, isActive }: UserStatusToggleProps) {
  const toggleMutation = useToggleUserActive();

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onCheckedChange={(checked) =>
          toggleMutation.mutate({ userId, isActive: checked })
        }
        disabled={toggleMutation.isPending}
      />
      <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
        {isActive ? 'Actif' : 'Inactif'}
      </span>
    </div>
  );
}
