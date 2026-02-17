'use server';

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { publishEvent } from "@/lib/event-bus";

// ============================================================
// DEALS
// ============================================================

export async function getDeals(filters: { search?: string } = {}) {
    const user = await requireAuth();

    const where: any = { tenantId: user.tenantId };

    if (filters.search) {
        where.title = { contains: filters.search };
    }

    const deals = await prisma.deal.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: { company: true, contact: true }
    });

    return deals;
}

export async function createDeal(data: { title: string; value: number; stage: string; companyId?: string }) {
    try {
        const user = await requireAuth();

        // Handle legacy/cached frontend value
        let stageValue = data.stage;
        if (stageValue === 'QUALIFIED') {
            stageValue = 'QUALIFICATION';
        }

        const deal = await prisma.deal.create({
            data: {
                tenantId: user.tenantId,
                createdById: user.id,
                title: data.title,
                value: data.value,
                stage: stageValue as any, // Cast to enum
                companyId: data.companyId,
                status: 'OPEN'
            }
        });

        await prisma.activityLog.create({
            data: {
                tenantId: user.tenantId,
                userId: user.id,
                action: 'deal.created',
                entityType: 'Deal',
                entityId: deal.id,
                metadata: { title: deal.title, value: deal.value }
            }
        });

        // Trigger Webhook
        try {
            await publishEvent(user.tenantId, 'deal.created', deal);
        } catch (e) {
            console.error("Webhook trigger failed", e);
        }

        revalidatePath('/dashboard/deals');
        return { success: true, deal };
    } catch (e: any) {
        console.error("createDeal Error:", e);
        return { success: false, error: e.message || "Internal Server Error" };
    }
}

export async function updateDealStage(id: string, stage: string) {
    const user = await requireAuth();

    const deal = await prisma.deal.update({
        where: { id, tenantId: user.tenantId },
        data: { stage: stage as any }
    });

    await prisma.activityLog.create({
        data: {
            tenantId: user.tenantId,
            userId: user.id,
            action: 'deal.stage_changed',
            entityType: 'Deal',
            entityId: deal.id,
            metadata: { newStage: stage }
        }
    });

    // Trigger Webhook
    await publishEvent(user.tenantId, 'deal.stage_changed', deal);

    revalidatePath('/dashboard/deals');
    return { success: true, deal };
}
