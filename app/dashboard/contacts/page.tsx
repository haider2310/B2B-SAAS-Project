import { getContacts } from "@/app/actions/crm";
import { ContactList } from "@/components/crm/contact-list";
import { AddContactButton } from "@/components/crm/add-contact-button";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function ContactsPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const contacts = await getContacts();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                    <p className="text-sm text-gray-500 mt-1">Individual people associated with your accounts.</p>
                </div>
                <AddContactButton />
            </div>

            <ContactList contacts={contacts} />
        </div>
    );
}
