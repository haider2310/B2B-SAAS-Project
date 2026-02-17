'use server';

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function getCalls() {
    const user = await requireAuth();

    return await prisma.call.findMany({
        where: {
            tenantId: user.tenantId
        },
        include: {
            contact: true,
            deal: true,
            createdBy: {
                select: { name: true, image: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export async function createCall(data: {
    contactId?: string;
    dealId?: string;
    type: 'INBOUND' | 'OUTBOUND' | 'MISSED';
    duration?: number;
    notes?: string;
    scheduledAt?: Date;
}) {
    try {
        const user = await requireAuth();

        const call = await prisma.call.create({
            data: {
                tenantId: user.tenantId,
                createdById: user.id,
                contactId: data.contactId,
                dealId: data.dealId,
                type: data.type,
                duration: data.duration,
                notes: data.notes,
                scheduledAt: data.scheduledAt,
                completedAt: new Date() // Assuming logged calls are completed
            }
        });

        revalidatePath('/dashboard/calls');
        // Also revalidate potential entity pages
        if (data.contactId) revalidatePath(`/dashboard/contacts/${data.contactId}`);
        if (data.dealId) revalidatePath(`/dashboard/deals/${data.dealId}`);

        return { success: true, call };
    } catch (error: any) {
        console.error("Failed to create call:", error);
        return { success: false, error: error.message };
    }
}
