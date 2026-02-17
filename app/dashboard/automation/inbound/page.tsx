import { getInboundEndpoints } from "@/app/actions/automation";
import { EndpointList } from "@/components/crm/endpoint-list";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function InboundAutomationPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const endpoints = await getInboundEndpoints();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Inbound Automation</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage webhooks to ingest data from n8n, Zapier, or custom scripts.
                </p>
            </div>

            <EndpointList initialEndpoints={endpoints} tenantSlug={user.tenant.slug} />
        </div>
    );
}
