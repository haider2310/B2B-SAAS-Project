'use client';

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    company?: {
        name: string;
    } | null;
}

export function ContactList({ contacts }: { contacts: Contact[] }) {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                    <li key={contact.id}>
                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {contact.firstName[0]}{contact.lastName[0]}
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-indigo-600 truncate">{contact.firstName} {contact.lastName}</p>
                                    <p className="text-sm text-gray-500">
                                        {contact.email} {contact.phone && `• ${contact.phone}`}
                                    </p>
                                </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {contact.company?.name || 'No Company'}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
