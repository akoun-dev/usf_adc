import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, Mail, Download } from 'lucide-react';
import { exportUsersToExcel } from '../utils/export-users-excel';
import { CsvImportDialog } from '../components/CsvImportDialog';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { RoleManager } from '../components/RoleManager';
import { UserStatusToggle } from '../components/UserStatusToggle';
import { InviteUserForm } from '@/features/invitations/components/InviteUserForm';
import type { AppRole } from '@/core/constants/roles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PageHero from '@/components/PageHero';

export default function UsersPage() {
  const { hasRole } = useAuth();
  const { data: users, isLoading } = useUsers();
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const isGlobalAdmin = hasRole('global_admin');
  const allowedRoles: AppRole[] = isGlobalAdmin
    ? ['public_external', 'point_focal', 'country_admin', 'global_admin']
    : ['public_external', 'point_focal'];

  const filtered = (users || []).filter((u) =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('users.title')}
        description={users ? `${users.length} ${t('nav.users').toLowerCase()}` : ''}
        icon={<Users className="h-6 w-6 text-secondary" />}
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20">
            <Link to="/invitations">
              <Mail className="h-4 w-4 mr-2" />
              {t('invitations.title')}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20"
            onClick={() => users && exportUsersToExcel(users)}
            disabled={!users?.length}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          {isGlobalAdmin && <CsvImportDialog />}
          <InviteUserForm />
        </div>
      </PageHero>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('users.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {t('users.noUsers')}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('users.user')}</TableHead>
                  <TableHead>{t('users.country')}</TableHead>
                  <TableHead>{t('users.roles')}</TableHead>
                  <TableHead>{t('users.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => {
                  const initials = (user.full_name || '?')
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-foreground">{user.full_name || t('users.noName')}</p>
                            <p className="text-xs text-muted-foreground">{user.language.toUpperCase()}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.country ? (
                          <Badge variant="outline" className="text-xs">
                            {user.country.code_iso} — {user.country.name_fr}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <RoleManager userId={user.id} currentRoles={user.roles} allowedRoles={allowedRoles} />
                      </TableCell>
                      <TableCell>
                        <UserStatusToggle userId={user.id} isActive={user.is_active} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
