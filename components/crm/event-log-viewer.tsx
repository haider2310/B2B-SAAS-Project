'use client';

import { useState } from 'react';

interface InboundEvent {
    id: string;
    status: string;
    payload: any;
    error: string | null;
    createdAt: Date;
    resultStatus: string | null;
}

export function EventLogViewer({ initialEvents }: { initialEvents: InboundEvent[] }) {
    const [selectedEvent, setSelectedEvent] = useState<InboundEvent | null>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* List */}
            <div className="bg-white shadow rounded-lg overflow-y-auto border border-gray-200 col-span-1">
                <div className="p-4 border-b bg-gray-50 font-medium text-gray-700 sticky top-0">
                    Recent Events
                </div>
                <ul className="divide-y divide-gray-100">
                    {initialEvents.map(event => (
                        <li
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`p-4 cursor-pointer hover:bg-indigo-50 transition-colors ${selectedEvent?.id === event.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                        >
                            <div className="flex justify-between mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusColor(event.status)}`}>
                                    {event.status.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(event.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 truncate">
                                {event.id}
                            </div>
                            {event.error && (
                                <p className="text-xs text-red-600 mt-1 truncate">{event.error}</p>
                            )}
                        </li>
                    ))}
                    {initialEvents.length === 0 && (
                        <li className="p-8 text-center text-gray-400 text-sm">No events logged.</li>
                    )}
                </ul>
            </div>

            {/* Detail View */}
            <div className="bg-gray-900 shadow rounded-lg overflow-hidden col-span-2 border border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                    <h3 className="text-gray-200 font-mono text-sm">Payload Inspector</h3>
                    {selectedEvent && (
                        <span className="text-xs text-gray-500">{selectedEvent.id}</span>
                    )}
                </div>

                <div className="flex-1 overflow-auto p-4 font-mono text-xs">
                    {selectedEvent ? (
                        <>
                            <div className="mb-4">
                                <span className="text-gray-500 block mb-1 uppercase tracking-wider">Meta</span>
                                <div className="text-green-400">Status: {selectedEvent.status}</div>
                                <div className="text-blue-400">Timestamp: {new Date(selectedEvent.createdAt).toISOString()}</div>
                                {selectedEvent.resultStatus && <div className="text-yellow-400">Result: {selectedEvent.resultStatus}</div>}
                            </div>

                            <div className="mb-4">
                                <span className="text-gray-500 block mb-1 uppercase tracking-wider">Payload</span>
                                <pre className="text-gray-300 whitespace-pre-wrap">
                                    {JSON.stringify(selectedEvent.payload, null, 2)}
                                </pre>
                            </div>

                            {selectedEvent.error && (
                                <div>
                                    <span className="text-red-500 block mb-1 uppercase tracking-wider">Error</span>
                                    <pre className="text-red-400 whitespace-pre-wrap">{selectedEvent.error}</pre>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-600">
                            Select an event to inspect details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'processed': return 'bg-green-100 text-green-800';
        case 'failed': return 'bg-red-100 text-red-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}
