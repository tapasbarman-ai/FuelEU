import React, { useState } from 'react';
import { usePooling } from '../hooks/usePooling';
import { complianceApi } from '../../infrastructure/api';

interface MemberRow {
    shipId: string;
    currentCb: number | null;
    loading: boolean;
}

export function PoolingTab() {
    const { createPool, loading, error, poolResult } = usePooling();
    const [year, setYear] = useState('2024');
    const [members, setMembers] = useState<MemberRow[]>([
        { shipId: 'R001', currentCb: null, loading: false },
        { shipId: 'R002', currentCb: null, loading: false },
    ]);

    const loadCbForShip = async (index: number, shipId: string) => {
        if (!shipId) return;
        setMembers(prev => {
            const next = [...prev];
            next[index] = { ...next[index], loading: true };
            return next;
        });
        try {
            const data = await complianceApi.getCb(shipId, Number(year));
            setMembers(prev => {
                const next = [...prev];
                next[index] = { ...next[index], currentCb: data.cb, loading: false };
                return next;
            });
        } catch {
            setMembers(prev => {
                const next = [...prev];
                next[index] = { ...next[index], currentCb: null, loading: false };
                return next;
            });
        }
    };

    const handleShipIdChange = (index: number, val: string) => {
        setMembers(prev => {
            const next = [...prev];
            next[index] = { ...next[index], shipId: val, currentCb: null };
            return next;
        });
    };

    const handleBlur = (index: number) => {
        loadCbForShip(index, members[index].shipId);
    };

    const addRow = () => {
        setMembers(prev => [...prev, { shipId: '', currentCb: null, loading: false }]);
    };

    const removeRow = (index: number) => {
        setMembers(prev => prev.filter((_, i) => i !== index));
    };

    const totalCb = members.reduce((sum, m) => sum + (m.currentCb ?? 0), 0);
    const allCbsLoaded = members.every(m => m.currentCb !== null && m.shipId !== '');
    const poolValid = totalCb >= 0 && allCbsLoaded && members.length >= 1;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!poolValid) return;
        createPool(Number(year), members.map(m => ({ shipId: m.shipId })));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Article 21 — Compliance Pooling</h2>
            <p className="text-sm text-gray-500">
                Add ships to a pool. The backend automatically runs the <strong>greedy allocation algorithm</strong> — 
                surplus ships transfer credits to deficit ships. Pool sum must be ≥ 0.
            </p>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Pool Year</label>
                    <select value={year} onChange={e => setYear(e.target.value)} className="mt-1 block w-40 pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </div>

                {/* Member table */}
                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-700 pb-2 border-b">
                        <div>Ship ID</div>
                        <div>Current CB (gCO₂e)</div>
                        <div></div>
                    </div>
                    {members.map((m, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-4 items-center">
                            <input
                                type="text"
                                placeholder="e.g. R001"
                                value={m.shipId}
                                onChange={e => handleShipIdChange(idx, e.target.value)}
                                onBlur={() => handleBlur(idx)}
                                className="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <div className={`p-2 font-medium text-sm ${
                                m.loading ? 'text-gray-400 italic' :
                                m.currentCb === null ? 'text-gray-400 italic' :
                                m.currentCb < 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                                {m.loading ? 'Loading...' :
                                 m.currentCb === null ? 'Enter ship ID above' :
                                 `${m.currentCb > 0 ? '+' : ''}${m.currentCb.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                            </div>
                            <button type="button" onClick={() => removeRow(idx)} className="text-red-500 hover:text-red-700 text-sm font-medium text-left">
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addRow} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        + Add Ship
                    </button>
                </div>

                {/* Pool summary */}
                <div className={`p-4 rounded-md mb-6 flex justify-between items-center ${
                    allCbsLoaded
                        ? totalCb >= 0 ? 'bg-green-50 border-green-200 border' : 'bg-red-50 border-red-200 border'
                        : 'bg-gray-50 border-gray-200 border'
                }`}>
                    <span className="font-semibold text-sm">Pool Sum (must be ≥ 0 to proceed):</span>
                    <span className={`text-lg font-bold ${
                        !allCbsLoaded ? 'text-gray-500' :
                        totalCb >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                        {!allCbsLoaded ? 'Load all ship CBs first' :
                         `${totalCb >= 0 ? '✅ Surplus/Balanced' : '❌ Deficit'} (${totalCb.toLocaleString(undefined, { maximumFractionDigits: 0 })})`}
                    </span>
                </div>

                {!allCbsLoaded && members.length > 0 && (
                    <p className="text-yellow-600 text-sm mb-4">⚠️ Load CB for all ships before creating the pool (click into each Ship ID field and press Tab).</p>
                )}

                {!poolValid && allCbsLoaded && totalCb < 0 && (
                    <p className="text-red-600 text-sm mb-4">❌ Pool total CB is negative. Add more surplus ships or remove deficit ships.</p>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                        API Error: {error.message}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading || !poolValid}
                    className="w-full sm:w-auto py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    {loading ? 'Creating Pool...' : '🤝 Create Compliance Pool'}
                </button>
            </div>

            {/* Pool result */}
            {poolResult && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-700 mb-4">
                        ✅ Pool Created! ID: <span className="font-mono text-sm">{poolResult.id}</span>
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border rounded">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Ship ID</th>
                                    <th className="px-4 py-2 text-right font-semibold text-gray-700">CB Before</th>
                                    <th className="px-4 py-2 text-right font-semibold text-gray-700">CB After (Greedy)</th>
                                    <th className="px-4 py-2 text-right font-semibold text-gray-700">Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {poolResult.members.map((m: { shipId: string; cbBefore: number; cbAfter: number }) => (
                                    <tr key={m.shipId} className="border-t">
                                        <td className="px-4 py-2 font-mono">{m.shipId}</td>
                                        <td className={`px-4 py-2 text-right font-semibold ${m.cbBefore < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {m.cbBefore.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                        <td className={`px-4 py-2 text-right font-semibold ${m.cbAfter < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {m.cbAfter.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                        <td className={`px-4 py-2 text-right ${m.cbAfter - m.cbBefore >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                            {m.cbAfter - m.cbBefore >= 0 ? '+' : ''}
                                            {(m.cbAfter - m.cbBefore).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
