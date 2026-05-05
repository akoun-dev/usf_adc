import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useContentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLangValue } from '@/types/i18n';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function EventsTab() {
  const { t, i18n } = useTranslation();
  const { data: events, isLoading } = useEvents();
  const deleteEvent = useDeleteEvent();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const handleEdit = (item: any) => {
    navigate(`/admin/events/${item.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ?'))) {
      await deleteEvent.mutateAsync(id);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return t('common.notAvailable', '-');
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusKeys: Record<string, string> = {
      draft: 'admin.event.draft',
      in_review: 'admin.event.inReview',
      published: 'admin.event.published',
      archived: 'admin.event.archived',
      cancelled: 'admin.event.cancelled',
    };
    const variants: Record<string, 'secondary' | 'outline' | 'default' | 'destructive'> = {
      draft: 'secondary',
      in_review: 'outline',
      published: 'default',
      archived: 'destructive',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{t(statusKeys[status] || status)}</Badge>;
  };

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    return events.filter(item => {
      const title = getLangValue(item.title, i18n.language)?.toLowerCase() || "";
      const location = getLangValue(item.location, i18n.language)?.toLowerCase() || "";
      
      const matchesSearch = title.includes(searchTerm.toLowerCase());
      const matchesLocation = location.includes(locationFilter.toLowerCase());
      
      let matchesDate = true;
      if (dateFilter) {
        const eventStart = item.start_date?.split('T')[0];
        const eventEnd = item.end_date?.split('T')[0];
        matchesDate = eventStart === dateFilter || eventEnd === dateFilter;
      }
      
      return matchesSearch && matchesLocation && matchesDate;
    });
  }, [events, searchTerm, locationFilter, dateFilter, i18n.language]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.eventsManagement')}</CardTitle>
            <CardDescription>{t('admin.eventsManagementDesc')}</CardDescription>
          </div>
          <Button onClick={() => navigate('/admin/events/new')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('common.add', 'Ajouter')}
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.searchByTitle', 'Rechercher par titre...')}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.searchByLocation', 'Filtrer par lieu...')}
              className="pl-8"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">N°</TableHead>
              <TableHead>{t('admin.event.title')}</TableHead>
              <TableHead>{t('admin.event.location')}</TableHead>
              <TableHead>{t('admin.event.startDate')}</TableHead>
              <TableHead>{t('admin.event.endDate')}</TableHead>
              <TableHead>{t('admin.event.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7}>{t('common.loading')}</TableCell></TableRow>
            ) : filteredEvents.length === 0 ? (
              <TableRow><TableCell colSpan={7}>{t('admin.noEvents')}</TableCell></TableRow>
            ) : (
              paginatedEvents.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground font-normal">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {getLangValue(item.title, i18n.language)}
                    </div>
                  </TableCell>
                  <TableCell>{getLangValue(item.location, i18n.language) || t('common.notAvailable', '-')}</TableCell>
                  <TableCell>{formatDate(item.start_date)}</TableCell>
                  <TableCell>{formatDate(item.end_date)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span>{t('admin.rowsPerPage', 'Lignes par page')}:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={(v) => {
                        setItemsPerPage(parseInt(v));
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <span className="whitespace-nowrap">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, filteredEvents.length)}-
                    {Math.min(currentPage * itemsPerPage, filteredEvents.length)} {t('admin.of', 'sur')} {filteredEvents.length}
                </span>
            </div>
            <Pagination className="w-auto m-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
