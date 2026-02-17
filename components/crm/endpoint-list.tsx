'use client';

import { useState } from 'react';
import { createInboundEndpoint, rotateEndpointSecret, toggleEndpointStatus } from '@/app/actions/automation';

interface Endpoint {
    id: string;
    name: string;
    endpointKey: string;
    isActive: boolean;
    authType: string;
    _count: { inboundEvents: number };
    createdAt: Date;
}

export function EndpointList({ initialEndpoints, tenantSlug }: { initialEndpoints: Endpoint[], tenantSlug: string }) {
    const [endpoints, setEndpoints] = useState<Endpoint[]>(initialEndpoints);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');

    const handleCreate = async () => {
        if (!newName) return;
        try {
            const res = await createInboundEndpoint({ name: newName });
            if (res.success && res.endpoint) {
                // Ensure the new endpoint has the expected structure including _count
                const newEndpoint = {
                    ...res.endpoint,
                    _count: { inboundEvents: 0 }
                };
                setEndpoints([newEndpoint as any, ...endpoints]); // Optimistic-ish add
                setIsCreating(false);
                setNewName('');
            } else {
                alert(res.error || 'Failed to create endpoint');
            }
        } catch (err) {
            console.error(err);
            alert('An unexpected error occurred');
        }
    };

    const copyUrl = (key: string) => {
        const url = `${window.location.origin}/api/inbound/${tenantSlug}/${key}`;
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Inbound Endpoints</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                    + New Endpoint
                </button>
            </div>

            {isCreating && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4 items-center animate-fade-in">
                    <input
                        type="text"
                        placeholder="Endpoint Name (e.g., 'Website Contact Form')"
                        className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button
                        onClick={handleCreate}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setIsCreating(false)}
                        className="text-gray-500 text-sm hover:text-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md divide-y divide-gray-200">
                {endpoints.map((endpoint) => (
                    <div key={endpoint.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-sm font-medium text-gray-900">{endpoint.name}</h3>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${endpoint.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {endpoint.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500 gap-4">
                                <span>🔑 Key: ...{endpoint.endpointKey.slice(-4)}</span>
                                <a href={`/dashboard/automation/inbound/${endpoint.id}`} className="hover:text-indigo-600 hover:underline">
                                    📥 Events: {endpoint._count.inboundEvents}
                                </a>
                                <span>🔒 Auth: {endpoint.authType}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => copyUrl(endpoint.endpointKey)}
                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                                Copy URL
                            </button>
                            <a
                                href={`/dashboard/automation/inbound/${endpoint.id}`}
                                className="text-gray-400 hover:text-gray-600"
                                title="View Logs"
                            >
                                📜
                            </a>
                        </div>
                    </div>
                ))}
                {endpoints.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No endpoints created yet.
                    </div>
                )}
            </div>
        </div>
    );
}
