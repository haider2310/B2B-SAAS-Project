'use server';

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { publishEvent } from "@/lib/event-bus";
import crypto from 'crypto';

export async function getOutboundSubscriptions() {
    const user = await requireAuth();
    return await prisma.outboundWebhookSubscription.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { outboundDeliveries: true } } }
    });
}

export async function createSubscription(data: { name: string; url: string; eventTypes: string[] }) {
    try {
        const user = await requireAuth();

        // Generate secret
        const secret = crypto.randomBytes(32).toString('hex');

        const sub = await prisma.outboundWebhookSubscription.create({
            data: {
                tenantId: user.tenantId,
                name: data.name,
                url: data.url,
                eventTypes: data.eventTypes,
                secretHash: secret,
                authType: 'HMAC',
                enabled: true
            }
        });

        revalidatePath('/dashboard/automation/outbound');
        return { success: true, sub };
    } catch (error) {
        console.error("Failed to create outbound subscription:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteSubscription(id: string) {
    const user = await requireAuth();
    await prisma.outboundWebhookSubscription.delete({
        where: { id, tenantId: user.tenantId }
    });
    revalidatePath('/dashboard/automation/outbound');
    return { success: true };
}

export async function triggerTestEvent(subscriptionId: string) {
    const user = await requireAuth();

    // publish a test event
    await publishEvent(user.tenantId, 'test.event', {
        message: 'This is a test webhook from AntiGravity B2B SaaS',
        timestamp: new Date().toISOString(),
        user: user.name
    });

    return { success: true };
}
