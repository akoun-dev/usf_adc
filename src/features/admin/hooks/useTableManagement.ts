import { useState, useMemo } from 'react';

export type SortOrder = 'asc' | 'desc';

export interface ColumnConfig<T> {
    key: keyof T;
    label: string;
    sortable: boolean;
}

export interface UseTableManagementProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    initialSortField?: keyof T;
    initialSortOrder?: SortOrder;
    itemsPerPageOptions?: number[];
    initialItemsPerPage?: number;
}

export function useTableManagement<T>({
    data,
    columns,
    initialSortField,
    initialSortOrder = 'asc',
    itemsPerPageOptions = [5, 10, 20, 50],
    initialItemsPerPage = 10,
}: UseTableManagementProps<T>) {
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof T>(initialSortField || columns.find(c => c.sortable)?.key || columns[0].key);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filtered = [...data];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => {
                return columns.some(column => {
                    const value = item[column.key];
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(query);
                    }
                    if (typeof value === 'number') {
                        return value.toString().includes(query);
                    }
                    if (value && typeof value === 'object' && 'name' in value) {
                        return String(value.name).toLowerCase().includes(query);
                    }
                    return false;
                });
            });
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            // Handle nested objects (like country.name)
            const getValue = (val: any) => {
                if (val && typeof val === 'object' && 'name' in val) {
                    return val.name || '';
                }
                return val || '';
            };

            const finalA = getValue(aValue);
            const finalB = getValue(bValue);

            if (sortOrder === 'asc') {
                return String(finalA).localeCompare(String(finalB));
            } else {
                return String(finalB).localeCompare(String(finalA));
            }
        });

        return filtered;
    }, [data, searchQuery, sortField, sortOrder, columns]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedData, currentPage, itemsPerPage]);

    const handleSort = (field: keyof T) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    // Reset pagination when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, itemsPerPage]);

    return {
        searchQuery,
        setSearchQuery,
        sortField,
        sortOrder,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        filteredAndSortedData,
        paginatedData,
        totalPages,
        handleSort,
        resetFilters,
        itemsPerPageOptions,
    };
}

export function useExportToCSV<T>(
    data: T[],
    columns: ColumnConfig<T>[],
    filename: string = 'export'
) {
    const handleExport = () => {
        // Extract headers
        const headers = columns.map(col => col.label);

        // Extract data rows
        const rows = data.map(item => {
            return columns.map(col => {
                const value = item[col.key];
                if (value && typeof value === 'object' && 'name' in value) {
                    return `"${value.name || ''}"`;
                }
                return `"${String(value || '').replace(/"/g, '""')}"`;
            });
        });

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return { handleExport };
}
