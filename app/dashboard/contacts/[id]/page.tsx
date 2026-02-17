import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { EntityTimeline } from "@/components/crm/entity-timeline";
import { notFound } from "next/navigation";

type TimelineEvent = {
    id: string;
    type: 'CALL' | 'NOTE' | 'TASK' | 'ACTIVITY';
    title: string;
    description?: string | null;
    date: Date;
    user: { name: string | null; image: string | null };
};

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
    const user = await requireAuth();

    const contact = await prisma.contact.findUnique({
        where: { id: params.id, tenantId: user.tenantId },
        include: { company: true }
    });

    if (!contact) return notFound();

    const [calls, activities] = await Promise.all([
        prisma.call.findMany({
            where: { contactId: contact.id, tenantId: user.tenantId },
            include: { createdBy: true },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.activityLog.findMany({
            where: { entityId: contact.id, tenantId: user.tenantId },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    const timelineEvents: TimelineEvent[] = [
        ...calls.map(c => ({
            id: c.id,
            type: 'CALL' as const,
            title: `${c.type} Call`,
            description: c.notes,
            date: c.createdAt,
            user: { name: c.createdBy.name, image: c.createdBy.image }
        })),
        ...activities.map(a => ({
            id: a.id,
            type: 'ACTIVITY' as const,
            title: a.action,
            description: null,
            date: a.createdAt,
            user: { name: a.user?.name || 'System', image: a.user?.image || null }
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">{contact.firstName} {contact.lastName}</h1>
                <p className="text-sm text-gray-500">Contact • {contact.email}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4">Details</h3>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-gray-500">Company</dt>
                                <dd className="font-medium">{contact.company?.name || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Phone</dt>
                                <dd className="font-medium">{contact.phone || '-'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4">Timeline</h3>
                        <EntityTimeline events={timelineEvents} />
                    </div>
                </div>
            </div>
        </div>
    );
}
