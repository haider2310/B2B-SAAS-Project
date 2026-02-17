'use client';

interface Company {
    id: string;
    name: string;
    industry: string | null;
    website: string | null;
    _count: {
        contacts: number;
        deals: number;
    }
}

export function CompanyList({ companies }: { companies: Company[] }) {
    if (companies.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-lg border border-dashed border-gray-300">
                <h3 className="text-lg font-medium text-gray-900">No companies yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new company.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
                <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                            {company.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {company.industry || 'Unknown Industry'}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">{company.name}</h3>
                    <a href={company.website || '#'} target="_blank" className="text-sm text-indigo-500 hover:underline mb-4 block">
                        {company.website || 'No website'}
                    </a>

                    <div className="flex gap-4 border-t pt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <span>👥</span> {company._count.contacts} Contacts
                        </div>
                        <div className="flex items-center gap-1">
                            <span>💼</span> {company._count.deals} Deals
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
