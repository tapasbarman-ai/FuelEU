import React from 'react';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterProps {
    id: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (val: string) => void;
}

export function FilterBar({ filters }: { filters: FilterProps[] }) {
    return (
        <div className="flex flex-wrap gap-4 p-4 bg-white shadow rounded-lg mb-6" aria-label="Filter Bar">
            {filters.map(f => (
                <div key={f.id} className="flex flex-col">
                    <label htmlFor={f.id} className="block text-sm font-medium text-gray-700">{f.label}</label>
                    <select
                        id={f.id}
                        value={f.value}
                        onChange={(e) => f.onChange(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                        aria-label={f.label}
                    >
                        <option value="">All</option>
                        {f.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
}
