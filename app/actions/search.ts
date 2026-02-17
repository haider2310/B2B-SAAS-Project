'use server';

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function searchGlobal(query: string) {
    if (!query || query.length < 2) return { results: [] };

    const user = await requireAuth();
    const tenantId = user.tenantId;

    const [leads, companies, deals, contacts] = await Promise.all([
        prisma.lead.findMany({
            where: { tenantId, OR: [{ name: { contains: query } }, { email: { contains: query } }, { company: { contains: query } }] },
            take: 3,
            select: { id: true, name: true, email: true }
        }),
        prisma.company.findMany({
            where: { tenantId, name: { contains: query } },
            take: 3,
            select: { id: true, name: true, industry: true }
        }),
        prisma.deal.findMany({
            where: { tenantId, title: { contains: query } },
            take: 3,
            select: { id: true, title: true, value: true }
        }),
        prisma.contact.findMany({
            where: { tenantId, OR: [{ firstName: { contains: query } }, { lastName: { contains: query } }, { email: { contains: query } }] },
            take: 3,
            select: { id: true, firstName: true, lastName: true }
        })
    ]);

    return {
        results: [
            ...leads.map(l => ({ type: 'Lead', id: l.id, title: l.name, subtitle: l.email, url: '/dashboard/leads' })),
            ...companies.map(c => ({ type: 'Company', id: c.id, title: c.name, subtitle: c.industry, url: '/dashboard/companies' })),
            ...deals.map(d => ({ type: 'Deal', id: d.id, title: d.title, subtitle: `$${d.value}`, url: '/dashboard/deals' })),
            ...contacts.map(c => ({ type: 'Contact', id: c.id, title: `${c.firstName} ${c.lastName}`, subtitle: '', url: '/dashboard/contacts' }))
        ]
    };
}
