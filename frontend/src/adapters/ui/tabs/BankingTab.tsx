import React, { useState } from 'react';
import { useBanking } from '../hooks/useBanking';
import { KpiCard } from '../components/KpiCard';
import { DataTable } from '../components/DataTable';
import type { Column } from '../components/DataTable';

interface BankingRecord {
    id: string;
    year: number;
    createdAt: string;
    amountGco2eq: number;
}

function AmountCell({ row }: Readonly<{ row: BankingRecord }>) {
    const positive = row.amountGco2eq > 0;
    return (
        <span className={positive ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
            {positive ? '+' : ''}{row.amountGco2eq.toLocaleString()}
        </span>
    );
}

const bankingColumns: Column<BankingRecord>[] = [
    { header: 'Date', cell: (r) => new Date(r.createdAt).toLocaleString() },
    { header: 'Year', cell: (r) => String(r.year) },
    { header: 'Amount (gCO₂e)', cell: (r) => <AmountCell row={r} /> },
];

export function BankingTab() {
    const { records, cbData, loading, error, fetchData, bankSurplus, applyBanked } = useBanking();
    const [year, setYear] = useState('2024');
    const [shipId, setShipId] = useState('R002');
    const [applyAmount, setApplyAmount] = useState('');

    const handleFetch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData(shipId, Number(year));
    };

    const handleBank = () => {
        if (cbData?.cb > 0) {
            bankSurplus(shipId, Number(year));
        }
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        if (applyAmount && Number(applyAmount) > 0) {
            applyBanked(shipId, Number(year), Number(applyAmount));
            setApplyAmount('');
        }
    };

    const totalBanked = records.reduce((sum, r) => sum + r.amountGco2eq, 0);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Article 20 — Banking & Applying</h2>

            <form onSubmit={handleFetch} className="flex gap-4 items-end bg-white p-4 rounded-lg shadow">
                <div>
                    <label htmlFor="banking-year" className="block text-sm font-medium text-gray-700">Year</label>
                    <select id="banking-year" value={year} onChange={e => setYear(e.target.value)} className="mt-1 block w-40 pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="banking-ship-id" className="block text-sm font-medium text-gray-700">Ship ID</label>
                    <input id="banking-ship-id" type="text" value={shipId} onChange={e => setShipId(e.target.value)} className="mt-1 flex-1 min-w-[200px] border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <button type="submit" disabled={loading} className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                    Load Data
                </button>
            </form>

            {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">Error: {error.message}</div>}

            {cbData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCard label="CB Before" value={cbData.cb.toLocaleString(undefined, { maximumFractionDigits: 2 })} unit="gCO₂e" />
                    <KpiCard label="Available Banked" value={totalBanked.toLocaleString(undefined, { maximumFractionDigits: 2 })} unit="gCO₂e" />
                    <KpiCard label="Adjusted CB" value={cbData.adjustedCb.toLocaleString(undefined, { maximumFractionDigits: 2 })} unit="gCO₂e" />
                </div>
            )}

            {cbData && (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-white shadow rounded-lg p-6 flex-1 border-l-4 border-blue-500">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Bank Surplus</h3>
                        <p className="text-sm text-gray-500 mb-4">Bank your current positive Compliance Balance for future use.</p>
                        <button
                            onClick={handleBank}
                            disabled={loading || cbData.cb <= 0}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400"
                        >
                            Bank Surplus ({cbData.cb > 0 ? cbData.cb.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0})
                        </button>
                    </div>

                    <form onSubmit={handleApply} className="bg-white shadow rounded-lg p-6 flex-1 border-l-4 border-orange-500">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Apply Banked Data</h3>
                        <p className="text-sm text-gray-500 mb-4">Consume banked surplus to cover a current deficit.</p>
                        <div className="flex gap-2">
                            <input type="number" step="0.01" value={applyAmount} onChange={e => setApplyAmount(e.target.value)} placeholder="Amount to apply" className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border py-2 px-3" />
                            <button
                                type="submit"
                                disabled={loading || !applyAmount || Number(applyAmount) <= 0 || Number(applyAmount) > totalBanked || cbData.adjustedCb >= 0}
                                className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:bg-gray-400"
                            >
                                Apply
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {records.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Banking History</h3>
                    <DataTable
                        data={records}
                        rowKey={r => r.id}
                        columns={bankingColumns}
                    />
                </div>
            )}
        </div>
    );
}
