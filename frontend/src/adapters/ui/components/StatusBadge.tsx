import React from 'react';
import { cn } from '../utils/cn';

interface StatusBadgeProps {
    status: 'compliant' | 'non-compliant' | 'surplus' | 'deficit';
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const map = {
        'compliant': { label: '✅ Compliant', className: 'bg-green-100 text-green-800' },
        'non-compliant': { label: '❌ Non-Compliant', className: 'bg-red-100 text-red-800' },
        'surplus': { label: 'SURPLUS', className: 'bg-blue-100 text-blue-800' },
        'deficit': { label: 'DEFICIT', className: 'bg-orange-100 text-orange-800' },
    };

    const { label, className } = map[status];

    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", className)} aria-label={label}>
            {label}
        </span>
    );
}
