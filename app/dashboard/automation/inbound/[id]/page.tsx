import { getInboundEvents, getInboundEndpoints } from "@/app/actions/automation";
import { EventLogViewer } from "@/components/crm/event-log-viewer";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function EndpointDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const { id } = await params;

    const endpoint = await prisma.inboundEndpoint.findUnique({
        where: { id, tenantId: user.tenantId }
    });

    if (!endpoint) return <div>Endpoint not found</div>;

    const events = await getInboundEvents(id);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/dashboard/automation/inbound" className="text-indigo-600 hover:underline mb-2 block text-sm">
                        ← Back to Endpoints
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{endpoint.name}</h1>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block w-fit">
                        ID: {endpoint.id}
                    </code>
                </div>
                <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${endpoint.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {endpoint.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Event Logs</h2>
                <EventLogViewer initialEvents={events as any} />
            </div>
        </div>
    );
}
