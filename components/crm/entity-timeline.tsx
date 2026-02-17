'use client';

interface TimelineEvent {
    id: string;
    type: 'CALL' | 'NOTE' | 'TASK' | 'ACTIVITY';
    title: string;
    description?: string | null;
    date: Date;
    user: { name: string | null; image: string | null };
}

export function EntityTimeline({ events }: { events: TimelineEvent[] }) {
    if (events.length === 0) {
        return <div className="text-gray-500 text-sm italic">No history available.</div>;
    }

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {events.map((event, eventIdx) => (
                    <li key={event.id}>
                        <div className="relative pb-8">
                            {eventIdx !== events.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                                        ${event.type === 'CALL' ? 'bg-blue-500' :
                                            event.type === 'NOTE' ? 'bg-yellow-500' :
                                                event.type === 'TASK' ? 'bg-green-500' : 'bg-gray-400'}
                                    `}>
                                        <span className="text-white text-xs">
                                            {event.type === 'CALL' ? '📞' :
                                                event.type === 'NOTE' ? '📝' :
                                                    event.type === 'TASK' ? '✅' : 'ℹ️'}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium text-gray-900">{event.title}</span>
                                        </p>
                                        {event.description && (
                                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                                        )}
                                    </div>
                                    <div className="text-right text-sm text-gray-500 whitespace-nowrap">
                                        <time dateTime={event.date.toISOString()}>{new Date(event.date).toLocaleDateString()}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
