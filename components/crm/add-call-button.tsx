'use client';

import { useState, useEffect } from 'react';
import { createCall } from '@/app/actions/calls';
import { getContacts } from '@/app/actions/crm';
import { getDeals } from '@/app/actions/deals';

export function AddCallButton() {
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [type, setType] = useState<'INBOUND' | 'OUTBOUND' | 'MISSED'>('OUTBOUND');
    const [contactId, setContactId] = useState('');
    const [dealId, setDealId] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Data State
    const [contacts, setContacts] = useState<any[]>([]);
    const [deals, setDeals] = useState<any[]>([]);

    const fetchData = async () => {
        const [cData, dData] = await Promise.all([
            getContacts(),
            getDeals()
        ]);
        setContacts(cData);
        setDeals(dData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createCall({
                type,
                contactId: contactId || undefined,
                dealId: dealId || undefined,
                duration: duration ? parseInt(duration) * 60 : undefined, // Convert minutes to seconds
                notes
            });
            setIsOpen(false);
            // Reset form
            setNotes('');
            setDuration('');
            setContactId('');
            setDealId('');
        } catch (error) {
            console.error(error);
            alert('Failed to log call');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => {
                    setIsOpen(true);
                    fetchData();
                }}
                className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
                <span>📞</span> Log Call
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900">Log a Call</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Call Type */}
                    <div className="grid grid-cols-3 gap-2">
                        {(['OUTBOUND', 'INBOUND', 'MISSED'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`
                                    py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer
                                    ${type === t
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                                `}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Linked Entity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Contact</label>
                            <select
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
                                value={contactId}
                                onChange={(e) => setContactId(e.target.value)}
                            >
                                <option value="">Select Contact...</option>
                                {contacts.map(c => (
                                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Deal</label>
                            <select
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
                                value={dealId}
                                onChange={(e) => setDealId(e.target.value)}
                            >
                                <option value="">Select Deal...</option>
                                {deals.map(d => (
                                    <option key={d.id} value={d.id}>{d.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Duration (min)</label>
                            <input
                                type="number"
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                placeholder="0"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Notes</label>
                        <textarea
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm h-24 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Call summary..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? 'Saving...' : 'Save Log'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
