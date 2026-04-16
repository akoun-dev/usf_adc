import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Settings, LogOut, BellRing, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserProfile } from '@/core/types/profile';

interface UserMenuProps {
  profile: UserProfile | null;
  email: string | undefined;
  roleLabel: string;
  onSignOut: () => void;
}

export function UserMenu({ profile, email, roleLabel, onSignOut }: UserMenuProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayName = profile?.full_name ?? email ?? '?';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="border-t border-sidebar-border p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent/50">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {profile?.full_name ?? email}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">{roleLabel}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-sidebar-foreground/50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t('nav.myAccount')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <Settings className="mr-2 h-4 w-4" />
            {t('nav.profile')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/notifications/settings')}>
            <BellRing className="mr-2 h-4 w-4" />
            {t('nav.alertSettings', 'Alertes')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSignOut} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            {t('nav.signOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
