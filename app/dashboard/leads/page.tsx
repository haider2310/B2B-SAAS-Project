import { getLeads } from "@/app/actions/crm";
import { LeadTable } from "@/components/crm/lead-table";
import { AddLeadButton } from "@/components/crm/add-lead-button";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function LeadsPage() {
    // Ensure auth and tenant context
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const leads = await getLeads();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and track your potential customers.</p>
                </div>
                <AddLeadButton />
            </div>

            <LeadTable initialLeads={leads} />
        </div>
    );
}