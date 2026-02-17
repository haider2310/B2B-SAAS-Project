import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { EntityTimeline } from "@/components/crm/entity-timeline";
import { notFound } from "next/navigation";

// Define the correct type based on how we map it
type TimelineEvent = {
    id: string;
    type: 'CALL' | 'NOTE' | 'TASK' | 'ACTIVITY';
    title: string;
    description?: string | null;
    date: Date;
    user: { name: string | null; image: string | null };
};

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
    const user = await requireAuth();

    // 1. Fetch Lead
    const lead = await prisma.lead.findUnique({
        where: { id: params.id, tenantId: user.tenantId },
        include: { company: true, contact: true }
    });

    if (!lead) return notFound();

    // 2. Fetch Related Activity
    // In a real app, this would be a robust joined query or separate service
    const [activities] = await Promise.all([
        prisma.activityLog.findMany({
            where: { entityId: lead.id, tenantId: user.tenantId },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 20
        })
    ]);

    // 3. Transform to unified Timeline Events
    const timelineEvents: TimelineEvent[] = activities.map(a => ({
        id: a.id,
        type: 'ACTIVITY',
        title: `${a.user?.name || 'System'} ${a.action.replace('.', ' ')}`,
        description: JSON.stringify(a.metadata),
        date: a.createdAt,
        user: { name: a.user?.name || 'System', image: a.user?.image || null }
    }));

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                <p className="text-sm text-gray-500">Lead • {lead.email}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4">Details</h3>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-gray-500">Company</dt>
                                <dd className="font-medium">{lead.company?.name || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Status</dt>
                                <dd className="font-medium">{lead.status}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Value</dt>
                                <dd className="font-medium">${lead.value || 0}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4">Timeline</h3>
                        <EntityTimeline events={timelineEvents} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Add Notes/Calls actions here later */}
                </div>
            </div>
        </div>
    );
}
