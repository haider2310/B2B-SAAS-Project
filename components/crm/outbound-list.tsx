'use client';

import { useState } from 'react';
import { createSubscription, deleteSubscription, triggerTestEvent } from '@/app/actions/outbound';

interface Subscription {
    id: string;
    name: string;
    url: string;
    eventTypes: any;
    enabled: boolean;
    _count: { outboundDeliveries: number };
}

const AVAILABLE_EVENTS = [
    'lead.created',
    'company.created',
    'deal.created',
    'deal.stage_changed',
    'contact.created'
];

export function OutboundList({ initialSubscriptions }: { initialSubscriptions: Subscription[] }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

    const handleCreate = async () => {
        if (!name || !url || selectedEvents.length === 0) return;

        try {
            const res = await createSubscription({ name, url, eventTypes: selectedEvents });
            if (res.success && res.sub) {
                // Ensure the new subscription has the expected structure including _count
                const newSub = {
                    ...res.sub,
                    _count: { outboundDeliveries: 0 }
                };
                setSubscriptions([newSub as any, ...subscriptions]);
                setIsCreating(false);
                resetForm();
            } else {
                alert(res.error || 'Failed to create subscription');
            }
        } catch (err) {
            console.error(err);
            alert('An unexpected error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subscription?')) return;
        setSubscriptions(prev => prev.filter(s => s.id !== id));
        await deleteSubscription(id);
    };

    const handleTest = async (id: string) => {
        alert('Triggering test event...');
        await triggerTestEvent(id);
        alert('Test event queued!');
    };

    const resetForm = () => {
        setName('');
        setUrl('');
        setSelectedEvents([]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Outbound Subscriptions</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                    + New Webhook
                </button>
            </div>

            {isCreating && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-fade-in space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name (e.g. 'Zapier - New Lead')"
                            className="border rounded px-3 py-2 text-sm w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="url"
                            placeholder="Target URL (https://...)"
                            className="border rounded px-3 py-2 text-sm w-full"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Trigger Events</label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_EVENTS.map(event => (
                                <button
                                    key={event}
                                    onClick={() => {
                                        if (selectedEvents.includes(event)) {
                                            setSelectedEvents(prev => prev.filter(e => e !== event));
                                        } else {
                                            setSelectedEvents(prev => [...prev, event]);
                                        }
                                    }}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                                        ${selectedEvents.includes(event)
                                            ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                >
                                    {event}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setIsCreating(false)} className="text-gray-500 text-sm">Cancel</button>
                        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded text-sm">Save Subscription</button>
                    </div>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md divide-y divide-gray-200">
                {subscriptions.map((sub) => (
                    <div key={sub.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                    {sub.name}
                                    {sub.enabled ? (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Active</span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">Inactive</span>
                                    )}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 font-mono">{sub.url}</p>
                                <div className="mt-2 flex gap-2">
                                    {(sub.eventTypes as string[]).map(t => (
                                        <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleTest(sub.id)} className="text-xs text-blue-600 hover:underline">
                                    Test
                                </button>
                                <button onClick={() => handleDelete(sub.id)} className="text-xs text-red-600 hover:underline">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                            Deliveries: {sub._count.outboundDeliveries}
                        </div>
                    </div>
                ))}
                {subscriptions.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No outbound subscriptions configured.
                    </div>
                )}
            </div>
        </div>
    );
}
