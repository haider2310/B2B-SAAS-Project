import { prisma } from "@/lib/prisma";
import { sendWebhook } from "./webhook-sender";

export async function publishEvent(tenantId: string, eventType: string, payload: any) {
    // 1. Find Subscriptions
    // We fetch subscriptions that INCLUDE this eventType in their JSON array
    // Prisma JSON filtering can be tricky with arrays, so we might fetch all valid ones and filter in JS for MVP
    // Or use raw query if performance needed. specific JSON path support varies by DB.
    // Let's assume low volume for now and filter in memory or use `array_contains` if using Postgres, but we are using SQLite for dev?
    // SQLite JSON support in Prisma is good.

    // For universal support, let's just fetch all enabled subscriptions for tenant and filter.
    const subscriptions = await prisma.outboundWebhookSubscription.findMany({
        where: { tenantId, enabled: true }
    });

    const matchedSubs = subscriptions.filter(sub => {
        const types = sub.eventTypes as string[];
        return types.includes(eventType) || types.includes('*');
    });

    if (matchedSubs.length === 0) return;

    console.log(`[EventBus] Publishing ${eventType} to ${matchedSubs.length} subscribers`);

    // 2. Process each subscription
    for (const sub of matchedSubs) {
        // Create Delivery Record
        const delivery = await prisma.outboundDelivery.create({
            data: {
                tenantId,
                outboundWebhookSubscriptionId: sub.id,
                eventType,
                payload,
                status: 'pending'
            }
        });

        // Fire and Forget (Async) - In production, this would go to a queue (BullMQ/Redis)
        // For this MVP, we just trigger logic immediately without awaiting to not block UI
        processDelivery(delivery.id, sub.url, sub.secretHash, payload).catch(err => {
            console.error(`[EventBus] Failed to process delivery ${delivery.id}`, err);
        });
    }
}

async function processDelivery(deliveryId: string, url: string, secret: string | null, payload: any) {
    const result = await sendWebhook(url, payload, secret);

    await prisma.outboundDelivery.update({
        where: { id: deliveryId },
        data: {
            status: result.success ? 'sent' : 'failed',
            lastResponseCode: result.status,
            lastError: result.error,
            attemptCount: { increment: 1 },
            lastAttemptAt: new Date()
        }
    });

    console.log(`[EventBus] Delivery ${deliveryId} ${result.success ? 'SUCCESS' : 'FAILED'} (${result.status})`);
}

export async function retryWebhookDeliveries() {
    // find failed/pending deliveries with < 3 attempts
    // created in last 24h to avoid infinite old retries
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const pendingDeliveries = await prisma.outboundDelivery.findMany({
        where: {
            status: { not: 'sent' },
            attemptCount: { lt: 3 },
            createdAt: { gte: oneDayAgo }
        },
        include: {
            subscription: true
        },
        take: 10 // batch size
    });

    if (pendingDeliveries.length === 0) {
        return { count: 0, message: 'No pending retries found' };
    }

    console.log(`[RetryWorker] Found ${pendingDeliveries.length} pending deliveries`);

    const results = await Promise.all(pendingDeliveries.map(async (delivery) => {
        try {
            const sub = delivery.subscription;
            // Retry logic reuse
            await processDelivery(delivery.id, sub.url, sub.secretHash, delivery.payload);
            return { id: delivery.id, status: 'processed' };
        } catch (error) {
            console.error(`[RetryWorker] Failed retry for ${delivery.id}`, error);
            return { id: delivery.id, status: 'error' };
        }
    }));

    return { count: results.length, details: results };
}
