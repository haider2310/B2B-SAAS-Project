'use client';

import { useState, useEffect } from 'react';
import { updateLeadStatus } from '@/app/actions/crm';
import { exportLeadsToCSV } from '@/app/actions/export';

interface Lead {
    id: string;
    name: string | null;
    email: string | null;
    status: string;
    company?: { name: string } | null;
    createdAt: Date;
}

export function LeadTable({ initialLeads }: { initialLeads: Lead[] }) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [search, setSearch] = useState('');

    // Sync state with props when server validation occurs
    useEffect(() => {
        setLeads(initialLeads);
    }, [initialLeads]);

    const filteredLeads = leads
        .filter(l =>
            l.name?.toLowerCase().includes(search.toLowerCase()) ||
            l.email?.toLowerCase().includes(search.toLowerCase())
        );

    const handleStatusChange = async (id: string, newStatus: string) => {
        // Optimistic update
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));

        const res = await updateLeadStatus(id, newStatus);
        if (!res.success) {
            // Revert on failure (or show toast)
            console.error('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-600/20';
            case 'CONTACTED': return 'bg-indigo-50 text-indigo-700 border-indigo-100 ring-indigo-600/20';
            case 'QUALIFIED': return 'bg-purple-50 text-purple-700 border-purple-100 ring-purple-600/20';
            case 'PROPOSAL': return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-600/20';
            case 'NEGOTIATION': return 'bg-orange-50 text-orange-700 border-orange-100 ring-orange-600/20';
            case 'WON': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-600/20';
            case 'LOST': return 'bg-red-50 text-red-700 border-red-100 ring-red-600/20';
            default: return 'bg-slate-50 text-slate-700 border-slate-100 ring-slate-600/20';
        }
    };

    const handleExport = async () => {
        const csv = await exportLeadsToCSV();
        if (!csv) return alert('No data to export');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:bg-slate-700 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Export
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer">
                                        {lead.name || 'Unnamed'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{lead.email}</td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{lead.company?.name || '-'}</td>
                                <td className="px-6 py-4">
                                    <div className="relative inline-block text-left">
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            className={`
                                                appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 dark:ring-offset-slate-800
                                                ${getStatusColor(lead.status)}
                                            `}
                                        >
                                            <option value="NEW">New</option>
                                            <option value="CONTACTED">Contacted</option>
                                            <option value="QUALIFIED">Qualified</option>
                                            <option value="PROPOSAL">Proposal</option>
                                            <option value="NEGOTIATION">Negotiation</option>
                                            <option value="WON">Won</option>
                                            <option value="LOST">Lost</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-400 text-xs font-mono">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {filteredLeads.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <p>No leads found matching "{search}"</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
