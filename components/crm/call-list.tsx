'use client';

interface Call {
    id: string;
    type: 'INBOUND' | 'OUTBOUND' | 'MISSED';
    duration: number | null;
    notes: string | null;
    createdAt: Date;
    createdBy: {
        name: string | null;
        image: string | null;
    };
    contact?: {
        firstName: string;
        lastName: string;
    } | null;
    deal?: {
        title: string;
    } | null;
}

export function CallList({ initialCalls }: { initialCalls: Call[] }) {
    if (initialCalls.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-lg border border-dashed border-gray-300">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📞</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No calls logged yet</h3>
                <p className="mt-1 text-sm text-gray-500">Log your first call to start tracking interactions.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-100">
                {initialCalls.map((call) => (
                    <li key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm
                                ${call.type === 'INBOUND' ? 'bg-emerald-100 text-emerald-600' :
                                    call.type === 'OUTBOUND' ? 'bg-blue-100 text-blue-600' :
                                        'bg-red-100 text-red-600'}
                            `}>
                                {call.type === 'INBOUND' ? '↙' : call.type === 'OUTBOUND' ? '↗' : '✕'}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {call.contact ? `${call.contact.firstName} ${call.contact.lastName}` :
                                                call.deal ? call.deal.title : 'Unknown Caller'}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Logged by {call.createdBy.name || 'Unknown'}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(call.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                {call.notes && (
                                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        "{call.notes}"
                                    </p>
                                )}

                                {call.duration && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            ⏱️ {Math.floor(call.duration / 60)}m {call.duration % 60}s
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
