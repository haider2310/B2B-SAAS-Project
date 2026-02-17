import { getDashboardStats } from "@/app/actions/analytics";
import { KPICards } from "@/components/analytics/kpi-cards";
import { PipelineChart } from "@/components/analytics/pipeline-chart";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function AnalyticsPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const stats = await getDashboardStats();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-500 mt-1">Real-time insights across your organization.</p>
            </div>

            <KPICards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <PipelineChart data={stats.dealsByStage} />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                        <button className="text-indigo-600 text-xs font-semibold hover:bg-indigo-50 px-2 py-1 rounded transition-colors">View All</button>
                    </div>
                    <div className="flow-root">
                        <ul className="-mb-8">
                            {stats.recentActivity.map((activity, idx) => (
                                <li key={activity.id} className="relative pb-8">
                                    {idx !== stats.recentActivity.length - 1 ? (
                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex space-x-3 group">
                                        <div>
                                            <span className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center ring-8 ring-white group-hover:ring-indigo-50 transition-all duration-300">
                                                <span className="text-sm">
                                                    {activity.action.includes('created') ? '✨' :
                                                        activity.action.includes('status') ? '🔄' :
                                                            activity.action.includes('won') ? '🏆' : '📝'}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    <span className="font-semibold text-gray-900">{activity.user}</span>{' '}
                                                    <span className="text-gray-600">{activity.action.replace('.', ' ')}</span>
                                                </p>
                                            </div>
                                            <div className="text-right text-xs text-gray-400 whitespace-nowrap font-mono">
                                                {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {stats.recentActivity.length === 0 && (
                                <li className="text-sm text-gray-500 italic text-center py-4">No recent activity.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}