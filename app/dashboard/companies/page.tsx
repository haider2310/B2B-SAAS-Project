import { getCompanies } from "@/app/actions/crm";
import { CompanyList } from "@/components/crm/company-list";
import { AddCompanyButton } from "@/components/crm/add-company-button";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function CompaniesPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const companies = await getCompanies();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                    <p className="text-sm text-gray-500 mt-1">Directory of accounts and organizations.</p>
                </div>
                <AddCompanyButton />
            </div>

            <CompanyList companies={companies} />
        </div>
    );
}
