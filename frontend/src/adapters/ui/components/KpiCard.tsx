import React from 'react';
import { cn } from '../utils/cn';

interface KpiCardProps {
    label: string;
    value: string | number;
    unit?: string;
    trend?: {
        value: number;
        label: string;
        positiveIsGood?: boolean;
    };
    className?: string;
}

export function KpiCard({ label, value, unit, trend, className }: KpiCardProps) {
    const isTrendGood = trend
        ? trend.positiveIsGood
            ? trend.value >= 0
            : trend.value <= 0
        : null;

    return (
        <div className={cn("bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6", className)}>
            <dt className="text-sm font-medium text-gray-500 truncate" aria-label={label}>{label}</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900 tracking-tight">
                {value}
                {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
            </dd>
            {trend && (
                <dd className="mt-2 flex items-baseline text-sm">
                    <span
                        className={cn(
                            "font-medium",
                            isTrendGood ? "text-green-600" : "text-red-600"
                        )}
                    >
                        {trend.value > 0 ? '+' : ''}{trend.value}%
                    </span>
                    <span className="ml-2 text-gray-500">{trend.label}</span>
                </dd>
            )}
        </div>
    );
}
