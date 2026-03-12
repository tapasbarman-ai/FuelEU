import React, { useEffect } from 'react';
import { useComparison } from '../hooks/useComparison';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { TARGET_INTENSITY } from '../../../shared/constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';

export function CompareTab() {
    const { comparison, loading, error, fetchComparison } = useComparison();

    useEffect(() => {
        fetchComparison();
    }, []);

    if (loading && !comparison.length) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Intensity Comparison</h2>

            <div className="bg-white p-6 rounded-lg shadow h-96">
                <h3 className="text-sm font-medium text-gray-700 mb-4">GHG Intensity vs Target ({TARGET_INTENSITY})</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="routeId" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <ReferenceLine y={TARGET_INTENSITY} stroke="red" strokeDasharray="5 5" label="Target" />
                        <Bar dataKey="ghgIntensity">
                            {comparison.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.compliant ? '#10b981' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <DataTable
                data={comparison}
                rowKey={c => c.routeId}
                columns={[
                    { header: 'Route ID', accessorKey: 'routeId' },
                    { header: 'Vessel Type', accessorKey: 'vesselType' },
                    { header: 'GHG Intensity', accessorKey: 'ghgIntensity' },
                    {
                        header: '% Diff (vs Baseline)',
                        cell: c => c.isBaseline ? <span className="text-gray-400 italic">Baseline</span> : (
                            <span className={c.percentDiff > 0 ? 'text-red-600' : 'text-green-600'}>
                                {c.percentDiff ? `${c.percentDiff > 0 ? '+' : ''}${c.percentDiff.toFixed(2)}%` : '-'}
                            </span>
                        )
                    },
                    {
                        header: 'Target Status',
                        cell: c => <StatusBadge status={c.compliant ? 'compliant' : 'non-compliant'} />
                    }
                ]}
            />
        </div>
    );
}
