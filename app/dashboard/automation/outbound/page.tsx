import { getOutboundSubscriptions } from "@/app/actions/outbound";
import { OutboundList } from "@/components/crm/outbound-list";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function OutboundAutomationPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const subscriptions = await getOutboundSubscriptions();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Outbound Automation</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Send real-time events to external systems (Slack, n8n, Zapier).
                </p>
            </div>

            <OutboundList initialSubscriptions={subscriptions} />
        </div>
    );
}
