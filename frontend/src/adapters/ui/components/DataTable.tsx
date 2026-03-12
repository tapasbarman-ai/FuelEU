import React, { useState } from 'react';

interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    rowKey: (item: T) => string;
    rowClassName?: (item: T) => string;
}

export function DataTable<T>({ data, columns, rowKey, rowClassName }: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: keyof T | undefined, sortable: boolean | undefined) => {
        if (!key || sortable === false) return;
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="overflow-x-auto ring-1 ring-gray-300 sm:rounded-lg mb-6">
            <table className="min-w-full divide-y divide-gray-300" aria-label="Data Table">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                scope="col"
                                className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 ${col.sortable !== false && col.accessorKey ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                onClick={() => handleSort(col.accessorKey, col.sortable)}
                            >
                                {col.header}
                                {sortKey === col.accessorKey && (
                                    <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {sortedData.map((item) => (
                        <tr key={rowKey(item)} className={rowClassName ? rowClassName(item) : undefined}>
                            {columns.map((col, idx) => (
                                <td key={idx} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                                    {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
