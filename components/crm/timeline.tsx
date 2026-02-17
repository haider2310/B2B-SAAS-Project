'use client';

interface Activity {
    id: string;
    action: string;
    metadata: any;
    createdAt: Date;
    user?: {
        name: string | null;
        image: string | null;
    } | null;
}

export function Timeline({ activities }: { activities: Activity[] }) {
    if (activities.length === 0) {
        return <div className="text-gray-400 text-sm py-4">No activity yet.</div>;
    }

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {activities.map((activity, activityIdx) => (
                    <li key={activity.id}>
                        <div className="relative pb-8">
                            {activityIdx !== activities.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                        {/* Icon based on action type */}
                                        {activity.action.includes('created') ? '✨' :
                                            activity.action.includes('status') ? '🔄' :
                                                activity.action.includes('call') ? '📞' : '📝'}
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium text-gray-900">{activity.user?.name || 'System'}</span>{' '}
                                            {formatActionText(activity.action)}
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                        <time dateTime={activity.createdAt.toString()}>
                                            {new Date(activity.createdAt).toLocaleDateString()}
                                        </time>
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

function formatActionText(action: string) {
    switch (action) {
        case 'lead.created': return 'created this lead';
        case 'lead.status_changed': return 'updated the status';
        case 'company.created': return 'created this company';
        case 'contact.created': return 'added this contact';
        default: return action.replace('.', ' ');
    }
}
