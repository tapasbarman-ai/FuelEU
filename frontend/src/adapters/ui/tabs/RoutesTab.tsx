import React, { useEffect, useState, useMemo } from 'react';
import { useRoutes } from '../hooks/useRoutes';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';

export function RoutesTab() {
    const { routes, loading, error, fetchRoutes, setBaseline } = useRoutes();
    const [vesselFilter, setVesselFilter] = useState('');
    const [fuelFilter, setFuelFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');

    useEffect(() => {
        fetchRoutes();
    }, []);

    const vesselOpts = useMemo(() => Array.from(new Set(routes.map(r => r.vesselType))).map(v => ({ label: v, value: v })), [routes]);
    const fuelOpts = useMemo(() => Array.from(new Set(routes.map(r => r.fuelType))).map(v => ({ label: v, value: v })), [routes]);
    const yearOpts = useMemo(() => Array.from(new Set(routes.map(r => r.year.toString()))).map(v => ({ label: v, value: v })), [routes]);

    const filtered = routes.filter(r => {
        if (vesselFilter && r.vesselType !== vesselFilter) return false;
        if (fuelFilter && r.fuelType !== fuelFilter) return false;
        if (yearFilter && r.year.toString() !== yearFilter) return false;
        return true;
    });

    if (loading && !routes.length) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Routes Configuration</h2>
            <FilterBar filters={[
                { id: 'vessel', label: 'Vessel Type', value: vesselFilter, onChange: setVesselFilter, options: vesselOpts },
                { id: 'fuel', label: 'Fuel Type', value: fuelFilter, onChange: setFuelFilter, options: fuelOpts },
                { id: 'year', label: 'Year', value: yearFilter, onChange: setYearFilter, options: yearOpts },
            ]} />
            <DataTable
                data={filtered}
                rowKey={r => r.id}
                rowClassName={r => r.isBaseline ? 'bg-blue-50/50' : ''}
                columns={[
                    { header: 'Route ID', accessorKey: 'routeId', sortable: true },
                    { header: 'Vessel', accessorKey: 'vesselType', sortable: true },
                    { header: 'Fuel', accessorKey: 'fuelType', sortable: true },
                    { header: 'Year', accessorKey: 'year', sortable: true },
                    { header: 'GHG Intensity', accessorKey: 'ghgIntensity', sortable: true },
                    { header: 'Fuel Con. (t)', accessorKey: 'fuelConsumption', sortable: true },
                    { header: 'Distance (nm)', accessorKey: 'distance', sortable: true },
                    { header: 'Total Env.', accessorKey: 'totalEmissions', sortable: true },
                    {
                        header: 'Actions',
                        cell: r => (
                            <button
                                disabled={r.isBaseline}
                                onClick={() => setBaseline(r.routeId)}
                                className={`px-3 py-1 text-xs font-semibold rounded shadow-sm ${r.isBaseline ? 'bg-blue-100 text-blue-700 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
                            >
                                {r.isBaseline ? 'Baseline' : 'Set Baseline'}
                            </button>
                        ),
                    }
                ]}
            />
        </div>
    );
}
