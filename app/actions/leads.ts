'use server'
import { prisma } from '@/lib/prisma';

export async function getLeads() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }, // Nai leads upar aayengi
        });
        return leads;
    } catch (error) {
        console.error("Leads fetch karne mein masla aya:", error);
        return [];
    }
}
export async function updateLeadStatus(id: string, newStatus: string) {
    try {
        const updatedLead = await prisma.lead.update({
            where: { id },
            data: { status: newStatus as any },
        });
        return { success: true, updatedLead };
    } catch (error) {
        console.error("Status update error:", error);
        return { success: false };
    }
}