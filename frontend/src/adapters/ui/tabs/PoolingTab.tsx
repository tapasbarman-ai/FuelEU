import React, { useState } from 'react';
import { usePooling } from '../hooks/usePooling';
import { complianceApi } from '../../infrastructure/api';

export function PoolingTab() {
    const { createPool, loading, error, poolResult, validationErrors } = usePooling();
    const [year, setYear] = useState('2024');
    const [members, setMembers] = useState<Array<{ shipId: string, currentCb: number, allocationCb: string }>>([
        { shipId: 'R001', currentCb: 0, allocationCb: '0' },
    ]);

    const loadCbForShip = async (index: number, shipId: string) => {
        try {
            const data = await complianceApi.getCb(shipId, Number(year));
            setMembers(prev => {
                const next = [...prev];
                next[index] = { ...next[index], currentCb: data.cb };
                return next;
            });
        } catch {
            // ignore
        }
    };

    const handleShipIdChange = (index: number, val: string) => {
        setMembers(prev => {
            const next = [...prev];
            next[index] = { ...next[index], shipId: val };
            return next;
        });
    };

    const handleBlur = (index: number) => {
        const shipId = members[index].shipId;
        if (shipId) {
            loadCbForShip(index, shipId);
        }
    };

    const handleAllocChange = (index: number, val: string) => {
        setMembers(prev => {
            const next = [...prev];
            next[index] = { ...next[index], allocationCb: val };
            return next;
        });
    };

    const addRow = () => {
        setMembers(prev => [...prev, { shipId: '', currentCb: 0, allocationCb: '0' }]);
    };

    const removeRow = (index: number) => {
        setMembers(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createPool(Number(year), members.map(m => ({ shipId: m.shipId, currentCb: m.currentCb, allocationCb: Number(m.allocationCb) })));
    };

    const poolSum = members.reduce((sum, m) => sum + Number(m.allocationCb || 0), 0);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Article 21 — Pooling</h2>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Pool Year</label>
                    <select value={year} onChange={e => setYear(e.target.value)} className="mt-1 block w-40 pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-700 pb-2 border-b">
                        <div>Ship ID</div>
                        <div>Current CB</div>
                        <div>Proposed Allocation CB</div>
                        <div></div>
                    </div>
                    {members.map((m, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-4 items-center">
                            <input
                                type="text"
                                placeholder="R001"
                                value={m.shipId}
                                onChange={e => handleShipIdChange(idx, e.target.value)}
                                onBlur={() => handleBlur(idx)}
                                className="border border-gray-300 rounded p-2 focus:ring-blue-500"
                            />
                            <div className={`p-2 font-medium ${m.currentCb < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {m.currentCb !== 0 ? m.currentCb.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'Load base...'}
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                value={m.allocationCb}
                                onChange={e => handleAllocChange(idx, e.target.value)}
                                className="border border-gray-300 rounded p-2 focus:ring-blue-500"
                            />
                            <button type="button" onClick={() => removeRow(idx)} className="text-red-500 hover:text-red-700 font-medium">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addRow} className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Add Ship</button>
                </div>

                <div className={`p-4 rounded-md mb-6 flex justify-between items-center ${poolSum >= 0 ? 'bg-green-50 border-green-200 border' : 'bg-red-50 border-red-200 border'}`}>
                    <span className="font-semibold">Expected Pool Sum (Conservation check):</span>
                    <span className={`text-lg font-bold ${poolSum >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {poolSum >= 0 ? 'Surplus/Balanced' : 'Deficit'} ({poolSum.toLocaleString()})
                    </span>
                </div>

                {validationErrors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                        <h4 className="font-semibold mb-2">Validation Errors:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            {validationErrors.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                        API Error: {error.message}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading || members.length < 1}
                    className="w-full sm:w-auto py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Pool'}
                </button>

                {poolResult && (
                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-green-700 mb-2">Pool Created Successfully! ID: {poolResult.id}</h3>
                        <div className="bg-gray-50 p-4 rounded-md border text-sm overflow-auto">
                            {JSON.stringify(poolResult.members, null, 2)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
