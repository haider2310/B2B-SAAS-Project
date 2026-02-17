import { getTickets } from "@/app/actions/support";
import { TicketList } from "@/components/support/ticket-list";
import { AddTicketButton } from "@/components/support/add-ticket-button";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function SupportPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const tickets = await getTickets();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage customer inquiries and issues.</p>
                </div>
                <AddTicketButton />
            </div>

            <TicketList initialTickets={tickets} />
        </div>
    );
}
