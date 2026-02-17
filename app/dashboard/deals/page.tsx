import { getDeals } from "@/app/actions/deals";
import { KanbanBoard } from "@/components/crm/kanban-board";
import { AddDealButton } from "@/components/crm/add-deal-button";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function DealsPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const deals = await getDeals();

    return (
        <div className="p-8 h-screen flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your sales process.</p>
                </div>
                <AddDealButton />
            </div>

            <div className="flex-1 overflow-hidden">
                <KanbanBoard initialDeals={deals} />
            </div>
        </div>
    );
}
