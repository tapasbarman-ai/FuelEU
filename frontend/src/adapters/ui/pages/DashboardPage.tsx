import React, { useState } from 'react';
import { RoutesTab } from '../tabs/RoutesTab';
import { CompareTab } from '../tabs/CompareTab';
import { BankingTab } from '../tabs/BankingTab';
import { PoolingTab } from '../tabs/PoolingTab';
import { Ship, BarChart3, Coins, Users } from 'lucide-react';
import { cn } from '../utils/cn';

const TABS = [
    { id: 'routes', name: 'Routes', icon: Ship },
    { id: 'compare', name: 'Compare', icon: BarChart3 },
    { id: 'banking', name: 'Banking', icon: Coins },
    { id: 'pooling', name: 'Pooling', icon: Users },
];

export function DashboardPage() {
    const [activeTab, setActiveTab] = useState('routes');

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Ship className="h-8 w-8 text-blue-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">FuelEU Platform</span>
                            </div>
                            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                activeTab === tab.id
                                                    ? 'border-blue-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                                            )}
                                        >
                                            <Icon className="mr-2 h-5 w-5" />
                                            {tab.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {activeTab === 'routes' && <RoutesTab />}
                    {activeTab === 'compare' && <CompareTab />}
                    {activeTab === 'banking' && <BankingTab />}
                    {activeTab === 'pooling' && <PoolingTab />}
                </div>
            </main>
        </div>
    );
}
