import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppRole } from '@/core/constants/roles';

export interface NavItem {
  labelKey: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

export interface NavSection {
  titleKey: string;
  items: NavItem[];
}

interface SidebarNavProps {
  sections: NavSection[];
  roles: AppRole[];
  unreadCount: number;
  onNavigate: () => void;
}

export function SidebarNav({ sections, roles, unreadCount, onNavigate }: SidebarNavProps) {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
      {sections.map((section) => {
        const visibleItems = section.items.filter((item) =>
          item.roles.some((r) => roles.includes(r as AppRole))
        );

        if (visibleItems.length === 0) return null;

        return (
          <div key={section.titleKey} className="mb-3">
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {t(section.titleKey)}
            </p>
            <div className="space-y-0.5">
              {visibleItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/forum/groups' &&
                    item.path !== '/notifications' &&
                    location.pathname.startsWith(item.path) &&
                    item.path !== '/');
                const showBadge = item.path === '/notifications' && unreadCount > 0;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-primary'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{t(item.labelKey)}</span>
                    {showBadge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
