'use server';

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function exportLeadsToCSV() {
    const user = await requireAuth();

    const leads = await prisma.lead.findMany({
        where: { tenantId: user.tenantId },
        include: { company: true }
    });

    if (!leads.length) return null;

    // CSV Header
    const header = "ID,Name,Email,Company,Status,Value,Created At\n";

    // CSV Rows
    const rows = leads.map(l => {
        return `"${l.id}","${l.name || ''}","${l.email || ''}","${l.company?.name || ''}","${l.status}","${l.value || 0}","${l.createdAt.toISOString()}"`;
    }).join("\n");

    return header + rows;
}
