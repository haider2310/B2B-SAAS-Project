import { getCalls } from "@/app/actions/calls";
import { CallList } from "@/components/crm/call-list";
import { AddCallButton } from "@/components/crm/add-call-button";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function CallsPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const calls = await getCalls();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Call Logs</h1>
                    <p className="text-sm text-gray-500 mt-1">Track history of inbound and outbound calls.</p>
                </div>
                <AddCallButton />
            </div>

            <CallList initialCalls={calls} />
        </div>
    );
}
